# Product Specifications - Quick Reference

## Overview

The product upload form now dynamically shows different specification fields based on what the vendor is uploading.

## Product Types & Their Key Specs

### 📱 Mobile Phones
- Storage (32GB - 1TB)
- RAM (2GB - 16GB)
- Processor (e.g., Snapdragon 8 Gen 1)
- Display Size & Type (AMOLED, IPS LCD)
- Refresh Rate (60Hz - 165Hz)
- Camera (Rear & Front with MP)
- Battery Capacity & Charging Tech
- Operating System (Android/iOS)
- Water Resistance (IP67/IP68)
- Warranty Period

### 💻 Laptops
- Processor (e.g., Intel Core i9, Apple M2)
- CPU Cores (4-20 cores)
- RAM (4GB - 64GB)
- Storage Type (SSD/HDD/Hybrid)
- Storage Capacity (256GB - 4TB)
- Graphics Card (Discrete or Integrated)
- Display (Size, Resolution, Refresh Rate)
- Operating System (Windows/macOS/Linux)
- Battery Life (in hours)
- Weight
- Warranty

### 📷 Cameras
- Camera Type (DSLR, Mirrorless, Point & Shoot)
- Megapixels (Sensor Resolution)
- Sensor Size (1/2.3", APS-C, Full Frame)
- ISO Range (sensitivity)
- Maximum Aperture (f-stop)
- Focal Length (zoom range)
- Video Resolution (1080p - 8K)
- Autofocus Points
- Shutter Speed Range
- Connectivity (Wi-Fi, Bluetooth, USB-C)
- Battery Type
- Dimensions & Weight
- Warranty

### 🎧 Headphones
- Type (Over-ear, On-ear, In-ear, Earbuds)
- Connection (Wired, Bluetooth 5.0-5.2)
- Driver Size (e.g., 40mm)
- Frequency Response (20Hz - 20kHz)
- Impedance (Ohms)
- Battery Life (for wireless)
- Noise Cancellation (None, Passive, Active, Hybrid)
- Weight
- Warranty

### 📱 Tablets
- Processor
- RAM (2GB - 12GB)
- Storage (32GB - 512GB)
- Display Size & Type
- Display Refresh Rate
- Operating System (iPadOS, Android, Windows)
- Battery Life
- Connectivity

### 🔊 Speakers
- Type (Portable, Home Theater, Bookshelf, Floor Standing)
- Power Output (in Watts)
- Driver Count
- Frequency Response
- Connectivity (Bluetooth, Wi-Fi, 3.5mm)
- Waterproof Rating (IPX4, IPX7, None)

### 🔋 Power Banks
- Capacity (mAh)
- Output Ports (USB-A, USB-C count)
- Input Charging
- Fast Charging Support
- LED Display (Yes/No)
- Weight

### 🎤 Microphones
- Type
- Connector Type
- Frequency Response
- Pickup Pattern
- Impedance
- Sensitivity
- Weight

### 🧊 Refrigerators
- Capacity (Liters)
- Type (Single/Double/Triple Door)
- Cooling Technology
- Energy Rating (1-5 Star)
- Warranty (Years)

### ⚡ Generators
- Power Output (kVA)
- Fuel Type (Petrol/Diesel/Gas/Dual Fuel)
- Fuel Tank (Liters)
- Runtime (Hours on full tank)
- Noise Level (dB)
- Warranty (Years)

### 🛋️ Sofas
- Seating Capacity (2-5 seater)
- Material (Leather, Fabric, Suede, Microfiber, Velvet)
- Color
- Width & Depth (cm)
- Reclining Feature (Manual/Electric/None)

### 🛏️ Beds
- Bed Size (Single, Double, Queen, King)
- Frame Material (Wood, Metal, Upholstered)
- Storage Options
- Mattress Included

### 🥬 Fresh Produce
- Produce Type (Fruits, Vegetables, Leafy Greens, Roots)
- Origin/Source
- Organic Certified
- Shelf Life (Days)

### 🥛 Dairy & Eggs
- Product Type (Milk, Cheese, Yogurt, Butter, Eggs)
- Fat Content (Full/Low/Skimmed)
- Pasteurized (Yes/No)

## How It Works

1. **Vendor selects Category** → Form shows all subcategories
2. **Vendor selects Subcategory** → Form automatically populates with relevant specification fields
3. **Vendor fills specifications** → Each field has validation and help text
4. **Vendor submits** → All specs saved to database with product
5. **Specifications display** → Product detail page shows all specs in organized format

## Example: Uploading a Laptop

```
Step 1: Fill Basic Info
- Name: "Dell XPS 13 Plus"
- Description: "Powerful ultrabook..."
- Brand: "Dell"
- Price: ₦1,200,000
- Stock: 5

Step 2: Select Category
- Category: Electronics

Step 3: Select Subcategory
- Subcategory: Laptops
→ Form auto-shows laptop specs

Step 4: Fill Specifications (NEW!)
- Processor: "Intel Core i7 13th Gen"
- CPU Cores: 10
- RAM: 16GB
- Storage Type: SSD
- Storage Capacity: 512GB
- Graphics Card: "Intel Iris Xe"
- Display Size: "13.3 inches"
- Display Resolution: "2560x1440"
- Refresh Rate: "90Hz"
- OS: "Windows 11"
- Battery Life: 12 hours
- Weight: 1.2 kg
- Warranty: 12 months

Step 5: Upload Image & Submit
- All data saved, including all specs!
```

## Database Storage

Specifications stored as JSON object:
```json
{
  "_id": "...",
  "name": "Dell XPS 13 Plus",
  "specifications": {
    "processor": "Intel Core i7 13th Gen",
    "processor_cores": "10",
    "ram": "16GB",
    "storage_type": "SSD",
    "storage_capacity": "512GB",
    "graphics_card": "Intel Iris Xe",
    "display_size": "13.3 inches",
    "display_resolution": "2560x1440",
    "refresh_rate": "90Hz",
    "operating_system": "Windows 11",
    "battery_hours": 12,
    "weight_kg": 1.2,
    "warranty_months": 12
  }
}
```

## Frontend Display

Specifications display in product detail pages:

```
⚙️ Key Specifications

Processor         → Intel Core i7 13th Gen
CPU Cores         → 10
RAM Memory        → 16GB
Storage Type      → SSD
Storage Capacity  → 512GB
Graphics Card     → Intel Iris Xe
Display Size      → 13.3 inches
Display Resolution → 2560x1440
Refresh Rate      → 90Hz
Operating System  → Windows 11
Battery Life      → 12 hours
Weight            → 1.2 kg
Warranty Period   → 12 months
```

## Benefits

✅ **Better Shopping Experience** - Buyers know exactly what they're getting
✅ **Comprehensive Listings** - No missing important details
✅ **Easy Comparison** - See specs of similar products side-by-side
✅ **Standardized Data** - Specs follow a consistent format
✅ **Searchability** - Filter by specs (coming soon)
✅ **Reduced Returns** - Specs match expectations

## Integration Points

### For Product Detail Page
```tsx
import SpecificationsDisplay from '@/components/SpecificationsDisplay';

<SpecificationsDisplay
  category={product.category}
  subcategory={product.subcategory}
  specifications={product.specifications}
/>
```

### For API
- POST `/api/products` - Includes `specifications` JSON
- GET `/api/products` - Returns `specifications` for each product

### For Database
- Field: `specifications` (type: Schema.Types.Mixed)
- Stores: Any JSON object with spec key-value pairs
- Optional: Can be null/empty for simple products

## Files Modified

1. ✅ `config/productSpecifications.ts` - NEW: All spec definitions
2. ✅ `components/ProductUploadModal.tsx` - UPDATED: Dynamic form fields
3. ✅ `components/SpecificationsDisplay.tsx` - NEW: Spec display component
4. ✅ `models/Product.ts` - UPDATED: Added specifications field
5. ✅ `app/api/products/route.ts` - UPDATED: Handle spec data

## Next Steps

1. Test uploading a product with specs
2. Verify specs display correctly
3. Add search/filter by specs
4. Add spec comparison feature
5. Create spec import/export for bulk uploads
