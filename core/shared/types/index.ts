/**
 * Shared Type Definitions
 * Used across all micro-apps
 */

export interface IMicroApp {
  name: string;
  version: string;
  enabled: boolean;
  initialize: (context: IAppContext) => Promise<void>;
  shutdown?: () => Promise<void>;
  getRoutes: () => any[];
  getProviders: () => any[];
}

export interface IAppContext {
  mongo: any; // MongoDB connection
  eventBus: IEventBus;
  serviceLocator: IServiceLocator;
  config: IConfig;
}

export interface IEventBus {
  emit(event: string, data: any): void;
  on(event: string, handler: (data: any) => void): void;
  off(event: string, handler: (data: any) => void): void;
}

export interface IServiceLocator {
  register(name: string, service: any): void;
  resolve(name: string): any;
  resolveOptional(name: string): any | null;
  clearAll(): void;
}

export interface IConfig {
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

export interface IVerificationCode {
  code: string;
  expiresAt: Date;
}

export interface IUser {
  _id?: string;
  email: string;
  password: string;
  name: string;
  phone?: string;
  role: 'buyer' | 'vendor' | 'admin';
  isVerified: boolean;
  verificationCode?: string;
  verificationCodeExpiry?: Date;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface IAuthToken {
  access_token: string;
  token_type: string;
  expires_in: number;
  user?: Partial<IUser>;
}

// Event names for inter-app communication
export enum AppEvents {
  USER_CREATED = 'user:created',
  USER_VERIFIED = 'user:verified',
  USER_UPDATED = 'user:updated',
  USER_DELETED = 'user:deleted',
  AUTH_SUCCESS = 'auth:success',
  AUTH_FAILURE = 'auth:failure',
  MICRO_APP_INITIALIZED = 'microapp:initialized',
  MICRO_APP_FAILED = 'microapp:failed',
}
