import React from 'react'
import { NavLink } from 'react-router-dom'
import {
  Folder,
  Clock,
  Star,
  Share2,
  Trash2,
  HardDrive,
  Upload,
  ChevronLeft,
  ChevronRight,
  Settings,
  LogOut,
} from 'lucide-react'
import { cn } from '@/utils/helpers'
import { useAuth } from '@/hooks/useAuth'
import { useDrive } from '@/hooks/useDrive'

interface SidebarProps {
  isOpen: boolean
  onToggle: () => void
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen, onToggle }) => {
  const { logout, user } = useAuth()
  const { folders } = useDrive()

  const navItems = [
    { icon: HardDrive, label: 'My Drive', path: '/', count: folders.length },
    { icon: Clock, label: 'Recent', path: '/recent' },
    { icon: Star, label: 'Starred', path: '/starred' },
    { icon: Share2, label: 'Shared with me', path: '/shared' },
    { icon: Upload, label: 'Uploads', path: '/uploads' },
    { icon: Trash2, label: 'Trash', path: '/trash' },
  ]

  const handleLogout = async () => {
    await logout()
  }

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 z-20 bg-black/50 lg:hidden"
          onClick={onToggle}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          'fixed lg:sticky top-0 left-0 z-30 h-screen w-64 bg-surface border-r border-gray-200',
          'transform transition-transform duration-200 ease-in-out',
          'flex flex-col',
          isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0 lg:w-20'
        )}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          {isOpen ? (
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-primary-500 rounded-xl">
                <Folder className="h-6 w-6 text-white" />
              </div>
              <span className="text-xl font-bold text-gray-900">DriveCloud</span>
            </div>
          ) : (
            <div className="p-2 bg-primary-500 rounded-xl mx-auto">
              <Folder className="h-6 w-6 text-white" />
            </div>
          )}
          
          <button
            onClick={onToggle}
            className="p-1.5 rounded-lg hover:bg-gray-100 lg:flex hidden"
            aria-label={isOpen ? 'Collapse sidebar' : 'Expand sidebar'}
          >
            {isOpen ? (
              <ChevronLeft className="h-5 w-5 text-gray-600" />
            ) : (
              <ChevronRight className="h-5 w-5 text-gray-600" />
            )}
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 overflow-y-auto scrollbar-thin">
          <div className="space-y-1">
            {navItems.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                className={({ isActive }) =>
                  cn(
                    'flex items-center rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-200',
                    'hover:bg-primary-50 hover:text-primary-700',
                    isActive
                      ? 'bg-primary-100 text-primary-700'
                      : 'text-gray-700',
                    !isOpen && 'justify-center'
                  )
                }
                end
              >
                <item.icon className={cn('h-5 w-5', isOpen && 'mr-3')} />
                {isOpen && (
                  <>
                    <span className="flex-1">{item.label}</span>
                    {item.count !== undefined && item.count > 0 && (
                      <span className="ml-2 bg-primary-500 text-white text-xs px-2 py-0.5 rounded-full">
                        {item.count}
                      </span>
                    )}
                  </>
                )}
              </NavLink>
            ))}
          </div>

          {/* Folders section */}
          {isOpen && (
            <div className="mt-8">
              <h3 className="px-3 text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
                Folders
              </h3>
              <div className="space-y-1">
                {folders.slice(0, 5).map((folder) => (
                  <button
                    key={folder._id}
                    className="flex items-center w-full text-left rounded-xl px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-all duration-200"
                  >
                    <Folder className="h-4 w-4 mr-3 text-primary-500" />
                    <span className="truncate flex-1">{folder.name}</span>
                    {folder.fileCount && folder.fileCount > 0 && (
                      <span className="text-xs text-gray-500 ml-2">
                        {folder.fileCount}
                      </span>
                    )}
                  </button>
                ))}
              </div>
            </div>
          )}
        </nav>

        {/* User section */}
        <div className="border-t border-gray-200 p-4">
          <div className="flex items-center space-x-3">
            {isOpen ? (
              <>
                <div className="flex-shrink-0">
                  <div className="h-10 w-10 rounded-full bg-primary-500 flex items-center justify-center text-white font-semibold">
                    {user?.firstName?.[0] || 'U'}
                  </div>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate">
                    {user?.firstName} {user?.lastName}
                  </p>
                  <p className="text-xs text-gray-500 truncate">{user?.email}</p>
                </div>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => {/* TODO: Open settings */}}
                    className="p-1.5 rounded-lg hover:bg-gray-100"
                    aria-label="Settings"
                  >
                    <Settings className="h-5 w-5 text-gray-600" />
                  </button>
                  <button
                    onClick={handleLogout}
                    className="p-1.5 rounded-lg hover:bg-gray-100"
                    aria-label="Logout"
                  >
                    <LogOut className="h-5 w-5 text-gray-600" />
                  </button>
                </div>
              </>
            ) : (
              <div className="mx-auto">
                <div className="h-10 w-10 rounded-full bg-primary-500 flex items-center justify-center text-white font-semibold">
                  {user?.firstName?.[0] || 'U'}
                </div>
              </div>
            )}
          </div>
        </div>
      </aside>
    </>
  )
}

export default Sidebar