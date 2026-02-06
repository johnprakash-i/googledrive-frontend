import { useState } from 'react'
import { useDrive } from './useDrive'


export const useRename = () => {
  const [isRenaming, setIsRenaming] = useState(false)
  const [renameError, setRenameError] = useState<string | null>(null)
  const { renameFile, renameFolder } = useDrive()

  const handleRename = async (
    itemId: string,
    newName: string,
    type: 'file' | 'folder'
  ) => {
    setIsRenaming(true)
    setRenameError(null)
    
    try {
      if (type === 'file') {
        await renameFile(itemId, newName)
      } else {
        await renameFolder(itemId, newName)
      }
      return true
    } catch (error: any) {
      setRenameError(error.response?.data?.message || 'Failed to rename')
      return false
    } finally {
      setIsRenaming(false)
    }
  }

  return {
    isRenaming,
    renameError,
    handleRename,
    resetError: () => setRenameError(null)
  }
}