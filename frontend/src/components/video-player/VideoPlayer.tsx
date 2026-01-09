import BaseReactPlayer from 'react-player'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { useVideoPlayer } from './hooks'

// Cast to any to avoid type issues with react-player
const ReactPlayer = BaseReactPlayer as unknown as React.FC<{
  url: string
  playing?: boolean
  controls?: boolean
  volume?: number
  muted?: boolean
  onReady?: () => void
  onError?: () => void
  onPlay?: () => void
  onPause?: () => void
  onEnded?: () => void
  onProgress?: (state: { played: number; playedSeconds: number; loaded: number; loadedSeconds: number }) => void
  onDuration?: (duration: number) => void
  width?: string | number
  height?: string | number
  style?: React.CSSProperties
}>

interface VideoPlayerProps {
  url: string
  fallbackUrl?: string
  autoPlay?: boolean
  showStatus?: boolean
  showUrl?: boolean
  onReady?: () => void
  onError?: (error: string) => void
  onPlay?: () => void
  onPause?: () => void
}

export function VideoPlayer({
  url,
  fallbackUrl,
  autoPlay = false,
  showStatus = true,
  showUrl = true,
  onReady,
  onError,
  onPlay,
  onPause,
}: VideoPlayerProps) {
  const player = useVideoPlayer({
    initialUrl: url,
    fallbackUrl,
    autoPlay,
    onReady,
    onError,
    onPlay,
    onPause,
  })

  return (
    <div className="space-y-4">
      {/* Player Container */}
      <div className="relative aspect-video bg-black rounded-lg overflow-hidden">
        <ReactPlayer
          url={player.url}
          playing={player.isPlaying}
          controls={true}
          onReady={player.handlers.onReady}
          onError={player.handlers.onError}
          onPlay={player.handlers.onPlay}
          onPause={player.handlers.onPause}
          onEnded={player.handlers.onEnded}
          width="100%"
          height="100%"
          style={{ position: 'absolute', top: 0, left: 0 }}
        />
        {player.error && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/90 z-10">
            <div className="text-center text-white p-4">
              <p className="text-red-400 mb-2 text-lg">Error loading video</p>
              <p className="text-sm text-gray-400 mb-4">{player.error}</p>
              {fallbackUrl && (
                <Button
                  variant="outline"
                  onClick={player.tryFallback}
                  className="text-white border-white hover:bg-white/20"
                >
                  Try Sample MP4
                </Button>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Status */}
      {showStatus && (
        <div className="flex items-center gap-2">
          <Badge variant={player.isReady ? 'success' : 'secondary'}>
            {player.isReady ? 'Ready' : 'Loading...'}
          </Badge>
          {player.isPlaying && <Badge variant="default">Playing</Badge>}
          {player.error && <Badge variant="destructive">Error</Badge>}
        </div>
      )}

      {/* Current URL */}
      {showUrl && (
        <div className="p-3 bg-muted rounded-lg">
          <p className="text-xs text-muted-foreground mb-1">Current URL:</p>
          <p className="text-sm font-mono break-all">{player.url}</p>
        </div>
      )}
    </div>
  )
}
