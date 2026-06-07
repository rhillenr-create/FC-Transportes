
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

const dataExpenses = [
  { name: 'Dez', value: 20000 },
  { name: 'Jan', value: 28000 },
  { name: 'Fev', value: 25000 },
  { name: 'Mar', value: 31000 },
  { name: 'Abr', value: 27000 },
  { name: 'Mai', value: 28540 },
]

const dataProfit = [
  { day: '05/05', value: 6000 },
  { day: '06/05', value: 4500 },
  { day: '07/05', value: 8000 },
  { day: '08/05', value: 5500 },
  { day: '09/05', value: 7000 },
  { day: '10/05', value: 6500 },
  { day: '11/05', value: 9000 },
]

const dataFleet = [
  { name: 'Ativo', value: 1, color: 'hsl(var(--primary))' },
  { name: 'Manutenção', value: 0, color: '#CCFF00' },
  { name: 'Inativo', value: 0, color: '#FF4444' },
]

export default function DashboardPage() {
  return (
    <DashboardLayout>
      <div className="space-y-6 max-w-[1600px] mx-auto overflow-x-hidden pb-10 md:pb-0">
        {/* Top Header */}
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

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
          {[
            { label: "Total de Viagens", value: "24", sub: "este mês", icon: Truck, change: "+18%", trend: "up" },
            { label: "Gastos do Mês", value: "R$ 28.540", sub: "vs anterior", icon: Fuel, change: "+12%", trend: "up" },
            { label: "Lucro Estimado", value: "R$ 45.780", sub: "vs anterior", icon: TrendingUp, change: "+21%", trend: "up" },
            { label: "Próx. Revisão", value: "1.250 km", sub: "15/06/2025", icon: Wrench, detail: "Troca de óleo" },
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
                    {stat.change && (
                      <span className="text-[10px] font-bold text-primary flex items-center gap-0.5">
                        <ArrowUpRight className="h-3 w-3" />
                        {stat.change}
                      </span>
                    )}
                    <span className="text-[10px] text-muted-foreground uppercase tracking-tighter">{stat.sub}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Middle Section */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <Card className="lg:col-span-4 glass-card p-5 md:p-6">
            <div className="flex items-center justify-between mb-8">
              <h3 className="font-headline font-bold text-base md:text-lg">Gastos Semestrais</h3>
              <div className="bg-white/5 px-2 py-1 rounded text-[9px] font-bold uppercase">Últimos 6 meses</div>
            </div>
            <div className="h-[200px] md:h-[250px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={dataExpenses}>
                  <defs>
                    <linearGradient id="neonGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.05)" />
                  <XAxis dataKey="name" stroke="#444" fontSize={9} axisLine={false} tickLine={false} />
                  <YAxis hide />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#0a0c0b', border: '1px solid rgba(0,255,136,0.2)', borderRadius: '12px', fontSize: '10px' }}
                  />
                  <Area type="monotone" dataKey="value" stroke="hsl(var(--primary))" strokeWidth={3} fill="url(#neonGradient)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </Card>

          <Card className="lg:col-span-3 glass-card p-5 md:p-6">
            <div className="flex items-center justify-between mb-8">
              <h3 className="font-headline font-bold text-base md:text-lg">Lucro x Viagem</h3>
              <div className="bg-white/5 px-2 py-1 rounded text-[9px] font-bold uppercase">Maio</div>
            </div>
            <div className="h-[200px] md:h-[250px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={dataProfit}>
                  <Bar dataKey="value" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
                  <XAxis dataKey="day" stroke="#444" fontSize={9} axisLine={false} tickLine={false} />
                  <Tooltip cursor={{fill: 'rgba(255,255,255,0.02)'}} contentStyle={{backgroundColor: '#0a0c0b', border: 'none'}} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </Card>

          <Card className="lg:col-span-3 glass-card p-5 md:p-6">
            <h3 className="font-headline font-bold text-base md:text-lg mb-6">Viagens Ativas</h3>
            <div className="space-y-6">
              {[
                { route: "Cuiabá x Santos", driver: "João Silva", status: "Em andamento" },
                { route: "Curitiba x Belém", driver: "Pedro Santos", status: "Em andamento" },
                { route: "Goiânia x Recife", driver: "Carlos Lima", status: "Em andamento" },
              ].map((trip, i) => (
                <div key={i} className="flex items-start justify-between group cursor-pointer border-b border-white/5 pb-4 last:border-0 last:pb-0">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <div className="h-1.5 w-1.5 rounded-full bg-primary neon-glow" />
                      <p className="text-xs font-bold text-white/90">{trip.route}</p>
                    </div>
                    <p className="text-[10px] text-muted-foreground pl-3.5 uppercase tracking-wider">{trip.driver}</p>
                  </div>
                  <ChevronRight className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-all" />
                </div>
              ))}
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
            <div className="space-y-4">
              {[
                { title: "Manutenção", desc: "1.250 km restantes", color: "text-red-500" },
                { title: "CRLV Vencendo", desc: "Vence em 20/05", color: "text-orange-500" },
                { title: "Checklist", desc: "2 pendências", color: "text-orange-500" },
              ].map((alert, i) => (
                <div key={i} className="p-3 rounded-xl bg-white/5 border border-white/5 hover:bg-white/10 transition-colors">
                  <p className={cn("text-[11px] font-bold uppercase tracking-wider", alert.color)}>{alert.title}</p>
                  <p className="text-[10px] text-muted-foreground mt-0.5">{alert.desc}</p>
                </div>
              ))}
            </div>
          </Card>
        </div>

        {/* Bottom Section */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 pb-20 md:pb-0">
          <Card className="lg:col-span-3 glass-card p-6 flex flex-col items-center justify-center text-center space-y-6">
            <h3 className="font-headline font-bold text-lg w-full text-left uppercase tracking-widest text-primary/70">Checklist</h3>
            <div className="relative w-28 h-28 flex items-center justify-center">
               <div className="absolute inset-0 border-[3px] border-white/5 rounded-full" />
               <div className="absolute inset-0 border-[3px] border-primary rounded-full border-t-transparent -rotate-45 neon-glow" />
               <ClipboardCheck className="h-10 w-10 text-primary" />
            </div>
            <div className="space-y-1">
              <p className="text-[10px] text-muted-foreground uppercase font-bold tracking-widest">Último envio</p>
              <p className="text-sm font-bold text-white">Hoje - 07:30</p>
            </div>
            <Button asChild className="w-full neon-glow font-bold uppercase text-[11px] tracking-widest py-6 rounded-2xl">
              <Link href="/checklist">INICIAR INSPEÇÃO</Link>
            </Button>
          </Card>

          <Card className="lg:col-span-5 glass-card p-6">
            <div className="flex items-center justify-between mb-8">
              <h3 className="font-headline font-bold text-lg">Resumo Financeiro</h3>
              <div className="px-3 py-1 bg-primary/10 rounded-full text-primary text-[10px] font-bold">+21.4%</div>
            </div>
            <div className="grid grid-cols-2 gap-4 md:gap-8 mb-8">
              <div className="space-y-3">
                <p className="text-[10px] text-muted-foreground uppercase font-bold tracking-widest">Entradas Brutas</p>
                <p className="text-xl md:text-2xl font-headline font-bold text-white">R$ 74.320</p>
                <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                  <div className="h-full bg-primary w-full shadow-[0_0_10px_#00FF88]" />
                </div>
              </div>
              <div className="space-y-3">
                <p className="text-[10px] text-muted-foreground uppercase font-bold tracking-widest">Despesas</p>
                <p className="text-xl md:text-2xl font-headline font-bold text-white/80">R$ 28.540</p>
                <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                  <div className="h-full bg-red-500 w-[40%]" />
                </div>
              </div>
            </div>
            <div className="pt-6 border-t border-white/5 flex flex-col md:flex-row md:items-center justify-between gap-4">
               <div>
                 <p className="text-[10px] text-muted-foreground uppercase font-bold tracking-widest">Lucro Líquido</p>
                 <p className="text-3xl font-headline font-bold text-white tracking-tighter">R$ 45.780</p>
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
                <p className="text-3xl font-headline font-bold">12</p>
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
