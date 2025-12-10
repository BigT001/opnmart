# Micro-App Architecture - Implementation Guide

## Quick Start

### 1. Initialize Registry in Main Application

The registry should be initialized in your NestJS main application (e.g., `main.ts`):

```typescript
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { MicroAppRegistry } from '../../core/registry/microapp-registry';
import { AuthMicroApp } from '../../micro-apps/auth/src/auth-microapp';
import { MongoClient } from 'mongodb';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Get configuration
  const config = {
    nodeEnv: process.env.NODE_ENV || 'development',
    port: parseInt(process.env.PORT || '3001'),
    mongoUri: process.env.MONGODB_URI!,
    mongoDb: process.env.MONGODB_DB!,
    jwtSecret: process.env.JWT_SECRET!,
    jwtExpiration: process.env.JWT_EXPIRATION || '7d',
    frontendUrl: process.env.FRONTEND_URL!,
    resendApiKey: process.env.RESEND_API_KEY!,
  };

  // Connect to MongoDB
  const mongoClient = new MongoClient(config.mongoUri);
  await mongoClient.connect();

  // Create registry
  const registry = new MicroAppRegistry(config, mongoClient);

  // Register all micro-apps
  registry.register(new AuthMicroApp());
  // registry.register(new ProductsMicroApp());
  // registry.register(new OrdersMicroApp());

  // Initialize all micro-apps
  await registry.initializeAll();

  // Use registry in app
  app.get(AppModule).setRegistry(registry);

  // Get all routes and providers from micro-apps
  const allRoutes = registry.getAllRoutes();
  const allProviders = registry.getAllProviders();

  await app.listen(config.port);
  console.log(`Application running on port ${config.port}`);
}

bootstrap();
```

### 2. Create App Module

The app module should import providers from micro-apps:

```typescript
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MicroAppRegistry } from '../../core/registry/microapp-registry';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ['.env.local', '.env'],
    }),
  ],
})
export class AppModule {
  private registry: MicroAppRegistry | null = null;

  setRegistry(registry: MicroAppRegistry): void {
    this.registry = registry;
  }

  getRegistry(): MicroAppRegistry {
    if (!this.registry) {
      throw new Error('Registry not initialized');
    }
    return this.registry;
  }
}
```

### 3. Access Micro-Apps in Controllers

Controllers can access micro-app services:

```typescript
import { Controller, Get, Inject } from '@nestjs/common';
import { AuthService } from '../../../micro-apps/auth/src/services/auth.service';

@Controller('api')
export class StatusController {
  constructor(
    @Inject('auth') private authService: AuthService,
  ) {}

  @Get('status')
  getStatus() {
    return { status: 'ok', auth: 'enabled' };
  }
}
```

## Event-Driven Examples

### Example 1: Send Welcome Email on Verification

**Auth Micro-App** emits event:
```typescript
// In auth.service.ts
async verifyEmail(userId: string, code: string) {
  // ... verify logic ...
  this.eventBus.emit(AppEvents.USER_VERIFIED, {
    userId,
    email: user.email,
    name: user.name,
  });
}
```

**Email Micro-App** listens:
```typescript
// In email-microapp.ts
protected async setupEventListeners(): Promise<void> {
  this.on(AppEvents.USER_VERIFIED, async (data) => {
    console.log('[EMAIL] Sending welcome email to:', data.email);
    await this.emailService.sendWelcomeEmail(data.email, data.name);
  });
}
```

### Example 2: Track User Registration

**Analytics Micro-App** listens to auth events:
```typescript
// In analytics-microapp.ts
protected async setupEventListeners(): Promise<void> {
  this.on(AppEvents.USER_CREATED, async (data) => {
    console.log('[ANALYTICS] New user created:', data.email);
    await this.logEvent('user_registered', data);
  });

  this.on(AppEvents.USER_VERIFIED, async (data) => {
    console.log('[ANALYTICS] User verified:', data.email);
    await this.logEvent('user_verified', data);
  });

  this.on(AppEvents.AUTH_SUCCESS, async (data) => {
    console.log('[ANALYTICS] Login:', data.email);
    await this.logEvent('user_login', data);
  });
}
```

### Example 3: Products Checking User Status

**Products Service** uses Service Locator:
```typescript
// In products.service.ts
async getProductsForUser(userId: string) {
  // Get auth service from service locator
  const authService = this.serviceLocator.resolveOptional('auth');
  
  if (authService) {
    const user = await authService.getProfile(userId);
    
    if (!user.isVerified) {
      // Show limited products for unverified users
      return this.getPublicProducts();
    }
  }
  
  // Show all products for verified users
  return this.getAllProducts();
}
```

## Testing Micro-Apps

### Unit Testing a Service

