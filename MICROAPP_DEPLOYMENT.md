# Micro-App Architecture - Deployment & Scaling Guide

## Overview

OpenMart now uses a **modular micro-app architecture** designed for scalability and independent feature development. This guide covers deployment, scaling, and operational aspects.

## Architecture Summary

### Core Components

1. **Micro-App Registry** (`core/registry/microapp-registry.ts`)
   - Central orchestrator for all micro-apps
   - Manages lifecycle (initialization, shutdown)
   - Collects routes and providers from all apps
   - Enables hot-reloading (future feature)

2. **Shared Foundation** (`core/shared/`)
   - Event Bus: Async communication between micro-apps
   - Service Locator: Service discovery and registration
   - Type Definitions: Shared interfaces and types
   - Database: MongoDB connection management
   - Middleware: Shared middleware and utilities

3. **Individual Micro-Apps** (`micro-apps/*/`)
   - Auth: User authentication and email verification
   - Products: Product catalog (planned)
   - Orders: Order management (planned)
   - Checkout: Checkout process (planned)

### Communication Patterns

**Event-Driven**:
```
Auth Service → emit(USER_VERIFIED) → Email Service → send welcome email
```

**Service Discovery**:
```
Products Service → resolveService(auth) → verify user → return product list
```

## Deployment Strategies

### Strategy 1: Monolithic Deployment (Current)

All micro-apps in single NestJS application on port 3001.

**Advantages**:
- Simple deployment
- Shared database connection
- Easier transaction management
- Lower operational overhead

**When to use**:
- MVP/early stage
- Limited traffic
- Small team

**Deployment script**:
```powershell
# backend/
npm install
npm run build
npm run start
```

### Strategy 2: Modular Deployment (Recommended)

Deploy frequently-changing features as separate services.

**Example: Auth as Separate Microservice**

```powershell
# Create auth service
cd micro-apps/auth
npm init
npm install @nestjs/core @nestjs/common
npm install mongodb bcrypt jsonwebtoken resend

# Create service.ts
# Create main.ts for standalone app
npm run start
# Runs on port 3002
```

**App Module updates**:
```typescript
// Instead of local import
import { AuthMicroApp } from '../../micro-apps/auth/src/auth-microapp';

// Use HTTP client
const authService = new HttpAuthServiceProxy('http://localhost:3002/auth');
```

### Strategy 3: Serverless Deployment (Advanced)

Deploy micro-apps as serverless functions.

**Auth on AWS Lambda**:
```typescript
// micro-apps/auth/lambda/handler.ts
import { AuthMicroApp } from '../src/auth-microapp';

export const handler = async (event) => {
  const authApp = new AuthMicroApp();
  const result = await authApp.handleRequest(event);
  return result;
};
```

## Scaling Patterns

### Horizontal Scaling

**Load Balanced Services**:
```
                    Load Balancer
                   /    |    \
                  /     |     \
            Auth 1  Auth 2  Auth 3
                   \     |     /
                    \    |    /
                Shared MongoDB
```

**Implementation**:
```typescript
// Use MongoDB connection pooling
const mongoClient = new MongoClient(uri, {
  maxPoolSize: 100,
  minPoolSize: 10,
  serverSelectionTimeoutMS: 5000,
});
```

### Vertical Scaling

**Within Single Process**:
```typescript
// Increase pool sizes
maxPoolSize: 200

// Implement caching
const cache = new NodeCache({ stdTTL: 600 });

// Enable clustering
const cluster = require('cluster');
const numCPUs = require('os').cpus().length;

if (cluster.isMaster) {
  for (let i = 0; i < numCPUs; i++) {
    cluster.fork();
  }
}
```

### Database Scaling

**MongoDB Sharding**:
```typescript
// Use sharded collection for high-volume data
db.createCollection('users', {
  shardKey: { email: 'hashed' }
});

// Ensure indexes
await users.createIndex({ email: 1 });
```

## Performance Optimization

### 1. Event Bus Optimization

```typescript
// Instead of sync handlers
eventBus.emit(event, data);

// Use async batching
async emit(event: string, data: any) {
  this.queue.push({ event, data });
  if (this.queue.length >= BATCH_SIZE) {
    await this.processBatch();
  }
}
```

### 2. Service Caching

```typescript
// Micro-apps can cache frequently accessed services
export class ProductsMicroApp extends BaseMicroApp {
  private authService: AuthService;

  protected async onInitialize(): Promise<void> {
    this.authService = this.resolveService('auth');
    // Now it's cached for all requests
  }
}
```

### 3. Database Query Optimization

```typescript
// Use indexes
await users.createIndex({ email: 1 });
await users.createIndex({ isVerified: 1 });

// Use projection to limit fields
const user = await users.findOne(
  { _id: userId },
  { projection: { email: 1, name: 1, isVerified: 1 } }
);

// Use aggregation for complex queries
const result = await users.aggregate([
  { $match: { isVerified: true } },
  { $group: { _id: '$role', count: { $sum: 1 } } },
]).toArray();
```

## Monitoring & Observability

### Logging Strategy

Each micro-app logs with a prefix:
```
[REGISTRY] - Registry operations
[AUTH_SERVICE] - Auth business logic
[AUTH_CONTROLLER] - HTTP endpoints
[EVENT_BUS] - Event emissions
[SERVICE_LOCATOR] - Service registration
```

