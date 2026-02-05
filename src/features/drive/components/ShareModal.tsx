import React, { useState } from 'react'
import {
 
  X,
  Copy,
  Link as LinkIcon,
  Mail,
  Eye,
  Edit as EditIcon,
  Globe,
  Lock,
  Check,
  Calendar,
} from 'lucide-react'
import { FileItem, SharedPermission } from '@/types/drive.types'
import { useDrive } from '@/hooks/useDrive'
import Modal from '@/components/ui/Modal'
import Button from '@/components/ui/Button'
import Input from '@/components/ui/Input'
import { toast } from 'react-hot-toast'
import { validateEmail } from '@/utils/helpers'

interface ShareModalProps {
  file: FileItem | null
  isOpen: boolean
  onClose: () => void
}

const ShareModal: React.FC<ShareModalProps> = ({ file, isOpen, onClose }) => {
  const { shareFile } = useDrive()
  const [email, setEmail] = useState('')
  const [permission, setPermission] = useState<'VIEW' | 'EDIT'>('VIEW')
  const [linkSharing, setLinkSharing] = useState(false)
  const [linkPermission, setLinkPermission] = useState<'VIEW' | 'EDIT'>('VIEW')
  const [isLoading, setIsLoading] = useState(false)

  const handleShare = async () => {
    if (!file || !email.trim()) return

    if (!validateEmail(email)) {
      toast.error('Please enter a valid email address')
      return
    }

    setIsLoading(true)
    try {
      await shareFile(file._id, email.trim(), permission)
      setEmail('')
      toast.success(`Shared with ${email}`)
    } catch (error) {
      // Error handled by context
    } finally {
      setIsLoading(false)
    }
  }

  const handleCopyLink = () => {
    const link = `https://drivecloud.app/file/${file?._id}`
    navigator.clipboard.writeText(link)
    toast.success('Link copied to clipboard')
  }

  const handleRemoveAccess = (_share: SharedPermission) => {
    // TODO: Implement remove access
    toast.success('Access removed')
  }

  const handlePermissionChange = (_shareId: string, _newPermission: 'VIEW' | 'EDIT') => {
    // TODO: Implement permission change
    toast.success('Permission updated')
  }

  if (!file) return null

  const shareLink = `https://drivecloud.app/file/${file._id}`

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Share"
      size="md"
    >
      <div className="space-y-6">
        {/* Link sharing section */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-2">
              <LinkIcon className="h-5 w-5 text-gray-500" />
              <h3 className="font-medium text-gray-900">Share via link</h3>
            </div>
            <div className="flex items-center space-x-2">
              <button
                onClick={() => setLinkSharing(!linkSharing)}
                className={`
                  relative inline-flex h-6 w-11 items-center rounded-full transition-colors
                  ${linkSharing ? 'bg-primary-500' : 'bg-gray-300'}
                `}
              >
                <span
                  className={`
                    inline-block h-4 w-4 transform rounded-full bg-white transition-transform
                    ${linkSharing ? 'translate-x-6' : 'translate-x-1'}
                  `}
                />
              </button>
              <span className="text-sm text-gray-600">
                {linkSharing ? 'On' : 'Off'}
              </span>
            </div>
          </div>

          {linkSharing && (
            <div className="space-y-3">
              <div className="flex items-center space-x-2">
                <Input
                  value={shareLink}
                  readOnly
                  className="flex-1"
                  leftIcon={<LinkIcon size={18} />}
                />
                <Button variant="outline" onClick={handleCopyLink}>
                  <Copy className="h-4 w-4 mr-2" />
                  Copy
                </Button>
              </div>

              <div className="flex items-center space-x-4">
                <button
                  onClick={() => setLinkPermission('VIEW')}
                  className={`
                    flex items-center space-x-2 px-4 py-2 rounded-lg border transition-all
                    ${linkPermission === 'VIEW'
                      ? 'border-primary-500 bg-primary-50 text-primary-700'
                      : 'border-gray-300 text-gray-600 hover:border-gray-400'
                    }
                  `}
                >
                  <Eye className="h-4 w-4" />
                  <span>View only</span>
                  {linkPermission === 'VIEW' && <Check className="h-4 w-4" />}
                </button>
                <button
                  onClick={() => setLinkPermission('EDIT')}
                  className={`
                    flex items-center space-x-2 px-4 py-2 rounded-lg border transition-all
                    ${linkPermission === 'EDIT'
                      ? 'border-primary-500 bg-primary-50 text-primary-700'
                      : 'border-gray-300 text-gray-600 hover:border-gray-400'
                    }
                  `}
                >
                  <EditIcon className="h-4 w-4" />
                  <span>Can edit</span>
                  {linkPermission === 'EDIT' && <Check className="h-4 w-4" />}
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Share with specific people */}
        <div className="pt-6 border-t border-gray-200">
          <div className="flex items-center space-x-2 mb-4">
            <Mail className="h-5 w-5 text-gray-500" />
            <h3 className="font-medium text-gray-900">Share with people</h3>
          </div>

          <div className="space-y-3">
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

            {/* People with access */}
            <div className="space-y-2">
              <h4 className="text-sm font-medium text-gray-500">People with access</h4>
              
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
                      value={share.permission}
                      onChange={(e) => handlePermissionChange(share.userId, e.target.value as 'VIEW' | 'EDIT')}
                      className="text-sm rounded-lg border border-gray-300 px-3 py-1 focus:outline-none focus:ring-2 focus:ring-primary-500"
                    >
                      <option value="VIEW">Can view</option>
                      <option value="EDIT">Can edit</option>
                    </select>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-8 w-8 p-0"
                      onClick={() => handleRemoveAccess(share)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Advanced settings */}
        <div className="pt-6 border-t border-gray-200">
          <h4 className="text-sm font-medium text-gray-500 mb-3">Advanced settings</h4>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <Globe className="h-5 w-5 text-gray-400" />
                <div>
                  <p className="text-sm font-medium text-gray-900">Public access</p>
                  <p className="text-xs text-gray-500">Allow search engines to index</p>
                </div>
              </div>
              <input type="checkbox" className="rounded border-gray-300" />
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <Lock className="h-5 w-5 text-gray-400" />
                <div>
                  <p className="text-sm font-medium text-gray-900">Require password</p>
                  <p className="text-xs text-gray-500">Set a password for access</p>
                </div>
              </div>
              <input type="checkbox" className="rounded border-gray-300" />
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <Calendar className="h-5 w-5 text-gray-400" />
                <div>
                  <p className="text-sm font-medium text-gray-900">Link expiration</p>
                  <p className="text-xs text-gray-500">Set expiry date for link</p>
                </div>
              </div>
              <input type="checkbox" className="rounded border-gray-300" />
            </div>
          </div>
        </div>
      </div>
    </Modal>
  )
}

export default ShareModal