```typescript
import { EventBus } from '../../../core/shared/events/event-bus';
import { ServiceLocator } from '../../../core/shared/events/service-locator';
import { AuthService } from './auth.service';

describe('AuthService', () => {
  let authService: AuthService;
  let eventBus: EventBus;

  beforeEach(() => {
    eventBus = new EventBus();
    const config = {
      mongoDb: 'test',
      jwtSecret: 'test-secret',
      jwtExpiration: '7d',
    };

    authService = new AuthService(mongoMock, config, eventBus);
  });

  it('should emit event on user creation', async () => {
    const emitSpy = jest.spyOn(eventBus, 'emit');
    
    await authService.signup('test@example.com', 'password', 'Test', '123');
    
    expect(emitSpy).toHaveBeenCalledWith('user:created', expect.any(Object));
  });

  it('should reject unverified users on login', async () => {
    // Setup unverified user
    
    await expect(
      authService.login('unverified@test.com', 'password'),
    ).rejects.toThrow('Please verify your email first');
  });
});
```

### Integration Testing

```typescript
describe('Auth Micro-App Integration', () => {
  let registry: MicroAppRegistry;

  beforeEach(async () => {
    registry = new MicroAppRegistry(testConfig, mongoClient);
    registry.register(new AuthMicroApp());
    await registry.initializeAll();
  });

  it('should handle complete signup flow', async () => {
    const authService = registry.getContext().serviceLocator.resolve('auth');
    
    // Signup
    const signupResult = await authService.signup(
      'integration@test.com',
      'Password123!',
      'Test User',
      '+1234567890',
    );
    
    expect(signupResult.access_token).toBeDefined();
  });
});
```

## Dependency Injection

### Micro-Apps can inject dependencies

```typescript
// If you want to use NestJS DI with micro-apps:

@Module({
  providers: [
    {
      provide: 'AUTH_SERVICE',
      useClass: AuthService,
    },
  ],
  exports: ['AUTH_SERVICE'],
})
export class AuthModule {}
```

## Performance Considerations

### 1. Event Bus Load
For high-volume events, consider:
```typescript
// Async event handling
eventBus.emitAsync(event, data);

// Batching events
batchedEventBus.emit(['event1', 'event2'], [data1, data2]);
```

### 2. Service Locator Caching
```typescript
// Cache frequently accessed services
private authService: AuthService;

protected async onInitialize(): Promise<void> {
  this.authService = this.resolveService('auth');
}
```

### 3. Database Connection Pooling
```typescript
// Use connection pooling in MongoDB
const mongoClient = new MongoClient(uri, {
  maxPoolSize: 10,
  minPoolSize: 5,
});
```

## Monitoring and Debugging

### Check Micro-App Status

```typescript
// In your app
const registry = app.get(AppModule).getRegistry();
const status = registry.getStatus();
console.log('Micro-App Status:', status);
// Output:
// {
//   auth: { version: '1.0.0', enabled: true },
//   products: { version: '1.0.0', enabled: true },
// }
```

### Enable Debug Logging

```typescript
// Set environment variable
process.env.DEBUG = 'opnmart:*';

// This will enable verbose logging from:
// [REGISTRY]
// [AUTH_SERVICE]
// [EVENT_BUS]
// [SERVICE_LOCATOR]
```

### Watch Event Flow

```typescript
// Add universal event listener
const eventBus = registry.getContext().eventBus;
eventBus.on('*', (event, data) => {
  console.log(`[EVENT FLOW] ${event}`, data);
});
```

## Migration Checklist

For migrating existing features to micro-apps:

- [ ] Create micro-app folder structure
- [ ] Create `*-microapp.ts` class extending `BaseMicroApp`
- [ ] Move services to `services/` folder
- [ ] Move controllers to `controllers/` folder
- [ ] Extract schemas to `schemas/` folder
- [ ] Extract guards to `guards/` folder
- [ ] Update imports to use shared types from `core/shared/types`
- [ ] Replace direct dependencies with service locator
- [ ] Replace internal events with event bus
- [ ] Update tests to work with isolated services
- [ ] Register micro-app in registry
- [ ] Test complete flow end-to-end
- [ ] Update documentation

## Troubleshooting

### "Service not found" Error
```
[SERVICE_LOCATOR] Service not found: auth
```
**Solution**: Make sure the micro-app is:
1. Registered with `registry.register()`
2. Initialized with `registry.initializeAll()`
3. Registered service in `registerServices()` method

### Event Handler Not Firing
```
[EVENT_BUS] Emitting: user:verified {userId: '123'}
// But handler doesn't run
```
**Solution**: Make sure:
1. Event listener is set up in `setupEventListeners()`
2. Event name matches exactly
3. Micro-app is initialized before event is emitted

### MongoDB Connection Issues
**Solution**: Ensure:
1. MongoDB connection string is correct
2. Database name matches in config
3. Connection is established before micro-app initialization

## Best Practices

1. **Always extend BaseMicroApp** for consistency
2. **Use service locator** instead of direct imports
3. **Emit events** for cross-app communication
4. **Log with micro-app prefix** for debugging
5. **Validate in DTOs** not in controllers
6. **Use interfaces** from `core/shared/types`
7. **Handle errors gracefully** - don't throw in event handlers
8. **Test in isolation** before integration testing
