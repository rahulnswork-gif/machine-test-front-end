import { useQuery, useInfiniteQuery } from '@tanstack/react-query'
import { githubApi } from '../api/githubApi'
import { queryKeys } from '@/lib/query-keys'
import type { SearchUsersParams, SearchReposParams } from '@/types/api'

export const useSearchUsers = (params: SearchUsersParams, enabled = true) => {
  return useInfiniteQuery({
    queryKey: queryKeys.github.users(JSON.stringify(params)),
    queryFn: ({ pageParam = 1 }) => 
      githubApi.searchUsers({ ...params, page: pageParam }),
    enabled: enabled && !!params.q,
    staleTime: 1000 * 60 * 5, // 5 minutes
    initialPageParam: 1,
    getNextPageParam: (lastPage, allPages) => {
      // GitHub API returns max 1000 results (100 pages * 10 per_page)
      const totalPages = Math.ceil(lastPage.total_count / (params.per_page || 20))
      const nextPage = allPages.length + 1
      return nextPage <= totalPages && nextPage <= 100 ? nextPage : undefined
    },
  })
}

export const useSearchRepos = (params: SearchReposParams, enabled = true) => {
  return useInfiniteQuery({
    queryKey: queryKeys.github.repos(JSON.stringify(params)),
    queryFn: ({ pageParam = 1 }) => 
      githubApi.searchRepos({ ...params, page: pageParam }),
    enabled: enabled && !!params.q,
    staleTime: 1000 * 60 * 5,
    initialPageParam: 1,
    getNextPageParam: (lastPage, allPages) => {
      const totalPages = Math.ceil(lastPage.total_count / (params.per_page || 20))
      const nextPage = allPages.length + 1
      return nextPage <= totalPages && nextPage <= 100 ? nextPage : undefined
    },
  })
}

export const useGetUser = (username: string, enabled = true) => {
  return useQuery({
    queryKey: queryKeys.github.user(username),
    queryFn: () => githubApi.getUser(username),
    enabled: enabled && !!username,
  })
}

export const useGetUserRepos = (username: string, enabled = true) => {
  return useInfiniteQuery({
    queryKey: queryKeys.github.userRepos(username),
    queryFn: ({ pageParam = 1 }) => 
      githubApi.getUserRepos(username, { 
        page: pageParam, 
        per_page: 30,
        sort: 'updated',
        direction: 'desc'
      }),
    enabled: enabled && !!username,
    initialPageParam: 1,
    getNextPageParam: (lastPage, allPages) => {
      // If we got less than per_page items, we've reached the end
      if (!lastPage || lastPage.length < 30) {
        return undefined
      }
      return allPages.length + 1
    },
  })
}
