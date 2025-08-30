// Crypto Dashboard JavaScript
class CryptoDashboard {
    constructor() {
        this.isDarkMode = localStorage.getItem('darkMode') === 'true';
        this.cryptoData = [];
        this.allCryptoData = {};
        this.transactions = [];
        this.portfolioChart = null;
        this.currentPeriod = '1D';
        this.currentCryptoPeriod = 'trending';
        this.chartData = {};
        
        this.init();
    }

    init() {
        this.setupTheme();
        this.setupEventListeners();
        this.loadMockData();
        this.initializeCharts();
        this.startDataUpdates();
        
        // Initialize AOS animations
        AOS.init({
            duration: 800,
            easing: 'ease-in-out',
            once: true
        });
    }

    setupTheme() {
        const html = document.documentElement;
        const body = document.body;
        // FORCE WHITE BACKGROUND ON EVERYTHING
        this.forceBackgroundColors();

        if (this.isDarkMode) {
            html.classList.add('dark');
            body.classList.add('dark');
            this.forceDarkMode();
        } else {
            html.classList.remove('dark');
            body.classList.remove('dark');
            this.forceLightMode();
        }
    }
    
    forceLightMode() {
        // Only set essential backgrounds, let CSS classes handle the rest
        document.documentElement.style.backgroundColor = 'white';
        document.body.style.backgroundColor = 'white';
        
        // Clear any dark mode inline styles that might conflict
        const elements = document.querySelectorAll('nav, aside, main, .card');
        elements.forEach(el => {
            el.style.backgroundColor = '';
        });
    }
    
    forceDarkMode() {
        // Only set essential backgrounds, let CSS classes handle the rest
        document.documentElement.style.backgroundColor = '#111827';
        document.body.style.backgroundColor = '#111827';
        
        // Clear any light mode inline styles that might conflict
        const elements = document.querySelectorAll('nav, aside, main, .card');
        elements.forEach(el => {
            el.style.backgroundColor = '';
        });
    }
    
    forceBackgroundColors() {
        // REMOVED - No more universal background forcing
    }

    setupEventListeners() {
        // Theme toggle
        const themeToggle = document.getElementById('themeToggle');
        themeToggle.addEventListener('click', () => this.toggleTheme());

        // Mobile menu toggle
        const mobileMenuToggle = document.getElementById('mobileMenuToggle');
        const mobileSidebar = document.getElementById('mobileSidebar');
        const mobileOverlay = document.getElementById('mobileOverlay');
        const closeMobileMenu = document.getElementById('closeMobileMenu');

        if (mobileMenuToggle && mobileSidebar && mobileOverlay) {
            mobileMenuToggle.addEventListener('click', () => this.toggleMobileMenu());
            mobileOverlay.addEventListener('click', () => this.closeMobileMenu());
            closeMobileMenu.addEventListener('click', () => this.closeMobileMenu());
        }

        // Sidebar navigation
        const sidebarItems = document.querySelectorAll('.sidebar-item');
        sidebarItems.forEach(item => {
            item.addEventListener('click', (e) => this.handleNavigation(e));
        });

        // Search functionality
        const searchInput = document.getElementById('cryptoSearch');
        const mobileSearch = document.getElementById('mobileSearch');
        
        if (searchInput) {
            searchInput.addEventListener('input', (e) => this.handleSearch(e.target.value));
        }
        
        if (mobileSearch) {
            mobileSearch.addEventListener('input', (e) => this.handleSearch(e.target.value));
        }

        // Period buttons
        const periodButtons = document.querySelectorAll('.period-btn');
        periodButtons.forEach(btn => {
            btn.addEventListener('click', (e) => this.handlePeriodChange(e.target.id.split('-')[1]));
        });

        // Crypto period buttons
        const cryptoPeriodButtons = document.querySelectorAll('.crypto-period-btn');
        cryptoPeriodButtons.forEach(btn => {
            btn.addEventListener('click', (e) => this.handleCryptoPeriodChange(e.target.id.split('-')[2]));
        });
    }

