
"use client"

import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
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
import { PlaceHolderImages } from "@/lib/placeholder-images"
import { signOut } from "firebase/auth"
import { useAuth } from "@/firebase"

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

interface SidebarProps {
  isMobile?: boolean;
}

export function Sidebar({ isMobile }: SidebarProps) {
  const pathname = usePathname()
  const router = useRouter()
  const auth = useAuth()
  const logoImage = PlaceHolderImages.find(img => img.id === 'app-logo')

  const handleLogout = async () => {
    try {
      await signOut(auth)
      router.push("/")
    } catch (error) {
      console.error("Erro ao sair do sistema:", error)
    }
  }

  return (
    <div className={cn(
      "flex flex-col h-screen sidebar-gradient border-r border-white/5 overflow-hidden transition-all duration-300",
      isMobile ? "w-full" : "w-64 fixed left-0 top-0 z-50"
    )}>
      <div className="p-8 lg:p-10 flex flex-col items-center gap-4">
        <div className="relative w-24 h-16 lg:w-28 lg:h-20 group cursor-pointer">
          <Image 
            src={logoImage?.imageUrl || "/icon.png"} 
            alt={logoImage?.description || "FC Logo"} 
            fill 
            className="object-contain transition-transform group-hover:scale-110 duration-500"
            data-ai-hint={logoImage?.imageHint || "industrial logo"}
          />
        </div>
        <div className="text-center space-y-1">
          <h2 className="text-lg font-headline font-bold text-white tracking-tight">FC FROTA</h2>
          <p className="text-[9px] text-primary uppercase font-bold tracking-[0.3em] opacity-80">Gestão de Logística</p>
        </div>
      </div>

      <nav className="flex-1 px-4 py-2 space-y-1 overflow-y-auto scrollbar-none pb-20 lg:pb-6">
        {navigation.map((item) => {
          const isActive = pathname === item.href
          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                "group flex items-center px-4 py-3 text-[11px] lg:text-xs font-bold uppercase tracking-widest rounded-xl transition-all duration-300",
                isActive 
                  ? "active-nav-item" 
                  : "text-muted-foreground hover:bg-white/5 hover:text-white"
              )}
            >
              <item.icon className={cn(
                "mr-4 h-4 w-4 lg:h-5 lg:w-5 flex-shrink-0 transition-all duration-300",
                isActive ? "text-primary-foreground scale-110" : "text-muted-foreground group-hover:text-primary group-hover:scale-110"
              )} />
              {item.name}
            </Link>
          )
        })}
      </nav>

      <div className="px-4 py-6 lg:py-8 border-t border-white/5 space-y-1 bg-[#040505]/80 backdrop-blur-md">
        <Link
          href="/configuracoes"
          className="flex items-center px-4 py-3 text-[11px] lg:text-xs font-bold uppercase tracking-widest text-muted-foreground hover:text-white rounded-xl hover:bg-white/5 transition-all"
        >
          <Settings className="mr-4 h-4 w-4 lg:h-5 lg:w-5" />
          Configurações
        </Link>
        <button 
          onClick={handleLogout}
          className="flex items-center w-full px-4 py-3 text-[11px] lg:text-xs font-bold uppercase tracking-widest text-muted-foreground hover:text-destructive transition-all rounded-xl hover:bg-destructive/10"
        >
          <LogOut className="mr-4 h-4 w-4 lg:h-5 lg:w-5" />
          Sair do Sistema
        </button>
      </div>
      
      <div className="p-4 text-center border-t border-white/5 hidden lg:block">
        <p className="text-[8px] text-muted-foreground font-mono opacity-50 uppercase tracking-widest">SISTEMA PREMIUM v1.2.4</p>
      </div>
    </div>
  )
}
