import React, { useState, useEffect } from 'react'
import { Trash2, RotateCcw, Delete, Filter, Calendar, Folder, File } from 'lucide-react'
import AppLayout from '@/components/layout/AppLayout'
import Button from '@/components/ui/Button'
import Spinner from '@/components/ui/Spinner'
import { Card } from '@/components/ui/Card'
import ConfirmationModal from '@/components/ui/ConfirmationModal'
import { formatDate, formatBytes } from '@/utils/helpers'

type TrashItemType = 'file' | 'folder'

interface TrashItem {
  _id: string
  name: string
  type: TrashItemType
  size?: number
  mimeType?: string
  parentId?: string | null
  fileCount?: number
  updatedAt: string
  createdAt: string
}

// Mock data
const MOCK_FILES = [
  {
    _id: '1',
    name: 'Project_Report.pdf',
    type: 'file' as TrashItemType,
    size: 1024 * 1024 * 2.5, // 2.5 MB
    mimeType: 'application/pdf',
    updatedAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
    createdAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    _id: '2',
    name: 'Vacation_Photos.zip',
    type: 'file' as TrashItemType,
    size: 1024 * 1024 * 15, // 15 MB
    mimeType: 'application/zip',
    updatedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    createdAt: new Date(Date.now() - 45 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    _id: '3',
    name: 'Meeting_Notes.docx',
    type: 'file' as TrashItemType,
    size: 1024 * 512, // 512 KB
    mimeType: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    updatedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    createdAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
  },
]

const MOCK_FOLDERS = [
  {
    _id: '4',
    name: 'Old Projects',
    type: 'folder' as TrashItemType,
    fileCount: 8,
    updatedAt: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString(),
    createdAt: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    _id: '5',
    name: 'Archived Documents',
    type: 'folder' as TrashItemType,
    fileCount: 12,
    updatedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    createdAt: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000).toISOString(),
  },
]

