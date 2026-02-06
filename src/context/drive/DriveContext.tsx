import { createContext, useReducer, ReactNode, useCallback, useMemo, useEffect } from 'react'
import { useAuth } from '@/hooks/useAuth'
import { driveReducer } from './driveReducer'
import { DriveContextType, initialState } from './types'
import { createFileOperations } from './operations/fileOperations'
import { createFolderOperations } from './operations/folderOperations'
import { createSpecialViewsOperations } from './operations/specialViewsOperations'
import { createNavigationOperations } from './operations/navigationOperations'
import { createSelectionOperations } from './operations/selectionOperations'
import { createShareOperations } from './operations/shareOperations'
import { getCurrentFolderContents, getCurrentFolderId } from './utils/helpers'

export const DriveContext = createContext<DriveContextType | undefined>(undefined)

export function DriveProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(driveReducer, initialState)
  const { isAuthenticated, isLoading: authLoading } = useAuth()

  // Utility functions
  const _getCurrentFolderId = useCallback(() => 
    getCurrentFolderId(state.currentPath), 
    [state.currentPath]
  )

  const _getCurrentFolderContents = useCallback(
    () => getCurrentFolderContents(state.files, state.folders, _getCurrentFolderId()),
    [state.files, state.folders, _getCurrentFolderId]
  )

  // Create operations
  const fileOps = useMemo(
    () => createFileOperations(dispatch, _getCurrentFolderId, state.searchQuery),
    [dispatch, _getCurrentFolderId, state.searchQuery]
  )

  const folderOps = useMemo(
    () => createFolderOperations(dispatch, _getCurrentFolderId),
    [dispatch, _getCurrentFolderId]
  )

  const specialViewsOps = useMemo(
    () => createSpecialViewsOperations(dispatch),
    [dispatch]
  )

  const navigationOps = useMemo(
    () => createNavigationOperations(
      dispatch, 
      state.currentPath, 
      fileOps.fetchFiles, 
      folderOps.fetchFolders
    ),
    [dispatch, state.currentPath, fileOps.fetchFiles, folderOps.fetchFolders]
  )

  const selectionOps = useMemo(
    () => createSelectionOperations(dispatch, state.selectedItems),
    [dispatch, state.selectedItems]
  )

  const shareOps = useMemo(
    () => createShareOperations(dispatch),
    [dispatch]
  )

  // Search operations
  const searchFiles = useCallback((query: string) => {
    dispatch({ type: 'SET_SEARCH_QUERY', payload: query })
  }, [])

  const clearSearch = useCallback(() => {
    dispatch({ type: 'SET_SEARCH_QUERY', payload: '' })
  }, [])

  // Initial data loading
  useEffect(() => {
    if (authLoading || !isAuthenticated) {
      return
    }

    const loadInitialData = async () => {
      dispatch({ type: 'SET_LOADING', payload: true })
      try {
        await Promise.all([fileOps.fetchFiles(null), folderOps.fetchFolders(null)])
      } catch (error) {
        console.error('Failed to load initial data:', error)
      } finally {
        dispatch({ type: 'SET_LOADING', payload: false })
      }
    }

    loadInitialData()
  }, [isAuthenticated, authLoading, fileOps, folderOps])

  const value = useMemo(
    () => ({
      ...state,
      // File operations
      ...fileOps,
      // Folder operations
      ...folderOps,
      // Special views operations
      ...specialViewsOps,
      // Navigation operations
      ...navigationOps,
      // Selection operations
      ...selectionOps,
      // Share operations
      ...shareOps,
      // Search operations
      searchFiles,
      clearSearch,
      // Utility functions
      getCurrentFolderContents: _getCurrentFolderContents,
      getCurrentFolderId: _getCurrentFolderId,
    }),
    [
      state,
      fileOps,
      folderOps,
      specialViewsOps,
      navigationOps,
      selectionOps,
      shareOps,
      searchFiles,
      clearSearch,
      _getCurrentFolderContents,
      _getCurrentFolderId,
    ]
  )

  return <DriveContext.Provider value={value}>{children}</DriveContext.Provider>
}