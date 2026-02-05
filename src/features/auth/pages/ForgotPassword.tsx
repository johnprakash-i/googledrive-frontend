import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowLeft, Mail } from 'lucide-react'
import { useAuth } from '@/hooks/useAuth'
import AuthFormWrapper from '../components/AuthFormWrapper'
import Input from '@/components/ui/Input'
import Button from '@/components/ui/Button'
import { validateEmail } from '@/utils/helpers'

const ForgotPassword: React.FC = () => {
  const { forgotPassword, isLoading } = useAuth()
  const [email, setEmail] = useState('')
  const [error, setError] = useState('')
  const [isSubmitted, setIsSubmitted] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    if (!email) {
      setError('Email is required')
      return
    }

    if (!validateEmail(email)) {
      setError('Please enter a valid email address')
      return
    }

    try {
      await forgotPassword(email)
      setIsSubmitted(true)
    } catch (error) {
      // Error is already handled by the auth context
    }
  }

  if (isSubmitted) {
    return (
      <AuthFormWrapper
        title="Check your email"
        subtitle="We've sent a password reset link to your email address"
        footer={
          <div className="text-center space-y-4">
            <Link
              to="/login"
              className="inline-flex items-center text-sm font-medium text-primary-600 hover:text-primary-500"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to login
            </Link>
          </div>
        }
      >
        <div className="text-center py-8">
          <div className="mx-auto flex items-center justify-center h-20 w-20 rounded-full bg-primary-100 mb-6">
            <Mail className="h-10 w-10 text-primary-600" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            Reset link sent
          </h3>
          <p className="text-gray-600 mb-6">
            Please check your inbox at <span className="font-medium">{email}</span> and
            click the link to reset your password.
          </p>
          <p className="text-sm text-gray-500">
            Didn't receive the email? Check your spam folder or{' '}
            <button
              onClick={() => setIsSubmitted(false)}
              className="text-primary-600 hover:text-primary-500 font-medium"
            >
              try again
            </button>
          </p>
        </div>
      </AuthFormWrapper>
    )
  }

  return (
    <AuthFormWrapper
      title="Forgot password"
      subtitle="Enter your email to receive a reset link"
      footer={
        <Link
          to="/login"
          className="inline-flex items-center text-sm font-medium text-primary-600 hover:text-primary-500"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to login
        </Link>
      }
    >
      <form className="space-y-6" onSubmit={handleSubmit}>
        <div className="text-center">
          <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-primary-100 mb-4">
            <Mail className="h-8 w-8 text-primary-600" />
          </div>
          <p className="text-gray-600 mb-6">
            Enter the email address associated with your account and we'll send you a
            link to reset your password.
          </p>
        </div>

        <Input
          label="Email address"
          name="email"
          type="email"
          autoComplete="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          error={error}
          leftIcon={<Mail size={18} />}
          placeholder="you@example.com"
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
          Send reset link
        </Button>
      </form>
    </AuthFormWrapper>
  )
}

export default ForgotPassword