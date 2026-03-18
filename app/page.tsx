"use client"

import { useState, useEffect } from "react"
import { Header } from "@/components/header"
import { GenerationPanel } from "@/components/generation-panel"
import { Sidebar } from "@/components/sidebar"
import { QueuePanel } from "@/components/queue-panel"

export default function Home() {
  const [activeView, setActiveView] = useState<"generate" | "gallery" | "queue" | "admin">("generate")
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    // Trigger entrance animation after mount
    setMounted(true)
    // Open sidebar by default on desktop
    if (window.innerWidth >= 1024) {
      setSidebarOpen(true)
    }
  }, [])

  return (
    <div className="relative flex h-screen flex-col overflow-hidden">
      {/* Animated Background */}
      <div className="animated-bg fixed inset-0 -z-10" />
      
      {/* Floating Orbs for visual depth */}
      <div className="fixed inset-0 -z-10 overflow-hidden">
        <div className="floating-orb pulse-glow absolute -left-32 -top-32 h-96 w-96 rounded-full bg-primary/10 blur-3xl" />
        <div className="floating-orb-delayed pulse-glow absolute -bottom-32 -right-32 h-96 w-96 rounded-full bg-accent/10 blur-3xl" />
        <div className="floating-orb absolute left-1/2 top-1/2 h-64 w-64 -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary/5 blur-3xl" style={{ animationDelay: '-5s' }} />
      </div>

      <Header 
        activeView={activeView} 
        onViewChange={setActiveView} 
        onMenuToggle={() => setSidebarOpen(!sidebarOpen)}
      />
      
      <div className="flex flex-1 overflow-hidden">
        <Sidebar 
          open={sidebarOpen} 
          onToggle={() => setSidebarOpen(!sidebarOpen)} 
          activeView={activeView}
          onViewChange={setActiveView}
        />
        
        <main className="flex-1 overflow-auto">
          {activeView === "generate" && mounted && <GenerationPanel />}
          {activeView === "queue" && mounted && <QueuePanel />}
          {activeView === "gallery" && mounted && (
            <div className="flex h-full items-center justify-center">
              <div className={`text-center ${mounted ? 'animate-scale-in' : 'opacity-0'}`}>
                <div className="mb-4 text-6xl text-muted-foreground">
                  <svg className="mx-auto h-16 w-16" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
                <h2 className="text-xl font-semibold text-foreground">Gallery Coming Soon</h2>
                <p className="mt-2 text-muted-foreground">Your generated images and videos will appear here</p>
              </div>
            </div>
          )}
          {activeView === "admin" && mounted && (
            <div className="flex h-full items-center justify-center p-4">
              <div className={`w-full max-w-md rounded-2xl border border-border/50 bg-card/80 p-8 backdrop-blur-sm ${mounted ? 'animate-scale-in' : 'opacity-0'}`}>
                <div className="mb-6 flex justify-center">
                  <div className="rounded-2xl bg-gradient-to-br from-primary/20 to-accent/20 p-4">
                    <svg className="h-8 w-8 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                  </div>
                </div>
                <h2 className="mb-2 text-center text-2xl font-bold text-foreground">Admin Access</h2>
                <p className="mb-6 text-center text-sm text-muted-foreground">Enter the admin passcode to continue</p>
                <input
                  type="password"
                  placeholder="Enter passcode"
                  className="mb-4 w-full rounded-xl border border-border bg-input px-4 py-3 text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                />
                <button className="w-full rounded-xl bg-primary px-4 py-3 font-medium text-primary-foreground transition-colors hover:bg-primary/90">
                  Unlock Admin Panel
                </button>
                <p className="mt-4 text-center text-xs text-muted-foreground">
                  Set <code className="rounded bg-muted px-1.5 py-0.5 font-mono text-xs">ADMIN_PASSCODE</code> in your .env.local file
                </p>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  )
}
