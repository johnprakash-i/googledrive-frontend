import React, { useState, useEffect } from 'react'
import { WifiOff, Wifi, X } from 'lucide-react'
import { useNetworkStatus } from '@/hooks/useNetworkStatus'
import { cn } from '@/utils/helpers'

const OfflineIndicator: React.FC = () => {
  const { isOnline, wasOffline } = useNetworkStatus()
  const [isVisible, setIsVisible] = useState(false)
  const [showReconnection, setShowReconnection] = useState(false)

  useEffect(() => {
    if (!isOnline) {
      setIsVisible(true)
      setShowReconnection(true)
    } else if (wasOffline) {
      setIsVisible(true)
      const timer = setTimeout(() => {
        setIsVisible(false)
        setShowReconnection(false)
      }, 3000)
      return () => clearTimeout(timer)
    }
  }, [isOnline, wasOffline])

  if (!isVisible) return null

  return (
    <div
      className={cn(
        'fixed bottom-4 right-4 z-50 max-w-sm w-full sm:w-auto',
        'transform transition-all duration-300',
        isVisible ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'
      )}
    >
      <div className={cn(
        'rounded-2xl p-4 shadow-hard border',
        isOnline
          ? 'bg-green-50 border-green-200'
          : 'bg-yellow-50 border-yellow-200'
      )}>
        <div className="flex items-start justify-between">
          <div className="flex items-start space-x-3">
            <div className={cn(
              'p-2 rounded-lg',
              isOnline ? 'bg-green-100' : 'bg-yellow-100'
            )}>
              {isOnline ? (
                <Wifi className="h-5 w-5 text-green-600" />
              ) : (
                <WifiOff className="h-5 w-5 text-yellow-600" />
              )}
            </div>
            <div className="flex-1">
              <h3 className={cn(
                'font-medium',
                isOnline ? 'text-green-900' : 'text-yellow-900'
              )}>
                {isOnline ? 'Back Online' : 'You\'re Offline'}
              </h3>
              <p className={cn(
                'text-sm mt-1',
                isOnline ? 'text-green-700' : 'text-yellow-700'
              )}>
                {isOnline 
                  ? 'Your connection has been restored.'
                  : 'Some features may be unavailable.'
                }
              </p>
              {!isOnline && showReconnection && (
                <div className="mt-2">
                  <div className="flex items-center space-x-2 text-sm">
                    <div className="h-1.5 w-1.5 bg-yellow-600 rounded-full animate-pulse" />
                    <span className="text-yellow-700">Attempting to reconnect...</span>
                  </div>
                </div>
              )}
            </div>
          </div>
          <button
            onClick={() => setIsVisible(false)}
            className={cn(
              'p-1 rounded-lg hover:bg-opacity-20',
              isOnline ? 'hover:bg-green-200' : 'hover:bg-yellow-200'
            )}
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  )
}

export default OfflineIndicator