**Implementation**:
```typescript
// Centralized logger
export class Logger {
  static info(app: string, message: string, data?: any) {
    console.log(`[${app.toUpperCase()}] ${message}`, data || '');
  }

  static error(app: string, message: string, error?: any) {
    console.error(`[${app.toUpperCase()}] ❌ ${message}`, error || '');
  }
}
```

### Metrics Collection

```typescript
export class MetricsService {
  private metrics = new Map<string, Metric>();

  recordRequest(app: string, endpoint: string, duration: number) {
    const key = `${app}:${endpoint}`;
    const metric = this.metrics.get(key) || new Metric();
    metric.count++;
    metric.totalTime += duration;
    metric.avgTime = metric.totalTime / metric.count;
    this.metrics.set(key, metric);
  }

  getMetrics() {
    return Object.fromEntries(this.metrics);
  }
}
```

### Health Checks

```typescript
@Controller('health')
export class HealthController {
  constructor(private registry: MicroAppRegistry) {}

  @Get('status')
  getStatus() {
    return {
      status: 'ok',
      timestamp: new Date(),
      microApps: this.registry.getStatus(),
      uptime: process.uptime(),
    };
  }

  @Get('ready')
  getReadiness() {
    return {
      ready: this.registry.isInitialized(),
      apps: this.registry.getAll().size,
    };
  }
}
```

## Operational Tasks

### Adding a New Feature

1. Create micro-app folder
2. Implement service
3. Register in registry
4. Test in isolation
5. Deploy with feature flag disabled initially

### Disabling a Feature

```typescript
// In registry initialization
const authApp = new AuthMicroApp();
authApp.enabled = false;  // Disable
registry.register(authApp);
```

### Database Maintenance

```typescript
// Backup users collection
mongodump --db opnmart_fresh --collection users --out ./backups

// Restore
mongorestore --db opnmart_fresh --collection users ./backups/opnmart_fresh/users.bson

// Create indexes
mongo opnmart_fresh --eval "db.users.createIndex({email: 1})"
```

### Log Management

```powershell
# Rotate logs daily
Get-ChildItem logs/ | Where-Object {$_.LastWriteTime -lt (Get-Date).AddDays(-7)} | Remove-Item

# Analyze error logs
Get-Content logs/error.log | Select-String "ERROR" | Measure-Object
```

## Security Considerations

### 1. Service-to-Service Communication

```typescript
// If deploying as separate services, use mTLS
const options = {
  ca: fs.readFileSync('ca.pem'),
  cert: fs.readFileSync('cert.pem'),
  key: fs.readFileSync('key.pem'),
};

const app = https.createServer(options, expressApp);
```

### 2. API Keys Management

```typescript
// Use environment variables for sensitive data
const resendApiKey = process.env.RESEND_API_KEY;
const jwtSecret = process.env.JWT_SECRET;

// Never log sensitive data
console.log('[AUTH] Signup for:', email);
// ❌ DON'T: console.log('[AUTH] Password:', password);
```

### 3. Rate Limiting

```typescript
@UseGuards(RateLimitGuard)
@Post('signup')
async signup(@Body() dto: SignupDto) {
  // Allow max 5 signups per IP per hour
}
```

## Troubleshooting

### Issue: Micro-app not initializing

**Debug**:
```typescript
const registry = new MicroAppRegistry(config, mongo);
registry.register(new AuthMicroApp());

try {
  await registry.initializeAll();
} catch (error) {
  console.error('Initialization failed:', error);
  console.log('App status:', registry.getStatus());
}
```

### Issue: Service not found

**Debug**:
```typescript
const services = registry.getContext().serviceLocator.getAll();
console.log('Available services:', Object.keys(services));
```

### Issue: Event not firing

**Debug**:
```typescript
const eventBus = registry.getContext().eventBus;

// Add universal listener
eventBus.on('*', (event, data) => {
  console.log(`[DEBUG] Event: ${event}`, data);
});
```

## Future Enhancements

1. **Hot-Reloading**: Replace micro-apps without restart
2. **Dynamic Plugin System**: Load/unload micro-apps at runtime
3. **Distributed Tracing**: Track requests across micro-apps
4. **Circuit Breakers**: Handle service failures gracefully
5. **API Gateway**: Central entry point for all micro-apps
6. **Admin Dashboard**: Manage micro-apps visually
7. **A/B Testing**: Run multiple versions of features
8. **Blue-Green Deployment**: Zero-downtime updates

## Quick Reference

| Task | Command |
|------|---------|
| Start dev servers | `powershell start-both.ps1` |
| Rebuild backend | `cd backend && npm run build` |
| Run tests | `npm test` |
| Check health | `curl http://localhost:3001/health/status` |
| View logs | `tail -f logs/error.log` |
| Reset database | `powershell backend/reset-database.js` |

## Resources

- **Architecture Guide**: `MICROAPP_ARCHITECTURE.md`
- **Implementation Guide**: `MICROAPP_IMPLEMENTATION.md`
- **Type Definitions**: `core/shared/types/index.ts`
- **Registry Source**: `core/registry/microapp-registry.ts`
- **Auth Micro-App**: `micro-apps/auth/src/auth-microapp.ts`
