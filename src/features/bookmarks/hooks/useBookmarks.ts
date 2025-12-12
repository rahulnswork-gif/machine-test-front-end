import { useMutation, useQueryClient, useInfiniteQuery } from '@tanstack/react-query'
import { bookmarksApi } from '../api/bookmarksApi'
import { queryKeys } from '@/lib/query-keys'
import type { BookmarkCreate } from '@/types/api'

export const useBookmarks = (searchQuery: string = '', sortBy: 'created_at' | 'name' | 'full_name' = 'created_at', order: 'asc' | 'desc' = 'desc') => {
  const q = searchQuery.trim() || undefined
  return useInfiniteQuery({
    queryKey: queryKeys.bookmarks.list(q, sortBy, order),
    queryFn: ({ pageParam = 1 }) => bookmarksApi.getBookmarks({ page: pageParam, per_page: 10, q, sort_by: sortBy, order }),
    initialPageParam: 1,
    getNextPageParam: (lastPage) => {
      if (lastPage.page >= lastPage.total_pages) return undefined
      return lastPage.page + 1
    },
  })
}

export const useCreateBookmark = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: BookmarkCreate) => bookmarksApi.createBookmark(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.bookmarks.list() })
      queryClient.invalidateQueries({ queryKey: queryKeys.analytics.stats() })
    },
  })
}

export const useDeleteBookmark = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (bookmarkId: number) => bookmarksApi.deleteBookmark(bookmarkId),
    // Optimistic update
    onMutate: async (bookmarkId) => {
      await queryClient.cancelQueries({ queryKey: queryKeys.bookmarks.list() })
      
      const previousBookmarks = queryClient.getQueryData(queryKeys.bookmarks.list())
      
      queryClient.setQueryData(queryKeys.bookmarks.list(), (old: any) =>
        old?.filter((bookmark: any) => bookmark.id !== bookmarkId)
      )
      
      return { previousBookmarks }
    },
    onError: (_err, _bookmarkId, context) => {
      queryClient.setQueryData(queryKeys.bookmarks.list(), context?.previousBookmarks)
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.bookmarks.list() })
      queryClient.invalidateQueries({ queryKey: queryKeys.analytics.stats() })
    },
  })
}

export const useImportBookmarks = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (file: File) => bookmarksApi.importBookmarks(file),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.bookmarks.list() })
      queryClient.invalidateQueries({ queryKey: queryKeys.analytics.stats() })
    },
  })
}
