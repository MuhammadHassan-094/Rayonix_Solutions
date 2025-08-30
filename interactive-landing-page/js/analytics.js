// Analytics JavaScript - Pure Vanilla Implementation
class AnalyticsSystem {
    constructor() {
        this.data = {
            totalVisitors: 15847,
            pageViews: 45621,
            avgSessionDuration: 342, // seconds
            clickEvents: 8934,
            topPages: [
                { path: '/', views: 15847, duration: '02:45' },
                { path: '/speakers', views: 8923, duration: '01:32' },
                { path: '/agenda', views: 7654, duration: '02:18' },
                { path: '/about', views: 4521, duration: '01:15' },
                { path: '/registration', views: 3789, duration: '03:22' }
            ],
            locations: [
                { country: 'United States', visitors: 4521, percentage: 28.5 },
                { country: 'United Kingdom', visitors: 2847, percentage: 18.0 },
                { country: 'Germany', visitors: 1923, percentage: 12.1 },
                { country: 'Canada', visitors: 1654, percentage: 10.4 },
                { country: 'Australia', visitors: 1235, percentage: 7.8 }
            ]
        };
        
        this.sessionStart = Date.now();
        this.currentSession = this.generateSessionId();
        this.initializeTracking();
        this.renderAnalytics();
        this.updateRealTime();
    }

    generateSessionId() {
        return 'session_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
    }

    initializeTracking() {
        // Track page views
        this.trackPageView();
        
        // Track clicks
        document.addEventListener('click', (e) => {
            this.trackClick(e);
        });
        
        // Track scroll depth
        window.addEventListener('scroll', () => {
            this.trackScrollDepth();
        });
        
        // Track session duration
        window.addEventListener('beforeunload', () => {
            this.trackSessionEnd();
        });
    }

    trackPageView() {
        const pageData = {
            path: window.location.pathname,
            title: document.title,
            timestamp: new Date().toISOString(),
            sessionId: this.currentSession,
            referrer: document.referrer || 'direct'
        };
        
        this.storeAnalyticsData('pageview', pageData);
        this.data.pageViews += 1;
        this.updateCounter('page-views', this.data.pageViews);
    }

    trackClick(event) {
        const clickData = {
            element: event.target.tagName.toLowerCase(),
            text: event.target.textContent?.substring(0, 100) || '',
            className: event.target.className || '',
            id: event.target.id || '',
            timestamp: new Date().toISOString(),
            sessionId: this.currentSession,
            x: event.clientX,
            y: event.clientY
        };
        
        this.storeAnalyticsData('click', clickData);
        this.data.clickEvents += 1;
        this.updateCounter('click-events', this.data.clickEvents);
    }

    trackScrollDepth() {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        const documentHeight = document.documentElement.scrollHeight - window.innerHeight;
        const scrollPercentage = Math.round((scrollTop / documentHeight) * 100);
        
        if (scrollPercentage > 0) {
            this.storeAnalyticsData('scroll', {
                depth: Math.min(scrollPercentage, 100),
                timestamp: new Date().toISOString(),
                sessionId: this.currentSession
            });
        }
    }

    trackSessionEnd() {
        const sessionDuration = Date.now() - this.sessionStart;
        this.storeAnalyticsData('session_end', {
            sessionId: this.currentSession,
            duration: sessionDuration,
            timestamp: new Date().toISOString()
        });
    }

    storeAnalyticsData(eventType, data) {
        try {
            const analyticsData = JSON.parse(localStorage.getItem('analytics_data') || '[]');
            analyticsData.push({
                eventType,
                data,
                timestamp: new Date().toISOString()
            });
            
            // Keep only last 1000 events
            if (analyticsData.length > 1000) {
                analyticsData.splice(0, analyticsData.length - 1000);
            }
            
            localStorage.setItem('analytics_data', JSON.stringify(analyticsData));
        } catch (error) {
            console.error('Error storing analytics data:', error);
        }
    }

    formatDuration(seconds) {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    }

    formatNumber(num) {
        return num.toLocaleString();
    }

    updateCounter(elementId, value) {
        const element = document.getElementById(elementId);
        if (element) {
            if (elementId === 'avg-session') {
                element.textContent = this.formatDuration(value);
            } else {
                element.textContent = this.formatNumber(value);
            }
        }
    }

    animateCounter(elementId, endValue, duration = 2000) {
        const element = document.getElementById(elementId);
        if (!element) return;

        const startValue = 0;
        const startTime = Date.now();
        
        const updateCounter = () => {
            const elapsed = Date.now() - startTime;
            const progress = Math.min(elapsed / duration, 1);
            
            // Easing function
            const easeOut = 1 - Math.pow(1 - progress, 3);
            const currentValue = Math.floor(startValue + (endValue - startValue) * easeOut);
            
            if (elementId === 'avg-session') {
                element.textContent = this.formatDuration(currentValue);
            } else {
                element.textContent = this.formatNumber(currentValue);
            }
            
            if (progress < 1) {
                requestAnimationFrame(updateCounter);
            }
        };
        
        requestAnimationFrame(updateCounter);
    }

