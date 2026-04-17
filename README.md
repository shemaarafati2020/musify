# Musify - Modern Music Player 🎵

A Spotify-inspired music streaming platform with a React frontend and Node.js/Express backend.

## Features

- 🎧 **Persistent Playback Bar**: Fixed bottom control with play/pause, skip, shuffle, repeat, volume controls
- 🎨 **Spotify-like UI**: Dark theme with signature green accents
- 🔍 **Real-Time Search**: Instant search for tracks, artists, albums
- 📚 **Library Management**: Create, edit, and organize playlists
- 📱 **Responsive Design**: Works seamlessly on all devices
- 🔐 **Authentication**: JWT-based auth with role-based access control
- 🗄️ **PostgreSQL Database**: Full relational data model with Prisma ORM
- ⚡ **Modern Stack**: React 19, TypeScript, Vite, Express, PostgreSQL, Redis

## Tech Stack

### Frontend (`frontend/`)
- **React 19** - UI framework
- **TypeScript** - Type safety
- **Vite** - Build tool
- **Styled-Components** - CSS-in-JS
- **Zustand** - State management
- **React Router** - Routing
- **Lucide React** - Icons
- **Vitest** - Unit testing
- **Playwright** - E2E testing

### Backend (`backend/`)
- **Node.js + Express** - REST API server
- **PostgreSQL** - Relational database
- **Prisma ORM** - Database toolkit with migrations
- **Redis** - Caching layer
- **JWT** - Authentication with refresh token rotation
- **bcryptjs** - Password hashing
- **Winston** - Structured logging
- **Jest + Supertest** - API testing (48 tests)

### DevOps & Deployment
- **Docker** - Containerization
- **Kubernetes** - Orchestration
- **GitHub Actions** - CI/CD (frontend + backend pipelines)
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
git clone https://github.com/shemaarafati2020/musify.git
cd musify
```

2. **Start the frontend**
```bash
cd frontend
npm install
npm run dev
```
Navigate to `http://localhost:5173`

3. **Start the backend**
```bash
cd backend
npm install
cp .env.example .env   # Edit with your DB credentials
npx prisma migrate dev
npx prisma db seed
npm run dev
```
API available at `http://localhost:8000`

### Docker Development

1. **Using Docker Compose**
```bash
docker-compose up -d
```

2. **Access the application**
- Frontend: http://localhost:3000
- Backend API: http://localhost:8000
- Grafana: http://localhost:3001
- MinIO: http://localhost:9001

## Available Scripts

### Frontend (`cd frontend`)
```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run type-check   # Run TypeScript type checking
npm run lint         # Run ESLint
npm run format       # Format code with Prettier
npm run test:unit    # Run unit tests
npm run test:e2e     # Run E2E tests
```

### Backend (`cd backend`)
```bash
npm run dev          # Start with nodemon hot-reload
npm start            # Start production server
npm test             # Run all API tests (48 tests)
npm run db:migrate   # Run Prisma migrations
npm run db:seed      # Seed database with sample data
npm run db:studio    # Open Prisma Studio GUI
```

## Project Structure

```
musify/
├── frontend/              # React frontend application
│   ├── src/
│   │   ├── components/    # Reusable UI components
│   │   ├── pages/         # Page components
│   │   ├── store/         # Zustand state management
│   │   ├── types/         # TypeScript definitions
│   │   ├── contexts/      # React contexts
│   │   ├── hooks/         # Custom hooks
│   │   └── services/      # Frontend services
│   ├── e2e/               # Playwright E2E tests
│   ├── public/            # Static assets
│   └── package.json
├── backend/               # Node.js/Express API
│   ├── src/
│   │   ├── config/        # App, DB, Redis, logger config
│   │   ├── controllers/   # Route handlers
│   │   ├── middleware/     # Auth, validation, error handling
│   │   ├── routes/        # Express route definitions
│   │   ├── services/      # Business logic
│   │   └── __tests__/     # Jest API tests
│   ├── prisma/            # Schema, migrations, seed
│   └── package.json
├── k8s/                   # Kubernetes manifests
├── .github/workflows/     # CI/CD pipelines
├── docker-compose.yml     # Full stack dev environment
└── README.md
```

## Deployment

### Docker

1. **Build the frontend image**
```bash
docker build -t musify-frontend ./frontend
```

2. **Run the container**
```bash
docker run -p 3000:3000 musify-frontend
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

### Frontend (`frontend/.env.local`)
```env
VITE_API_URL=http://localhost:8000
```

### Backend (`backend/.env`)
```env
DATABASE_URL=postgresql://musify:password@localhost:5432/musify
REDIS_URL=redis://localhost:6379
JWT_SECRET=your-secret-key
JWT_REFRESH_SECRET=your-refresh-secret
CORS_ORIGIN=http://localhost:3000
PORT=8000
```
See `backend/.env.example` for all options.

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