    toggleTheme() {
        this.isDarkMode = !this.isDarkMode;
        localStorage.setItem('darkMode', this.isDarkMode);
        
        const html = document.documentElement;
        const body = document.body;
        const themeIcon = document.getElementById('themeIcon');
        
        if (this.isDarkMode) {
            html.classList.add('dark');
            body.classList.add('dark');
            this.forceDarkMode();
            if (themeIcon) {
                themeIcon.className = 'fas fa-sun text-black dark:text-gray-300';
            }
        } else {
            html.classList.remove('dark');
            body.classList.remove('dark');
            this.forceLightMode();
            if (themeIcon) {
                themeIcon.className = 'fas fa-moon text-black dark:text-gray-300';
            }
        }
    }

    handleNavigation(e) {
        // Remove active class from all items
        document.querySelectorAll('.sidebar-item').forEach(item => {
            item.classList.remove('active');
        });
        
        // Add active class to clicked item
        e.currentTarget.classList.add('active');
        
        // Add smooth transition effect
        e.currentTarget.style.transform = 'scale(0.98)';
        setTimeout(() => {
            e.currentTarget.style.transform = 'scale(1)';
        }, 150);
    }

    toggleMobileMenu() {
        const mobileSidebar = document.getElementById('mobileSidebar');
        const mobileOverlay = document.getElementById('mobileOverlay');
        
        if (mobileSidebar && mobileOverlay) {
            mobileSidebar.classList.remove('-translate-x-full');
            mobileOverlay.classList.remove('hidden');
        }
    }

    closeMobileMenu() {
        const mobileSidebar = document.getElementById('mobileSidebar');
        const mobileOverlay = document.getElementById('mobileOverlay');
        
        if (mobileSidebar && mobileOverlay) {
            mobileSidebar.classList.add('-translate-x-full');
            mobileOverlay.classList.add('hidden');
        }
    }

    handleSearch(query) {
        if (!query.trim()) {
            this.renderCryptoList(this.cryptoData);
            return;
        }
        
        const filteredData = this.cryptoData.filter(crypto => 
            crypto.name.toLowerCase().includes(query.toLowerCase()) ||
            crypto.symbol.toLowerCase().includes(query.toLowerCase())
        );
        this.renderCryptoList(filteredData);
        
        // Show search results count
        const cryptoList = document.getElementById('cryptoList');
        if (cryptoList && filteredData.length === 0) {
            cryptoList.innerHTML = `
                <div class="text-center py-8">
                    <i class="fas fa-search text-4xl text-gray-400 mb-4"></i>
                    <p class="text-readable-secondary">No cryptocurrencies found for "${query}"</p>
                    <p class="text-sm text-gray-500 dark:text-gray-400 mt-2">Try searching for Bitcoin, Ethereum, or other coins</p>
                </div>
            `;
        }
    }

