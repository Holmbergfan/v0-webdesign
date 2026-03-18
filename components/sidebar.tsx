"use client"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Video,
  Image as ImageIcon,
  Grid3X3,
  Clock,
  Settings,
  Sparkles,
  FolderOpen,
  History,
  Star,
  User,
  LogOut,
  CreditCard,
  HelpCircle,
  ChevronRight,
  Menu,
  X,
  MessageSquare,
  Wand2
} from "lucide-react"

interface SidebarProps {
  open: boolean
  onToggle: () => void
  activeView: "generate" | "gallery" | "queue" | "admin"
  onViewChange: (view: "generate" | "gallery" | "queue" | "admin") => void
}

const menuItems = [
  { id: "generate" as const, label: "Generate", icon: Sparkles, description: "Create new content" },
  { id: "gallery" as const, label: "Gallery", icon: Grid3X3, description: "View your creations" },
  { id: "queue" as const, label: "Queue", icon: Clock, description: "Processing jobs" },
  { id: "admin" as const, label: "Admin", icon: Settings, description: "System settings" },
]

const quickActions = [
  { label: "Text to Video", icon: Video, mode: "t2v" },
  { label: "Image to Video", icon: ImageIcon, mode: "i2v" },
  { label: "TI2V / Scenes", icon: Wand2, mode: "ti2v" },
  { label: "Text to Image", icon: ImageIcon, mode: "t2i" },
  { label: "Text Assistant", icon: MessageSquare, mode: "t2t" },
]

const recentItems = [
  { id: 1, title: "Cyberpunk cityscape", type: "video" },
  { id: 2, title: "Portrait in studio", type: "image" },
  { id: 3, title: "Nature landscape", type: "video" },
]

export function Sidebar({ open, onToggle, activeView, onViewChange }: SidebarProps) {
  return (
    <>
      {/* Mobile overlay */}
      {open && (
        <div 
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm lg:hidden"
          onClick={onToggle}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-50 flex w-72 flex-col border-r border-border/50 bg-sidebar/95 backdrop-blur-xl transition-transform duration-300 lg:relative lg:z-auto lg:translate-x-0",
          open ? "translate-x-0" : "-translate-x-full"
        )}
      >
        {/* Header with logo and close button */}
        <div className="flex h-16 items-center justify-between border-b border-border/50 px-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-accent">
              <svg className="h-5 w-5 text-primary-foreground" viewBox="0 0 24 24" fill="currentColor">
                <path d="M8 5v14l11-7z" />
              </svg>
            </div>
            <div>
              <h1 className="text-lg font-bold text-foreground">HolmAI</h1>
              <p className="text-xs text-muted-foreground">WebUI</p>
            </div>
          </div>
          <Button 
            variant="ghost" 
            size="icon" 
            className="lg:hidden"
            onClick={onToggle}
          >
            <X className="h-5 w-5" />
          </Button>
        </div>

        {/* Main Navigation */}
        <div className="flex-1 overflow-auto p-4">
          <nav className="mb-6">
            <p className="mb-2 px-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Navigation
            </p>
            <div className="flex flex-col gap-1">
              {menuItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => onViewChange(item.id)}
                  className={cn(
                    "group flex items-center gap-3 rounded-xl px-3 py-2.5 text-left transition-all",
                    activeView === item.id
                      ? "bg-primary/15 text-primary"
                      : "text-muted-foreground hover:bg-secondary hover:text-foreground"
                  )}
                >
                  <item.icon className={cn(
                    "h-5 w-5 transition-colors",
                    activeView === item.id ? "text-primary" : "text-muted-foreground group-hover:text-foreground"
                  )} />
                  <div className="flex-1">
                    <p className="font-medium">{item.label}</p>
                    <p className="text-xs text-muted-foreground">{item.description}</p>
                  </div>
                  {activeView === item.id && (
                    <div className="h-2 w-2 rounded-full bg-primary" />
                  )}
                </button>
              ))}
            </div>
          </nav>

          {/* Quick Generate */}
          <div className="mb-6">
            <p className="mb-2 px-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Quick Generate
            </p>
            <div className="grid grid-cols-2 gap-2">
              {quickActions.map((action) => (
                <button
                  key={action.mode}
                  onClick={() => onViewChange("generate")}
                  className="flex flex-col items-center gap-2 rounded-xl border border-border/50 bg-card/50 p-3 text-center transition-all hover:border-primary/50 hover:bg-primary/5"
                >
                  <action.icon className="h-5 w-5 text-primary" />
                  <span className="text-xs font-medium text-foreground">{action.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Recent */}
          <div>
            <div className="mb-2 flex items-center justify-between px-2">
              <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Recent
              </p>
              <button className="text-xs text-primary hover:underline">View all</button>
            </div>
            <div className="flex flex-col gap-1">
              {recentItems.map((item) => (
                <button
                  key={item.id}
                  className="flex items-center gap-3 rounded-xl px-3 py-2 text-left transition-colors hover:bg-secondary"
                >
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-muted">
                    {item.type === "video" ? (
                      <Video className="h-4 w-4 text-muted-foreground" />
                    ) : (
                      <ImageIcon className="h-4 w-4 text-muted-foreground" />
                    )}
                  </div>
                  <div className="flex-1 overflow-hidden">
                    <p className="truncate text-sm font-medium text-foreground">{item.title}</p>
                    <p className="text-xs capitalize text-muted-foreground">{item.type}</p>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Profile Section at Bottom */}
        <div className="border-t border-border/50 p-4">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left transition-colors hover:bg-secondary">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-primary/20 to-accent/20">
                  <User className="h-5 w-5 text-primary" />
                </div>
                <div className="flex-1 overflow-hidden">
                  <p className="truncate text-sm font-medium text-foreground">Guest User</p>
                  <p className="text-xs text-muted-foreground">Free Plan</p>
                </div>
                <ChevronRight className="h-4 w-4 text-muted-foreground" />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel>My Account</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="gap-2">
                <User className="h-4 w-4" />
                Profile
              </DropdownMenuItem>
              <DropdownMenuItem className="gap-2">
                <CreditCard className="h-4 w-4" />
                Billing
              </DropdownMenuItem>
              <DropdownMenuItem className="gap-2">
                <Star className="h-4 w-4" />
                Upgrade to Pro
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="gap-2">
                <HelpCircle className="h-4 w-4" />
                Help & Support
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="gap-2 text-destructive">
                <LogOut className="h-4 w-4" />
                Sign Out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </aside>
    </>
  )
}
