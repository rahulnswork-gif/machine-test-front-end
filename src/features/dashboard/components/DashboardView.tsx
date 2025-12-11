import { useState, useRef, useEffect } from "react"
import { useNavigate } from "@tanstack/react-router"
import { Header } from "./Header"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { CustomSelect } from "@/components/ui/custom-select"
import { Search, Upload, Trash2, BarChart3, Loader2, GitBranch, Star, ExternalLink } from "lucide-react"
import { useSearchRepos, useSearchUsers } from "@/features/github/hooks/useGitHub"
import { useBookmarks, useDeleteBookmark, useImportBookmarks } from "@/features/bookmarks/hooks/useBookmarks"
import { useBookmarkStats } from "@/features/analytics/hooks/useAnalytics"
import { useToastStore } from "@/store/useToastStore"
import { RepoCard } from "@/features/github/components/RepoCard"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import { useDebounce } from "@/hooks/useDebounce"
import { useInfiniteScroll } from "@/hooks/useInfiniteScroll"

export function DashboardView() {
  const navigate = useNavigate()
  const [searchType, setSearchType] = useState<'users' | 'repos'>('users')
  const [searchQuery, setSearchQuery] = useState("")
  const [submittedQuery, setSubmittedQuery] = useState("")
  const [showSuggestions, setShowSuggestions] = useState(false)
  
  const searchInputRef = useRef<HTMLDivElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  // Debounced query for autocomplete
  const debouncedQuery = useDebounce(searchQuery, 300)

  // Autocomplete suggestions based on search type
  const { data: repoSuggestionsData, isLoading: isLoadingRepoSuggestions } = useSearchRepos(
    { q: debouncedQuery, per_page: 5 },
    searchType === 'repos' && debouncedQuery.length >= 3 && showSuggestions
  )

  const { data: userSuggestionsData, isLoading: isLoadingUserSuggestions } = useSearchUsers(
    { q: debouncedQuery, per_page: 5 },
    searchType === 'users' && debouncedQuery.length >= 3 && showSuggestions
  )

  // Flatten suggestions
  const suggestions = searchType === 'repos' 
    ? repoSuggestionsData?.pages[0] 
    : userSuggestionsData?.pages[0]
  const isLoadingSuggestions = searchType === 'repos' 
    ? isLoadingRepoSuggestions 
    : isLoadingUserSuggestions

  // Main search results
  const { 
    data: repoResultsData, 
    isLoading: isSearchingRepos,
    fetchNextPage: fetchNextRepoPage,
    hasNextPage: hasNextRepoPage,
    isFetchingNextPage: isFetchingNextRepoPage,
  } = useSearchRepos(
    { q: submittedQuery, per_page: 20 },
    searchType === 'repos' && !!submittedQuery
  )

  const { 
    data: userResultsData, 
    isLoading: isSearchingUsers,
    fetchNextPage: fetchNextUserPage,
    hasNextPage: hasNextUserPage,
    isFetchingNextPage: isFetchingNextUserPage,
  } = useSearchUsers(
    { q: submittedQuery, per_page: 20 },
    searchType === 'users' && !!submittedQuery
  )

  // Flatten results
  const repoResults = repoResultsData?.pages[0]
  const allRepos = repoResultsData?.pages.flatMap(page => page.items) || []
  const userResults = userResultsData?.pages[0]
  const allUsers = userResultsData?.pages.flatMap(page => page.items) || []

  // Bookmarks
  const [bookmarkSearchQuery, setBookmarkSearchQuery] = useState("")
  const debouncedBookmarkSearchQuery = useDebounce(bookmarkSearchQuery, 300)

  const { 
    data: bookmarksData, 
    isLoading: isLoadingBookmarks,
    fetchNextPage: fetchNextBookmarksPage,
    hasNextPage: hasNextBookmarksPage,
    isFetchingNextPage: isFetchingNextBookmarksPage
  } = useBookmarks(debouncedBookmarkSearchQuery)

  const bookmarks = bookmarksData?.pages.flatMap(page => page.data) || []

  // Infinite scroll for bookmarks
  const loadMoreBookmarksRef = useInfiniteScroll({
    onLoadMore: fetchNextBookmarksPage,
    hasMore: !!hasNextBookmarksPage,
    isLoading: isFetchingNextBookmarksPage
  })
  const deleteBookmark = useDeleteBookmark()
  const importBookmarks = useImportBookmarks()

  const handleImportClick = () => {
    fileInputRef.current?.click()
  }

  // Analytics
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

  useEffect(() => {
    console.log('Date Range:', dateRange)
    console.log('Calculated Dates:', { startDate, endDate })
  }, [dateRange, startDate, endDate])

  const { data: stats, isLoading: isLoadingStats } = useBookmarkStats(startDate, endDate)

  // Set up infinite scroll
  const loadMoreRef = useInfiniteScroll({
    onLoadMore: () => searchType === 'repos' ? fetchNextRepoPage() : fetchNextUserPage(),
    hasMore: searchType === 'repos' ? !!hasNextRepoPage : !!hasNextUserPage,
    isLoading: searchType === 'repos' ? isFetchingNextRepoPage : isFetchingNextUserPage,
  })

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    setSubmittedQuery(searchQuery)
    setShowSuggestions(false)
  }

  const selectSuggestion = (value: string) => {
    if (searchType === 'users') {
      navigate({ to: `/user/${value}` })
    } else {
      setSearchQuery(value)
      setSubmittedQuery(value)
      setShowSuggestions(false)
    }
  }

  const viewUserProfile = (username: string) => {
    navigate({ to: `/user/${username}` })
  }

  // Click outside to close suggestions
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchInputRef.current && !searchInputRef.current.contains(event.target as Node)) {
        setShowSuggestions(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const { addToast } = useToastStore()

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      // Validate file type
      if (file.type !== 'text/csv' && !file.name.endsWith('.csv')) {
        addToast('Please upload a valid CSV file', 'error')
        e.target.value = ''
        return
      }

      try {
        await importBookmarks.mutateAsync(file)
        addToast('Bookmarks imported successfully!', 'success')
        e.target.value = ''
      } catch (error) {
        console.error('Import failed:', error)
        addToast('Failed to import bookmarks. Please check the file format.', 'error')
      }
    }
  }

  // Process chart data - API returns an object with bookmarks_per_period
  // Process chart data - API returns an object with bookmarks_per_period
  const chartData = stats?.bookmarks_per_period?.periods && stats?.bookmarks_per_period?.counts
    ? stats.bookmarks_per_period.periods.map((dateStr: string, index: number) => {
        // Parse date string which might be in DD-MM-YYYY or MM-YYYY format
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

        // Calculate duration to determine label format
        let durationDays = 0
        if (stats.summary?.date_range?.start && stats.summary?.date_range?.end) {
          const start = new Date(stats.summary.date_range.start)
          const end = new Date(stats.summary.date_range.end)
          durationDays = (end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)
        }

        // Format label based on duration
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

  const isSearching = searchType === 'repos' ? isSearchingRepos : isSearchingUsers
  const hasResults = searchType === 'repos' ? !!repoResults : !!userResults

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <Header />
      
      <main className="container mx-auto px-4 py-6 max-w-7xl space-y-6">
        {/* Search Bar - Primary Feature */}
        <Card className="border-none shadow-lg bg-white">
          <CardHeader className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white">
            <CardTitle className="text-2xl">Search GitHub</CardTitle>
            <CardDescription className="text-blue-50">
              Find {searchType === 'users' ? 'users and explore their repositories' : 'and bookmark your favorite repositories'}
            </CardDescription>
          </CardHeader>
          
          <CardContent className="pt-6">
            <form onSubmit={handleSearch} className="relative">
              <div ref={searchInputRef} className="relative">
                <div className="flex flex-col md:flex-row gap-3">
                  <CustomSelect 
                    value={searchType} 
                    onChange={(value) => {
                      setSearchType(value as 'users' | 'repos')
                      setSearchQuery("")
                      setSubmittedQuery("")
                      setShowSuggestions(false)
                    }}
                    options={[
                      { value: 'users', label: 'Users' },
                      { value: 'repos', label: 'Repositories' }
                    ]}
                    className="w-full md:w-[140px] h-12"
                  />
                  
                  <div className="flex-1 flex gap-2">
                    <Input
                      placeholder={searchType === 'users' ? 'Search users (e.g. location:india)' : 'Search repositories (e.g. language:python)'}
                      value={searchQuery}
                      onChange={(e) => {
                        setSearchQuery(e.target.value)
                        setShowSuggestions(true)
                      }}
                      onFocus={() => setShowSuggestions(true)}
                      className="flex-1 h-12 text-base border-slate-200 focus-visible:ring-blue-500"
                    />
                    
                    <Button type="submit" disabled={isSearching} className="h-12 w-12 p-0 bg-blue-600 hover:bg-blue-700 flex-shrink-0">
                      {isSearching ? <Loader2 className="h-5 w-5 animate-spin" /> : <Search className="h-5 w-5" />}
                    </Button>
                  </div>
                </div>

                {/* Autocomplete Suggestions */}
                {showSuggestions && searchQuery.length >= 3 && (
                  <div className="absolute z-10 w-full mt-2 bg-white border border-slate-200 rounded-xl shadow-xl max-h-96 overflow-auto">
                    {isLoadingSuggestions ? (
                      <div className="p-4 text-center">
                        <Loader2 className="h-5 w-5 animate-spin mx-auto text-blue-500" />
                      </div>
                    ) : suggestions?.items?.length ? (
                      <div className="py-2">
                        <div className="px-3 py-2 text-xs font-semibold text-slate-500 uppercase tracking-wider bg-slate-50/50">Suggestions</div>
                        {suggestions?.items.slice(0, 5).map((item: any) => (
                          <button
                            key={item.id}
                            type="button"
                            onClick={() => selectSuggestion(searchType === 'users' ? item.login : item.full_name)}
                            className="w-full px-4 py-3 text-left hover:bg-slate-50 transition-colors flex items-center gap-3 border-b border-slate-50 last:border-0"
                          >
                            {searchType === 'users' ? (
                              <>
                                <img src={item.avatar_url} alt={item.login} className="w-8 h-8 rounded-full flex-shrink-0 border border-slate-200" />
                                <div className="flex-1 min-w-0">
                                  <div className="font-medium text-sm text-slate-900">{item.login}</div>
                                </div>
                              </>
                            ) : (
                              <>
                                <GitBranch className="h-4 w-4 text-slate-400 flex-shrink-0" />
                                <div className="flex-1 min-w-0">
                                  <div className="font-medium text-sm text-slate-900 truncate">{item.full_name}</div>
                                  <div className="text-xs text-slate-500 truncate">{item.description || 'No description'}</div>
                                </div>
                                <div className="flex items-center gap-1 text-xs text-slate-500 bg-slate-100 px-2 py-0.5 rounded-full">
                                  <Star className="h-3 w-3" />
                                  {item.stargazers_count}
                                </div>
                              </>
                            )}
                          </button>
                        ))}
                      </div>
                    ) : (
                      <div className="p-8 text-center text-sm text-slate-500">
                        No suggestions found
                      </div>
                    )}
                  </div>
                )}
              </div>
            </form>
          </CardContent>
        </Card>



        {/* Search Results - Only shown after searching */}
        {(isSearching || hasResults) && (
          <Card className="border-none shadow-lg bg-white">
            <CardHeader className="bg-gradient-to-r from-emerald-500 to-teal-600 text-white">
              <CardTitle className="text-xl">Search Results</CardTitle>
              <CardDescription className="text-emerald-50">
                {searchType === 'users' ? 'GitHub Users' : 'GitHub Repositories'}
              </CardDescription>
            </CardHeader>
            
            <CardContent className="pt-6">
              <div className="max-h-[600px] overflow-y-auto overflow-x-hidden">
                {isSearching && (
                  <div className="flex justify-center py-16">
                    <Loader2 className="h-10 w-10 animate-spin text-blue-500" />
                  </div>
                )}

                {hasResults && searchType === 'repos' && repoResults && (
                  <div className="space-y-4">
                    <div className="flex items-center justify-between sticky top-0 bg-white py-3 z-10">
                      <p className="text-sm font-medium text-slate-600">
                        Found <span className="text-emerald-600 font-bold">{repoResults.total_count.toLocaleString()}</span> repositories
                      </p>
                    </div>
                    <div className="flex flex-col gap-4 w-full max-w-full">
                      {allRepos.map((repo: any) => (
                        <RepoCard key={repo.id} repo={repo} />
                      ))}
                    </div>
                    
                    {hasNextRepoPage && (
                      <div ref={loadMoreRef} className="flex justify-center py-8">
                        {isFetchingNextRepoPage && (
                          <Loader2 className="h-8 w-8 animate-spin text-emerald-600" />
                        )}
                      </div>
                    )}
                  </div>
                )}

                {hasResults && searchType === 'users' && userResults && (
                  <div className="space-y-4">
                    <p className="text-sm font-medium text-slate-600 sticky top-0 bg-white py-3 z-10">
                      Found <span className="text-emerald-600 font-bold">{userResults.total_count.toLocaleString()}</span> users
                    </p>
                    <div className="grid gap-4 md:grid-cols-2 w-full max-w-full">
                      {allUsers.map((user: any) => (
                        <Card 
                          key={user.id} 
                          className="hover:shadow-lg transition-all cursor-pointer border-l-4 border-l-emerald-500 bg-white w-full max-w-full" 
                          onClick={() => viewUserProfile(user.login)}
                        >
                          <CardHeader>
                            <div className="flex items-center gap-4">
                              <img src={user.avatar_url} alt={user.login} className="w-16 h-16 rounded-full flex-shrink-0" />
                              <div className="flex-1 min-w-0">
                                <CardTitle className="text-lg truncate">{user.login}</CardTitle>
                                <a 
                                  href={user.html_url} 
                                  target="_blank" 
                                  rel="noopener noreferrer" 
                                  className="text-sm text-emerald-600 hover:underline flex items-center gap-1" 
                                  onClick={(e) => e.stopPropagation()}
                                >
                                  View on GitHub <ExternalLink className="h-3 w-3 flex-shrink-0" />
                                </a>
                              </div>
                            </div>
                          </CardHeader>
                        </Card>
                      ))}
                    </div>
                    
                    {hasNextUserPage && (
                      <div ref={loadMoreRef} className="flex justify-center py-8">
                        {isFetchingNextUserPage && (
                          <Loader2 className="h-8 w-8 animate-spin text-emerald-600" />
                        )}
                      </div>
                    )}
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Bookmarks Section */}
        <Card className="border-none shadow-lg bg-white">
          <CardHeader className="bg-gradient-to-r from-purple-500 to-pink-600 text-white">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <div>
                <CardTitle className="text-xl">Bookmarked Repositories</CardTitle>
                <CardDescription className="text-purple-50">
                  Manage your saved repositories
                </CardDescription>
              </div>
              <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
                <div className="relative w-full md:w-64">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-purple-200" />
                  <Input
                    placeholder="Search bookmarks..."
                    value={bookmarkSearchQuery}
                    onChange={(e) => setBookmarkSearchQuery(e.target.value)}
                    className="pl-9 bg-white/10 border-purple-400/30 text-white placeholder:text-purple-200 focus-visible:ring-white/20"
                  />
                </div>
                <div className="relative">
                  <input
                    type="file"
                    accept=".csv"
                    ref={fileInputRef}
                    className="hidden"
                    onChange={handleFileUpload}
                  />
                  <Button 
                    variant="secondary" 
                    className="w-full sm:w-auto gap-2 bg-white/10 hover:bg-white/20 text-white border-none"
                    onClick={handleImportClick}
                    disabled={importBookmarks.isPending}
                  >
                    {importBookmarks.isPending ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <Upload className="h-4 w-4" />
                    )}
                    Import CSV
                  </Button>
                </div>
              </div>
            </div>
          </CardHeader>
          <CardContent className="pt-6">
            {isLoadingBookmarks ? (
              <div className="flex justify-center py-16">
                <Loader2 className="h-10 w-10 animate-spin text-purple-500" />
              </div>
            ) : bookmarks?.length === 0 ? (
              <div className="text-center py-16">
                <div className="w-20 h-20 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <GitBranch className="h-10 w-10 text-purple-500" />
                </div>
                <p className="text-slate-600 text-lg">No bookmarks yet</p>
                <p className="text-slate-500 text-sm mt-2">Start by searching and bookmarking repositories!</p>
              </div>
            ) : (
              <div className="flex flex-col gap-4 max-h-[600px] overflow-y-auto overflow-x-hidden pr-2 custom-scrollbar w-full max-w-full">
                {bookmarks?.map((bookmark) => (
                  <Card key={bookmark.id} className="hover:shadow-md transition-shadow border-l-4 border-l-purple-500 bg-white w-full max-w-full relative">
                    <CardHeader className="pr-12">
                      <div className="flex flex-col gap-1 min-w-0 w-full">
                        <CardTitle className="text-lg truncate w-full">
                          <a
                            href={bookmark.html_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-500 hover:underline block truncate"
                          >
                            {bookmark.full_name}
                          </a>
                        </CardTitle>
                        <CardDescription className="line-clamp-2 mt-1 break-words w-full">
                          {bookmark.description || "No description"}
                        </CardDescription>
                        <div className="flex flex-wrap items-center gap-2 mt-2 text-xs text-slate-500">
                          <span>Added {new Date(bookmark.created_at).toLocaleDateString()}</span>
                        </div>
                      </div>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => deleteBookmark.mutate(bookmark.id)}
                        disabled={deleteBookmark.isPending}
                        className="absolute top-4 right-4 text-red-500 hover:text-red-600 hover:bg-red-50 h-8 w-8 p-0"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </CardHeader>
                  </Card>

                ))}
                
                {/* Infinite Scroll Loader */}
                {hasNextBookmarksPage && (
                  <div ref={loadMoreBookmarksRef} className="flex justify-center py-4 w-full">
                    {isFetchingNextBookmarksPage && (
                      <Loader2 className="h-6 w-6 animate-spin text-purple-500" />
                    )}
                  </div>
                )}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Analytics Section */}
        <Card className="border-none shadow-lg bg-white">
          <CardHeader className="bg-gradient-to-r from-orange-500 to-red-600 text-white">
            <div className="flex items-center justify-between flex-wrap gap-4">
              <div>
                <CardTitle className="text-2xl">Bookmark Analytics</CardTitle>
                <CardDescription className="text-orange-50">
                  Track your bookmarking activity over time
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
                <p className="text-slate-600 text-lg">No analytics data yet</p>
                <p className="text-slate-500 text-sm mt-2">Start bookmarking repositories to see your activity!</p>
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
      </main>
    </div>
  )
}
