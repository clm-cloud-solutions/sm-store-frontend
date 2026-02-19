import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import { api } from "../../lib/api";

export default function ProductDetail() {
  const router = useRouter();
  const { id } = router.query;
  const [product, setProduct] = useState(null);
  const [qty, setQty] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [added, setAdded] = useState(false);

  useEffect(() => {
    if (!id) return;
    api.getProduct(id)
      .then(res => setProduct(res.data))
      .catch(err => setError(err.message))
      .finally(() => setLoading(false));
  }, [id]);

  const addToCart = () => {
    const cart = JSON.parse(localStorage.getItem("cart") || "[]");
    const existing = cart.find(i => i.productId === product.id);
    if (existing) {
      existing.qty += qty;
    } else {
      cart.push({ productId: product.id, name: product.name, price: product.price, qty });
    }
    localStorage.setItem("cart", JSON.stringify(cart));
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

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
        <Link href="/">&larr; Back to catalog</Link>
        {loading && <div className="loading" data-testid="loading">Loading product...</div>}
        {error && <div className="alert alert-error" data-testid="error">{error}</div>}
        {product && (
          <div className="card" style={{ marginTop: 16 }} data-testid="product-detail">
            <h2>{product.name}</h2>
            <p style={{ marginBottom: 12 }}>{product.description}</p>
            <span className="badge">{product.category}</span>
            <div style={{ marginTop: 12 }}>
              <span className="price" data-testid="product-price">${product.price.toFixed(2)}</span>
              <span style={{ marginLeft: 12, color: product.stock > 0 ? "#28a745" : "#dc3545" }} data-testid="stock-status">
                {product.stock > 0 ? `${product.stock} in stock` : "Out of stock"}
              </span>
            </div>
            <div style={{ marginTop: 16, display: "flex", gap: 12, alignItems: "center" }}>
              <label htmlFor="qty">Qty:</label>
              <input
                id="qty"
                type="number"
                min="1"
                max={product.stock}
                value={qty}
                onChange={e => setQty(Math.max(1, parseInt(e.target.value) || 1))}
                style={{ width: 80 }}
                data-testid="qty-input"
              />
              <button
                className="btn"
                onClick={addToCart}
                disabled={product.stock === 0}
                data-testid="add-to-cart"
              >
                Add to Cart
              </button>
            </div>
            {added && <div className="alert alert-success" style={{ marginTop: 12 }} data-testid="added-msg">Added to cart!</div>}
          </div>
        )}
      </div>
    </>
  );
}
