import { Badge } from '@/components/ui/badge'
import { useVideoPlayerContext } from '../contexts'

export function StatusBadges() {
  const { isReady, isPlaying, error } = useVideoPlayerContext()

  return (
    <div className="flex items-center gap-2">
      <Badge variant={isReady ? 'success' : 'secondary'}>
        {isReady ? 'Ready' : 'Loading...'}
      </Badge>
      {isPlaying && <Badge variant="default">Playing</Badge>}
      {error && <Badge variant="destructive">Error</Badge>}
    </div>
  )
}
