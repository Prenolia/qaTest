import ReactPlayer from 'react-player'
import { useVideoPlayerContext } from '../contexts'

export function PlayerContainer() {
  const {
    url,
    isPlaying,
    volume,
    isMuted,
    playbackRate,
    error,
    playerRef,
    wrapperRef,
    handleReady,
    handlePlay,
    handlePause,
    handleTimeUpdate,
    handleDurationChange,
    handleError,
  } = useVideoPlayerContext()

  return (
    <div
      ref={wrapperRef}
      className="relative aspect-video bg-black rounded-lg overflow-hidden"
    >
      <ReactPlayer
        ref={playerRef}
        src={url}
        playing={isPlaying}
        volume={volume}
        muted={isMuted}
        playbackRate={playbackRate}
        controls={false}
        width="100%"
        height="100%"
        onReady={handleReady}
        onPlay={handlePlay}
        onPause={handlePause}
        onTimeUpdate={handleTimeUpdate}
        onDurationChange={handleDurationChange}
        onError={handleError}
        config={{
          youtube: {
            rel: 0,
          },
        }}
      />
      {error && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/90 z-10">
          <div className="text-center text-white p-4">
            <p className="text-red-400 mb-2 text-lg">Error loading video</p>
            <p className="text-sm text-gray-400">{error}</p>
          </div>
        </div>
      )}
    </div>
  )
}
