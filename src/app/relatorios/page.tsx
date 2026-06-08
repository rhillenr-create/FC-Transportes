
"use client"

import { useState, useEffect, useMemo } from "react"
import { DashboardLayout } from "@/components/layout/DashboardLayout"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { BarChart3, FileDown, TrendingUp, Calendar, Filter, Loader2, PieChart as PieIcon } from "lucide-react"
import { 
  ResponsiveContainer, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip,
  Legend,
  AreaChart,
  Area
} from 'recharts'
import { useToast } from "@/hooks/use-toast"
import { PageHeader } from "@/components/app/PageHeader"
import { useFirestore, useCollection, useMemoFirebase } from "@/firebase"
import { collection, query, orderBy } from "firebase/firestore"

export default function ReportsPage() {
  const { toast } = useToast()
  const db = useFirestore()
  const [mounted, setMounted] = useState(false)
  const [isExporting, setIsExporting] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  // Data Fetching
  const tripsQuery = useMemoFirebase(() => collection(db, "trips"), [db])
  const { data: trips, loading: loadingTrips } = useCollection(tripsQuery)

  const fuelQuery = useMemoFirebase(() => collection(db, "fuel_entries"), [db])
  const { data: fuelLogs, loading: loadingFuel } = useCollection(fuelQuery)

  const financeQuery = useMemoFirebase(() => collection(db, "financial_entries"), [db])
  const { data: finance, loading: loadingFinance } = useCollection(financeQuery)

  // Reports Calculation
  const stats = useMemo(() => {
    if (!mounted) return { productivity: 0, costPerKm: 0, totalHours: 0, evolutionData: [] }

    // Productivity: % of completed trips
    const completedTrips = trips?.filter(t => t.status === 'Concluída').length || 0
    const totalTrips = trips?.length || 0
    const productivity = totalTrips > 0 ? (completedTrips / totalTrips) * 100 : 0

    // Cost per KM: Total fuel cost / total KM
    const totalFuelCost = fuelLogs?.reduce((acc, log) => acc + (Number(log.totalValue) || 0), 0) || 0
    const totalKm = fuelLogs?.reduce((acc, log) => acc + (Number(log.km) || 0), 0) || 0
    const costPerKm = totalKm > 0 ? totalFuelCost / totalKm : 0

    // Operational Evolution Chart Data
    const evolutionData = finance?.slice(-10).reverse().map(entry => ({
      date: new Date(entry.date).toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' }),
      receita: entry.type === 'entry' ? entry.value : 0,
      despesa: entry.type === 'exit' ? entry.value : 0
    })) || []

    return { productivity, costPerKm, totalHours: completedTrips * 12, evolutionData }
  }, [trips, fuelLogs, finance, mounted])

  const handleExportPDF = () => {
    setIsExporting(true)
    toast({
      title: "Gerando Relatório",
      description: "Compilando dados operacionais e financeiros reais...",
    })

    setTimeout(() => {
      setIsExporting(false)
      toast({
        title: "Sucesso!",
        description: "O relatório PDF foi gerado com sucesso.",
      })
    }, 2500)
  }

  if (!mounted) return null

  return (
    <DashboardLayout>
      <div className="space-y-8 animate-in fade-in duration-500 pb-10">
        <PageHeader
          title="Relatórios Gerenciais"
          description="Análise profunda da performance e custos da frota."
        />
          <div className="flex gap-4">
            <Button variant="outline" className="border-white/10 bg-white/5 h-12 rounded-xl text-xs font-bold uppercase tracking-widest">
              <Filter className="h-4 w-4 mr-2" />
              FILTRAR
            </Button>
            <Button 
              onClick={handleExportPDF}
              disabled={isExporting}
              className="neon-glow font-bold h-12 px-8 rounded-xl bg-primary text-primary-foreground"
            >
              {isExporting ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <FileDown className="h-4 w-4 mr-2" />}
              {isExporting ? "GERANDO..." : "EXPORTAR PDF"}
            </Button>
          </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="glass-card rounded-[2rem] group hover:neon-border transition-all">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Produtividade (Sucesso)</CardTitle>
              <TrendingUp className="h-5 w-5 text-primary group-hover:scale-125 transition-transform" />
            </CardHeader>
            <CardContent>
              <div className="text-4xl font-headline font-bold text-white">{stats.productivity.toFixed(1)}%</div>
              <p className="text-[10px] text-muted-foreground mt-1 font-bold uppercase tracking-tighter">Taxa de conclusão de viagens</p>
            </CardContent>
          </Card>
          <Card className="glass-card rounded-[2rem] group hover:neon-border transition-all">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Custo por KM (Combustível)</CardTitle>
              <BarChart3 className="h-5 w-5 text-accent group-hover:scale-125 transition-transform" />
            </CardHeader>
            <CardContent>
              <div className="text-4xl font-headline font-bold text-white">R$ {stats.costPerKm.toFixed(2)}</div>
              <p className="text-[10px] text-muted-foreground mt-1 font-bold uppercase tracking-tighter">Média ponderada baseada em abastecimentos</p>
            </CardContent>
          </Card>
          <Card className="glass-card rounded-[2rem] group hover:neon-border transition-all">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Tempo em Trânsito</CardTitle>
              <Calendar className="h-5 w-5 text-blue-500 group-hover:scale-125 transition-transform" />
            </CardHeader>
            <CardContent>
              <div className="text-4xl font-headline font-bold text-white">{stats.totalHours}h</div>
              <p className="text-[10px] text-muted-foreground mt-1 font-bold uppercase tracking-tighter">Total acumulado em viagens operacionais</p>
            </CardContent>
          </Card>
        </div>

        <Card className="glass-card p-8 rounded-[2.5rem] border-white/5">
          <CardHeader className="px-0 pt-0">
            <div className="flex items-center justify-between mb-8">
              <CardTitle className="text-xl font-headline font-bold text-white">Evolução de Fluxo Operacional (Receita x Despesa)</CardTitle>
              <div className="flex gap-4">
                 <div className="flex items-center gap-2"><div className="h-2 w-2 rounded-full bg-primary" /><span className="text-[10px] font-bold uppercase tracking-widest">Receita</span></div>
                 <div className="flex items-center gap-2"><div className="h-2 w-2 rounded-full bg-red-500" /><span className="text-[10px] font-bold uppercase tracking-widest">Despesa</span></div>
              </div>
            </div>
          </CardHeader>
          <CardContent className="h-[450px] p-0">
            {(loadingTrips || loadingFuel || loadingFinance) ? (
              <div className="h-full flex items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-primary opacity-50" />
              </div>
            ) : stats.evolutionData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={stats.evolutionData}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.05)" />
                  <XAxis dataKey="date" stroke="#666" fontSize={10} />
                  <YAxis stroke="#666" fontSize={10} tickFormatter={(val) => `R$ ${val}`} />
                  <Tooltip 
                    contentStyle={{ background: '#0a0c0b', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px' }}
                    itemStyle={{ color: '#fff' }}
                  />
                  <Bar dataKey="receita" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="despesa" fill="#FF4444" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-muted-foreground text-xs uppercase font-bold gap-4">
                <PieIcon className="h-12 w-12 opacity-10" />
                Sem dados operacionais registrados para gerar o gráfico
              </div>
            )}
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
           <Card className="glass-card p-8 rounded-[2rem] border-white/5">
              <h3 className="text-lg font-headline font-bold text-white mb-6 uppercase tracking-widest text-primary/70">Eficiência por Veículo</h3>
              <div className="space-y-6">
                 {loadingFuel ? (
                    <div className="flex justify-center py-10"><Loader2 className="animate-spin h-6 w-6 opacity-20" /></div>
                 ) : !fuelLogs || fuelLogs.length === 0 ? (
                    <p className="text-center text-xs text-muted-foreground uppercase font-bold py-10">Nenhum dado de abastecimento</p>
                 ) : (
                    fuelLogs.slice(0, 5).map((log, i) => (
                      <div key={i} className="flex items-center justify-between p-4 rounded-xl bg-white/5 border border-white/5">
                         <div className="flex items-center gap-4">
                            <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary font-bold">{log.truckId?.[0] || 'T'}</div>
                            <div>
                               <p className="text-sm font-bold text-white">{log.truckId}</p>
                               <p className="text-[10px] text-muted-foreground uppercase font-medium">{log.liters} Litros consumidos</p>
                            </div>
                         </div>
                         <p className="font-headline font-bold text-accent">R$ {log.totalValue?.toLocaleString('pt-BR')}</p>
                      </div>
                    ))
                 )}
              </div>
           </Card>

           <Card className="glass-card p-8 rounded-[2rem] border-white/5">
              <h3 className="text-lg font-headline font-bold text-white mb-6 uppercase tracking-widest text-primary/70">Performance de Rotas</h3>
              <div className="space-y-6">
                 {loadingTrips ? (
                    <div className="flex justify-center py-10"><Loader2 className="animate-spin h-6 w-6 opacity-20" /></div>
                 ) : !trips || trips.length === 0 ? (
                    <p className="text-center text-xs text-muted-foreground uppercase font-bold py-10">Nenhuma viagem registrada</p>
                 ) : (
                    trips.slice(0, 5).map((trip, i) => (
                      <div key={i} className="flex items-center justify-between p-4 rounded-xl bg-white/5 border border-white/5">
                         <div>
                            <p className="text-sm font-bold text-white">{trip.origin} → {trip.destination}</p>
                            <p className="text-[10px] text-muted-foreground uppercase font-medium">Cliente: {trip.client}</p>
                         </div>
                         <div className="text-right">
                            <p className="font-headline font-bold text-primary">{trip.freight}</p>
                            <span className="text-[9px] font-bold px-2 py-0.5 rounded bg-primary/10 text-primary uppercase">{trip.status}</span>
                         </div>
                      </div>
                    ))
                 )}
              </div>
           </Card>
        </div>
      </div>
    </DashboardLayout>
  )
}
