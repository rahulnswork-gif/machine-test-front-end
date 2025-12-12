import { useState, useRef } from "react"
import { Header } from "./Header"
import { useSearchRepos, useSearchUsers } from "@/features/github/hooks/useGitHub"
import { SearchSection } from "./SearchSection"
import { SearchResults } from "./SearchResults"
import { BookmarksSection } from "./BookmarksSection"
import { AnalyticsSection } from "./AnalyticsSection"

export function DashboardView() {
  const [searchType, setSearchType] = useState<'users' | 'repos'>('users')
  const [submittedQuery, setSubmittedQuery] = useState("")
  
  const analyticsRef = useRef<HTMLDivElement>(null)

  const scrollToAnalytics = () => {
    analyticsRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

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

  const isSearching = searchType === 'repos' ? isSearchingRepos : isSearchingUsers
  const hasResults = searchType === 'repos' ? !!repoResults : !!userResults

  const handleSearch = (query: string, type: 'users' | 'repos') => {
    setSearchType(type)
    setSubmittedQuery(query)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <Header />
      
      <main className="container mx-auto px-4 py-6 max-w-7xl space-y-6">
        <SearchSection 
          onSearch={handleSearch}
          isSearching={isSearching}
        />

        <SearchResults 
          searchType={searchType}
          isSearching={isSearching}
          hasResults={hasResults}
          repoResults={repoResults}
          allRepos={allRepos}
          userResults={userResults}
          allUsers={allUsers}
          fetchNextRepoPage={fetchNextRepoPage}
          hasNextRepoPage={!!hasNextRepoPage}
          isFetchingNextRepoPage={isFetchingNextRepoPage}
          fetchNextUserPage={fetchNextUserPage}
          hasNextUserPage={!!hasNextUserPage}
          isFetchingNextUserPage={isFetchingNextUserPage}
        />

        <BookmarksSection scrollToAnalytics={scrollToAnalytics} />

        <div ref={analyticsRef}>
          <AnalyticsSection />
        </div>
      </main>
    </div>
  )
}
