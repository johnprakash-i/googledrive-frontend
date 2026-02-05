import { axiosInstance } from '@/utils/axiosInstance'
import { API_ENDPOINTS } from '@/utils/constants'

export const driveApi = {
  // Files
  getFiles: async (folderId?: string | null, search?: string) => {
    const params = new URLSearchParams()
    if (folderId) params.append('folderId', folderId)
    if (search) params.append('search', search)
    
    return axiosInstance.get(`${API_ENDPOINTS.FILES.LIST}?${params.toString()}`)
  },

  uploadFile: async (file: File, folderId?: string | null) => {
    const formData = new FormData()
    formData.append('file', file)
    if (folderId) {
      formData.append('folderId', folderId)
    }
    
    return axiosInstance.post(API_ENDPOINTS.FILES.UPLOAD, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })
  },

  downloadFile: async (fileId: string) => {
    return axiosInstance.get(`${API_ENDPOINTS.FILES.DOWNLOAD}/${fileId}`)
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
    return axiosInstance.post(`${API_ENDPOINTS.FILES.SHARE.replace(':fileId', fileId)}`, {
      email,
      permission,
    })
  },

  getSharedFiles: async () => {
    return axiosInstance.get(API_ENDPOINTS.FILES.SHARED_WITH_ME)
  },

  // Folders
  getFolders: async (parentId?: string | null) => {
    const params = new URLSearchParams()
    if (parentId) params.append('parentId', parentId)
    
    return axiosInstance.get(`${API_ENDPOINTS.FOLDERS.LIST}?${params.toString()}`)
  },

  createFolder: async (name: string, parentId?: string | null) => {
    return axiosInstance.post(API_ENDPOINTS.FOLDERS.CREATE, {
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

  // Recent files
  getRecentFiles: async () => {
    return axiosInstance.get('/files/recent')
  },

  // Trash
  getTrash: async () => {
    return axiosInstance.get('/trash')
  },

  restoreFromTrash: async (itemId: string, type: 'file' | 'folder') => {
    return axiosInstance.post(`/trash/restore/${itemId}`, { type })
  },

  emptyTrash: async () => {
    return axiosInstance.delete('/trash')
  },
}