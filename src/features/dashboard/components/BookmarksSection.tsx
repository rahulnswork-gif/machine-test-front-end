import { useState, useRef } from "react"
import { Search, Loader2, GitBranch, Trash2, BarChart3, Upload, Info, Download } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { CustomSelect } from "@/components/ui/custom-select"
import { useBookmarks, useDeleteBookmark, useImportBookmarks } from "@/features/bookmarks/hooks/useBookmarks"
import { useDebounce } from "@/hooks/useDebounce"
import { useInfiniteScroll } from "@/hooks/useInfiniteScroll"
import { useToastStore } from "@/store/useToastStore"
import { TEXT } from "@/constants/text"

interface BookmarksSectionProps {
  scrollToAnalytics: () => void
}

export function BookmarksSection({ scrollToAnalytics }: BookmarksSectionProps) {
  const [bookmarkSearchQuery, setBookmarkSearchQuery] = useState("")
  const [sortBy, setSortBy] = useState<'created_at' | 'name' | 'full_name'>('created_at')
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc')
  const debouncedBookmarkSearch = useDebounce(bookmarkSearchQuery, 500)
  const [showInfoTooltip, setShowInfoTooltip] = useState(false)
  const tooltipTimeoutRef = useRef<any>(null)
  
  const { 
    data: bookmarksData, 
    fetchNextPage: fetchNextBookmarksPage, 
    hasNextPage: hasNextBookmarksPage, 
    isFetchingNextPage: isFetchingNextBookmarksPage,
    isLoading: isLoadingBookmarks 
  } = useBookmarks(debouncedBookmarkSearch, sortBy, sortOrder)

  const bookmarks = bookmarksData?.pages.flatMap(page => page.data) || []

  const loadMoreBookmarksRef = useInfiniteScroll({
    onLoadMore: fetchNextBookmarksPage,
    hasMore: !!hasNextBookmarksPage,
    isLoading: isFetchingNextBookmarksPage
  })

  const deleteBookmark = useDeleteBookmark()
  const importBookmarks = useImportBookmarks()
  const { addToast } = useToastStore()

  const handleImportClick = () => {
    const input = document.createElement('input')
    input.type = 'file'
    input.accept = '.csv'
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0]
      if (file) handleFileUpload(file)
    }
    input.click()
  }

  const handleFileUpload = async (file: File) => {
    if (file) {
      if (file.type !== 'text/csv' && !file.name.endsWith('.csv')) {
        addToast(TEXT.BOOKMARKS.INVALID_FILE, 'error')
        return
      }

      try {
        await importBookmarks.mutateAsync(file)
        addToast(TEXT.BOOKMARKS.IMPORT_SUCCESS, 'success')
      } catch (error) {
        addToast(TEXT.BOOKMARKS.IMPORT_ERROR, 'error')
      }
    }
  }

  const downloadSampleCsv = () => {
    const csvContent = "owner,repo\nfacebook,react\nvercel,next.js"
    const blob = new Blob([csvContent], { type: 'text/csv' })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'sample_bookmarks.csv'
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    window.URL.revokeObjectURL(url)
  }

  return (
    <Card className="border-none shadow-lg bg-white">
      <CardHeader className="bg-gradient-to-r from-purple-500 to-pink-600 text-white">
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
          <div>
            <CardTitle className="text-xl">
              {TEXT.BOOKMARKS.TITLE}
            </CardTitle>
            <CardDescription className="text-purple-50">
              {TEXT.BOOKMARKS.DESCRIPTION}
            </CardDescription>
          </div>
          <div className="flex flex-col sm:flex-row flex-wrap gap-3 w-full lg:w-auto">
            <div className="relative w-full sm:flex-1 lg:w-64 min-w-[200px]">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-purple-200" />
              <Input
                placeholder={TEXT.BOOKMARKS.SEARCH_PLACEHOLDER}
                value={bookmarkSearchQuery}
                onChange={(e) => setBookmarkSearchQuery(e.target.value)}
                className="pl-9 bg-white/10 border-purple-400/30 text-white placeholder:text-purple-200 focus-visible:ring-white/20"
              />
            </div>
            <CustomSelect
              value={`${sortBy}-${sortOrder}`}
              onChange={(value) => {
                const [newSortBy, newOrder] = value.split('-') as ['created_at' | 'name' | 'full_name', 'asc' | 'desc']
                setSortBy(newSortBy)
                setSortOrder(newOrder)
              }}
              options={[
                { value: 'created_at-desc', label: 'Newest first' },
                { value: 'created_at-asc', label: 'Oldest first' },
                { value: 'full_name-asc', label: 'Name (A-Z)' },
                { value: 'full_name-desc', label: 'Name (Z-A)' }
              ]}
              variant="glass"
              className="w-full sm:w-[180px]"
            />

            <div className="relative flex items-center gap-2 flex-wrap sm:flex-nowrap">
              <Button 
                variant="secondary" 
                className="bg-white/10 hover:bg-white/20 text-white border-none"
                onClick={scrollToAnalytics}
              >
                <BarChart3 className="h-4 w-4 mr-2" />
                {TEXT.BOOKMARKS.ANALYTICS_BUTTON}
              </Button>

              <div className="flex items-center">
                <Button 
                  variant="secondary" 
                  className="w-full sm:w-auto gap-2 bg-white/10 hover:bg-white/20 text-white border-none rounded-r-none border-r border-white/20"
                  onClick={handleImportClick}
                  disabled={importBookmarks.isPending}
                >
                  {importBookmarks.isPending ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Upload className="h-4 w-4" />
                  )}
                  {TEXT.BOOKMARKS.IMPORT_BUTTON}
                </Button>
                
                <div 
                  className="relative h-10"
                  onMouseEnter={() => {
                    if (tooltipTimeoutRef.current) {
                      clearTimeout(tooltipTimeoutRef.current)
                      tooltipTimeoutRef.current = null
                    }
                    setShowInfoTooltip(true)
                  }}
                  onMouseLeave={() => {
                    tooltipTimeoutRef.current = setTimeout(() => {
                      setShowInfoTooltip(false)
                    }, 300)
                  }}
                >
                  <Button
                    variant="secondary"
                    size="sm"
                    className="bg-white/10 hover:bg-white/20 text-white border-none h-10 w-10 p-0 rounded-l-none"
                    onClick={() => setShowInfoTooltip(!showInfoTooltip)}
                  >
                    <Info className="h-5 w-5" />
                  </Button>
                  
                  {showInfoTooltip && (
                    <div 
                      className="absolute right-0 top-full mt-2 w-64 p-4 bg-white rounded-lg shadow-xl border border-slate-200 z-50 text-slate-700 text-sm"
                      onMouseEnter={() => {
                        if (tooltipTimeoutRef.current) {
                          clearTimeout(tooltipTimeoutRef.current)
                          tooltipTimeoutRef.current = null
                        }
                      }}
                    >
                    <p className="font-semibold mb-2">{TEXT.BOOKMARKS.CSV_REQUIREMENTS_TITLE}</p>
                    <p className="mb-3">{TEXT.BOOKMARKS.CSV_REQUIREMENTS_DESC}</p>
                    <ul className="list-disc pl-4 mb-3 space-y-1 text-xs text-slate-600">
                      <li><code className="bg-slate-100 px-1 rounded">owner</code> (Required)</li>
                      <li><code className="bg-slate-100 px-1 rounded">repo</code> (Required)</li>
                    </ul>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="w-full gap-2 text-xs h-8"
                      onClick={downloadSampleCsv}
                    >
                      <Download className="h-3 w-3" />
                      {TEXT.BOOKMARKS.DOWNLOAD_SAMPLE}
                    </Button>
                  </div>
                )}
              </div>
            </div>
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
            <p className="text-slate-600 text-lg">{TEXT.BOOKMARKS.NO_BOOKMARKS_TITLE}</p>
            <p className="text-slate-500 text-sm mt-2">{TEXT.BOOKMARKS.NO_BOOKMARKS_DESC}</p>
          </div>
        ) : (
          <div className="flex flex-col gap-4 max-h-[600px] overflow-y-auto overflow-x-hidden pr-2 custom-scrollbar w-full max-w-full">
            {bookmarks?.map((bookmark) => (
              <Card key={bookmark.id} className="hover:shadow-md transition-shadow border-l-4 border-l-purple-500 bg-white w-full max-w-full relative">
                <CardHeader className="pr-12">
                  <div className="flex flex-col gap-1 min-w-0 w-full">
                    <CardTitle className="text-lg w-full">
                      <a
                        href={bookmark.html_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-500 hover:underline block truncate rounded-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-blue-500"
                      >
                        {bookmark.full_name}
                      </a>
                    </CardTitle>
                    <CardDescription className="line-clamp-2 mt-1 break-words w-full">
                      {bookmark.description || "No description"}
                    </CardDescription>
                    <div className="flex flex-wrap items-center gap-2 mt-2 text-xs text-slate-500">
                      <span>{TEXT.BOOKMARKS.ADDED_PREFIX} {new Date(bookmark.created_at).toLocaleDateString()}</span>
                    </div>
                  </div>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => deleteBookmark.mutate(bookmark.id)}
                    disabled={deleteBookmark.isPending}
                    className="absolute top-4 right-4 text-red-500 hover:text-red-600 hover:bg-red-50 h-8 w-8 p-0"
                  >
                    {deleteBookmark.isPending && deleteBookmark.variables === bookmark.id ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <Trash2 className="h-4 w-4" />
                    )}
                  </Button>
                </CardHeader>
              </Card>

            ))}
            
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
  )
}
