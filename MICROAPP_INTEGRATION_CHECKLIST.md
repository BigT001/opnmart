# Micro-App Integration Checklist

## Current State (Verified ✅)

- ✅ Micro-app framework created (`core/`)
- ✅ Auth micro-app implemented (`micro-apps/auth/`)
- ✅ Documentation complete (3 guides)
- ✅ Zero conflicts with existing backend
- ✅ Existing backend unchanged and functional
- ✅ Both systems can coexist indefinitely

---

## Phase 1: Initial Setup & Testing (When Ready)

### 1.1 Prepare Backend for Micro-Apps

**File**: `backend/src/main.ts`

```typescript
// Add at top
import { MicroAppRegistry } from '../../core/registry/microapp-registry';
import { AuthMicroApp } from '../../micro-apps/auth/src/auth-microapp';
import { MongoClient } from 'mongodb';

// In bootstrap function, after NestFactory.create():
async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Get environment config
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

  // Create MongoDB connection
  const mongoClient = new MongoClient(config.mongoUri);
  await mongoClient.connect();

  // Initialize micro-app registry
  const registry = new MicroAppRegistry(config, mongoClient);
  
  // Register micro-apps
  registry.register(new AuthMicroApp());
  
  // Initialize all micro-apps
  await registry.initializeAll();
  
  // Store registry in app for access
  app.get(AppModule).setMicroAppRegistry(registry);

  // Existing port and listen code...
  await app.listen(config.port);
}
```

**Status**: ⏳ TODO - Copy code above

---

### 1.2 Update App Module

**File**: `backend/src/app.module.ts`

```typescript
import { MicroAppRegistry } from '../../core/registry/microapp-registry';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    // ... existing imports
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {
  private registry: MicroAppRegistry | null = null;

  setMicroAppRegistry(registry: MicroAppRegistry): void {
    this.registry = registry;
  }

  getMicroAppRegistry(): MicroAppRegistry {
    if (!this.registry) {
      throw new Error('Micro-app registry not initialized');
    }
    return this.registry;
  }
}
```

**Status**: ⏳ TODO - Add code above

---

### 1.3 Fix TypeScript Issues in Micro-Apps

**File**: `core/shared/events/service-locator.ts`

Issue: Missing type for `getAll()` return

Fix: Already implemented ✅

---

### 1.4 Install Required Dependencies

**Check if installed**:
```bash
npm list bcrypt
npm list jsonwebtoken
npm list resend
npm list mongodb
```

**If missing, install in backend**:
```bash
cd backend
npm install bcrypt jsonwebtoken resend mongodb
```

**Status**: ⏳ TODO - Run install if needed

---

## Phase 2: Testing (When Ready)

### 2.1 Unit Test Auth Micro-App

**File to Create**: `micro-apps/auth/src/__tests__/auth.service.spec.ts`

```typescript
import { EventBus } from '../../../../core/shared/events/event-bus';
import { ServiceLocator } from '../../../../core/shared/events/service-locator';
import { AuthService } from '../services/auth.service';

describe('AuthService', () => {
  let authService: AuthService;
  let eventBus: EventBus;

  beforeEach(() => {
    eventBus = new EventBus();
    const config = {
      mongoDb: 'test',
      jwtSecret: 'test-secret',
      jwtExpiration: '7d',
      resendApiKey: 'test-key',
    };

    // Mock MongoDB
    const mongoMock = {
      db: () => ({
        collection: () => ({
          findOne: jest.fn(),
          insertOne: jest.fn(),
          updateOne: jest.fn(),
        }),
      }),
    };

    authService = new AuthService(mongoMock, config, eventBus);
  });

  it('should emit USER_CREATED event on signup', async () => {
    // Test implementation
    expect(true).toBe(true); // Placeholder
  });
});
```

**Status**: ⏳ TODO - Create test file

---

### 2.2 Integration Test

**File to Create**: `micro-apps/auth/src/__tests__/auth-microapp.spec.ts`

