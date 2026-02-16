# Kinexus App - Modern React Application with Tailwind CSS

A beautiful, modern React application built with **Tailwind CSS**, featuring a responsive design, smooth navigation, and multiple interactive pages.

## Features

✨ **Modern Design** - Built with Tailwind CSS for beautiful, responsive UI
🚀 **Fast Performance** - Optimized React components with lazy loading
📱 **Fully Responsive** - Works perfectly on desktop, tablet, and mobile devices
🎨 **Beautiful Animations** - Smooth transitions and hover effects
📦 **Component-Based** - Reusable components for easy maintenance
🔗 **React Router** - Multi-page navigation with client-side routing
⚡ **Development Ready** - Hot reload and modern development tools

## Tech Stack

- **React** 18.2.0 - UI Library
- **Tailwind CSS** 3.3.6 - Utility-first CSS framework
- **React Router** 6.20.0 - Client-side routing
- **React Icons** 4.12.0 - Beautiful icon library
- **PostCSS** - CSS processing

## Project Structure

```
kinexus-app/
├── src/
│   ├── components/
│   │   ├── Navigation.js      - Top navigation bar
│   │   ├── Hero.js            - Hero section
│   │   └── Features.js        - Features showcase
│   ├── pages/
│   │   ├── Dashboard.js       - Dashboard page
│   │   ├── About.js           - About page
│   │   └── Contact.js         - Contact page
│   ├── App.js                 - Main app component
│   ├── index.js               - React entry point
│   └── index.css              - Global styles
├── public/
│   └── index.html             - HTML template
├── Dockerfile                 - Container configuration
├── docker-compose.yml         - Multi-container setup
├── tailwind.config.js         - Tailwind configuration
├── postcss.config.js          - PostCSS configuration
└── package.json               - Dependencies

```

## Getting Started

### Prerequisites

- Docker & Docker Compose installed
- Or Node.js 16+ and npm

### Option 1: Using Docker Compose (Recommended)

```bash
cd kinexus-app
docker-compose up -d
```

The application will be available at: **http://localhost:3001**

### Option 2: Local Development

```bash
cd kinexus-app
npm install
npm start
```

The application will open at: **http://localhost:3000**

## Available Pages

- **Home** (`/`) - Landing page with hero section and features
- **Dashboard** (`/dashboard`) - Analytics and metrics dashboard
- **About** (`/about`) - About page with team information
- **Contact** (`/contact`) - Contact form and information

## Available Scripts

- `npm start` - Start development server
- `npm build` - Build for production
- `npm test` - Run tests
- `docker-compose up` - Start with Docker
- `docker-compose down` - Stop Docker containers

## Customization

### Colors

Edit `tailwind.config.js` to customize the color scheme:

```javascript
colors: {
  primary: '#6366f1',      // Change primary color
  secondary: '#8b5cf6',    // Change secondary color
  accent: '#ec4899',       // Change accent color
}
```

### Fonts

Modify the font family in `tailwind.config.js`:

```javascript
fontFamily: {
  sans: ['Your Font Here', 'sans-serif'],
}
```

## Stopping the Application

```bash
# Using Docker Compose
docker-compose down

# Local development
Press Ctrl+C in the terminal
```

## Build for Production

```bash
npm run build
```

This creates an optimized production build in the `build` folder.

## License

MIT

## Support

For issues and questions, please reach out at contact@kinexus.com

---

**Made with ❤️ using React & Tailwind CSS**
