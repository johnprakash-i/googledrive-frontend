import React, { useState, useEffect, useMemo } from 'react'
import { Share2, Users, Globe } from 'lucide-react'
import AppLayout from '@/components/layout/AppLayout'
import { useDrive } from '@/hooks/useDrive'
import FileGrid from '../components/FileGrid'

import Spinner from '@/components/ui/Spinner'

import type { FileItem, Folder } from '@/types/drive.types' 
import { useAuth } from '@/hooks/useAuth' 

type SharedFilter = 'all' | 'shared-by-me' | 'shared-with-me'

interface SharedItemsState {
  files: FileItem[]
  folders: Folder[]
}

const Shared: React.FC = () => {
  const { files, folders, isLoading, fetchSharedFiles } = useDrive()
  const { user } = useAuth() // must contain user.id
  const [filter, setFilter] = useState<SharedFilter>('all')

  const [sharedItems, setSharedItems] = useState<SharedItemsState>({
    files: [],
    folders: [],
  })

  useEffect(() => {
    fetchSharedFiles()
  }, [fetchSharedFiles])

  useEffect(() => {
    if (!user) return

    const isShared = (item: FileItem | Folder) =>
      item.sharedWith && item.sharedWith.length > 0

    const sharedFiles = files.filter(isShared)
    const sharedFolders = folders.filter(isShared)

    let filteredFiles = sharedFiles
    let filteredFolders = sharedFolders

    if (filter === 'shared-by-me') {
      filteredFiles = sharedFiles.filter(file => file.userId === user.id)
      filteredFolders = sharedFolders.filter(folder => folder.userId === user.id)
    }

    if (filter === 'shared-with-me') {
      filteredFiles = sharedFiles.filter(file =>
        file.sharedWith?.some(p => p.userId === user.id)
      )
      filteredFolders = sharedFolders.filter(folder =>
        folder.sharedWith?.some(p => p.userId === user.id)
      )
    }

    setSharedItems({ files: filteredFiles, folders: filteredFolders })
  }, [files, folders, filter, user])

  const peopleCount = useMemo(() => {
    return Array.from(
      new Set(
        [...sharedItems.files, ...sharedItems.folders]
          .flatMap(item => item.sharedWith?.map(s => s.email) || [])
      )
    ).length
  }, [sharedItems])

  const publicLinksCount = useMemo(() => {
    return sharedItems.files.filter(f =>
      f.sharedWith?.some(s => s.email === 'public')
    ).length
  }, [sharedItems])

  return (
    <AppLayout>
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
            <div className="flex items-center space-x-3">
              <div className="p-3 bg-primary-100 rounded-xl">
                <Share2 className="h-6 w-6 text-primary-600" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Shared</h1>
                <p className="text-gray-600">Files and folders shared with you</p>
              </div>
            </div>

            {/* Filters */}
            <div className="flex items-center bg-gray-100 rounded-xl p-1">
              {(['all', 'shared-by-me', 'shared-with-me'] as const).map(f => (
                <button
                  key={f}
                  onClick={() => setFilter(f)}
                  className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-all duration-200 capitalize
                  ${filter === f ? 'bg-white text-primary-700 shadow-soft' : 'text-gray-600 hover:text-gray-900'}`}
                >
                  {f.replace('-', ' ')}
                </button>
              ))}
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <StatCard label="Shared Files" value={sharedItems.files.length} icon={<Share2 />} color="blue" />
            <StatCard label="Shared Folders" value={sharedItems.folders.length} icon={<Users />} color="green" />
            <StatCard label="People" value={peopleCount} icon={<Users />} color="purple" />
            <StatCard label="Public Links" value={publicLinksCount} icon={<Globe />} color="yellow" />
          </div>
        </div>

        {/* Content */}
        {isLoading ? (
          <div className="flex justify-center py-16">
            <Spinner size="lg" />
          </div>
        ) : sharedItems.files.length === 0 && sharedItems.folders.length === 0 ? (
          <EmptyState filter={filter} />
        ) : (
          <>
            <FileGrid items={sharedItems} />
            {/* <SharingInsights items={sharedItems} /> */}
          </>
        )}
      </div>
    </AppLayout>
  )
}

export default Shared

const StatCard = ({ label, value, icon, color }: any) => (
  <div className="bg-white p-4 rounded-2xl border border-gray-200">
    <div className="flex items-center justify-between">
      <div>
        <p className="text-sm text-gray-500">{label}</p>
        <p className="text-2xl font-bold text-gray-900">{value}</p>
      </div>
      <div className={`p-2 bg-${color}-100 rounded-xl text-${color}-500`}>
        {icon}
      </div>
    </div>
  </div>
)

const EmptyState = ({ filter }: { filter: SharedFilter }) => (
  <div className="text-center py-16 bg-white rounded-2xl border border-gray-200">
    <Share2 className="mx-auto h-12 w-12 text-gray-400 mb-4" />
    <h3 className="text-lg font-medium text-gray-900 mb-2">No shared items</h3>
    <p className="text-gray-500">
      {filter === 'shared-by-me'
        ? "You haven't shared anything yet"
        : filter === 'shared-with-me'
        ? 'Nothing shared with you yet'
        : 'No shared files or folders'}
    </p>
  </div>
)
