
"use client"

import { DashboardLayout } from "@/components/layout/DashboardLayout"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { 
  Truck, 
  Fuel, 
  Wrench,
  TrendingUp,
  AlertTriangle,
  ClipboardCheck,
  ChevronRight,
  ArrowUpRight
} from "lucide-react"
import { 
  ResponsiveContainer, 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell
} from 'recharts'
import Image from "next/image"
import { cn } from "@/lib/utils"
import Link from "next/link"

// Dados vazios para testes reais do usuário
const dataExpenses: any[] = []
const dataProfit: any[] = []
const dataFleet = [
  { name: 'Ativo', value: 0, color: 'hsl(var(--primary))' },
  { name: 'Manutenção', value: 0, color: '#CCFF00' },
  { name: 'Inativo', value: 0, color: '#FF4444' },
]

export default function DashboardPage() {
  return (
    <DashboardLayout>
      <div className="space-y-6 max-w-[1600px] mx-auto overflow-x-hidden pb-10 md:pb-0">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h2 className="text-3xl md:text-4xl font-headline font-bold text-white tracking-tight">Dashboard</h2>
            <p className="text-muted-foreground text-xs md:text-sm uppercase tracking-widest font-medium">Visão geral da operação em tempo real</p>
          </div>
          <div className="relative hidden lg:block w-[300px] lg:w-[400px] h-[80px] md:h-[100px] -mt-6 lg:-mt-10">
             <Image 
               src="https://picsum.photos/seed/truck1/600/400" 
               alt="Hero Truck" 
               fill 
               className="object-contain drop-shadow-[0_20px_50px_rgba(0,255,136,0.3)]"
               data-ai-hint="black truck neon"
             />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
          {[
            { label: "Total de Viagens", value: "0", sub: "aguardando dados", icon: Truck },
            { label: "Gastos do Mês", value: "R$ 0", sub: "sem registros", icon: Fuel },
            { label: "Lucro Estimado", value: "R$ 0", sub: "sem registros", icon: TrendingUp },
            { label: "Próx. Revisão", value: "N/A", sub: "nenhuma", icon: Wrench, detail: "-" },
          ].map((stat, i) => (
            <Card key={i} className="glass-card hover:neon-border transition-all duration-500 overflow-hidden">
              <CardContent className="p-5 md:p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2.5 rounded-xl bg-primary/10 text-primary">
                    <stat.icon className="h-5 w-5" />
                  </div>
                  <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground/60">{stat.label}</span>
                </div>
                <div className="space-y-1">
                  <p className="text-2xl md:text-3xl font-headline font-bold tracking-tight">{stat.value}</p>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] text-muted-foreground uppercase tracking-tighter">{stat.sub}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <Card className="lg:col-span-4 glass-card p-5 md:p-6">
            <div className="flex items-center justify-between mb-8">
              <h3 className="font-headline font-bold text-base md:text-lg">Gastos Semestrais</h3>
              <div className="bg-white/5 px-2 py-1 rounded text-[9px] font-bold uppercase">Aguardando dados</div>
            </div>
            <div className="h-[200px] md:h-[250px] w-full flex items-center justify-center text-muted-foreground text-xs uppercase font-bold">
              Sem dados para exibir
            </div>
          </Card>

          <Card className="lg:col-span-3 glass-card p-5 md:p-6">
            <div className="flex items-center justify-between mb-8">
              <h3 className="font-headline font-bold text-base md:text-lg">Lucro x Viagem</h3>
              <div className="bg-white/5 px-2 py-1 rounded text-[9px] font-bold uppercase">Zera</div>
            </div>
            <div className="h-[200px] md:h-[250px] w-full flex items-center justify-center text-muted-foreground text-xs uppercase font-bold">
              Sem dados para exibir
            </div>
          </Card>

          <Card className="lg:col-span-3 glass-card p-5 md:p-6">
            <h3 className="font-headline font-bold text-base md:text-lg mb-6">Viagens Ativas</h3>
            <div className="space-y-6 flex flex-col items-center justify-center h-[200px] text-muted-foreground text-xs uppercase font-bold">
              Nenhuma viagem ativa
            </div>
            <Link href="/viagens" className="block text-center text-[10px] uppercase font-bold text-primary mt-6 hover:underline">
              Gerenciar Logística
            </Link>
          </Card>

          <Card className="lg:col-span-2 glass-card p-5 md:p-6 bg-red-500/5">
            <h3 className="font-headline font-bold text-base md:text-lg mb-6 flex items-center gap-2">
              <AlertTriangle className="h-4 w-4 text-red-500" />
              Alertas
            </h3>
            <div className="space-y-4 flex flex-col items-center justify-center h-[200px] text-muted-foreground text-[10px] uppercase font-bold">
              Nenhum alerta crítico
            </div>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 pb-20 md:pb-0">
          <Card className="lg:col-span-3 glass-card p-6 flex flex-col items-center justify-center text-center space-y-6">
            <h3 className="font-headline font-bold text-lg w-full text-left uppercase tracking-widest text-primary/70">Checklist</h3>
            <div className="relative w-28 h-28 flex items-center justify-center">
               <div className="absolute inset-0 border-[3px] border-white/5 rounded-full" />
               <div className="absolute inset-0 border-[3px] border-primary/20 rounded-full border-t-transparent" />
               <ClipboardCheck className="h-10 w-10 text-muted-foreground" />
            </div>
            <div className="space-y-1">
              <p className="text-[10px] text-muted-foreground uppercase font-bold tracking-widest">Último envio</p>
              <p className="text-sm font-bold text-white">Nenhum realizado</p>
            </div>
            <Button asChild className="w-full neon-glow font-bold uppercase text-[11px] tracking-widest py-6 rounded-2xl">
              <Link href="/checklist">INICIAR INSPEÇÃO</Link>
            </Button>
          </Card>

          <Card className="lg:col-span-5 glass-card p-6">
            <div className="flex items-center justify-between mb-8">
              <h3 className="font-headline font-bold text-lg">Resumo Financeiro</h3>
              <div className="px-3 py-1 bg-white/5 rounded-full text-muted-foreground text-[10px] font-bold">0%</div>
            </div>
            <div className="grid grid-cols-2 gap-4 md:gap-8 mb-8">
              <div className="space-y-3">
                <p className="text-[10px] text-muted-foreground uppercase font-bold tracking-widest">Entradas Brutas</p>
                <p className="text-xl md:text-2xl font-headline font-bold text-white">R$ 0</p>
                <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden" />
              </div>
              <div className="space-y-3">
                <p className="text-[10px] text-muted-foreground uppercase font-bold tracking-widest">Despesas</p>
                <p className="text-xl md:text-2xl font-headline font-bold text-white/80">R$ 0</p>
                <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden" />
              </div>
            </div>
            <div className="pt-6 border-t border-white/5 flex flex-col md:flex-row md:items-center justify-between gap-4">
               <div>
                 <p className="text-[10px] text-muted-foreground uppercase font-bold tracking-widest">Lucro Líquido</p>
                 <p className="text-3xl font-headline font-bold text-white tracking-tighter">R$ 0</p>
               </div>
               <Button variant="outline" className="border-white/10 bg-transparent text-[10px] uppercase font-bold tracking-widest h-12 rounded-xl">
                 Ver Fluxo de Caixa
               </Button>
            </div>
          </Card>

          <Card className="lg:col-span-4 glass-card p-6 flex flex-col items-center relative overflow-hidden">
            <h3 className="font-headline font-bold text-lg w-full text-left mb-6 uppercase tracking-widest text-primary/70">Disponibilidade</h3>
            <div className="h-[180px] w-full relative">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={dataFleet}
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {dataFleet.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
              <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                <p className="text-3xl font-headline font-bold">0</p>
                <p className="text-[9px] text-muted-foreground uppercase font-bold tracking-widest">Frota</p>
              </div>
            </div>
            <div className="w-full flex justify-center gap-6 mt-6">
               {dataFleet.map((item, i) => (
                 <div key={i} className="flex items-center gap-2">
                    <div className="h-2 w-2 rounded-full" style={{backgroundColor: item.color}} />
                    <span className="text-[10px] text-muted-foreground font-bold uppercase">{item.name}</span>
                 </div>
               ))}
            </div>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  )
}
