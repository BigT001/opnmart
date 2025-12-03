# OpenMart - Modern Marketplace Platform

> A full-stack marketplace application built with Next.js, TypeScript, TailwindCSS, and modern web technologies.

[![Build Status](https://img.shields.io/badge/build-passing-brightgreen)]()
[![React Version](https://img.shields.io/badge/react-19.2.0-blue)]()
[![Next.js Version](https://img.shields.io/badge/next.js-16.0.6-blue)]()
[![License](https://img.shields.io/badge/license-MIT-green)]()

## 🚀 Live Demo

Frontend: [http://localhost:3000](http://localhost:3000) (Development)
API: [http://localhost:3001/api](http://localhost:3001/api) (Expected)

## 📋 Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Quick Start](#quick-start)
- [Project Structure](#project-structure)
- [Documentation](#documentation)
- [Development](#development)
- [Deployment](#deployment)

## ✨ Features

### Current Features
- ✅ Modern React 19 with TypeScript
- ✅ Next.js 16 App Router with Turbopack
- ✅ TailwindCSS v4 for styling
- ✅ ShadCN UI components library
- ✅ React Query for state management
- ✅ Zustand for local state
- ✅ Axios HTTP client with interceptors
- ✅ Responsive design
- ✅ Production-ready build

### Planned Features
- 🔄 User authentication (login/register)
- 🔄 Product catalog with filters
- 🔄 Shopping cart management
- 🔄 Order processing
- 🔄 Admin dashboard
- 🔄 Seller dashboard
- 🔄 Product reviews and ratings
- 🔄 Wishlist functionality

## 🛠️ Tech Stack

### Frontend
| Technology | Version | Purpose |
|---|---|---|
| **Next.js** | 16.0.6 | React framework with App Router |
| **React** | 19.2.0 | UI library |
| **TypeScript** | 5 | Type safety |
| **TailwindCSS** | 4 | Utility CSS |
| **ShadCN UI** | Latest | Component library |
| **React Query** | 5.90.11 | Server state management |
| **Zustand** | 5.0.9 | Client state management |
| **Axios** | 1.13.2 | HTTP client |

### Build & Development
- **Turbopack** - Ultra-fast bundler
- **PostCSS** - CSS processing
- **ESLint** - Code linting
- **Lucide React** - Icon library

## 🚀 Quick Start

### Prerequisites
- Node.js 18.17 or later
- npm or yarn

### Installation

```bash
# Navigate to project
cd opnmart

# Install dependencies (already done)
npm install

# Configure environment
cp .env.example .env.local

# Start development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## 📁 Project Structure

```
opnmart/
├── app/                          # Next.js App Router pages
│   ├── layout.tsx               # Root layout
│   ├── page.tsx                 # Homepage
│   ├── cart/page.tsx            # Shopping cart
│   └── products/page.tsx        # Products listing
│
├── components/                   # React components
│   ├── ui/                      # ShadCN UI components
│   ├── providers/               # App providers (React Query)
│   ├── common/                  # Reusable components
│   └── layouts/                 # Layout components
│
├── config/                       # Configuration
│   └── api.ts                   # API endpoints
│
├── hooks/                        # Custom React hooks
│   ├── useQuery.ts              # Query hook wrapper
│   └── useMutation.ts           # Mutation hook wrapper
│
├── services/api/                # API services
│   └── client.ts                # Axios client
│
├── stores/                       # Zustand stores
│   ├── authStore.ts             # Authentication
│   └── cartStore.ts             # Shopping cart
│
├── types/                        # TypeScript types
├── utils/                        # Utility functions
└── public/                       # Static files
```

## 📚 Documentation

### Getting Started
- **[SETUP_SUMMARY.md](./SETUP_SUMMARY.md)** - Installation summary and status
- **[QUICK_REFERENCE.md](./QUICK_REFERENCE.md)** - Quick reference guide
- **[FRONTEND_SETUP.md](./FRONTEND_SETUP.md)** - Detailed setup guide

### Development
- **[INSTALLATION_COMPLETE.md](./INSTALLATION_COMPLETE.md)** - What's installed
- **[IMPLEMENTATION_CHECKLIST.md](./IMPLEMENTATION_CHECKLIST.md)** - Feature checklist
- **[PACKAGES.md](./PACKAGES.md)** - Dependencies documentation

## 🔧 Available Scripts

```bash
# Development
npm run dev          # Start dev server (http://localhost:3000)
npm run build        # Create production build
npm run start        # Run production build

# Code Quality
npm run lint         # Run ESLint

# Components
npx shadcn@latest add [component]  # Add ShadCN component
```

## 💡 Usage Examples

### Fetching Data with useQuery
```typescript
import { useQuery } from '@/hooks';
import { API_ENDPOINTS } from '@/config/api';

function ProductsList() {
  const { data, isLoading } = useQuery({
    key: ['products'],
    url: API_ENDPOINTS.PRODUCTS.LIST,
  });

  if (isLoading) return <div>Loading...</div>;
  return <div>{/* render products */}</div>;
}
```

### Using State Management
```typescript
import { useAuthStore } from '@/stores/authStore';
import { useCartStore } from '@/stores/cartStore';

function Header() {
  const { user, logout } = useAuthStore();
  const { items } = useCartStore();

  return <div>{user?.name} - Cart: {items.length}</div>;
}
```

### Making API Calls
```typescript
import { useMutation } from '@/hooks';
import { API_ENDPOINTS } from '@/config/api';

function LoginForm() {
  const { mutate } = useMutation({
    url: API_ENDPOINTS.AUTH.LOGIN,
    method: 'POST',
    onSuccess: (data) => console.log('Logged in!'),
  });

  return <form onSubmit={(e) => mutate(data)}>...</form>;
}
```

## 🎨 Styling

Uses TailwindCSS v4 with CSS variables for theming.

```typescript
// Example component
export function Button() {
  return (
    <button className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded">
      Click me
    </button>
  );
}
```

## 🔐 Environment Configuration

Create `.env.local`:
```env
NEXT_PUBLIC_API_URL=http://localhost:3001/api
NEXT_PUBLIC_APP_NAME=OpenMart
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

## 📱 Responsive Design

All components are mobile-first and responsive:
- **Mobile**: 320px and up
- **Tablet**: 768px and up
- **Desktop**: 1024px and up

## 🚀 Deployment

### Vercel (Recommended)
```bash
npm install -g vercel
vercel
```

### Self-Hosted
```bash
npm run build
npm run start
```

### Docker
```bash
docker build -t opnmart .
docker run -p 3000:3000 opnmart
```

## 📦 Adding Dependencies

### Add ShadCN Component
```bash
npx shadcn@latest add button
npx shadcn@latest add form
```

### Install Package
```bash
npm install package-name
```

### Install Dev Dependency
```bash
npm install --save-dev package-name
```

## 🐛 Debugging

### Check API Requests
Browser DevTools → Network tab

### React DevTools
Install [React DevTools](https://chrome.google.com/webstore/detail/react-developer-tools) extension

### Debug Mode
```typescript
// Enable React Query DevTools (optional)
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
```

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 📞 Support

For issues and questions:
- Open an [Issue](../../issues)
- Check [Documentation](./QUICK_REFERENCE.md)
- Review [Setup Guide](./FRONTEND_SETUP.md)

## 🙏 Acknowledgments

- [Next.js](https://nextjs.org/) - React framework
- [TailwindCSS](https://tailwindcss.com/) - CSS framework
- [ShadCN/ui](https://ui.shadcn.com/) - Component library
- [React Query](https://tanstack.com/query/latest) - State management
- [Zustand](https://github.com/pmndrs/zustand) - State management

---

<div align="center">

Made with ❤️ for the modern web

**[Deploy on Vercel](https://vercel.com/new)** • **[GitHub](https://github.com)** • **[Live Demo](http://localhost:3000)**

</div>
