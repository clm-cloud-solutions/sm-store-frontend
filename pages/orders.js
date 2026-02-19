import { useState, useEffect } from "react";
import Link from "next/link";

export default function Orders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // For demo, use hardcoded userId — in prod this would come from session
    import("../lib/api").then(({ api }) => {
      api.getOrders("user-1")
        .then(res => setOrders(res.data || []))
        .catch(() => setOrders([]))
        .finally(() => setLoading(false));
    });
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
        <h2>Order History</h2>
        {loading && <div className="loading" data-testid="loading">Loading orders...</div>}
        {!loading && orders.length === 0 && (
          <div className="card" data-testid="no-orders">
            <p>No orders yet.</p>
            <Link href="/" className="btn" style={{ marginTop: 12, display: "inline-block" }}>Start Shopping</Link>
          </div>
        )}
        {orders.length > 0 && (
          <table data-testid="orders-table">
            <thead>
              <tr><th>Order ID</th><th>Items</th><th>Total</th><th>Status</th><th>Date</th></tr>
            </thead>
            <tbody>
              {orders.map(order => (
                <tr key={order.id} data-testid={`order-${order.id}`}>
                  <td>{order.id}</td>
                  <td>{order.items.length} items</td>
                  <td className="price">${order.total.toFixed(2)}</td>
                  <td><span className="badge">{order.status}</span></td>
                  <td>{new Date(order.createdAt).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </>
  );
}