const Trash: React.FC = () => {
  // Using local state instead of useDrive hook
  const [files, setFiles] = useState<TrashItem[]>(MOCK_FILES)
  const [folders, setFolders] = useState<TrashItem[]>(MOCK_FOLDERS)
  const [isLoading, setIsLoading] = useState(false)
  
  const [selectedItems, setSelectedItems] = useState<string[]>([])
  const [filter, setFilter] = useState<'all' | 'files' | 'folders'>('all')
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  const [showEmptyConfirm, setShowEmptyConfirm] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)

  // Mock the API calls
  const fetchTrash = () => {
    setIsLoading(true)
    // Simulate API delay
    setTimeout(() => {
      setFiles(MOCK_FILES)
      setFolders(MOCK_FOLDERS)
      setIsLoading(false)
    }, 500)
  }

  const restoreFile = async (id: string) => {
    return new Promise(resolve => {
      setTimeout(() => {
        setFiles(prev => prev.filter(file => file._id !== id))
        resolve(true)
      }, 300)
    })
  }

  const restoreFolder = async (id: string) => {
    return new Promise(resolve => {
      setTimeout(() => {
        setFolders(prev => prev.filter(folder => folder._id !== id))
        resolve(true)
      }, 300)
    })
  }

  const permanentlyDeleteFile = async (id: string) => {
    return new Promise(resolve => {
      setTimeout(() => {
        setFiles(prev => prev.filter(file => file._id !== id))
        resolve(true)
      }, 300)
    })
  }

  const permanentlyDeleteFolder = async (id: string) => {
    return new Promise(resolve => {
      setTimeout(() => {
        setFolders(prev => prev.filter(folder => folder._id !== id))
        resolve(true)
      }, 300)
    })
  }

  const emptyTrash = async () => {
    return new Promise(resolve => {
      setTimeout(() => {
        setFiles([])
        setFolders([])
        resolve(true)
      }, 500)
    })
  }

  // Load trash items on mount
  useEffect(() => {
    fetchTrash()
  }, [])

  // Combine files and folders into trash items
  const trashItems: TrashItem[] = [
    ...files,
    ...folders,
  ]

  const filteredItems = trashItems.filter(item =>
    filter === 'all' || item.type === filter.slice(0, -1)
  )

  const totalSize = files.reduce((acc, file) => acc + (file.size || 0), 0)

  const handleSelect = (id: string) => {
    setSelectedItems(prev =>
      prev.includes(id)
        ? prev.filter(itemId => itemId !== id)
        : [...prev, id]
    )
  }

  const handleSelectAll = () => {
    if (selectedItems.length === filteredItems.length) {
      setSelectedItems([])
    } else {
      setSelectedItems(filteredItems.map(item => item._id))
    }
  }

  const handleRestore = async () => {
    if (selectedItems.length === 0) return

    setIsDeleting(true)
    try {
      for (const itemId of selectedItems) {
        const item = trashItems.find(i => i._id === itemId)
        if (!item) continue

        if (item.type === 'file') {
          await restoreFile(itemId)
        } else {
          await restoreFolder(itemId)
        }
      }
      setSelectedItems([])
    } catch (error) {
      console.error('Failed to restore items:', error)
    } finally {
      setIsDeleting(false)
    }
  }

  const handleDeletePermanently = async () => {
    if (selectedItems.length === 0) return

    setShowDeleteConfirm(true)
  }

  const confirmPermanentDelete = async () => {
    setIsDeleting(true)
    setShowDeleteConfirm(false)

    try {
      for (const itemId of selectedItems) {
        const item = trashItems.find(i => i._id === itemId)
        if (!item) continue

        if (item.type === 'file') {
          await permanentlyDeleteFile(itemId)
        } else {
          await permanentlyDeleteFolder(itemId)
        }
      }
      setSelectedItems([])
    } catch (error) {
      console.error('Failed to delete items:', error)
    } finally {
      setIsDeleting(false)
    }
  }

  const handleEmptyTrash = () => {
    if (trashItems.length === 0) return
    setShowEmptyConfirm(true)
  }

  const confirmEmptyTrash = async () => {
    setIsDeleting(true)
    setShowEmptyConfirm(false)

    try {
      await emptyTrash()
      setSelectedItems([])
    } catch (error) {
      console.error('Failed to empty trash:', error)
    } finally {
      setIsDeleting(false)
    }
  }

  return (
    <AppLayout>
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
            <div className="flex items-center space-x-3">
              <div className="p-3 bg-red-100 rounded-xl">
                <Trash2 className="h-6 w-6 text-red-600" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Trash</h1>
                <p className="text-gray-600">Deleted files and folders</p>
              </div>
            </div>

            <div className="flex items-center space-x-3">
              {/* Filter buttons */}
              <div className="flex items-center bg-gray-100 rounded-xl p-1">
                {(['all', 'files', 'folders'] as const).map((typeFilter) => (
                  <button
                    key={typeFilter}
                    onClick={() => setFilter(typeFilter)}
                    className={`
                      px-4 py-1.5 rounded-lg text-sm font-medium transition-all duration-200 capitalize
                      ${filter === typeFilter
                        ? 'bg-white text-primary-700 shadow-soft'
                        : 'text-gray-600 hover:text-gray-900'
                      }
                    `}
                  >
                    {typeFilter}
                  </button>
                ))}
              </div>

              {/* Empty trash button */}
              <Button
                variant="danger"
                icon={<Delete size={18} />}
                onClick={handleEmptyTrash}
                disabled={trashItems.length === 0 || isDeleting}
                loading={isDeleting && showEmptyConfirm}
              >
                Empty Trash
              </Button>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="bg-white p-4 rounded-2xl border border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">Items in Trash</p>
                  <p className="text-2xl font-bold text-gray-900">{trashItems.length}</p>
                </div>
                <div className="p-2 bg-red-100 rounded-xl">
                  <Trash2 className="h-6 w-6 text-red-500" />
                </div>
              </div>
            </div>
            <div className="bg-white p-4 rounded-2xl border border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">Total Size</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {formatBytes(totalSize)}
                  </p>
                </div>
                <div className="p-2 bg-blue-100 rounded-xl">
                  <Calendar className="h-6 w-6 text-blue-500" />
                </div>
              </div>
            </div>
            <div className="bg-white p-4 rounded-2xl border border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">Auto-deletes in</p>
                  <p className="text-2xl font-bold text-gray-900">30 days</p>
                </div>
                <div className="p-2 bg-yellow-100 rounded-xl">
                  <Filter className="h-6 w-6 text-yellow-500" />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Selection actions */}
        {selectedItems.length > 0 && (
          <div className="mb-6 p-4 bg-white rounded-2xl border border-gray-200 flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <span className="text-sm text-gray-600">
                {selectedItems.length} selected
              </span>
              <Button
                variant="outline"
                size="sm"
                icon={<RotateCcw size={16} />}
                onClick={handleRestore}
                disabled={isDeleting}
                loading={isDeleting && !showDeleteConfirm && !showEmptyConfirm}
              >
                Restore
              </Button>
              <Button
                variant="danger"
                size="sm"
                icon={<Delete size={16} />}
                onClick={handleDeletePermanently}
                disabled={isDeleting}
              >
                Delete Permanently
              </Button>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setSelectedItems([])}
            >
              Clear Selection
            </Button>
          </div>
        )}

        {/* Content */}
        {isLoading ? (
          <div className="flex items-center justify-center py-16">
            <Spinner size="lg" />
          </div>
        ) : trashItems.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-2xl border border-gray-200">
            <div className="mx-auto w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-6">
              <Trash2 className="h-12 w-12 text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Trash is empty
            </h3>
            <p className="text-gray-500 mb-6">
              Items you delete will appear here
            </p>
            <Button variant="primary" onClick={() => window.location.href = '/'}>
              Go to My Drive
            </Button>
          </div>
        ) : (
          <div className="space-y-3">
            {/* Table header */}
            <div className="grid grid-cols-12 gap-4 px-4 py-3 bg-gray-50 rounded-xl text-sm font-medium text-gray-500">
              <div className="col-span-1">
                <input
                  type="checkbox"
                  checked={selectedItems.length === filteredItems.length && filteredItems.length > 0}
                  onChange={handleSelectAll}
                  className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                />
              </div>
              <div className="col-span-5">Name</div>
              <div className="col-span-2">Type</div>
              <div className="col-span-2">Size</div>
              <div className="col-span-2">Deleted</div>
            </div>

            {/* Items */}
            {filteredItems.map((item) => (
              <Card
                key={item._id}
                hoverable
                className={`
                  grid grid-cols-12 gap-4 p-4 items-center cursor-pointer
                  ${selectedItems.includes(item._id) ? 'ring-2 ring-primary-500 bg-primary-50' : ''}
                `}
                onClick={() => handleSelect(item._id)}
              >
                <div className="col-span-1">
                  <input
                    type="checkbox"
                    checked={selectedItems.includes(item._id)}
                    onChange={() => handleSelect(item._id)}
                    className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                    onClick={(e) => e.stopPropagation()}
                  />
                </div>
                <div className="col-span-5 flex items-center space-x-3">
                  <div className={`p-2 rounded-lg ${item.type === 'file' ? 'bg-blue-100' : 'bg-yellow-100'}`}>
                    {item.type === 'file' ? (
                      <File className="h-5 w-5 text-blue-600" />
                    ) : (
                      <Folder className="h-5 w-5 text-yellow-600" />
                    )}
                  </div>
                  <div>
                    <p className="font-medium text-gray-900 truncate">{item.name}</p>
                    {item.type === 'file' && item.mimeType && (
                      <p className="text-xs text-gray-500">{item.mimeType}</p>
                    )}
                  </div>
                </div>
                <div className="col-span-2 text-gray-600 text-sm capitalize">
                  {item.type}
                </div>
                <div className="col-span-2 text-gray-600 text-sm">
                  {item.type === 'file' && item.size 
                    ? formatBytes(item.size)
                    : item.type === 'folder' && item.fileCount
                    ? `${item.fileCount} items`
                    : '-'
                  }
                </div>
                <div className="col-span-2 text-gray-600 text-sm">
                  {formatDate(item.updatedAt)}
                </div>
              </Card>
            ))}
          </div>
        )}

        {/* Info notice */}
        <div className="mt-6 p-4 bg-blue-50 rounded-2xl border border-blue-200">
          <div className="flex items-start space-x-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Calendar className="h-5 w-5 text-blue-600" />
            </div>
            <div>
              <h4 className="text-sm font-medium text-blue-900 mb-1">
                Automatic cleanup
              </h4>
              <p className="text-sm text-blue-700">
                Items in trash are automatically deleted after 30 days. Empty the trash manually to free up storage immediately.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Permanent Delete Confirmation */}
      <ConfirmationModal
        isOpen={showDeleteConfirm}
        onClose={() => setShowDeleteConfirm(false)}
        onConfirm={confirmPermanentDelete}
        title="Permanently Delete Items"
        message={`Are you sure you want to permanently delete ${selectedItems.length} item${selectedItems.length > 1 ? 's' : ''}? This action cannot be undone.`}
        type="delete"
        confirmText="Delete Permanently"
        cancelText="Cancel"
        isLoading={isDeleting}
      />

      {/* Empty Trash Confirmation */}
      <ConfirmationModal
        isOpen={showEmptyConfirm}
        onClose={() => setShowEmptyConfirm(false)}
        onConfirm={confirmEmptyTrash}
        title="Empty Trash"
        message={`Are you sure you want to permanently delete all ${trashItems.length} items in trash? This action cannot be undone.`}
        type="delete"
        confirmText="Empty Trash"
        cancelText="Cancel"
        isLoading={isDeleting}
      />
    </AppLayout>
  )
}

export default Trash