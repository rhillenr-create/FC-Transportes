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
    <div className="flex flex-col w-64 h-screen sidebar-gradient border-r border-white/5 fixed left-0 top-0 z-50">
      <div className="p-8 flex flex-col items-center gap-2">
        <div className="relative w-24 h-16 mb-2">
          <Image 
            src="/logo.png" 
            alt="FC Logo" 
            fill 
            className="object-contain"
          />
        </div>
        <div className="text-center">
          <p className="text-[10px] text-muted-foreground uppercase font-bold tracking-[0.2em]">Gestão de Frotas</p>
        </div>
      </div>

      <nav className="flex-1 px-4 py-4 space-y-1 overflow-y-auto">
        {navigation.map((item) => {
          const isActive = pathname === item.href
          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                "group flex items-center px-4 py-3 text-sm font-medium rounded-xl transition-all duration-200",
                isActive 
                  ? "active-nav-item" 
                  : "text-muted-foreground hover:bg-white/5 hover:text-white"
              )}
            >
              <item.icon className={cn(
                "mr-3 h-5 w-5 flex-shrink-0 transition-colors",
                isActive ? "text-primary-foreground" : "text-muted-foreground group-hover:text-primary"
              )} />
              {item.name}
            </Link>
          )
        })}
      </nav>

      <div className="px-4 py-6 border-t border-white/5 space-y-2">
        <Link
          href="/configuracoes"
          className="flex items-center px-4 py-3 text-sm font-medium text-muted-foreground hover:text-white rounded-xl hover:bg-white/5 transition-all"
        >
          <Settings className="mr-3 h-5 w-5" />
          Configurações
        </Link>
        <button className="flex items-center w-full px-4 py-3 text-sm font-medium text-muted-foreground hover:text-destructive transition-colors rounded-xl hover:bg-destructive/10">
          <LogOut className="mr-3 h-5 w-5" />
          Sair do Sistema
        </button>
      </div>
      
      <div className="p-4 text-center">
        <p className="text-[9px] text-muted-foreground font-mono">FC Frota v1.0.0</p>
      </div>
    </div>
  )
}