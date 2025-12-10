# SendBox Real Shipping Calculation Guide
## Getting Accurate Shipping Costs Based on Distance, Weight & Dimensions

---

## 🎯 The Problem We Solved

**OLD WAY (❌ Not accurate):**
```
User selects "Lagos" → Always returns ₦2,000 (zone-based)
User selects "Lycos" → Always returns ₦1,000 (regardless of weight/dimensions)
User selects "Abuja" → Always returns ₦6,000 (hardcoded)

❌ PROBLEM: Doesn't account for:
- Distance variation within a state
- Package weight
- Package dimensions (length × width × height)
- Actual courier availability
```

**NEW WAY (✅ Accurate):**
```
User selects "Lycos" + adds 1kg item → Queries SendBox API
SendBox calculates distance, weight, dimensions → Returns REAL quotes:
  - GIG Logistics: ₦4,200 (2 days)
  - SendBox Express: ₦6,500 (1 day)
  - ValueCourier: ₦3,800 (3 days)

✅ ADVANTAGE:
- Real distance-based calculation
- Weight-based pricing
- Dimension-aware (volumetric weight)
- Multiple courier options
- Accurate delivery estimates
```

---

## 📦 How to Use in Your Checkout

### Step 1: Define Your Cart Items with Dimensions

```typescript
// In your cart/checkout, include ACTUAL item dimensions
interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  weight: number;        // kg
  length?: number;       // cm
  width?: number;        // cm
  height?: number;       // cm
  value?: number;        // Naira (for insurance)
}

// Example:
const cartItems: CartItem[] = [
  {
    id: '1',
    name: 'iPhone 15 Pro',
    price: 500000,
    quantity: 1,
    weight: 0.201,        // 201g
    length: 14.7,         // cm
    width: 7.1,           // cm
    height: 0.85,         // cm
    value: 500000
  },
  {
    id: '2',
    name: 'Phone Case',
    price: 5000,
    quantity: 1,
    weight: 0.05,         // 50g
    length: 15,
    width: 8,
    height: 1,
    value: 5000
  }
];
```

### Step 2: Convert to SendBox Item Format

```typescript
import { type ShippingItem } from '@/utils/sendboxCalculator';

const shippingItems: ShippingItem[] = cartItems.map(item => ({
  description: item.name,
  weight: item.weight,
  quantity: item.quantity,
  length: item.length,
  width: item.width,
  height: item.height,
  value: item.value,
}));
```

### Step 3: Add Component to Checkout

```typescript
'use client';

import { SendBoxShippingSelector } from '@/components/SendBoxShippingSelector';
import { type ShippingItem, type ShippingOption } from '@/utils/sendboxCalculator';

export default function CheckoutPage() {
  const [selectedShipping, setSelectedShipping] = useState<ShippingOption | null>(null);
  const [destinationState, setDestinationState] = useState('');
  
  // Convert your cart items
  const shippingItems: ShippingItem[] = cart.map(item => ({
    description: item.name,
    weight: item.weight,
    quantity: item.quantity,
    length: item.length,
    width: item.width,
    height: item.height,
  }));

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 grid grid-cols-3 gap-8">
      
      {/* LEFT: Forms */}
      <div className="col-span-2">
        
        {/* State Selection */}
        <div className="mb-8">
          <label className="block font-medium mb-2">Delivery State *</label>
          <select
            value={destinationState}
            onChange={(e) => setDestinationState(e.target.value)}
            className="w-full px-4 py-2 border rounded-lg"
          >
            <option value="">Select State</option>
            <option value="Lagos">Lagos</option>
            <option value="Abuja">Abuja</option>
            <option value="Kano">Kano</option>
            <option value="Enugu">Enugu</option>
            {/* Add all Nigerian states */}
          </select>
        </div>

        {/* SENDBOX SHIPPING SELECTOR */}
        {destinationState && shippingItems.length > 0 && (
          <SendBoxShippingSelector
            originState="Lagos"        // Your warehouse location
            destinationState={destinationState}
            items={shippingItems}      // Items with weight & dimensions
            subtotal={getCartTotal()}
            onOptionSelected={setSelectedShipping}
            selectedOption={selectedShipping}
          />
        )}
      </div>

      {/* RIGHT: Order Summary */}
      <div className="col-span-1">
        <div className="bg-white rounded-lg shadow-lg p-6 sticky top-8">
          <h3 className="text-lg font-bold mb-4">Order Summary</h3>
          
          {selectedShipping ? (
            <>
              <div className="space-y-2 text-sm mb-4 pb-4 border-b">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span>₦{subtotal.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span>Shipping ({selectedShipping.courierName})</span>
                  <span>₦{selectedShipping.baseCost.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-blue-600">
                  <span>Platform Fee</span>
                  <span>₦{selectedShipping.platformFee.toLocaleString()}</span>
                </div>
              </div>
              <div className="flex justify-between items-center mb-6">
                <span className="font-bold">Total</span>
                <span className="text-2xl font-bold text-blue-600">
                  ₦{(subtotal + selectedShipping.totalCost + tax).toLocaleString()}
                </span>
              </div>
              <button className="w-full bg-blue-600 text-white py-3 rounded-lg font-bold">
                Continue to Payment
              </button>
            </>
          ) : (
            <p className="text-gray-500 text-sm">Select location and review shipping options</p>
          )}
        </div>
      </div>
    </div>
  );
}
```

