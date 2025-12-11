import { useParams, Link } from "@tanstack/react-router"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ArrowLeft, MapPin, Link2, Building, Users, GitBranch, Loader2, ExternalLink } from "lucide-react"
import { useGetUser, useGetUserRepos } from "@/features/github/hooks/useGitHub"
import { RepoCard } from "@/features/github/components/RepoCard"
import { Header } from "@/features/dashboard/components/Header"
import { useInfiniteScroll } from "@/hooks/useInfiniteScroll"

export function UserProfile() {
  const { username } = useParams({ from: '/user/$username' })
  
  const { data: user, isLoading: isLoadingUser } = useGetUser(username)
  const { 
    data: reposData, 
    isLoading: isLoadingRepos,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useGetUserRepos(username)

  // Flatten all pages of repositories
  const repos = reposData?.pages.flatMap(page => page) || []

  // Set up infinite scroll
  const loadMoreRef = useInfiniteScroll({
    onLoadMore: () => fetchNextPage(),
    hasMore: !!hasNextPage,
    isLoading: isFetchingNextPage,
  })

  if (isLoadingUser) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
        <Header />
        <div className="flex justify-center items-center py-32">
          <Loader2 className="h-12 w-12 animate-spin text-blue-500" />
        </div>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
        <Header />
        <div className="container mx-auto px-4 py-16 text-center">
          <h1 className="text-2xl font-bold text-slate-900">User not found</h1>
          <Link to="/dashboard">
            <Button className="mt-4">Back to Dashboard</Button>
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <Header />
      
      <main className="container mx-auto px-4 py-6 max-w-7xl">
        <Link to="/dashboard">
          <Button variant="outline" className="mb-6 gap-2">
            <ArrowLeft className="h-4 w-4" />
            Back to Dashboard
          </Button>
        </Link>

        {/* User Profile Card */}
        <Card className="border-none shadow-lg mb-6">
          <CardHeader className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white">
            <div className="flex flex-col md:flex-row gap-6 items-start md:items-center">
              <img 
                src={user.avatar_url} 
                alt={user.login} 
                className="w-32 h-32 rounded-full border-4 border-white shadow-xl"
              />
              <div className="flex-1">
                <CardTitle className="text-3xl mb-2">{user.name || user.login}</CardTitle>
                <CardDescription className="text-blue-50 text-lg mb-3">
                  @{user.login}
                </CardDescription>
                {user.bio && (
                  <p className="text-blue-50 mb-4">{user.bio}</p>
                )}
                <div className="flex flex-wrap gap-4 text-sm text-blue-50">
                  {user.location && (
                    <div className="flex items-center gap-1">
                      <MapPin className="h-4 w-4" />
                      {user.location}
                    </div>
                  )}
                  {user.company && (
                    <div className="flex items-center gap-1">
                      <Building className="h-4 w-4" />
                      {user.company}
                    </div>
                  )}
                  {user.blog && (
                    <a 
                      href={user.blog.startsWith('http') ? user.blog : `https://${user.blog}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1 hover:underline"
                    >
                      <Link2 className="h-4 w-4" />
                      {user.blog}
                    </a>
                  )}
                </div>
              </div>
              <a
                href={user.html_url}
                target="_blank"
                rel="noopener noreferrer"
              >
                <Button variant="secondary" className="gap-2">
                  View on GitHub
                  <ExternalLink className="h-4 w-4" />
                </Button>
              </a>
            </div>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              <div className="text-center p-4 bg-slate-50 rounded-lg">
                <div className="text-2xl font-bold text-slate-900">{user.public_repos}</div>
                <div className="text-sm text-slate-600 flex items-center justify-center gap-1 mt-1">
                  <GitBranch className="h-4 w-4" />
                  Repositories
                </div>
              </div>
              <div className="text-center p-4 bg-slate-50 rounded-lg">
                <div className="text-2xl font-bold text-slate-900">{user.followers}</div>
                <div className="text-sm text-slate-600 flex items-center justify-center gap-1 mt-1">
                  <Users className="h-4 w-4" />
                  Followers
                </div>
              </div>
              <div className="text-center p-4 bg-slate-50 rounded-lg">
                <div className="text-2xl font-bold text-slate-900">{user.following}</div>
                <div className="text-sm text-slate-600 flex items-center justify-center gap-1 mt-1">
                  <Users className="h-4 w-4" />
                  Following
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Repositories Section */}
        <Card className="border-none shadow-lg">
          <CardHeader className="bg-gradient-to-r from-emerald-500 to-teal-600 text-white">
            <CardTitle className="text-2xl">Repositories</CardTitle>
            <CardDescription className="text-emerald-50">
              {repos?.length || 0} public repositories loaded
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-6">
            {isLoadingRepos ? (
              <div className="flex justify-center py-16">
                <Loader2 className="h-10 w-10 animate-spin text-emerald-500" />
              </div>
            ) : repos && repos.length > 0 ? (
              <>
                <div className="flex flex-col gap-4 w-full max-w-full overflow-x-hidden">
                  {repos.map((repo: any) => (
                    <RepoCard key={repo.id} repo={repo} />
                  ))}
                </div>
                
                {/* Infinite scroll trigger */}
                {hasNextPage && (
                  <div ref={loadMoreRef} className="flex justify-center py-8">
                    {isFetchingNextPage && (
                      <Loader2 className="h-8 w-8 animate-spin text-emerald-500" />
                    )}
                  </div>
                )}
              </>
            ) : (
              <div className="text-center py-16">
                <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <GitBranch className="h-10 w-10 text-emerald-500" />
                </div>
                <p className="text-slate-600 text-lg">No public repositories</p>
              </div>
            )}
          </CardContent>
        </Card>
      </main>
    </div>
  )
}
