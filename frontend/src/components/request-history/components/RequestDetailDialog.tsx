import { Badge } from '@/components/ui/badge'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { ScrollArea } from '@/components/ui/scroll-area'
import { type RequestHistoryItem } from '@/contexts/RequestHistoryContext'
import { cn } from '@/lib/utils'
import { CheckCircle, XCircle } from 'lucide-react'
import { getMethodColor } from '../utils/getMethodColor'
import { getStatusColor } from '../utils/getStatusColor'


interface RequestDetailDialogProps {
  item: RequestHistoryItem | null
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function RequestDetailDialog({
  item,
  open,
  onOpenChange,
}: RequestDetailDialogProps) {
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
