/**
 * Authentication Utility - Centralized auth management
 * 
 * ARCHITECTURE:
 * - All authentication now uses httpOnly cookies for security
 * - Frontend API routes (/api/*) handle cookie authentication
 * - Direct backend calls are discouraged - use frontend API routes instead
 */

import axios from 'axios';

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
 * Make authenticated API call with cookie-based authentication
 */
export const authenticatedRequest = async (config) => {
  // All requests now use cookies automatically - no manual headers needed
  return axios(config);
};

/**
 * Check if user is authenticated using API call
 */
export const isAuthenticated = async () => {
  try {
    const response = await axios.get('/api/verify-auth');
    return response.data.status === 200;
  } catch (error) {
    return false;
  }
};

/**
 * Get user role from API
 */
export const getUserRole = async () => {
  try {
    const response = await axios.get('/api/verify-auth');
    if (response.data.status === 200) {
      return response.data.role;
    }
    return null;
  } catch (error) {
    console.error('Error getting user role:', error);
    return null;
  }
};

/**
 * Clear all authentication data
 */
export const clearAuth = async () => {
  try {
    // Call logout API to clear httpOnly cookies
    await axios.post('/api/logout');
  } catch (error) {
    console.error('Error during logout:', error);
  }
};
