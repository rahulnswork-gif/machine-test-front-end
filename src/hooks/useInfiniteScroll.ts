import { useEffect, useRef } from 'react'

interface UseInfiniteScrollOptions {
  onLoadMore: () => void
  hasMore: boolean
  isLoading: boolean
  threshold?: number
}

/**
 * Custom hook for implementing infinite scroll using Intersection Observer
 * @param onLoadMore - Callback function to load more data
 * @param hasMore - Whether there is more data to load
 * @param isLoading - Whether data is currently being loaded
 * @param threshold - Distance from bottom (in pixels) to trigger load (default: 100)
 */
export function useInfiniteScroll({
  onLoadMore,
  hasMore,
  isLoading,
  threshold = 100,
}: UseInfiniteScrollOptions) {
  const observerRef = useRef<IntersectionObserver | null>(null)
  const loadMoreRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    // Don't set up observer if we can't load more or are already loading
    if (!hasMore || isLoading) {
      return
    }

    // Create intersection observer
    observerRef.current = new IntersectionObserver(
      (entries) => {
        const firstEntry = entries[0]
        if (firstEntry.isIntersecting && hasMore && !isLoading) {
          onLoadMore()
        }
      },
      {
        rootMargin: `${threshold}px`,
      }
    )

    // Observe the load more element
    const currentElement = loadMoreRef.current
    if (currentElement) {
      observerRef.current.observe(currentElement)
    }

    // Cleanup
    return () => {
      if (observerRef.current && currentElement) {
        observerRef.current.unobserve(currentElement)
      }
    }
  }, [hasMore, isLoading, onLoadMore, threshold])

  return loadMoreRef
}
