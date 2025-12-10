# Dynamic Product Upload Form - Implementation Guide

## Overview

The product upload form is now **fully dynamic** and displays different specification fields based on the category and subcategory selected by the vendor. This ensures vendors provide complete and accurate product information relevant to each product type.

## Features

### ✅ Implemented Features

1. **Dynamic Field Rendering**
   - Form automatically displays relevant specification fields when vendor selects a category and subcategory
   - Fields are tailored to specific product types (phones, laptops, cameras, furniture, etc.)
   - Required fields are clearly marked and validated

2. **Comprehensive Specifications Database**
   - Mobile Phones: Storage, RAM, Processor, Display, Camera, Battery, OS, Water Resistance, Warranty
   - Laptops: Processor, Cores, RAM, Storage, GPU, Display, Refresh Rate, Battery Life, Weight
   - Cameras: Type, Megapixels, Sensor, ISO Range, Aperture, Focal Length, Video, Autofocus, Shutter Speed
   - Headphones: Type, Connection, Driver Size, Frequency Response, Impedance, Noise Cancellation
   - Tablets: Processor, RAM, Storage, Display, OS, Battery, Connectivity
   - Speakers: Type, Power, Drivers, Frequency Response, Connectivity, Waterproof Rating
   - Power Banks: Capacity, Ports, Input, Fast Charging, Display
   - Refrigerators: Capacity, Type, Cooling Tech, Energy Rating, Warranty
   - Generators: Power Output, Fuel Type, Tank, Runtime, Noise Level, Warranty
   - Furniture (Sofas, Beds): Material, Color, Dimensions, Features
   - Grocery (Produce, Dairy): Type, Origin, Organic Status, Shelf Life

3. **Smart Form Handling**
   - Specifications clear when category/subcategory changes
   - Support for multiple input types: text, number, select, textarea, checkbox
   - Help text for complex fields
   - Min/max/step validation for numeric fields

4. **Persistent Storage**
   - All specifications are stored in MongoDB with the product
   - Specifications accessible on product detail pages
   - Easy to query products by specification values

## File Structure

```
config/
├── productSpecifications.ts      # Configuration for all product specs

components/
├── ProductUploadModal.tsx        # Dynamic upload form component
└── SpecificationsDisplay.tsx     # Component to display specs on detail page

models/
└── Product.ts                    # Updated with specifications field

app/api/products/
└── route.ts                      # Updated to handle specifications
```

## How to Use

### For Vendors

1. **Select Category** (e.g., Electronics)
2. **Select Subcategory** (e.g., Mobile Phones)
   - Form automatically shows relevant specification fields
3. **Fill in Specifications**
   - All required fields marked with *
   - Help text provided for complex fields
4. **Fill Other Details** (name, price, stock, image)
5. **Submit**
   - All data (including specifications) saved to database

### Code Example: Mobile Phone Upload

```
Category: Electronics
Subcategory: Mobile Phones

Dynamic fields that appear:
- Storage Memory (select: 32GB, 64GB, 128GB, etc.)
- RAM Memory (select: 2GB-16GB)
- Processor (text: e.g., "Snapdragon 8 Gen 1")
- Display Size (text: e.g., "6.1 inches")
- Display Type (select: IPS LCD, AMOLED, OLED, etc.)
- Refresh Rate (select: 60Hz, 90Hz, 120Hz, etc.)
- Rear Camera (text: e.g., "48MP + 12MP + 12MP")
- Front Camera (text: e.g., "12MP")
- Battery Capacity (text: e.g., "4500mAh")
- Charging Technology (text: e.g., "65W Fast Charging")
- Operating System (select: Android, iOS)
- SIM Slots (select: Single SIM, Dual SIM, etc.)
- Water Resistance (select: IP67, IP68, None)
- Warranty Period (number: months)
```

### Code Example: Laptop Upload

```
Category: Electronics
Subcategory: Laptops

Dynamic fields that appear:
- Processor (text: e.g., "Intel Core i9")
- CPU Cores (select: 4, 6, 8, 10, 12, 16, 20)
- RAM Memory (select: 4GB-64GB)
- Storage Type (select: SSD, HDD, Hybrid)
- Storage Capacity (select: 256GB-4TB)
- Graphics Card (text: e.g., "NVIDIA RTX 4090")
- Display Size (text: e.g., "15.6 inches")
- Display Resolution (select: FHD, QHD, 4K, etc.)
- Refresh Rate (select: 60Hz-240Hz)
- Operating System (select: Windows 11, macOS, Linux)
- Battery Life (number: hours)
- Weight (number: kg)
- Warranty Period (number: months)
```

