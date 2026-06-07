
"use client"

import { useState } from "react"
import { DashboardLayout } from "@/components/layout/DashboardLayout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { 
  DollarSign, 
  TrendingUp, 
  TrendingDown, 
  Wallet,
  Plus,
  ChevronRight,
  FileDown
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
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { useToast } from "@/hooks/use-toast"

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
  const [isOpen, setIsOpen] = useState(false)
  const { toast } = useToast()

  const handleAddTransaction = (e: React.FormEvent) => {
    e.preventDefault()
    setIsOpen(false)
    toast({
      title: "Transação Registrada",
      description: "A nova transação foi adicionada ao fluxo de caixa com sucesso.",
    })
  }

  const handleExportReports = () => {
    toast({
      title: "Gerando Relatório",
      description: "O relatório financeiro consolidado está sendo preparado para download.",
    })
  }

  return (
    <DashboardLayout>
      <div className="space-y-8 max-w-[1600px] mx-auto animate-in fade-in slide-in-from-bottom-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-1">
            <h2 className="text-4xl font-headline font-bold text-white tracking-tight">Gestão Financeira</h2>
            <p className="text-muted-foreground text-sm uppercase tracking-widest font-medium">Fluxo de caixa e inteligência de rentabilidade</p>
          </div>
          <div className="flex gap-4">
             <Button 
               variant="outline" 
               onClick={handleExportReports}
               className="px-6 h-12 rounded-xl bg-white/5 border border-white/10 text-xs font-bold uppercase tracking-widest hover:bg-white/10 transition-all"
             >
               <FileDown className="w-4 h-4 mr-2" />
               Exportar Relatórios
             </Button>
             
             <Dialog open={isOpen} onOpenChange={setIsOpen}>
               <DialogTrigger asChild>
                 <Button className="neon-glow font-bold h-12 px-8 rounded-xl bg-primary text-primary-foreground">
                   <Plus className="w-5 h-5 mr-2" />
                   NOVA TRANSAÇÃO
                 </Button>
               </DialogTrigger>
               <DialogContent className="bg-card border-white/10 text-white max-w-xl rounded-[2rem]">
                 <DialogHeader>
                   <DialogTitle className="text-2xl font-headline font-bold text-primary">Nova Transação Financeira</DialogTitle>
                 </DialogHeader>
                 <form onSubmit={handleAddTransaction} className="space-y-6 py-4">
                   <div className="space-y-2">
                     <Label htmlFor="description">Descrição</Label>
                     <Input id="description" placeholder="Ex: Pagamento Frete Agro S/A" className="bg-white/5 border-white/10" required />
                   </div>
                   <div className="grid grid-cols-2 gap-4">
                     <div className="space-y-2">
                       <Label>Tipo</Label>
                       <Select>
                         <SelectTrigger className="bg-white/5 border-white/10 text-white">
                           <SelectValue placeholder="Selecione" />
                         </SelectTrigger>
                         <SelectContent className="bg-card border-white/10 text-white">
                           <SelectItem value="entry">Entrada (Receita)</SelectItem>
                           <SelectItem value="exit">Saída (Despesa)</SelectItem>
                         </SelectContent>
                       </Select>
                     </div>
                     <div className="space-y-2">
                       <Label htmlFor="value">Valor</Label>
                       <Input id="value" placeholder="R$ 0,00" className="bg-white/5 border-white/10" required />
                     </div>
                   </div>
                   <div className="grid grid-cols-2 gap-4">
                     <div className="space-y-2">
                       <Label>Categoria</Label>
                       <Select>
                         <SelectTrigger className="bg-white/5 border-white/10 text-white">
                           <SelectValue placeholder="Categoria" />
                         </SelectTrigger>
                         <SelectContent className="bg-card border-white/10 text-white">
                           <SelectItem value="fuel">Combustível</SelectItem>
                           <SelectItem value="maint">Manutenção</SelectItem>
                           <SelectItem value="freight">Frete / Viagem</SelectItem>
                           <SelectItem value="salary">Salários</SelectItem>
                           <SelectItem value="tax">Impostos</SelectItem>
                         </SelectContent>
                       </Select>
                     </div>
                     <div className="space-y-2">
                       <Label htmlFor="date">Data</Label>
                       <Input id="date" type="date" className="bg-white/5 border-white/10" required />
                     </div>
                   </div>
                   <DialogFooter className="pt-4">
                     <Button type="button" variant="ghost" onClick={() => setIsOpen(false)} className="text-muted-foreground hover:text-white">Cancelar</Button>
                     <Button type="submit" className="bg-primary text-primary-foreground neon-glow font-bold px-8">REGISTRAR</Button>
                   </DialogFooter>
                 </form>
               </DialogContent>
             </Dialog>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {[
            { label: "Receitas Totais", value: "R$ 373.000", icon: TrendingUp, color: "text-primary", bg: "bg-primary/10", trend: "+12%" },
            { label: "Despesas Operacionais", value: "R$ 206.000", icon: TrendingDown, color: "text-red-500", bg: "bg-red-500/10", trend: "+5%" },
            { label: "Saldo em Caixa", value: "R$ 167.000", icon: Wallet, color: "text-accent", bg: "bg-accent/10", trend: "+18%" },
            { label: "Margem Líquida", value: "44.7%", icon: DollarSign, color: "text-blue-400", bg: "bg-blue-400/10", trend: "+2.4%" },
          ].map((stat, i) => (
            <div key={i} className="glass-card rounded-[2rem] p-8 group hover:neon-border transition-all">
              <div className="flex items-center gap-4 mb-4">
                <div className={cn("p-4 rounded-2xl group-hover:scale-110 transition-transform", stat.bg, stat.color)}>
                  <stat.icon className="h-6 w-6" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground uppercase font-bold tracking-widest">{stat.label}</p>
                  <p className="text-2xl font-headline font-bold">{stat.value}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                 <span className={cn("text-[10px] font-bold px-2 py-0.5 rounded-full", stat.color, stat.bg)}>{stat.trend}</span>
                 <span className="text-[10px] text-muted-foreground uppercase font-medium">vs mês anterior</span>
              </div>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <Card className="lg:col-span-5 glass-card rounded-[2.5rem] border-white/5 p-8">
            <CardHeader className="px-0 pt-0">
              <div className="flex items-center justify-between mb-8">
                <CardTitle className="text-xl font-headline font-bold text-white">Distribuição de Gastos</CardTitle>
                <button className="text-[10px] font-bold text-primary uppercase tracking-widest flex items-center gap-1">Detalhar <ChevronRight className="h-3 w-3" /></button>
              </div>
            </CardHeader>
            <CardContent className="h-[350px] p-0 flex items-center justify-center">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={dataPie}
                    cx="50%"
                    cy="50%"
                    innerRadius={80}
                    outerRadius={110}
                    paddingAngle={8}
                    dataKey="value"
                  >
                    {dataPie.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={{ backgroundColor: 'rgba(10,12,11,0.95)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '16px' }}
                  />
                  <Legend verticalAlign="bottom" height={36} iconType="circle" />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card className="lg:col-span-7 glass-card rounded-[2.5rem] border-white/5 p-8">
            <CardHeader className="px-0 pt-0">
               <div className="flex items-center justify-between mb-8">
                <CardTitle className="text-xl font-headline font-bold text-white">Fluxo de Caixa Mensal</CardTitle>
                <div className="flex gap-2">
                   <span className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-widest text-primary"><div className="h-2 w-2 rounded-full bg-primary" /> Entradas</span>
                   <span className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-widest text-red-500"><div className="h-2 w-2 rounded-full bg-red-500" /> Saídas</span>
                </div>
              </div>
            </CardHeader>
            <CardContent className="h-[350px] p-0">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={cashflowData}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.05)" />
                  <XAxis dataKey="month" stroke="#555" fontSize={11} axisLine={false} tickLine={false} />
                  <YAxis stroke="#555" fontSize={11} axisLine={false} tickLine={false} tickFormatter={(v) => `R$${v/1000}k`} />
                  <Tooltip 
                    cursor={{fill: 'rgba(255,255,255,0.02)'}}
                    contentStyle={{ backgroundColor: 'rgba(10,12,11,0.95)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '16px' }}
                  />
                  <Bar dataKey="entries" name="Entradas" fill="hsl(var(--primary))" radius={[6, 6, 0, 0]} barSize={40} />
                  <Bar dataKey="exits" name="Saídas" fill="#FF4444" radius={[6, 6, 0, 0]} barSize={40} />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  )
}
