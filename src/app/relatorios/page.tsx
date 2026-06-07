
"use client"

import { DashboardLayout } from "@/components/layout/DashboardLayout"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { BarChart3, FileDown, TrendingUp, Calendar, Filter } from "lucide-react"
import { 
  ResponsiveContainer, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip,
  Legend
} from 'recharts'

const data = [
  { name: 'Jan', viagens: 45, custos: 2400 },
  { name: 'Fev', viagens: 52, custos: 2800 },
  { name: 'Mar', viagens: 48, custos: 2100 },
  { name: 'Abr', viagens: 61, custos: 3200 },
  { name: 'Mai', viagens: 55, custos: 2900 },
]

export default function ReportsPage() {
  return (
    <DashboardLayout>
      <div className="space-y-8">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-headline font-bold text-white">Relatórios Gerenciais</h2>
            <p className="text-muted-foreground">Análise profunda da performance e custos da frota.</p>
          </div>
          <div className="flex gap-4">
            <Button variant="outline" className="border-white/10 bg-white/5">
              <Filter className="h-4 w-4 mr-2" />
              FILTRAR
            </Button>
            <Button className="neon-glow font-bold">
              <FileDown className="h-4 w-4 mr-2" />
              EXPORTAR PDF
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="bg-card border-white/5">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-bold uppercase tracking-widest text-muted-foreground">Produtividade</CardTitle>
              <TrendingUp className="h-4 w-4 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-headline font-bold">88.5%</div>
              <p className="text-[10px] text-primary mt-1 font-bold">+5.2% em relação ao mês anterior</p>
            </CardContent>
          </Card>
          <Card className="bg-card border-white/5">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-bold uppercase tracking-widest text-muted-foreground">Custo por KM</CardTitle>
              <BarChart3 className="h-4 w-4 text-accent" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-headline font-bold">R$ 4,12</div>
              <p className="text-[10px] text-red-500 mt-1 font-bold">+2.1% devido à alta do diesel</p>
            </CardContent>
          </Card>
          <Card className="bg-card border-white/5">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-bold uppercase tracking-widest text-muted-foreground">Tempo em Trânsito</CardTitle>
              <Calendar className="h-4 w-4 text-blue-500" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-headline font-bold">1.240h</div>
              <p className="text-[10px] text-muted-foreground mt-1">Total acumulado este mês</p>
            </CardContent>
          </Card>
        </div>

        <Card className="bg-card border-white/5 p-6">
          <CardHeader>
            <CardTitle className="text-xl font-headline font-bold">Evolução Operacional</CardTitle>
          </CardHeader>
          <CardContent className="h-[400px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.05)" />
                <XAxis dataKey="name" stroke="#666" fontSize={12} axisLine={false} tickLine={false} />
                <YAxis stroke="#666" fontSize={12} axisLine={false} tickLine={false} />
                <Tooltip 
                  cursor={{fill: 'rgba(255,255,255,0.05)'}}
                  contentStyle={{ backgroundColor: 'hsl(var(--card))', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px' }}
                />
                <Legend />
                <Bar dataKey="viagens" name="Total Viagens" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
                <Bar dataKey="custos" name="Custos Operacionais" fill="hsl(var(--accent))" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  )
}
