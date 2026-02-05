import React, { useState, useEffect, useMemo } from 'react'
import { Star, Grid, List } from 'lucide-react'
import AppLayout from '@/components/layout/AppLayout'
import { useDrive } from '@/hooks/useDrive'
import FileGrid from '../components/FileGrid'
import Button from '@/components/ui/Button'
import Spinner from '@/components/ui/Spinner'
import type { FileItem, Folder } from '@/types/drive.types'

const Starred: React.FC = () => {
  const { files, folders, isLoading, fetchFiles, fetchFolders } = useDrive()

  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [filter, setFilter] = useState<'all' | 'files' | 'folders'>('all')

  const [starredItems, setStarredItems] = useState<{
    files: FileItem[]
    folders: Folder[]
  }>({
    files: [],
    folders: [],
  })

  useEffect(() => {
    fetchFiles()
    fetchFolders()
  }, [fetchFiles, fetchFolders])

  // ✅ Compute starred items safely
  useEffect(() => {
    const starredFiles = files.filter((file) => file.isStarred)
    const starredFolders = folders.filter((folder) => folder.isStarred)
    setStarredItems({ files: starredFiles, folders: starredFolders })
  }, [files, folders])

  // ✅ Memoized stats (performance boost)
  const totalSizeGB = useMemo(() => {
    const totalBytes = starredItems.files.reduce(
      (acc, file) => acc + (file.size || 0),
      0
    )
    return (totalBytes / 1024 / 1024 / 1024).toFixed(2)
  }, [starredItems.files])

  const recentlyAddedCount = useMemo(() => {
    const ONE_DAY = 24 * 60 * 60 * 1000
    return starredItems.files.filter((f) => {
      const diff = Date.now() - new Date(f.updatedAt).getTime()
      return diff < ONE_DAY
    }).length
  }, [starredItems.files])

  return (
    <AppLayout>
      <div className="max-w-7xl mx-auto">
        {/* HEADER */}
        <div className="mb-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
            <div className="flex items-center space-x-3">
              <div className="p-3 bg-yellow-100 rounded-xl">
                <Star className="h-6 w-6 text-yellow-600 fill-yellow-600" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Starred</h1>
                <p className="text-gray-600">Your important files and folders</p>
              </div>
            </div>

            <div className="flex items-center space-x-3">
              {/* FILTER */}
              <div className="flex items-center bg-gray-100 rounded-xl p-1">
                {(['all', 'files', 'folders'] as const).map((typeFilter) => (
                  <button
                    key={typeFilter}
                    onClick={() => setFilter(typeFilter)}
                    className={`px-4 py-1.5 rounded-lg text-sm font-medium capitalize transition
                      ${
                        filter === typeFilter
                          ? 'bg-white text-primary-700 shadow-soft'
                          : 'text-gray-600 hover:text-gray-900'
                      }`}
                  >
                    {typeFilter}
                  </button>
                ))}
              </div>

              {/* VIEW TOGGLE */}
              <div className="flex items-center bg-gray-100 rounded-xl p-1">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`px-3 py-1.5 rounded-lg ${
                    viewMode === 'grid'
                      ? 'bg-white text-primary-700 shadow-soft'
                      : 'text-gray-600'
                  }`}
                >
                  <Grid className="h-4 w-4" />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`px-3 py-1.5 rounded-lg ${
                    viewMode === 'list'
                      ? 'bg-white text-primary-700 shadow-soft'
                      : 'text-gray-600'
                  }`}
                >
                  <List className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>

          {/* STATS */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <StatCard label="Starred Files" value={starredItems.files.length} />
            <StatCard label="Starred Folders" value={starredItems.folders.length} />
            <StatCard label="Total Size" value={`${totalSizeGB} GB`} />
            <StatCard label="Recently Added" value={recentlyAddedCount} />
          </div>
        </div>

        {/* CONTENT */}
        {isLoading ? (
          <div className="flex items-center justify-center py-16">
            <Spinner size="lg" />
          </div>
        ) : starredItems.files.length === 0 && starredItems.folders.length === 0 ? (
          <EmptyState />
        ) : (
          <FileGrid
            viewMode={viewMode}
            items={{
              files: filter === 'folders' ? [] : starredItems.files,
              folders: filter === 'files' ? [] : starredItems.folders,
            }}
          />
        )}
      </div>
    </AppLayout>
  )
}

export default Starred

/* ---------- SMALL COMPONENTS ---------- */

const StatCard = ({ label, value }: { label: string; value: number | string }) => (
  <div className="bg-white p-4 rounded-2xl border border-gray-200">
    <p className="text-sm text-gray-500">{label}</p>
    <p className="text-2xl font-bold text-gray-900">{value}</p>
  </div>
)

const EmptyState = () => (
  <div className="text-center py-16 bg-white rounded-2xl border border-gray-200">
    <Star className="mx-auto h-12 w-12 text-gray-400 mb-4" />
    <h3 className="text-lg font-medium text-gray-900">No starred items</h3>
    <p className="text-gray-500 mb-6">
      Star important files and folders to access them quickly from here.
    </p>
    <Button variant="primary" onClick={() => (window.location.href = '/')}>
      Go to My Drive
    </Button>
  </div>
)
