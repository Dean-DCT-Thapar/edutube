/**
 * Authentication Utility - Centralized auth management
 * 
 * ARCHITECTURE:
 * - Frontend API routes (/api/*) use httpOnly cookies for security
 * - Client-side components use localStorage for direct backend calls
 * - Admin operations may need both patterns
 */

import axios from 'axios';

// Auth patterns enum
export const AUTH_PATTERNS = {
  COOKIE_BASED: 'cookie', // For Next.js API routes
  TOKEN_BASED: 'token'    // For direct backend calls
};

/**
 * Get authentication method for different API patterns
 */
export const getAuthMethod = (apiPath) => {
  // Frontend API routes use cookies
  if (apiPath.startsWith('/api/')) {
    return AUTH_PATTERNS.COOKIE_BASED;
  }
  // Direct backend calls use tokens
  if (apiPath.startsWith('http://localhost:5000/')) {
    return AUTH_PATTERNS.TOKEN_BASED;
  }
  // Default to cookie-based for frontend routes
  return AUTH_PATTERNS.COOKIE_BASED;
};

/**
 * Make authenticated API call with correct auth pattern
 */
export const authenticatedRequest = async (config) => {
  const authMethod = getAuthMethod(config.url);
  
  if (authMethod === AUTH_PATTERNS.TOKEN_BASED) {
    const token = localStorage.getItem('token') || localStorage.getItem('adminToken');
    if (token) {
      config.headers = config.headers || {};
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  // Cookie-based requests don't need headers (automatic)
  
  return axios(config);
};

/**
 * Check if user is authenticated
 */
export const isAuthenticated = () => {
  // Check both localStorage and cookies via API call
  const hasToken = !!(localStorage.getItem('token') || localStorage.getItem('adminToken'));
  return hasToken;
};

/**
 * Get user role from stored token
 */
export const getUserRole = () => {
  try {
    const token = localStorage.getItem('token') || localStorage.getItem('adminToken');
    if (!token) return null;
    
    // Decode JWT to get role (basic decode, not verification)
    const payload = JSON.parse(atob(token.split('.')[1]));
    return payload.role;
  } catch (error) {
    console.error('Error decoding token:', error);
    return null;
  }
};

/**
 * Clear all authentication data
 */
export const clearAuth = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('adminToken');
  // Note: httpOnly cookies are cleared by logout API
};