---

## 🧮 Understanding the Calculation

### Example: Kano Customer Orders iPhone

```
ITEMS:
  - iPhone 15 Pro: 201g (14.7×7.1×0.85 cm)
  - Phone Case: 50g (15×8×1 cm)
  Total: 251g (0.251 kg)

SENDBOX REQUEST:
{
  origin_state: "Lagos",
  destination_state: "Kano",
  weight: 0.251,
  length: 15,    // max length
  width: 8,      // max width
  height: 1,     // max height
}

SENDBOX CALCULATION (based on distance data):
  - Distance Lagos→Kano: ~1,200 km
  - Weight: 0.251 kg
  - Volumetric weight: (15 × 8 × 1) / 5000 = 0.024 kg
  - Billable weight: max(0.251, 0.024) = 0.251 kg

SENDBOX RETURNS QUOTES:
  [
    {
      provider: "GIG Logistics",
      amount: 4200,
      estimated_delivery_days: 2
    },
    {
      provider: "SendBox Express",
      amount: 6500,
      estimated_delivery_days: 1
    },
    {
      provider: "ValueCourier",
      amount: 3800,
      estimated_delivery_days: 3
    }
  ]

YOUR PLATFORM FEE ADDED:
  - Fixed: ₦200
  - Percentage: 3%

  GIG Logistics:
    Base: ₦4,200
    Fee: ₦200 + (4,200 × 0.03) = ₦326
    Total: ₦4,526

  SendBox Express:
    Base: ₦6,500
    Fee: ₦200 + (6,500 × 0.03) = ₦395
    Total: ₦6,895

  ValueCourier:
    Base: ₦3,800
    Fee: ₦200 + (3,800 × 0.03) = ₦314
    Total: ₦4,114 ✓ CHEAPEST (selected by default)

FINAL CHECKOUT:
  Subtotal: ₦505,000
  Shipping (ValueCourier): ₦4,114
  Tax (7.5%): ₦38,336
  ─────────────────
  TOTAL: ₦547,450
```

---

## 🔧 Configuration

### Change Your Platform Fee

Edit `utils/sendboxCalculator.ts`:

```typescript
// Current: ₦200 fixed + 3%
export const PLATFORM_FEES = {
  FIXED: 200,
  PERCENTAGE: 0.03,
};

// Example: Change to ₦500 + 5%
export const PLATFORM_FEES = {
  FIXED: 500,
  PERCENTAGE: 0.05,
};

// Example: Only percentage, no fixed fee
export const PLATFORM_FEES = {
  FIXED: 0,
  PERCENTAGE: 0.10,  // 10%
};
```

### Change Tax Rate

```typescript
// In checkout component:
const orderTotal = calculateOrderTotal(
  subtotal,
  selectedShipping,
  0.10  // Change from 0.075 (7.5%) to 0.10 (10%)
);
```

---

## 📊 How SendBox Calculates Distance

SendBox has a database of Nigerian locations with coordinates. It calculates distance automatically:

```
Location Codes (State + City):
  LOS = Lagos State
  ABV = Abuja (FCT)
  KN  = Kano State
  EN  = Enugu State
  etc.

When you send:
  origin_state_code: "LOS"
  destination_state_code: "KN"

SendBox knows:
  Lagos (origin): Latitude 6.5244, Longitude 3.3792
  Kano (dest): Latitude 12.0022, Longitude 8.5920
  
  Calculates distance and applies per-km rates based on:
  - Courier's network
  - Distance tier
  - Weight tier
  - Current demand
```

---

## ✅ Ensuring Accurate Item Data

For accurate shipping calculation, you MUST store item dimensions:

### In Your Product Model

```typescript
interface Product {
  id: string;
  name: string;
  price: number;
  weight: number;        // kg - REQUIRED
  dimensions?: {
    length: number;      // cm
    width: number;       // cm
    height: number;      // cm
  };
}
```

### During Checkout

