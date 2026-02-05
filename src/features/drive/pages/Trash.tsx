import React, { useState } from 'react'
import { Trash2, RotateCcw, Delete, Filter, Calendar } from 'lucide-react'
import AppLayout from '@/components/layout/AppLayout'
import { useDrive } from '@/hooks/useDrive'
import Button from '@/components/ui/Button'
import Spinner from '@/components/ui/Spinner'
import { Card } from '@/components/ui/Card'
import { formatDate } from '@/utils/helpers'

const Trash: React.FC = () => {
  const { isLoading } = useDrive()
  const [selectedItems, setSelectedItems] = useState<string[]>([])
  const [filter, setFilter] = useState<'all' | 'files' | 'folders'>('all')

  // Mock data - in real app this would come from API
  const trashItems = [
    {
      id: '1',
      name: 'Project Proposal.pdf',
      type: 'file',
      size: 2456789,
      deletedAt: '2024-01-15T10:30:00Z',
      originalLocation: 'My Drive/Documents'
    },
    {
      id: '2',
      name: 'Vacation Photos',
      type: 'folder',
      itemCount: 24,
      deletedAt: '2024-01-14T14:20:00Z',
      originalLocation: 'My Drive/Photos'
    },
    {
      id: '3',
      name: 'Meeting Notes.docx',
      type: 'file',
      size: 123456,
      deletedAt: '2024-01-13T09:15:00Z',
      originalLocation: 'My Drive/Work'
    }
  ]

  const handleSelect = (id: string) => {
    setSelectedItems(prev =>
      prev.includes(id)
        ? prev.filter(itemId => itemId !== id)
        : [...prev, id]
    )
  }

  const handleRestore = () => {
    // TODO: Restore selected items
    setSelectedItems([])
  }

  const handleDeletePermanently = () => {
    if (selectedItems.length === 0) return
    
    if (window.confirm(`Are you sure you want to permanently delete ${selectedItems.length} item${selectedItems.length > 1 ? 's' : ''}? This action cannot be undone.`)) {
      // TODO: Delete permanently
      setSelectedItems([])
    }
  }

  const handleEmptyTrash = () => {
    if (window.confirm('Are you sure you want to empty the trash? This action cannot be undone.')) {
      // TODO: Empty trash
    }
  }

  const filteredItems = trashItems.filter(item => 
    filter === 'all' || item.type === filter.slice(0, -1) // 'files' -> 'file', 'folders' -> 'folder'
  )

  return (
    <AppLayout>
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
            <div className="flex items-center space-x-3">
              <div className="p-3 bg-red-100 rounded-xl">
                <Trash2 className="h-6 w-6 text-red-600" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Trash</h1>
                <p className="text-gray-600">Deleted files and folders</p>
              </div>
            </div>

            <div className="flex items-center space-x-3">
              {/* Filter buttons */}
              <div className="flex items-center bg-gray-100 rounded-xl p-1">
                {(['all', 'files', 'folders'] as const).map((typeFilter) => (
                  <button
                    key={typeFilter}
                    onClick={() => setFilter(typeFilter)}
                    className={`
                      px-4 py-1.5 rounded-lg text-sm font-medium transition-all duration-200 capitalize
                      ${filter === typeFilter
                        ? 'bg-white text-primary-700 shadow-soft'
                        : 'text-gray-600 hover:text-gray-900'
                      }
                    `}
                  >
                    {typeFilter}
                  </button>
                ))}
              </div>

              {/* Empty trash button */}
              <Button
                variant="danger"
                icon={<Delete size={18} />}
                onClick={handleEmptyTrash}
                disabled={trashItems.length === 0}
              >
                Empty Trash
              </Button>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="bg-white p-4 rounded-2xl border border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">Items in Trash</p>
                  <p className="text-2xl font-bold text-gray-900">{trashItems.length}</p>
                </div>
                <div className="p-2 bg-red-100 rounded-xl">
                  <Trash2 className="h-6 w-6 text-red-500" />
                </div>
              </div>
            </div>
            <div className="bg-white p-4 rounded-2xl border border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">Total Size</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {(trashItems.reduce((acc, item) => acc + (item.size || 0), 0) / 1024 / 1024).toFixed(2)} MB
                  </p>
                </div>
                <div className="p-2 bg-blue-100 rounded-xl">
                  <Calendar className="h-6 w-6 text-blue-500" />
                </div>
              </div>
            </div>
            <div className="bg-white p-4 rounded-2xl border border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">Auto-deletes in</p>
                  <p className="text-2xl font-bold text-gray-900">30 days</p>
                </div>
                <div className="p-2 bg-yellow-100 rounded-xl">
                  <Filter className="h-6 w-6 text-yellow-500" />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Selection actions */}
        {selectedItems.length > 0 && (
          <div className="mb-6 p-4 bg-white rounded-2xl border border-gray-200 flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <span className="text-sm text-gray-600">
                {selectedItems.length} selected
              </span>
              <Button
                variant="outline"
                size="sm"
                icon={<RotateCcw size={16} />}
                onClick={handleRestore}
              >
                Restore
              </Button>
              <Button
                variant="danger"
                size="sm"
                icon={<Delete size={16} />}
                onClick={handleDeletePermanently}
              >
                Delete Permanently
              </Button>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setSelectedItems([])}
            >
              Clear Selection
            </Button>
          </div>
        )}

        {/* Content */}
        {isLoading ? (
          <div className="flex items-center justify-center py-16">
            <Spinner size="lg" />
          </div>
        ) : trashItems.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-2xl border border-gray-200">
            <div className="mx-auto w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-6">
              <Trash2 className="h-12 w-12 text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Trash is empty
            </h3>
            <p className="text-gray-500 mb-6">
              Items you delete will appear here
            </p>
            <Button variant="primary" onClick={() => window.location.href = '/'}>
              Go to My Drive
            </Button>
          </div>
        ) : (
          <div className="space-y-3">
            {/* Table header */}
            <div className="grid grid-cols-12 gap-4 px-4 py-3 bg-gray-50 rounded-xl text-sm font-medium text-gray-500">
              <div className="col-span-1"></div>
              <div className="col-span-4">Name</div>
              <div className="col-span-2">Original Location</div>
              <div className="col-span-2">Size</div>
              <div className="col-span-3">Deleted</div>
            </div>

            {/* Items */}
            {filteredItems.map((item) => (
              <Card
                key={item.id}
                hoverable
                className={`
                  grid grid-cols-12 gap-4 p-4 items-center
                  ${selectedItems.includes(item.id) ? 'ring-2 ring-primary-500 bg-primary-50' : ''}
                `}
                onClick={() => handleSelect(item.id)}
              >
                <div className="col-span-1">
                  <input
                    type="checkbox"
                    checked={selectedItems.includes(item.id)}
                    onChange={() => handleSelect(item.id)}
                    className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                    onClick={(e) => e.stopPropagation()}
                  />
                </div>
                <div className="col-span-4 flex items-center space-x-3">
                  <div className="p-2 bg-gray-100 rounded-lg">
                    {item.type === 'file' ? (
                      <Trash2 className="h-5 w-5 text-gray-500" />
                    ) : (
                      <Trash2 className="h-5 w-5 text-gray-500" />
                    )}
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">{item.name}</p>
                    <p className="text-sm text-gray-500 capitalize">{item.type}</p>
                  </div>
                </div>
                <div className="col-span-2 text-gray-600 text-sm truncate">
                  {item.originalLocation}
                </div>
                <div className="col-span-2 text-gray-600 text-sm">
                  {item.size ? `${(item.size / 1024 / 1024).toFixed(2)} MB` : `${item.itemCount} items`}
                </div>
                <div className="col-span-3 text-gray-600 text-sm">
                  {formatDate(item.deletedAt)}
                </div>
              </Card>
            ))}
          </div>
        )}

        {/* Info notice */}
        <div className="mt-6 p-4 bg-blue-50 rounded-2xl border border-blue-200">
          <div className="flex items-start space-x-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Calendar className="h-5 w-5 text-blue-600" />
            </div>
            <div>
              <h4 className="text-sm font-medium text-blue-900 mb-1">
                Automatic cleanup
              </h4>
              <p className="text-sm text-blue-700">
                Items in trash are automatically deleted after 30 days. Empty the trash manually to free up storage immediately.
              </p>
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  )
}

export default Trash