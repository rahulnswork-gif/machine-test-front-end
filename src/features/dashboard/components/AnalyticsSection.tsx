import { useState } from "react"
import { BarChart3, Loader2 } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { CustomSelect } from "@/components/ui/custom-select"
import { useBookmarkStats } from "@/features/analytics/hooks/useAnalytics"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import { TEXT } from "@/constants/text"

export function AnalyticsSection() {
  const [dateRange, setDateRange] = useState('all')
  
  // Calculate dates based on range
  const { startDate, endDate } = (() => {
    const end = new Date()
    const start = new Date()
    
    const formatDate = (date: Date) => {
      const year = date.getFullYear()
      const month = String(date.getMonth() + 1).padStart(2, '0')
      const day = String(date.getDate()).padStart(2, '0')
      return `${year}-${month}-${day}`
    }

    if (dateRange === 'all') {
      return { 
        startDate: undefined, 
        endDate: formatDate(end) 
      }
    }
    
    if (dateRange === 'today') {
      // Start and end are both today
    } else if (dateRange === '7d') {
      start.setDate(end.getDate() - 7)
    } else if (dateRange === '30d') {
      start.setDate(end.getDate() - 30)
    } else if (dateRange === 'this_year') {
      start.setMonth(0, 1) // Jan 1st of current year
    } else if (dateRange === '1y') {
      const lastYear = end.getFullYear() - 1
      start.setFullYear(lastYear, 0, 1)
      end.setFullYear(lastYear, 11, 31)
    }
    
    return {
      startDate: formatDate(start),
      endDate: formatDate(end)
    }
  })()

  const { data: stats, isLoading: isLoadingStats } = useBookmarkStats(startDate, endDate)

  // Process chart data
  const chartData = stats?.bookmarks_per_period?.periods && stats?.bookmarks_per_period?.counts
    ? stats.bookmarks_per_period.periods.map((dateStr: string, index: number) => {
        let dateObj: Date
        const ddmmyyyy = dateStr.match(/^(\d{2})-(\d{2})-(\d{4})$/)
        const mmyyyy = dateStr.match(/^(\d{2})-(\d{4})$/)
        
        if (ddmmyyyy) {
          dateObj = new Date(parseInt(ddmmyyyy[3]), parseInt(ddmmyyyy[2]) - 1, parseInt(ddmmyyyy[1]))
        } else if (mmyyyy) {
          dateObj = new Date(parseInt(mmyyyy[2]), parseInt(mmyyyy[1]) - 1, 1)
        } else {
          dateObj = new Date(dateStr)
        }

        let durationDays = 0
        if (stats.summary?.date_range?.start && stats.summary?.date_range?.end) {
          const start = new Date(stats.summary.date_range.start)
          const end = new Date(stats.summary.date_range.end)
          durationDays = (end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)
        }

        let formattedDate = dateObj.toLocaleDateString()
        if (durationDays > 365) {
          formattedDate = dateObj.getFullYear().toString()
        } else if (durationDays > 30) {
          formattedDate = dateObj.toLocaleDateString('en-US', { month: 'short', year: 'numeric' })
        } else {
          formattedDate = dateObj.toLocaleDateString('en-GB') // DD/MM/YYYY
        }

        return {
          date: formattedDate,
          count: stats.bookmarks_per_period.counts[index]
        }
      })
    : []

  return (
    <Card className="border-none shadow-lg bg-white">
      <CardHeader className="bg-gradient-to-r from-orange-500 to-red-600 text-white">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div>
            <CardTitle className="text-2xl">{TEXT.ANALYTICS.TITLE}</CardTitle>
            <CardDescription className="text-orange-50">
              {TEXT.ANALYTICS.DESCRIPTION}
            </CardDescription>
          </div>
          <div className="flex items-center gap-2">
            <CustomSelect
              value={dateRange}
              onChange={(value) => setDateRange(value)}
              options={[
                { value: 'today', label: 'Today' },
                { value: '7d', label: 'Last 7 Days' },
                { value: '30d', label: 'Last 30 Days' },
                { value: 'this_year', label: 'This Year' },
                { value: '1y', label: 'Last Year' },
                { value: 'all', label: 'All Time' }
              ]}
              variant="glass"
              className="w-40"
            />
          </div>
        </div>
      </CardHeader>
      <CardContent className="pt-6">
        {isLoadingStats ? (
          <div className="flex justify-center py-16">
            <Loader2 className="h-10 w-10 animate-spin text-orange-500" />
          </div>
        ) : chartData.length === 0 ? (
          <div className="text-center py-16">
            <div className="w-20 h-20 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <BarChart3 className="h-10 w-10 text-orange-500" />
            </div>
            <p className="text-slate-600 text-lg">{TEXT.ANALYTICS.NO_DATA_TITLE}</p>
            <p className="text-slate-500 text-sm mt-2">{TEXT.ANALYTICS.NO_DATA_DESC}</p>
          </div>
        ) : (
          <div className="h-[300px] md:h-[400px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="date" stroke="#64748b" />
                <YAxis stroke="#64748b" />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'white', 
                    border: '1px solid #e2e8f0',
                    borderRadius: '8px',
                    boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'
                  }}
                />
                <Bar
                  dataKey="count"
                  fill="#f97316"
                  radius={[8, 8, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
