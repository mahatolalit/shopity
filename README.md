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

## Setup and Installation (Code)

### Prerequisites

- Node.js installed on your system.
- MongoDB running locally or accessible via a cloud URI.
- A Shopify Partner Account.
- A Shopify Development Store for testing.

### Steps to Run Locally

1. **Install Dependencies:**
   Navigate into the project directory and install the necessary packages.
   ```bash
   npm install
   ```

2. **Configure Environment Variables:**
   Ensure your environment includes the `MONGODB_URI` pointing to your MongoDB instance (defaults to `mongodb://127.0.0.1:27017/shopify-app` if not provided).

3. **Start the Application:**
   Run the development server using the Shopify CLI.
   ```bash
   npm run dev
   ```
   Follow the interactive CLI prompts to link your app to your Partner account and install it on your development store.

4. **Deploy the Extension:**
   Ensure the Theme App Extension is pushed to your Shopify app infrastructure.
   ```bash
   npm run deploy
   ```

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
