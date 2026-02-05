import React, { useState, useEffect } from 'react'
import { Link, useParams, useNavigate } from 'react-router-dom'
import { CheckCircle, XCircle, Loader2 } from 'lucide-react'
import { authApi } from '../services/authApi'
import AuthFormWrapper from '../components/AuthFormWrapper'
import Button from '@/components/ui/Button'

const ActivateAccount: React.FC = () => {
  const { token } = useParams<{ token: string }>()
  const navigate = useNavigate()
  
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading')
  const [message, setMessage] = useState('')

  useEffect(() => {
    const activateAccount = async () => {
      if (!token) {
        setStatus('error')
        setMessage('Invalid activation link')
        return
      }

      try {
        const response = await authApi.activateAccount(token)
        
        if (response.data.success) {
          setStatus('success')
          setMessage('Your account has been activated successfully! You can now log in.')
          
          // Redirect to login after 5 seconds
          setTimeout(() => {
            navigate('/login', { replace: true })
          }, 5000)
        } else {
          setStatus('error')
          setMessage(response.data.message || 'Activation failed')
        }
      } catch (error: any) {
        setStatus('error')
        setMessage(
          error.response?.data?.message || 
          'Activation failed. The link may be expired or invalid.'
        )
      }
    }

    activateAccount()
  }, [token, navigate])

  return (
    <AuthFormWrapper
      title="Account Activation"
      subtitle={status === 'loading' ? 'Activating your account...' : ''}
    >
      <div className="text-center py-8">
        {status === 'loading' && (
          <>
            <div className="mx-auto flex items-center justify-center h-20 w-20 rounded-full bg-primary-100 mb-6">
              <Loader2 className="h-10 w-10 text-primary-600 animate-spin" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Activating your account
            </h3>
            <p className="text-gray-600">
              Please wait while we activate your account...
            </p>
          </>
        )}

        {status === 'success' && (
          <>
            <div className="mx-auto flex items-center justify-center h-20 w-20 rounded-full bg-green-100 mb-6">
              <CheckCircle className="h-10 w-10 text-green-600" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Account Activated!
            </h3>
            <p className="text-gray-600 mb-6">
              {message}
            </p>
            <p className="text-sm text-gray-500 mb-6">
              You will be redirected to the login page in a few seconds.
            </p>
            <Link to="/login">
              <Button variant="primary" size="lg">
                Go to login
              </Button>
            </Link>
          </>
        )}

        {status === 'error' && (
          <>
            <div className="mx-auto flex items-center justify-center h-20 w-20 rounded-full bg-red-100 mb-6">
              <XCircle className="h-10 w-10 text-red-600" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Activation Failed
            </h3>
            <p className="text-gray-600 mb-6">
              {message}
            </p>
            <div className="space-y-4">
              <Link to="/login">
                <Button variant="primary" size="lg" fullWidth>
                  Go to login
                </Button>
              </Link>
              <Link to="/register">
                <Button variant="outline" size="lg" fullWidth>
                  Create new account
                </Button>
              </Link>
            </div>
          </>
        )}
      </div>
    </AuthFormWrapper>
  )
}

export default ActivateAccount