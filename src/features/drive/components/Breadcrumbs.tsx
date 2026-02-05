import React from 'react'
import { ChevronRight, Home } from 'lucide-react'
import { cn } from '@/utils/helpers'
import { useDrive } from '@/hooks/useDrive'

const Breadcrumbs: React.FC = () => {
  const { currentPath, folders, goToRoot, navigateToFolder } = useDrive()

  const getFolderName = (folderId: string) => {
    const folder = folders.find(f => f._id === folderId)
    return folder?.name || 'Unknown Folder'
  }

  const handleBreadcrumbClick = (index: number) => {
    console.log('Breadcrumb clicked:', {
      index,
      currentPath,
      folderId: currentPath[index],
      folderName: getFolderName(currentPath[index])
    })
    
    if (index === -1) {
      // Root clicked
      goToRoot()
    } else if (index === currentPath.length - 1) {
      // Current folder clicked - do nothing (already here)
      console.log('Current folder clicked, no action needed')
    } else {
      // Ancestor folder clicked - navigate to that folder
      const folderId = currentPath[index]
      navigateToFolder(folderId)
    }
  }

  // Special case: root only
  if (currentPath.length === 0) {
    return (
      <div className="flex items-center space-x-2">
        <button
          onClick={goToRoot}
          className={cn(
            'flex items-center space-x-2 px-3 py-1.5 rounded-lg',
            'text-sm font-medium text-primary-600 bg-primary-50',
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
      {/* Root breadcrumb */}
      <button
        onClick={() => handleBreadcrumbClick(-1)}
        className={cn(
          'flex items-center space-x-2 px-3 py-1.5 rounded-lg',
          'text-sm font-medium text-gray-600 hover:bg-gray-100',
          'transition-all duration-200'
        )}
      >
        <Home className="h-4 w-4" />
        <span>My Drive</span>
      </button>

      {/* Folder breadcrumbs */}
      {currentPath.map((folderId, index) => {
        const isLast = index === currentPath.length - 1
        const isCurrent = isLast
        
        return (
          <React.Fragment key={`${folderId}-${index}`}>
            <ChevronRight className="h-4 w-4 text-gray-400" />
            <button
              onClick={() => handleBreadcrumbClick(index)}
              disabled={isCurrent}
              className={cn(
                'px-3 py-1.5 rounded-lg text-sm font-medium transition-all duration-200',
                isCurrent
                  ? 'text-gray-900 bg-gray-100 cursor-default'
                  : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900 cursor-pointer'
              )}
              title={isCurrent ? 'Current folder' : `Go to ${getFolderName(folderId)}`}
            >
              {getFolderName(folderId)}
            </button>
          </React.Fragment>
        )
      })}
    </nav>
  )
}

export default Breadcrumbs