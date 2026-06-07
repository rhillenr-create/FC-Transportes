
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
  Wrench
} from "lucide-react"
import { cn } from "@/lib/utils"

const navigation = [
  { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  { name: 'Frota', href: '/frota', icon: Truck },
  { name: 'Viagens', href: '/viagens', icon: Route },
  { name: 'Abastecimento', href: '/abastecimento', icon: Fuel },
  { name: 'Financeiro', href: '/financeiro', icon: DollarSign },
  { name: 'Checklist', href: '/checklist', icon: ClipboardCheck },
  { name: 'Manutenção', href: '/manutencao', icon: Wrench },
]

export function Sidebar() {
  const pathname = usePathname()

  return (
    <div className="flex flex-col w-64 h-screen sidebar-gradient border-r border-white/5 fixed left-0 top-0 z-50">
      <div className="p-6 flex items-center gap-3">
        <div className="relative w-10 h-10 overflow-hidden rounded-lg border border-primary/30 bg-white/5">
          <Image 
            src="/logo.png" 
            alt="FC Logo" 
            fill 
            className="object-contain p-1"
          />
        </div>
        <span className="text-xl font-headline font-bold tracking-tight text-white">FC FROTA</span>
      </div>

      <nav className="flex-1 px-4 py-6 space-y-1">
        {navigation.map((item) => {
          const isActive = pathname === item.href
          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                "group flex items-center px-3 py-2.5 text-sm font-medium rounded-lg transition-all duration-200",
                isActive 
                  ? "bg-primary text-primary-foreground neon-glow" 
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

      <div className="p-4 border-t border-white/5">
        <button className="flex items-center w-full px-3 py-2.5 text-sm font-medium text-muted-foreground hover:text-destructive transition-colors rounded-lg hover:bg-destructive/10">
          <LogOut className="mr-3 h-5 w-5" />
          Sair do Sistema
        </button>
      </div>
    </div>
  )
}
