import { useState, useRef, useEffect } from "react"
import { Search, Loader2, GitBranch, Star } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { CustomSelect } from "@/components/ui/custom-select"
import { useSearchRepos, useSearchUsers } from "@/features/github/hooks/useGitHub"
import { useDebounce } from "@/hooks/useDebounce"
import { useNavigate } from "@tanstack/react-router"
import { TEXT } from "@/constants/text"

interface SearchSectionProps {
  onSearch: (query: string, type: 'users' | 'repos') => void
  isSearching: boolean
}

export function SearchSection({ onSearch, isSearching }: SearchSectionProps) {
  const navigate = useNavigate()
  const [searchType, setSearchType] = useState<'users' | 'repos'>('users')
  const [searchQuery, setSearchQuery] = useState("")
  const [showSuggestions, setShowSuggestions] = useState(false)
  const searchInputRef = useRef<HTMLDivElement>(null)

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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setShowSuggestions(false)
    onSearch(searchQuery, searchType)
  }

  const selectSuggestion = (value: string) => {
    if (searchType === 'users') {
      navigate({ to: `/user/${value}` })
    } else {
      setSearchQuery(value)
      setShowSuggestions(false)
      onSearch(value, searchType)
    }
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

  return (
    <Card className="border-none shadow-lg bg-white">
      <CardHeader className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white">
        <CardTitle className="text-2xl">{TEXT.SEARCH.TITLE}</CardTitle>
        <CardDescription className="text-blue-50">
          Find {searchType === 'users' ? TEXT.SEARCH.DESCRIPTION_USERS : TEXT.SEARCH.DESCRIPTION_REPOS}
        </CardDescription>
      </CardHeader>
      
      <CardContent className="pt-6">
        <form onSubmit={handleSubmit} className="relative">
          <div ref={searchInputRef} className="relative">
            <div className="flex flex-col md:flex-row gap-3">
              <CustomSelect 
                value={searchType} 
                onChange={(value) => {
                  setSearchType(value as 'users' | 'repos')
                  setSearchQuery("")
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
                  placeholder={searchType === 'users' ? TEXT.SEARCH.PLACEHOLDER_USERS : TEXT.SEARCH.PLACEHOLDER_REPOS}
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
                    <div className="px-3 py-2 text-xs font-semibold text-slate-500 uppercase tracking-wider bg-slate-50/50">{TEXT.SEARCH.SUGGESTIONS_LABEL}</div>
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
                    {TEXT.SEARCH.NO_SUGGESTIONS}
                  </div>
                )}
              </div>
            )}
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
