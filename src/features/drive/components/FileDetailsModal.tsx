import React, { useState } from 'react'
import {
  Download,
  Star,
  Share2,
  Trash2,
  Edit,
  Copy,
  Calendar,
  FileText,
  Image as ImageIcon,
  Film,
  Music,
  Archive,
  FileSpreadsheet,
  FileCode,
  X,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react'
import { FileItem } from '@/types/drive.types'
import { cn, formatBytes, formatDate } from '@/utils/helpers'
import { useDrive } from '@/hooks/useDrive'
import Modal from '@/components/ui/Modal'
import Button from '@/components/ui/Button'


interface FileDetailsModalProps {
  file: FileItem | null
  isOpen: boolean
  onClose: () => void
  onNext?: () => void
  onPrevious?: () => void
}

const FileDetailsModal: React.FC<FileDetailsModalProps> = ({
  file,
  isOpen,
  onClose,
  onNext,
  onPrevious,
}) => {
  const { downloadFile, deleteFile, starFile, shareFile } = useDrive()
  const [isLoading, setIsLoading] = useState(false)
  const [activeTab, setActiveTab] = useState<'details' | 'sharing'>('details')

  if (!file) return null

  const getFileIcon = () => {
    const mimeType = file.mimeType?.toLowerCase() || ''
    
    if (mimeType.startsWith('image/')) {
      return <ImageIcon className="h-12 w-12 text-blue-500" />
    }
    if (mimeType.includes('pdf')) {
      return <FileText className="h-12 w-12 text-red-500" />
    }
    if (mimeType.includes('spreadsheet') || mimeType.includes('excel')) {
      return <FileSpreadsheet className="h-12 w-12 text-green-500" />
    }
    if (mimeType.includes('video')) {
      return <Film className="h-12 w-12 text-purple-500" />
    }
    if (mimeType.includes('audio')) {
      return <Music className="h-12 w-12 text-yellow-500" />
    }
    if (mimeType.includes('zip') || mimeType.includes('compressed')) {
      return <Archive className="h-12 w-12 text-gray-500" />
    }
    if (mimeType.includes('text') || mimeType.includes('code')) {
      return <FileCode className="h-12 w-12 text-indigo-500" />
    }
    return <FileText className="h-12 w-12 text-gray-500" />
  }

  const handleDownload = async () => {
    setIsLoading(true)
    try {
      await downloadFile(file._id)
    } finally {
      setIsLoading(false)
    }
  }

  const handleDelete = async () => {
    if (window.confirm(`Are you sure you want to delete "${file.name}"?`)) {
      await deleteFile(file._id)
      onClose()
    }
  }

  const handleStar = async () => {
    await starFile(file._id)
  }

  const handleShare = async () => {
    const email = prompt('Enter email to share with:', '')
    if (email) {
      await shareFile(file._id, email, 'VIEW')
    }
  }

  const handleCopyLink = () => {
    // TODO: Generate and copy shareable link
    navigator.clipboard.writeText(`https://drivecloud.app/file/${file._id}`)
  }

  const fileType = file.mimeType?.split('/')[0] || 'file'
  const fileExtension = file.name.split('.').pop()?.toUpperCase() || 'FILE'

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title=""
      size="xl"
      showCloseButton={false}
    >
      {/* Header */}
      <div className="flex items-center justify-between border-b border-gray-200 px-6 py-4">
        <div className="flex items-center space-x-4">
          {onPrevious && (
            <Button
              variant="ghost"
              size="sm"
              onClick={onPrevious}
              className="h-8 w-8 p-0"
            >
              <ChevronLeft className="h-5 w-5" />
            </Button>
          )}
          
          <div className="flex items-center space-x-3">
            <div className="p-3 bg-gray-100 rounded-xl">
              {getFileIcon()}
            </div>
            <div>
              <h2 className="text-lg font-semibold text-gray-900">{file.name}</h2>
              <p className="text-sm text-gray-500">{formatBytes(file.size || 0)} • {fileExtension}</p>
            </div>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          {onNext && (
            <Button
              variant="ghost"
              size="sm"
              onClick={onNext}
              className="h-8 w-8 p-0"
            >
              <ChevronRight className="h-5 w-5" />
            </Button>
          )}
          
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="h-8 w-8 p-0"
          >
            <X className="h-5 w-5" />
          </Button>
        </div>
      </div>

      <div className="flex">
        {/* Sidebar */}
        <div className="w-64 border-r border-gray-200 p-6">
          <div className="space-y-2">
            <Button
              variant={activeTab === 'details' ? 'secondary' : 'ghost'}
              size="sm"
              fullWidth
              onClick={() => setActiveTab('details')}
              className="justify-start"
            >
              <FileText className="mr-3 h-4 w-4" />
              Details
            </Button>
            <Button
              variant={activeTab === 'sharing' ? 'secondary' : 'ghost'}
              size="sm"
              fullWidth
              onClick={() => setActiveTab('sharing')}
              className="justify-start"
            >
              <Share2 className="mr-3 h-4 w-4" />
              Sharing
            </Button>
          </div>

          <div className="mt-8 pt-6 border-t border-gray-200">
            <div className="space-y-2">
              <Button
                variant="ghost"
                size="sm"
                fullWidth
                onClick={handleDownload}
                loading={isLoading}
                disabled={isLoading}
                className="justify-start"
              >
                <Download className="mr-3 h-4 w-4" />
                Download
              </Button>
              <Button
                variant="ghost"
                size="sm"
                fullWidth
                onClick={handleStar}
                className="justify-start"
              >
                <Star className={cn(
                  "mr-3 h-4 w-4",
                  file.isStarred && "fill-yellow-500 text-yellow-500"
                )} />
                {file.isStarred ? 'Unstar' : 'Star'}
              </Button>
              <Button
                variant="ghost"
                size="sm"
                fullWidth
                onClick={handleShare}
                className="justify-start"
              >
                <Share2 className="mr-3 h-4 w-4" />
                Share
              </Button>
              <Button
                variant="ghost"
                size="sm"
                fullWidth
                onClick={handleCopyLink}
                className="justify-start"
              >
                <Copy className="mr-3 h-4 w-4" />
                Copy Link
              </Button>
              <Button
                variant="ghost"
                size="sm"
                fullWidth
                onClick={() => {/* TODO: Open rename */}}
                className="justify-start"
              >
                <Edit className="mr-3 h-4 w-4" />
                Rename
              </Button>
              <Button
                variant="ghost"
                size="sm"
                fullWidth
                onClick={handleDelete}
                className="justify-start text-red-600 hover:text-red-700 hover:bg-red-50"
              >
                <Trash2 className="mr-3 h-4 w-4" />
                Delete
              </Button>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 p-6">
          {activeTab === 'details' ? (
            <div className="space-y-6">
              {/* Preview */}
              {fileType === 'image' && file.url ? (
                <div className="bg-gray-100 rounded-2xl overflow-hidden mb-6">
                  <img
                    src={file.url}
                    alt={file.name}
                    className="w-full h-64 object-contain"
                  />
                </div>
              ) : (
                <div className="bg-gray-100 rounded-2xl h-64 flex items-center justify-center mb-6">
                  <div className="text-center">
                    {getFileIcon()}
                    <p className="mt-2 text-gray-600">Preview not available</p>
                  </div>
                </div>
              )}

              {/* File Info */}
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <h4 className="text-sm font-medium text-gray-500 mb-1">Type</h4>
                    <p className="text-gray-900">{file.mimeType || 'Unknown'}</p>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-gray-500 mb-1">Size</h4>
                    <p className="text-gray-900">{formatBytes(file.size || 0)}</p>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-gray-500 mb-1">Owner</h4>
                    <p className="text-gray-900">You</p>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <h4 className="text-sm font-medium text-gray-500 mb-1">Created</h4>
                    <div className="flex items-center space-x-2">
                      <Calendar className="h-4 w-4 text-gray-400" />
                      <p className="text-gray-900">{formatDate(file.createdAt)}</p>
                    </div>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-gray-500 mb-1">Modified</h4>
                    <div className="flex items-center space-x-2">
                      <Calendar className="h-4 w-4 text-gray-400" />
                      <p className="text-gray-900">{formatDate(file.updatedAt)}</p>
                    </div>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-gray-500 mb-1">Location</h4>
                    <p className="text-gray-900">My Drive</p>
                  </div>
                </div>
              </div>

              {/* Description (editable) */}
              <div>
                <h4 className="text-sm font-medium text-gray-500 mb-2">Description</h4>
                <div className="bg-gray-50 rounded-xl p-4">
                  <p className="text-gray-600">
                    {file.sharedWith?.length
                      ? `Shared with ${file.sharedWith.length} people`
                      : 'No description added'}
                  </p>
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              {/* Sharing settings */}
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-4">Share with others</h3>
                <div className="space-y-4">
                  {/* Add people */}
                  <div className="flex items-center space-x-3">
                    <input
                      type="email"
                      placeholder="Enter email addresses"
                      className="flex-1 rounded-xl border border-gray-300 px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    />
                    <select className="rounded-xl border border-gray-300 px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent">
                      <option value="VIEW">Can view</option>
                      <option value="EDIT">Can edit</option>
                    </select>
                    <Button variant="primary">
                      Share
                    </Button>
                  </div>

                  {/* Shared with list */}
                  <div className="space-y-3">
                    <h4 className="text-sm font-medium text-gray-500">People with access</h4>
                    <div className="space-y-2">
                      {/* Owner */}
                      <div className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
                        <div className="flex items-center space-x-3">
                          <div className="h-8 w-8 bg-primary-500 rounded-full flex items-center justify-center text-white text-sm font-medium">
                            Y
                          </div>
                          <div>
                            <p className="font-medium text-gray-900">You</p>
                            <p className="text-sm text-gray-500">Owner</p>
                          </div>
                        </div>
                        <span className="px-3 py-1 bg-gray-100 text-gray-700 text-sm rounded-full">
                          Owner
                        </span>
                      </div>

                      {/* Shared users */}
                      {file.sharedWith?.map((share, index) => (
                        <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
                          <div className="flex items-center space-x-3">
                            <div className="h-8 w-8 bg-gray-300 rounded-full flex items-center justify-center text-white text-sm font-medium">
                              {share.email[0].toUpperCase()}
                            </div>
                            <div>
                              <p className="font-medium text-gray-900">{share.email}</p>
                              <p className="text-sm text-gray-500">
                                {share.permission.toLowerCase()} access
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center space-x-2">
                            <select
                              className="text-sm rounded-lg border border-gray-300 px-3 py-1 focus:outline-none focus:ring-2 focus:ring-primary-500"
                              defaultValue={share.permission}
                            >
                              <option value="VIEW">Can view</option>
                              <option value="EDIT">Can edit</option>
                            </select>
                            <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                              <X className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Link sharing */}
              <div className="pt-6 border-t border-gray-200">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Get link</h3>
                <div className="space-y-3">
                  <div className="flex items-center space-x-3">
                    <input
                      type="text"
                      readOnly
                      value={`https://drivecloud.app/file/${file._id}`}
                      className="flex-1 rounded-xl border border-gray-300 bg-gray-50 px-4 py-2.5 text-gray-600"
                    />
                    <Button variant="outline" onClick={handleCopyLink}>
                      Copy
                    </Button>
                  </div>
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center space-x-2">
                      <input type="checkbox" id="link-access" className="rounded border-gray-300" />
                      <label htmlFor="link-access" className="text-sm text-gray-700">
                        Anyone with the link can view
                      </label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <input type="checkbox" id="link-edit" className="rounded border-gray-300" />
                      <label htmlFor="link-edit" className="text-sm text-gray-700">
                        Allow editing
                      </label>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </Modal>
  )
}

export default FileDetailsModal