"use client"

import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Menu, Bell, Search, Moon, Sun } from "lucide-react"

interface HeaderProps {
  activeView: "generate" | "gallery" | "queue" | "admin"
  onViewChange: (view: "generate" | "gallery" | "queue" | "admin") => void
  onMenuToggle: () => void
}

export function Header({ activeView, onViewChange, onMenuToggle }: HeaderProps) {
  return (
    <header className="relative z-40 flex h-14 shrink-0 items-center justify-between border-b border-border/50 bg-card/50 px-4 backdrop-blur-xl lg:px-6">
      <div className="flex items-center gap-4">
        {/* Menu Toggle */}
        <Button 
          variant="ghost" 
          size="icon" 
          className="text-muted-foreground hover:text-foreground"
          onClick={onMenuToggle}
        >
          <Menu className="h-5 w-5" />
        </Button>

        {/* Breadcrumb / Current View */}
        <div className="hidden items-center gap-2 sm:flex">
          <span className="text-sm font-medium capitalize text-foreground">{activeView}</span>
          {activeView === "generate" && (
            <>
              <span className="text-muted-foreground">/</span>
              <span className="text-sm text-muted-foreground">Text to Video</span>
            </>
          )}
        </div>
      </div>

      {/* Center - Search (optional, can be expanded) */}
      <div className="absolute left-1/2 hidden -translate-x-1/2 lg:block">
        <button className="flex items-center gap-2 rounded-xl border border-border/50 bg-muted/50 px-4 py-2 text-sm text-muted-foreground transition-colors hover:border-border hover:bg-muted">
          <Search className="h-4 w-4" />
          <span>Search...</span>
          <kbd className="ml-4 rounded bg-background px-1.5 py-0.5 text-xs font-medium text-muted-foreground">
            /
          </kbd>
        </button>
      </div>

      {/* Right side actions */}
      <div className="flex items-center gap-2">
        {/* Credits indicator */}
        <div className="hidden items-center gap-2 rounded-lg bg-primary/10 px-3 py-1.5 sm:flex">
          <div className="h-2 w-2 rounded-full bg-primary" />
          <span className="text-sm font-medium text-primary">42 Credits</span>
        </div>

        <Button variant="ghost" size="icon" className="relative text-muted-foreground hover:text-foreground">
          <Bell className="h-5 w-5" />
          <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-primary" />
        </Button>

        <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-foreground">
          <Moon className="h-5 w-5" />
        </Button>

        <div className="ml-2 h-8 w-px bg-border/50" />

        <Button variant="ghost" className="text-muted-foreground hover:text-foreground">
          Sign in
        </Button>
        <Button className="bg-primary text-primary-foreground hover:bg-primary/90">
          Sign up
        </Button>
      </div>
    </header>
  )
}
