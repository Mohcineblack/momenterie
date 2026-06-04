# Fulfillment Pipeline - Sandbox Test Procedure

This document describes the step-by-step procedure for testing the full Prodigi fulfillment pipeline in sandbox mode.

## Prerequisites

1. **Prodigi Sandbox Account**: Create a free account at [https://dashboard.sandbox.prodigi.com](https://dashboard.sandbox.prodigi.com)
2. **Environment Variables** configured in `.env.local`:

```env
PRODIGI_ENV=sandbox
PRODIGI_API_KEY=<your-sandbox-api-key>
R2_ENDPOINT=<your-r2-endpoint>
R2_ACCESS_KEY_ID=<your-r2-access-key>
R2_SECRET_ACCESS_KEY=<your-r2-secret-key>
R2_BUCKET_NAME=<your-bucket-name>
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...
```

3. **Stripe CLI** installed for local webhook forwarding
4. **Trigger.dev CLI** configured and running (`npx trigger dev`)
5. **Application running** locally (`npm run dev`)

## Test Procedure

### Step 1: Start Local Services

```bash
# Terminal 1: Start the Next.js dev server
npm run dev

# Terminal 2: Start Trigger.dev
npx trigger dev

# Terminal 3: Forward Stripe webhooks
stripe listen --forward-to http://localhost:3000/api/webhooks/stripe
```

### Step 2: Place a Test Order

1. Navigate to the store and add a product to cart (e.g., Custom City Map, A3, Poster)
2. Proceed to checkout
3. Use Stripe test card: `4242 4242 4242 4242` (any future expiry, any CVC)
4. Complete the purchase

**Expected Result**: Order is created with status `PENDING`, paymentStatus `UNPAID`

### Step 3: Stripe Webhook Fires

The Stripe CLI forwards the `payment_intent.succeeded` webhook to your local server.

**Expected Result**:
- Order paymentStatus updates to `PAID`
- Order status updates to `PROCESSING`
- `renderOrderItem` Trigger.dev task fires for each order item

### Step 4: Render Task Completes

The render task generates production PDF files and uploads them to R2.

**Expected Result**:
- Each OrderItem gets a `productionFileUrl` set (e.g., `r2://bucket/production/orders/{orderId}/items/{itemId}.pdf`)
- Once all items are rendered, Order status updates to `IN_PRODUCTION`
- `submitToProdigiTask` fires automatically

### Step 5: Prodigi Submission

The `submit-to-prodigi` task:
1. Resolves Prodigi SKUs for each item
2. Generates presigned URLs for production files
3. Submits the order to Prodigi sandbox API

**Expected Result**:
- Order `prodigiOrderId` is set (e.g., `ord_abc123`)
- Order `supplierCostCents` is populated
- No `fulfillmentError` is set
- In the Prodigi sandbox dashboard, the order appears under "Orders"

### Step 6: Verify in Admin Panel

1. Navigate to `/admin/orders/{orderId}`
2. Check the "Fulfillment" card in the sidebar

**Expected Result**:
- Prodigi Order ID is displayed
- Supplier Cost is shown (formatted as currency)
- Fulfillment State shows "Submitted"
- No error is displayed

### Step 7: Simulate Prodigi Status Update

In Prodigi sandbox, orders automatically progress through statuses. The `syncFulfillmentStatus` cron task runs every 30 minutes. You can trigger it manually via the Trigger.dev dashboard.

Alternatively, wait for the cron to fire, or manually invoke:
```bash
# Via Trigger.dev dashboard: Run "sync-fulfillment-status" task manually
```

**Expected Result** (once Prodigi marks the order as shipped):
- Order status updates to `SHIPPED`
- `carrier` is populated (e.g., "DHL")
- `trackingUrl` is populated with a tracking link
- `shippedAt` timestamp is set
- Admin panel "Fulfillment" card shows carrier, tracking link, and shipped date

### Step 8: Verify Final State in Admin Panel

1. Navigate to `/admin/orders/{orderId}`
2. Check the "Fulfillment" card

**Expected Result**:
- Prodigi Order ID displayed
- Supplier Cost displayed
- Fulfillment State: "Shipped"
- Carrier name displayed (e.g., "DHL")
- Tracking link is clickable and opens in new tab
- Shipped At date is displayed

## Testing Error Scenarios

### Simulating a Submission Failure

1. Set an invalid `PRODIGI_API_KEY` in `.env.local`
2. Place and pay for a new order
3. The `submit-to-prodigi` task will fail after retries

**Expected Result**:
- Order `fulfillmentError` is set with the error message
- Admin panel shows the error in red
- "Re-submit to Prodigi" button is visible

### Testing Re-submission

1. Fix the `PRODIGI_API_KEY` in `.env.local`
2. In the admin panel, click "Re-submit to Prodigi"
3. The endpoint clears the error and triggers a new submission

**Expected Result**:
- `fulfillmentError` is cleared
- `prodigiOrderId` is cleared (then re-set on success)
- New submission succeeds
- Admin panel updates to show the new Prodigi Order ID

## Troubleshooting

| Issue | Solution |
|-------|----------|
| Webhook not firing | Check Stripe CLI is running and forwarding to correct port |
| Render task fails | Verify R2 credentials and bucket exist |
| SKU mapping error | Ensure product variant has valid size/material/color |
| Presign URL invalid | Check R2 endpoint and access keys |
| Prodigi 401 | Verify PRODIGI_API_KEY is correct for sandbox |
| Prodigi 400 | Check order payload format (valid SKU, valid address) |
| Sync not running | Verify Trigger.dev is running and cron is registered |
