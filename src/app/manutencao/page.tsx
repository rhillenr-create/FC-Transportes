
"use client"

import { useState, useEffect, useMemo } from "react"
import { DashboardLayout } from "@/components/layout/DashboardLayout"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { 
  Wrench, 
  Plus, 
  AlertTriangle, 
  CheckCircle2, 
  Clock,
  Settings2,
  Calendar,
  Loader2,
  Trash2,
  Edit,
  DollarSign
} from "lucide-react"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { cn } from "@/lib/utils"
import { useFirestore, useCollection, useMemoFirebase } from "@/firebase"
import { collection, query, orderBy, addDoc, serverTimestamp, deleteDoc, doc, updateDoc } from "firebase/firestore"
import { useToast } from "@/hooks/use-toast"
import { errorEmitter } from "@/firebase/error-emitter"
import { FirestorePermissionError } from "@/firebase/errors"

export default function MaintenancePage() {
  const db = useFirestore()
  const { toast } = useToast()
  const [isOpen, setIsOpen] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [mounted, setMounted] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)

  useEffect(() => {
    setMounted(true)
  }, [])

  // Form state
  const [formData, setFormData] = useState({
    truckId: "",
    type: "preventive",
    date: new Date().toISOString().split('T')[0],
    service: "",
    observations: "",
    cost: "0",
    status: "scheduled"
  })

  // Fetch Trucks for selection
  const trucksQuery = useMemoFirebase(() => {
    return query(collection(db, "trucks"), orderBy("plate", "asc"))
  }, [db])
  const { data: trucks, loading: loadingTrucks } = useCollection(trucksQuery)

  // Fetch Maintenance History
  const maintenanceQuery = useMemoFirebase(() => {
    return query(collection(db, "maintenance_entries"), orderBy("date", "desc"))
  }, [db])
  const { data: maintenanceRecords, loading: loadingRecords } = useCollection(maintenanceQuery)

  // Stats calculation
  const stats = useMemo(() => {
    if (!maintenanceRecords) return { urgent: 0, scheduled: 0, completed: 0, totalCost: 0 }
    
    return maintenanceRecords.reduce((acc, curr: any) => {
      if (curr.type === 'corrective' && curr.status === 'scheduled') acc.urgent++
      if (curr.status === 'scheduled') acc.scheduled++
      if (curr.status === 'completed') acc.completed++
      
      // Somamos o custo de todos os registros (estimado ou real)
      acc.totalCost += Number(curr.cost || 0)
      
      return acc
    }, { urgent: 0, scheduled: 0, completed: 0, totalCost: 0 })
  }, [maintenanceRecords])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.truckId) {
      toast({ variant: "destructive", title: "Erro", description: "Selecione um veículo." })
      return
    }

    setIsSubmitting(true)

    const payload = {
      ...formData,
      cost: Number(formData.cost),
      updatedAt: serverTimestamp()
    }

    if (editingId) {
      // UPDATE
      updateDoc(doc(db, "maintenance_entries", editingId), payload)
        .then(() => {
          setIsOpen(false)
          resetForm()
          toast({ title: "Registro Atualizado", description: "As alterações foram salvas com sucesso." })
        })
        .catch(async () => {
          const permissionError = new FirestorePermissionError({
            path: `maintenance_entries/${editingId}`,
            operation: "update",
            requestResourceData: payload
          })
          errorEmitter.emit("permission-error", permissionError)
        })
        .finally(() => setIsSubmitting(false))
    } else {
      // CREATE
      addDoc(collection(db, "maintenance_entries"), { ...payload, createdAt: serverTimestamp() })
        .then(() => {
          setIsOpen(false)
          resetForm()
          toast({ title: "Manutenção Agendada", description: "O serviço foi registrado no cronograma operacional." })
        })
        .catch(async () => {
          const permissionError = new FirestorePermissionError({
            path: "maintenance_entries",
            operation: "create",
            requestResourceData: payload
          })
          errorEmitter.emit("permission-error", permissionError)
        })
        .finally(() => setIsSubmitting(false))
    }
  }

  const resetForm = () => {
    setEditingId(null)
    setFormData({
      truckId: "",
      type: "preventive",
      date: new Date().toISOString().split('T')[0],
      service: "",
      observations: "",
      cost: "0",
      status: "scheduled"
    })
  }

  const handleEdit = (record: any) => {
    setEditingId(record.id)
    setFormData({
      truckId: record.truckId,
      type: record.type,
      date: record.date,
      service: record.service,
      observations: record.observations || "",
      cost: record.cost.toString(),
      status: record.status
    })
    setIsOpen(true)
  }

  const handleDeleteMaintenance = (id: string) => {
    deleteDoc(doc(db, "maintenance_entries", id))
      .then(() => {
        toast({ title: "Registro Removido", description: "A manutenção foi excluída do histórico." })
      })
      .catch(async () => {
        const permissionError = new FirestorePermissionError({
          path: `maintenance_entries/${id}`,
          operation: "delete"
        })
        errorEmitter.emit("permission-error", permissionError)
      })
  }

  const handleToggleStatus = (id: string, currentStatus: string) => {
    const newStatus = currentStatus === 'scheduled' ? 'completed' : 'scheduled'
    updateDoc(doc(db, "maintenance_entries", id), { status: newStatus })
      .then(() => {
        toast({ title: "Status Atualizado", description: `Manutenção marcada como ${newStatus === 'completed' ? 'concluída' : 'agendada'}.` })
      })
      .catch(async () => {
        const permissionError = new FirestorePermissionError({
          path: `maintenance_entries/${id}`,
          operation: "update"
        })
        errorEmitter.emit("permission-error", permissionError)
      })
  }

  const formatCurrency = (val: number) => {
    if (!mounted) return "R$ 0,00"
    return `R$ ${val.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`
  }

  const getTypeLabel = (type: string) => {
    switch (type) {
      case 'preventive': return 'Preventiva'
      case 'corrective': return 'Corretiva'
      case 'predictive': return 'Preditiva'
      default: return type
    }
  }

  return (
    <DashboardLayout>
      <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <h2 className="text-4xl font-headline font-bold text-white tracking-tight">Plano de Manutenção</h2>
            <p className="text-muted-foreground text-sm uppercase tracking-widest font-medium">Gerencie revisões preventivas e reparos emergenciais da frota</p>
          </div>
          
          <Dialog open={isOpen} onOpenChange={(open) => { if(!open) resetForm(); setIsOpen(open); }}>
            <DialogTrigger asChild>
              <Button className="neon-glow font-bold h-12 px-8 rounded-xl bg-primary text-primary-foreground">
                <Plus className="w-5 h-5 mr-2" />
                AGENDAR MANUTENÇÃO
              </Button>
            </DialogTrigger>
            <DialogContent className="bg-card border-white/10 text-white max-w-xl rounded-[2rem]">
              <DialogHeader>
                <DialogTitle className="text-2xl font-headline font-bold text-primary">
                  {editingId ? "Editar Registro de Manutenção" : "Novo Agendamento de Manutenção"}
                </DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-6 py-4">
                <div className="space-y-2">
                  <Label>Veículo</Label>
                  <Select value={formData.truckId} onValueChange={(v) => setFormData({...formData, truckId: v})}>
                    <SelectTrigger className="bg-white/5 border-white/10 text-white">
                      <SelectValue placeholder={loadingTrucks ? "Carregando..." : "Selecione o caminhão"} />
                    </SelectTrigger>
                    <SelectContent className="bg-card border-white/10 text-white">
                      {trucks?.map(truck => (
                        <SelectItem key={truck.id} value={truck.plate}>{truck.plate} - {truck.model}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Tipo de Manutenção</Label>
                    <Select value={formData.type} onValueChange={(v) => setFormData({...formData, type: v})}>
                      <SelectTrigger className="bg-white/5 border-white/10 text-white">
                        <SelectValue placeholder="Tipo" />
                      </SelectTrigger>
                      <SelectContent className="bg-card border-white/10 text-white">
                        <SelectItem value="preventive">Preventiva</SelectItem>
                        <SelectItem value="corrective">Corretiva</SelectItem>
                        <SelectItem value="predictive">Preditiva</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="date">Data Prevista</Label>
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
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="service">Serviço</Label>
                    <Input 
                      id="service" 
                      placeholder="Ex: Troca de óleo" 
                      className="bg-white/5 border-white/10" 
                      value={formData.service}
                      onChange={(e) => setFormData({...formData, service: e.target.value})}
                      required 
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="cost" className="flex items-center gap-2">
                      <DollarSign className="h-3 w-3 text-primary" />
                      Custo (R$)
                    </Label>
                    <Input 
                      id="cost" 
                      type="number" 
                      step="0.01"
                      placeholder="0.00" 
                      className="bg-white/5 border-white/10 border-primary/20" 
                      value={formData.cost}
                      onChange={(e) => setFormData({...formData, cost: e.target.value})}
                      required
                    />
                    <p className="text-[10px] text-muted-foreground">Informe o valor estimado ou real do serviço.</p>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="obs">Observações Adicionais</Label>
                  <Textarea 
                    id="obs" 
                    placeholder="Detalhes técnicos..." 
                    className="bg-white/5 border-white/10 min-h-[100px]" 
                    value={formData.observations}
                    onChange={(e) => setFormData({...formData, observations: e.target.value})}
                  />
                </div>
                <DialogFooter className="pt-4">
                  <Button type="button" variant="ghost" onClick={() => setIsOpen(false)} className="text-muted-foreground hover:text-white">Cancelar</Button>
                  <Button type="submit" disabled={isSubmitting} className="bg-primary text-primary-foreground neon-glow font-bold px-8">
                    {isSubmitting ? <Loader2 className="animate-spin h-4 w-4 mr-2" /> : editingId ? "SALVAR ALTERAÇÕES" : "AGENDAR SERVIÇO"}
                  </Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card className="glass-card rounded-[2rem] p-8 group hover:neon-border transition-all">
            <CardContent className="p-0">
              <div className="flex flex-col gap-4">
                <div className="p-3 w-fit rounded-xl bg-red-500/20 text-red-500 group-hover:scale-110 transition-transform">
                  <AlertTriangle className="h-6 w-6" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground uppercase font-bold tracking-widest">Urgentes (Corretivas)</p>
                  <p className="text-3xl font-headline font-bold">{stats.urgent}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="glass-card rounded-[2rem] p-8 group hover:neon-border transition-all">
            <CardContent className="p-0">
              <div className="flex flex-col gap-4">
                <div className="p-3 w-fit rounded-xl bg-primary/20 text-primary group-hover:scale-110 transition-transform">
                  <Clock className="h-6 w-6" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground uppercase font-bold tracking-widest">Agendadas</p>
                  <p className="text-3xl font-headline font-bold">{stats.scheduled}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="glass-card rounded-[2rem] p-8 group hover:neon-border transition-all">
            <CardContent className="p-0">
              <div className="flex flex-col gap-4">
                <div className="p-3 w-fit rounded-xl bg-accent/20 text-accent group-hover:scale-110 transition-transform">
                  <CheckCircle2 className="h-6 w-6" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground uppercase font-bold tracking-widest">Concluídas</p>
                  <p className="text-3xl font-headline font-bold">{stats.completed}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="glass-card rounded-[2rem] p-8 group hover:neon-border transition-all">
            <CardContent className="p-0">
              <div className="flex flex-col gap-4">
                <div className="p-3 w-fit rounded-xl bg-blue-500/20 text-blue-500 group-hover:scale-110 transition-transform">
                  <Wrench className="h-6 w-6" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground uppercase font-bold tracking-widest">Investimento Acumulado</p>
                  <p className="text-3xl font-headline font-bold text-primary">{formatCurrency(stats.totalCost)}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="glass-card rounded-[2.5rem] overflow-hidden border-white/5">
          <div className="p-8 border-b border-white/5">
            <h3 className="font-bold flex items-center gap-3 text-lg text-white">
              <Settings2 className="h-5 w-5 text-primary" />
              Cronograma e Histórico de Serviços
            </h3>
          </div>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader className="bg-white/5">
                <TableRow className="border-white/5 hover:bg-transparent h-16">
                  <TableHead className="text-[10px] uppercase font-bold text-muted-foreground pl-8">Caminhão</TableHead>
                  <TableHead className="text-[10px] uppercase font-bold text-muted-foreground">Tipo</TableHead>
                  <TableHead className="text-[10px] uppercase font-bold text-muted-foreground">Serviço</TableHead>
                  <TableHead className="text-[10px] uppercase font-bold text-muted-foreground">Status</TableHead>
                  <TableHead className="text-[10px] uppercase font-bold text-muted-foreground">Data</TableHead>
                  <TableHead className="text-right text-[10px] uppercase font-bold text-muted-foreground pr-8">Custo</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loadingRecords ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-12 text-muted-foreground">
                      <Loader2 className="animate-spin h-8 w-8 mx-auto mb-2 opacity-20" />
                      Carregando histórico...
                    </TableCell>
                  </TableRow>
                ) : !maintenanceRecords || maintenanceRecords.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-12 text-muted-foreground font-bold uppercase tracking-widest italic">Nenhum registro de manutenção.</TableCell>
                  </TableRow>
                ) : maintenanceRecords.map((record: any) => (
                  <TableRow key={record.id} className="border-white/5 table-row-hover h-20">
                    <TableCell className="font-bold text-primary text-base pl-8">{record.truckId}</TableCell>
                    <TableCell>
                      <span className={cn(
                        "px-3 py-1 rounded-full text-[9px] font-bold uppercase tracking-widest border",
                        record.type === 'corrective' ? "bg-red-500/10 text-red-500 border-red-500/20" : 
                        record.type === 'preventive' ? "bg-primary/10 text-primary border-primary/20" : 
                        "bg-blue-500/10 text-blue-500 border-blue-500/20"
                      )}>
                        {getTypeLabel(record.type)}
                      </span>
                    </TableCell>
                    <TableCell className="font-medium text-white/90">{record.service}</TableCell>
                    <TableCell>
                       <button 
                         onClick={() => handleToggleStatus(record.id, record.status)}
                         className={cn(
                          "flex items-center gap-2 px-3 py-1 rounded-full text-[9px] font-bold uppercase tracking-widest transition-all",
                          record.status === 'completed' ? "bg-accent/20 text-accent" : "bg-white/5 text-muted-foreground hover:bg-white/10"
                        )}
                       >
                         {record.status === 'completed' ? <CheckCircle2 className="h-3 w-3" /> : <Clock className="h-3 w-3" />}
                         {record.status === 'completed' ? 'CONCLUÍDO' : 'AGENDADO'}
                       </button>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2 text-muted-foreground text-xs">
                        <Calendar className="h-3.5 w-3.5" />
                        {mounted ? new Date(record.date).toLocaleDateString('pt-BR') : record.date}
                      </div>
                    </TableCell>
                    <TableCell className="text-right pr-8">
                       <div className="flex items-center justify-end gap-3">
                          <p className="font-headline font-bold text-white mr-2">{formatCurrency(Number(record.cost || 0))}</p>
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            onClick={() => handleEdit(record)}
                            className="h-8 w-8 rounded-lg hover:bg-white/10 hover:text-primary"
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            onClick={() => handleDeleteMaintenance(record.id)}
                            className="h-8 w-8 rounded-lg hover:bg-white/10 hover:text-red-500"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                       </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}
