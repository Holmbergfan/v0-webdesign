"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { 
  Clock, 
  CheckCircle2, 
  XCircle, 
  Loader2, 
  MoreHorizontal,
  Play,
  Pause,
  Trash2,
  RefreshCw,
  Download
} from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

interface QueueItem {
  id: string
  prompt: string
  model: string
  status: "pending" | "generating" | "completed" | "failed"
  progress?: number
  type: "video" | "image"
  createdAt: string
  estimatedTime?: string
  error?: string
}

const queueItems: QueueItem[] = [
  {
    id: "1",
    prompt: "A drone shot over snowy pine trees at sunrise, cinematic",
    model: "WAN 2.2 Cinematic (T2V)",
    status: "generating",
    progress: 67,
    type: "video",
    createdAt: "2m ago",
    estimatedTime: "~1m remaining"
  },
  {
    id: "2",
    prompt: "Slow dolly toward the subject as soft particles drift by",
    model: "WAN 2.2 Directed (TI2V)",
    status: "pending",
    type: "video",
    createdAt: "3m ago",
    estimatedTime: "~4m"
  },
  {
    id: "3",
    prompt: "Portrait of a woman, soft studio lighting, f1.8, canon 85mm",
    model: "Realistic Photo (ComfyUI SD1.5)",
    status: "completed",
    type: "image",
    createdAt: "10m ago"
  },
  {
    id: "4",
    prompt: "Cinematic still, golden hour, woman in a field, 35mm film grain",
    model: "TimeLess (ComfyUI SDXL)",
    status: "completed",
    type: "image",
    createdAt: "15m ago"
  },
  {
    id: "5",
    prompt: "Dr34mL4y Cowgirl scene with character reference",
    model: "LTX-2.3 + Dr34mL4y LoRA",
    status: "failed",
    type: "video",
    createdAt: "20m ago",
    error: "VRAM allocation failed. Try reducing duration or steps."
  },
]

const statusConfig = {
  pending: {
    icon: Clock,
    label: "Pending",
    color: "text-yellow-500",
    bgColor: "bg-yellow-500/10",
  },
  generating: {
    icon: Loader2,
    label: "Generating",
    color: "text-primary",
    bgColor: "bg-primary/10",
  },
  completed: {
    icon: CheckCircle2,
    label: "Completed",
    color: "text-accent",
    bgColor: "bg-accent/10",
  },
  failed: {
    icon: XCircle,
    label: "Failed",
    color: "text-destructive",
    bgColor: "bg-destructive/10",
  },
}

export function QueuePanel() {
  const [mounted, setMounted] = useState(false)
  
  useEffect(() => {
    setMounted(true)
  }, [])

  return (
    <div className="flex h-full flex-col">
      {/* Header */}
      <div className={`flex items-center justify-between border-b border-border/50 bg-card/30 px-6 py-4 backdrop-blur-sm ${mounted ? 'animate-slide-up' : 'opacity-0'}`}>
        <div>
          <h1 className="text-xl font-semibold text-foreground">Generation Queue</h1>
          <p className="text-sm text-muted-foreground">5 items in queue</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" className="gap-2">
            <Pause className="h-4 w-4" />
            Pause All
          </Button>
          <Button variant="outline" size="sm" className="gap-2 text-destructive hover:text-destructive">
            <Trash2 className="h-4 w-4" />
            Clear Completed
          </Button>
        </div>
      </div>

      {/* Queue List */}
      <div className="flex-1 overflow-auto p-6">
        <div className={`mx-auto max-w-4xl ${mounted ? 'animate-slide-up animate-delay-100' : 'opacity-0'}`}>
          <div className="flex flex-col gap-4">
            {queueItems.map((item) => {
              const status = statusConfig[item.status]
              const StatusIcon = status.icon

              return (
                <div
                  key={item.id}
                  className={cn(
                    "rounded-2xl border border-border/50 bg-card/50 p-4 backdrop-blur-sm transition-all hover:border-border",
                    item.status === "generating" && "border-primary/50 bg-primary/5"
                  )}
                >
                  <div className="flex items-start gap-4">
                    {/* Status Icon */}
                    <div className={cn("rounded-lg p-2", status.bgColor)}>
                      <StatusIcon
                        className={cn(
                          "h-5 w-5",
                          status.color,
                          item.status === "generating" && "animate-spin"
                        )}
                      />
                    </div>

                    {/* Content */}
                    <div className="flex-1 overflow-hidden">
                      <div className="mb-1 flex items-center gap-2">
                        <span className={cn(
                          "rounded-full px-2 py-0.5 text-xs font-medium",
                          status.bgColor,
                          status.color
                        )}>
                          {status.label}
                        </span>
                        <span className="text-xs text-muted-foreground">{item.createdAt}</span>
                        {item.estimatedTime && (
                          <span className="text-xs text-muted-foreground">{item.estimatedTime}</span>
                        )}
                      </div>
                      
                      <p className="mb-2 line-clamp-2 text-sm text-foreground">{item.prompt}</p>
                      
                      <div className="flex items-center gap-3 text-xs text-muted-foreground">
                        <span className="flex items-center gap-1">
                          {item.type === "video" ? (
                            <Play className="h-3 w-3" />
                          ) : (
                            <span className="h-3 w-3 rounded-sm bg-muted-foreground/50" />
                          )}
                          {item.type}
                        </span>
                        <span className="rounded bg-muted px-1.5 py-0.5 font-mono">{item.model}</span>
                      </div>

                      {/* Progress Bar */}
                      {item.status === "generating" && item.progress !== undefined && (
                        <div className="mt-3">
                          <div className="h-1.5 w-full overflow-hidden rounded-full bg-muted">
                            <div
                              className="h-full rounded-full bg-primary transition-all"
                              style={{ width: `${item.progress}%` }}
                            />
                          </div>
                          <p className="mt-1 text-xs text-muted-foreground">{item.progress}% complete</p>
                        </div>
                      )}

                      {/* Error Message */}
                      {item.status === "failed" && item.error && (
                        <div className="mt-3 rounded-lg bg-destructive/10 px-3 py-2">
                          <p className="text-xs text-destructive">{item.error}</p>
                        </div>
                      )}
                    </div>

                    {/* Actions */}
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        {item.status === "completed" && (
                          <DropdownMenuItem className="gap-2">
                            <Download className="h-4 w-4" />
                            Download
                          </DropdownMenuItem>
                        )}
                        {item.status === "failed" && (
                          <DropdownMenuItem className="gap-2">
                            <RefreshCw className="h-4 w-4" />
                            Retry
                          </DropdownMenuItem>
                        )}
                        {item.status === "generating" && (
                          <DropdownMenuItem className="gap-2">
                            <Pause className="h-4 w-4" />
                            Pause
                          </DropdownMenuItem>
                        )}
                        <DropdownMenuItem className="gap-2 text-destructive focus:text-destructive">
                          <Trash2 className="h-4 w-4" />
                          Remove
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </div>
  )
}
