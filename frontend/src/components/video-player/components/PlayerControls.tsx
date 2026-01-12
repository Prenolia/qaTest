import { useVideoPlayerContext } from '../contexts'
import { ProgressBar } from './ProgressBar'
import { PlaybackControls } from './PlaybackControls'
import { VolumeControls } from './VolumeControls'

export function PlayerControls() {
  const { isReady, error } = useVideoPlayerContext()

  if (!isReady || error) return null

  return (
    <div className="space-y-3">
      <ProgressBar />
      <div className="flex items-center justify-between">
        <PlaybackControls />
        <VolumeControls />
      </div>
    </div>
  )
}
