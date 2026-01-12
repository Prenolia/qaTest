import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  useRequestHistory,
  type RequestHistoryItem,
} from "@/contexts/RequestHistoryContext";
import { cn } from "@/lib/utils";
import {
  CheckCircle,
  ChevronRight,
  Clock,
  History,
  Trash2,
  XCircle,
} from "lucide-react";
import { useState } from "react";
import { RequestDetailDialog } from "./components";
import { getMethodColor } from "./utils/getMethodColor";

export function RequestHistoryPanel() {
  const { history, clearHistory, isOpen, setIsOpen } = useRequestHistory();
  const [selectedItem, setSelectedItem] = useState<RequestHistoryItem | null>(
    null
  );
  const [detailOpen, setDetailOpen] = useState(false);

  const handleItemClick = (item: RequestHistoryItem) => {
    setSelectedItem(item);
    setDetailOpen(true);
  };

  return (
    <>
      <Sheet open={isOpen} onOpenChange={setIsOpen}>
        <SheetTrigger asChild>
          <Button
            variant="outline"
            size="sm"
            className="fixed bottom-4 right-4 z-50 shadow-lg"
          >
            <History className="size-4 mr-2" />
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
                  {history.length} request{history.length !== 1 ? "s" : ""}{" "}
                  recorded
                </SheetDescription>
              </div>
              {history.length > 0 && (
                <Button variant="ghost" size="sm" onClick={clearHistory}>
                  <Trash2 className="size-4 mr-2" />
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
                <p className="text-sm mt-1">Make API calls to see them here.</p>
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
                          "font-mono text-xs",
                          getMethodColor(item.method)
                        )}
                      >
                        {item.method || "GET"}
                      </Badge>
                      <code className="text-xs truncate flex-1">
                        {item.endpoint}
                      </code>
                      <ChevronRight className="size-4 text-muted-foreground shrink-0" />
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
                          {item.status || "Error"}
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
  );
}
