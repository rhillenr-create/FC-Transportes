"use client"

import { DashboardLayout } from "@/components/layout/DashboardLayout"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { 
  Truck, 
  DollarSign, 
  Fuel, 
  Wrench,
  TrendingUp,
  AlertTriangle,
  ClipboardCheck,
  ChevronRight,
  ArrowUpRight,
  CircleDot
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
      <div className="space-y-6 max-w-[1600px] mx-auto">
        {/* Top Header */}
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-4xl font-headline font-bold text-white tracking-tight">Dashboard</h2>
            <p className="text-muted-foreground text-sm">Visão geral da operação</p>
          </div>
          <div className="relative hidden lg:block w-[400px] h-[100px] -mt-10 mr-4">
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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { label: "Total de Viagens", value: "24", sub: "este mês", icon: Truck, change: "+18%", trend: "up" },
            { label: "Gastos do Mês", value: "R$ 28.540,00", sub: "vs mês anterior", icon: Fuel, change: "+12%", trend: "up" },
            { label: "Lucro Estimado", value: "R$ 45.780,00", sub: "vs mês anterior", icon: TrendingUp, change: "+21%", trend: "up" },
            { label: "Próx. Manutenção", value: "1.250 km", sub: "Venc. 15/06/2025", icon: Wrench, detail: "Troca de óleo" },
          ].map((stat, i) => (
            <Card key={i} className="glass-card hover:neon-border transition-all duration-300">
              <CardContent className="p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2 rounded-lg bg-primary/10 text-primary">
                    <stat.icon className="h-5 w-5" />
                  </div>
                  <span className="text-xs font-bold uppercase tracking-widest text-muted-foreground">{stat.label}</span>
                </div>
                <div className="space-y-1">
                  <p className="text-3xl font-headline font-bold">{stat.value}</p>
                  <div className="flex items-center gap-2">
                    {stat.change && (
                      <span className="text-[10px] font-bold text-primary flex items-center gap-0.5">
                        <ArrowUpRight className="h-3 w-3" />
                        {stat.change}
                      </span>
                    )}
                    <span className="text-[10px] text-muted-foreground uppercase">{stat.sub}</span>
                  </div>
                  {stat.detail && <p className="text-[10px] text-muted-foreground font-medium">{stat.detail}</p>}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Middle Section: Charts & Trips */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <Card className="lg:col-span-4 glass-card p-6">
            <div className="flex items-center justify-between mb-8">
              <h3 className="font-headline font-bold text-lg">Gastos dos Últimos 6 Meses</h3>
              <select className="bg-white/5 text-[10px] font-bold uppercase p-1 rounded border-none focus:ring-1 focus:ring-primary">
                <option>6 meses</option>
              </select>
            </div>
            <div className="h-[250px]">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={dataExpenses}>
                  <defs>
                    <linearGradient id="neonGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.05)" />
                  <XAxis dataKey="name" stroke="#555" fontSize={10} axisLine={false} tickLine={false} />
                  <YAxis stroke="#555" fontSize={10} axisLine={false} tickLine={false} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: 'rgba(10,12,11,0.95)', border: '1px solid rgba(0,255,136,0.2)', borderRadius: '12px' }}
                  />
                  <Area type="monotone" dataKey="value" stroke="hsl(var(--primary))" strokeWidth={3} fill="url(#neonGradient)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </Card>

          <Card className="lg:col-span-3 glass-card p-6">
            <div className="flex items-center justify-between mb-8">
              <h3 className="font-headline font-bold text-lg">Lucro por Viagem</h3>
              <select className="bg-white/5 text-[10px] font-bold uppercase p-1 rounded border-none focus:ring-1 focus:ring-primary">
                <option>7 dias</option>
              </select>
            </div>
            <div className="h-[250px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={dataProfit}>
                  <Bar dataKey="value" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
                  <XAxis dataKey="day" stroke="#555" fontSize={10} axisLine={false} tickLine={false} />
                  <Tooltip cursor={{fill: 'rgba(255,255,255,0.05)'}} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </Card>

          <Card className="lg:col-span-3 glass-card p-6 overflow-hidden">
            <div className="flex items-center justify-between mb-6">
              <h3 className="font-headline font-bold text-lg">Viagens em Andamento</h3>
            </div>
            <div className="space-y-6">
              {[
                { route: "São Paulo - SP / Curitiba - PR", driver: "João Silva", status: "Em andamento" },
                { route: "Campinas - SP / Belo Horizonte - MG", driver: "Pedro Santos", status: "Em andamento" },
                { route: "Ribeirão Preto - SP / Goiânia - GO", driver: "Carlos Lima", status: "Em andamento" },
              ].map((trip, i) => (
                <div key={i} className="flex items-start justify-between group cursor-pointer">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <div className="h-2 w-2 rounded-full bg-primary neon-glow" />
                      <p className="text-xs font-bold">{trip.route.split('/')[0]}</p>
                    </div>
                    <div className="pl-4">
                      <p className="text-[10px] text-muted-foreground">{trip.route.split('/')[1]}</p>
                      <p className="text-[10px] font-medium text-white/60">Motorista: {trip.driver}</p>
                    </div>
                  </div>
                  <span className="text-[9px] font-bold text-primary uppercase">{trip.status}</span>
                </div>
              ))}
            </div>
            <Button variant="link" className="text-[10px] uppercase font-bold text-muted-foreground p-0 mt-6 flex items-center gap-1 hover:text-primary transition-colors">
              Ver todas as viagens <ChevronRight className="h-3 w-3" />
            </Button>
          </Card>

          <Card className="lg:col-span-2 glass-card p-6">
            <h3 className="font-headline font-bold text-lg mb-6">Alertas Importantes</h3>
            <div className="space-y-4">
              {[
                { icon: AlertTriangle, title: "Manutenção próxima", desc: "Troca de óleo em 1.250 km", color: "text-red-500" },
                { icon: AlertTriangle, title: "Documento vencendo", desc: "CRLV vence em 20/05/2025", color: "text-orange-500" },
                { icon: AlertTriangle, title: "Checklist pendente", desc: "2 checklists aguardando", color: "text-orange-500" },
              ].map((alert, i) => (
                <div key={i} className="flex items-center justify-between p-3 rounded-xl bg-white/5 hover:bg-white/10 cursor-pointer transition-colors group">
                  <div className="flex items-center gap-3">
                    <div className={cn("p-2 rounded-lg bg-white/5", alert.color)}>
                      <alert.icon className="h-4 w-4" />
                    </div>
                    <div>
                      <p className="text-[11px] font-bold">{alert.title}</p>
                      <p className="text-[9px] text-muted-foreground">{alert.desc}</p>
                    </div>
                  </div>
                  <ChevronRight className="h-3 w-3 text-muted-foreground group-hover:text-white" />
                </div>
              ))}
            </div>
            <Button variant="link" className="text-[10px] uppercase font-bold text-muted-foreground p-0 mt-6 w-full text-center">
              Ver todos os alertas
            </Button>
          </Card>
        </div>

        {/* Bottom Section */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <Card className="lg:col-span-3 glass-card p-6 flex flex-col items-center justify-center text-center space-y-6">
            <h3 className="font-headline font-bold text-lg w-full text-left">Checklist Rápido</h3>
            <div className="relative w-32 h-32 flex items-center justify-center">
               <div className="absolute inset-0 border-4 border-white/5 rounded-full" />
               <div className="absolute inset-0 border-4 border-primary rounded-full border-t-transparent -rotate-45" />
               <ClipboardCheck className="h-10 w-10 text-primary" />
            </div>
            <div className="space-y-1">
              <p className="text-[10px] text-muted-foreground uppercase font-bold tracking-widest">Último checklist</p>
              <p className="text-sm font-bold">12/05/2025 - 07:30</p>
              <p className="text-[10px] text-muted-foreground">Motorista: João Silva</p>
            </div>
            <Button className="w-full neon-glow font-bold uppercase text-xs tracking-widest py-6 rounded-xl">
              Iniciar Checklist
            </Button>
          </Card>

          <Card className="lg:col-span-3 glass-card p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="font-headline font-bold text-lg">Abastecimentos Recentes</h3>
              <button className="text-[10px] font-bold text-muted-foreground uppercase hover:text-primary transition-colors">Ver todos</button>
            </div>
            <div className="space-y-6">
              {[
                { date: "12/05/2025", station: "Posto Petrobras", liters: "120 L", value: "R$ 680,00", km: "125.430" },
                { date: "09/05/2025", station: "Posto Ipiranga", liters: "100 L", value: "R$ 560,00", km: "124.890" },
                { date: "06/05/2025", station: "Posto Shell", liters: "110 L", value: "R$ 610,00", km: "124.100" },
              ].map((fuel, i) => (
                <div key={i} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-primary/10 text-primary">
                      <Fuel className="h-4 w-4" />
                    </div>
                    <div>
                      <p className="text-[11px] font-bold">{fuel.date}</p>
                      <p className="text-[10px] text-muted-foreground">{fuel.station}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-[11px] font-bold">{fuel.liters}</p>
                    <p className="text-[10px] text-white/60">{fuel.value}</p>
                    <p className="text-[9px] text-muted-foreground">KM: {fuel.km}</p>
                  </div>
                </div>
              ))}
            </div>
          </Card>

          <Card className="lg:col-span-4 glass-card p-6">
            <div className="flex items-center justify-between mb-8">
              <h3 className="font-headline font-bold text-lg">Resumo Financeiro</h3>
              <span className="text-[10px] font-bold text-muted-foreground uppercase">Maio/2025</span>
            </div>
            <div className="grid grid-cols-2 gap-8 mb-8">
              <div className="space-y-2">
                <p className="text-[10px] text-muted-foreground uppercase font-bold tracking-widest">Entradas</p>
                <p className="text-2xl font-headline font-bold text-white">R$ 74.320,00</p>
                <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                  <div className="h-full bg-primary w-full" />
                </div>
              </div>
              <div className="space-y-2">
                <p className="text-[10px] text-muted-foreground uppercase font-bold tracking-widest">Saídas</p>
                <p className="text-2xl font-headline font-bold text-white">R$ 28.540,00</p>
                <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                  <div className="h-full bg-red-500 w-[40%]" />
                </div>
              </div>
            </div>
            <div className="pt-6 border-t border-white/5 space-y-4">
               <div className="flex items-center justify-between">
                 <div>
                   <p className="text-[10px] text-muted-foreground uppercase font-bold tracking-widest">Lucro Líquido</p>
                   <p className="text-3xl font-headline font-bold text-white">R$ 45.780,00</p>
                 </div>
                 <span className="px-3 py-1 rounded-full bg-primary/20 text-primary text-[10px] font-bold">+21% vs mês anterior</span>
               </div>
               <Button variant="outline" className="w-full border-white/10 bg-transparent text-[10px] uppercase font-bold tracking-widest h-12">
                 Ver relatório completo
               </Button>
            </div>
          </Card>

          <Card className="lg:col-span-2 glass-card p-6 flex flex-col items-center">
            <h3 className="font-headline font-bold text-lg w-full text-left mb-6">Status da Frota</h3>
            <div className="h-[150px] w-full relative">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={dataFleet}
                    innerRadius={50}
                    outerRadius={70}
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
                <p className="text-2xl font-headline font-bold">1</p>
                <p className="text-[8px] text-muted-foreground uppercase font-bold">Total</p>
              </div>
            </div>
            <div className="w-full space-y-3 mt-6">
               {dataFleet.map((item, i) => (
                 <div key={i} className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="h-2 w-2 rounded-full" style={{backgroundColor: item.color}} />
                      <span className="text-[10px] text-muted-foreground font-bold">{item.name}</span>
                    </div>
                    <span className="text-[10px] font-bold">{item.value}</span>
                 </div>
               ))}
            </div>
            <Button variant="link" className="text-[10px] uppercase font-bold text-muted-foreground p-0 mt-6 flex items-center gap-1">
              Ver frota completa <ChevronRight className="h-3 w-3" />
            </Button>
          </Card>
        </div>
      </div>
      
      <footer className="mt-12 py-6 border-t border-white/5 text-center flex flex-col md:flex-row items-center justify-between text-muted-foreground text-[10px] uppercase font-bold tracking-widest">
        <p>© 2025 FC Transportes. Todos os direitos reservados.</p>
        <p>Sistema FC Frota v1.0.0</p>
      </footer>
    </DashboardLayout>
  )
}