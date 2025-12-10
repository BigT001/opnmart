# 📦 OpenMart Frontend - Package Dependencies

## Production Dependencies

### Framework & Runtime
- **next** (16.0.6) - React framework with App Router and Turbopack
- **react** (19.2.0) - React library
- **react-dom** (19.2.0) - React DOM binding

### Styling & UI
- **tailwindcss** (4) - Utility-first CSS framework
- **@tailwindcss/postcss** (4) - PostCSS plugin for Tailwind
- **class-variance-authority** (0.7.1) - Component variant library
- **clsx** (2.1.1) - Conditional classname utility
- **tailwind-merge** (3.4.0) - Merge and override Tailwind classes
- **lucide-react** (0.555.0) - Icon library (300+ icons)

### UI Component Library
- **@radix-ui/react-dialog** (1.1.15) - Dialog component primitive
- **@radix-ui/react-dropdown-menu** (2.1.16) - Dropdown menu primitive
- **@radix-ui/react-slot** (1.2.4) - Radix slot component

### State Management
- **zustand** (5.0.9) - Lightweight state management library

### API & Data Fetching
- **@tanstack/react-query** (5.90.11) - Async state management
- **axios** (1.13.2) - HTTP client

## Development Dependencies

### TypeScript & Type Definitions
- **typescript** (5) - TypeScript compiler
- **@types/node** (20) - Node.js type definitions
- **@types/react** (19) - React type definitions
- **@types/react-dom** (19) - React DOM type definitions

### Linting & Code Quality
- **eslint** (9) - JavaScript linter
- **eslint-config-next** (16.0.6) - ESLint config for Next.js

### Styling Development
- **tw-animate-css** (1.4.0) - Tailwind animation utilities

### Build Tools (Included with Next.js)
- **next-env.d.ts** - Next.js environment types
- **Turbopack** - Fast bundler (included in Next.js)

---

## Total Package Count: 27

### By Category
- **Framework**: 3 packages (next, react, react-dom)
- **UI/Styling**: 6 packages (tailwind, tailwind-merge, clsx, class-variance-authority, lucide-react, PostCSS)
- **UI Components**: 3 packages (@radix-ui/*)
- **State Management**: 1 package (zustand)
- **API/Data**: 2 packages (react-query, axios)
- **Development**: 12 packages (typescript, eslint, types, etc.)

---

## 🚀 Installation Status

### Total Installed: 439 packages (including dependencies)
```
added 426 packages initially
added 12 packages (React Query, Zustand, Axios)
+ ShadCN UI components (via CLI)

Total: 439 packages audited
Vulnerabilities: 0
```

---

## 📊 Version Strategy

### Core Framework
- ✅ Latest stable: **Next.js 16.0.6**
- ✅ Latest stable: **React 19.2.0**
- ✅ Latest stable: **TypeScript 5**

### Key Libraries
- ✅ Latest: **React Query 5.90.11**
- ✅ Latest: **Zustand 5.0.9**
- ✅ Latest: **TailwindCSS 4**
- ✅ Latest: **Axios 1.13.2**

### UI Components
- ✅ ShadCN UI latest
- ✅ Radix UI primitives (latest compatible)

---

## 🔧 How to Update Packages

### Update All Packages
```bash
npm update
```

### Update Specific Package
```bash
npm install package-name@latest
```

### Check for Outdated Packages
```bash
npm outdated
```

### Check Security Vulnerabilities
```bash
npm audit
npm audit fix
```

---

## 📦 Custom Configurations

### tsconfig.json
```json
{
  "paths": {
    "@/*": ["./*"]
  }
}
```
This allows imports like `@/config/api` instead of relative paths.

### tailwind.config.ts
Configured with:
- Default Tailwind theme
- Custom colors (if needed)
- CSS variables support

### next.config.ts
Configured with:
- Turbopack bundler
- Image optimization
- ESLint integration

### components.json
Configured for ShadCN:
- TailwindCSS
- TypeScript
- Path alias: `@/components/ui`

---

## 🎯 Recommended Additional Packages (Optional)

### For Form Handling
```bash
npx shadcn@latest add form
npm install react-hook-form zod
```

### For Toast Notifications
```bash
npx shadcn@latest add toast
npm install sonner
```

### For Tables
```bash
npx shadcn@latest add table
npm install @tanstack/react-table
```

### For Authentication
```bash
npm install next-auth
npm install @auth/core
```

### For Date Handling
```bash
npm install date-fns
npm install @radix-ui/react-popover
```

### For Testing
```bash
npm install --save-dev jest @testing-library/react @testing-library/jest-dom
```

### For E2E Testing
```bash
npm install --save-dev cypress
# or
npm install --save-dev @playwright/test
```

### For API Mocking
```bash
npm install --save-dev msw
```

### For Debugging
```bash
npm install --save-dev @tanstack/react-query-devtools
```

---

## 🔒 Security Best Practices

### Current Security
- ✅ No vulnerabilities found (npm audit)
- ✅ TypeScript for type safety
- ✅ ESLint for code quality
- ✅ Secure dependencies

### Regular Maintenance
```bash
# Monthly
npm audit
npm update

# Quarterly
npm outdated
# Review and update major versions
```

---

## 📈 Performance Optimization

### Bundle Analysis
```bash
npm install --save-dev @next/bundle-analyzer

# Update next.config.ts to use analyzer
```

### Image Optimization
Already configured in Next.js:
- Automatic image optimization
- WebP format support
- Responsive images

### Code Splitting
Automatic with App Router:
- Per-route code splitting
- Dynamic imports supported
- Automatic prefetching

---

## 🎓 Documentation Links

- [Next.js Dependencies](https://nextjs.org/docs)
- [React Query Documentation](https://tanstack.com/query/latest)
- [Zustand Guide](https://github.com/pmndrs/zustand)
- [TailwindCSS Docs](https://tailwindcss.com/docs)
- [ShadCN UI Components](https://ui.shadcn.com)
- [Axios Documentation](https://axios-http.com/docs/intro)

---

## 🚀 Quick Deployment Notes

### Vercel (Recommended)
```bash
npm install -g vercel
vercel
# Auto-detects Next.js and deploys
```

### Self-Hosted
```bash
npm run build
npm run start
# Runs on port 3000
```

### Docker
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build
EXPOSE 3000
CMD ["npm", "start"]
```

---

**Last Updated**: December 3, 2025
**Status**: ✅ All dependencies installed and verified
**Security**: ✅ No vulnerabilities found
