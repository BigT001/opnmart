# OpenMart Micro-App Architecture

## Overview

This project uses a **modular micro-app architecture** where each feature is a self-contained, independent module that can be:
- **Developed** independently without affecting other modules
- **Tested** in isolation
- **Deployed** separately if needed
- **Scaled** horizontally
- **Disabled** or **replaced** without restarting the entire application

## Architecture Principles

### 1. **Isolation**
Each micro-app has its own:
- Services (business logic)
- Controllers (HTTP endpoints)
- Schemas (data models)
- Guards (authentication/authorization)

### 2. **Communication**
Micro-apps communicate via:
- **Event Bus**: Publish/subscribe pattern for async communication
- **Service Locator**: Registry for discovering and using services from other micro-apps

### 3. **Shared Foundation**
Common functionality is centralized:
- Database connections (MongoDB)
- Configuration management
- Type definitions
- Middleware
- Error handling

### 4. **Plugin System**
Micro-apps are registered with a central registry that:
- Initializes all modules on startup
- Manages their lifecycle
- Collects routes and providers
- Handles shutdown gracefully

## Project Structure

```
opnmart/
├── micro-apps/                  # All micro-app modules
│   ├── auth/                    # Authentication micro-app
│   │   └── src/
│   │       ├── auth-microapp.ts          # Micro-app entry point
│   │       ├── controllers/              # HTTP endpoints
│   │       ├── services/                 # Business logic
│   │       ├── schemas/                  # Data models
│   │       └── guards/                   # Auth guards
│   ├── products/                # Products micro-app (future)
│   ├── orders/                  # Orders micro-app (future)
│   └── checkout/                # Checkout micro-app (future)
│
├── core/                        # Core framework
│   ├── registry/
│   │   ├── microapp-registry.ts          # Central registry
│   │   └── base-microapp.ts              # Base class for all micro-apps
│   └── shared/
│       ├── types/               # Shared type definitions
│       ├── events/              # Event bus & service locator
│       ├── database/            # Database utilities
│       ├── middleware/          # Shared middleware
│       └── config/              # Configuration management
│
├── backend/                     # NestJS application
│   └── src/
│       └── app.module.ts        # Mounts all micro-apps
│
├── app/                         # Next.js frontend
└── package.json                 # Shared dependencies
```

## How to Create a New Micro-App

### Step 1: Create Folder Structure

```powershell
mkdir micro-apps/your-feature/src
mkdir micro-apps/your-feature/src/controllers
mkdir micro-apps/your-feature/src/services
mkdir micro-apps/your-feature/src/schemas
mkdir micro-apps/your-feature/src/guards
```

### Step 2: Create the Micro-App Class

```typescript
// micro-apps/your-feature/src/your-feature-microapp.ts
import { BaseMicroApp } from '../../../core/registry/base-microapp';
import { IAppContext } from '../../../core/shared/types';
import { YourService } from './services/your.service';
import { YourController } from './controllers/your.controller';

export class YourFeatureMicroApp extends BaseMicroApp {
  name = 'your-feature';
  version = '1.0.0';
  enabled = true;

  private yourService: YourService | null = null;

  protected async registerServices(): Promise<void> {
    this.yourService = new YourService(
      this.context!.mongo,
      this.context!.config,
      this.context!.eventBus,
    );
    this.registerService('your-feature', this.yourService);
  }

  protected async setupEventListeners(): Promise<void> {
    // Listen to events from other micro-apps
    this.on('some-event', (data) => {
      console.log('Received event:', data);
    });
  }

  getRoutes(): any[] {
    return [{ path: 'your-path', controller: YourController }];
  }

  getProviders(): any[] {
    return [YourService];
  }
}
```

### Step 3: Create Services

Services contain your business logic:

```typescript
// micro-apps/your-feature/src/services/your.service.ts
import { IAppContext } from '../../../core/shared/types';

export class YourService {
  constructor(
    private mongo: any,
    private config: IConfig,
    private eventBus: IEventBus,
  ) {}

  async doSomething(): Promise<void> {
    console.log(`[YOUR_SERVICE] Doing something`);
    
    // Access MongoDB
    const db = this.mongo.db(this.config.mongoDb);
    const collection = db.collection('your-collection');
    
    // Emit events
    this.eventBus.emit('your-event', { data: 'something' });
  }
}
```

### Step 4: Create Controllers

Controllers handle HTTP requests:

```typescript
// micro-apps/your-feature/src/controllers/your.controller.ts
import { Controller, Post, Body } from '@nestjs/common';
import { YourService } from '../services/your.service';

@Controller('your-path')
export class YourController {
  constructor(private yourService: YourService) {}

  @Post()
  async create(@Body() dto: any) {
    return this.yourService.doSomething();
  }
}
```

