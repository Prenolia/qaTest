import { useState, useCallback, useRef } from 'react'

export interface VideoProgress {
  played: number        // 0 to 1
  playedSeconds: number
  loaded: number        // 0 to 1
  loadedSeconds: number
}

export interface UseVideoProgressOptions {
  onProgress?: (progress: VideoProgress) => void
  onDuration?: (duration: number) => void
  onSeek?: (seconds: number) => void
}

export interface UseVideoProgressReturn {
  // State
  progress: VideoProgress
  duration: number
  currentTime: number
  isSeeking: boolean

  // Computed
  progressPercent: number
  loadedPercent: number
  formattedCurrentTime: string
  formattedDuration: string

  // Actions
  seekTo: (fraction: number) => void
  seekToSeconds: (seconds: number) => void

  // Event handlers for ReactPlayer
  handlers: {
    onProgress: (state: VideoProgress) => void
    onDuration: (duration: number) => void
  }

  // Ref for ReactPlayer
  playerRef: React.MutableRefObject<{ seekTo: (amount: number, type?: 'seconds' | 'fraction') => void } | null>
}

function formatTime(seconds: number): string {
  if (!seconds || !isFinite(seconds)) return '0:00'

  const mins = Math.floor(seconds / 60)
  const secs = Math.floor(seconds % 60)
  return `${mins}:${secs.toString().padStart(2, '0')}`
}

export function useVideoProgress(options: UseVideoProgressOptions = {}): UseVideoProgressReturn {
  const { onProgress, onDuration, onSeek } = options

  const playerRef = useRef<{ seekTo: (amount: number, type?: 'seconds' | 'fraction') => void } | null>(null)

  const [progress, setProgress] = useState<VideoProgress>({
    played: 0,
    playedSeconds: 0,
    loaded: 0,
    loadedSeconds: 0,
  })

  const [duration, setDuration] = useState(0)
  const [isSeeking, setIsSeeking] = useState(false)

  // Computed values
  const progressPercent = progress.played * 100
  const loadedPercent = progress.loaded * 100
  const currentTime = progress.playedSeconds
  const formattedCurrentTime = formatTime(currentTime)
  const formattedDuration = formatTime(duration)

  // Actions
  const seekTo = useCallback((fraction: number) => {
    const clampedFraction = Math.max(0, Math.min(1, fraction))
    setIsSeeking(true)

    if (playerRef.current) {
      playerRef.current.seekTo(clampedFraction, 'fraction')
    }

    setProgress((prev) => ({
      ...prev,
      played: clampedFraction,
      playedSeconds: clampedFraction * duration,
    }))

    onSeek?.(clampedFraction * duration)

    // Reset seeking state after a short delay
    setTimeout(() => setIsSeeking(false), 100)
  }, [duration, onSeek])

  const seekToSeconds = useCallback((seconds: number) => {
    const clampedSeconds = Math.max(0, Math.min(duration, seconds))
    const fraction = duration > 0 ? clampedSeconds / duration : 0
    seekTo(fraction)
  }, [duration, seekTo])

  // Event handlers
  const handleProgress = useCallback((state: VideoProgress) => {
    if (!isSeeking) {
      setProgress(state)
      onProgress?.(state)
    }
  }, [isSeeking, onProgress])

  const handleDuration = useCallback((dur: number) => {
    setDuration(dur)
    onDuration?.(dur)
  }, [onDuration])

  return {
    // State
    progress,
    duration,
    currentTime,
    isSeeking,

    // Computed
    progressPercent,
    loadedPercent,
    formattedCurrentTime,
    formattedDuration,

    // Actions
    seekTo,
    seekToSeconds,

    // Event handlers
    handlers: {
      onProgress: handleProgress,
      onDuration: handleDuration,
    },

    // Ref
    playerRef,
  }
}
