import { DriveState } from '@/types/drive.types'
import { DriveAction } from './types'

export const driveReducer = (state: DriveState, action: DriveAction): DriveState => {
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
    case 'MERGE_FOLDERS':
      const mergedFolders = [...state.folders, ...action.payload].filter(
        (folder, index, self) =>
          index === self.findIndex(f => f._id === folder._id)
      )
      return { ...state, folders: mergedFolders }
    default:
      return state
  }
}