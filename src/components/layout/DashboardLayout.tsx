
"use client"

import { useState } from "react"
import { Sidebar } from "./Sidebar"
import { Bell, User, Search, Calendar, ChevronDown, Menu, X } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"

export function DashboardLayout({ children }: { children: React.ReactNode }) {
  const [isSearchOpen, setIsSearchOpen] = useState(false)

  return (
    <div className="min-h-screen bg-[#040505] flex">
      {/* Sidebar Desktop */}
      <div className="hidden lg:block">
        <Sidebar />
      </div>

      <div className="flex-1 lg:pl-64 flex flex-col min-h-screen relative overflow-x-hidden">
        {/* Decorative Background Elements */}
        <div className="absolute top-0 right-0 w-[300px] md:w-[800px] h-[300px] md:h-[600px] bg-primary/5 rounded-full blur-[80px] md:blur-[120px] -translate-y-1/2 translate-x-1/2 pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-[200px] md:w-[600px] h-[200px] md:h-[400px] bg-accent/3 rounded-full blur-[60px] md:blur-[100px] translate-y-1/2 -translate-x-1/2 pointer-events-none" />
        
        <header className="h-20 lg:h-24 border-b border-white/5 bg-[#0a0c0b]/40 backdrop-blur-2xl sticky top-0 z-40 px-4 md:px-10 flex items-center justify-between transition-all duration-300">
          <div className="flex items-center gap-4">
            {/* Mobile Sidebar Trigger */}
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="lg:hidden text-muted-foreground hover:text-primary">
                  <Menu className="h-6 w-6" />
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="p-0 border-none w-72 bg-transparent">
                <Sidebar isMobile />
              </SheetContent>
            </Sheet>

            <div className="relative hidden md:block w-[300px] lg:w-[450px] group">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
              <input 
                type="text" 
                placeholder="Pesquisar no sistema..." 
                className="w-full bg-white/5 border border-white/10 rounded-2xl py-3 pl-12 pr-4 text-sm focus:outline-none focus:ring-1 focus:ring-primary/40 transition-all font-medium placeholder:text-muted-foreground/50"
              />
            </div>
          </div>

          <div className="flex items-center gap-2 md:gap-6">
            <div className="flex items-center gap-1 md:gap-3">
              <Button variant="ghost" size="icon" className="md:hidden text-muted-foreground" onClick={() => setIsSearchOpen(!isSearchOpen)}>
                <Search className="h-5 w-5" />
              </Button>
              
              <button className="h-10 w-10 md:h-12 md:w-12 rounded-xl md:rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-muted-foreground hover:text-primary transition-all relative group">
                <Bell className="h-5 w-5" />
                <span className="absolute top-2.5 right-2.5 h-2 w-2 bg-primary rounded-full border-2 border-[#0a0c0b] neon-glow"></span>
              </button>
            </div>
            
            <div className="h-8 w-[1px] bg-white/10 mx-1 md:mx-2" />
            
            <div className="flex items-center gap-3 pl-2 group cursor-pointer p-1 rounded-2xl hover:bg-white/5 transition-all">
              <div className="text-right hidden sm:block">
                <p className="text-sm font-bold text-white group-hover:text-primary transition-colors">Admin Operacional</p>
                <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-widest">FC Transportes</p>
              </div>
              <div className="relative h-10 w-10 lg:h-14 lg:w-14 rounded-xl lg:rounded-[1.2rem] overflow-hidden border-2 border-white/10 p-0.5 md:p-1 bg-white/5 group-hover:border-primary/50 transition-all">
                <div className="h-full w-full rounded-lg bg-primary/20 flex items-center justify-center">
                   <User className="h-5 w-5 lg:h-7 lg:w-7 text-primary" />
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Mobile Search Overlay */}
        {isSearchOpen && (
          <div className="md:hidden p-4 bg-[#0a0c0b] border-b border-white/5 animate-in slide-in-from-top-4">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <input 
                autoFocus
                type="text" 
                placeholder="Pesquisar caminhão, motorista..." 
                className="w-full bg-white/10 border border-white/10 rounded-xl py-3 pl-12 pr-10 text-sm"
              />
              <Button variant="ghost" size="icon" className="absolute right-1 top-1/2 -translate-y-1/2" onClick={() => setIsSearchOpen(false)}>
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>
        )}
        
        <main className="flex-1 p-4 md:p-10 relative z-10 overflow-x-hidden">
          {children}
        </main>
      </div>
    </div>
  )
}
