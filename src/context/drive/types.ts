import { FileItem, Folder, DriveState } from '@/types/drive.types'

export type DriveAction =
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
  | { type: 'MERGE_FOLDERS'; payload: Folder[] }

export interface DriveContextType extends DriveState {
  // File operations
  uploadFile: (file: File, folderId?: string | null) => Promise<void>
  downloadFile: (fileId: string) => Promise<void>
  deleteFile: (fileId: string) => Promise<void>
  renameFile: (fileId: string, newName: string) => Promise<void>
  starFile: (fileId: string) => Promise<void>
  shareFile: (fileId: string, email: string, permission: 'VIEW' | 'EDIT') => Promise<void>
  restoreFile: (fileId: string) => Promise<void>
  permanentlyDeleteFile: (fileId: string) => Promise<void>
  
  // Folder operations
  createFolder: (name: string, parentId?: string | null) => Promise<void>
  deleteFolder: (folderId: string) => Promise<void>
  renameFolder: (folderId: string, newName: string) => Promise<void>
  starFolder: (folderId: string) => Promise<void>
  shareFolder: (folderId: string, email: string, permission: 'VIEW' | 'EDIT') => Promise<void>
  restoreFolder: (folderId: string) => Promise<void>
  permanentlyDeleteFolder: (folderId: string) => Promise<void>
  
  // Navigation
  navigateToFolder: (folderId: string | null) => Promise<void>
  goBack: () => Promise<void>
  goToRoot: () => Promise<void>
  
  // Selection
  selectItem: (itemId: string) => void
  selectMultiple: (itemIds: string[]) => void
  deselectItem: (itemId: string) => void
  clearSelection: () => void
  
  // Fetching
  fetchFiles: (folderId?: string | null) => Promise<void>
  fetchFolders: (folderId?: string | null) => Promise<void>
  fetchSharedFiles: () => Promise<void>
  fetchStarredFiles: () => Promise<void>
  fetchRecentFiles: () => Promise<void>
  fetchTrash: () => Promise<void>
  emptyTrash: () => Promise<void>
  
  // Search
  searchFiles: (query: string) => void
  clearSearch: () => void
  shareItem: (itemId: string, type: 'file' | 'folder', email: string, permission: 'VIEW' | 'EDIT') => Promise<void>

  // Utility
  getCurrentFolderContents: () => { files: FileItem[]; folders: Folder[] }
  getCurrentFolderId: () => string | null
}

export const initialState: DriveState = {
  files: [],
  folders: [],
  currentPath: [],
  selectedItems: [],
  isLoading: false,
  searchQuery: '',
}