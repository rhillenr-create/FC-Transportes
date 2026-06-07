"use client"

import { DashboardLayout } from "@/components/layout/DashboardLayout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { 
  TrendingUp, 
  Truck, 
  DollarSign, 
  Fuel, 
  AlertTriangle,
  ArrowUpRight,
  ArrowDownRight
} from "lucide-react"
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  AreaChart, 
  Area 
} from 'recharts'

const dataExpenses = [
  { name: 'Jan', value: 45000 },
  { name: 'Fev', value: 52000 },
  { name: 'Mar', value: 48000 },
  { name: 'Abr', value: 61000 },
  { name: 'Mai', value: 55000 },
  { name: 'Jun', value: 67000 },
]

const dataProfit = [
  { name: 'Sem 1', value: 12000 },
  { name: 'Sem 2', value: 15000 },
  { name: 'Sem 3', value: 13000 },
  { name: 'Sem 4', value: 18000 },
]

const stats = [
  { title: "Total de Viagens", value: "142", icon: Truck, change: "+12%", trend: "up", color: "text-primary" },
  { title: "Gastos do Mês", value: "R$ 67.420", icon: Fuel, change: "+5%", trend: "down", color: "text-red-400" },
  { title: "Lucro Estimado", value: "R$ 112.900", icon: DollarSign, change: "+18%", trend: "up", color: "text-accent" },
  { title: "Alertas Críticos", value: "03", icon: AlertTriangle, change: "-2", trend: "up", color: "text-orange-400" },
]

export default function DashboardPage() {
  return (
    <DashboardLayout>
      <div className="space-y-8">
        <div>
          <h2 className="text-3xl font-headline font-bold text-white">Painel de Comando</h2>
          <p className="text-muted-foreground">Visão geral da operação FC Construções e Transportes.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat) => (
            <Card key={stat.title} className="bg-card border-white/5 hover:border-primary/20 transition-colors">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className={`p-2 rounded-lg bg-white/5 ${stat.color}`}>
                    <stat.icon className="h-6 w-6" />
                  </div>
                  <div className={`flex items-center text-xs font-medium ${stat.trend === 'up' ? 'text-primary' : 'text-red-400'}`}>
                    {stat.change}
                    {stat.trend === 'up' ? <ArrowUpRight className="ml-1 h-3 w-3" /> : <ArrowDownRight className="ml-1 h-3 w-3" />}
                  </div>
                </div>
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">{stat.title}</p>
                  <p className="text-2xl font-bold font-headline">{stat.value}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <Card className="lg:col-span-2 bg-card border-white/5">
            <CardHeader>
              <CardTitle className="text-lg font-headline font-semibold flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-primary" />
                Gastos Mensais (R$)
              </CardTitle>
            </CardHeader>
            <CardContent className="h-[350px]">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={dataExpenses}>
                  <defs>
                    <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.05)" />
                  <XAxis 
                    dataKey="name" 
                    stroke="#666" 
                    fontSize={12} 
                    tickLine={false} 
                    axisLine={false} 
                  />
                  <YAxis 
                    stroke="#666" 
                    fontSize={12} 
                    tickLine={false} 
                    axisLine={false} 
                    tickFormatter={(value) => `R$${value/1000}k`}
                  />
                  <Tooltip 
                    contentStyle={{ backgroundColor: 'hsl(var(--card))', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px' }}
                    itemStyle={{ color: '#fff' }}
                  />
                  <Area type="monotone" dataKey="value" stroke="hsl(var(--primary))" strokeWidth={3} fillOpacity={1} fill="url(#colorValue)" />
                </AreaChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card className="bg-card border-white/5">
            <CardHeader>
              <CardTitle className="text-lg font-headline font-semibold">Próximas Manutenções</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {[
                  { truck: "ABC-1234", service: "Troca de Óleo", status: "Crítico", color: "bg-red-500/20 text-red-500" },
                  { truck: "XYZ-9876", service: "Pneus (Eixo 2)", status: "Próximo", color: "bg-orange-500/20 text-orange-500" },
                  { truck: "KLT-4433", service: "Revisão Geral", status: "Em dia", color: "bg-primary/20 text-primary" },
                  { truck: "MNO-0099", service: "Freios", status: "Próximo", color: "bg-orange-500/20 text-orange-500" },
                ].map((item, i) => (
                  <div key={i} className="flex items-center justify-between group">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-lg bg-white/5 flex items-center justify-center font-bold text-xs">
                        {item.truck.split('-')[1]}
                      </div>
                      <div>
                        <p className="text-sm font-bold">{item.truck}</p>
                        <p className="text-xs text-muted-foreground">{item.service}</p>
                      </div>
                    </div>
                    <span className={`px-2 py-1 rounded text-[10px] font-bold uppercase tracking-wider ${item.color}`}>
                      {item.status}
                    </span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  )
}