import React from 'react'
import { AlertTriangle, CheckCircle, Info, Edit, Share2 } from 'lucide-react'
import Modal from './Modal'
import Button from './Button'
import { cn } from '@/utils/helpers'

export type ConfirmationType = 'delete' | 'rename' | 'share' | 'info' | 'success' | 'warning'

interface ConfirmationModalProps {
  isOpen: boolean
  onClose: () => void
  onConfirm: () => void
  title: string
  message: string
  type?: ConfirmationType
  confirmText?: string
  cancelText?: string
  inputLabel?: string
  inputValue?: string
  onInputChange?: (value: string) => void
  placeholder?: string
  isLoading?: boolean
}

const ConfirmationModal: React.FC<ConfirmationModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  type = 'info',
  confirmText,
  cancelText = 'Cancel',
  inputLabel,
  inputValue,
  onInputChange,
  placeholder,
  isLoading = false,
}) => {
  const [input, setInput] = React.useState(inputValue || '')
  const [error, setError] = React.useState('')

  React.useEffect(() => {
    if (isOpen && inputValue !== undefined) {
      setInput(inputValue)
    }
  }, [isOpen, inputValue])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setInput(value)
    setError('')
    if (onInputChange) {
      onInputChange(value)
    }
  }

  const handleConfirm = () => {
   
    if (type === 'rename' && input.trim() === '') {
      setError('Please enter a name')
      return
    }
    if (type === 'rename' && input.trim() === inputValue) {
      onConfirm()
      onClose()
      return
    }
   
  }

  const handleClose = () => {
    setInput('')
    setError('')
    onClose()
  }

  const getIcon = () => {
    const iconClass = 'h-12 w-12'
    
    switch (type) {
      case 'delete':
        return <AlertTriangle className={cn(iconClass, 'text-red-500')} />
      case 'warning':
        return <AlertTriangle className={cn(iconClass, 'text-yellow-500')} />
      case 'success':
        return <CheckCircle className={cn(iconClass, 'text-green-500')} />
      case 'rename':
        return <Edit className={cn(iconClass, 'text-primary-500')} />
      case 'share':
        return <Share2 className={cn(iconClass, 'text-primary-500')} />
      default:
        return <Info className={cn(iconClass, 'text-blue-500')} />
    }
  }

  const getConfirmButtonVariant = () => {
    switch (type) {
      case 'delete':
        return 'danger'
      case 'warning':
        return 'primary'
      default:
        return 'primary'
    }
  }

  const getDefaultConfirmText = () => {
    switch (type) {
      case 'delete':
        return 'Delete'
      case 'rename':
        return 'Rename'
      case 'share':
        return 'Share'
      case 'success':
        return 'OK'
      default:
        return 'Confirm'
    }
  }

  const getContainerStyles = () => {
    switch (type) {
      case 'delete':
        return 'border-red-200'
      case 'warning':
        return 'border-yellow-200'
      case 'success':
        return 'border-green-200'
      default:
        return 'border-gray-200'
    }
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title=""
      size="sm"
      showCloseButton={false}
    >
      <div className={cn('p-6', getContainerStyles())}>
        {/* Icon */}
        <div className="flex justify-center mb-4">
          <div className={cn(
            'p-4 rounded-2xl',
            type === 'delete' ? 'bg-red-100' :
            type === 'warning' ? 'bg-yellow-100' :
            type === 'success' ? 'bg-green-100' :
            'bg-primary-100'
          )}>
            {getIcon()}
          </div>
        </div>

        {/* Title */}
        <h3 className="text-xl font-semibold text-center text-gray-900 mb-2">
          {title}
        </h3>

        {/* Message */}
        <p className="text-gray-600 text-center mb-6">
          {message}
        </p>

        {/* Input field (for rename) */}
        {type === 'rename' && inputLabel && (
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {inputLabel}
            </label>
            <input
              type="text"
              value={input}
              onChange={handleInputChange}
              placeholder={placeholder}
              className={cn(
                'w-full px-4 py-3 rounded-xl border focus:outline-none focus:ring-2 transition-all duration-200',
                error
                  ? 'border-red-300 focus:border-red-500 focus:ring-red-500/20'
                  : 'border-gray-300 focus:border-primary-500 focus:ring-primary-500/20'
              )}
              autoFocus
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !isLoading) {
                  handleConfirm()
                }
              }}
            />
            {error && (
              <p className="mt-2 text-sm text-red-600">{error}</p>
            )}
          </div>
        )}

        {/* Action buttons */}
        <div className="flex flex-col sm:flex-row gap-3">
          <Button
            variant="outline"
            onClick={handleClose}
            disabled={isLoading}
            fullWidth
            className={cn(
              type === 'delete' && 'hover:border-red-200 hover:bg-red-50',
              type === 'warning' && 'hover:border-yellow-200 hover:bg-yellow-50'
            )}
          >
            {cancelText}
          </Button>
          <Button
            variant={getConfirmButtonVariant()}
            onClick={handleConfirm}
            loading={isLoading}
            disabled={isLoading}
            fullWidth
            className={cn(
              type === 'delete' && 'bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700',
              type === 'warning' && 'bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-600 hover:to-yellow-700',
              (type === 'rename' || type === 'share') && 'bg-gradient-to-r from-primary-500 to-primary-600 hover:from-primary-600 hover:to-primary-700'
            )}
          >
            {confirmText || getDefaultConfirmText()}
          </Button>
        </div>

        {/* Additional info for delete */}
        {type === 'delete' && (
          <div className="mt-6 p-4 bg-gray-50 rounded-xl border border-gray-200">
            <div className="flex items-start space-x-3">
              <Info className="h-5 w-5 text-gray-500 mt-0.5" />
              <div>
                <p className="text-sm text-gray-700">
                  This action cannot be undone. All files and subfolders will be permanently deleted.
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </Modal>
  )
}

export default ConfirmationModal