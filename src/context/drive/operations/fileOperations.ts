import { Dispatch } from 'react'
import { DriveAction } from '../types'
import { driveApi } from '@/features/drive/services/driveApi'
import { toast } from 'react-hot-toast'
import { mapBackendFileToFileItem } from '../utils/mapper'

export const createFileOperations = (
  dispatch: Dispatch<DriveAction>,
  getCurrentFolderId: () => string | null,
  searchQuery: string
) => {
  const fetchFiles = async (folderId?: string | null) => {
    dispatch({ type: 'SET_LOADING', payload: true })
    try {
      const response = await driveApi.getFiles(folderId, searchQuery)
      
      if (response.data.success) {
        const filesData = Array.isArray(response.data.data) 
          ? response.data.data 
          : response.data.data.files || []
        
        const mappedFiles = filesData.map(mapBackendFileToFileItem)
        dispatch({ type: 'SET_FILES', payload: mappedFiles })
      }
    } catch (error: any) {
      console.error('Failed to fetch files:', error)
      toast.error(error.response?.data?.message || 'Failed to fetch files')
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false })
    }
  }

  const uploadFile = async (file: File, folderId?: string | null) => {
    try {
      const targetFolderId = folderId !== undefined ? folderId : getCurrentFolderId()
      
      const response = await driveApi.uploadFile(file, targetFolderId)

      if (response.data.success) {
        const uploadedFile = response.data.data
        const mappedFile = mapBackendFileToFileItem(uploadedFile)
        
        dispatch({ type: 'ADD_FILE', payload: mappedFile })
        toast.success(`"${file.name}" uploaded successfully`)
      }
    } catch (error: any) {
      console.error('Failed to upload file:', error)
      toast.error(error.response?.data?.message || 'Failed to upload file')
      throw error
    }
  }

  const downloadFile = async (fileId: string) => {
    try {
      const response = await driveApi.downloadFile(fileId)
      if (response.data.success && response.data.data.url) {
        const link = document.createElement('a')
        link.href = response.data.data.url
        link.download = ''
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
        
        toast.success('Download started')
      }
    } catch (error: any) {
      console.error('Failed to download file:', error)
      toast.error(error.response?.data?.message || 'Failed to download file')
      throw error
    }
  }

  const deleteFile = async (fileId: string) => {
    try {
      const response = await driveApi.deleteFile(fileId)
      if (response.data.success) {
        dispatch({ type: 'DELETE_FILE', payload: fileId })
        toast.success('File moved to trash')
      }
    } catch (error: any) {
      console.error('Failed to delete file:', error)
      toast.error(error.response?.data?.message || 'Failed to delete file')
      throw error
    }
  }

  const renameFile = async (fileId: string, newName: string) => {
    try {
      const response = await driveApi.renameFile(fileId, newName)
      if (response.data.success) {
        const fileData = response.data.data.file || response.data.data
        const mappedFile = mapBackendFileToFileItem(fileData)
        
        dispatch({ type: 'UPDATE_FILE', payload: mappedFile })
        toast.success('File renamed successfully')
      }
    } catch (error: any) {
      console.error('Failed to rename file:', error)
      toast.error(error.response?.data?.message || 'Failed to rename file')
      throw error
    }
  }

  const starFile = async (fileId: string) => {
    try {
      const response = await driveApi.starFile(fileId)
      if (response.data.success) {
        const fileData = response.data.data.file || response.data.data
        const mappedFile = mapBackendFileToFileItem(fileData)
        
        dispatch({ type: 'UPDATE_FILE', payload: mappedFile })
        toast.success(mappedFile.isStarred ? 'File starred' : 'File unstarred')
      }
    } catch (error: any) {
      console.error('Failed to update file:', error)
      toast.error(error.response?.data?.message || 'Failed to update file')
      throw error
    }
  }

  const shareFile = async (fileId: string, email: string, permission: 'VIEW' | 'EDIT') => {
    try {
      const response = await driveApi.shareFile(fileId, email, permission)
      if (response.data.success) {
        const fileData = response.data.data.file || response.data.data
        const mappedFile = mapBackendFileToFileItem(fileData)
        
        dispatch({ type: 'UPDATE_FILE', payload: mappedFile })
        toast.success('File shared successfully')
      }
    } catch (error: any) {
      console.error('Failed to share file:', error)
      toast.error(error.response?.data?.message || 'Failed to share file')
      throw error
    }
  }

  const restoreFile = async (fileId: string) => {
    try {
      const response = await driveApi.restoreFile(fileId)
      if (response.data.success) {
        dispatch({ type: 'DELETE_FILE', payload: fileId })
        toast.success('File restored successfully')
      }
    } catch (error: any) {
      console.error('Failed to restore file:', error)
      toast.error(error.response?.data?.message || 'Failed to restore file')
      throw error
    }
  }

  const permanentlyDeleteFile = async (fileId: string) => {
    try {
      const response = await driveApi.permanentlyDeleteFile(fileId)
      if (response.data.success) {
        dispatch({ type: 'DELETE_FILE', payload: fileId })
        toast.success('File permanently deleted')
      }
    } catch (error: any) {
      console.error('Failed to permanently delete file:', error)
      toast.error(error.response?.data?.message || 'Failed to permanently delete file')
      throw error
    }
  }

  return {
    fetchFiles,
    uploadFile,
    downloadFile,
    deleteFile,
    renameFile,
    starFile,
    shareFile,
    restoreFile,
    permanentlyDeleteFile
  }
}