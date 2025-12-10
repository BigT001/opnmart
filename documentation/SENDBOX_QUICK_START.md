# SendBox Integration - Quick Setup Guide

## ✅ What's Been Completed

Your OpenMart e-commerce platform is now fully integrated with SendBox for professional shipping management!

### **New Files Created**

1. **`lib/sendbox-client.ts`** - Production-ready SendBox API client
   - ✅ Handles authentication with access tokens
   - ✅ Provides shipping quote calculations
   - ✅ Manages shipment creation and tracking
   - ✅ Comprehensive error handling

2. **`app/api/shipping/quotes/route.ts`** - Get shipping quotes
   - `POST /api/shipping/quotes` - Calculate quotes for delivery
   - `GET /api/shipping/quotes` - Health check

3. **`app/api/shipping/shipments/route.ts`** - Manage shipments
   - `GET /api/shipping/shipments` - List all shipments with filtering
   - `POST /api/shipping/shipments` - Create new shipment

4. **`app/api/shipping/track/[shipmentId]/route.ts`** - Track shipments
   - `GET /api/shipping/track/[shipmentId]` - Real-time tracking

5. **`tests/sendbox-webhook-tester.js`** - Test webhook integration
   - Run: `npm run test:sendbox-webhook`

6. **`app/api/webhooks/sendbox.ts`** - Webhook handler (already exists)
   - Receives SendBox events
   - Stores in MongoDB
   - Processes shipment updates

### **Environment Variables Added**

Your `.env.local` now has:
```env
NEXT_PUBLIC_SENDBOX_APP_ID=6937c0422602cb000f85f15a
SENDBOX_CLIENT_SECRET=<your_secret>
SENDBOX_ACCESS_TOKEN=<your_token>
SENDBOX_REFRESH_TOKEN=<your_token>
SENDBOX_API_BASE_URL=https://sandbox.staging.sendbox.co
SENDBOX_WEBHOOK_SECRET=<webhook_secret>
```

---

## 🚀 Next Steps

### 1. **Test the Integration**
```powershell
# Terminal 1: Start your dev server
npm run dev

# Terminal 2: Run webhook tests
npm run test:sendbox-webhook
```

You should see:
```
✅ Success (200) - shipment.created
✅ Success (200) - shipment.in_transit
✅ Success (200) - shipment.delivered
✅ Success (200) - shipment.cancelled
✅ Success (200) - quote.generated
```

### 2. **Test Shipping Quotes API**

Using PowerShell:
```powershell
$body = @{
    origin = @{
        country = "Nigeria"
        country_code = "NG"
        state = "Lagos"
        state_code = "LOS"
    }
    destination = @{
        country = "Nigeria"
        country_code = "NG"
        state = "Abuja"
        state_code = "ABV"
    }
    weight = 2.5
} | ConvertTo-Json

$response = Invoke-WebRequest `
  -Uri "http://localhost:3000/api/shipping/quotes" `
  -Method POST `
  -Headers @{"Content-Type"="application/json"} `
  -Body $body

$response.Content | ConvertFrom-Json | ConvertTo-Json -Depth 10
```

Or using Node.js:
```javascript
const quotes = await fetch('http://localhost:3000/api/shipping/quotes', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    origin: { country: 'Nigeria', state: 'Lagos', state_code: 'LOS', country_code: 'NG' },
    destination: { country: 'Nigeria', state: 'Abuja', state_code: 'ABV', country_code: 'NG' },
    weight: 2.5
  })
}).then(r => r.json());

console.log(quotes);
```

### 3. **Integrate into Checkout**

Update your checkout page to:
1. Call `/api/shipping/quotes` with customer location
2. Display quotes to customer
3. Let customer select preferred courier
4. Create shipment with `/api/shipping/shipments` on order completion

### 4. **Setup SendBox Webhook**

In SendBox Dashboard:
1. Go to **Settings → Webhooks**
2. Add webhook URL: `https://your-domain.com/api/webhooks/sendbox`
3. Subscribe to events:
   - `shipment.created`
   - `shipment.in_transit`
   - `shipment.delivered`
   - `shipment.cancelled`
   - `quote.generated`

### 5. **Monitor Webhooks**

Check MongoDB for received webhook events:
```javascript
db.webhooks.find().sort({ createdAt: -1 }).limit(10)
```

---

## 📋 API Documentation

Full documentation available in: **`SENDBOX_API_INTEGRATION.md`**

Quick reference:

| Endpoint | Method | Purpose |
|----------|--------|---------|
| `/api/shipping/quotes` | POST | Get delivery quotes |
| `/api/shipping/quotes` | GET | Health check |
| `/api/shipping/shipments` | GET | List shipments |
| `/api/shipping/shipments` | POST | Create shipment |
| `/api/shipping/track/:id` | GET | Track shipment |

---

## 🔄 Moving to Production

When ready to go live:

1. **Get production credentials from SendBox**

2. **Update `.env.local`:**
   ```env
   SENDBOX_API_BASE_URL=https://live.sendbox.co
   SENDBOX_ACCESS_TOKEN=<production_token>
   SENDBOX_CLIENT_SECRET=<production_secret>
   ```

3. **Update webhook URL** in SendBox dashboard to your live domain

4. **Test all endpoints** in production environment

5. **Monitor logs** for any issues

---

## ✅ Build Status

**Build Status:** ✅ **PASSED**

All files compile successfully. Your project is ready for development!

```
✓ Compiled successfully in 7.7s
✓ TypeScript check passed
✓ 29 pages generated successfully
✓ All API routes registered
```

---

## 🔧 Troubleshooting

### Webhook tests fail with "Connection refused"
- Make sure dev server is running: `npm run dev`
- Check that `http://localhost:3000` is accessible

### API returns "Missing required SendBox environment variables"
- Verify `.env.local` has all SendBox variables
- Restart dev server after updating `.env.local`

### Shipping quotes return empty
- Check SendBox account has active API credentials
- Verify states/locations exist in SendBox sandbox
- Check network requests in browser DevTools

### Webhook not receiving events
- Ensure webhook URL is accessible (use ngrok for local testing)
- Check webhook signature validation in logs
- Verify SendBox webhook configuration includes your events

---

## 📚 Resources

- **SendBox Docs:** https://docs.sendbox.co/
- **SendBox Support:** support@sendbox.co
- **Your App ID:** `6937c0422602cb000f85f15a`
- **Webhook Tester:** `npm run test:sendbox-webhook`

---

## 🎉 Ready to Ship!

Your OpenMart platform is now connected to SendBox and ready to handle real shipping calculations, shipment management, and delivery tracking. Start integrating these APIs into your checkout flow and you're all set!

Happy shipping! 🚚
