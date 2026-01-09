import { useEffect, useState, useRef, useCallback } from 'react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Slider } from '@/components/ui/slider'
import {
  Play,
  Pause,
  Volume2,
  VolumeX,
  Maximize,
  SkipBack,
  SkipForward,
} from 'lucide-react'

interface VideoPlayerProps {
  url: string
  showStatus?: boolean
  showUrl?: boolean
  onReady?: () => void
  onError?: (error: string) => void
  onPlay?: () => void
  onPause?: () => void
}

interface YTPlayer {
  playVideo: () => void
  pauseVideo: () => void
  seekTo: (seconds: number, allowSeekAhead: boolean) => void
  setVolume: (volume: number) => void
  getVolume: () => number
  mute: () => void
  unMute: () => void
  isMuted: () => boolean
  getCurrentTime: () => number
  getDuration: () => number
  getPlayerState: () => number
  getPlaybackRate: () => number
  setPlaybackRate: (rate: number) => void
  destroy: () => void
}

declare global {
  interface Window {
    YT: {
      Player: new (
        elementId: string,
        config: {
          videoId: string
          playerVars?: Record<string, number | string>
          events?: {
            onReady?: (event: { target: YTPlayer }) => void
            onStateChange?: (event: { data: number }) => void
            onError?: () => void
          }
        }
      ) => YTPlayer
      PlayerState: {
        PLAYING: number
        PAUSED: number
        ENDED: number
        BUFFERING: number
      }
    }
    onYouTubeIframeAPIReady: () => void
  }
}

function getYouTubeId(url: string): string | null {
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/
  const match = url.match(regExp)
  return match && match[2].length === 11 ? match[2] : null
}

function formatTime(seconds: number): string {
  if (!seconds || !isFinite(seconds)) return '0:00'
  const mins = Math.floor(seconds / 60)
  const secs = Math.floor(seconds % 60)
  return `${mins}:${secs.toString().padStart(2, '0')}`
}

let apiLoaded = false
let apiLoading = false
const apiCallbacks: (() => void)[] = []

function loadYouTubeAPI(): Promise<void> {
  return new Promise((resolve) => {
    if (apiLoaded) {
      resolve()
      return
    }

    apiCallbacks.push(resolve)

    if (apiLoading) return

    apiLoading = true

    const tag = document.createElement('script')
    tag.src = 'https://www.youtube.com/iframe_api'
    const firstScriptTag = document.getElementsByTagName('script')[0]
    firstScriptTag.parentNode?.insertBefore(tag, firstScriptTag)

    window.onYouTubeIframeAPIReady = () => {
      apiLoaded = true
      apiCallbacks.forEach((cb) => cb())
      apiCallbacks.length = 0
    }
  })
}

