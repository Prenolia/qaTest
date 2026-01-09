import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { VideoPlayer } from '@/components/video-player'
import { RefreshCw } from 'lucide-react'

const sampleVideos = [
  {
    title: 'React in 100 Seconds',
    url: 'https://www.youtube.com/watch?v=Tn6-PIqc4UM',
    description: 'Fireship - Quick intro to React',
  },
  {
    title: 'TypeScript in 100 Seconds',
    url: 'https://www.youtube.com/watch?v=zQnBQ4tB3ZA',
    description: 'Fireship - Quick intro to TypeScript',
  },
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
]

export default function Video() {
  const [url, setUrl] = useState(sampleVideos[0].url)
  const [inputUrl, setInputUrl] = useState(sampleVideos[0].url)

  const loadVideo = (videoUrl: string) => {
    setUrl(videoUrl)
    setInputUrl(videoUrl)
  }

  const handleLoadClick = () => {
    loadVideo(inputUrl)
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Video Player</CardTitle>
          <CardDescription>
            Test react-player integration with YouTube videos.
            Use the native controls to play, pause, seek, and adjust volume.
          </CardDescription>
        </CardHeader>
      </Card>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Video Player */}
        <div className="lg:col-span-2">
          <Card>
            <CardContent className="pt-6">
              <VideoPlayer url={url} />
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
                <Label htmlFor="video-url">YouTube URL</Label>
                <Input
                  id="video-url"
                  value={inputUrl}
                  onChange={(e) => setInputUrl(e.target.value)}
                  placeholder="https://www.youtube.com/watch?v=..."
                />
              </div>
              <Button
                variant="outline"
                className="w-full"
                onClick={handleLoadClick}
              >
                <RefreshCw className="mr-2 h-4 w-4" />
                Load Video
              </Button>
            </CardContent>
          </Card>

          {/* Sample Videos */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Sample Videos</CardTitle>
              <CardDescription>Click to load a video</CardDescription>
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
                  <span>Play/pause using native controls</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="h-1.5 w-1.5 rounded-full bg-primary mt-1.5 shrink-0" />
                  <span>Volume adjustment and mute</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="h-1.5 w-1.5 rounded-full bg-primary mt-1.5 shrink-0" />
                  <span>Seeking via progress bar</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="h-1.5 w-1.5 rounded-full bg-primary mt-1.5 shrink-0" />
                  <span>Fullscreen mode</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="h-1.5 w-1.5 rounded-full bg-primary mt-1.5 shrink-0" />
                  <span>Invalid URL error handling</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="h-1.5 w-1.5 rounded-full bg-primary mt-1.5 shrink-0" />
                  <span>Switch between different videos</span>
                </li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
