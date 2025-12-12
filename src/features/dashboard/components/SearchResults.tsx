import { Loader2, ExternalLink } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { RepoCard } from "@/features/github/components/RepoCard"
import { useInfiniteScroll } from "@/hooks/useInfiniteScroll"
import { useNavigate } from "@tanstack/react-router"
import { TEXT } from "@/constants/text"

interface SearchResultsProps {
  searchType: 'users' | 'repos'
  isSearching: boolean
  hasResults: boolean
  repoResults: any
  allRepos: any[]
  userResults: any
  allUsers: any[]
  fetchNextRepoPage: () => void
  hasNextRepoPage: boolean
  isFetchingNextRepoPage: boolean
  fetchNextUserPage: () => void
  hasNextUserPage: boolean
  isFetchingNextUserPage: boolean
}

export function SearchResults({
  searchType,
  isSearching,
  hasResults,
  repoResults,
  allRepos,
  userResults,
  allUsers,
  fetchNextRepoPage,
  hasNextRepoPage,
  isFetchingNextRepoPage,
  fetchNextUserPage,
  hasNextUserPage,
  isFetchingNextUserPage
}: SearchResultsProps) {
  const navigate = useNavigate()

  const loadMoreRef = useInfiniteScroll({
    onLoadMore: () => searchType === 'repos' ? fetchNextRepoPage() : fetchNextUserPage(),
    hasMore: searchType === 'repos' ? !!hasNextRepoPage : !!hasNextUserPage,
    isLoading: searchType === 'repos' ? isFetchingNextRepoPage : isFetchingNextUserPage,
  })

  const viewUserProfile = (username: string) => {
    navigate({ to: `/user/${username}` })
  }

  if (!isSearching && !hasResults) return null

  return (
    <Card className="border-none shadow-lg bg-white">
      <CardHeader className="bg-gradient-to-r from-emerald-500 to-teal-600 text-white">
        <CardTitle className="text-xl">{TEXT.SEARCH.RESULTS_TITLE}</CardTitle>
        <CardDescription className="text-emerald-50">
          {searchType === 'users' ? TEXT.SEARCH.RESULTS_USERS_SUBTITLE : TEXT.SEARCH.RESULTS_REPOS_SUBTITLE}
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
                  {TEXT.SEARCH.FOUND} <span className="text-emerald-600 font-bold">{repoResults.total_count.toLocaleString()}</span> {TEXT.SEARCH.REPOSITORIES}
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
                {TEXT.SEARCH.FOUND} <span className="text-emerald-600 font-bold">{userResults.total_count.toLocaleString()}</span> {TEXT.SEARCH.USERS}
              </p>
              <div className="grid gap-4 md:grid-cols-2 w-full max-w-full">
                {allUsers.map((user: any) => (
                  <Card 
                    key={user.id} 
                    className="hover:shadow-lg transition-all cursor-pointer border-l-4 border-l-emerald-500 bg-white w-full max-w-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-emerald-500" 
                    onClick={() => viewUserProfile(user.login)}
                    tabIndex={0}
                    role="button"
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault()
                        viewUserProfile(user.login)
                      }
                    }}
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
                            className="text-sm text-emerald-600 hover:underline flex items-center gap-1 rounded-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-emerald-500 w-fit" 
                            onClick={(e) => e.stopPropagation()}
                            onKeyDown={(e) => e.stopPropagation()}
                          >
                            {TEXT.SEARCH.VIEW_ON_GITHUB} <ExternalLink className="h-3 w-3 flex-shrink-0" />
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
  )
}
