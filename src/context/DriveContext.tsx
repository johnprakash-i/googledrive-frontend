import React, { createContext, useReducer, ReactNode, useCallback, useMemo, useEffect } from 'react'
import { FileItem, Folder, DriveState } from '@/types/drive.types'
import { driveApi } from '@/features/drive/services/driveApi'
import { toast } from 'react-hot-toast'
import { useAuth } from '@/hooks/useAuth'

type DriveAction =
  | { type: 'SET_FILES'; payload: FileItem[] }
  | { type: 'SET_FOLDERS'; payload: Folder[] }
  | { type: 'ADD_FILE'; payload: FileItem }
  | { type: 'ADD_FOLDER'; payload: Folder }
  | { type: 'UPDATE_FILE'; payload: FileItem }
  | { type: 'UPDATE_FOLDER'; payload: Folder }
  | { type: 'DELETE_FILE'; payload: string }
  | { type: 'DELETE_FOLDER'; payload: string }
  | { type: 'SET_CURRENT_PATH'; payload: string[] }
  | { type: 'SET_SELECTED_ITEMS'; payload: string[] }
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_SEARCH_QUERY'; payload: string }
  | { type: 'CLEAR_SELECTION' }

const initialState: DriveState = {
  files: [],
  folders: [],
  currentPath: [],
  selectedItems: [],
  isLoading: false,
  searchQuery: '',
}

const driveReducer = (state: DriveState, action: DriveAction): DriveState => {
  switch (action.type) {
    case 'SET_FILES':
      return { ...state, files: action.payload }
    case 'SET_FOLDERS':
      return { ...state, folders: action.payload }
    case 'ADD_FILE':
      return { ...state, files: [...state.files, action.payload] }
    case 'ADD_FOLDER':
      return { ...state, folders: [...state.folders, action.payload] }
    case 'UPDATE_FILE':
      return {
        ...state,
        files: state.files.map(file =>
          file._id === action.payload._id ? action.payload : file
        ),
      }
    case 'UPDATE_FOLDER':
      return {
        ...state,
        folders: state.folders.map(folder =>
          folder._id === action.payload._id ? action.payload : folder
        ),
      }
    case 'DELETE_FILE':
      return {
        ...state,
        files: state.files.filter(file => file._id !== action.payload),
      }
    case 'DELETE_FOLDER':
      return {
        ...state,
        folders: state.folders.filter(folder => folder._id !== action.payload),
      }
    case 'SET_CURRENT_PATH':
      return { ...state, currentPath: action.payload }
    case 'SET_SELECTED_ITEMS':
      return { ...state, selectedItems: action.payload }
    case 'SET_LOADING':
      return { ...state, isLoading: action.payload }
    case 'SET_SEARCH_QUERY':
      return { ...state, searchQuery: action.payload }
    case 'CLEAR_SELECTION':
      return { ...state, selectedItems: [] }
    default:
      return state
  }
}

interface DriveContextType extends DriveState {
  uploadFile: (file: File, folderId?: string | null) => Promise<void>
  downloadFile: (fileId: string) => Promise<void>
  deleteFile: (fileId: string) => Promise<void>
  renameFile: (fileId: string, newName: string) => Promise<void>
  starFile: (fileId: string) => Promise<void>
  shareFile: (fileId: string, email: string, permission: 'VIEW' | 'EDIT') => Promise<void>
  createFolder: (name: string, parentId?: string | null) => Promise<void>
  deleteFolder: (folderId: string) => Promise<void>
  renameFolder: (folderId: string, newName: string) => Promise<void>
  navigateToFolder: (folderId: string | null) => Promise<void>
  goBack: () => Promise<void>
  goToRoot: () => Promise<void>
  selectItem: (itemId: string) => void
  selectMultiple: (itemIds: string[]) => void
  deselectItem: (itemId: string) => void
  clearSelection: () => void
  fetchFiles: (folderId?: string | null) => Promise<void>
  fetchFolders: (folderId?: string | null) => Promise<void>
  fetchSharedFiles: () => Promise<void>
  searchFiles: (query: string) => void
  clearSearch: () => void
  getCurrentFolderContents: () => { files: FileItem[]; folders: Folder[] }
  getCurrentFolderId: () => string | null
}

export const DriveContext = createContext<DriveContextType | undefined>(undefined)

const mapBackendFileToFileItem = (backendFile: any): FileItem => {
  return {
    _id: backendFile._id,
    name: backendFile.name,
    type: 'file',
    size: backendFile.size,
    mimeType: backendFile.mimeType,
    parentId: backendFile.folderId ?? null,
    userId: backendFile.ownerId,
    url: backendFile.url ?? undefined,
    isStarred: backendFile.isStarred ?? false,
    sharedWith: backendFile.sharedWith ?? [],
    createdAt: backendFile.createdAt,
    updatedAt: backendFile.updatedAt,
  }
}

