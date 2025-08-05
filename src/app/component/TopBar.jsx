'use client'
import React from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

const TopBar = ({ name, avatar }) => {
  const [sidebarOpen, setSidebarOpen] = React.useState(false);

  React.useEffect(() => {
    // Listen for sidebar toggle events
    const handleToggle = () => setSidebarOpen((prev) => !prev);
    window.addEventListener('toggleSidebar', handleToggle);
    // Listen for sidebar open/close from SideBar component
    const handleSidebarState = (e) => {
      if (typeof e.detail === 'boolean') setSidebarOpen(e.detail);
    };
    window.addEventListener('sidebarState', handleSidebarState);
    return () => {
      window.removeEventListener('toggleSidebar', handleToggle);
      window.removeEventListener('sidebarState', handleSidebarState);
    };
  }, []);
  const pathname = usePathname();
  
  // Get page title based on current route
  const getPageTitle = () => {
    switch (pathname) {
      case '/dashboard':
        return 'Dashboard';
      case '/search':
        return 'Search';
      case '/profile':
        return 'Profile';
      case '/watchHistory':
        return 'Watch History';
      default:
        return 'Thapar EduTube';
    }
  };

  const getWelcomeMessage = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 17) return 'Good afternoon';
    return 'Good evening';
  };

  return (
    <header className="sticky top-0 z-30 bg-white border-b border-gray-200 shadow-sm">
      <div className={`flex items-center justify-between px-4 sm:px-6 lg:px-8 py-4 ml-0 transition-all duration-300 ${sidebarOpen ? 'lg:ml-64' : 'lg:ml-16'}`}> 
        {/* Left section - Logo and Title */}
        <div className="flex items-center space-x-4">
          {/* Sidebar toggle for mobile */}
          <button
            className="flex items-center justify-center mr-2 lg:hidden p-2 rounded-lg hover:bg-gray-100 focus:outline-none"
            onClick={() => {
              const evt = new CustomEvent('toggleSidebar');
              window.dispatchEvent(evt);
            }}
            aria-label="Open sidebar"
          >
            <svg className="w-6 h-6 text-primary-800" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
          <Link href="/dashboard" className="flex items-center group">
            <div className="flex flex-col justify-center">
              <h1 className="text-xl font-bold text-primary-800 group-hover:text-primary-700 transition-colors">
                Thapar EduTube
              </h1>
              <p className="text-sm text-gray-600">
                Digital Learning Platform
              </p>
            </div>
          </Link>
        </div>

        {/* Right section - User info */}
        <div className="flex items-center space-x-4">
          {/* Welcome message (hidden on small screens) */}
          {name && (
            <div className="hidden lg:block text-right">
              <p className="text-sm font-medium text-gray-900">
                {getWelcomeMessage()}, {name.split(' ')[0]}!
              </p>
              <p className="text-xs text-gray-600">
                Ready to learn something new?
              </p>
            </div>
          )}

          {/* User avatar and profile link */}
          <Link 
            href="/profile" 
            className="flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-100 transition-colors duration-200 group"
          >
            <div className="relative">
              <img 
                src={avatar || '/profile.png'}
                alt={`${name || 'User'}'s profile`}
                className="h-8 w-8 sm:h-10 sm:w-10 rounded-full object-cover border-2 border-gray-200 group-hover:border-primary-300 transition-colors"
                onError={(e) => {
                  e.target.src = '/profile.png';
                }}
              />
              {/* Online indicator */}
              <div className="absolute -bottom-0.5 -right-0.5 h-3 w-3 bg-success-600 rounded-full border-2 border-white"></div>
            </div>
            
            {/* User name (visible on mobile in collapsed state) */}
            {name && (
              <div className="block sm:hidden lg:block">
                <p className="text-sm font-medium text-gray-900 truncate max-w-32">
                  {name}
                </p>
                <p className="text-xs text-gray-600">
                  View Profile
                </p>
              </div>
            )}
          </Link>
        </div>
      </div>

      {/* Mobile page title */}
      <div className="block md:hidden px-4 sm:px-6 pb-3">
        <h2 className="text-lg font-semibold text-gray-900">
          {getPageTitle()}
        </h2>
      </div>
    </header>
  )
}

export default TopBar
