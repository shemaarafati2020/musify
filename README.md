# Musify - Modern Music Player 🎵

A Spotify-inspired music player built with React, TypeScript, and modern web technologies.

## Features

- 🎧 **Persistent Playback Bar**: Fixed bottom control with play/pause, skip, shuffle, repeat, volume controls
- 🎨 **Spotify-like UI**: Dark theme with signature green accents
- 🔍 **Real-Time Search**: Instant search for tracks, artists, albums
- 📚 **Library Management**: Create, edit, and organize playlists
- 📱 **Responsive Design**: Works seamlessly on all devices
- ⚡ **Modern Stack**: React 19, TypeScript, Vite, Styled-Components

## Tech Stack

### Frontend
- **React 19** - UI framework
- **TypeScript** - Type safety
- **Vite** - Build tool
- **Styled-Components** - CSS-in-JS
- **Zustand** - State management
- **React Router** - Routing
- **Lucide React** - Icons

### Development Tools
- **ESLint** - Linting
- **Prettier** - Code formatting
- **Husky** - Git hooks
- **Vitest** - Unit testing
- **Playwright** - E2E testing
- **TypeScript** - Static typing

### DevOps & Deployment
- **Docker** - Containerization
- **Kubernetes** - Orchestration
- **GitHub Actions** - CI/CD
- **Nginx** - Web server
- **Let's Encrypt** - SSL certificates

## Quick Start

### Prerequisites
- Node.js 20+
- npm or yarn
- Docker (optional)
- kubectl (optional)

### Local Development

1. **Clone the repository**
```bash
git clone https://github.com/your-username/musify.git
cd musify
```

2. **Install dependencies**
```bash
npm install
```

3. **Start development server**
```bash
npm run dev
```

4. **Open your browser**
Navigate to `http://localhost:5173`

### Docker Development

1. **Using Docker Compose**
```bash
docker-compose up -d
```

2. **Access the application**
- Frontend: http://localhost:3000
- Grafana: http://localhost:3001
- MinIO: http://localhost:9001

## Available Scripts

```bash
# Development
npm run dev          # Start development server
npm run preview      # Preview production build

# Build & Deploy
npm run build        # Build for production
npm run type-check   # Run TypeScript type checking

# Code Quality
npm run lint         # Run ESLint
npm run lint:fix     # Fix ESLint issues
npm run format       # Format code with Prettier
npm run format:check # Check code formatting

# Testing
npm run test         # Run tests in watch mode
npm run test:unit    # Run unit tests
npm run test:coverage # Run tests with coverage
npm run test:e2e     # Run E2E tests
npm run test:e2e:ui  # Run E2E tests with UI
```

## Project Structure

```
musify/
├── src/
│   ├── components/     # Reusable UI components
│   │   ├── Sidebar.tsx
│   │   └── PlaybackBar.tsx
│   ├── pages/         # Page components
│   │   ├── Home.tsx
│   │   ├── Search.tsx
│   │   └── Library.tsx
│   ├── store/         # State management
│   │   └── playbackStore.ts
│   ├── types/         # TypeScript definitions
│   │   └── index.ts
│   └── test/          # Test setup
├── k8s/               # Kubernetes manifests
├── .github/workflows/ # GitHub Actions
├── e2e/               # E2E tests
└── monitoring/        # Monitoring configs
```

## Deployment

### Docker

1. **Build the image**
```bash
docker build -t musify .
```

2. **Run the container**
```bash
docker run -p 3000:3000 musify
```

### Kubernetes

1. **Apply manifests**
```bash
kubectl apply -f k8s/
```

2. **Check deployment**
```bash
kubectl get pods -n musify
```

### GitHub Actions

The CI/CD pipeline automatically:
- Lints and tests code
- Builds Docker images
- Deploys to Kubernetes
- Runs security scans
- Performs performance tests

## Environment Variables

Create a `.env.local` file:

```env
VITE_API_URL=http://localhost:8000
VITE_SPOTIFY_CLIENT_ID=your_spotify_client_id
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Run tests and linting
5. Submit a pull request

### Pre-commit Hooks

The project uses Husky for git hooks:
- Runs linting on commit
- Checks code formatting
- Runs unit tests
- Validates types

## Monitoring & Observability

- **Prometheus**: Metrics collection
- **Grafana**: Visualization dashboards
- **Lighthouse CI**: Performance monitoring
- **Sentry**: Error tracking (configured)

## Security

- **Content Security Policy**: Configured in nginx
- **Dependency scanning**: Snyk integration
- **Container security**: Non-root user, read-only filesystem
- **Secrets management**: Kubernetes secrets

## Performance

- **Code splitting**: Automatic with Vite
- **Lazy loading**: Route-based
- **Image optimization**: WebP support
- **Caching**: Nginx static asset caching
- **Bundle analysis**: Available via `npm run build:analyze`

## License

MIT License - see [LICENSE](LICENSE) file for details.

## Acknowledgments

- Inspired by Spotify's web player
- Icons by [Lucide](https://lucide.dev/)
- Built with modern web technologies
