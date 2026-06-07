
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
import { useToast } from "@/hooks/use-toast"

export default function ReportsPage() {
  const { toast } = useToast()

  const handleExportPDF = () => {
    toast({
      title: "Gerando PDF",
      description: "O relatório gerencial detalhado está sendo compilado. O download começará em instantes.",
    })
  }

  return (
    <DashboardLayout>
      <div className="space-y-8">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-headline font-bold text-white">Relatórios Gerenciais</h2>
            <p className="text-muted-foreground">Análise profunda da performance e custos da frota.</p>
          </div>
          <div className="flex gap-4">
            <Button variant="outline" className="border-white/10 bg-white/5 h-12 rounded-xl">
              <Filter className="h-4 w-4 mr-2" />
              FILTRAR
            </Button>
            <Button 
              onClick={handleExportPDF}
              className="neon-glow font-bold h-12 px-8 rounded-xl bg-primary text-primary-foreground"
            >
              <FileDown className="h-4 w-4 mr-2" />
              EXPORTAR PDF
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="glass-card">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-bold uppercase tracking-widest text-muted-foreground">Produtividade</CardTitle>
              <TrendingUp className="h-4 w-4 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-headline font-bold">0%</div>
              <p className="text-[10px] text-muted-foreground mt-1 font-bold">Aguardando dados</p>
            </CardContent>
          </Card>
          <Card className="glass-card">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-bold uppercase tracking-widest text-muted-foreground">Custo por KM</CardTitle>
              <BarChart3 className="h-4 w-4 text-accent" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-headline font-bold">R$ 0,00</div>
              <p className="text-[10px] text-muted-foreground mt-1 font-bold">Aguardando dados</p>
            </CardContent>
          </Card>
          <Card className="glass-card">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-bold uppercase tracking-widest text-muted-foreground">Tempo em Trânsito</CardTitle>
              <Calendar className="h-4 w-4 text-blue-500" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-headline font-bold">0h</div>
              <p className="text-[10px] text-muted-foreground mt-1">Total acumulado este mês</p>
            </CardContent>
          </Card>
        </div>

        <Card className="glass-card p-6 rounded-[2.5rem]">
          <CardHeader>
            <CardTitle className="text-xl font-headline font-bold">Evolução Operacional</CardTitle>
          </CardHeader>
          <CardContent className="h-[400px] flex items-center justify-center text-muted-foreground text-xs uppercase font-bold">
            Sem dados operacionais registrados
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  )
}
