import type { VideoPlayerProps } from './types'
import { VideoPlayerProvider } from './contexts'
import { PlayerContainer, PlayerControls, StatusBadges } from './components'

export function VideoPlayer({
  url,
  showStatus = true,
  onReady,
  onError,
  onPlay,
  onPause,
}: VideoPlayerProps) {
  return (
    <VideoPlayerProvider
      url={url}
      onReady={onReady}
      onError={onError}
      onPlay={onPlay}
      onPause={onPause}
    >
      <div className="space-y-4">
        <PlayerContainer />
        <PlayerControls />
        {showStatus && <StatusBadges />}
      </div>
    </VideoPlayerProvider>
  )
}
