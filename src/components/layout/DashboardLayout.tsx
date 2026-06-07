"use client"

import { Sidebar } from "./Sidebar"
import { Bell, User, Search, Calendar, ChevronDown } from "lucide-react"
import { cn } from "@/lib/utils"

export function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-[#040505] flex">
      <Sidebar />
      <div className="flex-1 pl-64 flex flex-col min-h-screen relative overflow-x-hidden">
        {/* Decorative Background Elements */}
        <div className="absolute top-0 right-0 w-[800px] h-[600px] bg-primary/5 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/2 pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-[600px] h-[400px] bg-accent/3 rounded-full blur-[100px] translate-y-1/2 -translate-x-1/2 pointer-events-none" />
        
        <header className="h-24 border-b border-white/5 bg-[#0a0c0b]/40 backdrop-blur-2xl sticky top-0 z-40 px-10 flex items-center justify-between transition-all duration-300">
          <div className="relative w-[450px] group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
            <input 
              type="text" 
              placeholder="Pesquisar caminhão, motorista, frete ou transação..." 
              className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-4 text-sm focus:outline-none focus:ring-1 focus:ring-primary/40 transition-all font-medium placeholder:text-muted-foreground/50"
            />
          </div>

          <div className="flex items-center gap-6">
            <div className="flex items-center gap-3">
              <button className="h-12 w-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-muted-foreground hover:text-primary hover:border-primary/30 transition-all relative group">
                <Bell className="h-5 w-5 group-hover:scale-110 transition-transform" />
                <span className="absolute top-3 right-3 h-2 w-2 bg-primary rounded-full border-2 border-[#0a0c0b] neon-glow"></span>
                <span className="absolute -top-1 -right-1 h-5 w-5 bg-primary text-[#0a0c0b] text-[10px] font-bold rounded-lg flex items-center justify-center shadow-lg">3</span>
              </button>
              <button className="h-12 w-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-muted-foreground hover:text-primary hover:border-primary/30 transition-all group">
                <Calendar className="h-5 w-5 group-hover:scale-110 transition-transform" />
              </button>
            </div>
            
            <div className="h-10 w-[1px] bg-white/10 mx-2" />
            
            <div className="flex items-center gap-4 pl-2 group cursor-pointer p-2 rounded-2xl hover:bg-white/5 transition-all">
              <div className="text-right hidden sm:block">
                <p className="text-sm font-bold text-white group-hover:text-primary transition-colors">Admin Operacional</p>
                <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-widest">FC Transportes</p>
              </div>
              <div className="relative h-14 w-14 rounded-[1.2rem] overflow-hidden border-2 border-white/10 p-1 bg-white/5 group-hover:border-primary/50 transition-all">
                <div className="h-full w-full rounded-lg bg-primary/20 flex items-center justify-center">
                   <User className="h-7 w-7 text-primary" />
                </div>
              </div>
              <ChevronDown className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-all group-hover:translate-y-0.5" />
            </div>
          </div>
        </header>
        
        <main className="flex-1 p-10 relative z-10">
          {children}
        </main>
      </div>
    </div>
  )
}