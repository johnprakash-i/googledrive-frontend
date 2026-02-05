import React, { useState, useEffect } from 'react'
import { Clock, Filter, Calendar } from 'lucide-react'
import AppLayout from '@/components/layout/AppLayout'
import { useDrive } from '@/hooks/useDrive'
import FileGrid from '../components/FileGrid'
import Button from '@/components/ui/Button'
import Spinner from '@/components/ui/Spinner'

const Recent: React.FC = () => {
  const { files, folders, isLoading, fetchFiles, fetchFolders } = useDrive()
  const [filter, setFilter] = useState<'all' | 'today' | 'week' | 'month'>('all')
  const [recentFiles, setRecentFiles] = useState(files)

  useEffect(() => {
    fetchFiles()
    fetchFolders()
  }, [fetchFiles, fetchFolders])

  useEffect(() => {
    const now = new Date()
    const filtered = files.filter(file => {
      const fileDate = new Date(file.updatedAt)
      const diffTime = Math.abs(now.getTime() - fileDate.getTime())
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))

      switch (filter) {
        case 'today':
          return diffDays <= 1
        case 'week':
          return diffDays <= 7
        case 'month':
          return diffDays <= 30
        default:
          return true
      }
    }).sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())

    setRecentFiles(filtered)
  }, [files, filter])

  return (
    <AppLayout>
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
            <div className="flex items-center space-x-3">
              <div className="p-3 bg-primary-100 rounded-xl">
                <Clock className="h-6 w-6 text-primary-600" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Recent Files</h1>
                <p className="text-gray-600">Files you've worked on recently</p>
              </div>
            </div>

            {/* Filter buttons */}
            <div className="flex items-center space-x-2">
              <div className="flex items-center bg-gray-100 rounded-xl p-1">
                {(['all', 'today', 'week', 'month'] as const).map((timeFilter) => (
                  <button
                    key={timeFilter}
                    onClick={() => setFilter(timeFilter)}
                    className={`
                      px-4 py-1.5 rounded-lg text-sm font-medium transition-all duration-200 capitalize
                      ${filter === timeFilter
                        ? 'bg-white text-primary-700 shadow-soft'
                        : 'text-gray-600 hover:text-gray-900'
                      }
                    `}
                  >
                    {timeFilter}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="bg-white p-4 rounded-2xl border border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">Total Files</p>
                  <p className="text-2xl font-bold text-gray-900">{files.length}</p>
                </div>
                <div className="p-2 bg-blue-100 rounded-xl">
                  <Calendar className="h-6 w-6 text-blue-500" />
                </div>
              </div>
            </div>
            <div className="bg-white p-4 rounded-2xl border border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">This Week</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {files.filter(f => {
                      const diff = Date.now() - new Date(f.updatedAt).getTime()
                      return diff < 7 * 24 * 60 * 60 * 1000
                    }).length}
                  </p>
                </div>
                <div className="p-2 bg-green-100 rounded-xl">
                  <Filter className="h-6 w-6 text-green-500" />
                </div>
              </div>
            </div>
            <div className="bg-white p-4 rounded-2xl border border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">Active Projects</p>
                  <p className="text-2xl font-bold text-gray-900">{folders.length}</p>
                </div>
                <div className="p-2 bg-purple-100 rounded-xl">
                  <Clock className="h-6 w-6 text-purple-500" />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Content */}
        {isLoading ? (
          <div className="flex items-center justify-center py-16">
            <Spinner size="lg" />
          </div>
        ) : recentFiles.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-2xl border border-gray-200">
            <div className="mx-auto w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-6">
              <Clock className="h-12 w-12 text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No recent files
            </h3>
            <p className="text-gray-500 mb-6">
              {filter === 'today' 
                ? 'No files were modified today'
                : filter === 'week'
                ? 'No files were modified this week'
                : filter === 'month'
                ? 'No files were modified this month'
                : 'You have no files yet'}
            </p>
            <Button variant="primary" onClick={() => window.location.href = '/'}>
              Go to My Drive
            </Button>
          </div>
        ) : (
          <FileGrid items={{ files: recentFiles, folders: [] }} />
        )}
      </div>
    </AppLayout>
  )
}

export default Recent