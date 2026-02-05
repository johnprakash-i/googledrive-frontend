import { useRef, useCallback, useState, useEffect } from 'react'

interface UseVirtualizedGridProps {
  itemCount: number
  itemHeight: number
  overscan?: number
  containerHeight: number
}

export function useVirtualizedGrid({
  itemCount,
  itemHeight,
  overscan = 3,
  containerHeight,
}: UseVirtualizedGridProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [scrollTop, setScrollTop] = useState(0)

  const handleScroll = useCallback(() => {
    if (containerRef.current) {
      setScrollTop(containerRef.current.scrollTop)
    }
  }, [])

  // Calculate visible items
  const startIndex = Math.max(0, Math.floor(scrollTop / itemHeight) - overscan)
  const visibleItemCount = Math.ceil(containerHeight / itemHeight) + 2 * overscan
  const endIndex = Math.min(itemCount, startIndex + visibleItemCount)

  // Calculate padding
  const paddingTop = startIndex * itemHeight
  const paddingBottom = (itemCount - endIndex) * itemHeight

  // Attach scroll listener
  useEffect(() => {
    const container = containerRef.current
    if (container) {
      container.addEventListener('scroll', handleScroll)
      return () => container.removeEventListener('scroll', handleScroll)
    }
  }, [handleScroll])

  return {
    containerRef,
    startIndex,
    endIndex,
    paddingTop,
    paddingBottom,
    visibleItemCount,
  }
}