    loadMockData() {
        // Mock cryptocurrency data for different categories
        this.allCryptoData = {
            trending: [
                {
                    id: 'bitcoin',
                    name: 'Bitcoin',
                    symbol: 'BTC',
                    price: 43250.67,
                    change24h: 2.45,
                    icon: 'fab fa-bitcoin',
                    color: '#f7931a'
                },
                {
                    id: 'ethereum',
                    name: 'Ethereum',
                    symbol: 'ETH',
                    price: 2678.90,
                    change24h: 5.28,
                    icon: 'fab fa-ethereum',
                    color: '#627eea'
                },
                {
                    id: 'cardano',
                    name: 'Cardano',
                    symbol: 'ADA',
                    price: 0.485,
                    change24h: -1.23,
                    icon: 'fas fa-coins',
                    color: '#0033ad'
                },
                {
                    id: 'solana',
                    name: 'Solana',
                    symbol: 'SOL',
                    price: 98.45,
                    change24h: 8.76,
                    icon: 'fas fa-sun',
                    color: '#9945ff'
                },
                {
                    id: 'polkadot',
                    name: 'Polkadot',
                    symbol: 'DOT',
                    price: 7.23,
                    change24h: -2.15,
                    icon: 'fas fa-circle',
                    color: '#e6007a'
                }
            ],
            gainers: [
                {
                    id: 'chainlink',
                    name: 'Chainlink',
                    symbol: 'LINK',
                    price: 15.67,
                    change24h: 18.45,
                    icon: 'fas fa-link',
                    color: '#2a5ada'
                },
                {
                    id: 'polygon',
                    name: 'Polygon',
                    symbol: 'MATIC',
                    price: 0.89,
                    change24h: 15.23,
                    icon: 'fas fa-shapes',
                    color: '#8247e5'
                },
                {
                    id: 'avalanche',
                    name: 'Avalanche',
                    symbol: 'AVAX',
                    price: 36.78,
                    change24h: 12.67,
                    icon: 'fas fa-mountain',
                    color: '#e84142'
                },
                {
                    id: 'solana',
                    name: 'Solana',
                    symbol: 'SOL',
                    price: 98.45,
                    change24h: 8.76,
                    icon: 'fas fa-sun',
                    color: '#9945ff'
                },
                {
                    id: 'ethereum',
                    name: 'Ethereum',
                    symbol: 'ETH',
                    price: 2678.90,
                    change24h: 5.28,
                    icon: 'fab fa-ethereum',
                    color: '#627eea'
                }
            ],
            losers: [
                {
                    id: 'terra',
                    name: 'Terra Classic',
                    symbol: 'LUNC',
                    price: 0.000089,
                    change24h: -8.45,
                    icon: 'fas fa-globe',
                    color: '#f9d71c'
                },
                {
                    id: 'shiba',
                    name: 'Shiba Inu',
                    symbol: 'SHIB',
                    price: 0.0000089,
                    change24h: -6.78,
                    icon: 'fas fa-dog',
                    color: '#ffa409'
                },
                {
                    id: 'dogecoin',
                    name: 'Dogecoin',
                    symbol: 'DOGE',
                    price: 0.078,
                    change24h: -4.23,
                    icon: 'fab fa-bitcoin',
                    color: '#c2a633'
                },
                {
                    id: 'polkadot',
                    name: 'Polkadot',
                    symbol: 'DOT',
                    price: 7.23,
                    change24h: -2.15,
                    icon: 'fas fa-circle',
                    color: '#e6007a'
                },
                {
                    id: 'cardano',
                    name: 'Cardano',
                    symbol: 'ADA',
                    price: 0.485,
                    change24h: -1.23,
                    icon: 'fas fa-coins',
                    color: '#0033ad'
                }
            ],
            volume: [
                {
                    id: 'bitcoin',
                    name: 'Bitcoin',
                    symbol: 'BTC',
                    price: 43250.67,
                    change24h: 2.45,
                    icon: 'fab fa-bitcoin',
                    color: '#f7931a'
                },
                {
                    id: 'ethereum',
                    name: 'Ethereum',
                    symbol: 'ETH',
                    price: 2678.90,
                    change24h: 5.28,
                    icon: 'fab fa-ethereum',
                    color: '#627eea'
                },
                {
                    id: 'tether',
                    name: 'Tether',
                    symbol: 'USDT',
                    price: 1.00,
                    change24h: 0.01,
                    icon: 'fas fa-dollar-sign',
                    color: '#26a17b'
                },
                {
                    id: 'binance',
                    name: 'BNB',
                    symbol: 'BNB',
                    price: 315.67,
                    change24h: 3.45,
                    icon: 'fas fa-coins',
                    color: '#f3ba2f'
                },
                {
                    id: 'xrp',
                    name: 'XRP',
                    symbol: 'XRP',
                    price: 0.567,
                    change24h: 1.23,
                    icon: 'fab fa-bitcoin',
                    color: '#23292f'
                }
            ]
        };
        
        // Set initial crypto data
        this.cryptoData = this.allCryptoData[this.currentCryptoPeriod];

        // Mock transaction data
        this.transactions = [
            {
                asset: 'Bitcoin',
                symbol: 'BTC',
                type: 'Buy',
                amount: 0.5,
                price: 43250.67,
                date: '2024-01-15',
                status: 'Completed'
            },
            {
                asset: 'Ethereum',
                symbol: 'ETH',
                type: 'Sell',
                amount: 2.3,
                price: 2678.90,
                date: '2024-01-14',
                status: 'Completed'
            },
            {
                asset: 'Cardano',
                symbol: 'ADA',
                type: 'Buy',
                amount: 1000,
                price: 0.485,
                date: '2024-01-13',
                status: 'Pending'
            },
            {
                asset: 'Solana',
                symbol: 'SOL',
                type: 'Buy',
                amount: 10,
                price: 98.45,
                date: '2024-01-12',
                status: 'Completed'
            }
        ];

        this.renderCryptoList();
        this.renderTransactions();
    }

