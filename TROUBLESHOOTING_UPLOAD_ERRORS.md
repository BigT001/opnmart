# Quick Troubleshooting Checklist

## If you see "Failed to upload image to Cloudinary"

Follow these steps in order:

### 1. Check Your `.env.local` File Exists
```powershell
Test-Path -Path "c:\Users\HomePC\Desktop\opnmart\.env.local"
```
- If it says `False`, you need to create it. See **ENV_SETUP_GUIDE.md**

### 2. Verify Environment Variables Are Set

Open `.env.local` and check these three lines are present and filled in:

```dotenv
MONGODB_URI=mongodb+srv://opnmart_admin:YOUR_PASSWORD@opnmart-cluster.mongodb.net/opnmart?retryWrites=true&w=majority

NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=your_cloud_name_here

NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET=your_upload_preset_here
```

**Each line must have an actual value, not just placeholder text.**

### 3. Restart Dev Server

Stop and restart your Next.js dev server to load the updated environment variables:

```powershell
npm run dev
```

### 4. Check Browser Console

Open your browser:
- Press `F12` → "Console" tab
- Try uploading again
- Look for detailed error message in the console

### 5. Check Server Terminal

Look at the terminal where `npm run dev` is running:
- Search for "Missing Cloudinary credentials"
- Search for "Cloudinary upload error"
- The full error details are logged here

### 6. Verify Cloudinary Configuration

Go to your Cloudinary dashboard:

1. **Cloud Name** - [cloudinary.com/console](https://cloudinary.com/console)
   - Should be at the top of your dashboard
   - Copy the exact value

2. **Upload Preset** - Settings → Upload → Upload presets
   - Find the preset you created (e.g., `opnmart_unsigned`)
   - Make sure "Signing Mode" is set to "Unsigned"
   - Make sure Folder is `opnmart/products`

3. **Update `.env.local`** with the correct values

### 7. Verify MongoDB Configuration

Go to your MongoDB Atlas:

1. Check your cluster is running (not paused)
2. Click "Connect" and verify connection string format
3. Make sure password is correctly escaped in the connection string
4. Check IP whitelist allows "0.0.0.0/0" (for development)

---

## Common Issues & Solutions

### Issue: "Missing Cloudinary credentials"
**Solution**: 
- Verify `NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME` and `NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET` are in `.env.local`
- Restart `npm run dev`
- Hard refresh browser (Ctrl+Shift+R or Cmd+Shift+R)

### Issue: "Failed to fetch products" after upload
**Solution**:
- Check `MONGODB_URI` is correct
- Verify MongoDB Atlas cluster is running
- Check IP whitelist in MongoDB Atlas

### Issue: Cloudinary shows "invalid upload preset"
**Solution**:
- Go to Cloudinary Settings → Upload → Upload presets
- Make sure your preset name matches exactly in `.env.local`
- Upload Preset must have "Unsigned" signing mode

### Issue: Image uploaded but doesn't appear on homepage
**Solution**:
- Check MongoDB for the product (it might be saved)
- Refresh page to reload from database
- Check browser console for any JS errors

### Issue: "Missing required fields" error
**Solution**:
- Fill all fields marked with * (asterisk)
- Select an image file
- Check file size is less than 5MB

---

## Testing Steps

After fixing the environment variables:

1. **Start App**: `npm run dev`
2. **Go to Vendor Dashboard**: `http://localhost:3000/dashboards/vendor`
3. **Fill Product Form**:
   - Product Name: Test Product
   - Description: Test description
   - Category: Electronics
   - Subcategory: Mobile Phones
   - Brand: Samsung
   - Price: 100000
   - Stock: 5
   - Select an image
   - Click "Upload Product"

4. **Check Success**:
   - Product appears on vendor dashboard
   - Go to homepage → see product in category
   - Refresh page → product still there
   - Check Cloudinary Media Library → image appears

---

## Files to Check

| File | Purpose |
|------|---------|
| `.env.local` | Environment variables (create from `.env.local.example`) |
| `app/api/products/route.ts` | Backend API that handles uploads |
| `components/ProductUploadModal.tsx` | Frontend form component |
| `models/Product.ts` | MongoDB schema |
| `services/db/mongoose.ts` | Database connection |

---

## Still Having Issues?

1. **Check terminal output** - Look at the `npm run dev` terminal for detailed errors
2. **Check browser console** - Press F12 and look for red error messages
3. **Verify all three services**:
   - MongoDB (via connection string test)
   - Cloudinary (via dashboard check)
   - Environment variables (via `.env.local` content)
4. **Restart everything**:
   - Stop `npm run dev` (Ctrl+C)
   - Verify `.env.local` is saved
   - Run `npm run dev` again
   - Hard refresh browser (Ctrl+Shift+R)

