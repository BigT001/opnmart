# MongoDB URI Fix - Special Characters

## Issue Found
```
Error: Password contains unescaped characters
```

## Root Cause
Your MongoDB password contains special characters that need to be URL-encoded:
- `#` → `%23`
- `!` → `%21`

## Solution
Update your `.env.local` file with the properly encoded password:

### Before (❌ Wrong)
```
MONGODB_URI="mongodb+srv://sta99175_db_user:N_3r6RW#qsrG!P.@cluster0.7igdyfs.mongodb.net/?appName=Cluster0"
```

### After (✅ Correct)
```
MONGODB_URI="mongodb+srv://sta99175_db_user:N_3r6RW%23qsrG%21P.@cluster0.7igdyfs.mongodb.net/?appName=Cluster0"
```

## Character Encoding Reference
| Character | Encoded | Used In | 
|-----------|---------|---------|
| `#` | `%23` | Your password |
| `!` | `%21` | Your password |
| `@` | `%40` | Email/usernames |
| `:` | `%3A` | Between user and password |
| `/` | `%2F` | Path segments |
| `?` | `%3F` | Query strings |

## Steps to Fix

1. **Open `.env.local`** in your editor
2. **Find the MONGODB_URI line**
3. **Replace the password** with the encoded version:
   - Change: `N_3r6RW#qsrG!P.` 
   - To: `N_3r6RW%23qsrG%21P.`
4. **Save the file**
5. **Restart dev server**: `npm run dev`
6. **Hard refresh browser**: Ctrl+Shift+R
7. **Try uploading again**

## Complete Fixed URL
```
mongodb+srv://sta99175_db_user:N_3r6RW%23qsrG%21P.@cluster0.7igdyfs.mongodb.net/?appName=Cluster0
```

## Why This Happens
MongoDB URI connection strings use special syntax:
- `:` separates username and password
- `@` separates credentials from host
- `/` separates host from path
- `?` starts query parameters

Special characters in passwords could break parsing, so they must be URL-encoded.

## How to Encode Any MongoDB Password
If you have other special characters in your password:

1. Go to: https://www.urlencoder.org/
2. Paste your password: `N_3r6RW#qsrG!P.`
3. Click "Encode"
4. Get result: `N_3r6RW%23qsrG%21P.`
5. Use in connection string

## Common Special Characters in Passwords
- `@` → `%40` (don't use in password, causes parsing issues)
- `#` → `%23`
- `!` → `%21`
- `$` → `%24`
- `%` → `%25`
- `&` → `%26`
- `:` → `%3A` (only if in password)
- `/` → `%2F`
- `?` → `%3F`

## Testing After Fix
1. Restart `npm run dev`
2. Hard refresh browser
3. Go to vendor dashboard
4. Upload a product
5. Check for error in console (F12)

Should now see upload success or different error (not about special characters).

