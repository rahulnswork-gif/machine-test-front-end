import apiClient from '@/lib/api-client'
import type { BookmarkStats } from '@/types/api'

export const analyticsApi = {
  getBookmarkStats: async (startDate?: string, endDate?: string): Promise<BookmarkStats> => {
    const params = new URLSearchParams()
    if (startDate) params.append('start_date', startDate)
    if (endDate) params.append('end_date', endDate)
    params.append('timezone', 'Asia/Kolkata')
    
    const response = await apiClient.get('/analytics/stats', { params })
    return response.data
  },
}
