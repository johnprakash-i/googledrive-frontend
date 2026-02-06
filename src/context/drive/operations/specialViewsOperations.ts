import { Dispatch } from 'react'
import { DriveAction } from '../types'
import { driveApi } from '@/features/drive/services/driveApi'
import { toast } from 'react-hot-toast'
import { mapBackendFileToFileItem, mapBackendFolderToFolder } from '../utils/mapper'

export const createSpecialViewsOperations = (
  dispatch: Dispatch<DriveAction>
) => {
  const fetchSharedFiles = async () => {
    try {
      const response = await driveApi.getSharedFiles()
      if (response.data.success) {
        const filesData = Array.isArray(response.data.data) 
          ? response.data.data 
          : response.data.data.files || []
        
        const mappedFiles = filesData.map(mapBackendFileToFileItem)
        dispatch({ type: 'SET_FILES', payload: mappedFiles })
        dispatch({ type: 'SET_FOLDERS', payload: [] })
      }
    } catch (error: any) {
      console.error('Failed to fetch shared files:', error)
      toast.error(error.response?.data?.message || 'Failed to fetch shared files')
      throw error
    }
  }

  const fetchStarredFiles = async () => {
    try {
      const response = await driveApi.getStarredFiles()
      if (response.data.success) {
        const filesData = Array.isArray(response.data.data) 
          ? response.data.data 
          : response.data.data.files || []
        
        const mappedFiles = filesData.map(mapBackendFileToFileItem)
        dispatch({ type: 'SET_FILES', payload: mappedFiles })
      }
    } catch (error: any) {
      console.error('Failed to fetch starred files:', error)
      toast.error(error.response?.data?.message || 'Failed to fetch starred files')
      throw error
    }
  }

  const fetchRecentFiles = async () => {
    try {
      const response = await driveApi.getRecentFiles()
      if (response.data.success) {
        const filesData = Array.isArray(response.data.data) 
          ? response.data.data 
          : response.data.data.files || []
        
        const mappedFiles = filesData.map(mapBackendFileToFileItem)
        dispatch({ type: 'SET_FILES', payload: mappedFiles })
        dispatch({ type: 'SET_FOLDERS', payload: [] })
      }
    } catch (error: any) {
      console.error('Failed to fetch recent files:', error)
      toast.error(error.response?.data?.message || 'Failed to fetch recent files')
      throw error
    }
  }

  const fetchTrash = async () => {
    try {
      const [filesResponse, foldersResponse] = await driveApi.getTrash()
      
      const filesData = filesResponse.data.data || []
      const foldersData = foldersResponse.data.data || []
      
      const mappedFiles = filesData.map(mapBackendFileToFileItem)
      const mappedFolders = foldersData.map(mapBackendFolderToFolder)
      
      dispatch({ type: 'SET_FILES', payload: mappedFiles })
      dispatch({ type: 'SET_FOLDERS', payload: mappedFolders })
    } catch (error: any) {
      console.error('Failed to fetch trash:', error)
      toast.error(error.response?.data?.message || 'Failed to fetch trash')
      throw error
    }
  }

  const emptyTrash = async () => {
    try {
      await driveApi.emptyTrash()
      dispatch({ type: 'SET_FILES', payload: [] })
      dispatch({ type: 'SET_FOLDERS', payload: [] })
      toast.success('Trash emptied successfully')
    } catch (error: any) {
      console.error('Failed to empty trash:', error)
      toast.error(error.response?.data?.message || 'Failed to empty trash')
      throw error
    }
  }

  return {
    fetchSharedFiles,
    fetchStarredFiles,
    fetchRecentFiles,
    fetchTrash,
    emptyTrash
  }
}