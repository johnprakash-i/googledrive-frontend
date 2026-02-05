import React, { useState } from 'react'
import { FolderPlus } from 'lucide-react'
import { useDrive } from '@/hooks/useDrive'
import Modal from '@/components/ui/Modal'
import Input from '@/components/ui/Input'
import Button from '@/components/ui/Button'

interface CreateFolderModalProps {
  isOpen: boolean
  onClose: () => void
}

const CreateFolderModal: React.FC<CreateFolderModalProps> = ({ isOpen, onClose }) => {
  const { createFolder, currentPath, isLoading } = useDrive()
  const [folderName, setFolderName] = useState('')
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    if (!folderName.trim()) {
      setError('Folder name is required')
      return
    }

    if (folderName.length > 100) {
      setError('Folder name must be less than 100 characters')
      return
    }

    const currentFolderId = currentPath[currentPath.length - 1] || null

    try {
      await createFolder(folderName.trim(), currentFolderId)
      setFolderName('')
      onClose()
    } catch (error: any) {
      setError(error.response?.data?.message || 'Failed to create folder')
    }
  }

  const handleClose = () => {
    setFolderName('')
    setError('')
    onClose()
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title="Create New Folder"
      size="sm"
      footer={
        <div className="flex items-center justify-end space-x-3">
          <Button
            variant="outline"
            onClick={handleClose}
            disabled={isLoading}
          >
            Cancel
          </Button>
          <Button
            variant="primary"
            onClick={handleSubmit}
            loading={isLoading}
            disabled={isLoading || !folderName.trim()}
          >
            Create Folder
          </Button>
        </div>
      }
    >
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="text-center">
          <div className="mx-auto w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mb-4">
            <FolderPlus className="h-8 w-8 text-primary-500" />
          </div>
          <p className="text-gray-600">
            Enter a name for your new folder
          </p>
        </div>

        <Input
          label="Folder Name"
          placeholder="e.g., Documents, Photos, Projects"
          value={folderName}
          onChange={(e) => {
            setFolderName(e.target.value)
            if (error) setError('')
          }}
          error={error}
          autoFocus
          disabled={isLoading}
        />

        <div className="text-sm text-gray-500">
          <p>The folder will be created in your current location.</p>
        </div>
      </form>
    </Modal>
  )
}

export default CreateFolderModal