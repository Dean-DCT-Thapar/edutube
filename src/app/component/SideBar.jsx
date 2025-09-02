'use client'
import React, { useState, useEffect } from 'react'
import MenuIcon from '@mui/icons-material/Menu';
import HomeIcon from '@mui/icons-material/Home';
import SearchIcon from '@mui/icons-material/Search';
import SettingsAccessibilityIcon from '@mui/icons-material/SettingsAccessibility';
import DvrSharpIcon from '@mui/icons-material/DvrSharp';
import PersonIcon from '@mui/icons-material/Person';
import CloseIcon from '@mui/icons-material/Close';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const SideBar = () => {
  // Use consistent initial state for SSR
  const [isOpen, setIsOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(true);
  const [isHydrated, setIsHydrated] = useState(false);
  const pathname = usePathname();


  // Handle hydration and initial setup
  useEffect(() => {
    setIsHydrated(true);
    const checkMobile = () => {
      const mobile = window.innerWidth < 1024;
      setIsMobile(mobile);
      setIsOpen(!mobile); // Open by default on desktop, closed on mobile
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Sync sidebar state event when isOpen changes
  useEffect(() => {
    if (!isHydrated) return;
    // defer dispatch to avoid updating during render
    const evt = new CustomEvent('sidebarState', { detail: isOpen });
    setTimeout(() => window.dispatchEvent(evt), 0);
  }, [isOpen, isHydrated]);

  // Listen for toggle event from TopBar
  useEffect(() => {
    if (!isHydrated) return;
    const handleToggle = () => {
      setIsOpen(prev => {
        const newState = !prev;
        // defer dispatch to avoid setState-in-render errors
        const evt = new CustomEvent('sidebarState', { detail: newState });
        setTimeout(() => window.dispatchEvent(evt), 0);
        return newState;
      });
    };
    window.addEventListener('toggleSidebar', handleToggle);
    return () => window.removeEventListener('toggleSidebar', handleToggle);
  }, [isHydrated]);

  const toggleSidebar = () => {
    if (!isHydrated) return;
    setIsOpen((prev) => {
      const newState = !prev;
      // defer dispatch to avoid conflicts
      const evt = new CustomEvent('sidebarState', { detail: newState });
      setTimeout(() => window.dispatchEvent(evt), 0);
      return newState;
    });
  };

  const closeSidebar = () => {
    if (!isHydrated || !isMobile) return;
    setIsOpen(false);
    window.dispatchEvent(new CustomEvent('sidebarState', { detail: false }));
  };

  const navItems = [
    {
      href: '/dashboard',
      icon: HomeIcon,
      label: 'Dashboard',
      description: 'Your learning overview'
    },
    {
      href: '/browse',
      icon: SearchIcon,
      label: 'Browse',
      description: 'Browse and search courses'
    },
    {
      href: '/teachers',
      icon: PersonIcon,
      label: 'Teachers',
      description: 'Meet our educators'
    },
    {
      href: '/profile',
      icon: SettingsAccessibilityIcon,
      label: 'Profile',
      description: 'Manage your account'
    },
    {
      href: '/watchHistory',
      icon: DvrSharpIcon,
      label: 'Watch History',
      description: 'Recently viewed content'
    }
  ];

  const isActiveLink = (href) => {
    return pathname === href;
  };

  return (
    <>
      {/* Mobile overlay */}
      {isHydrated && isMobile && isOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden transition-opacity duration-300"
          onClick={closeSidebar}
          aria-hidden="true"
        />
      )}

      {/* Sidebar */}
      <aside className={`
        fixed top-0 left-0 z-50 h-full bg-primary-800 text-white
        transition-all duration-300 ease-in-out
        ${isHydrated && isOpen ? 'w-64' : 'w-16'}
        ${isHydrated && isMobile && !isOpen ? '-translate-x-full' : 'translate-x-0'}
        lg:translate-x-0
        shadow-xl border-r border-primary-700
      `}>
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-primary-700">
          <button
            onClick={toggleSidebar}
            className={`
              flex items-center justify-center w-8 h-8 rounded-lg
              hover:bg-primary-700 focus:bg-primary-700 focus:outline-none
              transition-colors duration-200
              ${!isHydrated || !isOpen ? 'mx-auto' : ''}
            `}
            aria-label={isHydrated && isOpen ? 'Close sidebar' : 'Open sidebar'}
          >
            {isHydrated && isOpen ? (
              <CloseIcon className="w-5 h-5" />
            ) : (
              <MenuIcon className="w-5 h-5" />
            )}
          </button>
          
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4">
          <ul className="space-y-2">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = isActiveLink(item.href);
              
              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    onClick={closeSidebar}
                    className={`
                      flex items-center p-3 rounded-lg group
                      transition-all duration-200 ease-in-out
                      ${isActive 
                        ? 'bg-primary-700 text-white shadow-lg' 
                        : 'text-primary-200 hover:bg-primary-700 hover:text-white'
                      }
                      ${!isHydrated || !isOpen ? 'justify-center' : ''}
                    `}
                    title={!isHydrated || !isOpen ? item.label : undefined}
                  >
                    <Icon className={`
                      w-5 h-5 flex-shrink-0
                      ${isActive ? 'text-white' : 'text-primary-300 group-hover:text-white'}
                      transition-colors duration-200
                    `} />
                    
                    {isHydrated && isOpen && (
                      <div className="ml-3 opacity-0 animate-[fadeIn_0.5s_ease-in-out_forwards]">
                        <div className="font-medium text-sm">{item.label}</div>
                        <div className="text-xs text-primary-300 group-hover:text-primary-200">
                          {item.description}
                        </div>
                      </div>
                    )}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* Footer */}
        {isHydrated && isOpen && (
          <div className="p-4 border-t border-solid border-primary-700 opacity-0 animate-[fadeIn_0.5s_ease-in-out_forwards]">
            <div className="text-xs text-primary-300 text-center">
              <p>&copy; 2025 Thapar University</p>
              <p className="mt-1">Educational Platform</p>
            </div>
          </div>
        )}
      </aside>

      {/* Spacer for main content */}
      <div className={`
        ${isHydrated && isOpen ? 'lg:w-64' : 'lg:w-16'} 
        ${isHydrated && isMobile ? 'w-0' : 'w-16'}
        flex-shrink-0 transition-all duration-300
      `} />
    </>
  );
};

export default SideBar;

