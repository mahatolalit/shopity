# Shopify Announcement App

## Project Overview

This project is a complete Shopify application that enables store administrators to configure a global storefront announcement banner. The system manages data flow from the Shopify Admin interface to a MongoDB database for audit tracking, synchronizes with the Shopify API, and ultimately renders on the storefront.

The application architecture includes:
- **Admin Dashboard (Frontend):** Built using React and Shopify Polaris. It provides a simple, native-feeling user interface within the Shopify Admin for merchants to enter their announcement text.
- **Backend & Database:** Powered by Node.js and Express. When an announcement is saved, the backend stores the record in a MongoDB database (to maintain an audit history) and subsequently updates a Shop Metafield (`my_app.announcement`) via the Shopify Admin GraphQL API.
- **Storefront Display:** Utilizes a Theme App Extension (App Embed Block). The Liquid code seamlessly reads from `shop.metafields.my_app.announcement` to dynamically inject the floating announcement banner across all pages without modifying the merchant's theme code directly.

## Technical Stack

- MongoDB
- Express.js
- React.js (with Shopify Polaris)
- Node.js
- Shopify Admin API (GraphQL)
- Shopify Theme App Extensions (Liquid)

## Setup and Installation

This application uses a decoupled architecture for production deployment: the React frontend is hosted on Vercel, and the Node/Express backend is hosted on Render.

### Prerequisites
- Node.js installed on your system.
- MongoDB running locally or accessible via a cloud URI.
- A Shopify Partner Account & Development Store.

### Running Locally
To test the app locally using a Cloudflare tunnel:
1. `npm install`
2. Configure `.env` with your `SHOPIFY_API_KEY`, `SHOPIFY_API_SECRET`, `SCOPES=write_products`, and `MONGODB_URI`.
3. Run `npm run dev` and follow the CLI prompts.

### Production Deployment (Decoupled)

**1. Backend (Render)**
- Connect the repository to Render as a Web Service.
- Set Root Directory to `web`.
- Build Command: `npm install`
- Start Command: `npm run serve`
- Environment Variables required: `SHOPIFY_API_KEY`, `SHOPIFY_API_SECRET`, `SCOPES`, `MONGODB_URI`, `HOST` (your Render URL), and `FRONTEND_URL` (your Vercel URL).

**2. Frontend (Vercel)**
- Connect the repository to Vercel.
- Set Root Directory to `web/frontend`.
- Environment Variables required: `SHOPIFY_API_KEY` and `VITE_BACKEND_URL` (your Render URL).
- Deploy. The configured `vercel.json` will automatically reverse-proxy API calls back to Render to bypass iframe origin blocks.

**3. Shopify Config**
Ensure your `shopify.app.toml` is synced by running `npm run deploy`:
- `application_url`: Vercel URL
- `redirect_urls`: Render URL + `/api/auth/callback`

## Activating the Banner (No-Code Storefront Setup)

Once the app is installed on the store, merchants must enable the extension within their theme settings to make the banner visible.

1. Navigate to the Shopify Admin panel.
2. Go to **Online Store** > **Themes**.
3. Click the **Customize** button on the current active theme.
4. On the left-hand sidebar of the Theme Editor, click the **App embeds** icon (the third icon down, resembling overlapping squares).
5. Locate the app embed block provided by this application (e.g., "Announcement Banner").
6. Toggle the switch to **Enable** the app embed.
7. Click **Save** in the top right corner of the editor.

After activating the embed, merchants can open the app from their Shopify Admin dashboard, enter their desired announcement text, and click **Save**. The changes will reflect immediately on the storefront.

## Resources and Documentation Used

The following official documentation guided the development of this project:
- [Scaffolding a Shopify App](https://shopify.dev/docs/apps/build/scaffold-app)
- [Shopify Node API - Metafields (GraphQL Mutation)](https://shopify.dev/docs/api/admin-graphql/latest/mutations/metafieldsSet)
- [App Embed Blocks Guide](https://shopify.dev/docs/apps/online-store/theme-app-extensions/extensions-framework#app-embed-blocks)
- [Accessing Metafields in Liquid](https://shopify.dev/docs/api/liquid/objects/metafield)
