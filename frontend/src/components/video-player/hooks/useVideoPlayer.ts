import { useState, useEffect, useCallback } from 'react'

export interface UseVideoPlayerOptions {
  initialUrl: string
  fallbackUrl?: string
  autoPlay?: boolean
  onReady?: () => void
  onError?: (error: string) => void
  onPlay?: () => void
  onPause?: () => void
  onEnded?: () => void
}

export interface UseVideoPlayerReturn {
  // State
  url: string
  isReady: boolean
  isPlaying: boolean
  error: string | null

  // Actions
  play: () => void
  pause: () => void
  toggle: () => void
  loadVideo: (url: string) => void
  tryFallback: () => void
  reset: () => void

  // Event handlers for ReactPlayer
  handlers: {
    onReady: () => void
    onError: () => void
    onPlay: () => void
    onPause: () => void
    onEnded: () => void
  }
}

export function useVideoPlayer(options: UseVideoPlayerOptions): UseVideoPlayerReturn {
  const {
    initialUrl,
    fallbackUrl,
    autoPlay = false,
    onReady,
    onError,
    onPlay,
    onPause,
    onEnded,
  } = options

  const [url, setUrl] = useState(initialUrl)
  const [isReady, setIsReady] = useState(false)
  const [isPlaying, setIsPlaying] = useState(autoPlay)
  const [error, setError] = useState<string | null>(null)

  // Update URL when initialUrl prop changes
  useEffect(() => {
    setUrl(initialUrl)
    setIsReady(false)
    setError(null)
  }, [initialUrl])

  // Actions
  const play = useCallback(() => {
    setIsPlaying(true)
  }, [])

  const pause = useCallback(() => {
    setIsPlaying(false)
  }, [])

  const toggle = useCallback(() => {
    setIsPlaying((prev) => !prev)
  }, [])

  const loadVideo = useCallback((newUrl: string) => {
    setUrl(newUrl)
    setIsReady(false)
    setError(null)
    setIsPlaying(false)
  }, [])

  const tryFallback = useCallback(() => {
    if (fallbackUrl) {
      loadVideo(fallbackUrl)
    }
  }, [fallbackUrl, loadVideo])

  const reset = useCallback(() => {
    setUrl(initialUrl)
    setIsReady(false)
    setError(null)
    setIsPlaying(false)
  }, [initialUrl])

  // Event handlers
  const handleReady = useCallback(() => {
    setIsReady(true)
    setError(null)
    onReady?.()
  }, [onReady])

  const handleError = useCallback(() => {
    const errorMessage = 'Failed to load video. Try a different URL.'
    setError(errorMessage)
    setIsReady(false)
    setIsPlaying(false)
    onError?.(errorMessage)
  }, [onError])

  const handlePlay = useCallback(() => {
    setIsPlaying(true)
    onPlay?.()
  }, [onPlay])

  const handlePause = useCallback(() => {
    setIsPlaying(false)
    onPause?.()
  }, [onPause])

  const handleEnded = useCallback(() => {
    setIsPlaying(false)
    onEnded?.()
  }, [onEnded])

  return {
    // State
    url,
    isReady,
    isPlaying,
    error,

    // Actions
    play,
    pause,
    toggle,
    loadVideo,
    tryFallback,
    reset,

    // Event handlers
    handlers: {
      onReady: handleReady,
      onError: handleError,
      onPlay: handlePlay,
      onPause: handlePause,
      onEnded: handleEnded,
    },
  }
}
