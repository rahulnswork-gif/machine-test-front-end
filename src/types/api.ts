// Auth Types
export interface LoginRequest {
  username: string
  password: string
}

export interface RegisterRequest {
  email: string
  password: string
  is_active?: boolean
}

export interface Token {
  access_token: string
  token_type: string
}

export interface User {
  id: number
  email: string | null
  is_active: boolean
}

// Bookmark Types
export interface Bookmark {
  id: number
  user_id: number
  repo_id: number
  name: string
  full_name: string
  html_url: string
  description: string | null
  owner_login: string
  owner_avatar_url: string | null
  created_at: string
}

export interface BookmarkCreate {
  repo_id: number
  name: string
  full_name: string
  html_url: string
  description?: string | null
  owner_login: string
  owner_avatar_url?: string | null
}

export interface PaginatedBookmarksResponse {
  total: number
  page: number
  per_page: number
  total_pages: number
  data: Bookmark[]
}

// GitHub Types
export interface GitHubUser {
  login: string
  id: number
  avatar_url: string
  html_url: string
  name?: string
  company?: string
  blog?: string
  location?: string
  email?: string
  bio?: string
  public_repos: number
  followers: number
  following: number
}

export interface GitHubRepo {
  id: number
  name: string
  full_name: string
  owner: {
    login: string
    avatar_url: string
  }
  html_url: string
  description: string | null
  stargazers_count: number
  forks_count: number
  language: string | null
  updated_at: string
}

export interface SearchUsersParams {
  q: string
  page?: number
  per_page?: number
  sort?: 'followers' | 'repositories' | 'joined'
  order?: 'asc' | 'desc'
}

export interface SearchReposParams {
  q: string
  page?: number
  per_page?: number
  sort?: 'stars' | 'forks' | 'help-wanted-issues' | 'updated'
  order?: 'asc' | 'desc'
}

export interface SearchUsersResponse {
  total_count: number
  incomplete_results: boolean
  items: GitHubUser[]
}

export interface SearchReposResponse {
  total_count: number
  incomplete_results: boolean
  items: GitHubRepo[]
}

// Analytics Types
export interface BookmarkStats {
  bookmarks_per_period: {
    periods: string[]
    counts: number[]
    group_by: string
  }
  repos_per_owner: {
    owners: string[]
    counts: number[]
  }
  repos_per_owner_timeline: Array<{
    date: string
    owner: string
    count: number
  }>
  summary: {
    total_bookmarks: number
    total_owners: number
    date_range: {
      start: string
      end: string
    }
  }
}

// Error Types
export interface APIError {
  detail: string | Array<{
    loc: Array<string | number>
    msg: string
    type: string
  }>
}
