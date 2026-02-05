import React, { useState } from 'react'
import { Link, useParams, useNavigate } from 'react-router-dom'
import { Lock, Eye, EyeOff, CheckCircle } from 'lucide-react'
import { useAuth } from '@/hooks/useAuth'
import AuthFormWrapper from '../components/AuthFormWrapper'
import Input from '@/components/ui/Input'
import Button from '@/components/ui/Button'
import { validatePassword } from '@/utils/helpers'

const ResetPassword: React.FC = () => {
  const { token } = useParams<{ token: string }>()
  const navigate = useNavigate()
  const { resetPassword, isLoading } = useAuth()
  
  const [formData, setFormData] = useState({
    password: '',
    confirmPassword: '',
  })
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [passwordStrength, setPasswordStrength] = useState<{
    isValid: boolean
    errors: string[]
  }>({ isValid: false, errors: [] })
  const [isSuccess, setIsSuccess] = useState(false)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }))
    }
    
    // Validate password in real-time
    if (name === 'password') {
      const validation = validatePassword(value)
      setPasswordStrength(validation)
    }
  }

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!formData.password) {
      newErrors.password = 'Password is required'
    } else if (!passwordStrength.isValid) {
      newErrors.password = 'Password does not meet requirements'
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password'
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateForm() || !token) return

    try {
      await resetPassword(token,  formData.password )
      setIsSuccess(true)
      
      // Redirect to login after 3 seconds
      setTimeout(() => {
        navigate('/login', { replace: true })
      }, 3000)
    } catch (error) {
      // Error is already handled by the auth context
    }
  }

  if (isSuccess) {
    return (
      <AuthFormWrapper
        title="Password reset successful"
        subtitle="Your password has been updated successfully"
      >
        <div className="text-center py-8">
          <div className="mx-auto flex items-center justify-center h-20 w-20 rounded-full bg-green-100 mb-6">
            <CheckCircle className="h-10 w-10 text-green-600" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            All set!
          </h3>
          <p className="text-gray-600 mb-6">
            Your password has been reset successfully. You will be redirected to the
            login page in a few seconds.
          </p>
          <Link
            to="/login"
            className="inline-flex items-center justify-center rounded-2xl bg-primary-500 px-4 py-2.5 text-sm font-medium text-white hover:bg-primary-600"
          >
            Go to login
          </Link>
        </div>
      </AuthFormWrapper>
    )
  }

  return (
    <AuthFormWrapper
      title="Reset password"
      subtitle="Create a new password for your account"
    >
      <form className="space-y-6" onSubmit={handleSubmit}>
        <div className="text-center mb-6">
          <p className="text-gray-600">
            Please enter your new password below.
          </p>
        </div>

        <Input
          label="New password"
          name="password"
          type={showPassword ? 'text' : 'password'}
          autoComplete="new-password"
          required
          value={formData.password}
          onChange={handleChange}
          error={errors.password}
          leftIcon={<Lock size={18} />}
          rightIcon={
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="text-gray-400 hover:text-gray-600"
              tabIndex={-1}
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          }
          placeholder="Create a strong password"
          disabled={isLoading}
        />

        {formData.password && (
          <div className="space-y-2">
            <div className="text-sm text-gray-600">Password requirements:</div>
            <ul className="space-y-1 text-sm">
              {[
                { text: 'At least 8 characters', check: formData.password.length >= 8 },
                { text: 'One uppercase letter', check: /[A-Z]/.test(formData.password) },
                { text: 'One lowercase letter', check: /[a-z]/.test(formData.password) },
                { text: 'One number', check: /\d/.test(formData.password) },
                { text: 'One special character', check: /[!@#$%^&*(),.?":{}|<>]/.test(formData.password) },
              ].map((req, index) => (
                <li
                  key={index}
                  className={`flex items-center space-x-2 ${req.check ? 'text-green-600' : 'text-gray-400'}`}
                >
                  <span className={`inline-block w-4 h-4 rounded-full ${req.check ? 'bg-green-500' : 'bg-gray-300'}`} />
                  <span>{req.text}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        <Input
          label="Confirm new password"
          name="confirmPassword"
          type={showConfirmPassword ? 'text' : 'password'}
          autoComplete="new-password"
          required
          value={formData.confirmPassword}
          onChange={handleChange}
          error={errors.confirmPassword}
          leftIcon={<Lock size={18} />}
          rightIcon={
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="text-gray-400 hover:text-gray-600"
              tabIndex={-1}
            >
              {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          }
          placeholder="Confirm your password"
          disabled={isLoading}
        />

        <Button
          type="submit"
          variant="primary"
          size="lg"
          fullWidth
          loading={isLoading}
          disabled={isLoading}
        >
          Reset password
        </Button>
      </form>
    </AuthFormWrapper>
  )
}

export default ResetPassword