## Adding New Product Specifications

To add specifications for a new product category:

1. **Edit `config/productSpecifications.ts`**

```typescript
export const PRODUCT_SPECIFICATIONS: AllSpecs = {
  electronics: {
    new_product_type: [
      {
        name: 'field_name',
        label: 'User-Friendly Label',
        type: 'select|text|number|textarea|checkbox',
        required: true,
        placeholder: 'Hint text',
        options: [
          { value: 'option1', label: 'Option 1' },
          { value: 'option2', label: 'Option 2' },
        ],
        helpText: 'Additional guidance',
        min: 0,      // for numbers
        max: 100,    // for numbers
        step: 1,     // for numbers
      },
    ],
  },
};
```

2. **Add Label Mapping in `components/SpecificationsDisplay.tsx`**

```typescript
const specLabelMap: Record<string, string> = {
  field_name: 'User-Friendly Label',
};
```

## API Integration

### POST /api/products

The API now accepts and stores specifications:

```json
{
  "name": "Samsung Galaxy A13",
  "description": "...",
  "category": "electronics",
  "subcategory": "mobile_phones",
  "specifications": {
    "memory_storage": "128GB",
    "ram": "6GB",
    "processor": "Snapdragon 680",
    "display_size": "6.6 inches",
    ...
  }
}
```

### Database Schema

Product specifications stored as:
```typescript
{
  _id: ObjectId,
  name: string,
  specifications: Record<string, any>, // Flexible JSON object
  category: string,
  subcategory: string,
  // ... other fields
}
```

## Frontend Display

Use the `SpecificationsDisplay` component to show specs on product detail pages:

```tsx
import SpecificationsDisplay from '@/components/SpecificationsDisplay';

export default function ProductDetail() {
  return (
    <div>
      <SpecificationsDisplay
        category={product.category}
        subcategory={product.subcategory}
        specifications={product.specifications}
      />
    </div>
  );
}
```

## Validation

The form validates:
- ✅ Required specifications are filled
- ✅ Numeric fields are valid numbers
- ✅ Select fields have valid options
- ✅ Text fields are not empty

Errors display in red below each field.

## Benefits

1. **Better Product Information**: Vendors provide comprehensive, relevant details
2. **Buyer Confidence**: Customers see all important specs for informed decisions
3. **Searchability**: Specifications can be indexed for advanced search/filtering
4. **Data Consistency**: Standardized fields ensure quality across vendors
5. **Easy Maintenance**: Centralized specification configuration in one file

## Future Enhancements

1. **Advanced Search Filtering**
   - Filter products by specs (e.g., "Phones with 8GB+ RAM")
   - Price range + spec filters

2. **Spec Comparison**
   - Compare 2-3 products side-by-side
   - Highlight spec differences

3. **Specification Validation**
   - Ensure RAM ≥ Storage price correlation
   - Warn if specs seem unusual

4. **CSV Import**
   - Bulk upload products with specs
   - Template export for vendors

5. **Spec History**
   - Track spec changes over time
   - Price history per spec tier

## Testing Checklist

- [ ] Upload phone product with all specs
- [ ] Verify specs save to database
- [ ] Refresh page, specs persist
- [ ] View product detail, specs display
- [ ] Change category, specs clear properly
- [ ] Test different product types (laptop, camera, furniture)
- [ ] Test required field validation
- [ ] Test numeric field min/max
- [ ] Test select field options

## Troubleshooting

**Q: Specifications not appearing on form?**
A: Ensure subcategory is selected. Specs only show after subcategory selection.

**Q: Specifications not saving?**
A: Check browser console for errors. Verify API response includes specifications.

**Q: Spec fields showing wrong labels?**
A: Check `specLabelMap` in `SpecificationsDisplay.tsx` for mapping.

**Q: Can't add new product type?**
A: Add specs to `productSpecifications.ts` AND add subcategory to categories list.
