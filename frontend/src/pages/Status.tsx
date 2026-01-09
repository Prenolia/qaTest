import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Skeleton } from '@/components/ui/skeleton'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import {
  Clock,
  AlertTriangle,
  XCircle as ErrorIcon,
  Shuffle,
  CheckCircle,
  XCircle,
  Loader2,
  RefreshCw,
  Timer,
} from 'lucide-react'
import { getApiBaseUrl } from '@/lib/api'

interface RequestResult {
  success: boolean
  status?: number
  message?: string
  duration: number
  timestamp: string
  delayMs?: number
}

interface EndpointState {
  loading: boolean
  result: RequestResult | null
  progress: number
}

const initialState: EndpointState = {
  loading: false,
  result: null,
  progress: 0,
}

export default function Status() {
  const [delayMs, setDelayMs] = useState('2000')

  const [slowState, setSlowState] = useState<EndpointState>(initialState)
  const [unreliableState, setUnreliableState] = useState<EndpointState>(initialState)
  const [errorState, setErrorState] = useState<EndpointState>(initialState)
  const [delayState, setDelayState] = useState<EndpointState>(initialState)

  const [requestHistory, setRequestHistory] = useState<RequestResult[]>([])

  const addToHistory = (result: RequestResult) => {
    setRequestHistory((prev) => [result, ...prev].slice(0, 10))
  }

  // Test /api/slow - Random 2-5 second delay
  const testSlow = async () => {
    setSlowState({ loading: true, result: null, progress: 0 })

    const startTime = performance.now()
    const interval = setInterval(() => {
      setSlowState((prev) => ({
        ...prev,
        progress: Math.min(prev.progress + 2, 95),
      }))
    }, 100)

    try {
      const response = await fetch(`${getApiBaseUrl()}/api/slow`)
      const data = await response.json()
      const duration = Math.round(performance.now() - startTime)

      const result: RequestResult = {
        success: true,
        status: response.status,
        message: data.message || `Response received after ${data.delayMs}ms delay`,
        duration,
        timestamp: new Date().toISOString(),
        delayMs: data.delayMs,
      }

      setSlowState({ loading: false, result, progress: 100 })
      addToHistory(result)
    } catch (error) {
      const duration = Math.round(performance.now() - startTime)
      const result: RequestResult = {
        success: false,
        message: error instanceof Error ? error.message : 'Request failed',
        duration,
        timestamp: new Date().toISOString(),
      }

      setSlowState({ loading: false, result, progress: 0 })
      addToHistory(result)
    } finally {
      clearInterval(interval)
    }
  }

  // Test /api/unreliable - 50% chance of error
  const testUnreliable = async () => {
    setUnreliableState({ loading: true, result: null, progress: 0 })

    const startTime = performance.now()

    try {
      const response = await fetch(`${getApiBaseUrl()}/api/unreliable`)
      const data = await response.json()
      const duration = Math.round(performance.now() - startTime)

      const result: RequestResult = {
        success: response.ok,
        status: response.status,
        message: response.ok
          ? (data.message || 'Request succeeded!')
          : (data.error || 'Request failed randomly'),
        duration,
        timestamp: new Date().toISOString(),
      }

      setUnreliableState({ loading: false, result, progress: 100 })
      addToHistory(result)
    } catch (error) {
      const duration = Math.round(performance.now() - startTime)
      const result: RequestResult = {
        success: false,
        message: error instanceof Error ? error.message : 'Request failed',
        duration,
        timestamp: new Date().toISOString(),
      }

      setUnreliableState({ loading: false, result, progress: 0 })
      addToHistory(result)
    }
  }

  // Test /api/error - Always returns error
  const testError = async () => {
    setErrorState({ loading: true, result: null, progress: 0 })

    const startTime = performance.now()

    try {
      const response = await fetch(`${getApiBaseUrl()}/api/error`)
      const data = await response.json()
      const duration = Math.round(performance.now() - startTime)

      const result: RequestResult = {
        success: response.ok,
        status: response.status,
        message: data.error || `Error ${response.status}`,
        duration,
        timestamp: new Date().toISOString(),
      }

      setErrorState({ loading: false, result, progress: 100 })
      addToHistory(result)
    } catch (error) {
      const duration = Math.round(performance.now() - startTime)
      const result: RequestResult = {
        success: false,
        message: error instanceof Error ? error.message : 'Request failed',
        duration,
        timestamp: new Date().toISOString(),
      }

      setErrorState({ loading: false, result, progress: 0 })
      addToHistory(result)
    }
  }

  // Test /api/delay?ms=<time> - Configurable delay
  const testDelay = async () => {
    const ms = parseInt(delayMs) || 2000
    setDelayState({ loading: true, result: null, progress: 0 })

    const startTime = performance.now()
    const interval = setInterval(() => {
      setDelayState((prev) => ({
        ...prev,
        progress: Math.min(prev.progress + (100 / (ms / 100)), 95),
      }))
    }, 100)

    try {
      const response = await fetch(`${getApiBaseUrl()}/api/delay?ms=${ms}`)
      const data = await response.json()
      const duration = Math.round(performance.now() - startTime)

      const result: RequestResult = {
        success: true,
        status: response.status,
        message: data.message || `Response received after ${data.delayMs}ms`,
        duration,
        timestamp: new Date().toISOString(),
        delayMs: data.delayMs,
      }

      setDelayState({ loading: false, result, progress: 100 })
      addToHistory(result)
    } catch (error) {
      const duration = Math.round(performance.now() - startTime)
      const result: RequestResult = {
        success: false,
        message: error instanceof Error ? error.message : 'Request failed',
        duration,
        timestamp: new Date().toISOString(),
      }

      setDelayState({ loading: false, result, progress: 0 })
      addToHistory(result)
    } finally {
      clearInterval(interval)
    }
  }

  const ResultDisplay = ({ state }: { state: EndpointState }) => {
    if (state.loading) {
      return (
        <div className="space-y-3">
          <Progress value={state.progress} className="h-2" />
          <Skeleton className="h-4 w-3/4" />
          <Skeleton className="h-4 w-1/2" />
        </div>
      )
    }

    if (!state.result) {
      return (
        <p className="text-sm text-muted-foreground">
          Click the button to test this endpoint
        </p>
      )
    }

    return (
      <Alert variant={state.result.success ? 'success' : 'destructive'}>
        {state.result.success ? (
          <CheckCircle className="h-4 w-4" />
        ) : (
          <XCircle className="h-4 w-4" />
        )}
        <AlertTitle className="flex items-center gap-2">
          {state.result.success ? 'Success' : 'Error'}
          {state.result.status && (
            <Badge variant={state.result.success ? 'success' : 'destructive'}>
              {state.result.status}
            </Badge>
          )}
        </AlertTitle>
        <AlertDescription>
          <p>{state.result.message}</p>
          <p className="text-xs mt-1 opacity-70">
            Duration: {state.result.duration}ms
            {state.result.delayMs && ` (server delay: ${state.result.delayMs}ms)`}
          </p>
        </AlertDescription>
      </Alert>
    )
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Loading & Error States</CardTitle>
          <CardDescription>
            Test various API scenarios including slow responses, errors, and unreliable endpoints
          </CardDescription>
        </CardHeader>
      </Card>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Slow Endpoint */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-lg bg-blue-100 flex items-center justify-center">
                <Clock className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <CardTitle className="text-lg">Slow Endpoint</CardTitle>
                <CardDescription>GET /api/slow - Random 2-5 second delay</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button
              onClick={testSlow}
              disabled={slowState.loading}
              className="w-full"
            >
              {slowState.loading ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <Clock className="mr-2 h-4 w-4" />
              )}
              Test Slow Endpoint
            </Button>
            <ResultDisplay state={slowState} />
          </CardContent>
        </Card>

        {/* Unreliable Endpoint */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-lg bg-purple-100 flex items-center justify-center">
                <Shuffle className="h-5 w-5 text-purple-600" />
              </div>
              <div>
                <CardTitle className="text-lg">Unreliable Endpoint</CardTitle>
                <CardDescription>GET /api/unreliable - 50% chance of error</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button
              variant="outline"
              onClick={testUnreliable}
              disabled={unreliableState.loading}
              className="w-full"
            >
              {unreliableState.loading ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <Shuffle className="mr-2 h-4 w-4" />
              )}
              Test Unreliable Endpoint
            </Button>
            <ResultDisplay state={unreliableState} />
          </CardContent>
        </Card>

        {/* Error Endpoint */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-lg bg-red-100 flex items-center justify-center">
                <ErrorIcon className="h-5 w-5 text-red-600" />
              </div>
              <div>
                <CardTitle className="text-lg">Error Endpoint</CardTitle>
                <CardDescription>GET /api/error - Always returns 500 error</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button
              variant="destructive"
              onClick={testError}
              disabled={errorState.loading}
              className="w-full"
            >
              {errorState.loading ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <AlertTriangle className="mr-2 h-4 w-4" />
              )}
              Test Error Endpoint
            </Button>
            <ResultDisplay state={errorState} />
          </CardContent>
        </Card>

        {/* Configurable Delay */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-lg bg-green-100 flex items-center justify-center">
                <Timer className="h-5 w-5 text-green-600" />
              </div>
              <div>
                <CardTitle className="text-lg">Configurable Delay</CardTitle>
                <CardDescription>GET /api/delay?ms=&lt;time&gt;</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex gap-2">
              <div className="flex-1">
                <Label htmlFor="delay-ms" className="sr-only">Delay (ms)</Label>
                <Input
                  id="delay-ms"
                  type="number"
                  value={delayMs}
                  onChange={(e) => setDelayMs(e.target.value)}
                  placeholder="Delay in ms"
                  min="0"
                  max="10000"
                />
              </div>
              <Button onClick={testDelay} disabled={delayState.loading}>
                {delayState.loading ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Timer className="h-4 w-4" />
                )}
                <span className="ml-2">Test</span>
              </Button>
            </div>
            <ResultDisplay state={delayState} />
          </CardContent>
        </Card>
      </div>

      {/* Request History */}
      {requestHistory.length > 0 && (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg">Request History</CardTitle>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setRequestHistory([])}
              >
                <RefreshCw className="mr-2 h-4 w-4" />
                Clear
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {requestHistory.map((result, i) => (
                <div
                  key={i}
                  className="flex items-center gap-4 p-3 rounded-lg bg-muted/50"
                >
                  {result.success ? (
                    <CheckCircle className="h-4 w-4 text-green-500 shrink-0" />
                  ) : (
                    <XCircle className="h-4 w-4 text-red-500 shrink-0" />
                  )}
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{result.message}</p>
                    <p className="text-xs text-muted-foreground">
                      {new Date(result.timestamp).toLocaleTimeString()}
                    </p>
                  </div>
                  <div className="text-right shrink-0">
                    {result.status && (
                      <Badge
                        variant={result.success ? 'success' : 'destructive'}
                        className="mb-1"
                      >
                        {result.status}
                      </Badge>
                    )}
                    <p className="text-xs text-muted-foreground">{result.duration}ms</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* QA Scenarios */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Testing Scenarios</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li className="flex items-start gap-2">
              <span className="h-1.5 w-1.5 rounded-full bg-blue-500 mt-1.5 shrink-0" />
              <span>
                <strong>Slow:</strong> Test loading states, spinners, and skeleton loaders with random 2-5 second delays
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="h-1.5 w-1.5 rounded-full bg-purple-500 mt-1.5 shrink-0" />
              <span>
                <strong>Unreliable:</strong> Test retry logic and error recovery with 50% random failure rate
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="h-1.5 w-1.5 rounded-full bg-red-500 mt-1.5 shrink-0" />
              <span>
                <strong>Error:</strong> Test error handling UI with guaranteed 500 errors
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="h-1.5 w-1.5 rounded-full bg-green-500 mt-1.5 shrink-0" />
              <span>
                <strong>Delay:</strong> Test specific loading times with configurable delays (0-10000ms)
              </span>
            </li>
          </ul>
        </CardContent>
      </Card>
    </div>
  )
}
