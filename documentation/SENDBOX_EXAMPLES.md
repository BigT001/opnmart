# SendBox Integration - Implementation Examples

Quick code examples for integrating SendBox into your frontend.

## 1. Shipping Calculator Component

```typescript
// components/ShippingCalculator.tsx
'use client';

import { useState } from 'react';
import { Mail, MapPin, Package, Truck } from 'lucide-react';

interface ShippingQuote {
  provider: string;
  amount: number;
  currency: string;
  estimated_delivery_days: number;
}

export function ShippingCalculator() {
  const [origin, setOrigin] = useState('Lagos');
  const [destination, setDestination] = useState('Abuja');
  const [weight, setWeight] = useState(2.5);
  const [quotes, setQuotes] = useState<ShippingQuote[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedQuote, setSelectedQuote] = useState<ShippingQuote | null>(null);
  const [error, setError] = useState('');

  const fetchQuotes = async () => {
    setLoading(true);
    setError('');
    
    try {
      const response = await fetch('/api/shipping/quotes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          origin: {
            country: 'Nigeria',
            country_code: 'NG',
            state: origin,
            state_code: origin === 'Lagos' ? 'LOS' : 'ABV'
          },
          destination: {
            country: 'Nigeria',
            country_code: 'NG',
            state: destination,
            state_code: destination === 'Lagos' ? 'LOS' : 'ABV'
          },
          weight: parseFloat(weight.toString())
        })
      });

      const data = await response.json();
      
      if (data.success) {
        setQuotes(data.quotes);
      } else {
        setError(data.error || 'Failed to fetch quotes');
      }
    } catch (err) {
      setError('Connection error. Please try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-6 max-w-2xl mx-auto">
      <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
        <Truck className="w-6 h-6 text-blue-600" />
        Calculate Shipping Cost
      </h2>

      {/* Input Section */}
      <div className="space-y-4 mb-6">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-2">From</label>
            <select
              value={origin}
              onChange={(e) => setOrigin(e.target.value)}
              className="w-full px-4 py-2 border rounded-lg"
            >
              <option>Lagos</option>
              <option>Abuja</option>
              <option>Kano</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">To</label>
            <select
              value={destination}
              onChange={(e) => setDestination(e.target.value)}
              className="w-full px-4 py-2 border rounded-lg"
            >
              <option>Lagos</option>
              <option>Abuja</option>
              <option>Kano</option>
            </select>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Weight (kg)</label>
          <input
            type="number"
            value={weight}
            onChange={(e) => setWeight(e.target.value)}
            step="0.1"
            min="0.1"
            className="w-full px-4 py-2 border rounded-lg"
          />
        </div>

        <button
          onClick={fetchQuotes}
          disabled={loading}
          className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-bold py-2 px-4 rounded-lg transition"
        >
          {loading ? 'Loading...' : 'Get Shipping Quotes'}
        </button>
      </div>

      {/* Error Display */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
          <p className="text-red-700">{error}</p>
        </div>
      )}

      {/* Quotes Display */}
      {quotes.length > 0 && (
        <div className="space-y-3">
          <h3 className="font-semibold text-lg mb-3">Available Options</h3>
          {quotes.map((quote, idx) => (
            <div
              key={idx}
              onClick={() => setSelectedQuote(quote)}
              className={`p-4 border rounded-lg cursor-pointer transition ${
                selectedQuote === quote
                  ? 'border-blue-600 bg-blue-50'
                  : 'border-gray-200 hover:border-blue-300'
              }`}
            >
              <div className="flex justify-between items-center">
                <div>
                  <p className="font-semibold text-lg">{quote.provider}</p>
                  <p className="text-sm text-gray-600">
                    Delivery: {quote.estimated_delivery_days} day(s)
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-bold text-blue-600">
                    ₦{quote.amount.toLocaleString()}
                  </p>
                  <p className="text-xs text-gray-500">{quote.currency}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Selected Quote Summary */}
      {selectedQuote && (
        <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded-lg">
          <p className="text-green-700 font-semibold">
            ✓ {selectedQuote.provider} selected
          </p>
          <p className="text-sm text-green-600">
            Cost: ₦{selectedQuote.amount.toLocaleString()} | Delivery: {selectedQuote.estimated_delivery_days} day(s)
          </p>
        </div>
      )}
    </div>
  );
}
```

