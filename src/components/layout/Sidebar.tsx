"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import Image from "next/image"
import { 
  LayoutDashboard, 
  Truck, 
  Route, 
  Fuel, 
  DollarSign, 
  ClipboardCheck, 
  Settings, 
  LogOut,
  Wrench,
  BarChart3,
  Users,
  FileText
} from "lucide-react"
import { cn } from "@/lib/utils"

const navigation = [
  { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  { name: 'Viagens / Fretes', href: '/viagens', icon: Route },
  { name: 'Frota', href: '/frota', icon: Truck },
  { name: 'Abastecimentos', href: '/abastecimento', icon: Fuel },
  { name: 'Financeiro', href: '/financeiro', icon: DollarSign },
  { name: 'Checklist', href: '/checklist', icon: ClipboardCheck },
  { name: 'Manutenção', href: '/manutencao', icon: Wrench },
  { name: 'Relatórios', href: '/relatorios', icon: BarChart3 },
  { name: 'Motoristas', href: '/motoristas', icon: Users },
  { name: 'Documentos', href: '/documentos', icon: FileText },
]

export function Sidebar() {
  const pathname = usePathname()

  return (
    <div className="flex flex-col w-64 h-screen sidebar-gradient border-r border-white/5 fixed left-0 top-0 z-50 overflow-hidden">
      <div className="p-10 flex flex-col items-center gap-4">
        <div className="relative w-28 h-20 group cursor-pointer">
          <Image 
            src="/logo.png" 
            alt="FC Logo" 
            fill 
            className="object-contain transition-transform group-hover:scale-110 duration-500"
          />
        </div>
        <div className="text-center space-y-1">
          <h2 className="text-lg font-headline font-bold text-white tracking-tight">FC FROTA</h2>
          <p className="text-[9px] text-primary uppercase font-bold tracking-[0.3em] opacity-80">Gestão de Logística</p>
        </div>
      </div>

      <nav className="flex-1 px-4 py-6 space-y-1.5 overflow-y-auto scrollbar-none">
        {navigation.map((item) => {
          const isActive = pathname === item.href
          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                "group flex items-center px-4 py-3.5 text-xs font-bold uppercase tracking-widest rounded-xl transition-all duration-300",
                isActive 
                  ? "active-nav-item" 
                  : "text-muted-foreground hover:bg-white/5 hover:text-white"
              )}
            >
              <item.icon className={cn(
                "mr-4 h-5 w-5 flex-shrink-0 transition-all duration-300",
                isActive ? "text-primary-foreground scale-110" : "text-muted-foreground group-hover:text-primary group-hover:scale-110"
              )} />
              {item.name}
            </Link>
          )
        })}
      </nav>

      <div className="px-4 py-8 border-t border-white/5 space-y-2 bg-[#040505]/50 backdrop-blur-md">
        <Link
          href="/configuracoes"
          className="flex items-center px-4 py-3.5 text-xs font-bold uppercase tracking-widest text-muted-foreground hover:text-white rounded-xl hover:bg-white/5 transition-all"
        >
          <Settings className="mr-4 h-5 w-5" />
          Configurações
        </Link>
        <button className="flex items-center w-full px-4 py-3.5 text-xs font-bold uppercase tracking-widest text-muted-foreground hover:text-destructive transition-all rounded-xl hover:bg-destructive/10">
          <LogOut className="mr-4 h-5 w-5" />
          Sair do Sistema
        </button>
      </div>
      
      <div className="p-4 text-center border-t border-white/5">
        <p className="text-[8px] text-muted-foreground font-mono opacity-50">SISTEMA PREMIUM v1.2.4</p>
      </div>
    </div>
  )
}