# Crypto Dashboard

A modern, responsive cryptocurrency dashboard built with HTML, CSS, JavaScript, and Tailwind CSS. Features dark/light mode toggle, smooth animations, and a clean interface for cryptocurrency tracking.

## 🚀 Features

- **Responsive Design**: Works seamlessly on desktop, tablet, and mobile devices
- **Dark/Light Mode**: Toggle between themes with smooth transitions and forced background controls
- **Simulated Data**: Mock cryptocurrency data with periodic updates
- **Modern UI**: Clean, elegant design with smooth animations and custom styling
- **Search Functionality**: Search through cryptocurrency list
- **Portfolio Tracking**: View portfolio performance and statistics
- **Transaction History**: Track recent transactions with status indicators
- **Demo Page**: Separate demo landing page

## 🛠️ Tech Stack

- **HTML5**: Semantic markup structure
- **Tailwind CSS**: Utility-first CSS framework (via CDN)
- **CSS3**: Custom styles and animations
- **JavaScript (ES6+)**: Modern JavaScript for interactivity
- **AOS**: Animate On Scroll library
- **Font Awesome**: Icon library

## 📁 Project Structure

```
crypto-dashboard/
├── index.html          # Main dashboard application
├── demo.html           # Demo landing page
├── js/
│   └── app.js          # Main JavaScript application logic
├── css/
│   └── styles.css      # Custom CSS styles and animations
├── tailwind.config.js  # Tailwind configuration
└── README.md           # Project documentation
```

## 🚀 Getting Started

### Quick Start (No Build Required)

Simply open `index.html` in your web browser. The project uses CDN links for all dependencies, so no build process is required.

### Alternative: Demo Page

Open `demo.html` for a simple landing page demo of the project.

## 🎨 Features Overview

### Dashboard Components

1. **Navigation Header**
   - Logo and branding
   - Search functionality
   - Theme toggle button
   - User profile section

2. **Sidebar Navigation**
   - Dashboard overview
   - Portfolio management
   - Transaction history
   - Market analysis
   - News section
   - Settings

3. **Statistics Cards**
   - Total portfolio value
   - 24h change percentage
   - Best performing asset
   - Active trades count

4. **Portfolio Visualization**
   - Static SVG graphics for portfolio representation
   - Theme-aware colors

5. **Cryptocurrency List**
   - Mock cryptocurrency data
   - Simulated price updates
   - Price change indicators
   - Search and filter options

6. **Transaction Table**
   - Recent transaction history
   - Status indicators
   - Asset information
   - Date and amount details

### Interactive Features

- **Theme Switching**: Seamless dark/light mode toggle with forced background controls
- **Simulated Updates**: Mock data updates to simulate live prices
- **Smooth Animations**: CSS transitions and JavaScript animations using AOS
- **Responsive Design**: Mobile-first approach with Tailwind breakpoints
- **Search Functionality**: Filter cryptocurrencies by name or symbol

## 🎯 Customization

### Adding New Cryptocurrencies

Edit the mock data in `js/app.js` by modifying the `loadMockData()` method:

```javascript
// Add to the cryptoData array
{
    id: 'new-crypto',
    name: 'New Crypto',
    symbol: 'NEW',
    price: 100.00,
    change24h: 5.25,
    icon: 'fas fa-coins',
    color: '#ff6b6b'
}
```

### Modifying Colors

Update the color scheme in `tailwind.config.js`:

```javascript
colors: {
    primary: {
        500: '#your-color',
        // ... other shades
    }
}
```

### Adding Custom Styles

Extend the styling in `css/styles.css` for additional customizations.

## 📱 Responsive Breakpoints

- **Mobile**: < 768px
- **Tablet**: 768px - 1024px  
- **Desktop**: > 1024px

## 🔧 Configuration

### Theme System

The project includes a robust theme system with forced background controls to ensure proper dark/light mode display. Theme preference is saved in localStorage.

### Mock Data

The dashboard currently uses simulated cryptocurrency data. All data updates are mock simulations for demonstration purposes.

## 🎨 Design Principles

- **Minimalism**: Clean, uncluttered interface
- **Consistency**: Uniform spacing, typography, and color usage
- **Accessibility**: High contrast ratios and keyboard navigation
- **Performance**: Optimized animations and efficient DOM updates
- **User Experience**: Intuitive navigation and clear visual hierarchy

## 🚀 Performance Features

- Smooth CSS transitions with cubic-bezier easing
- Custom scrollbar styling for better UX
- Loading animations and shimmer effects
- Optimized theme switching with forced background controls
- AOS scroll animations for enhanced interactivity

## 📊 Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## 🙏 Acknowledgments

- **Tailwind CSS** for the utility-first CSS framework
- **Font Awesome** for comprehensive icon library
- **AOS** for scroll animations