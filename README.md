# Telco - Carrier Management

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

## Getting Started on Windows

This guide will walk you through setting up and running the project on your Windows computer, even if you're new to web development.

### 1. Install Required Tools

Before you begin, you need two free tools: Node.js and Git.

*   **Node.js:** This project requires Node.js version `22.17.1`. The easiest way to get the correct version is to download and install the **LTS** version from the [official Node.js website](https://nodejs.org/en/download). This also installs the necessary package managers.
*   **Git:** This tool is used to copy the project files to your computer. Download and install it from the [Git for Windows website](https://git-scm.com/download/win).

You will run the following commands in a terminal. You can open one by searching for **PowerShell** or **Command Prompt** in your Start Menu.

### 2. Get the Project Code

1.  **Copy the project files** to your computer by running this command in your terminal. Replace `<repository-url>` with the URL you find on the project's GitHub page under the "Code" button.
    ```powershell
    git clone <repository-url>
    ```

2.  **Navigate into the project folder:**
    ```powershell
    cd tem-portal
    ```

### 3. Install and Run the Project

We'll use PNPM, a fast and efficient package manager.

1.  **Enable `corepack`** (a tool included with Node.js) to manage package manager versions:
    ```powershell
    corepack enable
    ```

2.  **Set up PNPM:**
    ```powershell
    corepack prepare pnpm@latest --activate
    ```

3.  **Install project dependencies.** This downloads all the necessary libraries the project needs to run.
    ```powershell
    pnpm install
    ```

4.  **Start the development server.** This runs the website on your local machine.
    ```powershell
    pnpm dev
    ```

5.  **View the website.** Open your web browser and go to the following address: `http://localhost:4321`. You should see the application running.

### 4. (Optional) Build for Production

If you want to create a folder of optimized files for deployment to a web server, run the following command. The output will be placed in a `dist` folder.

```powershell
pnpm build
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
