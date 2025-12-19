# SiteSage - Automated SEO Performance Analyzer

A modern, production-grade web platform that analyzes website URLs for SEO and performance quality.

## Features

- **Authentication**: Secure email/password authentication with JWT tokens
- **URL Analysis**: Analyze up to 5 URLs simultaneously
- **JavaScript Rendering**: Choose between standard HTML or full JS rendering
- **AI-Powered Insights**: Custom and standard analysis with AI recommendations
- **Real-time Updates**: Auto-polling for audit status updates
- **Dark/Light Theme**: Beautiful modern UI with theme switching
- **Responsive Design**: Fully responsive across all devices

## Tech Stack

- **Frontend**: Next.js 16, React 19, TailwindCSS v4
- **UI Components**: shadcn/ui
- **State Management**: React hooks with SWR-like patterns
- **Authentication**: JWT tokens with localStorage
- **API Integration**: RESTful API with FastAPI backend

## Getting Started

### Prerequisites

- Node.js 18+ 
- Backend API running (see backend documentation)

### Installation

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up environment variables:
   ```env
   NEXT_PUBLIC_API_URL=your_backend_api_url
   ```

4. Run the development server:
   ```bash
   npm run dev
   ```

5. Open [http://localhost:3000](http://localhost:3000)

## API Configuration

Update the `NEXT_PUBLIC_API_URL` environment variable to point to your FastAPI backend:

```env
NEXT_PUBLIC_API_URL=https://your-api-domain.com
```

## Features in Detail

### Authentication
- Sign up with email and password
- Secure token-based authentication
- Automatic token storage and management
- Protected dashboard routes

### SEO Analysis
- Input up to 5 URLs for batch analysis
- Choose JavaScript rendering mode
- Select standard or custom AI analysis
- Real-time status updates with auto-polling
- Detailed metrics and insights display

### Dashboard
- View all audit history
- Filter and search capabilities
- Detailed audit reports with:
  - SEO scores
  - Performance metrics
  - AI-generated insights
  - Actionable recommendations

## Deployment

Deploy to Vercel with one click:

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new)

Or manually:

```bash
npm run build
npm start
```

## License

MIT
