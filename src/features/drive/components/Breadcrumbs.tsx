import React from 'react'
import { ChevronRight, Home } from 'lucide-react'
import { cn } from '@/utils/helpers'
import { useDrive } from '@/hooks/useDrive'

const Breadcrumbs: React.FC = () => {
  const { currentPath, folders,  goToRoot, navigateToFolder } = useDrive()

  const getFolderName = (folderId: string) => {
    const folder = folders.find(f => f._id === folderId)
    return folder?.name || 'Unknown Folder'
  }

  const handleBreadcrumbClick = (index: number) => {
    if (index === -1) {
      goToRoot()
    } else {
      const path = currentPath.slice(0, index + 1)
      // Navigate to the clicked folder
      const folderId = path[path.length - 1]
      navigateToFolder(folderId)
    }
  }

  if (currentPath.length === 0) {
    return (
      <div className="flex items-center space-x-2">
        <button
          onClick={goToRoot}
          className={cn(
            'flex items-center space-x-2 px-3 py-1.5 rounded-lg',
            'text-sm font-medium text-primary-600 hover:bg-primary-50',
            'transition-all duration-200'
          )}
        >
          <Home className="h-4 w-4" />
          <span>My Drive</span>
        </button>
      </div>
    )
  }

  return (
    <nav className="flex items-center space-x-1" aria-label="Breadcrumb">
      <button
        onClick={goToRoot}
        className={cn(
          'flex items-center space-x-2 px-3 py-1.5 rounded-lg',
          'text-sm font-medium text-gray-600 hover:bg-gray-100',
          'transition-all duration-200'
        )}
      >
        <Home className="h-4 w-4" />
        <span>My Drive</span>
      </button>

      {currentPath.map((folderId, index) => (
        <React.Fragment key={folderId}>
          <ChevronRight className="h-4 w-4 text-gray-400" />
          <button
            onClick={() => handleBreadcrumbClick(index)}
            className={cn(
              'px-3 py-1.5 rounded-lg text-sm font-medium transition-all duration-200',
              index === currentPath.length - 1
                ? 'text-gray-900 bg-gray-100'
                : 'text-gray-600 hover:bg-gray-100'
            )}
          >
            {getFolderName(folderId)}
          </button>
        </React.Fragment>
      ))}
    </nav>
  )
}

export default Breadcrumbs