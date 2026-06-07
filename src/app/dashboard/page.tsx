"use client"

import { useState, useEffect, useMemo } from "react"
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
  ArrowUpRight,
  Loader2,
  Route
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
import { useFirestore, useCollection, useMemoFirebase, useUser } from "@/firebase"
import { collection, query, orderBy, limit } from "firebase/firestore"

export default function DashboardPage() {
  const db = useFirestore()
  const { user } = useUser()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  // Fetching Data - Gated by user for security stability
  const trucksQuery = useMemoFirebase(() => {
    if (!db || !user) return null
    return collection(db, "trucks")
  }, [db, user])
  const { data: trucks, loading: loadingTrucks } = useCollection(trucksQuery)

  const tripsQuery = useMemoFirebase(() => {
    if (!db || !user) return null
    return collection(db, "trips")
  }, [db, user])
  const { data: trips, loading: loadingTrips } = useCollection(tripsQuery)

  const financeQuery = useMemoFirebase(() => {
    if (!db || !user) return null
    return collection(db, "financial_entries")
  }, [db, user])
  const { data: finance, loading: loadingFinance } = useCollection(financeQuery)

  // Stats Calculation
  const stats = useMemo(() => {
    if (!mounted) return { tripsCount: 0, monthlyExpenses: 0, estimatedProfit: 0, activeTrips: 0, fleetData: [] }

    const tripsCount = trips?.length || 0
    const activeTrips = trips?.filter(t => t.status === 'Em Rota').length || 0
    
    let totalRevenue = 0
    let totalExpenses = 0
    
    finance?.forEach(entry => {
      const val = Number(entry.value) || 0
      if (entry.type === 'entry') totalRevenue += val
      else totalExpenses += val
    })

    const estimatedProfit = totalRevenue - totalExpenses

    const statusCounts = {
      'Disponível': trucks?.filter(t => t.status === 'Disponível').length || 0,
      'Em Viagem': trucks?.filter(t => t.status === 'Em Viagem').length || 0,
      'Manutenção': trucks?.filter(t => t.status === 'Manutenção').length || 0,
    }

    const fleetData = [
      { name: 'Disponível', value: statusCounts['Disponível'], color: 'hsl(var(--primary))' },
      { name: 'Em Viagem', value: statusCounts['Em Viagem'], color: 'hsl(var(--accent))' },
      { name: 'Manutenção', value: statusCounts['Manutenção'], color: '#FF4444' },
    ]

    return { tripsCount, monthlyExpenses: totalExpenses, estimatedProfit, activeTrips, fleetData }
  }, [trips, finance, trucks, mounted])

  const formatCurrency = (val: number) => {
    return val.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
  }

  if (!mounted) return null

  return (
    <DashboardLayout>
      <div className="space-y-6 max-w-[1600px] mx-auto overflow-x-hidden pb-10 md:pb-0 animate-in fade-in duration-500">
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
            { label: "Total de Viagens", value: stats.tripsCount.toString(), sub: `${stats.activeTrips} em rota`, icon: Truck },
            { label: "Gastos Totais", value: formatCurrency(stats.monthlyExpenses), sub: "registros financeiros", icon: Fuel },
            { label: "Lucro Estimado", value: formatCurrency(stats.estimatedProfit), sub: "saldo em caixa", icon: TrendingUp },
            { label: "Frota Ativa", value: trucks?.length.toString() || "0", sub: "veículos cadastrados", icon: Wrench },
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
                  <p className="text-xl md:text-2xl font-headline font-bold tracking-tight">{stat.value}</p>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] text-muted-foreground uppercase tracking-tighter">{stat.sub}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <Card className="lg:col-span-8 glass-card p-5 md:p-6">
            <div className="flex items-center justify-between mb-8">
              <h3 className="font-headline font-bold text-base md:text-lg">Fluxo Financeiro Mensal</h3>
              <div className="bg-white/5 px-3 py-1 rounded-full text-[10px] font-bold uppercase text-primary">Tempo Real</div>
            </div>
            <div className="h-[300px] w-full">
              {finance && finance.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={finance.slice(-10).reverse()}>
                    <defs>
                      <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3}/>
                        <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.05)" />
                    <XAxis dataKey="date" stroke="#666" fontSize={10} tickFormatter={(val) => new Date(val).toLocaleDateString('pt-BR', {day: '2-digit', month: '2-digit'})} />
                    <YAxis stroke="#666" fontSize={10} tickFormatter={(val) => `R$ ${val}`} />
                    <Tooltip 
                      contentStyle={{ background: '#0a0c0b', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px' }}
                      itemStyle={{ color: 'hsl(var(--primary))' }}
                    />
                    <Area type="monotone" dataKey="value" stroke="hsl(var(--primary))" fillOpacity={1} fill="url(#colorValue)" strokeWidth={3} />
                  </AreaChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-full flex flex-col items-center justify-center text-muted-foreground text-xs uppercase font-bold gap-2">
                  <TrendingUp className="h-8 w-8 opacity-20" />
                  Sem dados financeiros para exibir
                </div>
              )}
            </div>
          </Card>

          <Card className="lg:col-span-4 glass-card p-5 md:p-6 flex flex-col items-center">
            <h3 className="font-headline font-bold text-base md:text-lg mb-6 w-full text-left">Status da Frota</h3>
            <div className="h-[250px] w-full relative">
              {trucks && trucks.length > 0 ? (
                <>
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={stats.fleetData}
                        innerRadius={60}
                        outerRadius={90}
                        paddingAngle={5}
                        dataKey="value"
                      >
                        {stats.fleetData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip 
                        contentStyle={{ background: '#0a0c0b', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px' }}
                        itemStyle={{ color: '#fff' }}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                  <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                    <p className="text-3xl font-headline font-bold">{trucks.length}</p>
                    <p className="text-[9px] text-muted-foreground uppercase font-bold tracking-widest">Veículos</p>
                  </div>
                </>
              ) : (
                <div className="h-full flex items-center justify-center text-muted-foreground text-xs uppercase font-bold">
                  Nenhum veículo
                </div>
              )}
            </div>
            <div className="w-full grid grid-cols-2 gap-3 mt-6">
               {stats.fleetData.map((item, i) => (
                 <div key={i} className="flex items-center gap-2 bg-white/5 p-2 rounded-lg border border-white/5">
                    <div className="h-2 w-2 rounded-full" style={{backgroundColor: item.color}} />
                    <span className="text-[9px] text-muted-foreground font-bold uppercase">{item.name}: {item.value}</span>
                 </div>
               ))}
            </div>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 pb-20 md:pb-0">
          <Card className="lg:col-span-4 glass-card p-6">
            <h3 className="font-headline font-bold text-lg mb-6 flex items-center gap-2">
              <Route className="h-5 w-5 text-primary" />
              Últimas Viagens
            </h3>
            <div className="space-y-4">
              {loadingTrips ? (
                <div className="flex justify-center py-10"><Loader2 className="animate-spin h-6 w-6 opacity-20" /></div>
              ) : !trips || trips.length === 0 ? (
                <div className="text-center py-10 text-muted-foreground text-xs uppercase font-bold">Nenhuma viagem</div>
              ) : trips.slice(0, 3).map((trip: any) => (
                <div key={trip.id} className="p-4 rounded-2xl bg-white/5 border border-white/5 flex justify-between items-center group hover:border-primary/30 transition-all">
                  <div className="space-y-1">
                    <p className="text-sm font-bold text-white">{trip.origin} → {trip.destination}</p>
                    <p className="text-[10px] text-muted-foreground uppercase">{trip.driver} | {trip.truck}</p>
                  </div>
                  <div className={cn(
                    "px-3 py-1 rounded-full text-[8px] font-bold uppercase tracking-widest",
                    trip.status === 'Concluída' ? "bg-primary/20 text-primary" : "bg-accent/20 text-accent"
                  )}>
                    {trip.status}
                  </div>
                </div>
              ))}
            </div>
            <Button asChild variant="ghost" className="w-full mt-6 text-[10px] uppercase font-bold text-primary tracking-widest hover:bg-primary/5">
              <Link href="/viagens">Gerenciar Logística <ChevronRight className="h-3 w-3 ml-2" /></Link>
            </Button>
          </Card>

          <Card className="lg:col-span-8 glass-card p-6">
             <div className="flex items-center justify-between mb-8">
                <h3 className="font-headline font-bold text-lg">Resumo Operacional de Custos</h3>
                <TrendingUp className="h-5 w-5 text-primary opacity-50" />
             </div>
             <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="p-6 rounded-[2rem] bg-white/5 border border-white/5 space-y-4">
                   <p className="text-[10px] text-muted-foreground uppercase font-bold tracking-widest">Viagens Concluídas</p>
                   <p className="text-4xl font-headline font-bold text-white">{trips?.filter(t => t.status === 'Concluída').length || 0}</p>
                   <div className="h-1.5 w-full bg-primary/10 rounded-full overflow-hidden">
                      <div className="h-full bg-primary w-full opacity-50" />
                   </div>
                </div>
                <div className="p-6 rounded-[2rem] bg-white/5 border border-white/5 space-y-4">
                   <p className="text-[10px] text-muted-foreground uppercase font-bold tracking-widest">Gastos Médios</p>
                   <p className="text-4xl font-headline font-bold text-white">
                      {formatCurrency(finance?.length ? stats.monthlyExpenses / finance.length : 0)}
                   </p>
                   <div className="h-1.5 w-full bg-accent/10 rounded-full overflow-hidden">
                      <div className="h-full bg-accent w-full opacity-50" />
                   </div>
                </div>
                <div className="p-6 rounded-[2rem] bg-white/5 border border-white/5 space-y-4">
                   <p className="text-[10px] text-muted-foreground uppercase font-bold tracking-widest">Custo Operacional</p>
                   <p className="text-4xl font-headline font-bold text-white">
                      {finance?.length ? ((stats.monthlyExpenses / (stats.estimatedProfit + stats.monthlyExpenses)) * 100 || 0).toFixed(0) : 0}%
                   </p>
                   <div className="h-1.5 w-full bg-red-500/10 rounded-full overflow-hidden">
                      <div className="h-full bg-red-500 w-full opacity-50" />
                   </div>
                </div>
             </div>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  )
}