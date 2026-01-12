import { Slider } from '@/components/ui/slider'
import { useVideoPlayerContext } from '../contexts'
import { formatTime } from '../utils'

export function ProgressBar() {
  const { progressPercent, currentTime, duration, seek } = useVideoPlayerContext()

  const handleSeek = (value: number[]) => {
    seek(value[0])
  }

  return (
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
  )
}
