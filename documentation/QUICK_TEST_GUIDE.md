# Quick Test: Check if Database Has Products

## ⚡ 30-Second Diagnostic

### 1. Start your dev server (if not running):
```powershell
npm run dev
```

### 2. In PowerShell, check if products exist:
```powershell
$response = Invoke-WebRequest -Uri "http://localhost:3000/api/products" -UseBasicParsing
$data = $response.Content | ConvertFrom-Json
Write-Host "Status: $($response.StatusCode)"
Write-Host "Products count: $($data.count)"
Write-Host "First product: $($data.products[0].name)" -ForegroundColor Cyan
```

### 3. If count is 0:
Products don't exist yet! Create them with:
```powershell
node test-products.js
```

### 4. If count > 0:
Products exist! Test detail page by:
1. Open browser: http://localhost:3000
2. Press F12 (DevTools) → Console tab
3. Click any product
4. Should see logs: "Fetching product with ID..." → "API response status: 200"

---

## 🔍 What Each Code Does

### ProductContext Logging (app/context/ProductContext.tsx)
When component mounts, logs:
```
"Fetching products from /api/products"
"Products API response: { status: 200, count: 5, products: [...] }"
"Mapped products: [...]"
```

### Product Detail Page Logging (app/products/[id]/page.tsx)
When you visit `/products/[id]`, logs:
```
"Fetching product with ID: 6756abc123..."
"API response status: 200" + { product data }
"Product found: { name, price, ... }"
```

---

## 📊 Expected vs Actual

### ✅ GOOD (Products exist)
```
Status: 200
Products count: 5
First product: Samsung Galaxy S24 Ultra
```

### ❌ BAD (No products)
```
Status: 200
Products count: 0
First product:
```

---

## 🚀 To Create Test Products

```powershell
# Make sure dev server is running
npm run dev

# In another terminal:
node test-products.js
```

This will:
1. Create 5 sample products
2. Upload images to Cloudinary
3. Save to MongoDB
4. Display success messages

---

## 🎯 After Creating Products

1. **Reload homepage** (http://localhost:3000)
2. **Should see** product grid with items
3. **Click any product** → loads detail page
4. **Check console** for logs showing success

---

## 💡 How to Tell If It's Working

### Homepage Level
- [ ] Page loads without errors
- [ ] Console shows "Fetching products..."
- [ ] Products display in grid
- [ ] Each product is different

### Product Detail Level  
- [ ] Clicking product navigates to `/products/[id]`
- [ ] Detail page loads without 404
- [ ] Console shows product fetch logs
- [ ] All product info displays correctly
- [ ] Images load properly

---

## ❓ If Still Not Working

1. **Check dev server console** for any error messages
2. **Check browser console** (F12) for network errors
3. **Verify MongoDB connection**: 
   - Is `.env.local` set with `MONGODB_URI`?
   - Can you connect to MongoDB Atlas?
4. **Check Cloudinary setup**:
   - Are credentials in `.env.local`?
   - Are they correct?

---

## 📝 Files That Handle This

| File | What It Does |
|------|-------------|
| `app/context/ProductContext.tsx` | Fetches all products, logs response |
| `app/products/[id]/page.tsx` | Fetches single product, logs response |
| `app/api/products/route.ts` | GET handler returns all products |
| `app/api/products/[id]/route.ts` | GET handler returns single product |

All of these are **verified working** ✅

The issue is **ONLY** that the database is empty.

---

## 🎬 Full Test Workflow

```powershell
# Terminal 1: Start dev server
npm run dev

# Terminal 2: Run test script
node test-products.js

# Terminal 3: Browser
# 1. Open http://localhost:3000
# 2. Press F12 for console
# 3. See product list load
# 4. Click a product
# 5. See detail page with logs
```

**Expected time to complete**: ~2 minutes

---

## Success = ✅ 

When working correctly:
- ✅ Products show on homepage
- ✅ Each product is unique
- ✅ Clicking opens detail page
- ✅ Detail page shows all information
- ✅ No "Product not found" errors
- ✅ All images display

**You're done!** System is fully functional.
