declare module 'react-player/youtube' {
  import type { ComponentType } from 'react'

  interface ReactPlayerProps {
    url?: string
    playing?: boolean
    loop?: boolean
    controls?: boolean
    light?: boolean | string
    volume?: number
    muted?: boolean
    playbackRate?: number
    width?: string | number
    height?: string | number
    style?: React.CSSProperties
    progressInterval?: number
    playsinline?: boolean
    pip?: boolean
    stopOnUnmount?: boolean
    fallback?: React.ReactNode
    wrapper?: React.ComponentType<{ children: React.ReactNode }>
    playIcon?: React.ReactNode
    previewTabIndex?: number
    config?: {
      youtube?: {
        playerVars?: Record<string, unknown>
        embedOptions?: Record<string, unknown>
        onUnstarted?: () => void
      }
    }
    onReady?: (player: ReactPlayer) => void
    onStart?: () => void
    onPlay?: () => void
    onPause?: () => void
    onBuffer?: () => void
    onBufferEnd?: () => void
    onEnded?: () => void
    onError?: (error: unknown) => void
    onDuration?: (duration: number) => void
    onSeek?: (seconds: number) => void
    onProgress?: (state: {
      played: number
      playedSeconds: number
      loaded: number
      loadedSeconds: number
    }) => void
    onClickPreview?: (event: React.MouseEvent) => void
    onEnablePIP?: () => void
    onDisablePIP?: () => void
  }

  interface ReactPlayer extends ComponentType<ReactPlayerProps> {
    seekTo: (amount: number, type?: 'seconds' | 'fraction') => void
    getCurrentTime: () => number
    getSecondsLoaded: () => number
    getDuration: () => number
    getInternalPlayer: (key?: string) => unknown
    showPreview: () => void
  }

  const ReactPlayer: React.ForwardRefExoticComponent<
    ReactPlayerProps & React.RefAttributes<ReactPlayer>
  >

  export default ReactPlayer
}

declare module 'react-player/base' {
  export interface OnProgressProps {
    played: number
    playedSeconds: number
    loaded: number
    loadedSeconds: number
  }
}
