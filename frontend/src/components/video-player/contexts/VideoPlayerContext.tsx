import {
  createContext,
  useContext,
  useCallback,
  useRef,
  useState,
  type ReactNode,
  type RefObject,
  type SyntheticEvent,
} from 'react'

interface VideoPlayerState {
  url: string
  isReady: boolean
  isPlaying: boolean
  error: string | null
  currentTime: number
  duration: number
  volume: number
  isMuted: boolean
  playbackRate: number
}

interface VideoPlayerActions {
  play: () => void
  pause: () => void
  togglePlay: () => void
  seek: (percent: number) => void
  seekTo: (seconds: number) => void
  setVolume: (volume: number) => void
  toggleMute: () => void
  skipBack: () => void
  skipForward: () => void
  requestFullscreen: () => void
  cyclePlaybackRate: () => void
}

interface VideoPlayerCallbacks {
  handleReady: () => void
  handlePlay: () => void
  handlePause: () => void
  handleTimeUpdate: (event: SyntheticEvent<HTMLVideoElement>) => void
  handleDurationChange: (event: SyntheticEvent<HTMLVideoElement>) => void
  handleError: () => void
}

interface VideoPlayerContextValue extends VideoPlayerState, VideoPlayerActions, VideoPlayerCallbacks {
  playerRef: RefObject<HTMLVideoElement | null>
  wrapperRef: RefObject<HTMLDivElement | null>
  progressPercent: number
  playbackRates: number[]
}

const VideoPlayerContext = createContext<VideoPlayerContextValue | null>(null)

export function useVideoPlayerContext() {
  const context = useContext(VideoPlayerContext)
  if (!context) {
    throw new Error('useVideoPlayerContext must be used within a VideoPlayerProvider')
  }
  return context
}

interface VideoPlayerProviderProps {
  url: string
  children: ReactNode
  onReady?: () => void
  onError?: (error: string) => void
  onPlay?: () => void
  onPause?: () => void
}

export function VideoPlayerProvider({
  url,
  children,
  onReady,
  onError,
  onPlay,
  onPause,
}: VideoPlayerProviderProps) {
  const playerRef = useRef<HTMLVideoElement | null>(null)
  const wrapperRef = useRef<HTMLDivElement | null>(null)

  const [isReady, setIsReady] = useState(false)
  const [isPlaying, setIsPlaying] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)
  const [volume, setVolumeState] = useState(0.8)
  const [isMuted, setIsMuted] = useState(false)
  const [playbackRate, setPlaybackRateState] = useState(1)

  const playbackRates = [1, 1.5, 2]

  // Callbacks for ReactPlayer
  const handleReady = useCallback(() => {
    setIsReady(true)
    setError(null)
    onReady?.()
  }, [onReady])

  const handlePlay = useCallback(() => {
    setIsPlaying(true)
    onPlay?.()
  }, [onPlay])

  const handlePause = useCallback(() => {
    setIsPlaying(false)
    onPause?.()
  }, [onPause])

  const handleTimeUpdate = useCallback((event: SyntheticEvent<HTMLVideoElement>) => {
    const video = event.currentTarget
    setCurrentTime(video.currentTime)
  }, [])

  const handleDurationChange = useCallback((event: SyntheticEvent<HTMLVideoElement>) => {
    const video = event.currentTarget
    setDuration(video.duration)
  }, [])

  const handleError = useCallback(() => {
    setError('Failed to load video')
    setIsReady(false)
    onError?.('Failed to load video')
  }, [onError])

  // Actions
  const play = useCallback(() => {
    setIsPlaying(true)
  }, [])

  const pause = useCallback(() => {
    setIsPlaying(false)
  }, [])

  const togglePlay = useCallback(() => {
    setIsPlaying((prev) => !prev)
  }, [])

  const seek = useCallback(
    (percent: number) => {
      if (!playerRef.current || !duration) return
      const newTime = (percent / 100) * duration
      playerRef.current.currentTime = newTime
    },
    [duration]
  )

  const seekTo = useCallback((seconds: number) => {
    if (!playerRef.current) return
    playerRef.current.currentTime = seconds
  }, [])

  const setVolume = useCallback(
    (newVolume: number) => {
      setVolumeState(newVolume)
      if (playerRef.current) {
        playerRef.current.volume = newVolume
      }
      if (newVolume > 0 && isMuted) {
        setIsMuted(false)
      }
    },
    [isMuted]
  )

  const toggleMute = useCallback(() => {
    setIsMuted((prev) => !prev)
  }, [])

  const skipBack = useCallback(() => {
    if (!playerRef.current) return
    const newTime = Math.max(0, currentTime - 10)
    playerRef.current.currentTime = newTime
  }, [currentTime])

  const skipForward = useCallback(() => {
    if (!playerRef.current) return
    const newTime = Math.min(duration, currentTime + 10)
    playerRef.current.currentTime = newTime
  }, [currentTime, duration])

  const requestFullscreen = useCallback(() => {
    if (wrapperRef.current?.requestFullscreen) {
      wrapperRef.current.requestFullscreen()
    }
  }, [])

  const cyclePlaybackRate = useCallback(() => {
    const currentIndex = playbackRates.indexOf(playbackRate)
    const nextIndex = (currentIndex + 1) % playbackRates.length
    const newRate = playbackRates[nextIndex]
    setPlaybackRateState(newRate)
  }, [playbackRate, playbackRates])

  const progressPercent = duration > 0 ? (currentTime / duration) * 100 : 0

  const value: VideoPlayerContextValue = {
    // State
    url,
    isReady,
    isPlaying,
    error,
    currentTime,
    duration,
    volume,
    isMuted,
    playbackRate,
    // Actions
    play,
    pause,
    togglePlay,
    seek,
    seekTo,
    setVolume,
    toggleMute,
    skipBack,
    skipForward,
    requestFullscreen,
    cyclePlaybackRate,
    // Callbacks
    handleReady,
    handlePlay,
    handlePause,
    handleTimeUpdate,
    handleDurationChange,
    handleError,
    // Refs and computed
    playerRef,
    wrapperRef,
    progressPercent,
    playbackRates,
  }

  return (
    <VideoPlayerContext.Provider value={value}>
      {children}
    </VideoPlayerContext.Provider>
  )
}
