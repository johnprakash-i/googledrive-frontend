import React from 'react'
import Skeleton from '@/components/ui/Skeleton'

const FileGridSkeleton: React.FC = () => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-4">
      {Array.from({ length: 8 }).map((_, index) => (
        <div key={index} className="bg-white p-4 rounded-2xl border border-gray-200">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center space-x-3">
              <Skeleton variant="rounded" className="h-12 w-12" />
            </div>
            <Skeleton variant="circular" className="h-6 w-6" />
          </div>
          
          <div className="space-y-2">
            <Skeleton variant="text" className="w-3/4" />
            <div className="flex items-center justify-between">
              <Skeleton variant="text" className="w-16" />
              <Skeleton variant="text" className="w-20" />
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}

export default FileGridSkeleton