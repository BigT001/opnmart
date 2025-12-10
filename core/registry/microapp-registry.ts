/**
 * Micro-App Registry
 * Manages registration, initialization, and lifecycle of all micro-apps
 * This is the central hub that loads and orchestrates all modules
 */

import { IMicroApp, IAppContext, AppEvents } from '../shared/types';
import { EventBus } from '../shared/events/event-bus';
import { ServiceLocator } from '../shared/events/service-locator';
import { IConfig } from '../shared/types';

export class MicroAppRegistry {
  private apps: Map<string, IMicroApp> = new Map();
  private context: IAppContext;
  private initialized: boolean = false;

  constructor(config: IConfig, mongo: any) {
    this.context = {
      mongo,
      eventBus: new EventBus(),
      serviceLocator: new ServiceLocator(),
      config,
    };
  }

  /**
   * Register a micro-app
   */
  register(app: IMicroApp): void {
    if (this.apps.has(app.name)) {
      throw new Error(`Micro-app '${app.name}' is already registered`);
    }
    this.apps.set(app.name, app);
    console.log(`[REGISTRY] Registered micro-app: ${app.name} v${app.version}`);
  }

  /**
   * Initialize all registered micro-apps
   */
  async initializeAll(): Promise<void> {
    console.log(`\n[REGISTRY] ========== INITIALIZING MICRO-APPS ==========`);
    console.log(`[REGISTRY] Found ${this.apps.size} registered micro-app(s)`);

    for (const [name, app] of this.apps) {
      if (!app.enabled) {
        console.log(`[REGISTRY] ⊘ Skipping disabled app: ${name}`);
        continue;
      }

      try {
        console.log(`[REGISTRY] → Initializing: ${name} v${app.version}`);
        await app.initialize(this.context);
        this.context.eventBus.emit(AppEvents.MICRO_APP_INITIALIZED, { app: name });
        console.log(`[REGISTRY] ✅ ${name} initialized successfully`);
      } catch (error) {
        console.error(`[REGISTRY] ❌ Failed to initialize ${name}:`, error);
        this.context.eventBus.emit(AppEvents.MICRO_APP_FAILED, {
          app: name,
          error: (error as any).message,
        });
        throw error;
      }
    }

    this.initialized = true;
    console.log(`[REGISTRY] ========== ALL MICRO-APPS READY ==========\n`);
  }

  /**
   * Shutdown all micro-apps
   */
  async shutdownAll(): Promise<void> {
    console.log(`\n[REGISTRY] ========== SHUTTING DOWN MICRO-APPS ==========`);

    for (const [name, app] of this.apps) {
      if (app.shutdown) {
        try {
          console.log(`[REGISTRY] → Shutting down: ${name}`);
          await app.shutdown();
          console.log(`[REGISTRY] ✅ ${name} shut down successfully`);
        } catch (error) {
          console.error(`[REGISTRY] ❌ Error shutting down ${name}:`, error);
        }
      }
    }

    this.context.serviceLocator.clearAll();
    (this.context.eventBus as any).clearAll();
    console.log(`[REGISTRY] ========== ALL MICRO-APPS SHUT DOWN ==========\n`);
  }

  /**
   * Get all routes from all micro-apps
   */
  getAllRoutes(): any[] {
    const allRoutes: any[] = [];
    for (const [name, app] of this.apps) {
      if (app.enabled) {
        const routes = app.getRoutes();
        console.log(`[REGISTRY] Collecting ${routes.length} route(s) from ${name}`);
        allRoutes.push(...routes);
      }
    }
    return allRoutes;
  }

  /**
   * Get all providers from all micro-apps
   */
  getAllProviders(): any[] {
    const allProviders: any[] = [];
    for (const [name, app] of this.apps) {
      if (app.enabled) {
        const providers = app.getProviders();
        console.log(`[REGISTRY] Collecting ${providers.length} provider(s) from ${name}`);
        allProviders.push(...providers);
      }
    }
    return allProviders;
  }

  /**
   * Get a specific micro-app
   */
  getApp(name: string): IMicroApp | undefined {
    return this.apps.get(name);
  }

  /**
   * Get context for micro-apps
   */
  getContext(): IAppContext {
    return this.context;
  }

  /**
   * Check if registry is initialized
   */
  isInitialized(): boolean {
    return this.initialized;
  }

  /**
   * Get all registered micro-apps
   */
  getAll(): Map<string, IMicroApp> {
    return this.apps;
  }

  /**
   * Get status of all micro-apps
   */
  getStatus(): Record<string, { version: string; enabled: boolean }> {
    const status: Record<string, { version: string; enabled: boolean }> = {};
    for (const [name, app] of this.apps) {
      status[name] = {
        version: app.version,
        enabled: app.enabled,
      };
    }
    return status;
  }
}