### Step 5: Register in App Module

```typescript
// backend/src/app.module.ts
import { AuthMicroApp } from '../../micro-apps/auth/src/auth-microapp';
import { YourFeatureMicroApp } from '../../micro-apps/your-feature/src/your-feature-microapp';

// In the module initialization:
const registry = new MicroAppRegistry(config, mongo);
registry.register(new AuthMicroApp());
registry.register(new YourFeatureMicroApp());
await registry.initializeAll();
```

## Inter-Micro-App Communication

### Using Event Bus

```typescript
// In one micro-app - emit an event
this.eventBus.emit('user:verified', { userId, email });

// In another micro-app - listen to the event
this.on('user:verified', (data) => {
  console.log('User verified:', data);
  // Do something
});
```

### Using Service Locator

```typescript
// In auth-microapp
this.registerService('auth', this.authService);

// In another micro-app - use auth service
const authService = this.resolveService('auth');
const token = await authService.login(email, password);
```

## Example: Creating a Products Micro-App

This would follow the same pattern:

```typescript
export class ProductsMicroApp extends BaseMicroApp {
  name = 'products';
  version = '1.0.0';

  protected async registerServices(): Promise<void> {
    this.productService = new ProductService(this.context!.mongo, ...);
    this.registerService('products', this.productService);
  }

  protected async setupEventListeners(): Promise<void> {
    // When a user is verified, maybe track them
    this.on(AppEvents.USER_VERIFIED, async (data) => {
      console.log('New verified user - offer welcome discount?');
    });
  }

  getRoutes(): any[] {
    return [{ path: 'products', controller: ProductController }];
  }
}
```

## Key Interfaces

### IMicroApp
```typescript
interface IMicroApp {
  name: string;
  version: string;
  enabled: boolean;
  initialize(context: IAppContext): Promise<void>;
  shutdown?(): Promise<void>;
  getRoutes(): any[];
  getProviders(): any[];
}
```

### IAppContext
```typescript
interface IAppContext {
  mongo: any;                  // MongoDB connection
  eventBus: IEventBus;        // Event publisher/subscriber
  serviceLocator: IServiceLocator;  // Service registry
  config: IConfig;             // Configuration
}
```

### IEventBus
```typescript
interface IEventBus {
  emit(event: string, data: any): void;
  on(event: string, handler: (data: any) => void): void;
  off(event: string, handler: (data: any) => void): void;
}
```

### IServiceLocator
```typescript
interface IServiceLocator {
  register(name: string, service: any): void;
  resolve(name: string): any;  // Throws if not found
  resolveOptional(name: string): any | null;
}
```

## Benefits of This Architecture

✅ **Modularity**: Each feature is independent and self-contained
✅ **Scalability**: Micro-apps can be deployed separately
✅ **Testability**: Each module can be tested in isolation
✅ **Maintainability**: Changes in one module don't affect others
✅ **Reusability**: Services can be used across micro-apps
✅ **Extensibility**: Add new features without modifying existing code
✅ **Performance**: Enable/disable features as needed
✅ **Hot-reloading**: (Future) Replace modules without restart

## Migration Plan

**Phase 1** (Current): 
- ✅ Create core infrastructure
- ✅ Move Auth into micro-app structure

**Phase 2** (Next):
- Migrate Products to micro-app
- Migrate Orders to micro-app
- Migrate Checkout to micro-app

**Phase 3** (Future):
- Add hot-reloading capability
- Create admin dashboard to manage micro-apps
- Add performance metrics per micro-app
- Implement micro-app dependency management

## Configuration

Micro-apps use the shared configuration from `IAppContext`:

```typescript
interface IConfig {
  nodeEnv: string;
  port: number;
  mongoUri: string;
  mongoDb: string;
  jwtSecret: string;
  jwtExpiration: string;
  frontendUrl: string;
  resendApiKey: string;
  [key: string]: any;
}
```

## Logging

All micro-apps use consistent logging:
- `[REGISTRY]` - Registry operations
- `[AUTH_SERVICE]` - Auth service operations
- `[AUTH_CONTROLLER]` - Auth HTTP endpoints
- `[EVENT_BUS]` - Event emissions and subscriptions
- `[SERVICE_LOCATOR]` - Service registration and resolution

## Next Steps

1. Complete auth micro-app implementation
2. Create products micro-app
3. Create orders micro-app
4. Create checkout micro-app
5. Implement inter-app communication examples
6. Add monitoring and metrics
7. Implement hot-reloading