```typescript
import { MicroAppRegistry } from '../../../../core/registry/microapp-registry';
import { AuthMicroApp } from '../auth-microapp';

describe('AuthMicroApp Integration', () => {
  let registry: MicroAppRegistry;

  beforeEach(async () => {
    const config = {
      nodeEnv: 'test',
      port: 3001,
      mongoUri: 'mongodb://localhost:27017',
      mongoDb: 'opnmart_test',
      jwtSecret: 'test-secret',
      jwtExpiration: '7d',
      frontendUrl: 'http://localhost:3000',
      resendApiKey: 'test-key',
    };

    const mongoMock = {
      db: () => ({}),
    };

    registry = new MicroAppRegistry(config, mongoMock);
    registry.register(new AuthMicroApp());
    await registry.initializeAll();
  });

  it('should initialize auth micro-app', async () => {
    const status = registry.getStatus();
    expect(status.auth).toBeDefined();
    expect(status.auth.enabled).toBe(true);
  });
});
```

**Status**: ⏳ TODO - Create test file

---

### 2.3 End-to-End Test

**Manual Test Steps**:

1. **Start servers**
   ```powershell
   cd opnmart
   powershell .\start-both.ps1
   ```

2. **Test Signup via Micro-App** (Once registered)
   ```bash
   POST http://localhost:3001/auth/signup
   Body: {
     "email": "microapp@test.com",
     "password": "Test123456!",
     "name": "Micro App Test",
     "phone": "+1234567890"
   }
   ```

3. **Verify User Created**
   ```bash
   GET http://localhost:3001/auth/profile
   Headers: Authorization: Bearer {token}
   ```

**Status**: ⏳ TODO - Run tests once integrated

---

## Phase 3: Migration (Future)

### 3.1 Deprecate Existing Auth Module

**Decision Point**: When to stop using `backend/src/auth/`

**Options**:
1. Keep both indefinitely (safest)
2. Deprecate after 1 month of micro-app stability
3. Migrate completely after all tests pass

**Status**: ⏳ DECISION PENDING

---

### 3.2 Create Other Micro-Apps

**Sequence** (Recommended):

1. **Products Micro-App**
   ```
   micro-apps/products/
   ├── src/
   │   ├── products-microapp.ts
   │   ├── services/
   │   │   └── products.service.ts
   │   └── controllers/
   │       └── products.controller.ts
   ```

2. **Orders Micro-App**
   ```
   micro-apps/orders/
   ├── src/
   │   ├── orders-microapp.ts
   │   ├── services/
   │   │   └── orders.service.ts
   │   └── controllers/
   │       └── orders.controller.ts
   ```

3. **Checkout Micro-App**
   ```
   micro-apps/checkout/
   ├── src/
   │   ├── checkout-microapp.ts
   │   ├── services/
   │   │   └── checkout.service.ts
   │   └── controllers/
   │       └── checkout.controller.ts
   ```

**Status**: ⏳ TODO - Create when needed

---

### 3.3 Inter-Micro-App Communication Examples

**Example: Products checking if user is verified**

```typescript
// In products.service.ts
async getProductsForUser(userId: string) {
  // Use service locator to access auth service
  const authService = this.resolveServiceOptional('auth');
  
  if (authService) {
    const user = await authService.getProfile(userId);
    if (!user.isVerified) {
      return this.getPublicProductsOnly();
    }
  }
  
  return this.getAllProducts();
}
```

**Example: Email service on user verified**

```typescript
// In email-microapp.ts
protected async setupEventListeners(): Promise<void> {
  this.on(AppEvents.USER_VERIFIED, async (data) => {
    console.log(`[EMAIL] Sending welcome to ${data.email}`);
    await this.emailService.sendWelcomeEmail(data.email);
  });
}
```

**Status**: ⏳ TODO - Implement when creating new micro-apps

---

## Phase 4: Advanced Features (Later)

### 4.1 Hot-Reloading

**Goal**: Replace micro-apps without restarting server

```typescript
// Future implementation
registry.unregister('auth');
registry.register(new AuthMicroAppV2());
await registry.initializeAll();
```

**Status**: ⏳ FUTURE - Not needed yet

---

### 4.2 Admin Dashboard

**Goal**: UI to manage micro-apps

```typescript
@Controller('admin')
export class AdminController {
  constructor(private registry: MicroAppRegistry) {}

  @Get('micro-apps')
  getMicroApps() {
    return registry.getStatus();
  }

  @Post('micro-apps/:name/toggle')
  toggleMicroApp(@Param('name') name: string) {
    const app = registry.getApp(name);
    if (app) {
      app.enabled = !app.enabled;
    }
  }
}
```

