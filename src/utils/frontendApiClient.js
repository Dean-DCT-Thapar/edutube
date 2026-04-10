/**
 * Frontend API Client - For client-side requests to Next.js API routes
 * This handles browser-side requests to our own API endpoints
 */

import { getApiBaseUrl } from './apiConfig';

class FrontendApiClient {
  constructor() {
    this.baseURL = getApiBaseUrl();
  }

  async request(endpoint, options = {}) {
    const url = `${this.baseURL}${endpoint}`;
    
    const config = {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      credentials: 'include', // Include cookies
      ...options,
    };

    if (config.body && typeof config.body === 'object') {
      config.body = JSON.stringify(config.body);
    }

    // Add timeout to fetch request
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 30000); // 30 second timeout

    try {
      const response = await fetch(url, {
        ...config,
        signal: controller.signal
      });
      
      clearTimeout(timeoutId);
      
      // Handle non-JSON responses
      const contentType = response.headers.get('content-type');
      let data;
      
      if (contentType && contentType.includes('application/json')) {
        data = await response.json();
      } else {
        data = await response.text();
      }

      if (!response.ok) {
        const err = new Error(
          typeof data === 'object' && data?.message
            ? data.message
            : `HTTP error! status: ${response.status}`
        );
        err.status = response.status;
        if (typeof data === 'object' && data) err.data = data;
        throw err;
      }

      return data;
    } catch (error) {
      clearTimeout(timeoutId);
      
      if (error.name === 'AbortError') {
        console.error(`API request timeout: ${config.method || 'GET'} ${url}`);
        throw new Error('Request timeout - please try again');
      }
      
      console.error(`API request failed: ${config.method || 'GET'} ${url}`, error);
      throw error;
    }
  }

  // HTTP method shortcuts
  get(endpoint, options = {}) {
    return this.request(endpoint, { ...options, method: 'GET' });
  }

  post(endpoint, body, options = {}) {
    return this.request(endpoint, { ...options, method: 'POST', body });
  }

  put(endpoint, body, options = {}) {
    return this.request(endpoint, { ...options, method: 'PUT', body });
  }

  delete(endpoint, options = {}) {
    return this.request(endpoint, { ...options, method: 'DELETE' });
  }

  // Common API calls
  async login(email, password) {
    return this.post('/api/login', { email, password });
  }

  async logout() {
    return this.post('/api/logout');
  }

  async verifyAuth() {
    return this.get('/api/verify-auth');
  }

  async startStudentViewMode() {
    return this.post('/api/student-view');
  }

  async stopStudentViewMode() {
    return this.delete('/api/student-view');
  }

  async getUserData() {
    return this.get('/api/get-user-data');
  }

  async enrollCourse(courseInstanceId) {
    return this.post('/api/enrollment', { courseInstanceId });
  }

  async unenrollCourse(courseInstanceId) {
    return this.delete('/api/enrollment', { body: { courseInstanceId } });
  }

  async checkEnrollment(courseId) {
    return this.get(`/api/enrollment/check/${courseId}`);
  }

  async getWatchHistory() {
    return this.get('/api/watch-history');
  }

  async updateWatchProgress(lectureId, currentTime, duration) {
    return this.post('/api/watch-history/progress', {
      lecture_id: lectureId,
      progress: currentTime,
      duration: duration || currentTime
    });
  }

  async search(query, options = {}) {
    const params = new URLSearchParams({ query, ...options });
    return this.get(`/api/search?${params}`);
  }

  async quickSearch(query) {
    return this.get(`/api/quick-search?q=${encodeURIComponent(query)}&limit=8`);
  }
}

// Export a singleton instance
const frontendApi = new FrontendApiClient();
export default frontendApi;

// Also export the class for custom instances if needed
export { FrontendApiClient };
