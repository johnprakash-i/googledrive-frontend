import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Mail, Lock, User, Eye, EyeOff } from 'lucide-react'
import { useAuth } from '@/hooks/useAuth'
import AuthFormWrapper from '../components/AuthFormWrapper'
import Input from '@/components/ui/Input'
import Button from '@/components/ui/Button'
import { validateEmail, validatePassword } from '@/utils/helpers'
import toast from 'react-hot-toast'; 
const Register: React.FC = () => {
  const navigate = useNavigate()
  const { register, isLoading } = useAuth()
  
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
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

    if (!formData.firstName.trim()) {
      newErrors.firstName = 'First name is required'
    }

    if (!formData.lastName.trim()) {
      newErrors.lastName = 'Last name is required'
    }

    if (!formData.email) {
      newErrors.email = 'Email is required'
    } else if (!validateEmail(formData.email)) {
      newErrors.email = 'Please enter a valid email address'
    }

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
    
    if (!validateForm()) return

    try {
      await register({
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        password: formData.password,
      })
      navigate('/login', { replace: true })
    } catch (error:any) {
      toast.error(error.response?.data?.message || 'Registration failed. Please try again.')
    }
  }

  const togglePasswordVisibility = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault()
    e.stopPropagation()
    setShowPassword(!showPassword)
  }

  const toggleConfirmPasswordVisibility = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault()
    e.stopPropagation()
    setShowConfirmPassword(!showConfirmPassword)
  }

  return (
    <AuthFormWrapper
      title="Create your account"
      subtitle="Start your secure file storage journey"
      footer={
        <p className="text-center text-sm text-gray-600">
          Already have an account?{' '}
          <Link
            to="/login"
            className="font-medium text-primary-600 hover:text-primary-500"
          >
            Sign in
          </Link>
        </p>
      }
    >
      <form className="space-y-6" onSubmit={handleSubmit}>
        <div className="grid grid-cols-2 gap-4">
          <Input
            label="First name"
            name="firstName"
            type="text"
            autoComplete="given-name"
            required
            value={formData.firstName}
            onChange={handleChange}
            error={errors.firstName}
            leftIcon={<User size={18} />}
            placeholder="First name"
            disabled={isLoading}
          />

          <Input
            label="Last name"
            name="lastName"
            type="text"
            autoComplete="family-name"
            required
            value={formData.lastName}
            onChange={handleChange}
            error={errors.lastName}
            placeholder="Last name"
            disabled={isLoading}
          />
        </div>

        <Input
          label="Email address"
          name="email"
          type="email"
          autoComplete="email"
          required
          value={formData.email}
          onChange={handleChange}
          error={errors.email}
          leftIcon={<Mail size={18} />}
          placeholder="Email address"
          disabled={isLoading}
        />

        <Input
          label="Password"
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
              onClick={togglePasswordVisibility}
              onMouseDown={(e) => e.preventDefault()}
              className="text-gray-400 hover:text-gray-600 focus:outline-none"
              aria-label={showPassword ? 'Hide password' : 'Show password'}
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
          label="Confirm password"
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
              onClick={toggleConfirmPasswordVisibility}
              onMouseDown={(e) => e.preventDefault()}
              className="text-gray-400 hover:text-gray-600 focus:outline-none"
              aria-label={showConfirmPassword ? 'Hide password' : 'Show password'}
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
          Create account
        </Button>
      </form>
    </AuthFormWrapper>
  )
}

export default Register