    renderAnalytics() {
        // Animate counters
        setTimeout(() => {
            this.animateCounter('total-visitors', this.data.totalVisitors);
            this.animateCounter('page-views', this.data.pageViews);
            this.animateCounter('avg-session', this.data.avgSessionDuration);
            this.animateCounter('click-events', this.data.clickEvents);
        }, 500);

        // Render top pages
        this.renderTopPages();
        
        // Render locations
        this.renderLocations();
    }

    renderTopPages() {
        const container = document.getElementById('top-pages');
        if (!container) return;

        container.innerHTML = '';
        this.data.topPages.forEach((page, index) => {
            const pageElement = document.createElement('div');
            pageElement.className = 'flex items-center justify-between fade-in';
            pageElement.style.animationDelay = `${index * 0.1}s`;
            
            pageElement.innerHTML = `
                <div>
                    <p class="text-white font-medium">${page.path}</p>
                    <p class="text-gray-400 text-sm">${this.formatNumber(page.views)} views</p>
                </div>
                <div class="text-right">
                    <p class="text-blue-400 text-sm">Avg. ${page.duration}</p>
                </div>
            `;
            
            container.appendChild(pageElement);
        });
    }

    renderLocations() {
        const container = document.getElementById('visitor-locations');
        if (!container) return;

        container.innerHTML = '';
        this.data.locations.forEach((location, index) => {
            const locationElement = document.createElement('div');
            locationElement.className = 'flex items-center justify-between fade-in';
            locationElement.style.animationDelay = `${index * 0.1}s`;
            
            locationElement.innerHTML = `
                <div class="flex items-center">
                    <svg class="w-4 h-4 text-blue-400 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path>
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path>
                    </svg>
                    <span class="text-white">${location.country}</span>
                </div>
                <div class="flex items-center">
                    <div class="w-32 bg-gray-700 rounded-full h-2 mr-3">
                        <div class="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full progress-bar" 
                             style="width: 0%; transition-delay: ${index * 0.2}s;" 
                             data-width="${location.percentage}%"></div>
                    </div>
                    <span class="text-gray-300 text-sm w-16 text-right">
                        ${this.formatNumber(location.visitors)}
                    </span>
                </div>
            `;
            
            container.appendChild(locationElement);
            
            // Animate progress bar
            setTimeout(() => {
                const progressBar = locationElement.querySelector('.progress-bar');
                if (progressBar) {
                    progressBar.style.width = progressBar.getAttribute('data-width');
                }
            }, 500 + (index * 200));
        });
    }

    updateRealTime() {
        const updateTime = () => {
            const now = new Date();
            const timeString = now.toLocaleTimeString();
            const lastUpdatedElement = document.getElementById('last-updated');
            if (lastUpdatedElement) {
                lastUpdatedElement.textContent = timeString;
            }
        };
        
        updateTime();
        setInterval(updateTime, 1000);
        
        // Simulate real-time data updates
        setInterval(() => {
            this.simulateRealTimeUpdates();
        }, 10000); // Update every 10 seconds
    }

    simulateRealTimeUpdates() {
        // Simulate small increases in metrics
        const increases = {
            totalVisitors: Math.floor(Math.random() * 5) + 1,
            pageViews: Math.floor(Math.random() * 10) + 2,
            clickEvents: Math.floor(Math.random() * 8) + 1
        };
        
        this.data.totalVisitors += increases.totalVisitors;
        this.data.pageViews += increases.pageViews;
        this.data.clickEvents += increases.clickEvents;
        
        // Update display with smooth animation
        this.updateCounter('total-visitors', this.data.totalVisitors);
        this.updateCounter('page-views', this.data.pageViews);
        this.updateCounter('click-events', this.data.clickEvents);
    }
}

// Tab functionality
function showTab(tabName) {
    // Hide all tab contents
    const tabContents = document.querySelectorAll('.tab-content');
    tabContents.forEach(content => {
        content.classList.add('hidden');
    });
    
    // Remove active class from all tabs
    const tabButtons = document.querySelectorAll('.tab-btn');
    tabButtons.forEach(btn => {
        btn.classList.remove('active', 'bg-blue-600', 'text-white', 'shadow-lg');
        btn.classList.add('text-gray-300');
    });
    
    // Show selected tab content
    const selectedContent = document.getElementById(`${tabName}-content`);
    if (selectedContent) {
        selectedContent.classList.remove('hidden');
    }
    
    // Add active class to selected tab
    const selectedTab = document.getElementById(`tab-${tabName}`);
    if (selectedTab) {
        selectedTab.classList.add('active', 'bg-blue-600', 'text-white', 'shadow-lg');
        selectedTab.classList.remove('text-gray-300');
    }
}

// Add CSS for active tab
const style = document.createElement('style');
style.textContent = `
    .tab-btn {
        color: #d1d5db;
    }
    .tab-btn:hover {
        color: white;
        background-color: rgba(255, 255, 255, 0.1);
    }
    .tab-btn.active {
        background-color: #2563eb !important;
        color: white !important;
        box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1) !important;
    }
`;
document.head.appendChild(style);

// Initialize analytics when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.analytics = new AnalyticsSystem();
    
    // Show overview tab by default
    showTab('overview');
});

// Export for global use
window.AnalyticsSystem = AnalyticsSystem;
window.showTab = showTab;
