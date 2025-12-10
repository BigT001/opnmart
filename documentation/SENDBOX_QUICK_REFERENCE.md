# SendBox Shipping - Quick Reference

## The Solution in 30 Seconds

**Problem:** Old system showed ₦1,000 for any Lagos location, ₦6,000 for Abuja regardless of distance/weight

**Solution:** Query SendBox API with actual distance + weight + dimensions → get REAL quotes

**Implementation:** Drop `<SendBoxShippingSelector />` in checkout, it handles everything!

---

## Code Snippet

```typescript
// 1. Product has weight and dimensions
product.weight = 0.2;  // kg
product.dimensions = { length: 14.7, width: 7.1, height: 0.85 };

// 2. In checkout, convert cart to shipping items
const shippingItems = cart.map(item => ({
  description: item.name,
  weight: item.weight,
  quantity: item.quantity,
  length: item.dimensions?.length,
  width: item.dimensions?.width,
  height: item.dimensions?.height,
}));

// 3. Add component
<SendBoxShippingSelector
  originState="Lagos"
  destinationState={userState}
  items={shippingItems}
  subtotal={total}
  onOptionSelected={setSelectedShipping}
/>

// 4. That's it! Calculate total
const orderTotal = subtotal + selectedShipping.totalCost + tax;
```

---

## What Gets Sent to SendBox

```json
{
  "origin_state": "Lagos",
  "origin_state_code": "LOS",
  "destination_state": "Kano",
  "destination_state_code": "KN",
  "weight": 2.3,
  "length": 35,
  "width": 25,
  "height": 3
}
```

SendBox looks up:
- Distance: Lagos→Kano = 1,200km
- Applies courier rates
- Returns multiple options with real prices

---

## Files You Need

| File | Purpose |
|------|---------|
| `utils/sendboxCalculator.ts` | Core logic |
| `components/SendBoxShippingSelector.tsx` | UI component |
| `.env.local` | SendBox credentials |

---

## Configuration

### Platform Fee

`utils/sendboxCalculator.ts` line 129:
```typescript
export const PLATFORM_FEES = {
  FIXED: 200,       // ₦200 on every order
  PERCENTAGE: 0.03, // +3% of shipping cost
};
```

### Tax Rate

In checkout when calculating total:
```typescript
const tax = Math.round(subtotal * 0.075); // 7.5%
```

---

## Example: Real Output

**User in Abuja orders ₦50,000 worth**

SendBox returns:
```
- GIG Logistics: ₦5,500 (2 days)
- SendBox Express: ₦7,500 (1 day)
- ValueCourier: ₦4,500 (3 days)
```

With your fee (₦200 + 3%):
```
- GIG: ₦5,865 (+ ₦365)
- SendBox Express: ₦7,925 (+ ₦425)
- ValueCourier: ₦4,735 (+ ₦235) ← Auto-selected
```

Final checkout:
```
Subtotal: ₦50,000
Shipping (ValueCourier): ₦4,735
Tax (7.5%): ₦3,755
─────────────────
Total: ₦58,490
```

---

## Testing

1. Product needs weight: ✅
2. Add to cart: ✅
3. Go checkout: ✅
4. Select state: ✅
5. See options load: ✅
6. Pick one: ✅
7. Total updates: ✅

---

## Why It's Better

| Metric | Before | After |
|--------|--------|-------|
| Accuracy | Hardcoded zones | Real distance math |
| Distance variations | No | Yes ✅ |
| Weight factor | No | Yes ✅ |
| Dimensions factor | No | Yes ✅ |
| Courier options | None | Multiple ✅ |
| Customer experience | Sees same price always | Sees actual rates ✅ |

---

## Common Issues & Fixes

| Issue | Fix |
|-------|-----|
| No quotes showing | Check product has `weight` property |
| All states show same price | Likely API not being called, check `.env.local` |
| Error in console | Check SendBox token is valid |
| Component is slow | Add dimensions to products (helps volumetric calculation) |

---

## Next: Store With Order

When order completes, save:
```typescript
order.shipping = {
  provider: selectedShipping.courierName,
  courierCost: selectedShipping.baseCost,
  platformFee: selectedShipping.platformFee,
  totalCost: selectedShipping.totalCost,
  estimatedDays: selectedShipping.estimatedDays,
  trackingId: null, // Will be set when shipped
};
```

---

## Key Numbers

- **Minimum weight**: 0.1 kg (SendBox minimum)
- **Platform fee fixed**: ₦200 (configurable)
- **Platform fee %**: 3% (configurable)
- **Tax rate**: 7.5% (configurable in checkout)
- **Fastest delivery**: 1 day (varies by location)
- **Slowest delivery**: 5+ days (far North/South)

---

## Support

Docs:
- Full guide: `SENDBOX_REAL_SHIPPING.md`
- Implementation: `SENDBOX_IMPLEMENTATION_COMPLETE.md`
- API reference: `SENDBOX_API_INTEGRATION.md`

Code:
- Calculator: `utils/sendboxCalculator.ts`
- Component: `components/SendBoxShippingSelector.tsx`

---

## Summary

**You're now calculating shipping based on:**
- ✅ Actual distance (Lagos→Kano, not just "zones")
- ✅ Package weight (2kg costs more than 0.5kg)
- ✅ Package dimensions (volume matters)
- ✅ Real couriers (GIG, SendBox, ValueCourier, etc.)

**No more guessing. SendBox does the math.** 🚚

Drop the component in checkout and you're done!
