import { Button } from '@/components/ui/button'
import { Slider } from '@/components/ui/slider'
import { Volume2, VolumeX, Maximize } from 'lucide-react'
import { useVideoPlayerContext } from '../contexts'

export function VolumeControls() {
  const {
    volume,
    isMuted,
    playbackRate,
    setVolume,
    toggleMute,
    requestFullscreen,
    cyclePlaybackRate,
  } = useVideoPlayerContext()

  const handleVolumeChange = (value: number[]) => {
    setVolume(value[0])
  }

  return (
    <div className="flex items-center gap-2">
      <Button variant="ghost" size="icon" onClick={toggleMute}>
        {isMuted ? <VolumeX className="size-4" /> : <Volume2 className="size-4" />}
      </Button>
      <Slider
        value={[isMuted ? 0 : volume]}
        max={1}
        step={0.01}
        onValueChange={handleVolumeChange}
        className="w-24 cursor-pointer"
      />
      <Button
        variant="ghost"
        size="sm"
        onClick={cyclePlaybackRate}
        className="min-w-[3rem] text-xs font-medium"
      >
        {playbackRate}x
      </Button>
      <Button variant="ghost" size="icon" onClick={requestFullscreen}>
        <Maximize className="size-4" />
      </Button>
    </div>
  )
}
