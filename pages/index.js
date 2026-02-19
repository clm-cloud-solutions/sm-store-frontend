import { useState, useEffect } from "react";
import Link from "next/link";
import { api } from "../lib/api";

export default function Home() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    api.getProducts()
      .then(res => setProducts(res.data))
      .catch(err => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  return (
    <>
      <header>
        <div className="container">
          <h1>UptimeBolt Store</h1>
          <nav>
            <Link href="/">Products</Link>
            <Link href="/cart">Cart</Link>
            <Link href="/orders">Orders</Link>
          </nav>
        </div>
      </header>
      <div className="container">
        <h2>Product Catalog</h2>
        {loading && <div className="loading" data-testid="loading">Loading products...</div>}
        {error && <div className="alert alert-error" data-testid="error">{error}</div>}
        <div className="grid" data-testid="product-grid">
          {products.map(p => (
            <div className="card" key={p.id} data-testid={`product-${p.id}`}>
              <h3>{p.name}</h3>
              <p>{p.description}</p>
              <span className="badge">{p.category}</span>
              <div style={{ marginTop: 8 }}>
                <span className="price">${p.price.toFixed(2)}</span>
              </div>
              <div style={{ marginTop: 8, display: "flex", gap: 8 }}>
                <Link href={`/product/${p.id}`} className="btn" data-testid={`view-${p.id}`}>
                  View Details
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
