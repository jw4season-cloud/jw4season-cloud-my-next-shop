import { GraphQLClient, gql } from "graphql-request";

const SHOPIFY_STORE_DOMAIN = process.env.SHOPIFY_STORE_DOMAIN!;
const SHOPIFY_STOREFRONT_TOKEN =
  process.env.SHOPIFY_STOREFRONT_TOKEN || process.env.SHOPIFY_STOREFRONT_ACCESS_TOKEN;

if (!SHOPIFY_STORE_DOMAIN || !SHOPIFY_STOREFRONT_TOKEN) {
  throw new Error("Missing SHOPIFY_STORE_DOMAIN or SHOPIFY_STOREFRONT_TOKEN env vars");
}

const endpoint = `https://${SHOPIFY_STORE_DOMAIN}/api/2024-07/graphql.json`;

const client = new GraphQLClient(endpoint, {
  headers: {
    "X-Shopify-Storefront-Access-Token": SHOPIFY_STOREFRONT_TOKEN,
    "Content-Type": "application/json",
  },
});

export type Product = {
  id: string;
  title: string;
  images?: { edges: { node: { url: string; altText: string | null } }[] };
  variants?: { edges: { node: { price?: { amount: string } } }[] };
};

export async function getProducts(limit: number = 12): Promise<Product[]> {
  const query = gql`
    query Products($limit: Int!) {
      products(first: $limit) {
        edges {
          node {
            id
            title
            images(first: 1) {
              edges { node { url: transformedSrc, altText } }
            }
            variants(first: 1) {
              edges { node { price: priceV2 { amount } } }
            }
          }
        }
      }
    }
  `;
  const data = await client.request(query, { limit });
  return (data.products?.edges ?? []).map((e: any) => e.node) as Product[];
}