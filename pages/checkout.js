import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import { api } from "../lib/api";

export default function Checkout() {
  const router = useRouter();
  const [step, setStep] = useState(1); // 1=login, 2=shipping, 3=review, 4=processing
  const [cart, setCart] = useState([]);
  const [user, setUser] = useState(null);
  const [email, setEmail] = useState("demo@uptimebolt.com");
  const [password, setPassword] = useState("demo123");
  const [shipping, setShipping] = useState({ name: "", address: "", city: "", zip: "", country: "US" });
  const [validation, setValidation] = useState(null);
  const [error, setError] = useState(null);
  const [processing, setProcessing] = useState(false);

  useEffect(() => {
    const c = JSON.parse(localStorage.getItem("cart") || "[]");
    if (c.length === 0) {
      router.push("/cart");
      return;
    }
    setCart(c);
  }, []);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError(null);
    try {
      const res = await api.login(email, password);
      setUser(res.data);
      setShipping(prev => ({ ...prev, name: res.data.name }));
      setStep(2);
    } catch (err) {
      setError(err.message);
    }
  };

  const handleShipping = async (e) => {
    e.preventDefault();
    setError(null);
    if (!shipping.name || !shipping.address || !shipping.city) {
      setError("Please fill in all required shipping fields");
      return;
    }
    try {
      const items = cart.map(i => ({ productId: i.productId, qty: i.qty }));
      const res = await api.validateCart(items);
      setValidation(res.data);
      if (res.data.errors && res.data.errors.length > 0) {
        setError(`Some items have issues: ${res.data.errors.map(e => e.error).join(", ")}`);
      }
      setStep(3);
    } catch (err) {
      setError(err.message);
    }
  };

  const handlePlaceOrder = async () => {
    setError(null);
    setProcessing(true);
    setStep(4);
    try {
      const items = cart.map(i => ({ productId: i.productId, qty: i.qty }));
      const res = await api.checkout(user.id, items, shipping);
      localStorage.removeItem("cart");
      router.push(`/order-confirmation?orderId=${res.data.orderId}`);
    } catch (err) {
      setError(err.message);
      setProcessing(false);
      setStep(3);
    }
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
        <h2>Checkout</h2>
        <div className="steps" data-testid="checkout-steps">
          <span className={`step ${step >= 1 ? (step > 1 ? "done" : "active") : ""}`}>1. Login</span>
          <span className={`step ${step >= 2 ? (step > 2 ? "done" : "active") : ""}`}>2. Shipping</span>
          <span className={`step ${step >= 3 ? (step > 3 ? "done" : "active") : ""}`}>3. Review</span>
          <span className={`step ${step >= 4 ? "active" : ""}`}>4. Confirm</span>
        </div>

        {error && <div className="alert alert-error" data-testid="checkout-error">{error}</div>}

        {/* Step 1: Login */}
        {step === 1 && (
          <form onSubmit={handleLogin} className="card" data-testid="login-form">
            <h3 style={{ marginBottom: 16 }}>Sign in to continue</h3>
            <div className="form-group">
              <label htmlFor="email">Email</label>
              <input id="email" type="email" value={email} onChange={e => setEmail(e.target.value)} required data-testid="email-input" />
            </div>
            <div className="form-group">
              <label htmlFor="password">Password</label>
              <input id="password" type="password" value={password} onChange={e => setPassword(e.target.value)} required data-testid="password-input" />
            </div>
            <button type="submit" className="btn" data-testid="login-btn">Sign In & Continue</button>
          </form>
        )}

        {/* Step 2: Shipping */}
        {step === 2 && (
          <form onSubmit={handleShipping} className="card" data-testid="shipping-form">
            <h3 style={{ marginBottom: 16 }}>Shipping Information</h3>
            <div className="form-group">
              <label htmlFor="ship-name">Full Name *</label>
              <input id="ship-name" value={shipping.name} onChange={e => setShipping({...shipping, name: e.target.value})} required data-testid="ship-name" />
            </div>
            <div className="form-group">
              <label htmlFor="ship-address">Address *</label>
              <input id="ship-address" value={shipping.address} onChange={e => setShipping({...shipping, address: e.target.value})} required data-testid="ship-address" />
            </div>
            <div className="form-group">
              <label htmlFor="ship-city">City *</label>
              <input id="ship-city" value={shipping.city} onChange={e => setShipping({...shipping, city: e.target.value})} required data-testid="ship-city" />
            </div>
            <div className="form-group">
              <label htmlFor="ship-zip">ZIP Code</label>
              <input id="ship-zip" value={shipping.zip} onChange={e => setShipping({...shipping, zip: e.target.value})} data-testid="ship-zip" />
            </div>
            <button type="submit" className="btn" data-testid="continue-review">Continue to Review</button>
          </form>
        )}

        {/* Step 3: Review */}
        {step === 3 && validation && (
          <div data-testid="review-step">
            <div className="card" style={{ marginBottom: 16 }}>
              <h3 style={{ marginBottom: 12 }}>Order Summary</h3>
              <table>
                <thead><tr><th>Product</th><th>Qty</th><th>Price</th></tr></thead>
                <tbody>
                  {validation.items.map((item, i) => (
                    <tr key={i}>
                      <td>{item.name}</td>
                      <td>{item.qty}</td>
                      <td className="price">${item.subtotal.toFixed(2)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <div style={{ marginTop: 12, textAlign: "right" }}>
                <strong>Total: <span className="price" data-testid="order-total">${validation.total.toFixed(2)}</span></strong>
              </div>
            </div>
            <div className="card" style={{ marginBottom: 16 }}>
              <h3 style={{ marginBottom: 8 }}>Shipping to</h3>
              <p data-testid="ship-summary">{shipping.name}, {shipping.address}, {shipping.city} {shipping.zip}</p>
            </div>
            <button className="btn btn-success" onClick={handlePlaceOrder} data-testid="place-order">
              Place Order
            </button>
          </div>
        )}

        {/* Step 4: Processing */}
        {step === 4 && (
          <div className="card" data-testid="processing">
            <div className="loading">Processing your order...</div>
          </div>
        )}
      </div>
    </>
  );
}
