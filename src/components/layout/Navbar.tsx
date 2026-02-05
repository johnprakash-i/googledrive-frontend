import React, { useState, useCallback } from 'react'
import { Search, Menu, Plus} from 'lucide-react'
import { useDebounce } from '@/hooks/useDebounce'
import { useDrive } from '@/hooks/useDrive'
import Button from '@/components/ui/Button'
import Input from '@/components/ui/Input'
import CreateFolderModal from '@/features/drive/components/CreateFolderModal'
import UploadDropzone from '@/features/drive/components/UploadDropzone'

interface NavbarProps {
  onMenuClick: () => void
}

const Navbar: React.FC<NavbarProps> = ({ onMenuClick }) => {
  const { searchFiles } = useDrive()
  const [searchQuery, setSearchQuery] = useState('')
  const [showCreateFolder, setShowCreateFolder] = useState(false)
  const [showUploadDropzone, setShowUploadDropzone] = useState(false)

  const debouncedSearch = useDebounce((value: string) => {
    searchFiles(value)
  }, 500)

  const handleSearchChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value
      setSearchQuery(value)
      debouncedSearch(value)
    },
    [debouncedSearch]
  )

  const handleCreateFolder = () => {
    setShowCreateFolder(true)
  }

  const handleUploadClick = () => {
    setShowUploadDropzone(true)
  }

  return (
    <>
      <header className="sticky top-0 z-10 bg-surface border-b border-gray-200">
        <div className="px-4 md:px-6 py-3">
          <div className="flex items-center justify-between">
            {/* Left section */}
            <div className="flex items-center space-x-4">
              <button
                onClick={onMenuClick}
                className="p-2 rounded-lg hover:bg-gray-100 lg:hidden"
                aria-label="Toggle menu"
              >
                <Menu className="h-5 w-5 text-gray-600" />
              </button>
              
              <div className="hidden md:block flex-1 max-w-lg">
                <Input
                  placeholder="Search files and folders..."
                  value={searchQuery}
                  onChange={handleSearchChange}
                  leftIcon={<Search size={18} />}
                  className="w-full"
                />
              </div>
            </div>

            {/* Right section */}
            <div className="flex items-center space-x-2">
              {/* Mobile search */}
              <button
                className="p-2 rounded-lg hover:bg-gray-100 md:hidden"
                aria-label="Search"
              >
                <Search className="h-5 w-5 text-gray-600" />
              </button>

       

              {/* Action buttons */}
              <div className="hidden md:flex items-center space-x-2">
          
                <Button
                  variant="outline"
                  size="md"
                  icon={<Plus size={18} />}
                  onClick={handleCreateFolder}
                >
                  New Folder
                </Button>
                
                <Button
                  variant="primary"
                  size="md"
                  icon={<Plus size={18} />}
                  onClick={handleUploadClick}
                >
                  Upload
                </Button>
              </div>

              {/* Mobile action buttons */}
              <div className="flex md:hidden items-center space-x-2">
                <button
                  onClick={handleCreateFolder}
                  className="p-2 rounded-lg bg-primary-500 text-white hover:bg-primary-600"
                  aria-label="Create folder"
                >
                  <Plus className="h-5 w-5" />
                </button>
                <button
                  onClick={handleUploadClick}
                  className="p-2 rounded-lg bg-primary-500 text-white hover:bg-primary-600"
                  aria-label="Upload"
                >
                  <UploadDropzone.Trigger className="h-5 w-5" />
                </button>
              </div>
            </div>
          </div>

          {/* Mobile search input */}
          <div className="mt-3 md:hidden">
            <Input
              placeholder="Search files and folders..."
              value={searchQuery}
              onChange={handleSearchChange}
              leftIcon={<Search size={18} />}
              className="w-full"
            />
          </div>
        </div>
      </header>

      {/* Modals */}
      <CreateFolderModal
        isOpen={showCreateFolder}
        onClose={() => setShowCreateFolder(false)}
      />

      <UploadDropzone
        isOpen={showUploadDropzone}
        onClose={() => setShowUploadDropzone(false)}
      />
    </>
  )
}

export default Navbar