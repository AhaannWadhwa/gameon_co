// Auth-related TypeScript types and interfaces

import { UserRole } from "@prisma/client";

// ========== API RESPONSE TYPES ==========

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

export interface AuthResponse {
  message: string;
  user?: UserData;
}

export interface UserData {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  image?: string | null;
  onboardingCompleted: boolean;
}

// ========== SESSION TYPES ==========

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      name: string;
      email: string;
      role: UserRole;
      image?: string | null;
      onboardingCompleted: boolean;
    };
  }

  interface User {
    id: string;
    name: string;
    email: string;
    role: UserRole;
    image?: string | null;
    onboardingCompleted: boolean;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string;
    role: UserRole;
    onboardingCompleted: boolean;
  }
}

// ========== PASSWORD RESET TYPES ==========

export interface PasswordResetToken {
  token: string;
  userId: string;
  expiresAt: Date;
}
