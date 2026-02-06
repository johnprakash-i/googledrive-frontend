import { axiosInstance } from '@/utils/axiosInstance'

export const driveApi = {
  // ============ FILES ============
  getFiles: async (folderId?: string | null, search?: string) => {
    const params = new URLSearchParams()
    if (folderId) params.append('folderId', folderId)
    if (search) params.append('search', search)
    
    return axiosInstance.get(`/files?${params.toString()}`)
  },

  uploadFile: async (file: File, folderId?: string | null) => {
    const formData = new FormData()
    formData.append('file', file)
    if (folderId) {
      formData.append('folderId', folderId)
    }
    
    return axiosInstance.post('/files/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })
  },

  downloadFile: async (fileId: string) => {
    return axiosInstance.get(`/files/${fileId}/download`)
  },

  deleteFile: async (fileId: string) => {
    return axiosInstance.delete(`/files/${fileId}`)
  },

  renameFile: async (fileId: string, newName: string) => {
    return axiosInstance.patch(`/files/${fileId}`, { name: newName })
  },

  starFile: async (fileId: string) => {
    return axiosInstance.patch(`/files/${fileId}/star`)
  },

  shareFile: async (fileId: string, email: string, permission: 'VIEW' | 'EDIT') => {
    return axiosInstance.post(`/files/${fileId}/share`, {
      email,
      permission,
    })
  },

  updateFilePermission: async (fileId: string, email: string, permission: 'VIEW' | 'EDIT') => {
    return axiosInstance.patch(`/files/${fileId}/share`, {
      email,
      permission,
    })
  },

  removeFileAccess: async (fileId: string, email: string) => {
    return axiosInstance.delete(`/files/${fileId}/share`, {
      data: { email },
    })
  },

  restoreFile: async (fileId: string) => {
    return axiosInstance.post(`/files/${fileId}/restore`)
  },

  permanentlyDeleteFile: async (fileId: string) => {
    return axiosInstance.delete(`/files/${fileId}/permanent`)
  },

  getSharedFiles: async () => {
    return axiosInstance.get('/files/shared')
  },

  getStarredFiles: async () => {
    return axiosInstance.get('/files/starred')
  },

  getRecentFiles: async () => {
    return axiosInstance.get('/files/recent')
  },

  getTrashedFiles: async () => {
    return axiosInstance.get('/files/trash/list')
  },

  // ============ FOLDERS ============
  getFolders: async (parentId?: string | null) => {
    const params = new URLSearchParams()
    if (parentId) params.append('parentId', parentId)
    
    return axiosInstance.get(`/folders?${params.toString()}`)
  },

  createFolder: async (name: string, parentId?: string | null) => {
    return axiosInstance.post('/folders', {
      name,
      parentId: parentId || null,
    })
  },

  deleteFolder: async (folderId: string) => {
    return axiosInstance.delete(`/folders/${folderId}`)
  },

  renameFolder: async (folderId: string, newName: string) => {
    return axiosInstance.patch(`/folders/${folderId}`, { name: newName })
  },

  starFolder: async (folderId: string) => {
    return axiosInstance.patch(`/folders/${folderId}/star`)
  },

  shareFolder: async (folderId: string, email: string, permission: 'VIEW' | 'EDIT') => {
    return axiosInstance.post(`/folders/${folderId}/share`, {
      email,
      permission,
    })
  },

  // ✅ NEW: Update folder share permission
  updateFolderPermission: async (folderId: string, email: string, permission: 'VIEW' | 'EDIT') => {
    return axiosInstance.patch(`/folders/${folderId}/share`, {
      email,
      permission,
    })
  },

  // ✅ NEW: Remove folder share access
  removeFolderAccess: async (folderId: string, email: string) => {
    return axiosInstance.delete(`/folders/${folderId}/share`, {
      data: { email },
    })
  },

  restoreFolder: async (folderId: string) => {
    return axiosInstance.post(`/folders/${folderId}/restore`)
  },

  permanentlyDeleteFolder: async (folderId: string) => {
    return axiosInstance.delete(`/folders/${folderId}/permanent`)
  },

  getTrashedFolders: async () => {
    return axiosInstance.get('/folders/trash/list')
  },

  // ✅ NEW: Get shared folders
  getSharedFolders: async () => {
    return axiosInstance.get('/folders/shared/list')
  },

  // ============ TRASH ============
  getTrash: async () => {
    return Promise.all([
      axiosInstance.get('/files/trash/list'),
      axiosInstance.get('/folders/trash/list'),
    ])
  },

  emptyTrash: async () => {
    const [filesRes, foldersRes] = await Promise.all([
      axiosInstance.get('/files/trash/list'),
      axiosInstance.get('/folders/trash/list'),
    ])

    const files = filesRes.data.data || []
    const folders = foldersRes.data.data || []

    await Promise.all([
      ...files.map((file: any) => axiosInstance.delete(`/files/${file._id}/permanent`)),
      ...folders.map((folder: any) => axiosInstance.delete(`/folders/${folder._id}/permanent`)),
    ])

    return { success: true }
  },

  // ============ STORAGE ============
  getStorageInfo: async () => {
    return axiosInstance.get('/storage/info')
  },
}