import { describe, it, expect, vi } from 'vitest'
import { githubApi } from '../api/githubApi'
import apiClient from '@/lib/api-client'

vi.mock('@/lib/api-client')

describe('githubApi', () => {
  it('should search repositories', async () => {
    const mockData = {
      total_count: 1,
      items: [
        {
          id: 1,
          name: 'test-repo',
          full_name: 'user/test-repo',
          html_url: 'https://github.com/user/test-repo',
          description: 'Test repository',
          owner: {
            login: 'user',
            avatar_url: 'https://avatar.url',
          },
          stargazers_count: 100,
          forks_count: 10,
          language: 'TypeScript',
          updated_at: '2024-01-01T00:00:00Z',
        },
      ],
    }

    vi.mocked(apiClient.get).mockResolvedValue({ data: mockData })

    const result = await githubApi.searchRepos({ q: 'test', per_page: 10 })

    expect(result).toEqual(mockData)
    expect(apiClient.get).toHaveBeenCalledWith('/github/search/repos', {
      params: { q: 'test', per_page: 10 },
    })
  })

  it('should get user repositories', async () => {
    const mockRepos = [
      {
        id: 1,
        name: 'repo1',
        full_name: 'user/repo1',
      },
    ]

    vi.mocked(apiClient.get).mockResolvedValue({ data: mockRepos })

    const result = await githubApi.getUserRepos('testuser')

    expect(result).toEqual(mockRepos)
    expect(apiClient.get).toHaveBeenCalledWith('/github/users/testuser/repos', {
      params: undefined,
    })
  })
})