    renderCryptoList(data = this.cryptoData) {
        const cryptoList = document.getElementById('cryptoList');
        if (!cryptoList) return;

        cryptoList.innerHTML = data.map(crypto => `
            <div class="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-all duration-200 cursor-pointer">
                <div class="flex items-center space-x-3">
                    <div class="w-10 h-10 rounded-full flex items-center justify-center" style="background-color: ${crypto.color}20;">
                        <i class="${crypto.icon} text-lg" style="color: ${crypto.color};"></i>
                    </div>
                    <div>
                        <p class="font-bold text-readable">${crypto.symbol}</p>
                        <p class="text-sm text-readable-secondary font-semibold">${crypto.name}</p>
                    </div>
                </div>
                <div class="text-right">
                    <p class="font-bold text-readable">$${crypto.price.toLocaleString()}</p>
                    <p class="text-sm font-bold ${crypto.change24h >= 0 ? 'price-positive' : 'price-negative'}">
                        ${crypto.change24h >= 0 ? '+' : ''}${crypto.change24h.toFixed(2)}%
                    </p>
                </div>
            </div>
        `).join('');
    }

    renderTransactions() {
        const transactionsList = document.getElementById('transactionsList');
        if (!transactionsList) return;

        transactionsList.innerHTML = this.transactions.map(tx => `
            <tr class="border-b border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200">
                <td class="py-4">
                    <div class="flex items-center space-x-3">
                        <div class="w-8 h-8 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center">
                            <span class="text-xs font-medium">${tx.symbol}</span>
                        </div>
                        <span class="font-bold text-readable">${tx.asset}</span>
                    </div>
                </td>
                <td class="py-4">
                    <span class="px-3 py-1 text-sm font-bold rounded-full ${tx.type === 'Buy' ? 'bg-green-600 text-black dark:bg-green-600 dark:text-white' : 'bg-red-600 text-black dark:bg-red-600 dark:text-white'}">
                        ${tx.type}
                    </span>
                </td>
                <td class="py-4 font-bold text-readable">${tx.amount} ${tx.symbol}</td>
                <td class="py-4 font-bold text-readable">$${tx.price.toLocaleString()}</td>
                <td class="py-4 text-readable-secondary font-semibold">${new Date(tx.date).toLocaleDateString()}</td>
                <td class="py-4">
                    <span class="px-3 py-1 text-sm font-bold rounded-full ${tx.status === 'Completed' ? 'bg-green-600 text-black dark:bg-green-600 dark:text-white' : 'bg-orange-600 text-black dark:bg-orange-600 dark:text-white'}">
                        ${tx.status}
                    </span>
                </td>
            </tr>
        `).join('');
    }

    initializeCharts() {
        // Generate different time period data
        this.generateChartData();
        // Update the SVG chart with current period data
        this.updateSVGChart();
        console.log('Static SVG chart loaded with period data');
    }

