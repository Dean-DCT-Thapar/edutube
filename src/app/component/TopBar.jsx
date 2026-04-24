'use client'
import React from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import frontendApi from '@/utils/frontendApiClient'
import toast from 'react-hot-toast'
import {
  AVATAR_UPDATED_EVENT,
  getInitials,
  getAvatarStyle,
  isValidAvatarVariant,
  resolveAvatarVariant,
  saveAvatarVariant
} from '@/utils/avatarGenerator'

const TOPBAR_IDENTITY_CACHE_KEY = 'topbarIdentityCache';

const readIdentityCache = () => {
  if (typeof window === 'undefined') return null;
  try {
    const raw = localStorage.getItem(TOPBAR_IDENTITY_CACHE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (!parsed || typeof parsed !== 'object') return null;
    return {
      id: parsed.id ?? null,
      name: parsed.name ?? null,
      email: parsed.email ?? null,
      role: parsed.role ?? null,
      viewMode: parsed.viewMode ?? null
    };
  } catch {
    return null;
  }
};

const writeIdentityCache = (identity) => {
  if (typeof window === 'undefined') return;
  try {
    if (!identity) {
      localStorage.removeItem(TOPBAR_IDENTITY_CACHE_KEY);
      return;
    }
    localStorage.setItem(TOPBAR_IDENTITY_CACHE_KEY, JSON.stringify(identity));
  } catch {
    // Ignore cache write failures.
  }
};

const TopBar = ({ name, avatar }) => {
  const SIDEBAR_COLLAPSED_KEY = 'studentSidebarCollapsed';
  const [sidebarOpen, setSidebarOpen] = React.useState(() => {
    if (typeof window === 'undefined') return false;
    const isDesktop = window.innerWidth >= 1024;
    if (!isDesktop) return false;
    return localStorage.getItem('studentSidebarCollapsed') !== 'true';
  });
  const [authContext, setAuthContext] = React.useState(() => readIdentityCache());
  const [exitingMode, setExitingMode] = React.useState(false);
  const [isReadyForTransitions, setIsReadyForTransitions] = React.useState(false);
  const [avatarVariant, setAvatarVariant] = React.useState('sunset');
  const router = useRouter();

  React.useEffect(() => {
    // Listen for sidebar toggle events
    const handleToggle = () => {};
    window.addEventListener('toggleSidebar', handleToggle);
    // Listen for sidebar open/close from SideBar component
    const handleSidebarState = (e) => {
      if (typeof e.detail === 'boolean') {
        setSidebarOpen(e.detail);
      }
    };
    window.addEventListener('sidebarState', handleSidebarState);
    return () => {
      window.removeEventListener('toggleSidebar', handleToggle);
      window.removeEventListener('sidebarState', handleSidebarState);
    };
  }, []);

  React.useEffect(() => {
    frontendApi.verifyAuth()
      .then(async (auth) => {
        setAuthContext(auth);
        writeIdentityCache(auth);
        try {
          const avatarData = await frontendApi.getAvatarVariant();
          if (isValidAvatarVariant(avatarData?.avatar_variant)) {
            saveAvatarVariant(avatarData.avatar_variant);
            setAvatarVariant(avatarData.avatar_variant);
          }
        } catch {
          // Keep deterministic/local fallback on avatar fetch failures.
        }
      })
      .catch(() => {
        // Keep cached identity on transient auth fetch failures to prevent UI flicker.
      });
  }, []);

  React.useEffect(() => {
    const syncWithViewport = () => {
      const isDesktop = window.innerWidth >= 1024;
      if (!isDesktop) {
        setSidebarOpen(false);
        return;
      }
      const storedCollapsed = localStorage.getItem(SIDEBAR_COLLAPSED_KEY);
      setSidebarOpen(storedCollapsed !== 'true');
    };

    syncWithViewport();
    requestAnimationFrame(() => {
      setIsReadyForTransitions(true);
    });
    window.addEventListener('resize', syncWithViewport);
    return () => window.removeEventListener('resize', syncWithViewport);
  }, []);
  const getWelcomeMessage = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 17) return 'Good afternoon';
    return 'Good evening';
  };

  const displayName = name || authContext?.name || '';
  const avatarSeed = `${authContext?.id || ''}:${displayName}:${authContext?.email || ''}`;

  React.useEffect(() => {
    setAvatarVariant(resolveAvatarVariant({
      id: authContext?.id,
      name: displayName,
      email: authContext?.email
    }));
  }, [avatarSeed]);

  React.useEffect(() => {
    const syncAvatar = () => {
      setAvatarVariant(resolveAvatarVariant({
        id: authContext?.id,
        name: displayName,
        email: authContext?.email
      }));
      writeIdentityCache(authContext || readIdentityCache());
    };
    window.addEventListener(AVATAR_UPDATED_EVENT, syncAvatar);
    window.addEventListener('storage', syncAvatar);
    return () => {
      window.removeEventListener(AVATAR_UPDATED_EVENT, syncAvatar);
      window.removeEventListener('storage', syncAvatar);
    };
  }, [avatarSeed]);

  return (
    <header className={`sticky top-0 z-30 w-full bg-white border-b border-gray-200 shadow-sm ${isReadyForTransitions ? 'transition-all duration-300' : ''} ${sidebarOpen ? 'lg:pl-64' : 'lg:pl-16'}`}>
      <div className="w-full flex items-center justify-between px-3 sm:px-6 lg:px-8 py-3 lg:py-4"> 
        {/* Left section - Logo and Title */}
        <div className="flex items-center space-x-4">
          {/* Sidebar toggle for mobile */}
          <button
            className="flex items-center justify-center mr-1 sm:mr-2 lg:hidden p-2.5 rounded-lg hover:bg-gray-100 focus:outline-none touch-manipulation"
            onClick={() => {
              const evt = new CustomEvent('toggleSidebar');
              window.dispatchEvent(evt);
            }}
            aria-label="Open sidebar"
          >
            <svg className="w-6 h-6 text-primary-800" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
          <Link href="/dashboard" className="flex items-center space-x-3 group">
            <img 
              src="/main-site-logo.svg" 
              alt="EduTube Logo" 
              className="h-8 sm:h-10 w-auto"
              onError={(e) => {
                e.target.style.display = 'none';
              }}
            />
          </Link>
        </div>

        {/* Right section - User info */}
        <div className="flex items-center space-x-4">
          {/* User avatar and profile link */}
          <Link 
            href="/profile" 
            className="flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-100 transition-colors duration-200 group"
          >
            <div className="relative">
              <div
                className="h-8 w-8 sm:h-10 sm:w-10 rounded-full border-2 border-gray-200 group-hover:border-primary-300 transition-colors text-white font-semibold text-xs sm:text-sm flex items-center justify-center"
                style={getAvatarStyle(avatarVariant)}
              >
                {(displayName || authContext?.email) ? getInitials(displayName, authContext?.email) : ''}
              </div>
              {/* Online indicator */}
              <div className="absolute -bottom-0.5 -right-0.5 h-3 w-3 bg-success-600 rounded-full border-2 border-white"></div>
            </div>
            
            {/* User name - consistently visible from small screens and up */}
            {displayName && (
              <div className="hidden sm:block">
                <p className="text-sm font-medium text-gray-900 truncate max-w-32">
                  {displayName}
                </p>
                <p className="text-xs text-gray-600">
                  View Profile
                </p>
              </div>
            )}
          </Link>
        </div>
      </div>
      {authContext?.viewMode?.active && (
        <div>
          <div className="px-4 sm:px-6 lg:px-8 py-2 bg-amber-50 border-t border-amber-200">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
              <p className="text-sm text-amber-900">
                Signed in as {authContext.actualRole} and viewing as student ({authContext.viewMode.targetUserEmail}).
              </p>
              <button
                onClick={async () => {
                  try {
                    setExitingMode(true);
                    const response = await frontendApi.stopStudentViewMode();
                    toast.success('Exited student view mode');
                    const returnTo = typeof window !== 'undefined'
                      ? new URLSearchParams(window.location.search).get('returnTo')
                      : null;
                    if (returnTo && returnTo.startsWith('/')) {
                      router.push(returnTo);
                    } else if (response.actualRole === 'admin') {
                      router.push('/admin-dashboard');
                    } else if (response.actualRole === 'teacher') {
                      router.push('/teacher-dashboard');
                    } else {
                      router.push('/dashboard');
                    }
                  } catch (error) {
                    toast.error(error?.data?.message || error.message || 'Failed to exit student view mode');
                  } finally {
                    setExitingMode(false);
                  }
                }}
                disabled={exitingMode}
                className="inline-flex items-center justify-center px-3 py-1.5 rounded-md bg-amber-700 text-white text-xs font-medium hover:bg-amber-800 disabled:opacity-60"
              >
                {exitingMode ? 'Exiting...' : 'Exit Student View'}
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  )
}

export default TopBar
