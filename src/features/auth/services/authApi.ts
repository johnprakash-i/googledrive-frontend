import { axiosInstance } from '@/utils/axiosInstance'
import { API_ENDPOINTS } from '@/utils/constants'
import {
  LoginCredentials,
  RegisterCredentials,
  ForgotPasswordData,
  ResetPasswordData,
  AuthResponse,
} from '@/types/auth.types'

export const authApi = {
  // Register new user
  register: async (data: RegisterCredentials) => {
    return axiosInstance.post<AuthResponse>(API_ENDPOINTS.AUTH.REGISTER, data)
  },

  // User login
  login: async (data: LoginCredentials) => {
    return axiosInstance.post<AuthResponse>(API_ENDPOINTS.AUTH.LOGIN, data)
  },

  // Get current user
  getCurrentUser: async () => {
    return axiosInstance.get<AuthResponse>(API_ENDPOINTS.USERS.ME)
  },

  // Update user profile
  updateProfile: async (data: { firstName: string; lastName: string }) => {
    return axiosInstance.put<AuthResponse>(API_ENDPOINTS.USERS.UPDATE_PROFILE, data)
  },

  // Forgot password
  forgotPassword: async (data: ForgotPasswordData) => {
    return axiosInstance.post<AuthResponse>(API_ENDPOINTS.AUTH.FORGOT_PASSWORD, data)
  },

  // Reset password
  resetPassword: async (token: string, data: ResetPasswordData) => {
    return axiosInstance.post<AuthResponse>(
      `${API_ENDPOINTS.AUTH.RESET_PASSWORD}/${token}`,
      data
    )
  },

  // Refresh token
  refreshToken: async (refreshToken: string) => {
    return axiosInstance.post<AuthResponse>(API_ENDPOINTS.AUTH.REFRESH, { refreshToken })
  },

  // Logout
  logout: async () => {
    return axiosInstance.post('/auth/logout')
  },

  // Activate account
  activateAccount: async (token: string) => {
    return axiosInstance.post<AuthResponse>(`/auth/activate/${token}`)
  },
}