```typescript
// Get product details
const product = await fetch(`/api/products/${productId}`);

// Include all weight & dimension data
const cartItem = {
  id: product.id,
  name: product.name,
  price: product.price,
  quantity: quantity,
  weight: product.weight,
  length: product.dimensions?.length,
  width: product.dimensions?.width,
  height: product.dimensions?.height,
};
```

---

## 🚀 Testing Checklist

- [ ] Product database has weights populated
- [ ] Product database has dimensions (L×W×H)
- [ ] Checkout loads items correctly
- [ ] Selecting state triggers SendBox API call
- [ ] Multiple quotes appear for different states
- [ ] Prices vary based on state (not fixed)
- [ ] Dimensions affect pricing (test heavy items vs light)
- [ ] Platform fee is calculated correctly
- [ ] Total order amount is accurate
- [ ] Can complete checkout with selected option

---

## 🐛 Debugging

### Check What's Being Sent to SendBox

Open browser DevTools → Network tab → Look for request to `/api/shipping/quotes`

**Request Body** should look like:
```json
{
  "origin_country": "Nigeria",
  "origin_state": "Lagos",
  "origin_state_code": "LOS",
  "destination_country": "Nigeria",
  "destination_state": "Kano",
  "destination_state_code": "KN",
  "weight": 0.251,
  "length": 15,
  "width": 8,
  "height": 1
}
```

**Response** should have:
```json
{
  "success": true,
  "quotes": [
    {
      "provider": "GIG Logistics",
      "amount": 4200,
      "currency": "NGN",
      "estimated_delivery_days": 2
    }
  ]
}
```

### If No Quotes Returned

1. **Check state code is correct** - Use the `STATE_CODE_MAP` in `sendboxCalculator.ts`
2. **Verify SendBox API credentials** - Check `.env.local` has valid token
3. **Check weight/dimensions are valid** - Weight must be > 0, dimensions optional
4. **Test with Lagos→Abuja** - This route always works

---

## 💡 Pro Tips

1. **Cache quotes for 30 minutes** - Don't recalculate on every keystroke
2. **Show weight breakdown** - Display "Total weight: X kg" to user
3. **Highlight cheapest option** - Auto-select to improve conversion
4. **Handle offline gracefully** - Have fallback shipping option
5. **Monitor SendBox outages** - Keep fallback rates updated
6. **Track quote accuracy** - Log what SendBox returns vs what users paid

---

## 📱 Real Example Workflow

```
USER JOURNEY:
1. Adds iPhone (weight: 0.2kg) to cart
2. Adds charger (weight: 0.1kg) to cart
3. Navigates to checkout
4. Enters name, email, phone
5. Selects state: "Ibadan"
6. Component calls SendBox with:
   - Total weight: 0.3kg
   - Dimensions: 15×8×1 cm
   - Destination: Ibadan
7. SendBox returns 4 options:
   - Option 1: ₦3,200 (3 days)
   - Option 2: ₦5,100 (1 day)
   - Option 3: ₦3,800 (2 days) ← DEFAULT (cheapest)
   - Option 4: ₦7,000 (same day)
8. Your platform fee added:
   - Option 1: ₦3,296 (+ ₦200 + 3%)
   - Option 2: ₦5,253 (+ ₦200 + 3%)
   - Option 3: ₦3,914 ✓ (+ ₦200 + 3%)
   - Option 4: ₦7,210 (+ ₦200 + 3%)
9. User sees:
   ┌─────────────────────────────────┐
   │ Select Shipping Method           │
   │                                 │
   │ ✓ ValueCourier - ₦3,914 (2 days)│
   │   SendBox Express - ₦5,253 (1 d)│
   │   Standard - ₦3,296 (3 days)   │
   │   NextDay - ₦7,210 (Same day)  │
   └─────────────────────────────────┘
10. User clicks on SendBox Express
11. Order total updates:
    Subtotal: ₦505,000
    Shipping: ₦5,253
    Tax: ₦37,894
    ─────────
    TOTAL: ₦548,147
12. Completes payment
13. Order saved with:
    - shipping.provider: "SendBox Express"
    - shipping.cost: ₦5,253
    - shipping.estimatedDays: 1
```

---

## 🎓 Key Takeaways

✅ **SendBox calculates shipping based on:**
- Distance (from origin to destination state)
- Weight (actual package weight)
- Dimensions (length × width × height)
- Courier availability & rates

✅ **You add:**
- Fixed platform fee
- Percentage markup
- Your branding & support

✅ **Benefits:**
- Accurate, competitive pricing
- Real courier options
- Professional shipping tracking
- Customer trust

**You're no longer guessing shipping costs - SendBox does the math!** 🚚
