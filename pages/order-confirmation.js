import { useRouter } from "next/router";
import Link from "next/link";

export default function OrderConfirmation() {
  const router = useRouter();
  const { orderId } = router.query;

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
        <div className="card" style={{ textAlign: "center", padding: 40 }} data-testid="confirmation">
          <div style={{ fontSize: 48, marginBottom: 16 }}>&#10003;</div>
          <h2>Order Confirmed!</h2>
          <p style={{ marginTop: 12, fontSize: "1.125rem" }}>
            Your order <strong data-testid="order-id">{orderId}</strong> has been placed successfully.
          </p>
          <div style={{ marginTop: 24, display: "flex", gap: 12, justifyContent: "center" }}>
            <Link href="/orders" className="btn" data-testid="view-orders">View Orders</Link>
            <Link href="/" className="btn" style={{ background: "#6c757d" }} data-testid="continue-shopping">Continue Shopping</Link>
          </div>
        </div>
      </div>
    </>
  );
}
