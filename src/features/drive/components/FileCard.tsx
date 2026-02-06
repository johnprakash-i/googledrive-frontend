import React, { memo, useState, useEffect, useRef } from 'react'
import {

  File as FileIcon,
  Image as ImageIcon,
  FileText,
  Film,
  Music,
  Archive,
  FileSpreadsheet,
  FileCode,
  Star,
} from 'lucide-react'
import { FileItem } from '@/types/drive.types'
import { cn, formatBytes, formatDate} from '@/utils/helpers'
import { useDrive } from '@/hooks/useDrive'

import { Card } from '@/components/ui/Card'
import ConfirmationModal from '@/components/ui/ConfirmationModal'

interface FileCardProps {
  file: FileItem
  isSelected?: boolean
  onSelect?: (id: string) => void
}

const FileCard = memo(({ file, isSelected = false }: FileCardProps) => {
  const { deleteFile, selectItem, deselectItem } = useDrive()
  const [showActions, setShowActions] = useState(false)
  const [_isHovered, setIsHovered] = useState(false)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  const [showRenameConfirm, setShowRenameConfirm] = useState(false)
  const [newName, setNewName] = useState(file.name)
  
  // Ref for the dropdown container
  const dropdownRef = useRef<HTMLDivElement>(null)
  const buttonRef = useRef<HTMLButtonElement>(null)

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      // Check if click is outside both the dropdown and the button
      if (
        dropdownRef.current && 
        !dropdownRef.current.contains(event.target as Node) &&
        buttonRef.current && 
        !buttonRef.current.contains(event.target as Node)
      ) {
        setShowActions(false)
      }
    }

    // Add event listener
    document.addEventListener('mousedown', handleClickOutside)
    
    // Cleanup
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])

  // Close dropdown when pressing Escape key
  useEffect(() => {
    const handleEscapeKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && showActions) {
        setShowActions(false)
      }
    }

    document.addEventListener('keydown', handleEscapeKey)
    
    return () => {
      document.removeEventListener('keydown', handleEscapeKey)
    }
  }, [showActions])

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
    // Don't trigger card selection when clicking the actions button
    if (buttonRef.current && buttonRef.current.contains(e.target as Node)) {
      return
    }

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
    
    // Close dropdown when clicking elsewhere on the card
    setShowActions(false)
  }


  const confirmDelete = async () => {
    await deleteFile(file._id)
    setShowDeleteConfirm(false)
  }

  const confirmRename = async () => {
    
    setShowRenameConfirm(false)
  }



  return (
    <>
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

        
        </div>

        {/* File info */}
        <div>
          <h4 className="font-medium text-gray-900 truncate mb-1">{file.name}</h4>
          <div className="flex items-center justify-between text-sm text-gray-500">
            <span>{formatBytes(file.size || 0)}</span>
            <span>{formatDate(file.createdAt)}</span>
          </div>
        </div>

     
      </Card>

      {/* Delete Confirmation Modal */}
      <ConfirmationModal
        isOpen={showDeleteConfirm}
        onClose={() => setShowDeleteConfirm(false)}
        onConfirm={confirmDelete}
        title="Delete File"
        message={`Are you sure you want to delete "${file.name}"?`}
        type="delete"
        confirmText="Delete"
        cancelText="Cancel"
      />

      {/* Rename Confirmation Modal */}
      <ConfirmationModal
        isOpen={showRenameConfirm}
        onClose={() => setShowRenameConfirm(false)}
        onConfirm={confirmRename}
        title="Rename File"
        message="Enter a new name for this file:"
        type="rename"
        confirmText="Rename"
        cancelText="Cancel"
        inputLabel="File Name"
        inputValue={newName}
        onInputChange={setNewName}
        placeholder="Enter new file name"
      />
    </>
  )
})

FileCard.displayName = 'FileCard'

export default FileCard