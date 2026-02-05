import React, { useState } from 'react'
import { 
  Folder, 
  File, 
  Upload, 
  Grid, 
  List,

  Filter,
  Download,
  Trash2,
  Share2,

} from 'lucide-react'
import AppLayout from '@/components/layout/AppLayout'
import { useDrive } from '@/hooks/useDrive'
import { useAuth } from '@/hooks/useAuth'
import FileGrid from '../components/FileGrid'
import Breadcrumbs from '../components/Breadcrumbs'
import UploadDropzone from '../components/UploadDropzone'
import CreateFolderModal from '../components/CreateFolderModal'
import Button from '@/components/ui/Button'
import Spinner from '@/components/ui/Spinner'

const Dashboard: React.FC = () => {
  const { 
    files, 
    folders, 
    selectedItems, 
    isLoading,
    getCurrentFolderContents,
    clearSelection,
    deleteFile,
    deleteFolder,
    downloadFile,
    fetchSharedFiles,
    fetchFiles,
    fetchFolders,
    currentPath
  } = useDrive()
  
  const { user } = useAuth()
  
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [showUploadModal, setShowUploadModal] = useState(false)
  const [showCreateFolder, setShowCreateFolder] = useState(false)
  const [activeView, setActiveView] = useState<'all' | 'recent' | 'starred' | 'shared'>('all')

  const { files: currentFiles, folders: currentFolders } = getCurrentFolderContents()
console.log('Current Path:', currentPath)
console.log('Folders:', folders)
console.log('Last folder in path:', currentPath[currentPath.length - 1])
  const handleDeleteSelected = async () => {
    if (selectedItems.length === 0) return

    const confirmed = window.confirm(
      `Are you sure you want to delete ${selectedItems.length} selected item${selectedItems.length > 1 ? 's' : ''}?`
    )

    if (!confirmed) return

    try {
      // Delete all selected items
      for (const itemId of selectedItems) {
        // Determine if it's a file or folder
        const isFile = files.some(f => f._id === itemId)
        const isFolder = folders.some(f => f._id === itemId)

        if (isFile) {
          await deleteFile(itemId)
        } else if (isFolder) {
          await deleteFolder(itemId)
        }
      }

      clearSelection()
    } catch (error) {
      console.error('Failed to delete items:', error)
    }
  }

  const handleDownloadSelected = async () => {
    if (selectedItems.length === 0) return

    // Only download files (not folders)
    const selectedFiles = files.filter(file => selectedItems.includes(file._id))
    
    for (const file of selectedFiles) {
      await downloadFile(file._id)
    }
  }

  const handleViewChange = (view: 'all' | 'recent' | 'starred' | 'shared') => {
    setActiveView(view)
    clearSelection()

    switch (view) {
      case 'shared':
        fetchSharedFiles()
        break
      case 'starred':
        // Filter starred files (this would come from API in real app)
        break
      case 'recent':
        // Filter recent files (this would come from API in real app)
        break
      default:
        fetchFiles()
        fetchFolders()
    }
  }

  const storageUsage = 0.65 // This would come from API
  const storageUsedGB = 6.5 // This would come from API
  const storageTotalGB = 10 // This would come from API

  if (isLoading && files.length === 0 && folders.length === 0) {
    return (
      <AppLayout>
        <div className="flex items-center justify-center h-full">
          <div className="text-center">
            <Spinner size="xl" />
            <p className="mt-4 text-gray-600">Loading your files...</p>
          </div>
        </div>
      </AppLayout>
    )
  }

  return (
    <AppLayout>
      {/* Header */}
      <div className="mb-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">My Drive</h1>
            <p className="text-gray-600">
              Welcome back, {user?.firstName}!
            </p>
          </div>
          
          <div className="flex items-center space-x-3">
            <Button
              variant="outline"
              size="md"
              icon={<Folder />}
              onClick={() => setShowCreateFolder(true)}
            >
              New Folder
            </Button>
            <Button
              variant="primary"
              size="md"
              icon={<Upload />}
              onClick={() => setShowUploadModal(true)}
            >
              Upload
            </Button>
          </div>
        </div>

        {/* Breadcrumbs */}
        <div className="mb-6">
          <Breadcrumbs />
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-white p-4 rounded-2xl border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Total Files</p>
                <p className="text-2xl font-bold text-gray-900">{files.length}</p>
              </div>
              <div className="p-2 bg-blue-100 rounded-xl">
                <File className="h-6 w-6 text-blue-500" />
              </div>
            </div>
          </div>

          <div className="bg-white p-4 rounded-2xl border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Total Folders</p>
                <p className="text-2xl font-bold text-gray-900">{folders.length}</p>
              </div>
              <div className="p-2 bg-green-100 rounded-xl">
                <Folder className="h-6 w-6 text-green-500" />
              </div>
            </div>
          </div>

          <div className="bg-white p-4 rounded-2xl border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Storage Used</p>
                <p className="text-2xl font-bold text-gray-900">
                  {storageUsedGB} GB / {storageTotalGB} GB
                </p>
              </div>
              <div className="p-2 bg-purple-100 rounded-xl">
                <svg className="h-6 w-6 text-purple-500" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M22 12.999V20a2 2 0 01-2 2H4a2 2 0 01-2-2v-7.001h9.062a1.001 1.001 0 00.781-.375l2.937-3.744h5.22v5.119H22zm0-9v5.118h-5.22l-2.937-3.744a1 1 0 00-.781-.374H2.001V4a2 2 0 012-2h16a2 2 0 012 2v.001z" />
                </svg>
              </div>
            </div>
          </div>

          <div className="bg-white p-4 rounded-2xl border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Shared Files</p>
                <p className="text-2xl font-bold text-gray-900">
                  {files.filter(f => f.sharedWith && f.sharedWith.length > 0).length}
                </p>
              </div>
              <div className="p-2 bg-yellow-100 rounded-xl">
                <Share2 className="h-6 w-6 text-yellow-500" />
              </div>
            </div>
          </div>
        </div>

        {/* Storage progress bar */}
        <div className="mb-6">
          <div className="flex items-center justify-between text-sm mb-2">
            <span className="font-medium text-gray-700">Storage Usage</span>
            <span className="text-gray-500">{Math.round(storageUsage * 100)}% used</span>
          </div>
          <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-primary-400 to-primary-600 transition-all duration-300"
              style={{ width: `${storageUsage * 100}%` }}
            />
          </div>
        </div>
      </div>

      {/* Toolbar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6 p-4 bg-white rounded-2xl border border-gray-200">
        <div className="flex items-center space-x-4">
          {/* View tabs */}
          <div className="flex items-center space-x-1 bg-gray-100 p-1 rounded-xl">
            <button
              onClick={() => handleViewChange('all')}
              className={`
                px-4 py-1.5 rounded-lg text-sm font-medium transition-all duration-200
                ${activeView === 'all'
                  ? 'bg-white text-primary-700 shadow-soft'
                  : 'text-gray-600 hover:text-gray-900'
                }
              `}
            >
              All Files
            </button>
            <button
              onClick={() => handleViewChange('recent')}
              className={`
                px-4 py-1.5 rounded-lg text-sm font-medium transition-all duration-200
                ${activeView === 'recent'
                  ? 'bg-white text-primary-700 shadow-soft'
                  : 'text-gray-600 hover:text-gray-900'
                }
              `}
            >
              Recent
            </button>
            <button
              onClick={() => handleViewChange('starred')}
              className={`
                px-4 py-1.5 rounded-lg text-sm font-medium transition-all duration-200
                ${activeView === 'starred'
                  ? 'bg-white text-primary-700 shadow-soft'
                  : 'text-gray-600 hover:text-gray-900'
                }
              `}
            >
              Starred
            </button>
            <button
              onClick={() => handleViewChange('shared')}
              className={`
                px-4 py-1.5 rounded-lg text-sm font-medium transition-all duration-200
                ${activeView === 'shared'
                  ? 'bg-white text-primary-700 shadow-soft'
                  : 'text-gray-600 hover:text-gray-900'
                }
              `}
            >
              Shared
            </button>
          </div>

          {/* Selection actions */}
          {selectedItems.length > 0 && (
            <div className="flex items-center space-x-2">
              <span className="text-sm text-gray-600">
                {selectedItems.length} selected
              </span>
              <Button
                variant="outline"
                size="sm"
                icon={<Download size={16} />}
                onClick={handleDownloadSelected}
              >
                Download
              </Button>
              <Button
                variant="outline"
                size="sm"
                icon={<Trash2 size={16} />}
                onClick={handleDeleteSelected}
              >
                Delete
              </Button>
              <Button
                variant="outline"
                size="sm"
                icon={<Share2 size={16} />}
                onClick={() => {/* TODO: Share selected */}}
              >
                Share
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={clearSelection}
              >
                Clear
              </Button>
            </div>
          )}
        </div>

        {/* View toggle and filters */}
        <div className="flex items-center space-x-3">
          <div className="flex items-center bg-gray-100 rounded-xl p-1">
            <button
              onClick={() => setViewMode('grid')}
              className={`
                px-3 py-1.5 rounded-lg text-sm font-medium transition-all duration-200
                ${viewMode === 'grid'
                  ? 'bg-white text-primary-700 shadow-soft'
                  : 'text-gray-600 hover:text-gray-900'
                }
              `}
              aria-label="Grid view"
            >
              <Grid className="h-4 w-4" />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`
                px-3 py-1.5 rounded-lg text-sm font-medium transition-all duration-200
                ${viewMode === 'list'
                  ? 'bg-white text-primary-700 shadow-soft'
                  : 'text-gray-600 hover:text-gray-900'
                }
              `}
              aria-label="List view"
            >
              <List className="h-4 w-4" />
            </button>
          </div>

          <button
            className="p-2 rounded-lg hover:bg-gray-100"
            aria-label="Filter"
          >
            <Filter className="h-5 w-5 text-gray-600" />
          </button>
        </div>
      </div>

      {/* File Grid */}
      <FileGrid viewMode={viewMode} />

      {/* Empty state */}
      {currentFiles.length === 0 && currentFolders.length === 0 && !isLoading && (
        <div className="text-center py-16 bg-white rounded-2xl border border-gray-200">
          <div className="mx-auto w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-6">
            <Folder className="h-12 w-12 text-gray-400" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            This folder is empty
          </h3>
          <p className="text-gray-500 mb-6 max-w-md mx-auto">
            Upload files or create folders to organize your content.
          </p>
          <div className="flex items-center justify-center space-x-3">
            <Button
              variant="outline"
              icon={<Folder />}
              onClick={() => setShowCreateFolder(true)}
            >
              New Folder
            </Button>
            <Button
              variant="primary"
              icon={<Upload />}
              onClick={() => setShowUploadModal(true)}
            >
              Upload Files
            </Button>
          </div>
        </div>
      )}

      {/* Modals */}
      <UploadDropzone
        isOpen={showUploadModal}
        onClose={() => setShowUploadModal(false)}
      />

      <CreateFolderModal
        isOpen={showCreateFolder}
        onClose={() => setShowCreateFolder(false)}
      />
    </AppLayout>
  )
}

export default Dashboard