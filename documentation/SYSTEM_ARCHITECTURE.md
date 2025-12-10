# System Architecture Diagram

## Complete Data Flow

```
┌────────────────────────────────────────────────────────────────────────────┐
│                         VENDOR PRODUCT UPLOAD FLOW                         │
└────────────────────────────────────────────────────────────────────────────┘

                        ┌─────────────────────────┐
                        │   ProductUploadModal    │
                        │      Component          │
                        └────────┬────────────────┘
                                 │
                                 ▼
                    ┌─────────────────────────────┐
                    │  Step 1: Basic Info         │
                    ├─────────────────────────────┤
                    │ • Product Name              │
                    │ • Description               │
                    │ • Brand                     │
                    │ • Price & Old Price         │
                    │ • Stock Quantity            │
                    │ • Image Upload              │
                    └────────┬────────────────────┘
                             │
                             ▼
                    ┌─────────────────────────────┐
                    │  Step 2: Select Category    │
                    ├─────────────────────────────┤
                    │ • Electronics               │
                    │ • Appliances                │
                    │ • Furniture                 │
                    │ • Grocery                   │
                    └────────┬────────────────────┘
                             │
                             ▼
              ┌──────────────────────────────────────┐
              │  Step 3: Select Subcategory          │
              ├──────────────────────────────────────┤
              │ Based on Category Selection:         │
              │ • Electronics: phones, laptops, etc  │
              │ • Appliances: fridges, generators   │
              │ • Furniture: sofas, beds, etc       │
              │ • Grocery: produce, dairy, etc      │
              └────────┬─────────────────────────────┘
                       │
                       ▼
         ┌─────────────────────────────────────────┐
         │  Config Lookup                          │
         ├─────────────────────────────────────────┤
         │ productSpecifications.ts                │
         │ getSpecificationsByCategory()           │
         │ (category, subcategory) → SpecField[]   │
         └────────┬────────────────────────────────┘
                  │
                  ▼
      ┌───────────────────────────────────────────┐
      │  Step 4: Render Dynamic Specs Form        │
      ├───────────────────────────────────────────┤
      │  Example: Mobile Phones (14 fields)       │
      │  ┌─────────────────────────────────────┐  │
      │  │ Storage Memory      [dropdown ▼]    │  │
      │  │ RAM Memory          [dropdown ▼]    │  │
      │  │ Processor           [text input]    │  │
      │  │ Display Size        [text input]    │  │
      │  │ Display Type        [dropdown ▼]    │  │
      │  │ Refresh Rate        [dropdown ▼]    │  │
      │  │ Rear Camera         [text input]    │  │
      │  │ Front Camera        [text input]    │  │
      │  │ Battery Capacity    [text input]    │  │
      │  │ Charging Technology [text input]    │  │
      │  │ Operating System    [dropdown ▼]    │  │
      │  │ SIM Slots           [dropdown ▼]    │  │
      │  │ Water Resistance    [dropdown ▼]    │  │
      │  │ Warranty (months)   [number input]  │  │
      │  └─────────────────────────────────────┘  │
      └────────┬──────────────────────────────────┘
               │
               ▼
        ┌────────────────────┐
        │   Vendor Submits   │
        │   Complete Form    │
        └────────┬───────────┘
                 │
                 ▼
      ┌──────────────────────────────────────────┐
      │  Client-Side Validation                  │
      ├──────────────────────────────────────────┤
      │ ✓ Required fields filled                 │
      │ ✓ Numeric fields valid                   │
      │ ✓ Image size < 5MB                       │
      │ ✓ All specs validated                    │
      └────────┬─────────────────────────────────┘
               │
               ▼
         ┌─────────────────┐
         │  Serialize Data │
         ├─────────────────┤
         │ FormData with:  │
         │ • Basic fields  │
         │ • Image file    │
         │ • specs JSON    │
         └────────┬────────┘
                  │
                  ▼
        ┌────────────────────────────────┐
        │  POST /api/products            │
        ├────────────────────────────────┤
        │ Headers: multipart/form-data   │
        └────────┬───────────────────────┘
                 │
                 ▼
    ┌─────────────────────────────────────────┐
    │  API Route (app/api/products/route.ts)  │
    ├─────────────────────────────────────────┤
    │ 1. Parse FormData                       │
    │ 2. Extract fields                       │
    │ 3. Parse specifications JSON            │
    │ 4. Validate all data                    │
    │ 5. Upload image to Cloudinary           │
    │ 6. Save to MongoDB                      │
    │ 7. Return 201 response                  │
    └────────┬────────────────────────────────┘
             │
             ├──────────────────┬──────────────────┐
             ▼                  ▼                  ▼
    ┌──────────────────┐ ┌──────────────┐ ┌──────────────────┐
    │    Cloudinary    │ │   MongoDB    │ │   API Response   │
    ├──────────────────┤ ├──────────────┤ ├──────────────────┤
    │ Uploads image    │ │ Saves docs:  │ │ Returns:         │
    │ Returns URL      │ │              │ │ • Product ID     │
    │                  │ │ {            │ │ • Status 201     │
    │ https://res.     │ │   _id,       │ │ • All product    │
    │ cloudinary.com/  │ │   name,      │ │   data           │
    │ opnmart/...      │ │   specs: {   │ │ • Image URL      │
    │                  │ │     ...      │ │ • Specs object   │
    │                  │ │   },         │ │                  │
    │                  │ │   image,     │ │                  │
    │                  │ │   created    │ │                  │
    │                  │ │ }            │ │                  │
    └──────────────────┘ └──────────────┘ └──────────────────┘


┌────────────────────────────────────────────────────────────────────────────┐
│                        BUYER PRODUCT VIEW FLOW                             │
└────────────────────────────────────────────────────────────────────────────┘

              ┌────────────────────────────┐
              │  Browse Product Page       │
              │  or Search Results         │
              └────────┬───────────────────┘
                       │
                       ▼
              ┌────────────────────────────┐
              │  Click Product Card        │
              └────────┬───────────────────┘
                       │
                       ▼
        ┌──────────────────────────────────────┐
        │  GET /products/[id]                  │
        │  (Product Detail Page)               │
        └────────┬───────────────────────────────┘
                 │
                 ▼
       ┌────────────────────────────┐
       │  Fetch from MongoDB        │
       ├────────────────────────────┤
       │ _id, name, description,    │
       │ price, image,              │
       │ category, subcategory,     │
       │ brand, rating, reviews,    │
       │ *** specifications ***     │
       └────────┬───────────────────┘
                │
                ▼
    ┌─────────────────────────────────────┐
    │  Product Detail Page Renders        │
    ├─────────────────────────────────────┤
    │ ┌─────────────────────────────────┐ │
    │ │  Product Image                  │ │
    │ └─────────────────────────────────┘ │
    │                                     │
    │ ┌─────────────────────────────────┐ │
    │ │ Name: Samsung Galaxy A13        │ │
    │ │ Price: ₦85,000                  │ │
    │ │ Rating: ⭐⭐⭐⭐⭐ (256 reviews)  │ │
    │ └─────────────────────────────────┘ │
    │                                     │
    │ ┌──────────────────────────────────┐│
    │ │ ⚙️ KEY SPECIFICATIONS (NEW!)     ││
    │ ├──────────────────────────────────┤│
    │ │ Storage Memory      64GB         ││
    │ │ RAM Memory          4GB          ││
    │ │ Processor           Snapdragon   ││
    │ │ Display Size        6.1"         ││
    │ │ Display Type        IPS LCD      ││
    │ │ Refresh Rate        60Hz         ││
    │ │ Rear Camera         50MP + 2MP   ││
    │ │ Front Camera        5MP          ││
    │ │ Battery             5000mAh      ││
    │ │ Charging            15W Fast     ││
    │ │ OS                  Android      ││
    │ │ SIM Slots           Dual         ││
    │ │ Water Resistance    None         ││
    │ │ Warranty            12 months    ││
    │ └──────────────────────────────────┘│
    │                                     │
    │ ┌──────────────────────────────────┐│
    │ │ Description: Amazing phone...   ││
    │ │ Vendor: TechStore XYZ           ││
    │ │ Reviews & Ratings               ││
    │ │ [Add to Cart] Button             ││
    │ └──────────────────────────────────┘│
    └─────────────────────────────────────┘


┌────────────────────────────────────────────────────────────────────────────┐
│                          DATABASE STRUCTURE                                │
└────────────────────────────────────────────────────────────────────────────┘

Product Collection:
{
  "_id": ObjectId("..."),
  
  // Basic Info (existing)
  "name": "Samsung Galaxy A13",
  "description": "Amazing phone with great specs",
  "brand": "Samsung",
  "category": "electronics",
  "subcategory": "mobile_phones",
  "price": 85000,
  "oldPrice": 95000,
  "stock": 50,
  "condition": "Brand New",
  "badge": "Hot Deal",
  "rating": 4.5,
  "reviews": 256,
  "sold": 142,
  "image": "https://res.cloudinary.com/...",
  "imagePublicId": "opnmart/products/...",
  "vendorId": "vendor-1",
  
  // NEW: Specifications
  "specifications": {
    "memory_storage": "64GB",
    "ram": "4GB",
    "processor": "Snapdragon 680",
    "display_size": "6.1 inches",
    "display_type": "IPS LCD",
    "refresh_rate": "60Hz",
    "rear_camera": "50MP + 2MP",
    "front_camera": "5MP",
    "battery_capacity": "5000mAh",
    "charging": "15W Fast Charging",
    "operating_system": "Android",
    "sim_slots": "Dual SIM",
    "water_resistance": "None",
    "warranty_months": 12
  },
  
  // Timestamps
  "createdAt": ISODate("2024-12-03T10:30:00Z"),
  "updatedAt": ISODate("2024-12-03T10:30:00Z")
}


┌────────────────────────────────────────────────────────────────────────────┐
│                        COMPONENT HIERARCHY                                 │
└────────────────────────────────────────────────────────────────────────────┘

App Layout
├── ProductProvider (Context)
│   └── Products State & Methods
│
├── Home Page (/page.tsx)
│   ├── ProductUploadModal
│   │   ├─ Category Select
│   │   ├─ Subcategory Select
│   │   ├─ Dynamic Specifications Fields
│   │   │   ├─ Text Inputs
│   │   │   ├─ Number Inputs
│   │   │   ├─ Select Dropdowns
│   │   │   └─ Textareas
│   │   ├─ Image Upload
│   │   └─ Form Submission
│   │
│   └── Product Grid
│       └── Product Cards
│
├── Product Detail Page (/products/[id])
│   ├── Product Image
│   ├── Product Info
│   ├── SpecificationsDisplay (NEW!)
│   │   └─ Renders specs in grid layout
│   ├── Reviews
│   └── Add to Cart


┌────────────────────────────────────────────────────────────────────────────┐
│                         FILE ORGANIZATION                                  │
└────────────────────────────────────────────────────────────────────────────┘

opnmart/
├── config/
│   └── productSpecifications.ts (NEW) ← Central spec config
│
├── components/
│   ├── ProductUploadModal.tsx (UPDATED) ← Dynamic form
│   └── SpecificationsDisplay.tsx (NEW) ← Spec display
│
├── models/
│   └── Product.ts (UPDATED) ← Added specs field
│
├── app/
│   ├── page.tsx ← Home page
│   ├── products/
│   │   └── [id]/
│   │       └── page.tsx ← Product detail
│   │
│   └── api/
│       └── products/
│           └── route.ts (UPDATED) ← API with specs
│
├── DYNAMIC_FORM_GUIDE.md (NEW)
├── SPECS_QUICK_REFERENCE.md (NEW)
├── DYNAMIC_FORM_IMPLEMENTATION.md (NEW)
└── FORM_COMPLETE_SUMMARY.md (NEW)


┌────────────────────────────────────────────────────────────────────────────┐
│                           DATA FLOW SUMMARY                                │
└────────────────────────────────────────────────────────────────────────────┘

VENDOR SIDE:
  [Select Category] → [Select Subcategory] → [Dynamic Specs Appear]
       ↓                    ↓                         ↓
  "Electronics"      "Mobile Phones"      [14 phone spec fields]
       ↓
  [Fill All Fields + Specs]
       ↓
  [Submit Form]
       ↓
  [POST /api/products with all data]
       ↓
  [Upload image to Cloudinary]
       ↓
  [Save product + specs to MongoDB]
       ↓
  ✅ SUCCESS - Product saved with all specifications


BUYER SIDE:
  [Browse/Search Products]
       ↓
  [Click Product]
       ↓
  [Load Product Page]
       ↓
  [Fetch from Database: product data + specifications]
       ↓
  [Render ProductDetail + SpecificationsDisplay]
       ↓
  ⚙️ DISPLAY: All product specs beautifully formatted
       ↓
  [Buyer sees complete product info]
       ↓
  ✅ Informed decision - Add to cart or continue browsing


SEARCH/FILTER SIDE (Future):
  [User: Find phones with 6GB+ RAM]
       ↓
  [Search: category=electronics, subcategory=mobile_phones, specs.ram>=6GB]
       ↓
  [Query MongoDB: specs.ram field]
       ↓
  [Return matching products]
       ↓
  [Display with filters applied]
       ↓
  ✅ Smart shopping - Find exactly what you need
```

---

## Summary

This complete system provides:

1. **Dynamic Forms** - Different fields for different products
2. **Comprehensive Specs** - 100+ specifications defined
3. **Database Integration** - Specs stored with products
4. **Beautiful Display** - Specs rendered professionally
5. **Full Validation** - Client & server-side checks
6. **Future-Ready** - Built for search/filtering/comparison
