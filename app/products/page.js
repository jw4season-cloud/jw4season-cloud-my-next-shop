// app/products/page.js
export const metadata = { title: "Products — My Next Shop" };

export default function ProductsPage() {
  const products = [{ id: "1", title: "Sample Product A" }, { id: "2", title: "Sample Product B" }];
  return (
    <main style={{padding:"2rem"}}>
      <h1>Products</h1>
      <ul>{products.map(p => <li key={p.id}>{p.title}</li>)}</ul>
    </main>
  );
}
