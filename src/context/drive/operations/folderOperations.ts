import { Dispatch } from 'react'
import { DriveAction } from '../types'
import { driveApi } from '@/features/drive/services/driveApi'
import { toast } from 'react-hot-toast'
import { mapBackendFolderToFolder } from '../utils/mapper'

export const createFolderOperations = (
  dispatch: Dispatch<DriveAction>,
  getCurrentFolderId: () => string | null
) => {
  const fetchFolders = async (parentId?: string | null) => {
    try {
      const response = await driveApi.getFolders(parentId)
      
      if (response.data.success) {
        const foldersData = Array.isArray(response.data.data) 
          ? response.data.data 
          : response.data.data.folders || []
        
        const mappedFolders = foldersData.map(mapBackendFolderToFolder)
        
        if (parentId === undefined || parentId === null) {
          dispatch({ type: 'SET_FOLDERS', payload: mappedFolders })
        } else {
          dispatch({ type: 'MERGE_FOLDERS', payload: mappedFolders })
        }
      }
    } catch (error: any) {
      console.error('Failed to fetch folders:', error)
      toast.error(error.response?.data?.message || 'Failed to fetch folders')
    }
  }

  const createFolder = async (name: string, parentId?: string | null) => {
    try {
      const targetParentId = parentId !== undefined ? parentId : getCurrentFolderId()
      
      const response = await driveApi.createFolder(name, targetParentId)
      
      if (response.data.success) {
        const folderData = response.data.data.folder || response.data.data
        const mappedFolder = mapBackendFolderToFolder(folderData)
        
        dispatch({ type: 'ADD_FOLDER', payload: mappedFolder })
        toast.success(`Folder "${name}" created successfully`)
      }
    } catch (error: any) {
      console.error('Failed to create folder:', error)
      toast.error(error.response?.data?.message || 'Failed to create folder')
      throw error
    }
  }

  const deleteFolder = async (folderId: string) => {
    try {
      const response = await driveApi.deleteFolder(folderId)
      if (response.data.success) {
        dispatch({ type: 'DELETE_FOLDER', payload: folderId })
        toast.success('Folder moved to trash')
      }
    } catch (error: any) {
      console.error('Failed to delete folder:', error)
      toast.error(error.response?.data?.message || 'Failed to delete folder')
      throw error
    }
  }

  const renameFolder = async (folderId: string, newName: string) => {
    try {
      const response = await driveApi.renameFolder(folderId, newName)
      if (response.data.success) {
        const folderData = response.data.data.folder || response.data.data
        const mappedFolder = mapBackendFolderToFolder(folderData)
        
        dispatch({ type: 'UPDATE_FOLDER', payload: mappedFolder })
        toast.success('Folder renamed successfully')
      }
    } catch (error: any) {
      console.error('Failed to rename folder:', error)
      toast.error(error.response?.data?.message || 'Failed to rename folder')
      throw error
    }
  }

  const starFolder = async (folderId: string) => {
    try {
      const response = await driveApi.starFolder(folderId)
      if (response.data.success) {
        const folderData = response.data.data.folder || response.data.data
        const mappedFolder = mapBackendFolderToFolder(folderData)
        
        dispatch({ type: 'UPDATE_FOLDER', payload: mappedFolder })
        toast.success(mappedFolder.isStarred ? 'Folder starred' : 'Folder unstarred')
      }
    } catch (error: any) {
      console.error('Failed to star folder:', error)
      toast.error(error.response?.data?.message || 'Failed to star folder')
      throw error
    }
  }

  const shareFolder = async (folderId: string, email: string, permission: 'VIEW' | 'EDIT') => {
    try {
      const response = await driveApi.shareFolder(folderId, email, permission)
      if (response.data.success) {
        const folderData = response.data.data.folder || response.data.data
        const mappedFolder = mapBackendFolderToFolder(folderData)
        
        dispatch({ type: 'UPDATE_FOLDER', payload: mappedFolder })
        toast.success('Folder shared successfully')
      }
    } catch (error: any) {
      console.error('Failed to share folder:', error)
      toast.error(error.response?.data?.message || 'Failed to share folder')
      throw error
    }
  }

  const restoreFolder = async (folderId: string) => {
    try {
      const response = await driveApi.restoreFolder(folderId)
      if (response.data.success) {
        dispatch({ type: 'DELETE_FOLDER', payload: folderId })
        toast.success('Folder restored successfully')
      }
    } catch (error: any) {
      console.error('Failed to restore folder:', error)
      toast.error(error.response?.data?.message || 'Failed to restore folder')
      throw error
    }
  }

  const permanentlyDeleteFolder = async (folderId: string) => {
    try {
      const response = await driveApi.permanentlyDeleteFolder(folderId)
      if (response.data.success) {
        dispatch({ type: 'DELETE_FOLDER', payload: folderId })
        toast.success('Folder permanently deleted')
      }
    } catch (error: any) {
      console.error('Failed to permanently delete folder:', error)
      toast.error(error.response?.data?.message || 'Failed to permanently delete folder')
      throw error
    }
  }

  return {
    fetchFolders,
    createFolder,
    deleteFolder,
    renameFolder,
    starFolder,
    shareFolder,
    restoreFolder,
    permanentlyDeleteFolder
  }
}