    generateChartData() {
        // Generate data for different time periods
        this.chartData = {
            '1D': {
                labels: ['9AM', '10AM', '11AM', '12PM', '1PM', '2PM', '3PM', '4PM', '5PM'],
                values: [24100, 24250, 24180, 24400, 24350, 24500, 24450, 24600, 24567.89]
            },
            '7D': {
                labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
                values: [23800, 24100, 23950, 24300, 24150, 24400, 24567.89]
            },
            '1M': {
                labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4'],
                values: [22500, 23200, 23800, 24567.89]
            },
            '1Y': {
                labels: ['Q1', 'Q2', 'Q3', 'Q4'],
                values: [18500, 21200, 23100, 24567.89]
            }
        };
    }

    updateSVGChart() {
        const data = this.chartData[this.currentPeriod];
        const svgContainer = document.querySelector('.w-full.h-64.relative');
        
        if (!svgContainer || !data) return;

        // Generate SVG path based on current period data
        const points = data.values.map((value, index) => {
            const x = 20 + (index * (760 / (data.values.length - 1)));
            const y = 280 - ((value - Math.min(...data.values)) / (Math.max(...data.values) - Math.min(...data.values))) * 200;
            return `${x} ${y}`;
        }).join(' L ');

        const pathD = `M ${points}`;
        const fillD = `M ${points} L 780 280 L 20 280 Z`;

        svgContainer.innerHTML = `
            <svg viewBox="0 0 800 300" class="w-full h-full">
                <!-- Grid lines -->
                <defs>
                    <pattern id="grid" width="40" height="30" patternUnits="userSpaceOnUse">
                        <path d="M 40 0 L 0 0 0 30" fill="none" stroke="#f3f4f6" stroke-width="1" class="dark:stroke-gray-600"/>
                    </pattern>
                </defs>
                <rect width="100%" height="100%" fill="url(#grid)" />
                
                <!-- Fill area under line -->
                <path d="${fillD}" fill="rgba(59, 130, 246, 0.1)"/>
                
                <!-- Chart line -->
                <path d="${pathD}" 
                      fill="none" 
                      stroke="#3b82f6" 
                      stroke-width="3" 
                      class="drop-shadow-sm"/>
                
                <!-- Y-axis labels -->
                <text x="10" y="60" class="text-xs fill-gray-600 dark:fill-gray-400">$${Math.max(...data.values).toLocaleString()}</text>
                <text x="10" y="160" class="text-xs fill-gray-600 dark:fill-gray-400">$${Math.round((Math.max(...data.values) + Math.min(...data.values)) / 2).toLocaleString()}</text>
                <text x="10" y="260" class="text-xs fill-gray-600 dark:fill-gray-400">$${Math.min(...data.values).toLocaleString()}</text>
                
                <!-- X-axis labels -->
                ${data.labels.map((label, index) => {
                    const x = 20 + (index * (760 / (data.labels.length - 1)));
                    return `<text x="${x}" y="295" class="text-xs fill-gray-600 dark:fill-gray-400 text-center" text-anchor="middle">${label}</text>`;
                }).join('')}
            </svg>
        `;
    }

    handlePeriodChange(period) {
        this.currentPeriod = period;
        
        // Update button states
        document.querySelectorAll('.period-btn').forEach(btn => {
            btn.className = 'period-btn px-3 py-1 text-sm text-black dark:text-gray-400 font-bold rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-all duration-200';
        });
        
        document.getElementById(`period-${period}`).className = 'period-btn px-3 py-1 text-sm bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-400 rounded-lg transition-all duration-200';
        
        // Update chart
        this.updateSVGChart();
        
        // Add smooth transition effect
        const svgContainer = document.querySelector('.w-full.h-64.relative');
        if (svgContainer) {
            svgContainer.style.opacity = '0.7';
            setTimeout(() => {
                svgContainer.style.opacity = '1';
            }, 150);
        }
    }

