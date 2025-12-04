# 🚀 Quick Start - OpnMart Authentication

## ⚡ 5-MINUTE SETUP

### 1️⃣ Environment
```env
MONGODB_URI=mongodb+srv://user:password@cluster.mongodb.net/opnmart
```

### 2️⃣ Dependencies Installed
```bash
bcryptjs - Password hashing ✓
```

### 3️⃣ Start Development
```bash
npm run dev
```

### 4️⃣ Access Pages
- **Sign Up:** http://localhost:3000/auth/signup
- **Login:** http://localhost:3000/auth/login

---

## 📝 API ENDPOINTS

### Sign Up
```bash
POST /api/auth/signup

{
  "firstName": "John",
  "lastName": "Doe",
  "email": "john@example.com",
  "phone": "+234 801 234 5678",
  "password": "SecurePass123!",
  "confirmPassword": "SecurePass123!"
}
```

### Login
```bash
POST /api/auth/login

{
  "email": "john@example.com",
  "password": "SecurePass123!"
}
```

---

## 🔐 PASSWORD RULES

✅ 8+ characters
✅ UPPERCASE letter
✅ lowercase letter
✅ Number (0-9)
✅ Special char (@$!%*?&)

**Example:** `SecurePass123!`

---

## 📁 FILES CREATED

1. `models/Buyer.ts` - Database schema
2. `app/api/auth/signup/route.ts` - Sign up API
3. `app/api/auth/login/route.ts` - Login API
4. `app/auth/signup/page.tsx` - Sign up UI
5. `app/auth/login/page.tsx` - Login UI
6. `lib/db.ts` - DB connection
7. `types/auth.ts` - TypeScript types

---

## ✨ FEATURES

✅ Secure password hashing (bcrypt)
✅ Email validation & uniqueness
✅ Phone validation
✅ Real-time form validation
✅ Dark mode support
✅ Mobile responsive
✅ Error handling
✅ localStorage session storage

---

## 🧪 TEST IT

1. Go to `/auth/signup`
2. Create account with valid credentials
3. Login with credentials
4. Redirected to buyer dashboard
5. User data stored in localStorage

---

## 📚 DOCUMENTATION

- `AUTH_DOCUMENTATION.md` - Full guide
- `AUTHENTICATION_COMPLETE.md` - Complete overview
- `SETUP_COMPLETE_AUTH.md` - Detailed setup

---

**Status:** ✅ Production Ready

Ready to use! 🎉
