export interface VideoPlayerProps {
  url: string
  showStatus?: boolean
  onReady?: () => void
  onError?: (error: string) => void
  onPlay?: () => void
  onPause?: () => void
}
