import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Star, GitFork, Bookmark, BookmarkCheck } from "lucide-react"
import type { GitHubRepo } from "@/types/api"
import { useCreateBookmark } from "@/features/bookmarks/hooks/useBookmarks"
import { useState } from "react"

interface RepoCardProps {
  repo: GitHubRepo
  isBookmarked?: boolean
  onBookmarkSuccess?: () => void
}

export function RepoCard({ repo, isBookmarked = false, onBookmarkSuccess }: RepoCardProps) {
  const createBookmark = useCreateBookmark()
  const [bookmarked, setBookmarked] = useState(isBookmarked)

  const handleBookmark = async () => {
    try {
      await createBookmark.mutateAsync({
        repo_id: repo.id,
        name: repo.name,
        full_name: repo.full_name,
        html_url: repo.html_url,
        description: repo.description,
        owner_login: repo.owner.login,
        owner_avatar_url: repo.owner.avatar_url,
      })
      setBookmarked(true)
      onBookmarkSuccess?.()
    } catch (error) {
      console.error('Failed to bookmark:', error)
    }
  }

  return (
    <Card className="hover:shadow-md transition-shadow w-full max-w-full relative">
      <CardHeader className="pr-12">
        <div className="flex flex-col gap-1 min-w-0 w-full">
          <CardTitle className="text-lg truncate w-full">
            <a
              href={repo.html_url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-git-primary hover:underline block truncate"
            >
              {repo.full_name}
            </a>
          </CardTitle>
          <CardDescription className="line-clamp-2 mt-1 break-words w-full">
            {repo.description || "No description available"}
          </CardDescription>
        </div>
        <Button
          size="sm"
          variant={bookmarked ? "secondary" : "outline"}
          onClick={handleBookmark}
          disabled={bookmarked || createBookmark.isPending}
          aria-label={bookmarked ? "Bookmarked" : "Bookmark repository"}
          className={`absolute top-4 right-4 h-8 w-8 p-0 rounded-full transition-all duration-200 ${
            bookmarked 
              ? "text-emerald-600 bg-emerald-50 border border-emerald-200 hover:bg-emerald-100 hover:border-emerald-300" 
              : "text-slate-400 hover:text-emerald-600 hover:border-emerald-600 hover:bg-emerald-50 rounded-full"
          }`}
        >
          {bookmarked ? (
            <BookmarkCheck className="h-4 w-4 fill-emerald-600" />
          ) : (
            <Bookmark className="h-4 w-4" />
          )}
        </Button>
      </CardHeader>
      <CardContent>
        <div className="flex flex-wrap items-center gap-4 text-sm text-slate-600">
          {repo.language && (
            <Badge variant="secondary">{repo.language}</Badge>
          )}
          <div className="flex items-center gap-1">
            <Star className="h-4 w-4" />
            <span>{repo.stargazers_count.toLocaleString()}</span>
          </div>
          <div className="flex items-center gap-1">
            <GitFork className="h-4 w-4" />
            <span>{repo.forks_count.toLocaleString()}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
