import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/router";

export default function Cart() {
  const router = useRouter();
  const [cart, setCart] = useState([]);

  useEffect(() => {
    setCart(JSON.parse(localStorage.getItem("cart") || "[]"));
  }, []);

  const updateQty = (idx, qty) => {
    const updated = [...cart];
    updated[idx].qty = Math.max(1, qty);
    setCart(updated);
    localStorage.setItem("cart", JSON.stringify(updated));
  };

  const removeItem = (idx) => {
    const updated = cart.filter((_, i) => i !== idx);
    setCart(updated);
    localStorage.setItem("cart", JSON.stringify(updated));
  };

  const total = cart.reduce((s, i) => s + i.price * i.qty, 0);

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
        <h2>Shopping Cart</h2>
        {cart.length === 0 ? (
          <div className="card" data-testid="empty-cart">
            <p>Your cart is empty.</p>
            <Link href="/" className="btn" style={{ marginTop: 12, display: "inline-block" }}>Browse Products</Link>
          </div>
        ) : (
          <>
            <table data-testid="cart-table">
              <thead>
                <tr><th>Product</th><th>Price</th><th>Qty</th><th>Subtotal</th><th></th></tr>
              </thead>
              <tbody>
                {cart.map((item, idx) => (
                  <tr key={idx} data-testid={`cart-item-${idx}`}>
                    <td>{item.name}</td>
                    <td>${item.price.toFixed(2)}</td>
                    <td>
                      <input
                        type="number"
                        min="1"
                        value={item.qty}
                        onChange={e => updateQty(idx, parseInt(e.target.value) || 1)}
                        style={{ width: 60 }}
                        data-testid={`qty-${idx}`}
                      />
                    </td>
                    <td className="price">${(item.price * item.qty).toFixed(2)}</td>
                    <td>
                      <button className="btn btn-danger" onClick={() => removeItem(idx)} data-testid={`remove-${idx}`}>
                        Remove
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div className="summary" style={{ marginTop: 16, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <span style={{ fontSize: "1.25rem" }}>Total: <strong className="price" data-testid="cart-total">${total.toFixed(2)}</strong></span>
              <button className="btn btn-success" onClick={() => router.push("/checkout")} data-testid="proceed-checkout">
                Proceed to Checkout
              </button>
            </div>
          </>
        )}
      </div>
    </>
  );
}
