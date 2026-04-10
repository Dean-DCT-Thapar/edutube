/**
 * Authentication Utility - Centralized auth management
 * 
 * ARCHITECTURE:
 * - All authentication now uses httpOnly cookies for security
 * - Frontend API routes (/api/*) handle cookie authentication
 * - Client-side code calls Next.js API routes, not backend directly
 */

import frontendApi from '@/utils/frontendApiClient';

// Auth patterns enum
export const AUTH_PATTERNS = {
  COOKIE_BASED: 'cookie', // For all API routes (recommended)
  DEPRECATED: 'deprecated' // Old token-based approach (being phased out)
};

/**
 * Get authentication method - now always cookie-based
 */
export const getAuthMethod = (apiPath) => {
  // All routes now use cookie-based authentication
  return AUTH_PATTERNS.COOKIE_BASED;
};

/**
 * Check if user is authenticated using API call
 */
export const isAuthenticated = async () => {
  try {
    const response = await frontendApi.verifyAuth();
    return response.status === 200;
  } catch (error) {
    return false;
  }
};

/**
 * Get user role from API
 */
export const getUserRole = async () => {
  try {
    const response = await frontendApi.verifyAuth();
    if (response.status === 200) {
      return response.role;
    }
    return null;
  } catch (error) {
    console.error('Error getting user role:', error);
    return null;
  }
};

/**
 * Get full auth context including actual role and active viewing mode.
 */
export const getAuthContext = async () => {
  try {
    const response = await frontendApi.verifyAuth();
    if (response.status === 200) {
      return {
        actualRole: response.actualRole || response.role,
        activeRole: response.activeRole || response.role,
        actor: response.actor,
        effectiveUser: response.effectiveUser,
        viewMode: response.viewMode || { active: false, type: null }
      };
    }
    return null;
  } catch (error) {
    console.error('Error getting auth context:', error);
    return null;
  }
};

/**
 * Helper for quickly checking if student view mode is active.
 */
export const isStudentViewModeActive = async () => {
  const context = await getAuthContext();
  return context?.viewMode?.active === true;
};

/**
 * Clear all authentication data
 */
export const clearAuth = async () => {
  try {
    // Call logout API to clear httpOnly cookies
    await frontendApi.logout();
  } catch (error) {
    console.error('Error during logout:', error);
  }
};
