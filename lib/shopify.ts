// lib/shopify.ts
import { GraphQLClient, gql } from "graphql-request";

const endpoint = `https://${process.env.SHOPIFY_STORE_DOMAIN}/api/2023-07/graphql.json`;

const client = new GraphQLClient(endpoint, {
  headers: {
    "X-Shopify-Storefront-Access-Token":
      process.env.SHOPIFY_STOREFRONT_ACCESS_TOKEN!,
  },
});

// Typer
type Money = { amount: string; currencyCode?: string };
type ImageNode = { url: string; altText?: string | null };
type VariantEdge = { node: { price: Money } };
export type Product = {
  id: string;
  title: string;
  handle: string;
  description?: string | null;
  images: { edges: { node: ImageNode }[] };
  variants: { edges: VariantEdge[] };
};

type ProductsResponse = {
  products: {
    pageInfo: { hasNextPage: boolean; endCursor: string | null };
    edges: { node: Product }[];
  };
};

// Henter ALLE produkter via cursor-paginering
export async function getAllProducts(limitPerPage = 50): Promise<Product[]> {
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
            images(first: 1) {
              edges {
                node {
                  url
                  altText
                }
              }
            }
            variants(first: 1) {
              edges {
                node {
                  price {
                    amount
                    currencyCode
                  }
                }
              }
            }
          }
        }
      }
    }
  `;

  let after: string | null = null;
  let hasNextPage = true;
  const items: Product[] = [];

  while (hasNextPage) {
    const data = (await client.request(query, {
      first: limitPerPage,
      after,
    })) as ProductsResponse;

    const { edges, pageInfo } = data.products;
    items.push(...edges.map((e) => e.node));
    hasNextPage = pageInfo.hasNextPage;
    after = pageInfo.endCursor;
  }

  return items;
}

// Behold samme navn som siden bruker
export async function getProducts(): Promise<Product[]> {
  return getAllProducts(50);
}
