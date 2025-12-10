# OpenMart Frontend

Modern marketplace platform built with Next.js, TailwindCSS, ShadCN UI, React Query, and Zustand.

## 🚀 Tech Stack

- **Framework**: Next.js 15+ (App Router)
- **Styling**: TailwindCSS v4
- **UI Components**: ShadCN UI
- **Data Fetching**: React Query (TanStack Query)
- **State Management**: Zustand
- **HTTP Client**: Axios
- **Language**: TypeScript

## 📦 Project Structure

```
src/
├── app/                 # Next.js app router pages
├── components/
│   ├── ui/             # ShadCN UI components
│   ├── common/         # Reusable components
│   ├── layouts/        # Layout components
│   └── providers/      # App providers (React Query, etc.)
├── config/             # Configuration files
├── hooks/              # Custom React hooks
├── services/
│   └── api/            # API client and services
├── stores/             # Zustand stores (auth, cart, etc.)
├── types/              # TypeScript type definitions
└── utils/              # Utility functions

```

## 🔧 Installation

### Prerequisites
- Node.js 18.17 or later
- npm or yarn

### Setup Steps

1. **Clone/Navigate to the project**
   ```bash
   cd opnmart
   ```

2. **Install dependencies** (already done)
   ```bash
   npm install
   ```

3. **Add environment variables**
   Create `.env.local` based on `.env.example`:
   ```bash
   NEXT_PUBLIC_API_URL=http://localhost:3001/api
   NEXT_PUBLIC_APP_NAME=OpenMart
   NEXT_PUBLIC_APP_URL=http://localhost:3000
   ```

4. **Start development server**
   ```bash
   npm run dev
   ```
   Open [http://localhost:3000](http://localhost:3000)

## 📚 Key Features

### State Management (Zustand)
- **Auth Store**: User authentication state
- **Cart Store**: Shopping cart management

```typescript
import { useAuthStore } from '@/stores/authStore';
import { useCartStore } from '@/stores/cartStore';

// Usage
const { user, logout } = useAuthStore();
const { items, addItem } = useCartStore();
```

### API Client
Configured axios client with:
- Automatic token attachment
- Request/response interceptors
- Error handling

```typescript
import { apiClient } from '@/services/api/client';

const data = await apiClient.get('/products');
```

### Custom Hooks
- **useQuery**: Wrapper around React Query for GET requests
- **useMutation**: Wrapper for POST, PUT, PATCH, DELETE requests

```typescript
import { useQuery, useMutation } from '@/hooks';

const { data, isLoading } = useQuery({
  key: ['products'],
  url: '/products',
});

const { mutate, isPending } = useMutation({
  url: '/products',
  method: 'POST',
});
```

### UI Components (ShadCN)
Pre-installed components:
- Button
- Card
- Input
- Dialog
- Dropdown Menu

Add more with:
```bash
npx shadcn@latest add [component-name]
```

## 🎨 Styling

TailwindCSS v4 with CSS variables for theming. Customize in:
- `app/globals.css` - Global styles and CSS variables
- Individual components using `className`

## 📝 Common Tasks

### Add a new ShadCN UI component
```bash
npx shadcn@latest add [component-name]
```

### Create a new page
1. Create folder in `app/`
2. Add `page.tsx`

### Create a custom hook
Add to `src/hooks/` and export from `src/hooks/index.ts`

### Create a Zustand store
Add to `src/stores/` with TypeScript interface

## 🔗 API Integration

The app is configured to connect to a backend API at:
- Development: `http://localhost:3001/api`
- Configure in `src/config/api.ts`

### Example endpoints defined in `src/config/api.ts`:
- Authentication
- Products
- Orders
- Users

## 🚀 Deployment

### Build for production
```bash
npm run build
npm run start
```

### Vercel (Recommended)
1. Push to GitHub
2. Import in Vercel
3. Set environment variables
4. Deploy

## 📚 Additional Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [TailwindCSS](https://tailwindcss.com)
- [ShadCN UI](https://ui.shadcn.com)
- [React Query](https://tanstack.com/query/latest)
- [Zustand](https://github.com/pmndrs/zustand)

## 📄 License

MIT
