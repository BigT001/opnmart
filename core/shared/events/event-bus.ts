/**
 * Event Bus Implementation
 * Allows micro-apps to communicate without tight coupling
 */

import { IEventBus } from '../types';

export class EventBus implements IEventBus {
  private handlers: Map<string, Set<Function>> = new Map();

  emit(event: string, data: any): void {
    console.log(`[EVENT BUS] Emitting: ${event}`, data);
    const eventHandlers = this.handlers.get(event);
    if (eventHandlers) {
      eventHandlers.forEach(handler => {
        try {
          handler(data);
        } catch (error) {
          console.error(`[EVENT BUS] Error in handler for ${event}:`, error);
        }
      });
    }
  }

  on(event: string, handler: Function): void {
    if (!this.handlers.has(event)) {
      this.handlers.set(event, new Set());
    }
    this.handlers.get(event)!.add(handler);
    console.log(`[EVENT BUS] Registered handler for: ${event}`);
  }

  off(event: string, handler: Function): void {
    const eventHandlers = this.handlers.get(event);
    if (eventHandlers) {
      eventHandlers.delete(handler);
      console.log(`[EVENT BUS] Unregistered handler for: ${event}`);
    }
  }

  clearAll(): void {
    this.handlers.clear();
    console.log(`[EVENT BUS] Cleared all handlers`);
  }
}
