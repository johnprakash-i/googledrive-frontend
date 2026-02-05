export const API_ENDPOINTS = {
  AUTH: {
    REGISTER: '/auth/register',
    LOGIN: '/auth/login',
    REFRESH: '/auth/refresh',
    FORGOT_PASSWORD: '/auth/forgot-password',
    RESET_PASSWORD: '/auth/reset-password',
  },
  USERS: {
    ME: '/users/me',
    UPDATE_PROFILE: '/users/me',
  },
  FOLDERS: {
    CREATE: '/folders',
    LIST: '/folders',
  },
  FILES: {
    UPLOAD: '/files/upload',
    LIST: '/files',
    DOWNLOAD: '/files/download',
    SHARE: '/files/:fileId/share',
    SHARED_WITH_ME: '/files/shared-with-me',
  },
} as const

export const FILE_ICONS: Record<string, string> = {
  'pdf': '📕',
  'doc': '📄',
  'docx': '📄',
  'txt': '📝',
  'jpg': '🖼️',
  'jpeg': '🖼️',
  'png': '🖼️',
  'mp4': '🎬',
  'mp3': '🎵',
  'zip': '📦',
  'rar': '📦',
  'folder': '📁',
}

export const MAX_FILE_SIZE = 100 * 1024 * 1024 // 100MB

export const ALLOWED_FILE_TYPES = [
  'image/*',
  'application/pdf',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  'text/plain',
  'video/mp4',
  'audio/mpeg',
  'application/zip',
  'application/x-rar-compressed',
]