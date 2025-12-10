# Complete Shipping Integration Guide
## Getting Real Shipping Costs into Your Checkout

---

## 📊 Overview: How It All Works

```
┌─────────────────────────────────────────────────────────────┐
│                  USER CHECKOUT FLOW                         │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  1. User fills in delivery address → selects STATE          │
│                          ▼                                  │
│  2. Frontend calls: POST /api/shipping/quotes              │
│        {                                                     │
│          origin: "Lagos",                                   │
│          destination: "Abuja",                              │
│          weight: 1.5 kg                                     │
│        }                                                     │
│                          ▼                                  │
│  3. Backend queries SENDBOX API (real couriers)            │
│        ↓                                                    │
│  SendBox returns:                                           │
│    - GIG Logistics: 5,500₦ (2 days)                        │
│    - SendBox Express: 7,500₦ (1 day)                       │
│                          ▼                                  │
│  4. Frontend adds YOUR PLATFORM FEE                        │
│    - Base: 5,500₦                                          │
│    - Platform Fee (5% + 500₦): 775₦                        │
│    - Total: 6,275₦                                         │
│                          ▼                                  │
│  5. Display to user with breakdown                         │
│    "GIG Logistics - 6,275₦"                                │
│     ├─ Courier: 5,500₦                                     │
│     ├─ Platform Fee: 775₦                                  │
│     └─ Delivery: 2 days                                    │
│                          ▼                                  │
│  6. User selects option & completes checkout              │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

---

## 💰 Pricing Structure

### Your Platform Fee Breakdown

```
PLATFORM_FEES = {
  SENDBOX_FEE: 500₦,        // Fixed fee for SendBox quotes
  STANDARD_FEE: 300₦,       // Fixed fee for standard shipping
  PERCENTAGE: 0.05,         // 5% of shipping cost
}
```

### Example: Lagos to Abuja (2.5kg)

| Component | Cost |
|-----------|------|
| Courier Quote | ₦5,500 |
| Fixed Fee | ₦500 |
| Percentage (5%) | ₦275 |
| **Total Platform Fee** | **₦775** |
| **Total to User** | **₦6,275** |
| **Your Profit** | **₦775** |

### Customize Your Fees

Edit `utils/shippingWithSendBox.ts`:

```typescript
export const PLATFORM_FEES = {
  SENDBOX_FEE: 500,      // ← Change this (fixed amount)
  STANDARD_FEE: 300,     // ← Or this (fallback option)
  PERCENTAGE: 0.05,      // ← Or this (5% = 0.05)
};
```

To make it 10% + 1000₦ fixed:
```typescript
PERCENTAGE: 0.10,        // 10%
SENDBOX_FEE: 1000,       // 1000₦ fixed
```

---

## 🔧 Step-by-Step Implementation

### Step 1: Import Components & Utilities

In your checkout page (`app/checkout/page.tsx`):

```typescript
'use client';

import { useState, useEffect } from 'react';
import { ShippingOptionsSelector } from '@/components/ShippingOptionsSelector';
import { 
  calculateOrderTotal, 
  type ShippingOption 
} from '@/utils/shippingWithSendBox';
import { calculateShipping } from '@/utils/shippingCalculator';
```

### Step 2: Add State for Shipping Selection

```typescript
export default function CheckoutPage() {
  const [selectedShippingOption, setSelectedShippingOption] = useState<ShippingOption | null>(null);
  const [shippingInfo, setShippingInfo] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    state: '', // ← User selects this
    postalCode: '',
  });

  const subtotal = getCartTotal(); // Your existing function
  
  // Base shipping cost (for fallback)
  const baseShipping = calculateShipping(shippingInfo.state, subtotal)?.finalCost || 5000;
  
  // Calculate totals based on selected shipping
  const orderSummary = selectedShippingOption
    ? calculateOrderTotal(subtotal, selectedShippingOption)
    : { subtotal, shippingBase: 0, platformFee: 0, tax: 0, total: subtotal };
