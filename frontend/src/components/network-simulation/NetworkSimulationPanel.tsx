import { useLocation } from 'react-router-dom'
import { useNetworkSimulation, type SimulationMode } from '@/contexts/NetworkSimulationContext'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import {
  Zap,
  Clock,
  Shuffle,
  XCircle,
  Settings2,
  WifiOff,
} from 'lucide-react'
import { cn } from '@/lib/utils'

const simulationModes: {
  mode: SimulationMode
  label: string
  description: string
  icon: typeof Clock
  color: string
}[] = [
  {
    mode: 'none',
    label: 'Normal',
    description: 'No simulation',
    icon: Zap,
    color: 'text-green-600 bg-green-100',
  },
  {
    mode: 'slow',
    label: 'Slow',
    description: '2-5s random delay',
    icon: Clock,
    color: 'text-blue-600 bg-blue-100',
  },
  {
    mode: 'unreliable',
    label: 'Unreliable',
    description: '50% failure rate',
    icon: Shuffle,
    color: 'text-purple-600 bg-purple-100',
  },
  {
    mode: 'error',
    label: 'Error',
    description: 'Always fails',
    icon: XCircle,
    color: 'text-red-600 bg-red-100',
  },
  {
    mode: 'custom',
    label: 'Custom',
    description: 'Configure delay & error rate',
    icon: Settings2,
    color: 'text-orange-600 bg-orange-100',
  },
]

export function NetworkSimulationPanel() {
  const location = useLocation()
  const { settings, setMode, setCustomDelay, setErrorRate, isEnabled } = useNetworkSimulation()

  const currentMode = simulationModes.find((m) => m.mode === settings.mode) || simulationModes[0]
  const isOnUsersPage = location.pathname === '/users'

  // Only show on /users page
  if (!isOnUsersPage) {
    return null
  }

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant={isEnabled ? 'default' : 'outline'}
          size="sm"
          className={cn(
            'fixed bottom-4 left-4 z-50 shadow-lg',
            isEnabled && 'bg-orange-500 hover:bg-orange-600'
          )}
        >
          {isEnabled ? (
            <WifiOff className="h-4 w-4 mr-2" />
          ) : (
            <Zap className="h-4 w-4 mr-2" />
          )}
          Network
          {isEnabled && (
            <Badge variant="secondary" className="ml-2 bg-white/20">
              {currentMode.label}
            </Badge>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80" side="top" align="start">
        <div className="space-y-4">
          <div>
            <h4 className="font-medium mb-1">Network Simulation</h4>
            <p className="text-sm text-muted-foreground">
              Simulate network conditions for testing
            </p>
          </div>

          <div className="space-y-2">
            {simulationModes.map((item) => {
              const Icon = item.icon
              const isSelected = settings.mode === item.mode

              return (
                <button
                  key={item.mode}
                  onClick={() => setMode(item.mode)}
                  className={cn(
                    'w-full flex items-center gap-3 p-3 rounded-lg transition-colors text-left',
                    isSelected
                      ? 'bg-primary text-primary-foreground'
                      : 'hover:bg-muted'
                  )}
                >
                  <div
                    className={cn(
                      'h-8 w-8 rounded-md flex items-center justify-center',
                      isSelected ? 'bg-white/20' : item.color
                    )}
                  >
                    <Icon className="h-4 w-4" />
                  </div>
                  <div className="flex-1">
                    <div className="font-medium text-sm">{item.label}</div>
                    <div
                      className={cn(
                        'text-xs',
                        isSelected ? 'text-primary-foreground/70' : 'text-muted-foreground'
                      )}
                    >
                      {item.description}
                    </div>
                  </div>
                </button>
              )
            })}
          </div>

          {settings.mode === 'custom' && (
            <div className="space-y-3 pt-2 border-t">
              <div className="space-y-2">
                <Label htmlFor="delay-ms" className="text-sm">
                  Delay (ms)
                </Label>
                <Input
                  id="delay-ms"
                  type="number"
                  value={settings.customDelayMs}
                  onChange={(e) => setCustomDelay(parseInt(e.target.value) || 0)}
                  min={0}
                  max={30000}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="error-rate" className="text-sm">
                  Error Rate (%)
                </Label>
                <Input
                  id="error-rate"
                  type="number"
                  value={settings.errorRate}
                  onChange={(e) => setErrorRate(parseInt(e.target.value) || 0)}
                  min={0}
                  max={100}
                />
              </div>
            </div>
          )}

          {isEnabled && (
            <div className="pt-2 border-t">
              <p className="text-xs text-orange-600 flex items-center gap-1">
                <WifiOff className="h-3 w-3" />
                Network simulation is active
              </p>
            </div>
          )}
        </div>
      </PopoverContent>
    </Popover>
  )
}
