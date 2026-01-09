import { useState, useCallback } from 'react'

export interface UseVideoVolumeOptions {
  initialVolume?: number
  initialMuted?: boolean
  onVolumeChange?: (volume: number) => void
  onMutedChange?: (muted: boolean) => void
}

export interface UseVideoVolumeReturn {
  // State
  volume: number        // 0 to 1
  isMuted: boolean

  // Computed
  volumePercent: number
  effectiveVolume: number  // Returns 0 if muted, otherwise volume

  // Actions
  setVolume: (volume: number) => void
  mute: () => void
  unmute: () => void
  toggleMute: () => void
  increaseVolume: (step?: number) => void
  decreaseVolume: (step?: number) => void
}

export function useVideoVolume(options: UseVideoVolumeOptions = {}): UseVideoVolumeReturn {
  const {
    initialVolume = 0.8,
    initialMuted = false,
    onVolumeChange,
    onMutedChange,
  } = options

  const [volume, setVolumeState] = useState(initialVolume)
  const [isMuted, setIsMuted] = useState(initialMuted)

  // Computed values
  const volumePercent = volume * 100
  const effectiveVolume = isMuted ? 0 : volume

  // Actions
  const setVolume = useCallback((newVolume: number) => {
    const clampedVolume = Math.max(0, Math.min(1, newVolume))
    setVolumeState(clampedVolume)

    // Auto-unmute when adjusting volume
    if (clampedVolume > 0 && isMuted) {
      setIsMuted(false)
      onMutedChange?.(false)
    }

    onVolumeChange?.(clampedVolume)
  }, [isMuted, onVolumeChange, onMutedChange])

  const mute = useCallback(() => {
    setIsMuted(true)
    onMutedChange?.(true)
  }, [onMutedChange])

  const unmute = useCallback(() => {
    setIsMuted(false)
    onMutedChange?.(false)
  }, [onMutedChange])

  const toggleMute = useCallback(() => {
    setIsMuted((prev) => {
      const newValue = !prev
      onMutedChange?.(newValue)
      return newValue
    })
  }, [onMutedChange])

  const increaseVolume = useCallback((step = 0.1) => {
    setVolume(volume + step)
  }, [volume, setVolume])

  const decreaseVolume = useCallback((step = 0.1) => {
    setVolume(volume - step)
  }, [volume, setVolume])

  return {
    // State
    volume,
    isMuted,

    // Computed
    volumePercent,
    effectiveVolume,

    // Actions
    setVolume,
    mute,
    unmute,
    toggleMute,
    increaseVolume,
    decreaseVolume,
  }
}
