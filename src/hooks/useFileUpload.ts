import { useState, useCallback } from 'react'
import { useDrive } from './useDrive'
import { useToast } from './useToast'
import { UploadProgress } from '@/types/drive.types'

export function useFileUpload() {
  const { uploadFile } = useDrive()
  const { showSuccess, showError, showLoading, dismissToast } = useToast()
  const [progresses, setProgresses] = useState<Map<string, UploadProgress>>(new Map())

  const uploadFiles = useCallback(
    async (files: File[], folderId?: string | null) => {
      const uploadPromises = files.map(async (file) => {
        const fileId = `${file.name}-${Date.now()}`
        
        // Initialize progress
        setProgresses((prev) =>
          new Map(prev).set(fileId, {
            file,
            progress: 0,
            uploaded: 0,
            total: file.size,
            isComplete: false,
          })
        )

        const toastId = showLoading(`Uploading ${file.name}...`)

        try {
          // Simulate progress (in real app, use axios progress event)
          const simulateProgress = () => {
            return new Promise<void>((resolve) => {
              let progress = 0
              const interval = setInterval(() => {
                progress += 10
                setProgresses((prev) => {
                  const newMap = new Map(prev)
                  const current = newMap.get(fileId)
                  if (current) {
                    newMap.set(fileId, {
                      ...current,
                      progress,
                      uploaded: (file.size * progress) / 100,
                    })
                  }
                  return newMap
                })
                
                if (progress >= 90) {
                  clearInterval(interval)
                  resolve()
                }
              }, 100)
            })
          }

          await simulateProgress()
          
          // Actual upload
          await uploadFile(file, folderId)
          
          // Mark as complete
          setProgresses((prev) => {
            const newMap = new Map(prev)
            const current = newMap.get(fileId)
            if (current) {
              newMap.set(fileId, {
                ...current,
                progress: 100,
                uploaded: file.size,
                isComplete: true,
              })
            }
            return newMap
          })

          dismissToast(toastId)
          showSuccess(`"${file.name}" uploaded successfully!`)
        } catch (error) {
          setProgresses((prev) => {
            const newMap = new Map(prev)
            const current = newMap.get(fileId)
            if (current) {
              newMap.set(fileId, {
                ...current,
                error: 'Upload failed',
              })
            }
            return newMap
          })
          
          dismissToast(toastId)
          showError(`Failed to upload "${file.name}"`)
          throw error
        }
      })

      return Promise.all(uploadPromises)
    },
    [uploadFile, showSuccess, showError, showLoading, dismissToast]
  )

  const getProgress = useCallback(
    (fileId: string) => {
      return progresses.get(fileId)
    },
    [progresses]
  )

  const clearProgress = useCallback((fileId: string) => {
    setProgresses((prev) => {
      const newMap = new Map(prev)
      newMap.delete(fileId)
      return newMap
    })
  }, [])

  return {
    uploadFiles,
    getProgress,
    clearProgress,
    progresses: Array.from(progresses.values()),
  }
}