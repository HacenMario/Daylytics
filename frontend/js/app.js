/**
 * Daylytics - Main Application
 * التطبيق الرئيسي
 */

class DaylyticsApp {
    constructor() {
        this.state = {
            user: null,
            token: localStorage.getItem('token') || null,
            activities: [],
            analysis: null,
            recommendations: [],
            language: localStorage.getItem('preferredLanguage') || 'ar',
            isLoggedIn: false
        };
        
        this.api = new APIClient();
        this.translations = new Translations();
        this.pushManager = new PushManager();
        
        if (this.state.token) {
            this.api.setToken(this.state.token);
        }
        
        this.init();
    }
    
    init() {
        console.log('🚀 Daylytics App Initialized');
        this.setupEventListeners();
        this.loadLanguage();
        this.checkAuth();
        this.setupPushNotifications();
    }
    
    setupPushNotifications() {
        const pushBtn = document.getElementById('enablePushBtn');
        if (pushBtn) {
            pushBtn.addEventListener('click', () => {
                console.log('📝 Enable push clicked');
                this.enablePushNotifications();
            });
        }
    }
    
    loadLanguage() {
        const savedLang = localStorage.getItem('preferredLanguage') || 'ar';
        this.state.language = savedLang;
        document.documentElement.dir = savedLang === 'ar' ? 'rtl' : 'ltr';
        document.documentElement.lang = savedLang;
        
        // Update active language button
        document.querySelectorAll('.lang-btn').forEach(btn => {
            btn.classList.toggle('active', btn.dataset.lang === savedLang);
        });
        
        // Apply translations to all elements with data-i18n
        this.applyTranslations();
    }
    
