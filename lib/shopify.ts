// lib/shopify.ts
import { GraphQLClient, gql } from "graphql-request";

const endpoint = `https://${process.env.SHOPIFY_STORE_DOMAIN}/api/2023-07/graphql.json`;

const client = new GraphQLClient(endpoint, {
  headers: {
    "X-Shopify-Storefront-Access-Token": process.env.SHOPIFY_STOREFRONT_ACCESS_TOKEN!,
  },
});

// Henter ALLE produkter ved å loope over sider (cursor pagination)
export async function getAllProducts(limitPerPage = 50) {
  const query = gql`
    query GetProducts($first: Int!, $after: String) {
      products(first: $first, after: $after) {
        pageInfo {
          hasNextPage
          endCursor
        }
        edges {
          node {
            id
            title
            handle
            description
            images(first: 1) { edges { node { url altText } } }
            variants(first: 1) { edges { node { price { amount currencyCode } } } }
          }
        }
      }
    }
  `;

  let after: string | null = null;
  let hasNextPage = true;
  const items: any[] = [];

  while (hasNextPage) {
    const data = await client.request(query, { first: limitPerPage, after });
    const { edges, pageInfo } = data.products;
    items.push(...edges.map((e: any) => e.node));
    hasNextPage = pageInfo?.hasNextPage;
    after = pageInfo?.endCursor ?? null;
  }

  return items;
}

// Behold denne hvis /products-siden din allerede kaller getProducts()
export async function getProducts() {
  // Om du vil begrense i UI kan du slice: (await getAllProducts()).slice(0, 50)
  return getAllProducts(50);
}
