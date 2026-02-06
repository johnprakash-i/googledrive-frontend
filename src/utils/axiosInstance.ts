import axios, { AxiosError, InternalAxiosRequestConfig } from 'axios'
import { toast } from 'react-hot-toast'
import { getErrorMessage } from './getErrorMessage'

const API_BASE_URL = import.meta.env.VITE_API_URL

export const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true, // Important for cookies
  headers: {
    'Content-Type': 'application/json',
  },
})

// Track if we're refreshing token to prevent multiple calls
let isRefreshing = false
let failedQueue: Array<{
  resolve: (value?: unknown) => void
  reject: (reason?: any) => void
}> = []

const processQueue = (error: Error | null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error)
    } else {
      prom.resolve()
    }
  })
  failedQueue = []
}

// Request interceptor
axiosInstance.interceptors.request.use(
  (config) => {
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// Response interceptor
axiosInstance.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & {
      _retry?: boolean
      _skipAuthRedirect?: boolean
    }

    // Don't show toast or redirect for auth check endpoint (GET /users/me)
    const isAuthCheckEndpoint = originalRequest.url?.includes('/users/me') && originalRequest.method === 'get'
    
    // Don't show toast or redirect for login/register endpoints
    const isAuthEndpoint = 
      originalRequest.url?.includes('/auth/login') ||
      originalRequest.url?.includes('/auth/register') ||
      originalRequest.url?.includes('/auth/refresh')

    if (error.response?.status === 401) {
      // If it's the auth check endpoint, just reject silently
      if (isAuthCheckEndpoint) {
        return Promise.reject(error)
      }

      // If it's an auth endpoint (login/register), show error and reject
      if (isAuthEndpoint) {
      
         toast.error(getErrorMessage(error, 'Authentication failed'))
        return Promise.reject(error)
      }

      // For other 401s, try to refresh token
      if (!originalRequest._retry) {
        if (isRefreshing) {
          // Queue this request
          return new Promise((resolve, reject) => {
            failedQueue.push({ resolve, reject })
          })
            .then(() => axiosInstance(originalRequest))
            .catch((err) => Promise.reject(err))
        }

        originalRequest._retry = true
        isRefreshing = true

        try {
          // Try to refresh the token
          await axiosInstance.post('/auth/refresh')
          processQueue(null)
          return axiosInstance(originalRequest)
        } catch (refreshError) {
          // Refresh failed - only NOW redirect to login
          processQueue(refreshError as Error)
          
          // Only redirect if not already on login page
          if (!window.location.pathname.includes('/login')) {
            toast.error('Session expired. Please login again.')
            // Small delay to ensure toast shows
            setTimeout(() => {
              window.location.href = '/login'
            }, 500)
          }
          
          return Promise.reject(refreshError)
        } finally {
          isRefreshing = false
        }
      }

      // If retry already happened and still 401, redirect
      if (!window.location.pathname.includes('/login')) {
        toast.error('Session expired. Please login again.')
        setTimeout(() => {
          window.location.href = '/login'
        }, 500)
      }
      
      return Promise.reject(error)
    }

    // Handle other errors
    if (error.response?.status && error.response.status >= 500) {
      toast.error('Server error. Please try again later.')
    } else if (error.response?.status === 403) {
      toast.error('You do not have permission to perform this action.')
    } else if (error.response?.status === 404) {
      toast.error('Resource not found.')
    } else if (!isAuthCheckEndpoint && !isAuthEndpoint) {
     
       toast.error(getErrorMessage(error, 'Login failed'))
      
    }

    return Promise.reject(error)
  }
)

export default axiosInstance