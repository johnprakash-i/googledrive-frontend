import { Dispatch } from 'react'
import { DriveAction } from '../types'
import { driveApi } from '@/features/drive/services/driveApi'
import { toast } from 'react-hot-toast'
import { mapBackendFileToFileItem, mapBackendFolderToFolder } from '../utils/mapper'

export const createShareOperations = (
  dispatch: Dispatch<DriveAction>
) => {
  const shareItem = async (
    itemId: string, 
    type: 'file' | 'folder', 
    email: string, 
    permission: 'VIEW' | 'EDIT'
  ) => {
    try {
      let response
      if (type === 'file') {
        response = await driveApi.shareFile(itemId, email, permission)
      } else {
        response = await driveApi.shareFolder(itemId, email, permission)
      }
      
      if (response.data.success) {
        const updatedItem = response.data.data[type] || response.data.data
        
        if (type === 'file') {
          const mappedFile = mapBackendFileToFileItem(updatedItem)
          dispatch({ type: 'UPDATE_FILE', payload: mappedFile })
        } else {
          const mappedFolder = mapBackendFolderToFolder(updatedItem)
          dispatch({ type: 'UPDATE_FOLDER', payload: mappedFolder })
        }
        
        toast.success(`${type === 'file' ? 'File' : 'Folder'} shared successfully`)
      }
    } catch (error: any) {
      console.error('Failed to share item:', error)
      toast.error(error.response?.data?.message || 'Failed to share item')
      throw error
    }
  }

  return {
    shareItem
  }
}