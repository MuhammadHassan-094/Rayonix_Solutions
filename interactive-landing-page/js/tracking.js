// Basic Analytics Tracking for TechVision 2024
class BasicAnalytics {
    constructor() {
        this.sessionId = this.generateSessionId();
        this.sessionStart = Date.now();
        this.pageViews = 0;
        this.clickCount = 0;
        this.scrollDepth = 0;
        
        this.initTracking();
    }
    
    generateSessionId() {
        return 'session_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
    }
    
    initTracking() {
        // Track page load
        this.trackPageView();
        
        // Track clicks
        document.addEventListener('click', (e) => {
            this.trackClick(e);
        });
        
        // Track scroll depth
        let ticking = false;
        window.addEventListener('scroll', () => {
            if (!ticking) {
                requestAnimationFrame(() => {
                    this.updateScrollDepth();
                    ticking = false;
                });
                ticking = true;
            }
        });
        
        // Track session end
        window.addEventListener('beforeunload', () => {
            this.trackSessionEnd();
        });
        
        // Store device info
        this.storeDeviceInfo();
    }
    
    trackPageView() {
        this.pageViews++;
        const pageData = {
            path: window.location.pathname,
            title: document.title,
            timestamp: new Date().toISOString(),
            sessionId: this.sessionId,
            referrer: document.referrer || 'direct'
        };
        
        this.storeEvent('pageview', pageData);
        console.log('📊 Page view tracked:', pageData);
    }
    
    trackClick(event) {
        this.clickCount++;
        const clickData = {
            element: event.target.tagName.toLowerCase(),
            text: event.target.textContent?.substring(0, 50) || '',
            className: event.target.className || '',
            id: event.target.id || '',
            timestamp: new Date().toISOString(),
            sessionId: this.sessionId
        };
        
        this.storeEvent('click', clickData);
        
        // Log important clicks
        if (event.target.classList.contains('cta-button') || 
            event.target.textContent.includes('Register') ||
            event.target.href) {
            console.log('🎯 Important click tracked:', clickData);
        }
    }
    
    updateScrollDepth() {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        const documentHeight = document.documentElement.scrollHeight - window.innerHeight;
        const currentDepth = Math.round((scrollTop / documentHeight) * 100);
        
        if (currentDepth > this.scrollDepth) {
            this.scrollDepth = Math.min(currentDepth, 100);
            
            // Track milestone depths
            const milestones = [25, 50, 75, 100];
            const milestone = milestones.find(m => currentDepth >= m && this.scrollDepth >= m);
            
            if (milestone && !this.hasTrackedMilestone(milestone)) {
                this.storeEvent('scroll_milestone', {
                    depth: milestone,
                    timestamp: new Date().toISOString(),
                    sessionId: this.sessionId
                });
                console.log(`📏 Scroll milestone reached: ${milestone}%`);
            }
        }
    }
    
    hasTrackedMilestone(milestone) {
        const events = this.getStoredEvents();
        return events.some(event => 
            event.eventType === 'scroll_milestone' && 
            event.data.depth === milestone &&
            event.data.sessionId === this.sessionId
        );
    }
    
    trackSessionEnd() {
        const sessionDuration = Date.now() - this.sessionStart;
        const sessionData = {
            sessionId: this.sessionId,
            duration: sessionDuration,
            pageViews: this.pageViews,
            clickCount: this.clickCount,
            maxScrollDepth: this.scrollDepth,
            timestamp: new Date().toISOString()
        };
        
        this.storeEvent('session_end', sessionData);
        console.log('⏱️ Session ended:', sessionData);
    }
    
    storeDeviceInfo() {
        const deviceInfo = {
            userAgent: navigator.userAgent,
            screenWidth: window.screen.width,
            screenHeight: window.screen.height,
            windowWidth: window.innerWidth,
            windowHeight: window.innerHeight,
            isMobile: /Mobile|Android|iPhone|iPad/.test(navigator.userAgent),
            language: navigator.language,
            timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
            timestamp: new Date().toISOString(),
            sessionId: this.sessionId
        };
        
        this.storeEvent('device_info', deviceInfo);
    }
    
    storeEvent(eventType, data) {
        try {
            const events = this.getStoredEvents();
            events.push({
                eventType,
                data,
                timestamp: new Date().toISOString()
            });
            
            // Keep only last 1000 events
            if (events.length > 1000) {
                events.splice(0, events.length - 1000);
            }
            
            localStorage.setItem('techvision_analytics', JSON.stringify(events));
        } catch (error) {
            console.error('Error storing analytics:', error);
        }
    }
    
    getStoredEvents() {
        try {
            return JSON.parse(localStorage.getItem('techvision_analytics') || '[]');
        } catch (error) {
            console.error('Error reading analytics:', error);
            return [];
        }
    }
    
    // Method to get analytics summary
    getSummary() {
        const events = this.getStoredEvents();
        const sessions = [...new Set(events.map(e => e.data.sessionId))];
        
        return {
            totalEvents: events.length,
            totalSessions: sessions.length,
            pageViews: events.filter(e => e.eventType === 'pageview').length,
            clicks: events.filter(e => e.eventType === 'click').length,
            currentSession: {
                id: this.sessionId,
                duration: Date.now() - this.sessionStart,
                pageViews: this.pageViews,
                clicks: this.clickCount,
                scrollDepth: this.scrollDepth
            }
        };
    }
}

// Initialize analytics when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    window.techVisionAnalytics = new BasicAnalytics();
    
    // Display analytics info in console
    console.log('%c🚀 TechVision 2024 Analytics Initialized', 'color: #2563eb; font-weight: bold; font-size: 14px;');
    console.log('To view analytics dashboard, visit: analytics.html');
    console.log('Analytics data is stored locally and privacy-compliant.');
    
    // Optional: Display analytics summary every 30 seconds in development
    if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
        setInterval(() => {
            const summary = window.techVisionAnalytics.getSummary();
            console.log('📊 Analytics Summary:', summary);
        }, 30000);
    }
});

// Expose analytics for global access
window.BasicAnalytics = BasicAnalytics;
