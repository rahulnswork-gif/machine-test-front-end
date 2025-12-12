# GitHub Explorer & Bookmark Manager

A modern, responsive React application for searching GitHub users and repositories, viewing details, and managing bookmarks with analytics.

## 🚀 Features

- **Search**:
  - Search for GitHub users and repositories.
  - Real-time autocomplete suggestions.
  - Advanced filtering (users vs. repositories).
- **Bookmarks**:
  - Save favorite repositories.
  - Sort bookmarks by date or name.
  - Import bookmarks from CSV.
  - Export/Download sample CSV format.
- **Analytics**:
  - Visual analytics of bookmarking activity over time.
  - Filter analytics by date range (Today, 7 days, 30 days, etc.).
- **User Details**:
  - View detailed user profiles including repositories.
- **Responsive Design**:
  - Fully responsive UI optimized for mobile, tablet, and desktop.

## 🛠 Tech Stack

- **Frontend**: React, TypeScript, Vite
- **Styling**: Tailwind CSS, Lucide React (Icons)
- **State Management**: React Query (TanStack Query), Zustand
- **Routing**: TanStack Router
- **Charts**: Recharts
- **HTTP Client**: Axios

## 📂 Folder Structure

```
src/
├── components/         # Shared UI components (Button, Input, Card, etc.)
├── constants/          # Application constants (Text strings, config)
├── features/           # Feature-based modules
│   ├── analytics/      # Analytics feature logic
│   ├── auth/           # Authentication logic
│   ├── bookmarks/      # Bookmarks management
│   ├── dashboard/      # Main dashboard view and components
│   └── github/         # GitHub API integration
├── hooks/              # Custom React hooks (useDebounce, useInfiniteScroll)
├── lib/                # Library configurations (API client, query keys)
├── store/              # Global state stores (Toast, Auth)
└── utils/              # Utility functions
```

## ⚡ Setup Guide

1.  **Clone the repository**:
    ```bash
    git clone <repository-url>
    cd machine-test-front-end
    ```

2.  **Install dependencies**:
    ```bash
    npm install
    ```

3.  **Run the development server**:
    ```bash
    npm run dev
    ```

4.  **Build for production**:
    ```bash
    npm run build
    ```

## 🎨 Theming

The application uses CSS variables for theming, defined in `src/index.css`.
- `--primary`: Main brand color (Green)
- `--secondary`: Secondary action color (Purple)
- `--danger`: Error/Destructive color (Red)

## ♿ Accessibility

- Semantic HTML structure.
- ARIA attributes for interactive elements.
- Keyboard navigation support.
- WCAG AA compliant color contrast.

## 🌐 Internationalization (i18n)

All user-facing text is centralized in `src/constants/text.ts` to facilitate future translation efforts.
