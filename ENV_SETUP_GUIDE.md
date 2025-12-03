# Environment Setup Guide

## Overview
Your OpnMart application requires three main services to work:
1. **MongoDB** - Store product details, user data
2. **Cloudinary** - Store product images
3. **Next.js App** - Frontend & API server

## Quick Start (Copy-Paste)

### Step 1: Create `.env.local` file
Create a new file named `.env.local` in the root directory (same level as `package.json`) and paste this template:

```dotenv
# MongoDB Connection
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/opnmart?retryWrites=true&w=majority

# Cloudinary Configuration
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=your_cloud_name
NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET=your_upload_preset
```

Now follow the sections below to fill in the actual values.

---

## Setup Instructions

### 1. MongoDB Setup

#### Option A: MongoDB Atlas (Cloud - Recommended)

1. **Create Account**
   - Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
   - Sign up with email/Google
   - Create an organization

2. **Create a Project**
   - Click "Create a new project"
   - Name it: `opnmart`
   - Click "Create Project"

3. **Build a Cluster**
   - Click "Build a Database"
   - Choose **Free tier** (M0 Sandbox)
   - Select region closest to you (e.g., `us-east-1` for Americas)
   - Cluster name: `opnmart-cluster`
   - Click "Create Cluster" (wait 5-10 minutes)

4. **Create Database User**
   - In left sidebar: "Database Access"
   - Click "Add new database user"
   - Username: `opnmart_admin`
   - Password: Generate a strong password (copy & save it!)
   - Database User Privileges: "Built-in Role" → Select "Atlas Admin"
   - Click "Add User"

5. **Whitelist IP Address**
   - In left sidebar: "Network Access"
   - Click "Add IP Address"
   - Choose "Allow access from anywhere" (for development)
   - Click "Confirm"

6. **Get Connection String**
   - Go to "Database" → "Clusters"
   - Click "Connect" on your cluster
   - Choose "Drivers" → "Node.js"
   - Copy the connection string (looks like: `mongodb+srv://username:password@cluster...`)
   - Replace `<password>` with your database user password
   - Replace `opnmart` with database name (or leave as is)

7. **Update `.env.local`**
   ```dotenv
   MONGODB_URI=mongodb+srv://opnmart_admin:YOUR_PASSWORD@opnmart-cluster.mongodb.net/opnmart?retryWrites=true&w=majority
   ```

#### Option B: MongoDB Local (Docker)

If you have Docker installed:

```powershell
docker run -d -p 27017:27017 --name mongodb mongo:latest
```

Then use:
```dotenv
MONGODB_URI=mongodb://localhost:27017/opnmart
```

---

### 2. Cloudinary Setup

1. **Create Account**
   - Go to [Cloudinary](https://cloudinary.com/users/register/free)
   - Sign up with email/Google
   - Complete the registration

2. **Get Your Cloud Name**
   - Dashboard will show your "Cloud Name" at the top
   - Copy it (e.g., `dv4z5wxyz`)

3. **Create Upload Preset**
   - In left sidebar: Go to "Settings" → "Upload"
   - Scroll down to "Upload presets"
   - Click "Add upload preset"
   - Name: `opnmart_unsigned`
   - Signing Mode: **Unsigned** (important!)
   - Folder: `opnmart/products`
   - Click "Save"

4. **Update `.env.local`**
   ```dotenv
   NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=dv4z5wxyz
   NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET=opnmart_unsigned
   ```

---

## Complete `.env.local` Example

```dotenv
# MongoDB Connection (from Atlas)
MONGODB_URI=mongodb+srv://opnmart_admin:your_strong_password@opnmart-cluster.mongodb.net/opnmart?retryWrites=true&w=majority

# Cloudinary Configuration
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=dv4z5wxyz
NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET=opnmart_unsigned
```

---

## Verify Setup

### Test MongoDB Connection

```powershell
npm run dev
```

Then in your browser, try uploading a product from the vendor dashboard. If you see the product appear on the homepage and persist after page refresh, MongoDB is working!

### Test Cloudinary Upload

When you upload a product image:
- Go to your [Cloudinary Dashboard](https://cloudinary.com/console/media_library)
- Under "Media Library" → "opnmart/products" folder
- You should see your uploaded image

---

## Troubleshooting

### "Failed to upload image to Cloudinary"
**Cause**: Missing or invalid Cloudinary credentials
- Verify `NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME` is correct (from your dashboard)
- Verify `NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET` matches your created preset
- Make sure Upload Preset is set to "Unsigned"
- Restart dev server: `npm run dev`

### "MongoDB connection failed"
**Cause**: Missing `MONGODB_URI` or invalid connection string
- Verify your password doesn't have special characters that need encoding
- Check whitelist includes your IP (or "Allow access from anywhere" for dev)
- Make sure cluster is running (not paused)
- Check connection string format: `mongodb+srv://user:password@cluster.mongodb.net/db`
- Restart dev server: `npm run dev`

### "Missing required fields"
**Cause**: Form submission issue
- Ensure all required fields are filled (marked with *)
- Image must be selected
- Check browser console for FormData details

### Still Getting Errors?
1. Check the browser console (F12) for full error details
2. Check the terminal running `npm run dev` for server errors
3. Verify all environment variables in `.env.local`
4. Restart the dev server: `npm run dev`

---

## Next: Test the Upload Flow

Once everything is configured:

1. **Start the app**: `npm run dev`
2. **Go to vendor dashboard**: `http://localhost:3000/dashboards/vendor`
3. **Upload a product**:
   - Fill all required fields
   - Select an image
   - Click "Upload Product"
4. **Verify success**:
   - Product appears in vendor dashboard
   - Go to homepage → see product in category
   - Refresh page → product still there (persisted to MongoDB)
   - Check Cloudinary → image in "Media Library/opnmart/products"

---

## Security Notes

⚠️ **For Development Only:**
- Using "Allow access from anywhere" on MongoDB is fine for local development
- `NEXT_PUBLIC_*` variables are visible in frontend (don't put secrets here)

🔐 **For Production:**
- Restrict MongoDB IP whitelist to your server IP
- Create a read-only database user for frontend API calls
- Use environment variables for sensitive data
- Never commit `.env.local` to version control (already in `.gitignore`)

---

## Environment Variables Reference

| Variable | Where to Get | Required | Example |
|----------|-------------|----------|---------|
| `MONGODB_URI` | MongoDB Atlas → Clusters → Connect | Yes | `mongodb+srv://user:pass@cluster.mongodb.net/opnmart?retryWrites=true&w=majority` |
| `NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME` | Cloudinary Dashboard → Cloud Name | Yes | `dv4z5wxyz` |
| `NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET` | Cloudinary Settings → Upload Presets | Yes | `opnmart_unsigned` |

