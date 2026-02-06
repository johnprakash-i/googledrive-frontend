import React, { memo, useState, useEffect, useRef } from 'react'
import {
  Folder,
  MoreVertical,
  Trash2,
  Edit,
  Share2,
  ArrowRight,
  FolderOpen,
  Star,
} from 'lucide-react'
import { Folder as FolderType } from '@/types/drive.types'
import { cn, formatDate } from '@/utils/helpers'
import { useDrive } from '@/hooks/useDrive'
import Button from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import ConfirmationModal from '@/components/ui/ConfirmationModal'
import ShareModal from './ShareModal'


interface FolderCardProps {
  folder: FolderType
  isSelected?: boolean
  onSelect?: (id: string) => void
}

const FolderCard = memo(({ folder, isSelected = false }: FolderCardProps) => {
  const {
    navigateToFolder,
    deleteFolder,
    renameFolder,
    starFolder,
    shareFolder,
    selectItem,
    deselectItem,
  } = useDrive()

  const [showActions, setShowActions] = useState(false)
  const [isHovered, setIsHovered] = useState(false)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  const [showRenameModal, setShowRenameModal] = useState(false)
  const [showShareModal, setShowShareModal] = useState(false)
  const [newName, setNewName] = useState(folder.name)
  const [isRenaming, setIsRenaming] = useState(false)

  const dropdownRef = useRef<HTMLDivElement>(null)
  const buttonRef = useRef<HTMLButtonElement>(null)

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node) &&
        buttonRef.current &&
        !buttonRef.current.contains(event.target as Node)
      ) {
        setShowActions(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  // Close dropdown on Escape
  useEffect(() => {
    const handleEscapeKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && showActions) {
        setShowActions(false)
      }
    }

    document.addEventListener('keydown', handleEscapeKey)
    return () => document.removeEventListener('keydown', handleEscapeKey)
  }, [showActions])

  const handleClick = (e: React.MouseEvent) => {
    if (buttonRef.current && buttonRef.current.contains(e.target as Node)) {
      return
    }

    if (e.ctrlKey || e.metaKey) {
      if (isSelected) {
        deselectItem(folder._id)
      } else {
        selectItem(folder._id)
      }
    } else if (e.shiftKey) {
      // TODO: Range selection
    } else {
      navigateToFolder(folder._id)
    }

    setShowActions(false)
  }

  const handleDeleteClick = (e: React.MouseEvent) => {
    e.stopPropagation()
    setShowActions(false)
    setShowDeleteConfirm(true)
  }

  const handleRenameClick = (e: React.MouseEvent) => {
    e.stopPropagation()
    setShowActions(false)
    setNewName(folder.name)
    setShowRenameModal(true)
  }

  const handleShareClick = (e: React.MouseEvent) => {
    e.stopPropagation()
    setShowActions(false)
    setShowShareModal(true)
  }

  const handleStarClick = async (e: React.MouseEvent) => {
    e.stopPropagation()
    setShowActions(false)
    await starFolder(folder._id)
  }

  const confirmDelete = async () => {
    await deleteFolder(folder._id)
    setShowDeleteConfirm(false)
  }

  const confirmRename = async () => {
   
    if (!newName.trim() || newName === folder.name) {
      setShowRenameModal(false)
      return
    }

    setIsRenaming(true)
    try {
      await renameFolder(folder._id, newName.trim())
      setShowRenameModal(false)
    } catch (error) {
      console.error('Failed to rename folder:', error)
    } finally {
      setIsRenaming(false)
    }
  }

  const handleShare = async (email: string, permission: 'VIEW' | 'EDIT') => {
    await shareFolder(folder._id, email, permission)
  }

  const toggleActions = (e: React.MouseEvent) => {
    e.stopPropagation()
    setShowActions(prev => !prev)
  }

  return (
    <>
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
            <div className="p-3 bg-primary-100 rounded-xl relative">
              <Folder className="h-6 w-6 text-primary-600" />
              {folder.isStarred && (
                <Star className="absolute -top-1 -right-1 h-4 w-4 text-yellow-500 fill-yellow-500" />
              )}
            </div>
            {isHovered && (
              <ArrowRight className="h-4 w-4 text-primary-500 animate-pulse" />
            )}
          </div>

          {/* Actions dropdown */}
          <div className="relative" ref={dropdownRef}>
            <Button
              ref={buttonRef}
              variant="ghost"
              size="sm"
              className={cn(
                'opacity-0 group-hover:opacity-100 transition-opacity',
                showActions && 'opacity-100'
              )}
              onClick={toggleActions}
              aria-label="Folder actions"
              aria-expanded={showActions}
            >
              <MoreVertical className="h-4 w-4" />
            </Button>

            {showActions && (
              <div
                className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-hard border border-gray-200 z-50 animate-slide-in"
                role="menu"
              >
                <div className="py-1">
                  <button
                    className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    onClick={() => {
                      setShowActions(false)
                      navigateToFolder(folder._id)
                    }}
                    role="menuitem"
                  >
                    <FolderOpen className="mr-3 h-4 w-4" />
                    Open
                  </button>
                  <button
                    className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    onClick={handleRenameClick}
                    role="menuitem"
                  >
                    <Edit className="mr-3 h-4 w-4" />
                    Rename
                  </button>
                  <button
                    className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    onClick={handleStarClick}
                    role="menuitem"
                  >
                    <Star className={cn('mr-3 h-4 w-4', folder.isStarred && 'fill-yellow-500 text-yellow-500')} />
                    {folder.isStarred ? 'Unstar' : 'Star'}
                  </button>
                  <button
                    className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    onClick={handleShareClick}
                    role="menuitem"
                  >
                    <Share2 className="mr-3 h-4 w-4" />
                    Share
                  </button>
                  <div className="border-t border-gray-100 my-1" />
                  <button
                    className="flex items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                    onClick={handleDeleteClick}
                    role="menuitem"
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
          <h4 className="font-medium text-gray-900 truncate mb-1">
            {folder.name}
          </h4>
          <div className="flex items-center justify-between text-sm text-gray-500">
            {folder.fileCount ? (
              <span>{folder.fileCount} items</span>
            ) : (
              <span>Empty folder</span>
            )}
            <span>{formatDate(folder.createdAt)}</span>
          </div>
        </div>

        {/* Shared indicator */}
        {folder.sharedWith && folder.sharedWith.length > 0 && (
          <div className="mt-2 flex items-center text-xs text-gray-500">
            <Share2 className="h-3 w-3 mr-1" />
            Shared with {folder.sharedWith.length} {folder.sharedWith.length === 1 ? 'person' : 'people'}
          </div>
        )}

        {/* Quick actions bar */}
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
              onClick={handleRenameClick}
              title="Rename"
            >
              <Edit className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="h-8 w-8 p-0"
              onClick={handleStarClick}
              title={folder.isStarred ? 'Unstar' : 'Star'}
            >
              <Star className={cn('h-4 w-4', folder.isStarred && 'fill-yellow-500 text-yellow-500')} />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="h-8 w-8 p-0"
              onClick={handleShareClick}
              title="Share"
            >
              <Share2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </Card>

      {/* Delete Confirmation Modal */}
      <ConfirmationModal
        isOpen={showDeleteConfirm}
        onClose={() => setShowDeleteConfirm(false)}
        onConfirm={confirmDelete}
        title="Delete Folder"
        message={`Are you sure you want to delete "${folder.name}" and all its contents? You can restore it from trash within 30 days.`}
        type="delete"
        confirmText="Move to Trash"
        cancelText="Cancel"
      />

      {/* Rename Modal */}
      <ConfirmationModal
        isOpen={showRenameModal}
        onClose={() => setShowRenameModal(false)}
        onConfirm={confirmRename}
        title="Rename Folder"
        message="Enter a new name for this folder:"
        type="rename"
        confirmText="Rename"
        cancelText="Cancel"
        inputLabel="Folder Name"
        inputValue={newName}
        onInputChange={setNewName}
        placeholder="Enter new folder name"
        isLoading={isRenaming}
      />

      {/* Share Modal */}
      <ShareModal
        isOpen={showShareModal}
        onClose={() => setShowShareModal(false)}
        itemId={folder._id}
        itemType="folder"
        itemName={folder.name}
        onShare={handleShare}
        existingShares={folder.sharedWith || []}
      />
    </>
  )
})

FolderCard.displayName = 'FolderCard'

export default FolderCard