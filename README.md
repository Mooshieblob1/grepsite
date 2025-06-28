# BlobLogic - Carrier Management

A modern, responsive web application for telecommunications expense management (TEM) built with Astro and Tailwind CSS.

## Features

- 📊 **Dashboard Analytics** - Real-time carrier cost and service distribution charts
- 🏢 **Carrier Management** - Comprehensive carrier overview with search and filtering
- 📱 **Responsive Design** - Mobile-first approach with collapsible sidebar
- 🎨 **Modern UI** - Beautiful interface with smooth animations and hover effects
- 📈 **Interactive Charts** - Cost analysis and service distribution visualizations

## Tech Stack

- **Astro** - Static site generator with partial hydration
- **Tailwind CSS** - Utility-first CSS framework
- **Chart.js** - Interactive charts and data visualization
- **Font Awesome** - Icon library

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn package manager

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd tem-portal
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

4. Open your browser and navigate to `http://localhost:4321`

### Build for Production

```bash
npm run build
```

The built files will be in the `dist/` directory, ready for deployment.

### Preview Production Build

```bash
npm run preview
```

## Project Structure

```
/
├── public/
│   ├── styles/
│   │   └── main.css          # Custom CSS styles
│   └── scripts/
│       └── main.js           # JavaScript functionality
├── src/
│   └── pages/
│       └── index.astro       # Main page component
├── astro.config.mjs          # Astro configuration
├── tailwind.config.mjs       # Tailwind CSS configuration
└── package.json              # Project dependencies
```

## Features Overview

### Dashboard
- Active carriers count
- Monthly cost tracking
- Service distribution
- Open tickets monitoring

### Carrier Management
- Carrier cards with status indicators
- Search and filter functionality
- Cost and service tracking
- Contract expiration dates

### Charts & Analytics
- Monthly cost by carrier (Bar chart)
- Service distribution (Doughnut chart)
- Interactive tooltips and legends

## Customization

### Styling
- Edit `/public/styles/main.css` for custom styles
- Modify `tailwind.config.mjs` for Tailwind customizations
- Colors and themes can be adjusted in the CSS custom properties

### Data
- Chart data is currently static in `/public/scripts/main.js`
- Replace with API calls to connect to your backend
- Carrier information can be dynamically loaded

### Components
- The main page is in `/src/pages/index.astro`
- Break down into smaller components as needed
- Add new pages in the `/src/pages/` directory

## Deployment

This Astro application can be deployed to various platforms:

### Vercel
```bash
npm run build
# Deploy the dist/ folder to Vercel
```

### Netlify
```bash
npm run build
# Deploy the dist/ folder to Netlify
```

### Static Hosting
```bash
npm run build
# Upload the dist/ folder to your static hosting provider
```

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is licensed under the MIT License.
