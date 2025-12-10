# OpenMart Frontend - Quick Reference Guide

## 🚀 Common Commands

### Development
```bash
npm run dev        # Start development server on http://localhost:3000
npm run build      # Create production build
npm run start      # Run production build
npm run lint       # Run ESLint
```

### Adding Components
```bash
# Add ShadCN UI component
npx shadcn@latest add [component-name]

# Examples
npx shadcn@latest add form
npx shadcn@latest add select
npx shadcn@latest add toast
npx shadcn@latest add skeleton
```

## 📂 File Structure Quick Access

### Pages & Routes
- `app/page.tsx` - Homepage
- `app/products/page.tsx` - Products listing
- `app/cart/page.tsx` - Shopping cart
- `app/[route]/page.tsx` - Create new routes here

### Components
- `components/ui/` - ShadCN UI components
- `components/providers/` - App providers (React Query, etc.)
- `components/common/` - Reusable components
- `components/layouts/` - Layout components

### State Management
- `stores/authStore.ts` - Authentication state
- `stores/cartStore.ts` - Shopping cart state
- Create new stores here as needed

### API & Services
- `services/api/client.ts` - Axios client with interceptors
- `config/api.ts` - API configuration and endpoints
- `hooks/useQuery.ts` - Query hook for GET requests
- `hooks/useMutation.ts` - Mutation hook for POST/PUT/PATCH/DELETE

### Types & Utils
- `types/index.ts` - TypeScript interfaces
- `utils/index.ts` - Utility functions (formatPrice, formatDate, etc.)
- `utils/cn.ts` - Tailwind class name utility

## 🛠️ Common Code Patterns

### Using useQuery Hook
```typescript
import { useQuery } from '@/hooks';
import { API_ENDPOINTS } from '@/config/api';
import { Product } from '@/types';

export function ProductsList() {
  const { data, isLoading, error } = useQuery<Product[]>({
    key: ['products'],
    url: API_ENDPOINTS.PRODUCTS.LIST,
  });

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error loading products</div>;

  return (
    <div>
      {data?.map(product => (
        <div key={product.id}>{product.name}</div>
      ))}
    </div>
  );
}
```

### Using useMutation Hook
```typescript
import { useMutation } from '@/hooks';
import { API_ENDPOINTS } from '@/config/api';

export function LoginForm() {
  const { mutate, isPending, error } = useMutation({
    url: API_ENDPOINTS.AUTH.LOGIN,
    method: 'POST',
    onSuccess: (data) => {
      // Handle success
      console.log('Login successful', data);
    },
  });

  const handleSubmit = (credentials) => {
    mutate(credentials);
  };

  return (
    <form onSubmit={handleSubmit}>
      {/* form fields */}
      <button disabled={isPending}>Login</button>
      {error && <span>{error.message}</span>}
    </form>
  );
}
```

### Using Auth Store
```typescript
import { useAuthStore } from '@/stores/authStore';

export function UserProfile() {
  const { user, logout } = useAuthStore();

  if (!user) return <div>Not logged in</div>;

  return (
    <div>
      <h1>{user.name}</h1>
      <button onClick={logout}>Logout</button>
    </div>
  );
}
```

### Using Cart Store
```typescript
import { useCartStore } from '@/stores/cartStore';
import { Product } from '@/types';

export function ProductCard(product: Product) {
  const { addItem } = useCartStore();

  const handleAddToCart = () => {
    addItem(product, 1);
  };

  return (
    <div>
      <h3>{product.name}</h3>
      <p>${product.price}</p>
      <button onClick={handleAddToCart}>Add to Cart</button>
    </div>
  );
}
```

### Creating a New Page
```typescript
// app/new-page/page.tsx
'use client'; // Add for client components

export default function NewPage() {
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold">New Page</h1>
    </div>
  );
}
```

### Creating a New API Endpoint
1. Add to `config/api.ts`:
```typescript
export const API_ENDPOINTS = {
  // ... existing endpoints
  NEW_FEATURE: {
    LIST: '/new-feature',
    GET: (id: string) => `/new-feature/${id}`,
    CREATE: '/new-feature',
  },
};
```

2. Use in component:
```typescript
const { data } = useQuery({
  key: ['new-feature'],
  url: API_ENDPOINTS.NEW_FEATURE.LIST,
});
```

### Creating a New Store
```typescript
// stores/myStore.ts
import { create } from 'zustand';

interface MyState {
  data: any;
  setData: (data: any) => void;
}

export const useMyStore = create<MyState>((set) => ({
  data: null,
  setData: (data) => set({ data }),
}));
```

## 🎨 Styling with TailwindCSS

### Common Classes
```typescript
// Spacing
className="p-4 m-2 gap-3"

// Flexbox
className="flex items-center justify-between gap-4"

// Grid
className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3"

// Responsive
className="text-sm md:text-base lg:text-lg"

// Colors
className="bg-blue-500 text-white border border-gray-300"

// Hover states
className="hover:bg-gray-100 transition"
```

## 🔗 API Integration

### Update Backend URL
Edit `.env.local`:
```env
NEXT_PUBLIC_API_URL=http://localhost:3001/api
```

### Add Authentication Token
The API client automatically includes tokens from localStorage. To set token:
```typescript
localStorage.setItem('token', authToken);
```

## 📱 Responsive Design

### Breakpoints
- `sm: 640px`
- `md: 768px`
- `lg: 1024px`
- `xl: 1280px`

### Example
```typescript
className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4"
```

## 🐛 Debugging

### React Query DevTools (Optional)
```bash
npm install @tanstack/react-query-devtools --save-dev
```

### Check API Requests
Browser DevTools → Network tab → Check requests to backend

### Zustand DevTools (Optional)
```bash
npm install zustand-devtools --save-dev
```

## 📚 Component Library (ShadCN)

### Installed Components
- Button
- Card
- Input
- Dialog
- DropdownMenu

### Import Pattern
```typescript
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
```

## 🔐 Security Notes

1. **Never commit `.env.local`** - Already in `.gitignore`
2. **Token stored in localStorage** - Consider using httpOnly cookies for production
3. **API interceptor removes token on 401** - Auto-redirect to login
4. **Validation** - Validate input on client and server

## 🚀 Deployment Checklist

- [ ] Update `.env.local` with production API URL
- [ ] Run `npm run build` - verify no errors
- [ ] Test with `npm run start`
- [ ] Deploy to Vercel, Netlify, or your hosting provider
- [ ] Update backend API endpoints if needed
- [ ] Set up database backups
- [ ] Monitor error logs

---

**Development Server**: http://localhost:3000
**API Base**: http://localhost:3001/api (update in `.env.local`)
**Build Status**: ✅ Ready for development

Happy coding! 🎉
