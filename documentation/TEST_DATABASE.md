# 🗄️ Mongoose Database - Step-by-Step Testing Guide

## Step 1: Start the Development Server

```bash
# Navigate to project directory
cd c:\Users\HomePC\Desktop\opnmart

# Start Next.js dev server
npm run dev
```

Expected output:
```
▲ Next.js 16.0.6
✓ Ready in 1.2s
✓ API routes ready
✓ Listening on http://localhost:3000
```

---

## Step 2: Verify Database Connection Status

Check current seeding status:

```bash
# Using PowerShell
Invoke-WebRequest -Uri "http://localhost:3000/api/seed" -Method Get

# Using curl (if available)
curl http://localhost:3000/api/seed

# Expected response:
{
  "success": true,
  "seeded": false,
  "counts": {
    "categories": 0,
    "subcategories": 0,
    "filters": 0
  }
}
```

---

## Step 3: Seed the Database

**This is the critical step** - it will populate MongoDB with all categories, subcategories, and filters:

```bash
# Using PowerShell
Invoke-WebRequest -Uri "http://localhost:3000/api/seed" -Method Post

# Using curl
curl -X POST http://localhost:3000/api/seed

# Expected response (SUCCESS):
{
  "success": true,
  "message": "Database seeded successfully!",
  "data": {
    "categories": {
      "count": 2,
      "items": ["electronics", "appliances"]
    },
    "subcategories": {
      "count": 18,
      "byCategory": {
        "electronics": 13,
        "appliances": 5
      }
    },
    "filters": {
      "count": 8,
      "byCategory": {
        "electronics": 4,
        "appliances": 4
      }
    }
  }
}
```

---

## Step 4: Verify Seeding Was Successful

```bash
# Check status again (should now show seeded: true)
curl http://localhost:3000/api/seed

# Expected response:
{
  "success": true,
  "seeded": true,
  "counts": {
    "categories": 2,
    "subcategories": 18,
    "filters": 8
  }
}
```

---

## Step 5: Query Categories API

Get all marketplace categories:

```bash
curl http://localhost:3000/api/categories

# Expected response:
{
  "success": true,
  "data": [
    {
      "_id": "...",
      "id": "electronics",
      "name": "Electronics",
      "icon": "📱",
      "description": "Electronic devices and gadgets",
      "isActive": true,
      "displayOrder": 0,
      "createdAt": "2024-...",
      "updatedAt": "2024-..."
    },
    {
      "_id": "...",
      "id": "appliances",
      "name": "Home & Appliances",
      "icon": "🏠",
      "description": "Home appliances and accessories",
      "isActive": true,
      "displayOrder": 1,
      "createdAt": "2024-...",
      "updatedAt": "2024-..."
    }
  ],
  "count": 2
}
```

---

## Step 6: Query Subcategories

Get subcategories for Electronics:

```bash
# All subcategories
curl http://localhost:3000/api/subcategories

# Electronics subcategories only
curl "http://localhost:3000/api/subcategories?categoryId=electronics"

# Expected response:
{
  "success": true,
  "data": [
    {
      "_id": "...",
      "id": "mobile_phones",
      "categoryId": "electronics",
      "name": "Mobile Phones",
      "icon": "📱",
      "isActive": true,
      "displayOrder": 0,
      "createdAt": "2024-...",
      "updatedAt": "2024-..."
    },
    // ... 12 more electronics subcategories
  ],
  "count": 13,
  "categoryId": "electronics"
}
```

---

## Step 7: Query Filters

Get filters for Electronics category:

```bash
# Filters for electronics category
curl "http://localhost:3000/api/filters?categoryId=electronics"

# Filters for specific subcategory
curl "http://localhost:3000/api/filters?categoryId=electronics&subcategoryId=mobile_phones"

# Expected response:
{
  "success": true,
  "data": [
    {
      "_id": "...",
      "id": "brand",
      "categoryId": "electronics",
      "name": "Brand",
      "type": "select",
      "options": [
        { "value": "samsung", "label": "Samsung", "count": null },
        { "value": "apple", "label": "Apple", "count": null },
        { "value": "lg", "label": "LG", "count": null },
        // ... more brands
      ],
      "isActive": true,
      "displayOrder": 0,
      "createdAt": "2024-...",
      "updatedAt": "2024-..."
    },
    // ... more filters (Condition, Price, Warranty)
  ],
  "count": 4,
  "categoryId": "electronics"
}
```

---

## Step 8: Verify in MongoDB Atlas

