# GitHub Repository Bookmark Manager

A modern, accessible React application for searching GitHub repositories, managing bookmarks, and visualizing analytics.

## Features

✅ **GitHub Search** - Search repositories and users with advanced filters  
✅ **Bookmarks** - Save and manage favorite repositories  
✅ **CSV Import** - Bulk import repositories with validation  
✅ **Analytics** - Visualize bookmarking activity over time  
✅ **Authentication** - Secure JWT-based auth  
✅ **Responsive Design** - Works on all devices  
✅ **Accessibility** - WCAG 2.1 AA compliant  

## Tech Stack

- React 18 + TypeScript
- TanStack Router + Query
- Zustand (State Management)
- Axios (HTTP Client)
- Recharts (Charts)
- Tailwind CSS
- Vitest (Testing)

## Getting Started

### Prerequisites

- Node.js 18+
- Backend API running at `http://localhost:8000`

### Installation

```bash
npm install
```

### Development

```bash
npm run dev
```

Open [http://localhost:5173](http://localhost:5173)

### Build

```bash
npm run build
```

### Testing

```bash
npm run test              # Run tests
npm run test:ui           # Interactive UI
npm run test:coverage     # Coverage report
```

## Project Structure

```
src/
├── features/           # Feature-based modules
│   ├── auth/          # Authentication
│   ├── github/        # GitHub search
│   ├── bookmarks/     # Bookmark management
│   ├── analytics/     # Analytics & charts
│   └── dashboard/     # Main dashboard
├── components/ui/     # Reusable UI components
├── lib/               # Utilities & config
└── types/             # TypeScript types
```

## Usage

### Search Repositories

1. Go to "Search Repositories" tab
2. Enter query (e.g., `language:python stars:>1000`)
3. Click bookmark icon to save

### Manage Bookmarks

1. Navigate to "My Bookmarks" tab
2. View, remove, or import bookmarks
3. Use "Import CSV" for bulk operations

### View Analytics

1. Open "Analytics" tab
2. See bookmarking trends over time

## API Endpoints

- `POST /api/v1/auth/login` - Login
- `POST /api/v1/auth/register` - Register
- `GET /api/v1/github/search/repos` - Search repos
- `GET /api/v1/bookmarks/` - List bookmarks
- `POST /api/v1/bookmarks/` - Create bookmark
- `DELETE /api/v1/bookmarks/{id}` - Remove bookmark
- `POST /api/v1/bookmarks/import` - Import CSV
- `GET /api/v1/analytics/stats` - Get stats

## Architecture Highlights

- **Feature-Based Structure**: Self-contained modules
- **Custom Hooks**: Encapsulated data fetching
- **Optimistic Updates**: Immediate UI feedback
- **Query Caching**: Efficient data management
- **Type Safety**: Full TypeScript coverage

## Performance

- React.memo for component optimization
- TanStack Query caching (5min stale time)
- Optimistic UI updates
- Code splitting ready

## Accessibility

- Keyboard navigation
- ARIA labels
- Focus management
- Semantic HTML
- WCAG AA color contrast

## License

MIT
