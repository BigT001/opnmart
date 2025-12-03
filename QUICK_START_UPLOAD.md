# 🚀 QUICK START - Get Product Upload Working in 5 Minutes

## ⚡ The Issue
Your app is missing the `.env.local` file with Cloudinary and MongoDB credentials.

## ✅ Solution

### 1️⃣ Create `.env.local` File (2 minutes)

In your project root, create a file named `.env.local`:

```
Root folder (c:\Users\HomePC\Desktop\opnmart\)
├── package.json
├── .env.local  ← CREATE THIS FILE
├── app/
├── components/
└── ...
```

### 2️⃣ Get Cloudinary Credentials (2 minutes)

1. Go to [cloudinary.com](https://cloudinary.com) → Sign up (free)
2. In dashboard, find **Cloud Name** at the top (e.g., `dv4z5wxyz`)
3. Go to Settings → Upload → Upload presets
4. Click "Add upload preset" with these settings:
   - Name: `opnmart_unsigned`
   - Signing Mode: **Unsigned** (IMPORTANT!)
   - Folder: `opnmart/products`
   - Click Save

### 3️⃣ Get MongoDB Credentials (1 minute)

1. Go to [mongodb.com/cloud/atlas](https://mongodb.com/cloud/atlas) → Sign up (free)
2. Create Cluster:
   - Free tier (M0)
   - Name: `opnmart-cluster`
   - Region: US East (or closest)
   - Create Cluster
3. Create Database User:
   - Settings → Database Access → Add User
   - Username: `opnmart_admin`
   - Password: (generate strong one, save it!)
   - Make it admin, save
4. Allow IP access:
   - Settings → Network Access → Add IP
   - Choose "Allow access from anywhere"
5. Get Connection String:
   - Clusters → Connect → Drivers → Node.js
   - Copy connection string
   - Replace `<password>` with your password

### 4️⃣ Fill `.env.local` with Your Credentials

```dotenv
# Copy this into your .env.local file, replacing the values:

MONGODB_URI=mongodb+srv://opnmart_admin:YOUR_PASSWORD@opnmart-cluster.mongodb.net/opnmart?retryWrites=true&w=majority

NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=your_cloud_name_here

NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET=opnmart_unsigned
```

**Example (DO NOT COPY - USE YOUR OWN VALUES):**
```dotenv
MONGODB_URI=mongodb+srv://opnmart_admin:MyPassword123@opnmart-cluster.mongodb.net/opnmart?retryWrites=true&w=majority

NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=dv4z5wxyz

NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET=opnmart_unsigned
```

### 5️⃣ Restart Your App

```powershell
# Stop current npm run dev (Ctrl+C)
# Then:
npm run dev
```

---

## 🧪 Test It Works

1. Go to: `http://localhost:3000/dashboards/vendor`
2. Click "Upload New Product"
3. Fill the form:
   - Name: "Test Phone"
   - Description: "A nice test phone"
   - Category: Electronics
   - Subcategory: Mobile Phones
   - Brand: Samsung
   - Price: 100000
   - Stock: 5
   - Select any image
4. Click "Upload Product"

### ✅ If it works:
- Product appears on vendor dashboard
- Go to homepage → see product
- Refresh page → product still there
- Check Cloudinary Media Library → image appears

### ❌ If it fails:
- Read `TROUBLESHOOTING_UPLOAD_ERRORS.md`
- Check terminal for error messages
- Press F12 in browser → Console tab → see errors

---

## 📋 What Each Variable Does

| Variable | What It Is | Where From |
|----------|-----------|-----------|
| `MONGODB_URI` | Database connection | MongoDB Atlas → Connect button |
| `NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME` | Your Cloudinary account | Cloudinary dashboard top-right |
| `NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET` | Upload settings | Cloudinary → Settings → Upload |

---

## 🔗 Links

- MongoDB: https://www.mongodb.com/cloud/atlas
- Cloudinary: https://cloudinary.com
- Full Setup: See `ENV_SETUP_GUIDE.md`
- Troubleshooting: See `TROUBLESHOOTING_UPLOAD_ERRORS.md`

---

## ⏱️ How Long Does This Take?

- Creating `.env.local` → 1 minute
- Getting Cloudinary credentials → 2 minutes
- Getting MongoDB credentials → 2 minutes  
- Testing → 1 minute

**Total: ~6 minutes!**

---

## 💡 Tips

- Save each credential as you get it
- Copy the exact connection string from MongoDB
- Make sure Upload Preset signing mode is "Unsigned"
- Restart `npm run dev` after creating `.env.local`
- Hard refresh browser (Ctrl+Shift+R) after restarting app

