# Environment Variables - Current Setup

## Active Configuration

Your `.env.local.example` file contains the following credentials that should be in your `.env.local`:

```dotenv
# MongoDB Connection
MONGODB_URI="mongodb+srv://sta99175_db_user:N_3r6RW#qsrG!P.@cluster0.7igdyfs.mongodb.net/?appName=Cluster0"
MONGODB_DB=opnmart

# Cloudinary Configuration (for image uploads)
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME="dy9ueiuhs"
CLOUDINARY_API_KEY="758632447923635"
CLOUDINARY_API_SECRET="RTfwrmnF5UdxkR0w4yuiSo7p0xc"

# API Configuration
NEXT_PUBLIC_API_URL=http://localhost:3001/api

# App Configuration
NEXT_PUBLIC_APP_NAME=OpenMart
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

## Setup Instructions

### 1. Create `.env.local` File

In your project root (same level as `package.json`), create a new file:

**Filename**: `.env.local`

**Content**: Copy and paste the entire block above into this new file.

### 2. Save and Restart

1. Save the `.env.local` file
2. Stop the dev server (Ctrl+C in terminal)
3. Restart: `npm run dev`
4. Hard refresh browser: Ctrl+Shift+R

### 3. Test Upload

1. Go to vendor dashboard: `http://localhost:3000/dashboards/vendor`
2. Click "Upload New Product"
3. Fill all fields and select an image
4. Click "Upload Product"

---

## Environment Variables Explained

| Variable | Purpose | Current Value |
|----------|---------|---|
| `MONGODB_URI` | Database connection string | MongoDB Atlas URL |
| `MONGODB_DB` | Database name | opnmart |
| `NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME` | Cloudinary account identifier | dy9ueiuhs |
| `CLOUDINARY_API_KEY` | Cloudinary authentication | 758632447923635 |
| `CLOUDINARY_API_SECRET` | Cloudinary authentication (secret) | RTfwrmnF5UdxkR0w4yuiSo7p0xc |
| `NEXT_PUBLIC_API_URL` | API base URL | http://localhost:3001/api |
| `NEXT_PUBLIC_APP_NAME` | App name | OpenMart |
| `NEXT_PUBLIC_APP_URL` | App URL | http://localhost:3000 |

## Important Notes

⚠️ **Security**: These are development credentials. For production, use secure credential management and never commit `.env.local` to version control (already in `.gitignore`).

✅ **NextJS Prefix**: Variables prefixed with `NEXT_PUBLIC_` are exposed to the browser (safe for client-side use).

🔒 **Server-Only**: Variables without `NEXT_PUBLIC_` are server-only (secure, only used in API routes).

## Troubleshooting

### If upload fails after adding `.env.local`:

1. **Verify file was created**: Open `.env.local` in editor and check values
2. **Check for typos**: Make sure all values match exactly (including quotes)
3. **Restart dev server**: Stop and restart `npm run dev`
4. **Hard refresh browser**: Ctrl+Shift+R
5. **Check terminal**: Look for "Connected to MongoDB" or error messages

### If you get "Cloudinary credentials not configured":

- Verify `CLOUDINARY_API_KEY` and `CLOUDINARY_API_SECRET` are in `.env.local`
- Make sure they're not missing or have empty values
- Restart dev server

### If you get MongoDB connection error:

- Verify `MONGODB_URI` is correct in `.env.local`
- Check MongoDB Atlas cluster is running
- Verify IP whitelist allows your IP

