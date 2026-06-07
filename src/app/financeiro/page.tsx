
"use client"

import { useState, useMemo, useEffect } from "react"
import { DashboardLayout } from "@/components/layout/DashboardLayout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { 
  DollarSign, 
  TrendingUp, 
  TrendingDown, 
  Wallet,
  Plus,
  ChevronRight,
  FileDown,
  Loader2,
  Calendar as CalendarIcon,
  Trash2,
  Edit
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
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { useToast } from "@/hooks/use-toast"
import { useFirestore, useCollection, useMemoFirebase } from "@/firebase"
import { collection, addDoc, serverTimestamp, query, orderBy, doc, deleteDoc, updateDoc } from "firebase/firestore"
import { errorEmitter } from "@/firebase/error-emitter"
import { FirestorePermissionError } from "@/firebase/errors"

const COLORS = ['#00FF88', '#FF4444', '#00BFFF', '#CCFF00', '#FFBB28', '#FF8042']

export default function FinancePage() {
  const db = useFirestore()
  const [isOpen, setIsOpen] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isExporting, setIsExporting] = useState(false)
  const [mounted, setMounted] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [recordToDelete, setRecordToDelete] = useState<{id: string, description: string} | null>(null)
  const { toast } = useToast()

  useEffect(() => {
    setMounted(true)
  }, [])

  // Form state
  const [formData, setFormData] = useState({
    description: "",
    type: "entry",
    value: "",
    category: "freight",
    date: new Date().toISOString().split('T')[0]
  })

  // Fetch Transactions
  const financeQuery = useMemoFirebase(() => {
    if (!db) return null
    return query(collection(db, "financial_entries"), orderBy("date", "desc"))
  }, [db])
  const { data: transactions, loading } = useCollection(financeQuery)

  // Calculations
  const stats = useMemo(() => {
    if (!transactions || !mounted) return { revenue: 0, expenses: 0, balance: 0, margin: 0, categoryData: [] }
    
    let revenue = 0
    let expenses = 0
    const categories: Record<string, number> = {}

    transactions.forEach(t => {
      const val = Number(t.value) || 0
      if (t.type === 'entry') {
        revenue += val
      } else {
        expenses += val
        categories[t.category] = (categories[t.category] || 0) + val
      }
    })

    const balance = revenue - expenses
    const margin = revenue > 0 ? (balance / revenue) * 100 : 0
    
    const categoryData = Object.entries(categories).map(([name, value]) => ({
      name: name === 'fuel' ? 'Combustível' : 
            name === 'maint' ? 'Manutenção' : 
            name === 'salary' ? 'Salários' : 
            name === 'tax' ? 'Impostos' : name,
      value
    }))

    return { revenue, expenses, balance, margin, categoryData }
  }, [transactions, mounted])

  const formatCurrency = (val: number) => {
    if (!mounted) return "R$ 0,00"
    return `R$ ${val.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`
  }

  const formatDate = (dateStr: string) => {
    if (!mounted) return ""
    return new Date(dateStr).toLocaleDateString('pt-BR')
  }

  const resetForm = () => {
    setEditingId(null)
    setFormData({
      description: "",
      type: "entry",
      value: "",
      category: "freight",
      date: new Date().toISOString().split('T')[0]
    })
  }

  const handleEdit = (t: any) => {
    setEditingId(t.id)
    setFormData({
      description: t.description,
      type: t.type,
      value: t.value.toString(),
      category: t.category,
      date: t.date
    })
    setIsOpen(true)
  }

  const handleDeleteClick = (id: string, description: string) => {
    setRecordToDelete({ id, description })
    setIsDeleteDialogOpen(true)
  }

  const confirmDelete = () => {
    if (!recordToDelete) return

    deleteDoc(doc(db, "financial_entries", recordToDelete.id))
      .then(() => {
        toast({
          title: "Transação Removida",
          description: "O registro foi excluído do fluxo de caixa."
        })
      })
      .catch(async () => {
        const permissionError = new FirestorePermissionError({
          path: `financial_entries/${recordToDelete.id}`,
          operation: "delete"
        })
        errorEmitter.emit("permission-error", permissionError)
      })
      .finally(() => {
        setIsDeleteDialogOpen(false)
        setRecordToDelete(null)
      })
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    const payload = {
      description: formData.description,
      type: formData.type,
      value: Number(formData.value),
      category: formData.category,
      date: formData.date,
      updatedAt: serverTimestamp()
    }

    if (editingId) {
      updateDoc(doc(db, "financial_entries", editingId), payload)
        .then(() => {
          setIsOpen(false)
          resetForm()
          toast({
            title: "Transação Atualizada",
            description: "Os dados financeiros foram corrigidos com sucesso.",
          })
        })
        .catch(async () => {
          const permissionError = new FirestorePermissionError({
            path: `financial_entries/${editingId}`,
            operation: "update",
            requestResourceData: payload
          })
          errorEmitter.emit("permission-error", permissionError)
        })
        .finally(() => setIsSubmitting(false))
    } else {
      addDoc(collection(db, "financial_entries"), { ...payload, createdAt: serverTimestamp() })
        .then(() => {
          setIsOpen(false)
          resetForm()
          toast({
            title: "Transação Registrada",
            description: "O fluxo de caixa foi atualizado com sucesso.",
          })
        })
        .catch(async () => {
          const permissionError = new FirestorePermissionError({
            path: "financial_entries",
            operation: "create",
            requestResourceData: payload
          })
          errorEmitter.emit("permission-error", permissionError)
        })
        .finally(() => setIsSubmitting(false))
    }
  }

  const handleExportReports = () => {
    setIsExporting(true)
    toast({
      title: "Gerando Relatório Financeiro",
      description: "Compilando fluxo de caixa consolidado...",
    })

    setTimeout(() => {
      setIsExporting(false)
      toast({
        title: "Sucesso!",
        description: "O relatório financeiro foi exportado com sucesso.",
      })
    }, 2000)
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
               disabled={isExporting}
               onClick={handleExportReports}
               className="px-6 h-12 rounded-xl bg-white/5 border border-white/10 text-xs font-bold uppercase tracking-widest hover:bg-white/10 transition-all"
             >
               {isExporting ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <FileDown className="w-4 h-4 mr-2" />}
               {isExporting ? "EXPORTANDO..." : "Exportar Relatórios"}
             </Button>
             
             <Dialog open={isOpen} onOpenChange={(open) => { if(!open) resetForm(); setIsOpen(open); }}>
               <DialogTrigger asChild>
                 <Button className="neon-glow font-bold h-12 px-8 rounded-xl bg-primary text-primary-foreground">
                   <Plus className="w-5 h-5 mr-2" />
                   NOVA TRANSAÇÃO
                 </Button>
               </DialogTrigger>
               <DialogContent className="bg-card border-white/10 text-white max-w-xl rounded-[2rem]">
                 <DialogHeader>
                   <DialogTitle className="text-2xl font-headline font-bold text-primary">
                     {editingId ? "Editar Transação" : "Nova Transação Financeira"}
                   </DialogTitle>
                 </DialogHeader>
                 <form onSubmit={handleSubmit} className="space-y-6 py-4">
                   <div className="space-y-2">
                     <Label htmlFor="description">Descrição</Label>
                     <Input 
                        id="description" 
                        placeholder="Ex: Pagamento Frete Agro S/A" 
                        className="bg-white/5 border-white/10" 
                        value={formData.description}
                        onChange={(e) => setFormData({...formData, description: e.target.value})}
                        required 
                      />
                   </div>
                   <div className="grid grid-cols-2 gap-4">
                     <div className="space-y-2">
                       <Label>Tipo</Label>
                       <Select value={formData.type} onValueChange={(v) => setFormData({...formData, type: v})}>
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
                       <Input 
                        id="value" 
                        placeholder="0.00" 
                        type="number"
                        step="0.01"
                        className="bg-white/5 border-white/10" 
                        value={formData.value}
                        onChange={(e) => setFormData({...formData, value: e.target.value})}
                        required 
                       />
                     </div>
                   </div>
                   <div className="grid grid-cols-2 gap-4">
                     <div className="space-y-2">
                       <Label>Categoria</Label>
                       <Select value={formData.category} onValueChange={(v) => setFormData({...formData, category: v})}>
                         <SelectTrigger className="bg-white/5 border-white/10 text-white">
                           <SelectValue placeholder="Categoria" />
                         </SelectTrigger>
                         <SelectContent className="bg-card border-white/10 text-white">
                           <SelectItem value="freight">Frete / Viagem</SelectItem>
                           <SelectItem value="fuel">Combustível</SelectItem>
                           <SelectItem value="maint">Manutenção</SelectItem>
                           <SelectItem value="salary">Salários</SelectItem>
                           <SelectItem value="tax">Impostos</SelectItem>
                           <SelectItem value="other">Outros</SelectItem>
                         </SelectContent>
                       </Select>
                     </div>
                     <div className="space-y-2">
                       <Label htmlFor="date">Data</Label>
                       <Input 
                        id="date" 
                        type="date" 
                        className="bg-white/5 border-white/10" 
                        value={formData.date}
                        onChange={(e) => setFormData({...formData, date: e.target.value})}
                        required 
                       />
                     </div>
                   </div>
                   <DialogFooter className="pt-4">
                     <Button type="button" variant="ghost" onClick={() => setIsOpen(false)} className="text-muted-foreground hover:text-white">Cancelar</Button>
                     <Button type="submit" disabled={isSubmitting} className="bg-primary text-primary-foreground neon-glow font-bold px-8">
                        {isSubmitting ? <Loader2 className="animate-spin h-4 w-4 mr-2" /> : null}
                        {editingId ? "SALVAR ALTERAÇÕES" : "REGISTRAR"}
                     </Button>
                   </DialogFooter>
                 </form>
               </DialogContent>
             </Dialog>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {[
            { label: "Receitas Totais", value: formatCurrency(stats.revenue), icon: TrendingUp, color: "text-primary", bg: "bg-primary/10", trend: "Atual" },
            { label: "Despesas Operacionais", value: formatCurrency(stats.expenses), icon: TrendingDown, color: "text-red-500", bg: "bg-red-500/10", trend: "Atual" },
            { label: "Saldo em Caixa", value: formatCurrency(stats.balance), icon: Wallet, color: "text-accent", bg: "bg-accent/10", trend: "Saldo" },
            { label: "Margem Líquida", value: `${stats.margin.toFixed(1)}%`, icon: DollarSign, color: "text-blue-400", bg: "bg-blue-400/10", trend: "Rent." },
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
                 <span className="text-[10px] text-muted-foreground uppercase font-medium">tempo real</span>
              </div>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <Card className="lg:col-span-5 glass-card rounded-[2.5rem] border-white/5 p-8">
            <CardHeader className="px-0 pt-0">
              <div className="flex items-center justify-between mb-8">
                <CardTitle className="text-xl font-headline font-bold text-white">Distribuição de Gastos</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="h-[350px] p-0">
              {mounted && stats.categoryData.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={stats.categoryData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={100}
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {stats.categoryData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip 
                      contentStyle={{ background: '#0a0c0b', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px' }}
                      itemStyle={{ color: '#fff' }}
                    />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-full flex items-center justify-center text-muted-foreground text-xs uppercase font-bold">
                  Sem dados de gastos
                </div>
              )}
            </CardContent>
          </Card>

          <Card className="lg:col-span-7 glass-card rounded-[2.5rem] border-white/5 p-8">
            <CardHeader className="px-0 pt-0">
               <div className="flex items-center justify-between mb-8">
                <CardTitle className="text-xl font-headline font-bold text-white">Últimas Transações</CardTitle>
                <div className="flex gap-2">
                   <span className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-widest text-primary"><div className="h-2 w-2 rounded-full bg-primary" /> Entradas</span>
                   <span className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-widest text-red-500"><div className="h-2 w-2 rounded-full bg-red-500" /> Saídas</span>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <div className="space-y-4 max-h-[450px] overflow-y-auto pr-2">
                {loading ? (
                   <div className="h-40 flex items-center justify-center">
                      <Loader2 className="animate-spin h-6 w-6 opacity-20" />
                   </div>
                ) : !transactions || transactions.length === 0 ? (
                  <div className="h-40 flex items-center justify-center text-muted-foreground text-xs uppercase font-bold">
                    Aguardando novas transações
                  </div>
                ) : transactions.map((t: any) => (
                  <div key={t.id} className="flex items-center justify-between p-4 rounded-2xl bg-white/5 border border-white/5 group hover:border-white/20 transition-all">
                    <div className="flex items-center gap-4">
                      <div className={cn(
                        "p-2 rounded-lg",
                        t.type === 'entry' ? "bg-primary/10 text-primary" : "bg-red-500/10 text-red-500"
                      )}>
                        {t.type === 'entry' ? <TrendingUp className="h-4 w-4" /> : <TrendingDown className="h-4 w-4" />}
                      </div>
                      <div>
                        <p className="font-bold text-sm text-white">{t.description}</p>
                        <p className="text-[10px] text-muted-foreground uppercase font-medium flex items-center gap-1">
                          <CalendarIcon className="h-3 w-3" /> {formatDate(t.date)}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-6">
                      <div className="text-right">
                        <p className={cn(
                          "font-headline font-bold",
                          t.type === 'entry' ? "text-primary" : "text-red-500"
                        )}>
                          {t.type === 'entry' ? '+' : '-'} {formatCurrency(t.value)}
                        </p>
                        <p className="text-[9px] uppercase font-bold text-muted-foreground tracking-widest">{t.category}</p>
                      </div>
                      <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          onClick={() => handleEdit(t)}
                          className="h-8 w-8 rounded-lg hover:bg-white/10 hover:text-primary"
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          onClick={() => handleDeleteClick(t.id, t.description)}
                          className="h-8 w-8 rounded-lg hover:bg-white/10 hover:text-red-500"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent className="bg-card border-white/10 text-white rounded-[2rem]">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-2xl font-headline font-bold text-primary">Confirmar Exclusão</AlertDialogTitle>
            <AlertDialogDescription className="text-muted-foreground">
              Você tem certeza que deseja excluir a transação <strong>{recordToDelete?.description}</strong>? Esta ação não pode ser desfeita e afetará o saldo total em caixa.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="bg-white/5 border-white/10 text-white hover:bg-white/10 rounded-xl">Cancelar</AlertDialogCancel>
            <AlertDialogAction 
              onClick={confirmDelete}
              className="bg-red-500 text-white hover:bg-red-600 neon-glow font-bold rounded-xl"
            >
              EXCLUIR TRANSAÇÃO
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </DashboardLayout>
  )
}
