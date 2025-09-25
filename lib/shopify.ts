import { GraphQLClient } from "graphql-request";

const endpoint = `https://${process.env.SHOPIFY_STORE_DOMAIN}/api/2023-07/graphql.json`;

const client = new GraphQLClient(endpoint, {
  headers: {
    "X-Shopify-Storefront-Access-Token": process.env.SHOPIFY_STOREFRONT_ACCESS_TOKEN!,
  },
});

export async function getProducts() {
  const query = `
    {
      products(first: 12) {
        edges {
          node {
            id
            title
            handle
            images(first: 1) { edges { node { url altText } } }
            variants(first: 1) { edges { node { price { amount } } } }
          }
        }
      }
    }
  `;
  const res = await client.request(query);
  return res.products.edges.map((e: any) => e.node);
}
