# SendBox API Integration Guide

## Overview

OpenMart is now fully integrated with SendBox for real-time shipping quote calculation, shipment creation, and tracking. This guide covers all available endpoints and their usage.

## Configuration

All SendBox credentials are stored in `.env.local`:

```env
NEXT_PUBLIC_SENDBOX_APP_ID=6937c0422602cb000f85f15a
SENDBOX_CLIENT_SECRET=<your_client_secret>
SENDBOX_ACCESS_TOKEN=<your_access_token>
SENDBOX_REFRESH_TOKEN=<your_refresh_token>
SENDBOX_API_BASE_URL=https://sandbox.staging.sendbox.co
SENDBOX_WEBHOOK_SECRET=<your_webhook_secret>
```

## API Endpoints

### 1. Get Shipping Quotes

**Endpoint:** `POST /api/shipping/quotes`

**Purpose:** Get available shipping quotes for a shipment based on origin, destination, and weight.

**Request Body:**
```json
{
  "origin": {
    "country": "Nigeria",
    "country_code": "NG",
    "state": "Lagos",
    "state_code": "LOS"
  },
  "destination": {
    "country": "Nigeria",
    "country_code": "NG",
    "state": "Abuja",
    "state_code": "ABV"
  },
  "weight": 2.5,
  "items": [
    {
      "description": "Electronics",
      "quantity": 1,
      "weight": 2.5
    }
  ]
}
```

**Response (Success):**
```json
{
  "success": true,
  "quotes": [
    {
      "provider": "GIG Logistics",
      "amount": 5500,
      "currency": "NGN",
      "estimated_delivery_days": 2
    },
    {
      "provider": "SendBox Express",
      "amount": 7500,
      "currency": "NGN",
      "estimated_delivery_days": 1
    }
  ],
  "message": "Shipping quotes fetched successfully"
}
```

**Error Response:**
```json
{
  "success": false,
  "error": "Missing required fields: origin, destination, weight"
}
```

---

### 2. List All Shipments

**Endpoint:** `GET /api/shipping/shipments`

**Purpose:** Retrieve all shipments with optional filtering.

**Query Parameters:**
- `status` (optional): Filter by status (e.g., "pending", "in_transit", "delivered")
- `limit` (optional): Number of results (default: 10)
- `offset` (optional): Pagination offset (default: 0)

**Example:**
```
GET /api/shipping/shipments?status=in_transit&limit=20&offset=0
```

**Response:**
```json
{
  "success": true,
  "shipments": [
    {
      "id": "shipment_123456",
      "reference": "OP-2025-001",
      "status": "in_transit",
      "origin": { "state": "Lagos", "country": "Nigeria" },
      "destination": { "state": "Abuja", "country": "Nigeria" },
      "weight": 2.5,
      "created_at": "2025-12-09T10:30:00Z"
    }
  ],
  "total": 45,
  "message": "Shipments fetched successfully"
}
```

---

### 3. Create a Shipment

**Endpoint:** `POST /api/shipping/shipments`

**Purpose:** Create a new shipment with SendBox.

**Request Body:**
```json
{
  "reference": "OP-2025-001",
  "origin": {
    "country": "Nigeria",
    "state": "Lagos",
    "address": "123 Main Street, Lagos Island",
    "name": "OpenMart Warehouse",
    "phone": "+2341234567890"
  },
  "destination": {
    "country": "Nigeria",
    "state": "Abuja",
    "address": "456 Park Avenue, Abuja",
    "name": "John Doe",
    "phone": "+2349876543210"
  },
  "items": [
    {
      "description": "iPhone 15 Pro",
      "quantity": 1,
      "weight": 0.2,
      "value": 500000
    }
  ],
  "weight": 0.2,
  "selected_courier": "GIG Logistics",
  "insurance": true
}
```

**Response:**
```json
{
  "success": true,
  "shipment_id": "shipment_abc123xyz",
  "data": {
    "id": "shipment_abc123xyz",
    "reference": "OP-2025-001",
    "status": "pending",
    "tracking_number": "SBX123456789",
    "created_at": "2025-12-09T10:35:00Z"
  },
  "message": "Shipment created successfully"
}
```

---

### 4. Track Shipment

**Endpoint:** `GET /api/shipping/track/[shipmentId]`

**Purpose:** Get real-time tracking information for a shipment.

**Example:**
```
GET /api/shipping/track/shipment_abc123xyz
```

