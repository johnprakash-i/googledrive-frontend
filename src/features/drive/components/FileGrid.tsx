import  { memo } from 'react'
import { useDrive } from '@/hooks/useDrive'
import FileCard from './FileCard'
import FolderCard from './FolderCard'
import Spinner from '@/components/ui/Spinner'
import { FileItem, Folder } from '@/types/drive.types'
import { Folder as FolderIcon } from 'lucide-react'
interface FileGridProps {
  viewMode?: 'grid' | 'list'
  items?: {
    files?: FileItem[]
    folders?: Folder[]
  }
}

const FileGrid = memo(({ viewMode = 'grid', items }: FileGridProps) => {
  const { 

    selectedItems, 
    isLoading,
    getCurrentFolderContents 
  } = useDrive()

const {
  files: currentFiles = [],
  folders: currentFolders = [],
} = items ?? getCurrentFolderContents() ?? {}


  const renderEmptyState = () => (
    <div className="col-span-full py-16 text-center">
      <div className="mx-auto w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-6">
        <svg
          className="w-12 h-12 text-gray-400"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.5}
            d="M9 13h6m-3-3v6m-9 1V7a2 2 0 012-2h6l2 2h6a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2z"
          />
        </svg>
      </div>
      <h3 className="text-lg font-medium text-gray-900 mb-2">No files yet</h3>
      <p className="text-gray-500 mb-6">
        Upload your first file or create a new folder to get started
      </p>
    </div>
  )

  const renderGrid = () => (
    <div className={`
      grid gap-4
      ${viewMode === 'grid' ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5' : 'grid-cols-1'}
    `}>
      {/* Folders */}
      {currentFolders.map((folder) => (
        <FolderCard
          key={folder._id}
          folder={folder}
          isSelected={selectedItems.includes(folder._id)}
        />
      ))}

      {/* Files */}
      {currentFiles.map((file) => (
        <FileCard
          key={file._id}
          file={file}
          isSelected={selectedItems.includes(file._id)}
        />
      ))}
    </div>
  )

  const renderList = () => (
    <div className="space-y-2">
      {/* Table header */}
      <div className="grid grid-cols-12 gap-4 px-4 py-3 bg-gray-50 rounded-xl text-sm font-medium text-gray-500">
        <div className="col-span-6">Name</div>
        <div className="col-span-2">Size</div>
        <div className="col-span-2">Type</div>
        <div className="col-span-2">Modified</div>
      </div>

      {/* Folders */}
      {currentFolders.map((folder) => (
        <div
          key={folder._id}
          className={`
            grid grid-cols-12 gap-4 px-4 py-3 rounded-xl hover:bg-gray-50 cursor-pointer
            ${selectedItems.includes(folder._id) ? 'bg-primary-50 ring-1 ring-primary-500' : ''}
          `}
          onClick={() => {/* TODO: Handle list view click */}}
        >
          <div className="col-span-6 flex items-center space-x-3">
            <FolderIcon className="h-5 w-5 text-primary-500" />
            <span className="font-medium text-gray-900">{folder.name}</span>
          </div>
          <div className="col-span-2 text-gray-500">
            {folder.fileCount ? `${folder.fileCount} items` : 'Empty'}
          </div>
          <div className="col-span-2 text-gray-500">Folder</div>
          <div className="col-span-2 text-gray-500">
            {new Date(folder.updatedAt).toLocaleDateString()}
          </div>
        </div>
      ))}

      {/* Files */}
      {currentFiles.map((file) => (
        <div
          key={file._id}
          className={`
            grid grid-cols-12 gap-4 px-4 py-3 rounded-xl hover:bg-gray-50 cursor-pointer
            ${selectedItems.includes(file._id) ? 'bg-primary-50 ring-1 ring-primary-500' : ''}
          `}
          onClick={() => {/* TODO: Handle list view click */}}
        >
          <div className="col-span-6 flex items-center space-x-3">
            <div className="h-5 w-5 text-gray-500">
              {/* TODO: File type icon */}
            </div>
            <span className="font-medium text-gray-900">{file.name}</span>
            {file.isStarred && (
              <span className="text-yellow-500">★</span>
            )}
          </div>
          <div className="col-span-2 text-gray-500">
            {file.size ? `${(file.size / 1024 / 1024).toFixed(2)} MB` : '-'}
          </div>
          <div className="col-span-2 text-gray-500">
            {file.mimeType?.split('/')[1]?.toUpperCase() || 'File'}
          </div>
          <div className="col-span-2 text-gray-500">
            {new Date(file.updatedAt).toLocaleDateString()}
          </div>
        </div>
      ))}
    </div>
  )

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-16">
        <Spinner size="lg" />
      </div>
    )
  }

  if (currentFiles.length === 0 && currentFolders.length === 0) {
    return renderEmptyState()
  }

  return viewMode === 'grid' ? renderGrid() : renderList()
})

FileGrid.displayName = 'FileGrid'

export default FileGrid