```

### Step 3: Add the Shipping Selector Component

```typescript
return (
  <div className="min-h-screen bg-gray-50">
    {/* ... existing header ... */}
    
    <div className="max-w-7xl mx-auto px-4 py-8 grid grid-cols-3 gap-8">
      
      {/* LEFT: Forms */}
      <div className="col-span-2">
        
        {/* ... existing form sections ... */}
        
        {/* SHIPPING DETAILS SECTION */}
        <section className="mb-8">
          <h2 className="text-2xl font-bold mb-6">Delivery Address</h2>
          
          <form className="space-y-4 mb-6">
            {/* State Selection - REQUIRED */}
            <div>
              <label className="block text-sm font-medium mb-2">State *</label>
              <select
                value={shippingInfo.state}
                onChange={(e) => setShippingInfo({ ...shippingInfo, state: e.target.value })}
                className="w-full px-4 py-2 border rounded-lg"
                required
              >
                <option value="">Select State</option>
                <option value="Lagos">Lagos</option>
                <option value="Abuja">Abuja</option>
                <option value="Kano">Kano</option>
                <option value="Enugu">Enugu</option>
                <option value="Ibadan">Ibadan</option>
                {/* Add all states */}
              </select>
            </div>

            {/* Other address fields */}
            <div>
              <label className="block text-sm font-medium mb-2">Address *</label>
              <input
                type="text"
                value={shippingInfo.address}
                onChange={(e) => setShippingInfo({ ...shippingInfo, address: e.target.value })}
                className="w-full px-4 py-2 border rounded-lg"
                placeholder="123 Main Street"
                required
              />
            </div>
          </form>

          {/* SHIPPING OPTIONS SELECTOR */}
          {shippingInfo.state && (
            <ShippingOptionsSelector
              destinationState={shippingInfo.state}
              weight={1.5} // Calculate based on your products
              baseShippingCost={baseShipping}
              subtotal={subtotal}
              onOptionSelected={setSelectedShippingOption}
              selectedOption={selectedShippingOption}
            />
          )}
        </section>

        {/* ... continue with payment form ... */}
      </div>

      {/* RIGHT: Order Summary */}
      <div className="col-span-1">
        <div className="bg-white rounded-lg shadow-lg p-6 sticky top-8">
          <h3 className="text-xl font-bold mb-6">Order Summary</h3>

          {/* Line Items */}
          <div className="space-y-3 mb-6 pb-6 border-b">
            {cart.map((item) => (
              <div key={item.id} className="flex justify-between text-sm">
                <span>{item.name}</span>
                <span className="font-medium">
                  ₦{(item.price * item.quantity).toLocaleString()}
                </span>
              </div>
            ))}
          </div>

          {/* Pricing Breakdown */}
          <div className="space-y-3 mb-6 pb-6 border-b text-sm">
            <div className="flex justify-between">
              <span className="text-gray-600">Subtotal</span>
              <span>₦{subtotal.toLocaleString()}</span>
            </div>

            {selectedShippingOption && (
              <>
                <div className="flex justify-between">
                  <span className="text-gray-600">Courier Cost</span>
                  <span>₦{orderSummary.shippingBase.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Platform Fee</span>
                  <span className="text-blue-600 font-medium">
                    +₦{orderSummary.platformFee.toLocaleString()}
                  </span>
                </div>
              </>
            )}

            <div className="flex justify-between">
              <span className="text-gray-600">Tax (7.5%)</span>
              <span>₦{orderSummary.tax.toLocaleString()}</span>
            </div>
          </div>

          {/* Total */}
          <div className="flex justify-between items-center mb-6">
            <span className="text-xl font-bold">Total</span>
            <span className="text-3xl font-bold text-blue-600">
              ₦{orderSummary.total.toLocaleString()}
            </span>
          </div>

          {/* Status */}
          {!selectedShippingOption && (
            <div className="p-3 bg-yellow-50 rounded-lg border border-yellow-200 text-sm text-yellow-800">
              Select a state and shipping method to see total
            </div>
          )}

          {/* Checkout Button */}
          <button
            onClick={handleCheckout}
            disabled={!selectedShippingOption}
            className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 text-white font-bold py-3 rounded-lg transition"
          >
            {selectedShippingOption ? 'Continue to Payment' : 'Select Shipping'}
          </button>
        </div>
      </div>
    </div>
  </div>
);
```

---

## 🎯 Key Functions Explained

### getShippingOptions()

Fetches all available shipping options for a destination.

```typescript
const result = await getShippingOptions(
  'Lagos',           // origin (your warehouse)
  'Abuja',           // destination (user's state)
  1.5,               // weight in kg
  5000               // fallback shipping cost
);

// Returns:
{
  success: true,
  options: [
    {
      id: 'sendbox-0',
      name: 'GIG Logistics',
      provider: 'sendbox',
      baseCost: 5500,
      platformFee: 775,
      totalCost: 6275,
      estimatedDays: 2,
      description: '2 day(s) delivery via GIG Logistics'
    },
    // ... more options ...
    {
      id: 'standard-shipping',
      name: 'Standard Shipping',
      provider: 'standard',
      baseCost: 5000,
      platformFee: 750,
      totalCost: 5750,
      estimatedDays: 3,
      description: '3-5 business days delivery'
    }
  ],
  defaultOption: { /* cheapest option */ }
}
```

### calculateOrderTotal()

Calculates final order total with all components.

```typescript
const total = calculateOrderTotal(
  50000,              // subtotal
  shippingOption,     // selected shipping option
  0.075               // tax rate (7.5%)
);

// Returns:
{
  subtotal: 50000,
  shippingBase: 5500,    // courier cost
  platformFee: 775,      // your fee
  tax: 3756,
  total: 60031           // what user pays
}
```

---

## 📱 Real-World Example

### Scenario: Customer in Abuja ordering ₦50,000 worth of products

**Step 1: User selects "Abuja" as delivery state**
```
Frontend calls: POST /api/shipping/quotes
{
  origin: "Lagos",
  destination: "Abuja",
  weight: 1.5
}
```

**Step 2: SendBox returns 3 quotes**
```
[
  { provider: "GIG Logistics", amount: 5500, days: 2 },
  { provider: "SendBox Express", amount: 7500, days: 1 },
  { provider: "ValueCourier", amount: 6000, days: 2 }
]
```

**Step 3: Frontend adds your platform fee to each**
```
GIG Logistics:
  Base: 5,500₦
  Fee: 500₦ + (5,500 × 0.05) = 775₦
  Total: 6,275₦

SendBox Express:
  Base: 7,500₦
  Fee: 500₦ + (7,500 × 0.05) = 875₦
  Total: 8,375₦

ValueCourier:
  Base: 6,000₦
  Fee: 500₦ + (6,000 × 0.05) = 800₦
  Total: 6,800₦
```

**Step 4: Display sorted by price (cheapest first)**
```
✓ GIG Logistics - 6,275₦ (2 days) [SELECTED]
  SendBox Express - 8,375₦ (1 day)
  ValueCourier - 6,800₦ (2 days)
  Standard Shipping - 5,750₦ (3-5 days)
```

**Step 5: Show final checkout total**
```
Subtotal:           50,000₦
Courier (GIG):       5,500₦
Platform Fee:          775₦
Tax (7.5%):         4,191₦
─────────────────────────
TOTAL:              60,466₦
```

---

## 🔐 Storing Shipping with Order

When saving the order to database:

```typescript
interface Order {
  userId: string;
  items: CartItem[];
  shippingInfo: {
    address: string;
    city: string;
    state: string;
  };
  shipping: {
    provider: 'sendbox' | 'standard';
    courierName: string;
    courierCost: number;
    platformFee: number;
    totalCost: number;
    estimatedDays: number;
  };
  pricing: {
    subtotal: number;
    tax: number;
    total: number;
  };
  status: 'pending' | 'processing' | 'shipped' | 'delivered';
  createdAt: Date;
}
```

---

## ⚙️ Configuration

### Change Your Platform Fee

Edit `utils/shippingWithSendBox.ts`:

```typescript
// Current: Fixed 500₦ + 5%
export const PLATFORM_FEES = {
  SENDBOX_FEE: 500,
  PERCENTAGE: 0.05,
};

// Example: Change to 1000₦ + 8%
export const PLATFORM_FEES = {
  SENDBOX_FEE: 1000,
  PERCENTAGE: 0.08,
};

// Example: Just percentage, no fixed fee
export const PLATFORM_FEES = {
  SENDBOX_FEE: 0,
  PERCENTAGE: 0.10,
};
```

### Change Tax Rate

When calculating order total:

```typescript
const orderTotal = calculateOrderTotal(
  subtotal,
  selectedShippingOption,
  0.10  // ← Change from 0.075 (7.5%) to 0.10 (10%)
);
```

---

## 🧪 Testing Checklist

- [ ] User selects state → shipping options load
- [ ] Shows multiple courier options if available
- [ ] Falls back to standard if SendBox fails
- [ ] Platform fee is added correctly
- [ ] Tax calculated correctly
- [ ] Total updates when option selected
- [ ] Can complete checkout with selection
- [ ] Order saves with correct shipping info

---

## 🚀 Going Live

### Before Launch

1. **Verify SendBox credentials** are correct in `.env.local`
2. **Test with real orders** in sandbox
3. **Check all delivery states** have correct state codes
4. **Review fee structure** with accounting/management
5. **Test edge cases**:
   - No SendBox quotes available
   - Very heavy packages
   - Remote locations
   - Zero tax scenarios

### Production Checklist

- [ ] Update SendBox API URL to live endpoint
- [ ] Update webhook URL to production domain
- [ ] Test end-to-end order flow
- [ ] Monitor shipping calculations in logs
- [ ] Set up alerts for failed quote fetches
- [ ] Have fallback plan if SendBox is down

---

## 📞 Support

**Questions about implementation?** Check:
- `SENDBOX_API_INTEGRATION.md` - Full API reference
- `SENDBOX_EXAMPLES.md` - Code examples
- `utils/shippingWithSendBox.ts` - Implementation details
- `components/ShippingOptionsSelector.tsx` - Component code

**Issues with calculations?**
- Check your `PLATFORM_FEES` configuration
- Verify tax rate in `calculateOrderTotal()`
- Confirm destination state is valid

That's it! Your checkout now has real, dynamic shipping quotes! 🚀
