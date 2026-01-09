import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  Users,
  Video,
  FileText,
  Activity,
  ArrowRight,
  CheckCircle,
  XCircle,
  Server,
  Code,
  ExternalLink
} from 'lucide-react'
import { api, getApiBaseUrl } from '@/lib/api'

const features = [
  {
    title: 'Users Table',
    description: 'CRUD operations with search, sort, filter, and pagination',
    icon: Users,
    href: '/users',
    color: 'text-blue-500',
    bgColor: 'bg-blue-50',
  },
  {
    title: 'Video Player',
    description: 'Test react-player integration with YouTube videos',
    icon: Video,
    href: '/video',
    color: 'text-red-500',
    bgColor: 'bg-red-50',
  },
  {
    title: 'Form Validation',
    description: 'Client and server-side validation with React Hook Form + Zod',
    icon: FileText,
    href: '/form',
    color: 'text-green-500',
    bgColor: 'bg-green-50',
  },
  {
    title: 'Loading & Errors',
    description: 'Test slow, unreliable, and error endpoints',
    icon: Activity,
    href: '/status',
    color: 'text-purple-500',
    bgColor: 'bg-purple-50',
  },
]

const endpoints = [
  { method: 'GET', path: '/api/health', description: 'Health check' },
  { method: 'GET', path: '/api/users', description: 'List all users' },
  { method: 'GET', path: '/api/users/:id', description: 'Get single user' },
  { method: 'POST', path: '/api/users', description: 'Create user' },
  { method: 'PUT', path: '/api/users/:id', description: 'Update user' },
  { method: 'DELETE', path: '/api/users/:id', description: 'Delete user' },
  { method: 'POST', path: '/api/validate', description: 'Form validation' },
  { method: 'GET', path: '/api/slow', description: 'Random 2-5s delay' },
  { method: 'GET', path: '/api/unreliable', description: '50% chance of error' },
  { method: 'GET', path: '/api/error', description: 'Always returns error' },
  { method: 'GET', path: '/api/delay?ms=<time>', description: 'Configurable delay' },
  { method: 'POST', path: '/api/reset', description: 'Reset data' },
]

export default function Home() {
  const [backendStatus, setBackendStatus] = useState<'checking' | 'online' | 'offline'>('checking')
  const [backendInfo, setBackendInfo] = useState<{ version: string; ts: string } | null>(null)

  useEffect(() => {
    const checkBackend = async () => {
      try {
        const result = await api.health()
        if (result.ok) {
          setBackendStatus('online')
          setBackendInfo({ version: result.version, ts: result.ts })
        } else {
          setBackendStatus('offline')
        }
      } catch {
        setBackendStatus('offline')
      }
    }

    checkBackend()
    const interval = setInterval(checkBackend, 30000)
    return () => clearInterval(interval)
  }, [])

  return (
    <div className="space-y-8">
      {/* Hero Section */}
      <Card className="border-none shadow-lg bg-gradient-to-br from-primary/5 to-primary/10">
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-3xl font-bold tracking-tight">
                Welcome to QA Testbed
              </CardTitle>
              <CardDescription className="mt-2 text-base max-w-2xl">
                A comprehensive testing environment for QA scenarios. Explore different pages
                to test UI patterns, API interactions, forms, and edge cases.
              </CardDescription>
            </div>
            <div className="hidden md:flex items-center gap-2">
              {backendStatus === 'checking' ? (
                <Badge variant="secondary">
                  <div className="h-2 w-2 rounded-full bg-yellow-500 animate-pulse mr-2" />
                  Checking...
                </Badge>
              ) : backendStatus === 'online' ? (
                <Badge variant="success" className="gap-1">
                  <CheckCircle className="h-3 w-3" />
                  Backend Online
                </Badge>
              ) : (
                <Badge variant="destructive" className="gap-1">
                  <XCircle className="h-3 w-3" />
                  Backend Offline
                </Badge>
              )}
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <Server className="h-4 w-4" />
              <span>API: {getApiBaseUrl()}</span>
            </div>
            <div className="flex items-center gap-2">
              <Code className="h-4 w-4" />
              <span>React 19 + TypeScript + Vite</span>
            </div>
            {backendInfo && (
              <div className="flex items-center gap-2">
                <span>Version: {backendInfo.version}</span>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Feature Cards */}
      <div>
        <h2 className="text-xl font-semibold mb-4">Test Pages</h2>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {features.map((feature) => {
            const Icon = feature.icon
            return (
              <Card key={feature.title} className="group hover:shadow-md transition-all hover:-translate-y-1">
                <CardHeader className="pb-3">
                  <div className={`w-10 h-10 rounded-lg ${feature.bgColor} flex items-center justify-center mb-3`}>
                    <Icon className={`h-5 w-5 ${feature.color}`} />
                  </div>
                  <CardTitle className="text-lg">{feature.title}</CardTitle>
                  <CardDescription className="text-sm">
                    {feature.description}
                  </CardDescription>
                </CardHeader>
                <CardContent className="pt-0">
                  <Button asChild variant="ghost" className="w-full justify-between group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                    <Link to={feature.href}>
                      Explore
                      <ArrowRight className="h-4 w-4" />
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            )
          })}
        </div>
      </div>

      {/* API Endpoints */}
      <div>
        <h2 className="text-xl font-semibold mb-4">API Endpoints</h2>
        <Card>
          <CardContent className="pt-6">
            <div className="space-y-2">
              {endpoints.map((endpoint, i) => (
                <div
                  key={i}
                  className="flex items-center gap-4 p-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors"
                >
                  <Badge
                    variant={
                      endpoint.method === 'GET' ? 'secondary' :
                      endpoint.method === 'POST' ? 'default' :
                      endpoint.method === 'PUT' ? 'warning' :
                      'destructive'
                    }
                    className="font-mono text-xs w-16 justify-center"
                  >
                    {endpoint.method}
                  </Badge>
                  <code className="text-sm font-mono flex-1">{endpoint.path}</code>
                  <span className="text-sm text-muted-foreground hidden sm:inline">
                    {endpoint.description}
                  </span>
                </div>
              ))}
            </div>
            <div className="mt-4 pt-4 border-t">
              <Button variant="outline" size="sm" asChild>
                <a
                  href={`${getApiBaseUrl()}/api/health`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="gap-2"
                >
                  <ExternalLink className="h-4 w-4" />
                  Open Health Endpoint
                </a>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Start Guide */}
      <div>
        <h2 className="text-xl font-semibold mb-4">Quick Start</h2>
        <Card>
          <CardContent className="pt-6">
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <h3 className="font-medium mb-2">Start Backend</h3>
                <pre className="bg-muted p-3 rounded-lg text-sm overflow-x-auto">
                  <code>{`cd backend
bun install
bun run dev`}</code>
                </pre>
              </div>
              <div>
                <h3 className="font-medium mb-2">Start Frontend</h3>
                <pre className="bg-muted p-3 rounded-lg text-sm overflow-x-auto">
                  <code>{`cd frontend
bun install
bun run dev`}</code>
                </pre>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
