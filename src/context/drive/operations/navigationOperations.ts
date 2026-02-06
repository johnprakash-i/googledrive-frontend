import { Dispatch } from 'react'
import { DriveAction } from '../types'

export const createNavigationOperations = (
  dispatch: Dispatch<DriveAction>,
  currentPath: string[],
  fetchFiles: (folderId?: string | null) => Promise<void>,
  fetchFolders: (folderId?: string | null) => Promise<void>
) => {
  const navigateToFolder = async (folderId: string | null) => {
    if (folderId === null) {
      dispatch({ type: 'SET_CURRENT_PATH', payload: [] })
    } else {
      const existingIndex = currentPath.indexOf(folderId)
      
      if (existingIndex !== -1) {
        dispatch({
          type: 'SET_CURRENT_PATH',
          payload: currentPath.slice(0, existingIndex + 1)
        })
      } else {
        dispatch({
          type: 'SET_CURRENT_PATH',
          payload: [...currentPath, folderId]
        })
      }
    }
    
    dispatch({ type: 'CLEAR_SELECTION' })
    
    dispatch({ type: 'SET_LOADING', payload: true })
    try {
      await Promise.all([fetchFiles(folderId), fetchFolders(folderId)])
    } catch (error) {
      console.error('Failed to load folder contents:', error)
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false })
    }
  }

  const goBack = async () => {
    if (currentPath.length > 0) {
      const newPath = currentPath.slice(0, -1)
      const parentFolderId = newPath.length > 0 ? newPath[newPath.length - 1] : null

      dispatch({ type: 'SET_CURRENT_PATH', payload: newPath })
      dispatch({ type: 'CLEAR_SELECTION' })

      dispatch({ type: 'SET_LOADING', payload: true })
      try {
        await Promise.all([fetchFiles(parentFolderId), fetchFolders(parentFolderId)])
      } catch (error) {
        console.error('Failed to load folder contents:', error)
      } finally {
        dispatch({ type: 'SET_LOADING', payload: false })
      }
    }
  }

  const goToRoot = async () => {
    dispatch({ type: 'SET_CURRENT_PATH', payload: [] })
    dispatch({ type: 'CLEAR_SELECTION' })

    dispatch({ type: 'SET_LOADING', payload: true })
    try {
      await Promise.all([fetchFiles(null), fetchFolders(null)])
    } catch (error) {
      console.error('Failed to load root contents:', error)
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false })
    }
  }

  return {
    navigateToFolder,
    goBack,
    goToRoot
  }
}