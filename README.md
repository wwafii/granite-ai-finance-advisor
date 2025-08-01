# Casha - AI-Powered Financial Analysis Platform

A modern, intelligent financial analysis platform that provides comprehensive insights into your spending patterns, budget optimization, and savings recommendations using advanced AI technology.

## Project Info

**URL**: https://lovable.dev/projects/9f04356e-5001-467f-afbb-fb8fd7fc80ac

## Description

Casha is a comprehensive financial management and analysis platform designed to help users understand their spending patterns, optimize their budgets, and make informed financial decisions. The application combines powerful data processing capabilities with AI-driven insights to provide personalized financial recommendations.

### Key Features

🚀 **Smart File Processing**
- Support for CSV and Excel file uploads
- Automatic currency detection for worldwide currencies (USD, EUR, GBP, JPY, IDR, CNY, INR, KRW, CAD, AUD, and more)
- Intelligent amount parsing with support for various number formats and currency symbols
- Robust error handling for malformed data

💡 **AI-Powered Insights**
- IBM Granite AI integration for intelligent financial analysis
- Personalized spending recommendations
- Automated budget optimization suggestions
- Smart categorization of expenses

📊 **Comprehensive Analytics**
- Interactive charts and visualizations using Recharts
- Real-time savings rate calculation and progress tracking
- Category-wise expense breakdown
- Financial health indicators and trend analysis

🔐 **Secure Authentication**
- Supabase-powered authentication system
- Duplicate email detection and prevention
- Password reset functionality with secure email links
- User profile management

🎨 **Modern UI/UX**
- Fully responsive design for desktop, tablet, and mobile
- Dark/Light theme support with smooth transitions
- Beautiful gradient-based design system
- Intuitive navigation and user experience

## Technologies Used

### Frontend
- **React 18** - Modern React with hooks and functional components
- **TypeScript** - Type-safe development
- **Vite** - Lightning-fast build tool and development server
- **Tailwind CSS** - Utility-first CSS framework for styling
- **Shadcn/ui** - Modern, accessible component library

### Backend & Services
- **Supabase** - Backend-as-a-Service for authentication and database
- **IBM Granite AI** - Advanced AI for financial insights and recommendations
- **Recharts** - Powerful charting library for data visualization

### Data Processing
- **XLSX** - Excel file processing and parsing
- **Custom Currency Engine** - Worldwide currency detection and formatting
- **Advanced Parsing** - Intelligent amount parsing with locale support

### Development Tools
- **ESLint** - Code linting and quality assurance
- **React Router** - Client-side routing
- **React Hook Form** - Form management and validation

## Setup Instructions

### Prerequisites
- Node.js 18+ and npm (install with [nvm](https://github.com/nvm-sh/nvm#installing-and-updating))
- Git for version control

### Installation Steps

1. **Clone the repository**
   ```bash
   git clone <YOUR_GIT_URL>
   cd <YOUR_PROJECT_NAME>
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Setup**
   - The project is pre-configured with Supabase integration
   - No additional environment variables needed for basic functionality

4. **Start development server**
   ```bash
   npm run dev
   ```

5. **Access the application**
   - Open http://localhost:5173 in your browser
   - The application will hot-reload as you make changes

### Building for Production

```bash
npm run build
```

## AI Support & Intelligence

Casha leverages cutting-edge AI technology to provide intelligent financial insights:

### IBM Granite AI Integration
- **Smart Analysis**: Automatically analyzes spending patterns and identifies optimization opportunities
- **Personalized Recommendations**: Provides tailored advice based on individual financial behavior
- **Budget Optimization**: Suggests specific strategies to improve savings rates
- **Trend Prediction**: Identifies financial trends and potential areas of concern

### Intelligent Currency Detection
- **Worldwide Support**: Automatically detects and handles 10+ major currencies
- **Pattern Recognition**: Analyzes transaction descriptions and amounts to determine currency
- **Locale-Aware Formatting**: Properly formats amounts according to regional standards
- **Robust Parsing**: Handles various number formats, separators, and currency symbols

### Data Processing Intelligence
- **Smart Categorization**: Automatically categorizes transactions based on descriptions
- **Error Recovery**: Intelligent handling of malformed or incomplete data
- **Format Flexibility**: Supports various CSV and Excel formats without strict requirements

## How can I edit this code?

There are several ways of editing your application.

**Use Lovable**

Simply visit the [Lovable Project](https://lovable.dev/projects/9f04356e-5001-467f-afbb-fb8fd7fc80ac) and start prompting.

Changes made via Lovable will be committed automatically to this repo.

**Use your preferred IDE**

If you want to work locally using your own IDE, you can clone this repo and push changes. Pushed changes will also be reflected in Lovable.

The only requirement is having Node.js & npm installed - [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating)

Follow these steps:

```sh
# Step 1: Clone the repository using the project's Git URL.
git clone <YOUR_GIT_URL>

# Step 2: Navigate to the project directory.
cd <YOUR_PROJECT_NAME>

# Step 3: Install the necessary dependencies.
npm i

# Step 4: Start the development server with auto-reloading and an instant preview.
npm run dev
```

## What technologies are used for this project?

This project is built with:

- Vite
- TypeScript
- React
- shadcn-ui
- Tailwind CSS

## How can I deploy this project?

Simply open [Lovable](https://lovable.dev/projects/9f04356e-5001-467f-afbb-fb8fd7fc80ac) and click on Share -> Publish.

## Can I connect a custom domain to my Lovable project?

Yes, you can!

To connect a domain, navigate to Project > Settings > Domains and click Connect Domain.

Read more here: [Setting up a custom domain](https://docs.lovable.dev/tips-tricks/custom-domain#step-by-step-guide)
