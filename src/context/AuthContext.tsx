import {
  createContext,
  useReducer,
  ReactNode,
  useCallback,
  useEffect,
  useContext,
  useRef,
} from 'react'
import { User, AuthState } from '@/types/auth.types'
import { authApi } from '@/features/auth/services/authApi'
import { toast } from 'react-hot-toast'

type AuthAction =
  | { type: 'SET_USER'; payload: User | null }
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'LOGOUT' }

const initialState: AuthState = {
  user: null,
  isAuthenticated: false,
  isLoading: true,
}

const authReducer = (state: AuthState, action: AuthAction): AuthState => {
  switch (action.type) {
    case 'SET_USER':
      return {
        ...state,
        user: action.payload,
        isAuthenticated: !!action.payload,
        isLoading: false,
      }
    case 'SET_LOADING':
      return { ...state, isLoading: action.payload }
    case 'LOGOUT':
      return { user: null, isAuthenticated: false, isLoading: false }
    default:
      return state
  }
}

interface AuthContextType extends AuthState {
  login: (credentials: { email: string; password: string }) => Promise<void>
  register: (userData: {
    firstName: string
    lastName: string
    email: string
    password: string
  }) => Promise<void>
  logout: () => Promise<void>
  checkAuth: () => Promise<void>
  forgotPassword: (email: string) => Promise<void>
  resetPassword: (token: string, password: string) => Promise<void>
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) throw new Error('useAuth must be used within AuthProvider')
  return context
}

// Helper to check if cookies exist
const hasCookies = (): boolean => {
  return document.cookie.length > 0
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(authReducer, initialState)
  
  // Use ref to prevent multiple concurrent calls within the same component instance
  // This handles React StrictMode double mounting
  const isCheckingAuth = useRef(false)
  const hasCheckedAuth = useRef(false)

  const checkAuth = useCallback(async () => {
    // Prevent concurrent calls
    if (isCheckingAuth.current) {
      return
    }
    
    // Prevent multiple checks in the same component instance
    if (hasCheckedAuth.current) {
      return
    }
    
    isCheckingAuth.current = true
    hasCheckedAuth.current = true
    
    try {
      const response = await authApi.getCurrentUser()
      if (response.data.success) {
        dispatch({ type: 'SET_USER', payload: response.data.data.user })
      } else {
        dispatch({ type: 'SET_USER', payload: null })
      }
    } catch (error: any) {
      // Silently handle auth errors - user is just not authenticated
      dispatch({ type: 'SET_USER', payload: null })
    } finally {
      isCheckingAuth.current = false
    }
  }, [])

  const login = useCallback(async (credentials: { email: string; password: string }) => {
    dispatch({ type: 'SET_LOADING', payload: true })
    try {
      const response = await authApi.login(credentials)
      if (response.data.success) {
        dispatch({ type: 'SET_USER', payload: response.data.data.user })
        toast.success('Welcome back!')
      }
    } catch (error: any) {
      dispatch({ type: 'SET_LOADING', payload: false })
      // Error toast is handled by axios interceptor
      throw error
    }
  }, [])

  const register = useCallback(async (userData: any) => {
    dispatch({ type: 'SET_LOADING', payload: true })
    try {
      const response = await authApi.register(userData)
      if (response.data.success) {
        toast.success('Registration successful! Check your email.')
      }
    } catch (error: any) {
      // Error toast is handled by axios interceptor
      throw error
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false })
    }
  }, [])

  const logout = useCallback(async () => {
    try {
      await authApi.logout()
      toast.success('Logged out')
    } catch (error) {
      console.error('Logout error:', error)
    } finally {
      dispatch({ type: 'LOGOUT' })
      window.location.href = '/login'
    }
  }, [])

  const forgotPassword = useCallback(async (email: string) => {
    try {
      const response = await authApi.forgotPassword({ email })
      if (response.data.success) {
        toast.success('Reset link sent')
      }
    } catch (error: any) {
      // Error toast is handled by axios interceptor
      throw error
    }
  }, [])

  const resetPassword = useCallback(async (token: string, password: string) => {
    try {
      const response = await authApi.resetPassword(token, { password })
      if (response.data.success) {
        toast.success('Password reset successful')
      }
    } catch (error: any) {
      // Error toast is handled by axios interceptor
      throw error
    }
  }, [])

  // Check auth on mount
  useEffect(() => {
    // Only check auth if cookies might exist
    if (hasCookies()) {
      checkAuth()
    } else {
      // No cookies, set loading to false immediately
      dispatch({ type: 'SET_LOADING', payload: false })
    }
  }, [checkAuth])

  return (
    <AuthContext.Provider
      value={{
        ...state,
        login,
        register,
        logout,
        checkAuth,
        forgotPassword,
        resetPassword,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}