import React from 'react'
import Skeleton from '@/components/ui/Skeleton'

const SidebarSkeleton: React.FC = () => {
  return (
    <div className="w-64 h-screen bg-surface border-r border-gray-200 p-4">
      {/* Logo */}
      <div className="flex items-center space-x-3 mb-8">
        <Skeleton variant="rounded" className="h-10 w-10" />
        <Skeleton variant="text" className="h-6 w-32" />
      </div>

      {/* Navigation */}
      <div className="space-y-2 mb-8">
        {Array.from({ length: 6 }).map((_, index) => (
          <div key={index} className="flex items-center space-x-3 p-2">
            <Skeleton variant="circular" className="h-5 w-5" />
            <Skeleton variant="text" className="h-4 flex-1" />
          </div>
        ))}
      </div>

      {/* Folders */}
      <div className="mb-8">
        <Skeleton variant="text" className="h-4 w-20 mb-4" />
        <div className="space-y-2">
          {Array.from({ length: 4 }).map((_, index) => (
            <div key={index} className="flex items-center space-x-3 p-2">
              <Skeleton variant="circular" className="h-4 w-4" />
              <Skeleton variant="text" className="h-3 flex-1" />
            </div>
          ))}
        </div>
      </div>

      {/* User */}
      <div className="flex items-center space-x-3 p-2">
        <Skeleton variant="circular" className="h-10 w-10" />
        <div className="flex-1">
          <Skeleton variant="text" className="h-4 w-24 mb-1" />
          <Skeleton variant="text" className="h-3 w-32" />
        </div>
      </div>
    </div>
  )
}

export default SidebarSkeleton