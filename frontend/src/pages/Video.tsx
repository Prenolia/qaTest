import { useState, useRef } from 'react'
import ReactPlayer from 'react-player'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Slider } from '@/components/ui/slider'
import { Badge } from '@/components/ui/badge'
import {
  Play,
  Pause,
  Volume2,
  VolumeX,
  SkipBack,
  SkipForward,
  RefreshCw,
} from 'lucide-react'

const sampleVideos = [
  {
    title: 'Big Buck Bunny',
    url: 'https://www.youtube.com/watch?v=aqz-KE-bpKQ',
    description: 'Classic open source animated short',
  },
  {
    title: 'Sintel',
    url: 'https://www.youtube.com/watch?v=eRsGyueVLvQ',
    description: 'Blender Foundation short film',
  },
  {
    title: 'Sample MP4',
    url: 'https://www.w3schools.com/html/mov_bbb.mp4',
    description: 'Direct MP4 file test',
  },
]

export default function Video() {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const playerRef = useRef<any>(null)
  const [url, setUrl] = useState(sampleVideos[0].url)
  const [playing, setPlaying] = useState(false)
  const [volume, setVolume] = useState(0.8)
  const [muted, setMuted] = useState(false)
  const [played, setPlayed] = useState(0)
  const [seeking, setSeeking] = useState(false)
  const [duration, setDuration] = useState(0)
  const [ready, setReady] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleProgress = (state: { played: number; playedSeconds: number; loaded: number; loadedSeconds: number }) => {
    if (!seeking) {
      setPlayed(state.played)
    }
  }

  const handleDuration = (dur: number) => {
    setDuration(dur)
  }

  const handleReady = () => {
    setReady(true)
    setError(null)
  }

  const handleError = () => {
    setError('Failed to load video')
    setReady(false)
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = Math.floor(seconds % 60)
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  const handleSeekChange = (value: number[]) => {
    setPlayed(value[0])
  }

  const handleSeekMouseDown = () => {
    setSeeking(true)
  }

  const handleSeekMouseUp = (value: number[]) => {
    setSeeking(false)
    playerRef.current?.seekTo(value[0])
  }

  const handleSkipBack = () => {
    const newPlayed = Math.max(0, played - 0.05)
    setPlayed(newPlayed)
    playerRef.current?.seekTo(newPlayed)
  }

  const handleSkipForward = () => {
    const newPlayed = Math.min(1, played + 0.05)
    setPlayed(newPlayed)
    playerRef.current?.seekTo(newPlayed)
  }

  const loadVideo = (videoUrl: string) => {
    setUrl(videoUrl)
    setPlaying(false)
    setReady(false)
    setError(null)
    setPlayed(0)
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Video Player</CardTitle>
          <CardDescription>
            Test react-player integration with YouTube and direct video files
          </CardDescription>
        </CardHeader>
      </Card>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Video Player */}
        <div className="lg:col-span-2 space-y-4">
          <Card>
            <CardContent className="pt-6">
              {/* Player Container */}
              <div className="relative aspect-video bg-black rounded-lg overflow-hidden">
                <ReactPlayer
                  ref={playerRef}
                  url={url}
                  playing={playing}
                  volume={volume}
                  muted={muted}
                  // @ts-expect-error react-player types are incorrect
                  onProgress={handleProgress}
                  onDuration={handleDuration}
                  onReady={handleReady}
                  onError={handleError}
                  width="100%"
                  height="100%"
                  style={{ position: 'absolute', top: 0, left: 0 }}
                  controls={false}
                />
                {error && (
                  <div className="absolute inset-0 flex items-center justify-center bg-black/80">
                    <div className="text-center text-white">
                      <p className="text-red-400 mb-2">Error loading video</p>
                      <p className="text-sm text-gray-400">{error}</p>
                    </div>
                  </div>
                )}
              </div>

              {/* Progress Bar */}
              <div className="mt-4 space-y-2">
                <Slider
                  value={[played]}
                  max={1}
                  step={0.001}
                  onValueChange={handleSeekChange}
                  onPointerDown={handleSeekMouseDown}
                  onPointerUp={() => handleSeekMouseUp([played])}
                  className="cursor-pointer"
                />
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>{formatTime(played * duration)}</span>
                  <span>{formatTime(duration)}</span>
                </div>
              </div>

              {/* Controls */}
              <div className="flex items-center justify-between mt-4">
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={handleSkipBack}
                  >
                    <SkipBack className="h-4 w-4" />
                  </Button>
                  <Button
                    size="icon"
                    onClick={() => setPlaying(!playing)}
                  >
                    {playing ? (
                      <Pause className="h-4 w-4" />
                    ) : (
                      <Play className="h-4 w-4" />
                    )}
                  </Button>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={handleSkipForward}
                  >
                    <SkipForward className="h-4 w-4" />
                  </Button>
                </div>

                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => setMuted(!muted)}
                    >
                      {muted ? (
                        <VolumeX className="h-4 w-4" />
                      ) : (
                        <Volume2 className="h-4 w-4" />
                      )}
                    </Button>
                    <Slider
                      value={[muted ? 0 : volume]}
                      max={1}
                      step={0.01}
                      onValueChange={(v) => {
                        setVolume(v[0])
                        if (v[0] > 0) setMuted(false)
                      }}
                      className="w-24"
                    />
                  </div>
                </div>
              </div>

              {/* Status */}
              <div className="flex items-center gap-2 mt-4">
                <Badge variant={ready ? 'success' : 'secondary'}>
                  {ready ? 'Ready' : 'Loading...'}
                </Badge>
                {playing && (
                  <Badge variant="default">Playing</Badge>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-4">
          {/* Custom URL */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Custom URL</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="video-url">Video URL</Label>
                <Input
                  id="video-url"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  placeholder="Enter video URL..."
                />
              </div>
              <Button
                variant="outline"
                className="w-full"
                onClick={() => loadVideo(url)}
              >
                <RefreshCw className="mr-2 h-4 w-4" />
                Reload
              </Button>
            </CardContent>
          </Card>

          {/* Sample Videos */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Sample Videos</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {sampleVideos.map((video, i) => (
                <Button
                  key={i}
                  variant={url === video.url ? 'default' : 'outline'}
                  className="w-full justify-start text-left h-auto py-3"
                  onClick={() => loadVideo(video.url)}
                >
                  <div>
                    <div className="font-medium">{video.title}</div>
                    <div className="text-xs opacity-70">{video.description}</div>
                  </div>
                </Button>
              ))}
            </CardContent>
          </Card>

          {/* Testing Scenarios */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Testing Scenarios</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li className="flex items-start gap-2">
                  <span className="h-1.5 w-1.5 rounded-full bg-primary mt-1.5 shrink-0" />
                  <span>Test play/pause controls</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="h-1.5 w-1.5 rounded-full bg-primary mt-1.5 shrink-0" />
                  <span>Test volume and mute</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="h-1.5 w-1.5 rounded-full bg-primary mt-1.5 shrink-0" />
                  <span>Test seeking with progress bar</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="h-1.5 w-1.5 rounded-full bg-primary mt-1.5 shrink-0" />
                  <span>Test invalid URL error handling</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="h-1.5 w-1.5 rounded-full bg-primary mt-1.5 shrink-0" />
                  <span>Test YouTube and direct MP4</span>
                </li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
