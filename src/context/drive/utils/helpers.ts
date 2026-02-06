import { FileItem, Folder } from '@/types/drive.types'

export const getCurrentFolderId = (currentPath: string[]): string | null => {
  return currentPath.length > 0 
    ? currentPath[currentPath.length - 1] 
    : null
}

export const getCurrentFolderContents = (
  files: FileItem[],
  folders: Folder[],
  currentFolderId: string | null
) => {
  const currentFolders = folders.filter(
    folder => (folder.parentId ?? null) === currentFolderId
  )

  const currentFiles = files.filter(
    file => (file.parentId ?? null) === currentFolderId
  )

  return { files: currentFiles, folders: currentFolders }
}