---

## 2. Shipment Tracking Component

```typescript
// components/ShipmentTracker.tsx
'use client';

import { useEffect, useState } from 'react';
import { MapPin, Clock, Package, CheckCircle } from 'lucide-react';

interface TrackingInfo {
  status: string;
  location: { city: string; state: string; updated_at: string };
  estimated_delivery: string;
  tracking_events: Array<{
    status: string;
    timestamp: string;
    location: string;
  }>;
}

export function ShipmentTracker({ shipmentId }: { shipmentId: string }) {
  const [tracking, setTracking] = useState<TrackingInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchTracking = async () => {
      try {
        const response = await fetch(`/api/shipping/track/${shipmentId}`);
        const data = await response.json();

        if (data.success) {
          setTracking(data);
        } else {
          setError(data.error || 'Failed to fetch tracking info');
        }
      } catch (err) {
        setError('Connection error');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchTracking();
    // Refresh every 30 seconds
    const interval = setInterval(fetchTracking, 30000);
    return () => clearInterval(interval);
  }, [shipmentId]);

  if (loading) {
    return <div className="text-center py-8">Loading tracking information...</div>;
  }

  if (error) {
    return <div className="bg-red-50 p-4 rounded-lg text-red-700">{error}</div>;
  }

  if (!tracking) {
    return <div className="text-gray-500">No tracking information available</div>;
  }

  const statusColors: Record<string, string> = {
    pending: 'bg-yellow-100 text-yellow-800',
    in_transit: 'bg-blue-100 text-blue-800',
    delivered: 'bg-green-100 text-green-800',
    cancelled: 'bg-red-100 text-red-800'
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      {/* Current Status */}
      <div className="mb-6">
        <div className="flex items-center gap-3 mb-2">
          <Package className="w-6 h-6 text-blue-600" />
          <h3 className="text-lg font-semibold">Shipment Status</h3>
        </div>
        <div className={`inline-block px-4 py-2 rounded-full font-semibold ${statusColors[tracking.status] || 'bg-gray-100'}`}>
          {tracking.status.replace('_', ' ').toUpperCase()}
        </div>
      </div>

      {/* Current Location */}
      <div className="mb-6 p-4 bg-gray-50 rounded-lg">
        <div className="flex items-center gap-3 mb-2">
          <MapPin className="w-5 h-5 text-blue-600" />
          <h4 className="font-semibold">Current Location</h4>
        </div>
        <p className="text-lg">{tracking.location.city}, {tracking.location.state}</p>
        <p className="text-sm text-gray-600">
          Updated: {new Date(tracking.location.updated_at).toLocaleString()}
        </p>
      </div>

      {/* Estimated Delivery */}
      {tracking.estimated_delivery && (
        <div className="mb-6 p-4 bg-green-50 rounded-lg border border-green-200">
          <div className="flex items-center gap-3 mb-2">
            <Clock className="w-5 h-5 text-green-600" />
            <h4 className="font-semibold text-green-900">Estimated Delivery</h4>
          </div>
          <p className="text-lg text-green-700">
            {new Date(tracking.estimated_delivery).toLocaleDateString('en-US', {
              weekday: 'long',
              year: 'numeric',
              month: 'long',
              day: 'numeric'
            })}
          </p>
        </div>
      )}

      {/* Timeline */}
      {tracking.tracking_events && tracking.tracking_events.length > 0 && (
        <div>
          <h4 className="font-semibold mb-4">Tracking History</h4>
          <div className="space-y-4">
            {tracking.tracking_events.map((event, idx) => (
              <div key={idx} className="flex gap-4">
                <div className="flex flex-col items-center">
                  <CheckCircle className="w-6 h-6 text-green-600" />
                  {idx < tracking.tracking_events.length - 1 && (
                    <div className="w-1 h-12 bg-green-200 my-2"></div>
                  )}
                </div>
                <div className="pb-4">
                  <p className="font-semibold capitalize">
                    {event.status.replace('_', ' ')}
                  </p>
                  <p className="text-sm text-gray-600">{event.location}</p>
                  <p className="text-xs text-gray-500">
                    {new Date(event.timestamp).toLocaleString()}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
```

