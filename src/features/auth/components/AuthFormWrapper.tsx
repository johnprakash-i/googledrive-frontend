import React from 'react'
import { Cloud } from 'lucide-react'
import { cn } from '@/utils/helpers'

interface AuthFormWrapperProps {
  title: string
  subtitle?: string
  children: React.ReactNode
  footer?: React.ReactNode
  className?: string
}

const AuthFormWrapper: React.FC<AuthFormWrapperProps> = ({
  title,
  subtitle,
  children,
  footer,
  className,
}) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-primary-100 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      {/* Top Bar with Logo */}
      <div className="fixed top-6 left-6 sm:left-8 lg:left-12">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-primary-500 rounded-2xl ml-2">
            <Cloud className="h-7 w-7 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-gray-900">DriveCloud</h1>
            <p className="text-xs text-gray-600">Secure File Storage</p>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col justify-center">
        <div className="sm:mx-auto sm:w-full sm:max-w-md">
          {/* Centered Title */}
          <div className="text-center">
            <h2 className="text-3xl font-bold tracking-tight text-gray-900">
              {title}
            </h2>
            
            {subtitle && (
              <p className="mt-2 text-sm text-gray-600">
                {subtitle}
              </p>
            )}
          </div>

          {/* Form Container */}
          <div className="mt-8">
            <div className={cn(
              "bg-white py-8 px-4 shadow-hard rounded-3xl sm:px-10",
              className
            )}>
              {children}
            </div>
            
            {footer && (
              <div className="mt-6">
                {footer}
              </div>
            )}
          </div>
        </div>
      </div>
      
      {/* Decorative elements */}
      <div className="absolute top-0 left-0 w-32 h-32 bg-primary-200 rounded-full -translate-x-16 -translate-y-16 opacity-50" />
      <div className="absolute bottom-0 right-0 w-64 h-64 bg-primary-300 rounded-full translate-x-32 translate-y-32 opacity-30" />
      <div className="absolute top-1/2 left-1/4 w-16 h-16 bg-primary-400 rounded-full opacity-20" />
    </div>
  )
}

export default AuthFormWrapper