import {
  type RefObject,
  type SyntheticEvent
} from 'react'

export interface VideoPlayerState {
  url: string
  isReady: boolean
  isPlaying: boolean
  error: string | null
  currentTime: number
  duration: number
  volume: number
  isMuted: boolean
  playbackRate: number
}

export interface VideoPlayerActions {
  play: () => void
  pause: () => void
  togglePlay: () => void
  seek: (percent: number) => void
  seekTo: (seconds: number) => void
  setVolume: (volume: number) => void
  toggleMute: () => void
  skipBack: () => void
  skipForward: () => void
  requestFullscreen: () => void
  cyclePlaybackRate: () => void
}

export interface VideoPlayerCallbacks {
  handleReady: () => void
  handlePlay: () => void
  handlePause: () => void
  handleTimeUpdate: (event: SyntheticEvent<HTMLVideoElement>) => void
  handleDurationChange: (event: SyntheticEvent<HTMLVideoElement>) => void
  handleError: () => void
}

export interface VideoPlayerContextValue extends VideoPlayerState, VideoPlayerActions, VideoPlayerCallbacks {
  playerRef: RefObject<HTMLVideoElement | null>
  wrapperRef: RefObject<HTMLDivElement | null>
  progressPercent: number
  playbackRates: number[]
}