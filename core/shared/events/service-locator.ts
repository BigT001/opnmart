/**
 * Service Locator Implementation
 * Provides centralized service registration and resolution
 * Allows micro-apps to discover and use services from other micro-apps
 */

import { IServiceLocator } from '../types';

export class ServiceLocator implements IServiceLocator {
  private services: Map<string, any> = new Map();

  register(name: string, service: any): void {
    if (this.services.has(name)) {
      console.warn(`[SERVICE LOCATOR] Service '${name}' already registered, overwriting`);
    }
    this.services.set(name, service);
    console.log(`[SERVICE LOCATOR] Registered service: ${name}`);
  }

  resolve(name: string): any {
    const service = this.services.get(name);
    if (!service) {
      throw new Error(`[SERVICE LOCATOR] Service not found: ${name}`);
    }
    return service;
  }

  resolveOptional(name: string): any | null {
    return this.services.get(name) || null;
  }

  getAll(): Record<string, any> {
    const result: Record<string, any> = {};
    this.services.forEach((service, name) => {
      result[name] = service;
    });
    return result;
  }

  unregister(name: string): void {
    if (this.services.delete(name)) {
      console.log(`[SERVICE LOCATOR] Unregistered service: ${name}`);
    }
  }

  clearAll(): void {
    this.services.clear();
    console.log(`[SERVICE LOCATOR] Cleared all services`);
  }
}
