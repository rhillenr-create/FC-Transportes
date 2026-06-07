"use client"

import { Sidebar } from "./Sidebar"
import { Bell, User, Search, Calendar, ChevronDown } from "lucide-react"

export function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-background flex">
      <Sidebar />
      <div className="flex-1 pl-64 flex flex-col min-h-screen">
        <header className="h-20 border-b border-white/5 bg-[#0a0c0b]/80 backdrop-blur-xl sticky top-0 z-40 px-8 flex items-center justify-between">
          <div className="relative w-96 group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
            <input 
              type="text" 
              placeholder="Buscar caminhão, motorista ou frete..." 
              className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-12 pr-4 text-sm focus:outline-none focus:ring-1 focus:ring-primary/50 transition-all font-medium"
            />
          </div>

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <button className="h-10 w-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-muted-foreground hover:text-primary hover:border-primary/30 transition-all relative">
                <Bell className="h-5 w-5" />
                <span className="absolute top-2 right-2 h-2.5 w-2.5 bg-primary rounded-full border-2 border-[#0a0c0b] neon-glow"></span>
                <span className="absolute -top-1 -right-1 h-4 w-4 bg-primary text-[#0a0c0b] text-[9px] font-bold rounded-full flex items-center justify-center">3</span>
              </button>
              <button className="h-10 w-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-muted-foreground hover:text-primary hover:border-primary/30 transition-all">
                <Calendar className="h-5 w-5" />
              </button>
            </div>
            
            <div className="h-10 w-[1px] bg-white/10 mx-2" />
            
            <div className="flex items-center gap-3 pl-2 group cursor-pointer">
              <div className="text-right">
                <p className="text-sm font-bold text-white group-hover:text-primary transition-colors">Administrador</p>
                <p className="text-[10px] text-muted-foreground font-medium">admin@fctransportes.com.br</p>
              </div>
              <div className="relative h-12 w-12 rounded-xl overflow-hidden border border-white/10 p-1 bg-white/5 group-hover:border-primary/50 transition-all">
                <div className="h-full w-full rounded-lg bg-primary/10 flex items-center justify-center">
                   <User className="h-6 w-6 text-primary" />
                </div>
              </div>
              <ChevronDown className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-all" />
            </div>
          </div>
        </header>
        
        <main className="flex-1 p-8 animate-in fade-in duration-700 bg-[radial-gradient(circle_at_top_right,rgba(0,255,136,0.02),transparent_40%)]">
          {children}
        </main>
      </div>
    </div>
  )
}