    handleCryptoPeriodChange(period) {
        this.currentCryptoPeriod = period;
        
        // Update button states
        document.querySelectorAll('.crypto-period-btn').forEach(btn => {
            btn.className = 'crypto-period-btn px-3 py-1 text-xs text-black dark:text-gray-400 font-bold rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-all duration-200';
        });
        
        // Set active button style based on period
        const activeBtn = document.getElementById(`crypto-period-${period}`);
        if (activeBtn) {
            switch(period) {
                case 'trending':
                    activeBtn.className = 'crypto-period-btn px-3 py-1 text-xs bg-green-100 dark:bg-green-900 text-green-600 dark:text-green-400 rounded-lg transition-all duration-200';
                    break;
                case 'gainers':
                    activeBtn.className = 'crypto-period-btn px-3 py-1 text-xs bg-emerald-100 dark:bg-emerald-900 text-emerald-600 dark:text-emerald-400 rounded-lg transition-all duration-200';
                    break;
                case 'losers':
                    activeBtn.className = 'crypto-period-btn px-3 py-1 text-xs bg-red-100 dark:bg-red-900 text-red-600 dark:text-red-400 rounded-lg transition-all duration-200';
                    break;
                case 'volume':
                    activeBtn.className = 'crypto-period-btn px-3 py-1 text-xs bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-400 rounded-lg transition-all duration-200';
                    break;
            }
        }
        
        // Update crypto data and render
        this.cryptoData = this.allCryptoData[period];
        this.renderCryptoList();
        
        // Add smooth transition effect
        const cryptoList = document.getElementById('cryptoList');
        if (cryptoList) {
            cryptoList.style.opacity = '0.7';
            setTimeout(() => {
                cryptoList.style.opacity = '1';
            }, 150);
        }
    }

    updateChartTheme() {
        // COMPLETELY DISABLED - NO CHART UPDATES EVER
        // Chart remains 100% static regardless of theme changes
        return;
    }

    startDataUpdates() {
        // Only update crypto prices - ABSOLUTELY NO CHART UPDATES
        setInterval(() => {
            this.updatePrices();
        }, 5000);
        
        // CHART IS 100% STATIC - NO UPDATES WHATSOEVER
    }

    updatePrices() {
        this.cryptoData.forEach(crypto => {
            // Simulate more realistic price fluctuation (±0.5%)
            const changePercent = (Math.random() - 0.5) * 0.01;
            crypto.price *= (1 + changePercent);
            
            // Keep 24h change within realistic bounds (-20% to +20%)
            const changeAdjustment = (Math.random() - 0.5) * 0.2;
            crypto.change24h += changeAdjustment;
            crypto.change24h = Math.max(-20, Math.min(20, crypto.change24h));
        });

        this.renderCryptoList();
        this.addPriceUpdateAnimation();
    }

    updatePortfolioStats() {
        // REMOVED - Keep portfolio stats completely static
        // No more updates to portfolio value or chart
        // Everything stays exactly as designed
    }

    addPriceUpdateAnimation() {
        const cryptoItems = document.querySelectorAll('#cryptoList > div');
        cryptoItems.forEach((item, index) => {
            setTimeout(() => {
                item.style.transform = 'scale(1.02)';
                item.style.boxShadow = '0 4px 12px rgba(59, 130, 246, 0.15)';
                setTimeout(() => {
                    item.style.transform = 'scale(1)';
                    item.style.boxShadow = 'none';
                }, 300);
            }, index * 100);
        });
    }
}

// Initialize the dashboard when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new CryptoDashboard();
});

// Add smooth scrolling for any anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Add loading animation for cards
window.addEventListener('load', () => {
    const cards = document.querySelectorAll('.card');
    cards.forEach((card, index) => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(20px)';
        
        setTimeout(() => {
            card.style.transition = 'all 0.6s ease';
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
        }, index * 100);
    });
});