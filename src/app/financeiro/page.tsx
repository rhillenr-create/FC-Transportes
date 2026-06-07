"use client"

import { DashboardLayout } from "@/components/layout/DashboardLayout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { 
  DollarSign, 
  TrendingUp, 
  TrendingDown, 
  Wallet,
  ArrowUpRight,
  ArrowDownRight,
  PieChart as PieChartIcon
} from "lucide-react"
import { 
  ResponsiveContainer, 
  PieChart, 
  Pie, 
  Cell, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip,
  Legend
} from 'recharts'

const dataPie = [
  { name: 'Combustível', value: 45 },
  { name: 'Manutenção', value: 20 },
  { name: 'Motoristas', value: 25 },
  { name: 'Outros', value: 10 },
]

const COLORS = ['#00FF88', '#CCFF00', '#00BFFF', '#FF4444']

const cashflowData = [
  { month: 'Jan', entries: 80000, exits: 45000 },
  { month: 'Fev', entries: 95000, exits: 52000 },
  { month: 'Mar', entries: 88000, exits: 48000 },
  { month: 'Abr', entries: 110000, exits: 61000 },
]

export default function FinancePage() {
  return (
    <DashboardLayout>
      <div className="space-y-8">
        <div>
          <h2 className="text-3xl font-headline font-bold text-white">Gestão Financeira</h2>
          <p className="text-muted-foreground">Fluxo de caixa e saúde financeira da frota.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card className="bg-card border-white/5">
            <CardContent className="p-6">
              <div className="flex items-center gap-4 mb-4">
                <div className="p-2 rounded-lg bg-primary/20 text-primary">
                  <TrendingUp className="h-6 w-6" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground uppercase font-bold">Total Receitas</p>
                  <p className="text-xl font-headline font-bold">R$ 373.000</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="bg-card border-white/5">
            <CardContent className="p-6">
              <div className="flex items-center gap-4 mb-4">
                <div className="p-2 rounded-lg bg-red-500/20 text-red-500">
                  <TrendingDown className="h-6 w-6" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground uppercase font-bold">Total Despesas</p>
                  <p className="text-xl font-headline font-bold">R$ 206.000</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="bg-card border-white/5">
            <CardContent className="p-6">
              <div className="flex items-center gap-4 mb-4">
                <div className="p-2 rounded-lg bg-accent/20 text-accent">
                  <Wallet className="h-6 w-6" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground uppercase font-bold">Saldo Atual</p>
                  <p className="text-xl font-headline font-bold">R$ 167.000</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="bg-card border-white/5">
            <CardContent className="p-6">
              <div className="flex items-center gap-4 mb-4">
                <div className="p-2 rounded-lg bg-white/5 text-white">
                  <DollarSign className="h-6 w-6" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground uppercase font-bold">Margem Líquida</p>
                  <p className="text-xl font-headline font-bold">44.7%</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <Card className="bg-card border-white/5">
            <CardHeader>
              <CardTitle className="text-lg font-headline font-semibold">Distribuição de Despesas</CardTitle>
            </CardHeader>
            <CardContent className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={dataPie}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {dataPie.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={{ backgroundColor: 'hsl(var(--card))', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px' }}
                    itemStyle={{ color: '#fff' }}
                  />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card className="bg-card border-white/5">
            <CardHeader>
              <CardTitle className="text-lg font-headline font-semibold">Fluxo de Caixa Mensal</CardTitle>
            </CardHeader>
            <CardContent className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={cashflowData}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.05)" />
                  <XAxis dataKey="month" stroke="#666" fontSize={12} axisLine={false} tickLine={false} />
                  <YAxis stroke="#666" fontSize={12} axisLine={false} tickLine={false} tickFormatter={(v) => `R$${v/1000}k`} />
                  <Tooltip 
                    cursor={{fill: 'rgba(255,255,255,0.05)'}}
                    contentStyle={{ backgroundColor: 'hsl(var(--card))', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px' }}
                  />
                  <Bar dataKey="entries" name="Entradas" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="exits" name="Saídas" fill="#FF4444" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  )
}