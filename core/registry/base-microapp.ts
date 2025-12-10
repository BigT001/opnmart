/**
 * Base Micro-App Template
 * All micro-apps should extend this class
 * Provides common functionality and initialization pattern
 */

import { IMicroApp, IAppContext } from '../shared/types';

export abstract class BaseMicroApp implements IMicroApp {
  abstract name: string;
  abstract version: string;
  enabled: boolean = true;
  protected context: IAppContext | null = null;

  async initialize(context: IAppContext): Promise<void> {
    this.context = context;
    console.log(`[${this.name.toUpperCase()}] Initializing base micro-app`);

    // Register services
    await this.registerServices();

    // Set up event listeners
    await this.setupEventListeners();

    // Additional initialization
    await this.onInitialize();

    console.log(`[${this.name.toUpperCase()}] Base initialization complete`);
  }

  async shutdown(): Promise<void> {
    console.log(`[${this.name.toUpperCase()}] Shutting down`);
    await this.onShutdown();
  }

  /**
   * Override this to register services with the service locator
   */
  protected async registerServices(): Promise<void> {
    // Empty by default - override in subclasses
  }

  /**
   * Override this to set up event listeners
   */
  protected async setupEventListeners(): Promise<void> {
    // Empty by default - override in subclasses
  }

  /**
   * Override this for custom initialization logic
   */
  protected async onInitialize(): Promise<void> {
    // Empty by default - override in subclasses
  }

  /**
   * Override this for custom shutdown logic
   */
  protected async onShutdown(): Promise<void> {
    // Empty by default - override in subclasses
  }

  /**
   * Get routes - must be overridden
   */
  abstract getRoutes(): any[];

  /**
   * Get providers - must be overridden
   */
  abstract getProviders(): any[];

  /**
   * Helper method to emit events
   */
  protected emit(event: string, data: any): void {
    if (this.context) {
      this.context.eventBus.emit(event, data);
    }
  }

  /**
   * Helper method to listen to events
   */
  protected on(event: string, handler: (data: any) => void): void {
    if (this.context) {
      this.context.eventBus.on(event, handler);
    }
  }

  /**
   * Helper method to register service
   */
  protected registerService(name: string, service: any): void {
    if (this.context) {
      this.context.serviceLocator.register(name, service);
    }
  }

  /**
   * Helper method to resolve service
   */
  protected resolveService(name: string): any {
    if (!this.context) {
      throw new Error(`Context not initialized for ${this.name}`);
    }
    return this.context.serviceLocator.resolve(name);
  }

  /**
   * Helper method to resolve service optionally
   */
  protected resolveServiceOptional(name: string): any | null {
    if (!this.context) {
      return null;
    }
    return this.context.serviceLocator.resolveOptional(name);
  }
}
