import { describe, it, expect, vi } from 'vitest'
import { renderHook, waitFor } from '@testing-library/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { useBookmarks, useCreateBookmark } from '../hooks/useBookmarks'
import { bookmarksApi } from '../api/bookmarksApi'

vi.mock('../api/bookmarksApi')

const createWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false },
      mutations: { retry: false },
    },
  })
  return ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  )
}

describe('useBookmarks', () => {
  it('should fetch bookmarks', async () => {
    const mockBookmarks = [
      {
        id: 1,
        user_id: 1,
        repo_id: 123,
        name: 'test-repo',
        full_name: 'user/test-repo',
        html_url: 'https://github.com/user/test-repo',
        description: 'Test',
        owner_login: 'user',
        owner_avatar_url: null,
        created_at: '2024-01-01T00:00:00Z',
      },
    ]

    vi.mocked(bookmarksApi.getBookmarks).mockResolvedValue(mockBookmarks)

    const { result } = renderHook(() => useBookmarks(), {
      wrapper: createWrapper(),
    })

    await waitFor(() => expect(result.current.isSuccess).toBe(true))

    expect(result.current.data).toEqual(mockBookmarks)
  })
})

describe('useCreateBookmark', () => {
  it('should create a bookmark', async () => {
    const mockBookmark = {
      id: 1,
      user_id: 1,
      repo_id: 123,
      name: 'test-repo',
      full_name: 'user/test-repo',
      html_url: 'https://github.com/user/test-repo',
      description: 'Test',
      owner_login: 'user',
      owner_avatar_url: null,
      created_at: '2024-01-01T00:00:00Z',
    }

    vi.mocked(bookmarksApi.createBookmark).mockResolvedValue(mockBookmark)

    const { result } = renderHook(() => useCreateBookmark(), {
      wrapper: createWrapper(),
    })

    result.current.mutate({
      repo_id: 123,
      name: 'test-repo',
      full_name: 'user/test-repo',
      html_url: 'https://github.com/user/test-repo',
      description: 'Test',
      owner_login: 'user',
    })

    await waitFor(() => expect(result.current.isSuccess).toBe(true))

    expect(bookmarksApi.createBookmark).toHaveBeenCalled()
  })
})
