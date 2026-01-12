import { Button } from '@/components/ui/button'
import { Play, Pause, SkipBack, SkipForward } from 'lucide-react'
import { useVideoPlayerContext } from '../contexts'

export function PlaybackControls() {
  const { isPlaying, togglePlay, skipBack, skipForward } = useVideoPlayerContext()

  return (
    <div className="flex items-center gap-1">
      <Button variant="ghost" size="icon" onClick={skipBack}>
        <SkipBack className="size-4" />
      </Button>
      <Button variant="default" size="icon" onClick={togglePlay}>
        {isPlaying ? <Pause className="size-4" /> : <Play className="size-4" />}
      </Button>
      <Button variant="ghost" size="icon" onClick={skipForward}>
        <SkipForward className="size-4" />
      </Button>
    </div>
  )
}