    applyTranslations() {
        const elements = document.querySelectorAll('[data-i18n]');
        elements.forEach(el => {
            const key = el.dataset.i18n;
            const translation = this.translations.get(key, this.state.language);
            if (translation) {
                el.textContent = translation;
            }
        });
        
        // Also translate placeholders
        document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
            const key = el.dataset.i18nPlaceholder;
            const translation = this.translations.get(key, this.state.language);
            if (translation) {
                el.placeholder = translation;
            }
        });
    }
    
    setupEventListeners() {
        console.log('🔧 Setting up event listeners...');
        
        // Login form
        const loginForm = document.getElementById('loginForm');
        if (loginForm) {
            loginForm.addEventListener('submit', (e) => {
                e.preventDefault();
                console.log('📝 Login form submitted');
                this.handleLogin();
            });
        }
        
        // Signup form
        const signupForm = document.getElementById('signupForm');
        if (signupForm) {
            signupForm.addEventListener('submit', (e) => {
                e.preventDefault();
                console.log('📝 Signup form submitted');
                this.handleSignup();
            });
        }
        
        // Add activity
        const addBtn = document.getElementById('addActivityBtn');
        if (addBtn) {
            addBtn.addEventListener('click', () => {
                console.log('📝 Add activity clicked');
                this.addActivity();
            });
        }
        
        // Logout
        const logoutBtn = document.getElementById('logoutBtn');
        if (logoutBtn) {
            logoutBtn.addEventListener('click', () => {
                console.log('📝 Logout clicked');
                this.logout();
            });
        }
        
        // Language switcher
        document.querySelectorAll('.lang-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                console.log('📝 Language switched to:', btn.dataset.lang);
                this.switchLanguage(btn.dataset.lang);
            });
        });
        
        // Toggle between login and signup
        const goToSignup = document.getElementById('goToSignup');
        if (goToSignup) {
            goToSignup.addEventListener('click', () => {
                console.log('📝 Switch to signup');
                document.getElementById('loginCard').classList.add('hidden');
                document.getElementById('signupCard').classList.remove('hidden');
            });
        }
        
        const goToLogin = document.getElementById('goToLogin');
        if (goToLogin) {
            goToLogin.addEventListener('click', () => {
                console.log('📝 Switch to login');
                document.getElementById('signupCard').classList.add('hidden');
                document.getElementById('loginCard').classList.remove('hidden');
            });
        }
        
        // Refresh analytics
        const refreshBtn = document.getElementById('refreshAnalytics');
        if (refreshBtn) {
            refreshBtn.addEventListener('click', () => {
                console.log('📝 Refresh analytics clicked');
                this.loadDashboardData();
            });
        }
    }
    
    async handleLogin() {
        const email = document.getElementById('loginEmail').value.trim();
        const password = document.getElementById('loginPassword').value.trim();
        
        if (!email || !password) {
            this.showToast(this.translations.get('please_fill_fields', this.state.language), 'warning');
            return;
        }
        
        console.log('🔐 Attempting login for:', email);
        
        try {
            const response = await this.api.login(email, password);
            console.log('✅ Login successful:', response);
            
            this.state.token = response.token;
            this.state.user = response.user;
            this.state.isLoggedIn = true;
            localStorage.setItem('token', response.token);
            this.api.setToken(response.token);
            
            this.showToast(this.translations.get('login_success', this.state.language), 'success');
            this.showDashboard();
            await this.loadDashboardData();
        } catch (error) {
            console.error('❌ Login failed:', error);
            this.showToast(error.message || this.translations.get('login_error', this.state.language), 'error');
        }
    }
    
    async handleSignup() {
        const email = document.getElementById('signupEmail').value.trim();
        const password = document.getElementById('signupPassword').value.trim();
        const name = document.getElementById('signupName').value.trim() || email.split('@')[0];
        
        if (!email || !password) {
            this.showToast(this.translations.get('please_fill_fields', this.state.language), 'warning');
            return;
        }
        
        if (password.length < 6) {
            this.showToast('كلمة المرور يجب أن تكون 6 أحرف على الأقل', 'warning');
            return;
        }
        
        console.log('📝 Attempting signup for:', email);
        
        try {
            const response = await this.api.signup(email, password, name);
            console.log('✅ Signup successful:', response);
            
            this.state.token = response.token;
            this.state.user = response.user;
            this.state.isLoggedIn = true;
            localStorage.setItem('token', response.token);
            this.api.setToken(response.token);
            
            this.showToast(this.translations.get('signup_success', this.state.language), 'success');
            this.showDashboard();
            await this.loadDashboardData();
        } catch (error) {
            console.error('❌ Signup failed:', error);
            this.showToast(error.message || this.translations.get('signup_error', this.state.language), 'error');
        }
    }
    
    checkAuth() {
        const token = localStorage.getItem('token');
        if (token) {
            console.log('🔑 Token found, showing dashboard');
            this.state.token = token;
            this.state.isLoggedIn = true;
            this.api.setToken(token);
            this.showDashboard();
            this.loadDashboardData();
        } else {
            console.log('🔑 No token found, showing login');
            this.showLogin();
        }
    }
    
    async loadDashboardData() {
        if (!this.state.isLoggedIn || !this.state.token) {
            console.warn('⚠️ Not logged in, skipping dashboard load');
            return;
        }
        
        try {
            console.log('📊 Loading dashboard data...');
            
            // Load today's activities
            const activities = await this.api.getTodayActivities();
            this.state.activities = activities || [];
            this.renderActivities(this.state.activities);
            
            // Load analysis
            const analysisData = await this.api.getTodayAnalysis();
            this.state.analysis = analysisData.analysis || {};
            this.state.recommendations = analysisData.recommendations || [];
            this.updateStats(this.state.analysis);
            this.renderInsights(this.state.analysis);
            this.renderRecommendations(this.state.recommendations);
            
            // Load comparison
            try {
                const comparison = await this.api.comparePeriods('today', 'yesterday');
                this.renderComparison(comparison);
            } catch (e) {
                console.warn('Comparison data not available:', e);
            }
            
            console.log('✅ Dashboard data loaded');
        } catch (error) {
            console.error('❌ Failed to load dashboard data:', error);
            if (error.message.includes('Authentication required')) {
                this.showLogin();
                this.showToast('انتهت الجلسة، يرجى تسجيل الدخول مرة أخرى', 'warning');
            } else {
                this.showToast('فشل تحميل البيانات', 'error');
            }
        }
    }
    
    renderActivities(activities) {
        const container = document.getElementById('activityList');
        if (!container) return;
        
        if (!activities || activities.length === 0) {
            container.innerHTML = '<div class="empty-state" data-i18n="no_activities">لا توجد أنشطة مسجلة اليوم</div>';
            this.applyTranslations();
            return;
        }
        
        container.innerHTML = activities.map(activity => `
            <div class="activity-item" data-id="${activity._id}">
                <span class="act-name">${activity.name}</span>
                <span class="act-category">${this.translations.get(activity.category || 'other', this.state.language)}</span>
                <span class="act-dur">${activity.duration} د</span>
                <button class="act-delete" onclick="window.app.deleteActivity('${activity._id}')">
                    <i class="fas fa-trash"></i>
                </button>
            </div>
        `).join('');
    }
    
    updateStats(analysis) {
        if (!analysis) return;
        document.getElementById('statProductivity').textContent = Math.round(analysis.productivity || 0) + '%';
        document.getElementById('statRest').textContent = Math.round(analysis.restScore || 0) + '%';
        document.getElementById('statSleep').textContent = Math.round(analysis.sleepQuality || 0) + '%';
        document.getElementById('statStress').textContent = Math.round(analysis.stressLevel || 0) + '%';
    }
    
    renderInsights(analysis) {
        const container = document.getElementById('insightsContainer');
        if (!container) return;
        
        const insights = analysis.insights || [];
        if (insights.length === 0) {
            container.innerHTML = '<div class="empty-state">لا توجد تحليلات حتى الآن</div>';
            return;
        }
        
        container.innerHTML = insights.map(insight => `
            <div class="insight-card priority-${insight.priority || 1}">
                <div class="insight-title">${insight.title || '📊 تحليل'}</div>
                <div class="insight-description">${insight.description || ''}</div>
                <div class="insight-recommendation">💡 ${insight.recommendation || ''}</div>
            </div>
        `).join('');
    }
    
    renderRecommendations(recommendations) {
        const container = document.getElementById('recommendationsContainer');
        if (!container) return;
        
        if (!recommendations || recommendations.length === 0) {
            container.innerHTML = '<div class="empty-state">لا توجد توصيات</div>';
            return;
        }
        
        container.innerHTML = recommendations.map(rec => `
            <div class="recommendation-card priority-${rec.priority || 'medium'}">
                <div class="rec-category">${this.translations.get(rec.category || 'other', this.state.language)}</div>
                <div class="rec-title">${rec.title || '💡 توصية'}</div>
                <div class="rec-description">${rec.description || ''}</div>
                <div class="rec-action">🔧 ${rec.action || ''}</div>
            </div>
        `).join('');
    }
    
    renderComparison(comparison) {
        const container = document.getElementById('comparisonContainer');
        if (!container) return;
        
        if (!comparison) {
            container.innerHTML = '<div class="empty-state">لا توجد بيانات للمقارنة</div>';
            return;
        }
        
        const p1 = comparison.period1 || {};
        const p2 = comparison.period2 || {};
        const changes = comparison.changes || {};
        const trend = comparison.trend || {};
        
        container.innerHTML = `
            <div class="comparison-grid">
                <div class="period-item">
                    <h4>${this.translations.get(p1.label || 'today', this.state.language)}</h4>
                    <div>${this.translations.get('productivity', this.state.language)}: ${p1.productivity || 0}%</div>
                    <div>${this.translations.get('rest', this.state.language)}: ${p1.rest || 0}%</div>
                </div>
                <div class="comparison-arrow ${trend.productivity === 'up' ? 'trend-up' : 'trend-down'}">
                    ${trend.productivity === 'up' ? '↑' : '↓'} ${Math.abs(changes.productivity || 0).toFixed(1)}%
                </div>
                <div class="period-item">
                    <h4>${this.translations.get(p2.label || 'yesterday', this.state.language)}</h4>
                    <div>${this.translations.get('productivity', this.state.language)}: ${p2.productivity || 0}%</div>
                    <div>${this.translations.get('rest', this.state.language)}: ${p2.rest || 0}%</div>
                </div>
            </div>
            ${(comparison.insights || []).map(i => `
                <div class="comparison-insight">${i.title || ''} - ${i.description || ''}</div>
            `).join('')}
        `;
    }
    
    async addActivity() {
        const name = document.getElementById('actName').value.trim();
        const duration = parseInt(document.getElementById('actDuration').value);
        const startTime = document.getElementById('actStartTime').value || new Date().toTimeString().slice(0, 5);
        const category = document.getElementById('actCategory').value;
        const quality = parseInt(document.getElementById('actQuality').value) || 5;
        
        if (!name || !duration) {
            this.showToast(this.translations.get('please_fill_fields', this.state.language), 'warning');
            return;
        }
        
        try {
            const response = await this.api.addActivity({
                name,
                duration,
                startTime,
                category,
                quality
            });
            
            this.showToast(this.translations.get('activity_added', this.state.language), 'success');
            await this.loadDashboardData();
            
            document.getElementById('actName').value = '';
            document.getElementById('actDuration').value = '';
        } catch (error) {
            console.error('Add activity error:', error);
            this.showToast('فشل إضافة النشاط', 'error');
        }
    }
    
    async deleteActivity(id) {
        if (!confirm(this.translations.get('confirm_delete', this.state.language) || 'هل أنت متأكد من الحذف؟')) {
            return;
        }
        
        try {
            await this.api.deleteActivity(id);
            this.showToast(this.translations.get('activity_deleted', this.state.language), 'success');
            await this.loadDashboardData();
        } catch (error) {
            console.error('Delete activity error:', error);
            this.showToast('فشل حذف النشاط', 'error');
        }
    }
    
    async enablePushNotifications() {
        try {
            const subscription = await this.pushManager.subscribe();
            if (subscription) {
                await this.api.savePushSubscription(subscription);
                this.showToast(this.translations.get('push_enabled', this.state.language), 'success');
                const btn = document.getElementById('enablePushBtn');
                if (btn) {
                    btn.innerHTML = '<i class="fas fa-check-circle"></i> <span data-i18n="push_enabled">الإشعارات مفعلة</span>';
                    btn.style.background = '#2a9d8f';
                    btn.style.color = 'white';
                    this.applyTranslations();
                }
            }
        } catch (error) {
            console.error('Push notification error:', error);
            this.showToast('فشل تفعيل الإشعارات', 'error');
        }
    }
    
    showDashboard() {
        document.getElementById('authContainer').style.display = 'none';
        document.getElementById('dashboard').style.display = 'block';
        this.state.isLoggedIn = true;
    }
    
    showLogin() {
        document.getElementById('authContainer').style.display = 'block';
        document.getElementById('dashboard').style.display = 'none';
        this.state.isLoggedIn = false;
    }
    
    logout() {
        localStorage.removeItem('token');
        this.state.token = null;
        this.state.user = null;
        this.state.isLoggedIn = false;
        this.api.setToken(null);
        this.showLogin();
        this.showToast(this.translations.get('logout_success', this.state.language) || 'تم تسجيل الخروج', 'info');
    }
    
    switchLanguage(lang) {
        this.state.language = lang;
        localStorage.setItem('preferredLanguage', lang);
        document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';
        document.documentElement.lang = lang;
        
        document.querySelectorAll('.lang-btn').forEach(btn => {
            btn.classList.toggle('active', btn.dataset.lang === lang);
        });
        
        this.applyTranslations();
        if (this.state.isLoggedIn) {
            this.loadDashboardData();
        }
    }
    
    showToast(message, type = 'info') {
        const container = document.getElementById('toastContainer');
        if (!container) {
            console.log('Toast:', message, type);
            return;
        }
        
        const toast = document.createElement('div');
        toast.className = `toast ${type}`;
        toast.textContent = message;
        container.appendChild(toast);
        setTimeout(() => toast.remove(), 3000);
    }
}

// Initialize app when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    console.log('📄 DOM loaded, initializing app...');
    window.app = new DaylyticsApp();
});

console.log('✅ app.js loaded successfully');