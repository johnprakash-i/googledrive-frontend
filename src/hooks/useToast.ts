import { useCallback } from 'react'
import { toast } from 'react-hot-toast'

export function useToast() {
  const showSuccess = useCallback((message: string) => {
    toast.success(message, {
      duration: 4000,
      style: {
        background: 'var(--color-surface)',
        color: 'var(--color-foreground)',
        borderRadius: 'var(--radius-2xl)',
        border: '1px solid var(--color-border)',
        boxShadow: 'var(--shadow-medium)',
      },
    })
  }, [])

  const showError = useCallback((message: string) => {
    toast.error(message, {
      duration: 5000,
      style: {
        background: 'var(--color-surface)',
        color: 'var(--color-foreground)',
        borderRadius: 'var(--radius-2xl)',
        border: '1px solid var(--color-border)',
        boxShadow: 'var(--shadow-medium)',
      },
    })
  }, [])

  const showLoading = useCallback((message: string) => {
    return toast.loading(message, {
      style: {
        background: 'var(--color-surface)',
        color: 'var(--color-foreground)',
        borderRadius: 'var(--radius-2xl)',
        border: '1px solid var(--color-border)',
        boxShadow: 'var(--shadow-medium)',
      },
    })
  }, [])

  const dismissToast = useCallback((toastId: string) => {
    toast.dismiss(toastId)
  }, [])

  return {
    showSuccess,
    showError,
    showLoading,
    dismissToast,
  }
}