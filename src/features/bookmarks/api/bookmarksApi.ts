import apiClient from '@/lib/api-client'
import type { Bookmark, BookmarkCreate, PaginatedBookmarksResponse } from '@/types/api'

export const bookmarksApi = {
  getBookmarks: async (params?: { page?: number; per_page?: number; q?: string }): Promise<PaginatedBookmarksResponse> => {
    const response = await apiClient.get('/bookmarks/', { params })
    return response.data
  },

  createBookmark: async (data: BookmarkCreate): Promise<Bookmark> => {
    const response = await apiClient.post('/bookmarks/', data)
    return response.data
  },

  deleteBookmark: async (bookmarkId: number): Promise<Bookmark> => {
    const response = await apiClient.delete(`/bookmarks/${bookmarkId}`)
    return response.data
  },

  importBookmarks: async (file: File): Promise<Bookmark[]> => {
    const formData = new FormData()
    formData.append('file', file)

    const response = await apiClient.post('/bookmarks/import', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })
    return response.data
  },
}
