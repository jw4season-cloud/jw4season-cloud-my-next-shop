import { getProducts, type Product } from "../../lib/shopify";
import Image from "next/image";

export default async function ProductsPage() {
  const products: Product[] = await getProducts();

  return (
    <main style={{ maxWidth: 1200, margin: "0 auto", padding: 24 }}>
      <h1>Produkter fra Shopify</h1>
      {products.length === 0 && <p>Fant ingen produkter.</p>}

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))",
          gap: 20,
        }}
      >
        {products.map((p) => {
          const img = p.images?.edges?.[0]?.node;
          const price = p.variants?.edges?.[0]?.node?.price?.amount;
          return (
            <article
              key={p.id}
              style={{
                border: "1px solid #e5e5e5",
                borderRadius: 12,
                padding: 12,
                textAlign: "center",
              }}
            >
              {img && (
                <Image
                  src={img.url}
                  alt={img.altText || p.title}
                  width={300}
                  height={300}
                />
              )}
              <h2>{p.title}</h2>
              {price && <p style={{ fontWeight: "bold" }}>{price} kr</p>}
            </article>
          );
        })}
      </div>
    </main>
  );
}
