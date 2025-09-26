export interface User {
  id: string;
  email: string;
  created_at: string;
}

export interface AuthError {
  message: string;
}

export type AuthMode = 'signin' | 'signup' | 'forgot-password';