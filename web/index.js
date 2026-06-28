import { join } from "path";
import { readFileSync } from "fs";
import express from "express";
import serveStatic from "serve-static";

import shopify from "./shopify.js";
import productCreator from "./product-creator.js";
import PrivacyWebhookHandlers from "./privacy.js";
import mongoose from "mongoose";
import Announcement from "./models/Announcements.js";

mongoose
  .connect(process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/shopify-app")
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.error("MongoDB connection error:", err));

const PORT = parseInt(
  process.env.BACKEND_PORT || process.env.PORT || "3000",
  10,
);

const STATIC_PATH =
  process.env.NODE_ENV === "production"
    ? join(process.cwd(), process.env.VERCEL ? "web/frontend/dist" : "frontend/dist")
    : join(process.cwd(), process.env.VERCEL ? "web/frontend" : "frontend");

const app = express();

// Set up Shopify authentication and webhook handling
app.get(shopify.config.auth.path, shopify.auth.begin());
app.get(
  shopify.config.auth.callbackPath,
  shopify.auth.callback(),
  shopify.redirectToShopifyOrAppRoot(),
);
app.post(
  shopify.config.webhooks.path,
  shopify.processWebhooks({ webhookHandlers: PrivacyWebhookHandlers }),
);

app.use(express.json());
app.use("/api/*", shopify.validateAuthenticatedSession());

app.post("/api/announcement", async (req, res) => {
  try {
    const { announcementText } = req.body;

    const session = res.locals.shopify.session;

    // Save to MongoDB
    const newAnnouncement = new Announcement({
      shop: session.shop,
      announcementText: announcementText,
    });
    await newAnnouncement.save();

    // Sync to Shopify Metafields
    const graphqlClient = new shopify.api.clients.Graphql({ session });

    // Get Shop ID
    const shopRes = await graphqlClient.query({
      data: `{ shop { id } }`,
    });
    const shopId = shopRes.body.data.shop.id;

    // Upsert Metafield via GraphQL
    const mutation = `
      mutation metafieldsSet($metafields: [MetafieldsSetInput!]!) {
        metafieldsSet(metafields: $metafields) {
          metafields {
            key
            value
          }
          userErrors {
            field
            message
          }
        }
      }
    `;
    const variables = {
      metafields: [
        {
          ownerId: shopId,
          namespace: "my_app",
          key: "announcement",
          type: "single_line_text_field",
          value: announcementText,
        },
      ],
    };

    const response = await graphqlClient.query({
      data: { query: mutation, variables },
    });

    if (response.body.data.metafieldsSet.userErrors.length > 0) {
      throw new Error(response.body.data.metafieldsSet.userErrors[0].message);
    }

    res.status(200).send({
      success: true,
      message: "Successfully saved to Database and Shopify!",
    });
  } catch (error) {
    console.error("Error saving announcement:", error);
    res.status(500).send({ success: false, error: error.message });
  }
});

app.get("/api/products/count", async (_req, res) => {
  const client = new shopify.api.clients.Graphql({
    session: res.locals.shopify.session,
  });

  const countData = await client.request(`
    query shopifyProductCount {
      productsCount {
        count
      }
    }
  `);

  res.status(200).send({ count: countData.data.productsCount.count });
});

app.post("/api/products", async (_req, res) => {
  let status = 200;
  let error = null;

  try {
    await productCreator(res.locals.shopify.session);
  } catch (e) {
    console.log(`Failed to process products/create: ${e.message}`);
    status = 500;
    error = e.message;
  }
  res.status(status).send({ success: status === 200, error });
});

app.use(shopify.cspHeaders());
app.use(serveStatic(STATIC_PATH, { index: false }));

app.use("/*", shopify.ensureInstalledOnShop(), async (_req, res, _next) => {
  return res
    .status(200)
    .set("Content-Type", "text/html")
    .send(
      readFileSync(join(STATIC_PATH, "index.html"))
        .toString()
        .replace("%VITE_SHOPIFY_API_KEY%", process.env.SHOPIFY_API_KEY || ""),
    );
});

if (!process.env.VERCEL) {
  app.listen(PORT, () => {
    console.log(`Backend running on port ${PORT}`);
  });
}

export default app;
