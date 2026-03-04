# Paystack Webhook Setup with Ngrok

## Problem
Payment status not updating from "pending" to "paid" after successful Paystack payment.

## Why This Happens
Paystack sends webhook notifications to your server when a payment is successful. However, during development (localhost), Paystack cannot reach your local server. This is where **ngrok** comes in - it creates a public URL that tunnels to your localhost.

---

## Solution: Complete Setup Guide

### Step 1: Add Paystack Keys to .env

Open `backend/.env` and add your Paystack keys:

```env
# Add these lines to your .env file
PAYSTACK_SECRET_KEY=sk_test_your_secret_key_here
PAYSTACK_PUBLIC_KEY=pk_test_your_public_key_here
```

**Where to get these keys:**
1. Go to [Paystack Dashboard](https://dashboard.paystack.com)
2. Navigate to **Settings** → **API Keys & Webhooks**
3. Copy both **Test Secret Key** and **Test Public Key**

---

### Step 2: Install and Setup Ngrok

#### 2.1 Install Ngrok

**Windows (PowerShell):**
```powershell
# Download ngrok
Invoke-WebRequest -Uri "https://bin.equinox.io/c/bNyj1mQVY4c/ngrok-v3-stable-windows-amd64.zip" -OutFile "ngrok.zip"

# Extract
Expand-Archive ngrok.zip -DestinationPath .

# Or download from: https://ngrok.com/download
```

**Alternative: Install via Chocolatey**
```powershell
choco install ngrok
```

#### 2.2 Authenticate Ngrok

You already have an auth token in your .env: `389TIxJtX9kKZGmo3vxLs6AHPTf_sUCb575ruT9gcHZzDo76`

```powershell
ngrok config add-authtoken 389TIxJtX9kKZGmo3vxLs6AHPTf_sUCb575ruT9gcHZzDo76
```

---

### Step 3: Start Your Backend Server

In your backend terminal:

```bash
cd backend
npm start
# Server should be running on http://localhost:5000
```

---

### Step 4: Start Ngrok Tunnel

Open a **NEW terminal** and run:

```powershell
ngrok http 5000
```

You should see output like:
```
ngrok

Session Status                online
Account                       Your Name (Plan: Free)
Version                       3.x.x
Region                        United States (us)
Forwarding                    https://abc123.ngrok.io -> http://localhost:5000
```

**Important:** Copy the `https://abc123.ngrok.io` URL (your URL will be different)

---

### Step 5: Configure Paystack Webhook

1. Go to [Paystack Dashboard](https://dashboard.paystack.com)
2. Navigate to **Settings** → **API Keys & Webhooks**
3. Scroll to **Webhook URL** section
4. Enter your webhook URL:
   ```
   https://abc123.ngrok.io/api/v1/webhooks/paystack
   ```
   Replace `abc123.ngrok.io` with your actual ngrok URL

5. Click **Save Changes**

---

### Step 6: Test the Payment Flow

#### 6.1 Start Frontend
In your frontend terminal:
```bash
cd frontend/easy-shop-frontend
npm run dev
```

#### 6.2 Place Test Order

1. Open your app: http://localhost:5173
2. Add products to cart
3. Go to checkout
4. Click "Pay with Paystack"
5. Use Paystack test card:
   - **Card Number:** `5531 8866 5214 2950`
   - **CVV:** `123`
   - **Expiry:** Any future date (e.g., `12/26`)
   - **PIN:** `3310`
   - **OTP:** `123456`

#### 6.3 Verify Payment Status

1. Complete the payment
2. Check your backend console - you should see:
   ```
   🔥 PAYSTACK WEBHOOK RECEIVED
   EVENT: charge.success
   ```
3. Go to admin dashboard → Orders
4. Payment status should show **"paid"** (green badge)
5. Customer should receive "Order Received" email (if AWS SES is set up)

---

## Troubleshooting

### Issue 1: Webhook Not Received

**Check Backend Logs:**
```
🔥 PAYSTACK WEBHOOK RECEIVED  ← Should appear after payment
```

If not appearing:
- ✅ Verify ngrok is running
- ✅ Verify webhook URL in Paystack dashboard is correct
- ✅ Ensure backend server is running

### Issue 2: "Invalid Paystack signature"

**Solution:** Check that `PAYSTACK_SECRET_KEY` in `.env` matches your Paystack dashboard

### Issue 3: Payment Status Still "pending"

**Possible causes:**
1. Webhook signature verification failed
2. Amount mismatch
3. Currency mismatch
4. Order not found

**Check backend console for:**
```
Invalid Paystack signature
Amount mismatch
Webhook reference mismatch
```

### Issue 4: Ngrok URL Changes Every Time

**Free ngrok accounts get new URLs on each restart.**

**Solutions:**
1. **Update Paystack webhook URL** each time you restart ngrok
2. **Upgrade to ngrok paid plan** for static URLs
3. **For production:** Deploy to a real server (no ngrok needed)

---

## Production Deployment

### When deploying to production (Render, Heroku, etc.):

1. **No ngrok needed** - your server has a public URL
2. Update Paystack webhook URL to:
   ```
   https://your-app.onrender.com/api/v1/webhooks/paystack
   ```
3. Use **production Paystack keys** instead of test keys:
   ```env
   PAYSTACK_SECRET_KEY=sk_live_your_production_key
   PAYSTACK_PUBLIC_KEY=pk_live_your_production_key
   ```

---

## Quick Reference

### Start Development Environment

**Terminal 1 - Backend:**
```bash
cd backend
npm start
```

**Terminal 2 - Ngrok:**
```powershell
ngrok http 5000
# Copy the https URL
```

**Terminal 3 - Frontend:**
```bash
cd frontend/easy-shop-frontend
npm run dev
```

**Browser:**
1. Update Paystack webhook with ngrok URL
2. Test payment at http://localhost:5173

---

## Environment Variables Checklist

Make sure your `backend/.env` has:

```env
# Paystack (REQUIRED for payments)
PAYSTACK_SECRET_KEY=sk_test_xxxxx
PAYSTACK_PUBLIC_KEY=pk_test_xxxxx
PAYSTACK_BASE_URL=https://api.paystack.co

# Server
PORT=5000
JWT_SECRET=jwtSecret

# Google Sheets
GOOGLE_SHEET_ID=your_sheet_id

# AWS S3 (for images)
AWS_REGION=us-east-2
AWS_BUCKET_NAME=shopeasy-s3-buckect

# AWS SES (for emails - optional)
AWS_ACCESS_KEY_ID=your_key
AWS_SECRET_ACCESS_KEY=your_secret
EMAIL_FROM=noreply@yourdomain.com
ADMIN_EMAIL=admin@yourdomain.com

# Frontend URL
FRONTEND_URL=http://localhost:5173

# Ngrok (optional - just for reference)
YOUR_NGROK_AUTHTOKEN=389TIxJtX9kKZGmo3vxLs6AHPTf_sUCb575ruT9gcHZzDo76
```

---

## Testing Checklist

- [ ] Backend running on http://localhost:5000
- [ ] Ngrok tunnel active with HTTPS URL
- [ ] Paystack webhook URL updated with ngrok URL
- [ ] PAYSTACK_SECRET_KEY added to .env
- [ ] Frontend running on http://localhost:5173
- [ ] Test payment with Paystack test card
- [ ] Backend shows "🔥 PAYSTACK WEBHOOK RECEIVED"
- [ ] Payment status changes to "paid" on admin dashboard
- [ ] Customer receives "Order Received" email (if SES configured)

---

## Common Commands

```bash
# Check if backend is running
curl http://localhost:5000

# Check ngrok status
ngrok status

# Test webhook manually (replace URL)
curl -X POST https://your-ngrok-url.ngrok.io/api/v1/webhooks/paystack \
  -H "Content-Type: application/json" \
  -d '{"event":"charge.success"}'
```

---

## Support

- **Paystack Docs:** https://paystack.com/docs/payments/webhooks
- **Ngrok Docs:** https://ngrok.com/docs
- **Test Cards:** https://paystack.com/docs/payments/test-payments
