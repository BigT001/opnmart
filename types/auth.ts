export interface BuyerSignUpData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  password: string;
  confirmPassword: string;
}

export interface BuyerLoginData {
  email: string;
  password: string;
}

export interface Buyer {
  _id?: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  addresses?: Address[];
  wishlists?: string[];
  orders?: string[];
  createdAt?: Date;
  updatedAt?: Date;
}

export interface Address {
  id: number;
  type: string;
  address: string;
  phone: string;
  default: boolean;
}

export interface AuthResponse {
  success: boolean;
  message: string;
  buyer?: Buyer;
  error?: string;
}

export interface ValidationError {
  field: string;
  message: string;
}
