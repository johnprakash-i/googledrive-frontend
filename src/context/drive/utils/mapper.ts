import { FileItem, Folder } from '@/types/drive.types'

export const mapBackendFileToFileItem = (backendFile: any): FileItem => {
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

export const mapBackendFolderToFolder = (backendFolder: any): Folder => {
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