---

## 3. Hook for Shipping Quotes

```typescript
// hooks/useShippingQuotes.ts
import { useState, useCallback } from 'react';

interface ShippingQuote {
  provider: string;
  amount: number;
  currency: string;
  estimated_delivery_days: number;
}

interface QuoteRequest {
  origin: { state: string; state_code: string };
  destination: { state: string; state_code: string };
  weight: number;
}

export function useShippingQuotes() {
  const [quotes, setQuotes] = useState<ShippingQuote[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const fetchQuotes = useCallback(async (request: QuoteRequest) => {
    setLoading(true);
    setError('');
    
    try {
      const response = await fetch('/api/shipping/quotes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...request,
          origin_country: 'Nigeria',
          origin_country_code: 'NG',
          destination_country: 'Nigeria',
          destination_country_code: 'NG'
        })
      });

      const data = await response.json();
      
      if (data.success) {
        setQuotes(data.quotes || []);
      } else {
        setError(data.error || 'Failed to fetch quotes');
      }
    } catch (err) {
      setError('Connection error');
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  return { quotes, loading, error, fetchQuotes };
}
```

---

## 4. Integration in Checkout Page

```typescript
// app/checkout/page.tsx
'use client';

import { ShippingCalculator } from '@/components/ShippingCalculator';
import { useState } from 'react';

export default function CheckoutPage() {
  const [selectedQuote, setSelectedQuote] = useState(null);

  const handleCreateOrder = async () => {
    if (!selectedQuote) {
      alert('Please select a shipping option');
      return;
    }

    // Create order with shipment
    const response = await fetch('/api/orders', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        items: [], // Your cart items
        shippingQuote: selectedQuote,
        deliveryAddress: {} // Customer address
      })
    });

    // Handle response
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Checkout</h1>

        {/* Order Items */}
        <div className="mb-8">
          {/* Your order items here */}
        </div>

        {/* Shipping Calculator */}
        <div className="mb-8">
          <ShippingCalculator />
        </div>

        {/* Order Summary */}
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-xl font-bold mb-4">Order Summary</h2>
          <div className="space-y-2 mb-4">
            <div className="flex justify-between">
              <span>Subtotal:</span>
              <span>₦50,000</span>
            </div>
            {selectedQuote && (
              <div className="flex justify-between text-blue-600 font-semibold">
                <span>Shipping:</span>
                <span>₦{selectedQuote.amount.toLocaleString()}</span>
              </div>
            )}
            <div className="border-t pt-2 flex justify-between font-bold text-lg">
              <span>Total:</span>
              <span>₦{(50000 + (selectedQuote?.amount || 0)).toLocaleString()}</span>
            </div>
          </div>

          <button
            onClick={handleCreateOrder}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded-lg transition"
          >
            Complete Order
          </button>
        </div>
      </div>
    </div>
  );
}
```

---

## 5. API Usage Examples

### Using Fetch
```javascript
// Get quotes
const quotes = await fetch('/api/shipping/quotes', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    origin: { state: 'Lagos', state_code: 'LOS', country: 'Nigeria', country_code: 'NG' },
    destination: { state: 'Abuja', state_code: 'ABV', country: 'Nigeria', country_code: 'NG' },
    weight: 2.5
  })
}).then(r => r.json());

console.log(quotes.quotes); // Array of available options
```

### Using Axios
```typescript
import axios from 'axios';

const quotes = await axios.post('/api/shipping/quotes', {
  origin: { state: 'Lagos', state_code: 'LOS', country: 'Nigeria', country_code: 'NG' },
  destination: { state: 'Abuja', state_code: 'ABV', country: 'Nigeria', country_code: 'NG' },
  weight: 2.5
});

console.log(quotes.data.quotes);
```

---

These examples are ready to integrate into your OpenMart platform!