const mapBackendFolderToFolder = (backendFolder: any): Folder => {
  return {
    _id: backendFolder._id,
    name: backendFolder.name,
    parentId: backendFolder.parentId ?? null,
    userId: backendFolder.ownerId,
    sharedWith: backendFolder.sharedWith ?? [],
    isStarred: backendFolder.isStarred ?? false,
    fileCount: backendFolder.fileCount ?? 0,
    createdAt: backendFolder.createdAt,
    updatedAt: backendFolder.updatedAt,
  }
}

export function DriveProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(driveReducer, initialState)
  const { isAuthenticated, isLoading: authLoading } = useAuth()

  const getCurrentFolderId = useCallback(() => {
    return state.currentPath.length > 0 
      ? state.currentPath[state.currentPath.length - 1] 
      : null
  }, [state.currentPath])

  const getCurrentFolderContents = useCallback(() => {
    const currentFolderId = getCurrentFolderId()

    const folders = state.folders.filter(
      folder => (folder.parentId ?? null) === currentFolderId
    )

    const files = state.files.filter(
      file => (file.parentId ?? null) === currentFolderId
    )

    return { files, folders }
  }, [state.files, state.folders, getCurrentFolderId])

  const fetchFiles = useCallback(async (folderId?: string | null) => {
    dispatch({ type: 'SET_LOADING', payload: true })
    try {
      const response = await driveApi.getFiles(folderId, state.searchQuery)
      
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
  }, [state.searchQuery])

  const fetchFolders = useCallback(async (folderId?: string | null) => {
    try {
      const response = await driveApi.getFolders(folderId)
      
      if (response.data.success) {
        const foldersData = Array.isArray(response.data.data) 
          ? response.data.data 
          : response.data.data.folders || []
        
        const mappedFolders = foldersData.map(mapBackendFolderToFolder)
        dispatch({ type: 'SET_FOLDERS', payload: mappedFolders })
      }
    } catch (error: any) {
      console.error('Failed to fetch folders:', error)
      toast.error(error.response?.data?.message || 'Failed to fetch folders')
    }
  }, [])

  const uploadFile = useCallback(async (_file: File, folderId?: string | null) => {
    try {
      const targetFolderId = folderId !== undefined ? folderId : getCurrentFolderId()
      console.log(targetFolderId,"Yesss")
      // const response = await driveApi.uploadFile(file, targetFolderId)

      // if (response.data.success) {
      //   const uploadedFile = response.data.data
      //   const mappedFile = mapBackendFileToFileItem(uploadedFile)
        
      //   dispatch({ type: 'ADD_FILE', payload: mappedFile })
      //   toast.success(`"${file.name}" uploaded successfully`)
      // }
    } catch (error: any) {
      console.error('Failed to upload file:', error)
      toast.error(error.response?.data?.message || 'Failed to upload file')
      throw error
    }
  }, [getCurrentFolderId])

  const downloadFile = useCallback(async (fileId: string) => {
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
  }, [])

  const deleteFile = useCallback(async (fileId: string) => {
    try {
      const response = await driveApi.deleteFile(fileId)
      if (response.data.success) {
        dispatch({ type: 'DELETE_FILE', payload: fileId })
        toast.success('File deleted successfully')
      }
    } catch (error: any) {
      console.error('Failed to delete file:', error)
      toast.error(error.response?.data?.message || 'Failed to delete file')
      throw error
    }
  }, [])

  const createFolder = useCallback(async (name: string, parentId?: string | null) => {
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
  }, [getCurrentFolderId])

  const deleteFolder = useCallback(async (folderId: string) => {
    try {
      const response = await driveApi.deleteFolder(folderId)
      if (response.data.success) {
        dispatch({ type: 'DELETE_FOLDER', payload: folderId })
        toast.success('Folder deleted successfully')
      }
    } catch (error: any) {
      console.error('Failed to delete folder:', error)
      toast.error(error.response?.data?.message || 'Failed to delete folder')
      throw error
    }
  }, [])

  const renameFile = useCallback(async (fileId: string, newName: string) => {
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
  }, [])

  const renameFolder = useCallback(async (folderId: string, newName: string) => {
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
  }, [])

  const starFile = useCallback(async (fileId: string) => {
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
  }, [])

  const shareFile = useCallback(async (fileId: string, email: string, permission: 'VIEW' | 'EDIT') => {
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
  }, [])

  const fetchSharedFiles = useCallback(async () => {
    try {
      const response = await driveApi.getSharedFiles()
      if (response.data.success) {
        const filesData = Array.isArray(response.data.data) 
          ? response.data.data 
          : response.data.data.files || []
        
        const mappedFiles = filesData.map(mapBackendFileToFileItem)
        dispatch({ type: 'SET_FILES', payload: mappedFiles })
      }
    } catch (error: any) {
      console.error('Failed to fetch shared files:', error)
      toast.error(error.response?.data?.message || 'Failed to fetch shared files')
      throw error
    }
  }, [])

  // ✅ FIXED: Navigate to folder AND refetch contents
  const navigateToFolder = useCallback(async (folderId: string | null) => {
    if (folderId === null) {
      dispatch({ type: 'SET_CURRENT_PATH', payload: [] })
    } else {
      dispatch({ type: 'SET_CURRENT_PATH', payload: [...state.currentPath, folderId] })
    }
    dispatch({ type: 'CLEAR_SELECTION' })
    
    // ⭐ KEY FIX: Fetch the folder's contents after navigating
    dispatch({ type: 'SET_LOADING', payload: true })
    try {
      await Promise.all([
        fetchFiles(folderId),
        fetchFolders(folderId)
      ])
    } catch (error) {
      console.error('Failed to load folder contents:', error)
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false })
    }
  }, [state.currentPath, fetchFiles, fetchFolders])

  // ✅ FIXED: Go back AND refetch contents
  const goBack = useCallback(async () => {
    if (state.currentPath.length > 0) {
      const newPath = state.currentPath.slice(0, -1)
      const parentFolderId = newPath.length > 0 ? newPath[newPath.length - 1] : null
      
      dispatch({ type: 'SET_CURRENT_PATH', payload: newPath })
      dispatch({ type: 'CLEAR_SELECTION' })
      
      // ⭐ KEY FIX: Fetch parent folder's contents
      dispatch({ type: 'SET_LOADING', payload: true })
      try {
        await Promise.all([
          fetchFiles(parentFolderId),
          fetchFolders(parentFolderId)
        ])
      } catch (error) {
        console.error('Failed to load folder contents:', error)
      } finally {
        dispatch({ type: 'SET_LOADING', payload: false })
      }
    }
  }, [state.currentPath, fetchFiles, fetchFolders])

  // ✅ FIXED: Go to root AND refetch root contents
  const goToRoot = useCallback(async () => {
    dispatch({ type: 'SET_CURRENT_PATH', payload: [] })
    dispatch({ type: 'CLEAR_SELECTION' })
    
    // ⭐ KEY FIX: Fetch root contents
    dispatch({ type: 'SET_LOADING', payload: true })
    try {
      await Promise.all([
        fetchFiles(null),
        fetchFolders(null)
      ])
    } catch (error) {
      console.error('Failed to load root contents:', error)
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false })
    }
  }, [fetchFiles, fetchFolders])

  const selectItem = useCallback((itemId: string) => {
    dispatch({
      type: 'SET_SELECTED_ITEMS',
      payload: [...state.selectedItems, itemId],
    })
  }, [state.selectedItems])

  const selectMultiple = useCallback((itemIds: string[]) => {
    dispatch({ type: 'SET_SELECTED_ITEMS', payload: itemIds })
  }, [])

  const deselectItem = useCallback((itemId: string) => {
    dispatch({
      type: 'SET_SELECTED_ITEMS',
      payload: state.selectedItems.filter(id => id !== itemId),
    })
  }, [state.selectedItems])

  const clearSelection = useCallback(() => {
    dispatch({ type: 'CLEAR_SELECTION' })
  }, [])

  const searchFiles = useCallback((query: string) => {
    dispatch({ type: 'SET_SEARCH_QUERY', payload: query })
  }, [])

  const clearSearch = useCallback(() => {
    dispatch({ type: 'SET_SEARCH_QUERY', payload: '' })
  }, [])

  // Fetch initial data when authenticated
  useEffect(() => {
    if (authLoading || !isAuthenticated) {
      return
    }

    const loadInitialData = async () => {
      dispatch({ type: 'SET_LOADING', payload: true })
      try {
        await Promise.all([fetchFiles(null), fetchFolders(null)])
      } catch (error) {
        console.error('Failed to load initial data:', error)
      } finally {
        dispatch({ type: 'SET_LOADING', payload: false })
      }
    }

    loadInitialData()
  }, [isAuthenticated, authLoading, fetchFiles, fetchFolders])

  const value = useMemo(
    () => ({
      ...state,
      uploadFile,
      downloadFile,
      deleteFile,
      renameFile,
      starFile,
      shareFile,
      createFolder,
      deleteFolder,
      renameFolder,
      navigateToFolder,
      goBack,
      goToRoot,
      selectItem,
      selectMultiple,
      deselectItem,
      clearSelection,
      fetchFiles,
      fetchFolders,
      fetchSharedFiles,
      searchFiles,
      clearSearch,
      getCurrentFolderContents,
      getCurrentFolderId,
    }),
    [
      state,
      uploadFile,
      downloadFile,
      deleteFile,
      renameFile,
      starFile,
      shareFile,
      createFolder,
      deleteFolder,
      renameFolder,
      navigateToFolder,
      goBack,
      goToRoot,
      selectItem,
      selectMultiple,
      deselectItem,
      clearSelection,
      fetchFiles,
      fetchFolders,
      fetchSharedFiles,
      searchFiles,
      clearSearch,
      getCurrentFolderContents,
      getCurrentFolderId,
    ]
  )

  return <DriveContext.Provider value={value}>{children}</DriveContext.Provider>
}