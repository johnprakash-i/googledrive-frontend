import React, { memo, useState } from 'react'
import { Folder, MoreVertical, Trash2, Edit, Share2, ArrowRight, FolderOpen } from 'lucide-react'
import { Folder as FolderType } from '@/types/drive.types'
import { cn, formatDate } from '@/utils/helpers'
import { useDrive } from '@/hooks/useDrive'
import Button from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'

interface FolderCardProps {
  folder: FolderType
  isSelected?: boolean
  onSelect?: (id: string) => void
}

const FolderCard = memo(({ folder, isSelected = false }: FolderCardProps) => {
  const { navigateToFolder, deleteFolder, selectItem, deselectItem } = useDrive()
  const [showActions, setShowActions] = useState(false)
  const [isHovered, setIsHovered] = useState(false)

  const handleClick = (e: React.MouseEvent) => {
    if (e.ctrlKey || e.metaKey) {
      // Multi-select with Ctrl/Cmd
      if (isSelected) {
        deselectItem(folder._id)
      } else {
        selectItem(folder._id)
      }
    } else if (e.shiftKey) {
      // Range select with Shift (TODO: Implement range selection)
    } else {
      // Navigate to folder
      navigateToFolder(folder._id)
    }
  }

  const handleDelete = async (e: React.MouseEvent) => {
    e.stopPropagation()
    if (window.confirm(`Are you sure you want to delete "${folder.name}" and all its contents?`)) {
      await deleteFolder(folder._id)
    }
  }

  const handleRename = async (e: React.MouseEvent) => {
    e.stopPropagation()
    const newName = prompt('Enter new name:', folder.name)
    if (newName && newName !== folder.name) {
      // TODO: Implement rename
    }
  }

  const handleShare = async (e: React.MouseEvent) => {
    e.stopPropagation()
    // TODO: Open share modal
  }

  return (
    <Card
      hoverable
      variant="elevated"
      className={cn(
        'relative p-4 transition-all duration-200 group',
        isSelected && 'ring-2 ring-primary-500 bg-primary-50'
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

      {/* Folder icon */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center space-x-3">
          <div className="p-3 bg-primary-100 rounded-xl">
            <Folder className="h-6 w-6 text-primary-600" />
          </div>
          {isHovered && (
            <ArrowRight className="h-4 w-4 text-primary-500 animate-pulse" />
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
                  onClick={() => navigateToFolder(folder._id)}
                >
                  <FolderOpen className="mr-3 h-4 w-4" />
                  Open
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

      {/* Folder info */}
      <div>
        <h4 className="font-medium text-gray-900 truncate mb-1">{folder.name}</h4>
        <div className="flex items-center justify-between text-sm text-gray-500">
          {folder.fileCount ? (
            <span>{folder.fileCount} items</span>
          ) : (
            <span>Empty folder</span>
          )}
          <span>{formatDate(folder.createdAt)}</span>
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
            onClick={() => navigateToFolder(folder._id)}
            title="Open"
          >
            <FolderOpen className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="h-8 w-8 p-0"
            onClick={handleRename}
            title="Rename"
          >
            <Edit className="h-4 w-4" />
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
            onClick={() => {/* TODO: View details */}}
            title="Details"
          >
            <ArrowRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </Card>
  )
})

FolderCard.displayName = 'FolderCard'

export default FolderCard