1. Go to [MongoDB Atlas Dashboard](https://cloud.mongodb.com)
2. Login with your credentials
3. Navigate to **Cluster0 → Collections**
4. Verify these collections exist:
   - `categories` (2 documents)
   - `subcategories` (18 documents)
   - `filters` (8 documents)

---

## ✅ Full Success Checklist

After completing all steps, verify:

- [ ] Development server running at http://localhost:3000
- [ ] Seeding endpoint returns `success: true`
- [ ] Categories API returns 2 categories
- [ ] Subcategories API returns 18 subcategories
- [ ] Filters API returns 8 filters
- [ ] MongoDB Atlas shows 3 collections with correct document counts
- [ ] All API responses have valid JSON structure
- [ ] No console errors in terminal

---

## 🧪 PowerShell Testing Script

Save this as `test-db.ps1`:

```powershell
# Test MongoDB Database Setup

Write-Host "`n🔍 Testing Mongoose Database Setup`n" -ForegroundColor Green

$baseUrl = "http://localhost:3000/api"

# Test 1: Check seeding status
Write-Host "Test 1: Check Seeding Status" -ForegroundColor Cyan
try {
    $response = Invoke-WebRequest -Uri "$baseUrl/seed" -Method Get -ErrorAction Stop
    $json = $response.Content | ConvertFrom-Json
    if ($json.success) {
        Write-Host "✅ Seeding status: $($json.seeded)" -ForegroundColor Green
        Write-Host "   Categories: $($json.counts.categories)" -ForegroundColor Gray
        Write-Host "   Subcategories: $($json.counts.subcategories)" -ForegroundColor Gray
        Write-Host "   Filters: $($json.counts.filters)" -ForegroundColor Gray
    }
} catch {
    Write-Host "❌ Failed to check seeding status" -ForegroundColor Red
}

# Test 2: Seed database (if not already seeded)
Write-Host "`nTest 2: Seed Database" -ForegroundColor Cyan
try {
    $response = Invoke-WebRequest -Uri "$baseUrl/seed" -Method Post -ErrorAction Stop
    $json = $response.Content | ConvertFrom-Json
    if ($json.success) {
        Write-Host "✅ Database seeded successfully" -ForegroundColor Green
        Write-Host "   Categories: $($json.data.categories.count)" -ForegroundColor Gray
        Write-Host "   Subcategories: $($json.data.subcategories.count)" -ForegroundColor Gray
        Write-Host "   Filters: $($json.data.filters.count)" -ForegroundColor Gray
    }
} catch {
    Write-Host "❌ Seeding failed (might already be seeded)" -ForegroundColor Yellow
}

# Test 3: Get categories
Write-Host "`nTest 3: Query Categories" -ForegroundColor Cyan
try {
    $response = Invoke-WebRequest -Uri "$baseUrl/categories" -Method Get -ErrorAction Stop
    $json = $response.Content | ConvertFrom-Json
    if ($json.success) {
        Write-Host "✅ Found $($json.count) categories:" -ForegroundColor Green
        $json.data | ForEach-Object {
            Write-Host "   - $($_.icon) $($_.name)" -ForegroundColor Gray
        }
    }
} catch {
    Write-Host "❌ Failed to query categories" -ForegroundColor Red
}

# Test 4: Get subcategories
Write-Host "`nTest 4: Query Electronics Subcategories" -ForegroundColor Cyan
try {
    $response = Invoke-WebRequest -Uri "$baseUrl/subcategories?categoryId=electronics" -Method Get -ErrorAction Stop
    $json = $response.Content | ConvertFrom-Json
    if ($json.success) {
        Write-Host "✅ Found $($json.count) Electronics subcategories:" -ForegroundColor Green
        $json.data | ForEach-Object {
            Write-Host "   - $($_.icon) $($_.name)" -ForegroundColor Gray
        }
    }
} catch {
    Write-Host "❌ Failed to query subcategories" -ForegroundColor Red
}

# Test 5: Get filters
Write-Host "`nTest 5: Query Electronics Filters" -ForegroundColor Cyan
try {
    $response = Invoke-WebRequest -Uri "$baseUrl/filters?categoryId=electronics" -Method Get -ErrorAction Stop
    $json = $response.Content | ConvertFrom-Json
    if ($json.success) {
        Write-Host "✅ Found $($json.count) filters:" -ForegroundColor Green
        $json.data | ForEach-Object {
            Write-Host "   - $($_.name) ($($_.type))" -ForegroundColor Gray
        }
    }
} catch {
    Write-Host "❌ Failed to query filters" -ForegroundColor Red
}

Write-Host "`n✅ Testing complete!`n" -ForegroundColor Green
```

Run it:
```powershell
.\test-db.ps1
```

---

## 🔧 Troubleshooting

### Issue: "Connection refused" error
**Solution**: Make sure dev server is running (`npm run dev`)

### Issue: "MONGODB_URI not found" error
**Solution**: Check `.env.local` has `MONGODB_URI=mongodb+srv://...`

### Issue: "Cannot seed database" error
**Solution**: 
1. Check MongoDB Atlas connection is valid
2. Verify network access in MongoDB Atlas
3. Check database credentials

### Issue: Already seeded, want to reseed
**Solution**: Clear and reseed:
```bash
# The seed endpoint has built-in protection
# To force reseed, you must manually clear MongoDB collections
# Via MongoDB Atlas:
# 1. Go to Collections
# 2. Delete each collection
# 3. Then POST to /api/seed again
```

---

## 📊 Expected Data Structure

### Electronics (13 subcategories)
```
Mobile Phones → Brands: Samsung, Apple, Xiaomi, ...
Phone Accessories → Brands: Tech21, OtterBox, ...
Laptops → Brands: Dell, HP, Lenovo, ...
Desktop Computers
Computer Accessories
Tablets
Audio & Music
Gaming
Cameras
Networking
Smart Gadgets
Office Electronics
Power & Energy
```

### Appliances (5 subcategories)
```
Air Conditioners → Types: Split, Standing, Window, ...
Refrigerators & Freezers
Generators & Power Solutions
Kitchen Appliances
Home Appliances
```

### Filters (8 total)
Each category gets 4 filters:
1. **Brand** - Select type with brand options
2. **Condition** - Select (Brand New, Like New, Used, Refurbished)
3. **Price Range** - Range type (₦0-10k, ₦10k-50k, ₦50k+, etc.)
4. **Warranty** - Select (No Warranty, 1-Year, 2-Year, 3-Year+)

---

**Status**: ✅ Mongoose setup complete and ready for testing
**Next**: Run this testing guide to verify the database is functional