export function VideoPlayer({
  url,
  showStatus = true,
  showUrl = true,
  onReady,
  onError,
  onPlay,
  onPause,
}: VideoPlayerProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const playerRef = useRef<YTPlayer | null>(null)
  const playerIdRef = useRef(`yt-player-${Math.random().toString(36).slice(2)}`)
  const intervalRef = useRef<number | null>(null)

  const [isReady, setIsReady] = useState(false)
  const [isPlaying, setIsPlaying] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)
  const [volume, setVolume] = useState(80)
  const [isMuted, setIsMuted] = useState(false)
  const [playbackRate, setPlaybackRate] = useState(1)

  const playbackRates = [1, 1.5, 2]

  // Initialize player
  useEffect(() => {
    const id = getYouTubeId(url)
    if (!id) {
      setError('Invalid YouTube URL')
      onError?.('Invalid YouTube URL')
      return
    }

    setError(null)
    setIsReady(false)
    setIsPlaying(false)
    setCurrentTime(0)
    setDuration(0)

    loadYouTubeAPI().then(() => {
      // Destroy previous player if exists
      if (playerRef.current) {
        playerRef.current.destroy()
        playerRef.current = null
      }

      // Create player container
      if (containerRef.current) {
        const playerDiv = document.createElement('div')
        playerDiv.id = playerIdRef.current
        containerRef.current.innerHTML = ''
        containerRef.current.appendChild(playerDiv)

        playerRef.current = new window.YT.Player(playerIdRef.current, {
          videoId: id,
          playerVars: {
            autoplay: 0,
            controls: 0,
            rel: 0,
            modestbranding: 1,
            playsinline: 1,
          },
          events: {
            onReady: (event) => {
              setIsReady(true)
              setDuration(event.target.getDuration())
              setVolume(event.target.getVolume())
              setIsMuted(event.target.isMuted())
              onReady?.()
            },
            onStateChange: (event) => {
              if (event.data === window.YT.PlayerState.PLAYING) {
                setIsPlaying(true)
                onPlay?.()
              } else if (event.data === window.YT.PlayerState.PAUSED) {
                setIsPlaying(false)
                onPause?.()
              } else if (event.data === window.YT.PlayerState.ENDED) {
                setIsPlaying(false)
              }
            },
            onError: () => {
              setError('Failed to load video')
              onError?.('Failed to load video')
            },
          },
        })
      }
    })

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
    }
  }, [url, onReady, onError, onPlay, onPause])

  // Update current time
  useEffect(() => {
    if (isPlaying && playerRef.current) {
      intervalRef.current = window.setInterval(() => {
        if (playerRef.current) {
          setCurrentTime(playerRef.current.getCurrentTime())
        }
      }, 500)
    } else if (intervalRef.current) {
      clearInterval(intervalRef.current)
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
    }
  }, [isPlaying])

  const handlePlayPause = useCallback(() => {
    if (!playerRef.current) return
    if (isPlaying) {
      playerRef.current.pauseVideo()
    } else {
      playerRef.current.playVideo()
    }
  }, [isPlaying])

  const handleSeek = useCallback((value: number[]) => {
    if (!playerRef.current) return
    const newTime = (value[0] / 100) * duration
    playerRef.current.seekTo(newTime, true)
    setCurrentTime(newTime)
  }, [duration])

  const handleVolumeChange = useCallback((value: number[]) => {
    if (!playerRef.current) return
    const newVolume = value[0]
    playerRef.current.setVolume(newVolume)
    setVolume(newVolume)
    if (newVolume > 0 && isMuted) {
      playerRef.current.unMute()
      setIsMuted(false)
    }
  }, [isMuted])

  const handleMuteToggle = useCallback(() => {
    if (!playerRef.current) return
    if (isMuted) {
      playerRef.current.unMute()
      setIsMuted(false)
    } else {
      playerRef.current.mute()
      setIsMuted(true)
    }
  }, [isMuted])

  const handleSkipBack = useCallback(() => {
    if (!playerRef.current) return
    const newTime = Math.max(0, currentTime - 10)
    playerRef.current.seekTo(newTime, true)
    setCurrentTime(newTime)
  }, [currentTime])

  const handleSkipForward = useCallback(() => {
    if (!playerRef.current) return
    const newTime = Math.min(duration, currentTime + 10)
    playerRef.current.seekTo(newTime, true)
    setCurrentTime(newTime)
  }, [currentTime, duration])

  const handleFullscreen = useCallback(() => {
    if (containerRef.current) {
      const iframe = containerRef.current.querySelector('iframe')
      if (iframe) {
        if (iframe.requestFullscreen) {
          iframe.requestFullscreen()
        }
      }
    }
  }, [])

  const handlePlaybackRateChange = useCallback(() => {
    if (!playerRef.current) return
    const currentIndex = playbackRates.indexOf(playbackRate)
    const nextIndex = (currentIndex + 1) % playbackRates.length
    const newRate = playbackRates[nextIndex]
    playerRef.current.setPlaybackRate(newRate)
    setPlaybackRate(newRate)
  }, [playbackRate, playbackRates])

  const progressPercent = duration > 0 ? (currentTime / duration) * 100 : 0

  return (
    <div className="space-y-4">
      {/* Player Container */}
      <div className="relative aspect-video bg-black rounded-lg overflow-hidden">
        <div ref={containerRef} className="absolute inset-0" />
        {error && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/90 z-10">
            <div className="text-center text-white p-4">
              <p className="text-red-400 mb-2 text-lg">Error loading video</p>
              <p className="text-sm text-gray-400">{error}</p>
            </div>
          </div>
        )}
      </div>

      {/* Custom Controls */}
      {isReady && !error && (
        <div className="space-y-3">
          {/* Progress Bar */}
          <div className="space-y-1">
            <Slider
              value={[progressPercent]}
              max={100}
              step={0.1}
              onValueChange={handleSeek}
              className="cursor-pointer"
            />
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>{formatTime(currentTime)}</span>
              <span>{formatTime(duration)}</span>
            </div>
          </div>

          {/* Controls */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1">
              <Button variant="ghost" size="icon" onClick={handleSkipBack}>
                <SkipBack className="h-4 w-4" />
              </Button>
              <Button variant="default" size="icon" onClick={handlePlayPause}>
                {isPlaying ? (
                  <Pause className="h-4 w-4" />
                ) : (
                  <Play className="h-4 w-4" />
                )}
              </Button>
              <Button variant="ghost" size="icon" onClick={handleSkipForward}>
                <SkipForward className="h-4 w-4" />
              </Button>
            </div>

            <div className="flex items-center gap-2">
              <Button variant="ghost" size="icon" onClick={handleMuteToggle}>
                {isMuted ? (
                  <VolumeX className="h-4 w-4" />
                ) : (
                  <Volume2 className="h-4 w-4" />
                )}
              </Button>
              <Slider
                value={[isMuted ? 0 : volume]}
                max={100}
                step={1}
                onValueChange={handleVolumeChange}
                className="w-24 cursor-pointer"
              />
              <Button
                variant="ghost"
                size="sm"
                onClick={handlePlaybackRateChange}
                className="min-w-[3rem] text-xs font-medium"
              >
                {playbackRate}x
              </Button>
              <Button variant="ghost" size="icon" onClick={handleFullscreen}>
                <Maximize className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Status */}
      {showStatus && (
        <div className="flex items-center gap-2">
          <Badge variant={isReady ? 'success' : 'secondary'}>
            {isReady ? 'Ready' : 'Loading...'}
          </Badge>
          {isPlaying && <Badge variant="default">Playing</Badge>}
          {error && <Badge variant="destructive">Error</Badge>}
        </div>
      )}

      {/* Current URL */}
      {showUrl && (
        <div className="p-3 bg-muted rounded-lg">
          <p className="text-xs text-muted-foreground mb-1">Current URL:</p>
          <p className="text-sm font-mono break-all">{url}</p>
        </div>
      )}
    </div>
  )
}