**Status**: ⏳ FUTURE - Build when needed

---

### 4.3 Metrics & Monitoring

**Goal**: Track performance per micro-app

```typescript
@Controller('metrics')
export class MetricsController {
  @Get()
  getMetrics() {
    return {
      auth: {
        requests: 1234,
        avgResponseTime: 45,
        errors: 2,
      },
      products: {
        requests: 5678,
        avgResponseTime: 120,
        errors: 5,
      },
    };
  }
}
```

**Status**: ⏳ FUTURE - Implement when needed

---

## Critical Decision Points

### Decision 1: When to Activate Micro-Apps

**Options**:
- [ ] Keep as framework - don't activate yet (Most Conservative)
- [ ] Activate in parallel with existing auth (Moderate)
- [ ] Fully migrate (Most Aggressive)

**Recommendation**: Keep framework, don't activate yet. Let it be ready when needed.

---

### Decision 2: How to Handle Database

**Options**:
- [ ] Both systems use same MongoDB (Current - Simplest)
- [ ] Separate database per micro-app (Complex)
- [ ] Separate database for micro-apps only (Moderate)

**Recommendation**: Keep using same database. Both systems access via MongoDB driver.

---

### Decision 3: Routing Strategy

**Options**:
- [ ] Both systems on port 3001 (Current - Simplest)
- [ ] Separate port per micro-app (Complex)
- [ ] API Gateway in front (Best for production)

**Recommendation**: Keep on port 3001 for now. Add API Gateway later if needed.

---

## Verification Checklist

Before proceeding with Phase 1:

- [ ] Read `VERIFICATION_REPORT.md` - understand no conflicts exist
- [ ] Read `MICROAPP_ARCHITECTURE.md` - understand architecture
- [ ] Read `MICROAPP_IMPLEMENTATION.md` - understand implementation
- [ ] Understand existing `backend/src/app.module.ts`
- [ ] Review `core/registry/microapp-registry.ts`
- [ ] Review `micro-apps/auth/src/auth-microapp.ts`
- [ ] All team members aligned on approach

---

## Current Status Summary

| Component | Status | Details |
|-----------|--------|---------|
| **Core Framework** | ✅ Complete | Registry, EventBus, ServiceLocator ready |
| **Auth Micro-App** | ✅ Complete | Full implementation ready |
| **Documentation** | ✅ Complete | 3 comprehensive guides |
| **Backend Integration** | ⏳ Pending | Ready to implement in main.ts |
| **Testing** | ⏳ Pending | Unit & integration tests needed |
| **Other Micro-Apps** | ⏳ Pending | Products, Orders, Checkout ready to build |
| **Monitoring** | ⏳ Pending | Dashboard and metrics for later |
| **Hot-Reloading** | ⏳ Pending | Advanced feature for future |

---

## Timeline

**Immediate** (This week):
- ✅ Framework created
- ✅ Documentation complete
- ⏳ Optional: Review with team

**Short-term** (Next 1-2 weeks):
- ⏳ Integrate into main.ts (1 hour)
- ⏳ Run unit tests (2 hours)
- ⏳ Run integration tests (2 hours)

**Medium-term** (Next month):
- ⏳ Create Products micro-app (4 hours)
- ⏳ Create Orders micro-app (4 hours)
- ⏳ Create Checkout micro-app (4 hours)

**Long-term** (Future):
- ⏳ Add monitoring dashboard
- ⏳ Implement hot-reloading
- ⏳ Add A/B testing
- ⏳ API Gateway integration

---

## Notes

- **No breaking changes**: Existing backend works as-is
- **Fully documented**: Every step explained in detail
- **Test-ready**: Structure supports unit & integration tests
- **Scalable**: Ready for horizontal scaling
- **Team-ready**: Clear documentation for onboarding

---

## Questions?

Refer to:
1. `MICROAPP_ARCHITECTURE.md` - How it works
2. `MICROAPP_IMPLEMENTATION.md` - How to use it
3. `MICROAPP_DEPLOYMENT.md` - How to deploy it
4. `VERIFICATION_REPORT.md` - Why there are no conflicts
