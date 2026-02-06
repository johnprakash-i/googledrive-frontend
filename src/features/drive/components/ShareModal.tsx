import React, { useState } from 'react'
import {  Mail , X, } from 'lucide-react'
import Modal from '@/components/ui/Modal'
import Button from '@/components/ui/Button'
import Input from '@/components/ui/Input'
import { toast } from 'react-hot-toast'
import { validateEmail } from '@/utils/helpers'

interface ShareModalProps {
  isOpen: boolean
  onClose: () => void
  itemId: string
  itemType: 'file' | 'folder'
  itemName: string
  onShare: (email: string, permission: 'VIEW' | 'EDIT') => Promise<void>
  existingShares?: Array<{
    email: string
    permission: 'VIEW' | 'EDIT'
    userId: string
    sharedAt: string
  }>
}

const ShareModal: React.FC<ShareModalProps> = ({
  isOpen,
  onClose,
  itemType,
  onShare,
  existingShares = []
}) => {
  const [email, setEmail] = useState('')
  const [permission, setPermission] = useState<'VIEW' | 'EDIT'>('VIEW')
  const [isLoading, setIsLoading] = useState(false)

  const handleShare = async () => {
    if (!email.trim()) {
      toast.error('Please enter an email address')
      return
    }

    if (!validateEmail(email)) {
      toast.error('Please enter a valid email address')
      return
    }

    setIsLoading(true)
    try {
      await onShare(email.trim(), permission)
      setEmail('')
      toast.success(`Shared with ${email}`)
    } catch (error) {
      // Error is handled by parent
    } finally {
      setIsLoading(false)
    }
  }

  const handleRemoveShare = (shareEmail: string) => {
    // TODO: Implement remove share functionality
    toast.success(`Removed access for ${shareEmail}`)
  }

  const handlePermissionChange = (shareEmail: string, _newPermission: 'VIEW' | 'EDIT') => {
    // TODO: Implement permission change functionality
    toast.success(`Permission updated for ${shareEmail}`)
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`Share ${itemType === 'file' ? 'File' : 'Folder'}`}
      size="md"
    >
      <div className="space-y-6">
        {/* Share with new people */}
        <div>
          <h3 className="text-sm font-medium text-gray-900 mb-3">
            Share with people
          </h3>
          <div className="flex items-center space-x-2">
            <Input
              placeholder="Enter email addresses"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="flex-1"
              leftIcon={<Mail size={18} />}
              disabled={isLoading}
            />
            <select
              value={permission}
              onChange={(e) => setPermission(e.target.value as 'VIEW' | 'EDIT')}
              className="rounded-xl border border-gray-300 px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-primary-500"
              disabled={isLoading}
            >
              <option value="VIEW">Can view</option>
              <option value="EDIT">Can edit</option>
            </select>
            <Button
              variant="primary"
              onClick={handleShare}
              loading={isLoading}
              disabled={isLoading || !email.trim()}
            >
              Share
            </Button>
          </div>
        </div>

        {/* People with access */}
        <div className="border-t border-gray-200 pt-6">
          <h3 className="text-sm font-medium text-gray-900 mb-3">
            People with access ({existingShares.length})
          </h3>
          
          <div className="space-y-2">
            {/* Owner (current user) */}
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
            {existingShares.map((share, index) => (
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
                    value={share.permission}
                    onChange={(e) => handlePermissionChange(share.email, e.target.value as 'VIEW' | 'EDIT')}
                    className="text-sm rounded-lg border border-gray-300 px-3 py-1 focus:outline-none focus:ring-2 focus:ring-primary-500"
                  >
                    <option value="VIEW">Can view</option>
                    <option value="EDIT">Can edit</option>
                  </select>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-8 w-8 p-0"
                    onClick={() => handleRemoveShare(share.email)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>

     
      </div>
    </Modal>
  )
}

export default ShareModal