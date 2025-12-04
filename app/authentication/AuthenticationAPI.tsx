// authService.js
class AuthService {
  baseURL: string;
  token: string | null;
  constructor() {
    this.baseURL = process.env.BASE_URL+""; // Replace with your actual API URL
    this.token = "";
  }

  /**
   * Set authentication token
   * @param {string} token - The authentication token
   */
  setToken(token: string) {
    this.token = token;
    if (token) {
      localStorage.setItem('authToken', token);
    } else {
      localStorage.removeItem('authToken');
    }
  }

  /**
   * Get stored authentication token
   * @returns {string|null} The stored token
   */
  getToken() {
    if (!this.token) {
      this.token = localStorage.getItem('authToken');
    }
    return this.token;
  }

  /**
   * Make an API request
   * @param {string} endpoint - The API endpoint
   * @param {object} options - Fetch options
   * @returns {Promise<object>} The API response
   */
  async request(endpoint: string, options:any = {}) {
    const url = `${this.baseURL}${endpoint}`;
    const headers = {
      'Content-Type': 'application/json',
      ...options.headers,
    };

    // Add authorization header if token exists
    const token = this.getToken();
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    try {
      const response = await fetch(url, {
        ...options,
        headers,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || `HTTP error! status: ${response.status}`);
      }

      return { success: true, data };
    } catch (error) {
      return { 
        success: false, 
        error: 'An unexpected error occurred' 
      };
    }
  }

  /**
   * Login user
   * @param {string} email - User email
   * @param {string} password - User password
   * @returns {Promise<object>} Login response
   */
  async login(email: string, password: string) {
    const result = await this.request('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
    console.log(result)
    if (result.success && result.data.token) {
      this.setToken(result.data.token);
    }

    return result;
  }


  async signup(name:string, email:string, password:string) {
    const result = await this.request('/auth/signup', {
      method: 'POST',
      body: JSON.stringify({ name, email, password }),
    });

    if (result.success && result.data.token) {
      this.setToken(result.data.token);
    }

    return result;
  }

  /**
   * Logout user
   */
  async logout() {
    try {
      await this.request('/auth/logout', {
        method: 'POST',
      });
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      this.setToken("");
    }
  }

  /**
   * Get current user profile
   * @returns {Promise<object>} User profile
   */
  async getProfile() {
    return await this.request('/auth/profile', {
      method: 'GET',
    });
  }

}

// Export a singleton instance
const authService = new AuthService();
export default authService;