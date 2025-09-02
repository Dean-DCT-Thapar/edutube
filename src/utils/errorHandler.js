/**
 * Error Handler Utility - Centralized error handling
 * 
 * This prevents inconsistent error handling across components
 */

import toast from 'react-hot-toast';

// Error types enum
export const ERROR_TYPES = {
  AUTHENTICATION: 'auth',
  AUTHORIZATION: 'authz', 
  VALIDATION: 'validation',
  NETWORK: 'network',
  SERVER: 'server',
  UNKNOWN: 'unknown'
};

// Error messages
export const ERROR_MESSAGES = {
  AUTHENTICATION: 'Please login to continue',
  AUTHORIZATION: 'You do not have permission to perform this action',
  VALIDATION: 'Please check your input and try again',
  NETWORK: 'Network error. Please check your connection',
  SERVER: 'Server error. Please try again later',
  UNKNOWN: 'An unexpected error occurred'
};

/**
 * Classify error based on response
 */
export const classifyError = (error) => {
  if (!error.response) {
    return ERROR_TYPES.NETWORK;
  }
  
  const status = error.response.status;
  
  switch (status) {
    case 401:
      return ERROR_TYPES.AUTHENTICATION;
    case 403:
      return ERROR_TYPES.AUTHORIZATION;
    case 400:
    case 422:
      return ERROR_TYPES.VALIDATION;
    case 500:
    case 502:
    case 503:
      return ERROR_TYPES.SERVER;
    default:
      return ERROR_TYPES.UNKNOWN;
  }
};

/**
 * Handle API errors consistently
 */
export const handleApiError = (error, customMessages = {}) => {
  const errorType = classifyError(error);
  
  // Use custom message if provided, otherwise use default
  const message = customMessages[errorType] || 
                 error.response?.data?.message || 
                 ERROR_MESSAGES[errorType.toUpperCase()];
  
  console.error(`API Error [${errorType}]:`, error);
  
  return {
    type: errorType,
    message,
    status: error.response?.status,
    data: error.response?.data
  };
};

/**
 * Handle authentication errors with redirect
 */
export const handleAuthError = (error, router, returnUrl = null) => {
  const errorInfo = handleApiError(error);
  
  if (errorInfo.type === ERROR_TYPES.AUTHENTICATION) {
    if (returnUrl) {
      sessionStorage.setItem('returnUrl', returnUrl);
    }
    toast.error(errorInfo.message);
    router.push('/login');
    return true; // Indicates redirect happened
  }
  
  return false; // No redirect needed
};

/**
 * Show error toast with proper formatting
 */
export const showErrorToast = (error, customMessage = null) => {
  const errorInfo = handleApiError(error);
  const message = customMessage || errorInfo.message;
  
  toast.error(message, {
    duration: 4000,
    position: 'top-center'
  });
};
