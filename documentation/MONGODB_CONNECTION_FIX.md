# MongoDB Authentication Failed - Fix Guide

## The Problem
```
❌ MongoServerError: bad auth : authentication failed
    code: 8000, codeName: 'AtlasError'
```

Your MongoDB credentials are being rejected by MongoDB Atlas.

## Good News ✅
- Cloudinary upload is working perfectly
- Image saved successfully
- Next.js dev server is running fine
- All other systems working

## The Issue
MongoDB is rejecting the username/password combination.

---

## Root Causes (Check Each)

### 1. MongoDB User Doesn't Exist
The database user `sta99175_db_user` may not have been created properly.

**Check**: Go to MongoDB Atlas → Database Access → Find the user
- If missing: Create a new user with:
  - Username: `sta99175_db_user`
  - Password: Generate strong one (save it!)
  - Database User Privileges: Atlas Admin

### 2. Password Changed
The password stored in `.env.local` might not match what's in MongoDB Atlas.

**Check**: 
1. Go to MongoDB Atlas → Database Access
2. Find user `sta99175_db_user`
3. Click "Edit" → "Edit Password"
4. Copy the new password (or generate new one)
5. URL-encode special characters:
   - `#` → `%23`
   - `!` → `%21`
   - `@` → `%40` (don't use in password)
   - `:` → `%3A` (don't use in password)
   - `/` → `%2F`
   - `?` → `%3F`

### 3. Cluster Paused
Your MongoDB cluster might be paused/stopped.

**Check**: 
1. Go to MongoDB Atlas → Clusters
2. Look for your cluster (cluster0)
3. If it shows "Paused" → Click "Resume"

### 4. IP Whitelist Issues
Your current IP might not be whitelisted.

**Check**:
1. Go to MongoDB Atlas → Network Access
2. Look for an entry allowing your IP
3. If restrictive → Change to "Allow access from anywhere" (0.0.0.0/0) for development

### 5. Connection String Wrong
The URI format might be incorrect.

**Check**: 
1. Go to MongoDB Atlas → Clusters → Connect
2. Choose "Drivers" → "Node.js"
3. Copy the connection string
4. Replace `<password>` with your actual password (URL-encoded)

---

## How to Fix

### Option A: Quick Fix (Allow Any IP)
1. Go to MongoDB Atlas
2. Network Access → Change to allow 0.0.0.0/0
3. Restart dev server: `npm run dev`

### Option B: Verify Credentials
1. Go to Database Access
2. Find user `sta99175_db_user`
3. Reset password and get new one
4. URL-encode the password
5. Update `.env.local` with new URI
6. Restart dev server

### Option C: Check Cluster Status
1. Go to Clusters
2. Resume cluster if paused
3. Wait for it to start (takes ~5 minutes)
4. Restart dev server

---

## Step-by-Step: Update MongoDB Credentials

### 1. Get New Connection String
```
MongoDB Atlas → Clusters → Connect → Drivers → Node.js → Copy string
```

### 2. Replace Password
In the connection string, replace `<password>` with your actual password.

**Example**:
```
Before: mongodb+srv://user:PASSWORD@cluster0.7igdyfs.mongodb.net/?appName=Cluster0
After:  mongodb+srv://user:YOUR_ACTUAL_PASSWORD@cluster0.7igdyfs.mongodb.net/?appName=Cluster0
```

### 3. URL-Encode Special Characters
If password has special characters:
- `#` → `%23`
- `!` → `%21`
- `$` → `%24`
- `%` → `%25`
- `&` → `%26`

**Example**:
```
Before: password: MyPass#123!ABC
After:  password: MyPass%23123%21ABC
```

### 4. Update `.env.local`
```
MONGODB_URI="mongodb+srv://user:ENCODED_PASSWORD@cluster0.7igdyfs.mongodb.net/?appName=Cluster0"
```

### 5. Restart Dev Server
```powershell
# Stop current (Ctrl+C)
npm run dev
```

### 6. Test Again
Try uploading a product.

---

## MongoDB Connection String Anatomy

```
mongodb+srv://
  ├─ USERNAME : sta99175_db_user
  ├─ PASSWORD : N_3r6RW%23qsrG%21P. (URL-encoded)
  ├─ @ (separator)
  ├─ HOST : cluster0.7igdyfs.mongodb.net
  ├─ / (path separator)
  ├─ DB : (opnmart database auto-created)
  └─ ?appName=Cluster0 (query parameters)
```

---

## Debugging Checklist

- [ ] MongoDB cluster is running (not paused)
- [ ] Database user exists (sta99175_db_user)
- [ ] Database user password matches connection string
- [ ] Password is properly URL-encoded
- [ ] IP whitelist allows your IP (or 0.0.0.0/0 for dev)
- [ ] Connection string format is correct
- [ ] `.env.local` has correct MONGODB_URI
- [ ] Dev server restarted after changes
- [ ] Browser refreshed (Ctrl+Shift+R)

---

## Quick Test

Once you've updated credentials:

```powershell
npm run dev
```

Then:
1. Upload a product
2. Check if "Image uploaded successfully" appears in terminal
3. If MongoDB connects, you'll see "✓ Connected to MongoDB"
4. Product will be saved and appear on homepage

---

## If Still Failing

1. **Check terminal output** for exact error
2. **Verify connection string** copied correctly from Atlas
3. **Test connection** locally with MongoDB Compass (if installed)
4. **Check Atlas logs** for authentication attempts

