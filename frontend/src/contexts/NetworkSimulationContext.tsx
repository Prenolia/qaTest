import {
  createContext,
  useContext,
  useState,
  useCallback,
  useEffect,
  type ReactNode,
} from 'react'

export type SimulationMode = 'none' | 'slow' | 'unreliable' | 'error' | 'custom'

interface NetworkSimulationSettings {
  mode: SimulationMode
  customDelayMs: number
  errorRate: number // 0-100
}

interface NetworkSimulationContextValue {
  settings: NetworkSimulationSettings
  setMode: (mode: SimulationMode) => void
  setCustomDelay: (ms: number) => void
  setErrorRate: (rate: number) => void
  isEnabled: boolean
  applySimulation: () => Promise<void>
}

const defaultSettings: NetworkSimulationSettings = {
  mode: 'none',
  customDelayMs: 2000,
  errorRate: 50,
}

const NetworkSimulationContext = createContext<NetworkSimulationContextValue | null>(null)

export function useNetworkSimulation() {
  const context = useContext(NetworkSimulationContext)
  if (!context) {
    throw new Error('useNetworkSimulation must be used within a NetworkSimulationProvider')
  }
  return context
}

// Global function to apply simulation before API calls
let globalApplySimulation: (() => Promise<void>) | null = null

export function setGlobalApplySimulation(fn: typeof globalApplySimulation) {
  globalApplySimulation = fn
}

export async function applyNetworkSimulation(): Promise<void> {
  if (globalApplySimulation) {
    await globalApplySimulation()
  }
}

interface NetworkSimulationProviderProps {
  children: ReactNode
}

export function NetworkSimulationProvider({ children }: NetworkSimulationProviderProps) {
  const [settings, setSettings] = useState<NetworkSimulationSettings>(defaultSettings)

  const setMode = useCallback((mode: SimulationMode) => {
    setSettings((prev) => ({ ...prev, mode }))
  }, [])

  const setCustomDelay = useCallback((ms: number) => {
    setSettings((prev) => ({ ...prev, customDelayMs: ms }))
  }, [])

  const setErrorRate = useCallback((rate: number) => {
    setSettings((prev) => ({ ...prev, errorRate: rate }))
  }, [])

  const applySimulation = useCallback(async () => {
    switch (settings.mode) {
      case 'slow':
        // Random delay between 2-5 seconds
        const slowDelay = Math.floor(Math.random() * 3000) + 2000
        await new Promise((resolve) => setTimeout(resolve, slowDelay))
        break

      case 'unreliable':
        // 50% chance of error
        const unreliableDelay = Math.floor(Math.random() * 500) + 100
        await new Promise((resolve) => setTimeout(resolve, unreliableDelay))
        if (Math.random() < 0.5) {
          throw new Error('Simulated network error (50% failure rate)')
        }
        break

      case 'error':
        // Always fail
        await new Promise((resolve) => setTimeout(resolve, 200))
        throw new Error('Simulated network error (always fails)')

      case 'custom':
        // Custom delay with configurable error rate
        await new Promise((resolve) => setTimeout(resolve, settings.customDelayMs))
        if (Math.random() * 100 < settings.errorRate) {
          throw new Error(`Simulated network error (${settings.errorRate}% failure rate)`)
        }
        break

      case 'none':
      default:
        // No simulation
        break
    }
  }, [settings])

  // Register global simulation function
  useEffect(() => {
    setGlobalApplySimulation(applySimulation)
    return () => setGlobalApplySimulation(null)
  }, [applySimulation])

  const isEnabled = settings.mode !== 'none'

  return (
    <NetworkSimulationContext.Provider
      value={{
        settings,
        setMode,
        setCustomDelay,
        setErrorRate,
        isEnabled,
        applySimulation,
      }}
    >
      {children}
    </NetworkSimulationContext.Provider>
  )
}