**Response:**
```json
{
  "success": true,
  "shipment_id": "shipment_abc123xyz",
  "status": "in_transit",
  "location": {
    "city": "Lagos",
    "state": "Lagos",
    "updated_at": "2025-12-09T14:30:00Z"
  },
  "estimated_delivery": "2025-12-11T18:00:00Z",
  "full_data": {
    "id": "shipment_abc123xyz",
    "reference": "OP-2025-001",
    "tracking_events": [
      {
        "status": "picked_up",
        "timestamp": "2025-12-09T10:35:00Z",
        "location": "Lagos"
      },
      {
        "status": "in_transit",
        "timestamp": "2025-12-09T14:30:00Z",
        "location": "Lagos to Abuja Route"
      }
    ]
  }
}
```

---

### 5. Verify SendBox API Connection

**Endpoint:** `GET /api/shipping/quotes`

**Purpose:** Health check to verify SendBox API is accessible.

**Response (Success):**
```json
{
  "success": true,
  "message": "SendBox API is connected and ready"
}
```

**Response (Failure):**
```json
{
  "success": false,
  "error": "Failed to connect to SendBox API"
}
```

---

## Client-Side Usage Examples

### Using Fetch API

```typescript
// Get shipping quotes
const response = await fetch('/api/shipping/quotes', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    origin: { country: 'Nigeria', state: 'Lagos', state_code: 'LOS', country_code: 'NG' },
    destination: { country: 'Nigeria', state: 'Abuja', state_code: 'ABV', country_code: 'NG' },
    weight: 2.5
  })
});

const data = await response.json();
console.log(data.quotes);
```

### Using Axios

```typescript
import axios from 'axios';

const quotes = await axios.post('/api/shipping/quotes', {
  origin: { country: 'Nigeria', state: 'Lagos', state_code: 'LOS', country_code: 'NG' },
  destination: { country: 'Nigeria', state: 'Abuja', state_code: 'ABV', country_code: 'NG' },
  weight: 2.5
});

console.log(quotes.data.quotes);
```

---

## Webhook Integration

SendBox will send webhook events to: `https://your-domain.com/api/webhooks/sendbox`

### Webhook Events

1. **shipment.created** - Shipment was successfully created
2. **shipment.in_transit** - Shipment is on its way
3. **shipment.delivered** - Shipment has been delivered
4. **shipment.cancelled** - Shipment was cancelled
5. **quote.generated** - Delivery quotes were generated

### Webhook Payload Structure

```json
{
  "event": "shipment.in_transit",
  "data": {
    "id": "shipment_123456",
    "reference": "OP-2025-001",
    "status": "in_transit",
    "current_location": {
      "city": "Lagos",
      "state": "Lagos",
      "updated_at": "2025-12-09T14:30:00Z"
    },
    "estimated_delivery": "2025-12-11T18:00:00Z"
  },
  "timestamp": "2025-12-09T14:30:00Z"
}
```

---

## Error Handling

All endpoints return consistent error responses:

```json
{
  "success": false,
  "error": "Descriptive error message"
}
```

Common HTTP Status Codes:
- `200` - Successful GET request
- `201` - Successful POST request (resource created)
- `400` - Bad request (missing or invalid parameters)
- `401` - Unauthorized (invalid credentials)
- `500` - Server error

---

## Testing the Integration

Run the webhook tester to simulate SendBox events:

```bash
npm run test:sendbox-webhook
```

This will send 5 test events to your webhook:
1. Shipment Created
2. Shipment In Transit
3. Shipment Delivered
4. Shipment Cancelled
5. Quote Generated

---

## Migrating from Staging to Production

When ready to go live:

1. Update `.env.local`:
```env
SENDBOX_API_BASE_URL=https://live.sendbox.co
SENDBOX_ACCESS_TOKEN=<your_production_access_token>
SENDBOX_CLIENT_SECRET=<your_production_client_secret>
```

2. Update webhook URL in SendBox dashboard to your production domain

3. Test all endpoints in production environment

4. Monitor logs for any issues

---

## Rate Limits

SendBox API has rate limits per account. Monitor your usage:

- Check `X-RateLimit-Remaining` in response headers
- Implement exponential backoff for retries
- Cache quotes when possible to reduce API calls

---

## Support

For issues or questions:
- SendBox Documentation: https://docs.sendbox.co/
- SendBox Support: support@sendbox.co
- Your webhook logs: Check MongoDB `webhooks` collection for received events
