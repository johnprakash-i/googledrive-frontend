export interface User {
  id: string
  email: string
  firstName: string
  lastName: string
  avatar?: string
  isActive: boolean
  createdAt: string
}

export interface AuthResponse {
  success: boolean
  message: string
  data: {
    user: User
  }
}

export interface LoginCredentials {
  email: string
  password: string
}

export interface RegisterCredentials extends LoginCredentials {
  firstName: string
  lastName: string
}

export interface ForgotPasswordData {
  email: string
}

export interface ResetPasswordData {
  password: string
}

export interface AuthState {
  user: User | null
  isAuthenticated: boolean
  isLoading: boolean
}