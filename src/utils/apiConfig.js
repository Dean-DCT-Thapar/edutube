/**
 * API Configuration - Centralized API endpoint management
 * 
 * This prevents the "wrong endpoint" errors we encountered
 */

// Get backend URL for server-side requests (Next.js API routes to backend)
export const getBackendUrl = () => {
  // Always use internal Docker network for server-side requests
  return process.env.BACKEND_URL || 'http://backend:5001';
};

// Get API base URL for client-side requests (browser to Next.js API routes)
export const getApiBaseUrl = () => {
  if (typeof window === 'undefined') {
    // Server-side: not used, but return empty for safety
    return '';
  }
  
  // Client-side: always use the current domain (where Next.js is running)
  // This handles both localhost and cloudflared tunnels automatically
  return window.location.origin;
};

// API endpoints mapping
export const API_ENDPOINTS = {
  // Authentication
  LOGIN: '/api/login',                    // Frontend route
  LOGOUT: '/api/logout',                  // Frontend route  
  VERIFY_AUTH: '/api/verify-auth',        // Frontend route
  
  // Enrollment  
  ENROLL: '/api/enrollment',              // Frontend route (POST)
  UNENROLL: '/api/enrollment',            // Frontend route (DELETE)
  CHECK_ENROLLMENT: (courseId) => `/api/enrollment/check/${courseId}`, // Frontend route (GET)
  
  // Courses
  GET_COURSES: (courseId) => `/api/courses/${courseId}`,
  
  // User data
  GET_USER_DATA: '/api/get-user-data',
  
  // Watch History
  WATCH_HISTORY: '/api/watch-history',
  RECENT_ACTIVITY: '/api/watch-history/recent',
  UPDATE_PROGRESS: '/api/watch-history/progress',
  GET_VIDEO_PROGRESS: (lectureId) => `/api/watch-history/getVideoProgress/${lectureId}`,
  
  // Search
  SEARCH: '/api/search',                    // Legacy search
  ADVANCED_SEARCH: '/api/advanced-search', // New advanced search
  QUICK_SEARCH: '/api/quick-search',       // Autocomplete suggestions
  
  // Backend direct endpoints (for reference)
  BACKEND: {
    LOGIN: '/login',
    VERIFY_AUTH: '/verify-auth', 
    ENROLLMENT: {
      ENROLL: '/api/enrollment/enroll_course',
      UNENROLL: '/api/enrollment/unenroll_course', 
      CHECK: (courseId) => `/api/enrollment/check/${courseId}`
    }
  }
};

// HTTP methods enum
export const HTTP_METHODS = {
  GET: 'GET',
  POST: 'POST', 
  PUT: 'PUT',
  DELETE: 'DELETE'
};
