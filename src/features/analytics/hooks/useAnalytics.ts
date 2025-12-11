import { useQuery } from '@tanstack/react-query'
import { analyticsApi } from '../api/analyticsApi'
import { queryKeys } from '@/lib/query-keys'

export const useBookmarkStats = (startDate?: string, endDate?: string) => {
  return useQuery({
    queryKey: queryKeys.analytics.stats(startDate, endDate),
    queryFn: () => analyticsApi.getBookmarkStats(startDate, endDate),
  })
}
