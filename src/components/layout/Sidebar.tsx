import React from "react";
import { NavLink } from "react-router-dom";
import {
  Folder,
  Clock,
  Star,
  Share2,
  Trash2,
  HardDrive,
  ChevronLeft,
  ChevronRight,
  LogOut,
} from "lucide-react";
import { cn } from "@/utils/helpers";
import { useAuth } from "@/hooks/useAuth";
import { useDrive } from "@/hooks/useDrive";

interface SidebarProps {
  isOpen: boolean;
  onToggle: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen, onToggle }) => {
  const { logout, user } = useAuth();
  const { folders } = useDrive();

  const navItems = [
    { 
      icon: HardDrive, 
      label: "My Drive", 
      path: "/", 
      count: folders.length,
      enabled: true 
    },
    { 
      icon: Clock, 
      label: "Recent", 
      path: "/recent",
      enabled: true 
    },
    { 
      icon: Star, 
      label: "Starred", 
      path: "/starred",
      enabled: false,
      comingSoon: true 
    },
    { 
      icon: Share2, 
      label: "Shared with me", 
      path: "/shared",
      enabled: false,
      comingSoon: true 
    },
    { 
      icon: Trash2, 
      label: "Trash", 
      path: "/trash",
      enabled: false ,
       comingSoon: true  // Changed to true since you have mock data
    },
  ];

  const handleLogout = async () => {
    await logout();
  };

  return (
    <>
      {/* Mobile overlay - Remove blur and make solid */}
      {isOpen && (
        <div
          className="fixed inset-0 z-20 bg-black/30 lg:hidden backdrop-blur-0"
          onClick={onToggle}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          "fixed lg:sticky top-0 left-0 z-30 h-screen w-64 bg-white border-r border-gray-200",
          "transform transition-transform duration-200 ease-in-out",
          "flex flex-col shadow-lg",
          isOpen
            ? "translate-x-0"
            : "-translate-x-full lg:translate-x-0 lg:w-20",
        )}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          {isOpen ? (
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-primary-500 rounded-xl">
                <Folder className="h-6 w-6 text-white" />
              </div>
              <span className="text-xl font-bold text-gray-900">
                DriveCloud
              </span>
            </div>
          ) : (
            <div className="p-2 bg-primary-500 rounded-xl mx-auto">
              <Folder className="h-6 w-6 text-white" />
            </div>
          )}

          <button
            onClick={onToggle}
            className="p-1.5 rounded-lg hover:bg-gray-100 lg:flex hidden"
            aria-label={isOpen ? "Collapse sidebar" : "Expand sidebar"}
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
  <div key={item.path} className="relative">
    <NavLink
      to={item.path}
      className={({ isActive }) =>
        cn(
          "flex items-center rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-200",
          "hover:bg-primary-50 hover:text-primary-700",
          isActive && "bg-primary-100 text-primary-700",
          !isOpen && "justify-center",
        )
      }
      end
    >
      <item.icon className={cn("h-5 w-5", isOpen && "mr-3")} />
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
    
    {/* Coming Soon Tag - Only for items with comingSoon: true */}
    {item.comingSoon && isOpen && (
      <span className="absolute -top-1 -right-1 bg-gradient-to-r from-primary-500 to-primary-600 text-white text-xs px-2 py-0.5 rounded-full font-medium shadow-sm">
        Soon
      </span>
    )}
  </div>
))}
          </div>
        </nav>

        {/* User section */}
        <div className="border-t border-gray-200 p-4">
          <div className="flex items-center space-x-3">
            {isOpen ? (
              <>
                <div className="flex-shrink-0">
                  <div className="h-10 w-10 rounded-full bg-gradient-to-br from-primary-500 to-primary-600 flex items-center justify-center text-white font-semibold shadow-sm">
                    {user?.firstName?.[0] || "U"}
                  </div>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate">
                    {user?.firstName} {user?.lastName}
                  </p>
                  <p className="text-xs text-gray-500 truncate">
                    {user?.email}
                  </p>
                </div>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={handleLogout}
                    className="p-1.5 rounded-lg hover:bg-gray-100 transition-colors"
                    aria-label="Logout"
                  >
                    <LogOut className="h-5 w-5 text-gray-600" />
                  </button>
                </div>
              </>
            ) : (
              <div className="mx-auto">
                <div className="h-10 w-10 rounded-full bg-gradient-to-br from-primary-500 to-primary-600 flex items-center justify-center text-white font-semibold shadow-sm">
                  {user?.firstName?.[0] || "U"}
                </div>
              </div>
            )}
          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;