export interface FileItem {
  _id: string;
  name: string;
  type: "file" | "folder";
  size?: number;
  mimeType?: string;
  url?: string;
  parentId: string | null;
  userId: string;
  sharedWith?: SharedPermission[];
  isStarred?: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface SharedPermission {
  userId: string;
  email: string;
  permission: "VIEW" | "EDIT";
  sharedAt: string;
}

export interface Folder {
  _id: string;
  name: string;
  sharedWith?: SharedPermission[];
  parentId: string | null;
  userId: string;
  fileCount?: number;
  isStarred?: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface UploadProgress {
  file: File;
  progress: number;
  uploaded: number;
  total: number;
  isComplete: boolean;
  error?: string;
}

export interface DriveState {
  files: FileItem[];
  folders: Folder[];
  currentPath: string[];
  selectedItems: string[];
  isLoading: boolean;
  searchQuery: string;
}
