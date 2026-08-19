/**
 * API Client - Handles all backend communication
 * عميل API - يدير جميع الاتصالات مع الخادم
 */

class APIClient {
    constructor() {
        this.baseURL = 'http://localhost:5000/api';
        this.token = localStorage.getItem('token') || null;
    }

    setToken(token) {
        this.token = token;
        if (token) {
            localStorage.setItem('token', token);
        } else {
            localStorage.removeItem('token');
        }
    }

    getHeaders() {
        const headers = {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        };
        
        if (this.token) {
            headers['Authorization'] = `Bearer ${this.token}`;
        }
        
        return headers;
    }

    async request(endpoint, options = {}) {
        const url = `${this.baseURL}${endpoint}`;
        
        try {
            const response = await fetch(url, {
                ...options,
                headers: {
                    ...this.getHeaders(),
                    ...options.headers
                }
            });

            // Handle 401 Unauthorized - clear token and redirect to login
            if (response.status === 401) {
                console.warn('⚠️ Unauthorized - clearing token');
                this.setToken(null);
                localStorage.removeItem('token');
                // Redirect to login if dashboard is shown
                if (document.getElementById('dashboard')?.style.display === 'block') {
                    document.getElementById('authContainer').style.display = 'block';
                    document.getElementById('dashboard').style.display = 'none';
                }
                throw new Error('Authentication required. Please login again.');
            }

            if (!response.ok) {
                const error = await response.json().catch(() => ({ error: 'Request failed' }));
                throw new Error(error.error || error.message || `HTTP ${response.status}`);
            }

            return response.json();
        } catch (error) {
            console.error('API Request Error:', error);
            throw error;
        }
    }

    // ===== AUTH ENDPOINTS =====
    async login(email, password) {
        return this.request('/auth/login', {
            method: 'POST',
            body: JSON.stringify({ email, password })
        });
    }

    async signup(email, password, name) {
        return this.request('/auth/register', {
            method: 'POST',
            body: JSON.stringify({ email, password, name })
        });
    }

    async getUser() {
        return this.request('/auth/me');
    }

    // ===== ACTIVITY ENDPOINTS =====
    async getTodayActivities() {
        const data = await this.request('/activities/today');
        return data.activities || [];
    }

    async addActivity(activity) {
        return this.request('/activities/add', {
            method: 'POST',
            body: JSON.stringify(activity)
        });
    }

    async deleteActivity(id) {
        return this.request(`/activities/${id}`, {
            method: 'DELETE'
        });
    }

    async getActivitiesRange(startDate, endDate) {
        const data = await this.request(`/activities/range?startDate=${startDate}&endDate=${endDate}`);
        return data.activities || [];
    }

    // ===== ANALYTICS ENDPOINTS =====
    async getTodayAnalysis() {
        return this.request('/analytics/today');
    }

    async comparePeriods(period1, period2) {
        return this.request(`/analytics/compare?period1=${period1}&period2=${period2}`);
    }

    async getRecommendations() {
        return this.request('/analytics/recommendations');
    }

    async getWeeklyAnalytics() {
        return this.request('/analytics/weekly');
    }

    // ===== PUSH NOTIFICATIONS =====
    async savePushSubscription(subscription) {
        return this.request('/auth/push-subscription', {
            method: 'POST',
            body: JSON.stringify({ subscription })
        });
    }
}

// Create global instance
window.APIClient = APIClient;