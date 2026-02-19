// Playwright Synthetic Monitor — E2E Checkout Flow
// Tests the full purchase chain: Frontend → Backend → DB
//
// Usage in UptimeBolt: Create a Synthetic (Playwright) monitor
// and paste this script. Set BASE_URL to the frontend URL.

const BASE_URL = "{{url}}"; // UptimeBolt replaces this with the monitor URL

async function run(page) {
  // ──────────────────────────────────────────────
  // Step 1: Load product catalog
  // ──────────────────────────────────────────────
  await page.goto(BASE_URL);
  await page.waitForSelector('[data-testid="product-grid"]', { timeout: 10000 });

  // Verify products loaded (at least one product card visible)
  const productCount = await page.locator('[data-testid^="product-prod-"]').count();
  if (productCount === 0) throw new Error("No products loaded in catalog");

  // ──────────────────────────────────────────────
  // Step 2: Select first product and add to cart
  // ──────────────────────────────────────────────
  await page.click('[data-testid="view-prod-1"]');
  await page.waitForSelector('[data-testid="product-detail"]', { timeout: 10000 });

  // Verify product detail loaded with price and stock
  const price = await page.textContent('[data-testid="product-price"]');
  if (!price || !price.includes("$")) throw new Error("Product price not displayed");

  const stockText = await page.textContent('[data-testid="stock-status"]');
  if (!stockText || stockText.includes("Out of stock")) throw new Error("Product out of stock");

  // Set quantity to 1 and add to cart
  await page.fill('[data-testid="qty-input"]', "1");
  await page.click('[data-testid="add-to-cart"]');
  await page.waitForSelector('[data-testid="added-msg"]', { timeout: 5000 });

  // ──────────────────────────────────────────────
  // Step 3: Go to cart and proceed to checkout
  // ──────────────────────────────────────────────
  await page.click('nav >> text=Cart');
  await page.waitForSelector('[data-testid="cart-table"]', { timeout: 10000 });

  // Verify cart has items
  const cartItems = await page.locator('[data-testid^="cart-item-"]').count();
  if (cartItems === 0) throw new Error("Cart is empty after adding product");

  // Verify total is displayed
  const cartTotal = await page.textContent('[data-testid="cart-total"]');
  if (!cartTotal || !cartTotal.includes("$")) throw new Error("Cart total not displayed");

  await page.click('[data-testid="proceed-checkout"]');

  // ──────────────────────────────────────────────
  // Step 4: Login (pre-filled demo credentials)
  // ──────────────────────────────────────────────
  await page.waitForSelector('[data-testid="login-form"]', { timeout: 10000 });

  // Credentials are pre-filled, just submit
  await page.click('[data-testid="login-btn"]');

  // ──────────────────────────────────────────────
  // Step 5: Fill shipping info
  // ──────────────────────────────────────────────
  await page.waitForSelector('[data-testid="shipping-form"]', { timeout: 10000 });

  await page.fill('[data-testid="ship-address"]', "123 Monitor Street");
  await page.fill('[data-testid="ship-city"]', "San Francisco");
  await page.fill('[data-testid="ship-zip"]', "94105");
  await page.click('[data-testid="continue-review"]');

  // ──────────────────────────────────────────────
  // Step 6: Review and place order
  // ──────────────────────────────────────────────
  await page.waitForSelector('[data-testid="review-step"]', { timeout: 10000 });

  // Verify order total is shown
  const orderTotal = await page.textContent('[data-testid="order-total"]');
  if (!orderTotal || !orderTotal.includes("$")) throw new Error("Order total not displayed in review");

  // Verify shipping summary
  const shipSummary = await page.textContent('[data-testid="ship-summary"]');
  if (!shipSummary || !shipSummary.includes("San Francisco")) throw new Error("Shipping summary incorrect");

  // Place the order
  await page.click('[data-testid="place-order"]');

  // ──────────────────────────────────────────────
  // Step 7: Verify order confirmation
  // ──────────────────────────────────────────────
  await page.waitForSelector('[data-testid="confirmation"]', { timeout: 15000 });

  const orderId = await page.textContent('[data-testid="order-id"]');
  if (!orderId || !orderId.startsWith("order-")) throw new Error("Order ID not displayed on confirmation page");
}

module.exports = { run };
