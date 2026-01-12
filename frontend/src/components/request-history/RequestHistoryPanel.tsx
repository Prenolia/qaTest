import { useState } from 'react'
import { useRequestHistory, type RequestHistoryItem } from '@/contexts/RequestHistoryContext'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { ScrollArea } from '@/components/ui/scroll-area'
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import {
  History,
  Trash2,
  CheckCircle,
  XCircle,
  ChevronRight,
  Clock,
} from 'lucide-react'
import { cn } from '@/lib/utils'

function getMethodColor(method?: string) {
  if (!method) return 'bg-gray-100 text-gray-700'
  switch (method.toUpperCase()) {
    case 'GET':
      return 'bg-blue-100 text-blue-700'
    case 'POST':
      return 'bg-green-100 text-green-700'
    case 'PUT':
      return 'bg-yellow-100 text-yellow-700'
    case 'DELETE':
      return 'bg-red-100 text-red-700'
    case 'PATCH':
      return 'bg-purple-100 text-purple-700'
    default:
      return 'bg-gray-100 text-gray-700'
  }
}

function getStatusColor(status?: number) {
  if (!status) return 'bg-gray-100 text-gray-700'
  if (status >= 200 && status < 300) return 'bg-green-100 text-green-700'
  if (status >= 400 && status < 500) return 'bg-yellow-100 text-yellow-700'
  if (status >= 500) return 'bg-red-100 text-red-700'
  return 'bg-gray-100 text-gray-700'
}

function RequestDetailDialog({
  item,
  open,
  onOpenChange,
}: {
  item: RequestHistoryItem | null
  open: boolean
  onOpenChange: (open: boolean) => void
}) {
  if (!item) return null

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Badge className={cn('font-mono', getMethodColor(item.method))}>
              {item.method || 'GET'}
            </Badge>
            <code className="text-sm font-normal">{item.endpoint}</code>
          </DialogTitle>
          <DialogDescription>
            {new Date(item.timestamp).toLocaleString()} - {item.duration}ms
          </DialogDescription>
        </DialogHeader>
        <ScrollArea className="flex-1 -mx-6 px-6">
          <div className="space-y-4">
            <div>
              <h4 className="text-sm font-medium mb-2">URL</h4>
              <code className="text-xs bg-muted p-2 rounded block break-all">
                {item.url}
              </code>
            </div>

            <div>
              <h4 className="text-sm font-medium mb-2">Status</h4>
              <div className="flex items-center gap-2">
                {item.success ? (
                  <CheckCircle className="h-4 w-4 text-green-500" />
                ) : (
                  <XCircle className="h-4 w-4 text-red-500" />
                )}
                <Badge className={getStatusColor(item.status)}>
                  {item.status || 'N/A'}
                </Badge>
                <span className="text-sm text-muted-foreground">
                  {item.success ? 'Success' : 'Failed'}
                </span>
              </div>
            </div>

            {item.requestBody !== undefined && (
              <div>
                <h4 className="text-sm font-medium mb-2">Request Body</h4>
                <pre className="text-xs bg-muted p-3 rounded overflow-auto max-h-40">
                  {JSON.stringify(item.requestBody, null, 2)}
                </pre>
              </div>
            )}

            {item.responseBody !== undefined && (
              <div>
                <h4 className="text-sm font-medium mb-2">Response Body</h4>
                <pre className="text-xs bg-muted p-3 rounded overflow-auto max-h-60">
                  {JSON.stringify(item.responseBody, null, 2)}
                </pre>
              </div>
            )}

            {item.error && (
              <div>
                <h4 className="text-sm font-medium mb-2 text-red-600">Error</h4>
                <pre className="text-xs bg-red-50 text-red-700 p-3 rounded">
                  {item.error}
                </pre>
              </div>
            )}
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  )
}

export function RequestHistoryPanel() {
  const { history, clearHistory, isOpen, setIsOpen } = useRequestHistory()
  const [selectedItem, setSelectedItem] = useState<RequestHistoryItem | null>(null)
  const [detailOpen, setDetailOpen] = useState(false)

  const handleItemClick = (item: RequestHistoryItem) => {
    setSelectedItem(item)
    setDetailOpen(true)
  }

  return (
    <>
      <Sheet open={isOpen} onOpenChange={setIsOpen}>
        <SheetTrigger asChild>
          <Button
            variant="outline"
            size="sm"
            className="fixed bottom-4 right-4 z-50 shadow-lg"
          >
            <History className="h-4 w-4 mr-2" />
            History
            {history.length > 0 && (
              <Badge variant="secondary" className="ml-2">
                {history.length}
              </Badge>
            )}
          </Button>
        </SheetTrigger>
        <SheetContent className="w-[400px] sm:w-[540px] flex flex-col">
          <SheetHeader>
            <div className="flex items-center justify-between">
              <div>
                <SheetTitle>Request History</SheetTitle>
                <SheetDescription>
                  {history.length} request{history.length !== 1 ? 's' : ''} recorded
                </SheetDescription>
              </div>
              {history.length > 0 && (
                <Button variant="ghost" size="sm" onClick={clearHistory}>
                  <Trash2 className="h-4 w-4 mr-2" />
                  Clear
                </Button>
              )}
            </div>
          </SheetHeader>

          <ScrollArea className="flex-1 -mx-6 px-6 mt-4">
            {history.length === 0 ? (
              <div className="text-center py-12 text-muted-foreground">
                <History className="h-12 w-12 mx-auto mb-4 opacity-20" />
                <p>No requests recorded yet.</p>
                <p className="text-sm mt-1">
                  Make API calls to see them here.
                </p>
              </div>
            ) : (
              <div className="space-y-2">
                {history.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => handleItemClick(item)}
                    className="w-full text-left p-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors"
                  >
                    <div className="flex items-center gap-2 mb-1">
                      <Badge
                        className={cn(
                          'font-mono text-xs',
                          getMethodColor(item.method)
                        )}
                      >
                        {item.method || 'GET'}
                      </Badge>
                      <code className="text-xs truncate flex-1">
                        {item.endpoint}
                      </code>
                      <ChevronRight className="h-4 w-4 text-muted-foreground shrink-0" />
                    </div>
                    <div className="flex items-center gap-3 text-xs text-muted-foreground">
                      {item.success ? (
                        <span className="flex items-center gap-1 text-green-600">
                          <CheckCircle className="h-3 w-3" />
                          {item.status}
                        </span>
                      ) : (
                        <span className="flex items-center gap-1 text-red-600">
                          <XCircle className="h-3 w-3" />
                          {item.status || 'Error'}
                        </span>
                      )}
                      <span className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {item.duration}ms
                      </span>
                      <span className="ml-auto">
                        {new Date(item.timestamp).toLocaleTimeString()}
                      </span>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </ScrollArea>
        </SheetContent>
      </Sheet>

      <RequestDetailDialog
        item={selectedItem}
        open={detailOpen}
        onOpenChange={setDetailOpen}
      />
    </>
  )
}
