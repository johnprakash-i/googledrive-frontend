import React, { memo, useState } from 'react'
import {
  MoreVertical,
  Download,
  Star,
  Trash2,
  Share2,
  Edit,
  Eye,
  File as FileIcon,
  Image as ImageIcon,
  FileText,
  Film,
  Music,
  Archive,
  FileSpreadsheet,
  FileCode,
} from 'lucide-react'
import { FileItem } from '@/types/drive.types'
import { cn, formatBytes, formatDate} from '@/utils/helpers'
import { useDrive } from '@/hooks/useDrive'
import Button from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'

interface FileCardProps {
  file: FileItem
  isSelected?: boolean
  onSelect?: (id: string) => void
}

const FileCard = memo(({ file, isSelected = false }: FileCardProps) => {
  const { downloadFile, deleteFile, starFile, selectItem, deselectItem } = useDrive()
  const [showActions, setShowActions] = useState(false)
  const [_isHovered, setIsHovered] = useState(false)

  const getFileIconComponent = (_type?: string, mimeType?: string) => {
    if (mimeType?.startsWith('image/')) {
      return <ImageIcon className="h-6 w-6 text-blue-500" />
    }
    if (mimeType?.includes('pdf')) {
      return <FileText className="h-6 w-6 text-red-500" />
    }
    if (mimeType?.includes('spreadsheet') || mimeType?.includes('excel')) {
      return <FileSpreadsheet className="h-6 w-6 text-green-500" />
    }
    if (mimeType?.includes('video')) {
      return <Film className="h-6 w-6 text-purple-500" />
    }
    if (mimeType?.includes('audio')) {
      return <Music className="h-6 w-6 text-yellow-500" />
    }
    if (mimeType?.includes('zip') || mimeType?.includes('compressed')) {
      return <Archive className="h-6 w-6 text-gray-500" />
    }
    if (mimeType?.includes('text') || mimeType?.includes('code')) {
      return <FileCode className="h-6 w-6 text-indigo-500" />
    }
    return <FileIcon className="h-6 w-6 text-gray-500" />
  }

  const handleClick = (e: React.MouseEvent) => {
    if (e.ctrlKey || e.metaKey) {
      // Multi-select with Ctrl/Cmd
      if (isSelected) {
        deselectItem(file._id)
      } else {
        selectItem(file._id)
      }
    } else if (e.shiftKey) {
      // Range select with Shift (TODO: Implement range selection)
    } else {
      // Single select
      if (!isSelected) {
        selectItem(file._id)
      }
    }
  }

  const handleDownload = async (e: React.MouseEvent) => {
    e.stopPropagation()
    await downloadFile(file._id)
  }

  const handleDelete = async (e: React.MouseEvent) => {
    e.stopPropagation()
    if (window.confirm(`Are you sure you want to delete "${file.name}"?`)) {
      await deleteFile(file._id)
    }
  }

  const handleStar = async (e: React.MouseEvent) => {
    e.stopPropagation()
    await starFile(file._id)
  }

  const handleShare = async (e: React.MouseEvent) => {
    e.stopPropagation()
    // TODO: Open share modal
  }

  const handleRename = async (e: React.MouseEvent) => {
    e.stopPropagation()
    const newName = prompt('Enter new name:', file.name)
    if (newName && newName !== file.name) {
      // TODO: Implement rename
    }
  }

  return (
    <Card
      hoverable
      variant="elevated"
      className={cn(
        'relative p-4 transition-all duration-200',
        isSelected && 'ring-2 ring-primary-500 bg-primary-50',
        'group'
      )}
      onClick={handleClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Selection indicator */}
      {isSelected && (
        <div className="absolute -top-2 -right-2 z-10">
          <div className="h-5 w-5 bg-primary-500 rounded-full flex items-center justify-center">
            <div className="h-2 w-2 bg-white rounded-full" />
          </div>
        </div>
      )}

      {/* File icon */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center space-x-3">
          <div className="p-3 bg-gray-100 rounded-xl">
            {getFileIconComponent(file.type, file.mimeType)}
          </div>
          {file.isStarred && (
            <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
          )}
        </div>

        {/* Actions dropdown */}
        <div className="relative">
          <Button
            variant="ghost"
            size="sm"
            className={cn(
              'opacity-0 group-hover:opacity-100 transition-opacity',
              showActions && 'opacity-100'
            )}
            onClick={(e) => {
              e.stopPropagation()
              setShowActions(!showActions)
            }}
          >
            <MoreVertical className="h-4 w-4" />
          </Button>

          {showActions && (
            <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-hard border border-gray-200 z-50 animate-slide-in">
              <div className="py-1">
                <button
                  className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  onClick={handleDownload}
                >
                  <Download className="mr-3 h-4 w-4" />
                  Download
                </button>
                <button
                  className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  onClick={handleStar}
                >
                  <Star className="mr-3 h-4 w-4" />
                  {file.isStarred ? 'Unstar' : 'Star'}
                </button>
                <button
                  className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  onClick={handleRename}
                >
                  <Edit className="mr-3 h-4 w-4" />
                  Rename
                </button>
                <button
                  className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  onClick={handleShare}
                >
                  <Share2 className="mr-3 h-4 w-4" />
                  Share
                </button>
                <button
                  className="flex items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                  onClick={handleDelete}
                >
                  <Trash2 className="mr-3 h-4 w-4" />
                  Delete
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* File info */}
      <div>
        <h4 className="font-medium text-gray-900 truncate mb-1">{file.name}</h4>
        <div className="flex items-center justify-between text-sm text-gray-500">
          <span>{formatBytes(file.size || 0)}</span>
          <span>{formatDate(file.createdAt)}</span>
        </div>
      </div>

      {/* Quick actions bar (shown on hover) */}
      <div
        className={cn(
          'absolute bottom-0 left-0 right-0 bg-white border-t border-gray-100 rounded-b-xl p-2',
          'transform translate-y-full opacity-0 group-hover:translate-y-0 group-hover:opacity-100',
          'transition-all duration-200 shadow-soft'
        )}
      >
        <div className="flex items-center justify-around">
          <Button
            variant="ghost"
            size="sm"
            className="h-8 w-8 p-0"
            onClick={handleDownload}
            title="Download"
          >
            <Download className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="h-8 w-8 p-0"
            onClick={handleStar}
            title={file.isStarred ? 'Unstar' : 'Star'}
          >
            <Star className={cn('h-4 w-4', file.isStarred && 'fill-yellow-500 text-yellow-500')} />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="h-8 w-8 p-0"
            onClick={handleShare}
            title="Share"
          >
            <Share2 className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="h-8 w-8 p-0"
            onClick={(e) => {
              e.stopPropagation()
              // TODO: Open preview
            }}
            title="Preview"
          >
            <Eye className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </Card>
  )
})

FileCard.displayName = 'FileCard'

export default FileCard