import apiClient from '@/lib/api-client'
import type { SearchUsersParams, SearchReposParams, GitHubUser, GitHubRepo, SearchUsersResponse, SearchReposResponse } from '@/types/api'

export const githubApi = {
  searchUsers: async (params: SearchUsersParams): Promise<SearchUsersResponse> => {
    const response = await apiClient.get('/github/search/users', { params })
    return response.data
  },

  searchRepos: async (params: SearchReposParams): Promise<SearchReposResponse> => {
    const response = await apiClient.get('/github/search/repos', { params })
    return response.data
  },

  getUser: async (username: string): Promise<GitHubUser> => {
    console.log(`[API] Fetching user details for: ${username}`)
    console.log(`[API] Endpoint: /github/users/${username}`)
    console.log(`[API] Full URL: http://localhost:8000/api/v1/github/users/${username}`)
    const response = await apiClient.get(`/github/users/${username}`)
    console.log(`[API] User data received:`, response.data)
    return response.data
  },

  getUserRepos: async (
    username: string,
    params?: {
      type?: 'all' | 'owner' | 'member'
      sort?: 'created' | 'updated' | 'pushed' | 'full_name'
      direction?: 'asc' | 'desc'
      per_page?: number
      page?: number
    }
  ) => {
    const response = await apiClient.get(`/github/users/${username}/repos`, { params })
    return response.data
  },

  getRepository: async (owner: string, repo: string): Promise<GitHubRepo> => {
    const response = await apiClient.get(`/github/repos/${owner}/${repo}`)
    return response.data
  },
}
