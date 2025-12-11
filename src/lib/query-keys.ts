export const queryKeys = {
  github: {
    all: ['github'] as const,
    users: (query: string) => [...queryKeys.github.all, 'users', query] as const,
    repos: (query: string) => [...queryKeys.github.all, 'repos', query] as const,
    user: (username: string) => [...queryKeys.github.all, 'user', username] as const,
    userRepos: (username: string) => [...queryKeys.github.all, 'userRepos', username] as const,
  },
  bookmarks: {
    all: ['bookmarks'] as const,
    list: (query?: string) => [...queryKeys.bookmarks.all, 'list', query] as const,
  },
  analytics: {
    all: ['analytics'] as const,
    stats: (startDate?: string, endDate?: string) => ['analytics', 'stats', startDate, endDate] as const,
  },
}
