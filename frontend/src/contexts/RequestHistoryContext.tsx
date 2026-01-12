import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  type ReactNode,
} from 'react'

const STORAGE_KEY = 'qa-testbed-request-history'
const MAX_HISTORY_ITEMS = 100

export interface RequestHistoryItem {
  id: string
  method: string
  endpoint: string
  url: string
  status?: number
  success: boolean
  duration: number
  timestamp: string
  requestBody?: unknown
  responseBody?: unknown
  error?: string
}

interface RequestHistoryContextValue {
  history: RequestHistoryItem[]
  addRequest: (item: Omit<RequestHistoryItem, 'id' | 'timestamp'>) => void
  clearHistory: () => void
  isOpen: boolean
  setIsOpen: (open: boolean) => void
}

const RequestHistoryContext = createContext<RequestHistoryContextValue | null>(null)

export function useRequestHistory() {
  const context = useContext(RequestHistoryContext)
  if (!context) {
    throw new Error('useRequestHistory must be used within a RequestHistoryProvider')
  }
  return context
}

// Global callback for api.ts to use
let globalAddRequest: ((item: Omit<RequestHistoryItem, 'id' | 'timestamp'>) => void) | null = null

export function setGlobalAddRequest(fn: typeof globalAddRequest) {
  globalAddRequest = fn
}

export function logRequest(item: Omit<RequestHistoryItem, 'id' | 'timestamp'>) {
  if (globalAddRequest) {
    globalAddRequest(item)
  }
}

interface RequestHistoryProviderProps {
  children: ReactNode
}

export function RequestHistoryProvider({ children }: RequestHistoryProviderProps) {
  const [history, setHistory] = useState<RequestHistoryItem[]>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY)
      if (!stored) return []
      const parsed = JSON.parse(stored) as RequestHistoryItem[]
      // Filter out invalid entries (old format without required fields)
      return parsed.filter(item => item.id && item.endpoint && item.timestamp)
    } catch {
      return []
    }
  })
  const [isOpen, setIsOpen] = useState(false)

  // Persist history to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(history))
    } catch {
      // Ignore storage errors
    }
  }, [history])

  const addRequest = useCallback((item: Omit<RequestHistoryItem, 'id' | 'timestamp'>) => {
    const newItem: RequestHistoryItem = {
      ...item,
      id: crypto.randomUUID(),
      timestamp: new Date().toISOString(),
    }
    setHistory((prev) => [newItem, ...prev].slice(0, MAX_HISTORY_ITEMS))
  }, [])

  // Register global callback
  useEffect(() => {
    setGlobalAddRequest(addRequest)
    return () => setGlobalAddRequest(null)
  }, [addRequest])

  const clearHistory = useCallback(() => {
    setHistory([])
    localStorage.removeItem(STORAGE_KEY)
  }, [])

  return (
    <RequestHistoryContext.Provider
      value={{ history, addRequest, clearHistory, isOpen, setIsOpen }}
    >
      {children}
    </RequestHistoryContext.Provider>
  )
}
