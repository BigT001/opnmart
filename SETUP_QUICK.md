# Quick Setup - Copy & Paste

## 1️⃣ Create `.env.local` File

In your project root (same folder as `package.json`), create a new file named `.env.local`

## 2️⃣ Copy This Content

```dotenv
MONGODB_URI="mongodb+srv://sta99175_db_user:N_3r6RW#qsrG!P.@cluster0.7igdyfs.mongodb.net/?appName=Cluster0"
MONGODB_DB=opnmart
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME="dy9ueiuhs"
CLOUDINARY_API_KEY="758632447923635"
CLOUDINARY_API_SECRET="RTfwrmnF5UdxkR0w4yuiSo7p0xc"
NEXT_PUBLIC_API_URL=http://localhost:3001/api
NEXT_PUBLIC_APP_NAME=OpenMart
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

## 3️⃣ Save File

File should be at: `c:\Users\HomePC\Desktop\opnmart\.env.local`

## 4️⃣ Restart Dev Server

```powershell
# In PowerShell:
npm run dev
```

## 5️⃣ Test Upload

1. Open browser: `http://localhost:3000/dashboards/vendor`
2. Click "Upload New Product"
3. Fill all fields and select an image
4. Click "Upload Product"

### ✅ If it works:
- Product appears on vendor dashboard
- Go to homepage → see product in category
- Refresh → product still there

### ❌ If it fails:
- Press F12 in browser
- Look in Console tab for error message
- Check terminal for detailed logs

---

## Done! 🎉

Your product upload system is now fully configured and ready to use!

