"use client"

import { useState } from "react"
import { DashboardLayout } from "@/components/layout/DashboardLayout"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { 
  Plus, 
  Search, 
  Trash2, 
  Truck as TruckIcon,
  Loader2
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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { cn } from "@/lib/utils"
import { useFirestore, useCollection, useMemoFirebase } from "@/firebase"
import { collection, addDoc, serverTimestamp, deleteDoc, doc, query, orderBy } from "firebase/firestore"
import { errorEmitter } from "@/firebase/error-emitter"
import { FirestorePermissionError } from "@/firebase/errors"
import { useToast } from "@/hooks/use-toast"

export default function FleetPage() {
  const db = useFirestore()
  const { toast } = useToast()
  const [isOpen, setIsOpen] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [truckToDelete, setTruckToDelete] = useState<{id: string, plate: string} | null>(null)

  // Estados do formulário
  const [formData, setFormData] = useState({
    plate: "",
    model: "",
    year: new Date().getFullYear(),
    km: 0,
    avg: 3.5,
    type: "heavy"
  })

  // Consulta real ao Firestore
  const trucksQuery = useMemoFirebase(() => {
    return query(collection(db, "trucks"), orderBy("createdAt", "desc"))
  }, [db])

  const { data: trucks, loading } = useCollection(trucksQuery)

  const handleAddTruck = (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    const truckData = {
      ...formData,
      status: "Disponível",
      createdAt: serverTimestamp()
    }

    addDoc(collection(db, "trucks"), truckData)
      .then(() => {
        setIsOpen(false)
        setFormData({
          plate: "",
          model: "",
          year: new Date().getFullYear(),
          km: 0,
          avg: 3.5,
          type: "heavy"
        })
        toast({
          title: "Veículo Cadastrado",
          description: `O veículo ${formData.plate} foi salvo no banco de dados.`
        })
      })
      .catch(async (error) => {
        const permissionError = new FirestorePermissionError({
          path: "trucks",
          operation: "create",
          requestResourceData: truckData
        })
        errorEmitter.emit("permission-error", permissionError)
      })
      .finally(() => setIsSubmitting(false))
  }

  const handleDeleteClick = (id: string, plate: string) => {
    setTruckToDelete({ id, plate })
    setIsDeleteDialogOpen(true)
  }

  const confirmDelete = () => {
    if (!truckToDelete) return

    deleteDoc(doc(db, "trucks", truckToDelete.id))
      .then(() => {
        toast({
          title: "Veículo Removido",
          description: `O veículo ${truckToDelete.plate} foi excluído do sistema.`
        })
      })
      .catch(async () => {
        const permissionError = new FirestorePermissionError({
          path: `trucks/${truckToDelete.id}`,
          operation: "delete"
        })
        errorEmitter.emit("permission-error", permissionError)
      })
      .finally(() => {
        setIsDeleteDialogOpen(false)
        setTruckToDelete(null)
      })
  }

  return (
    <DashboardLayout>
      <div className="space-y-8 max-w-[1600px] mx-auto animate-in fade-in slide-in-from-bottom-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-1">
            <h2 className="text-4xl font-headline font-bold text-white tracking-tight">Controle de Frota</h2>
            <p className="text-muted-foreground text-sm uppercase tracking-widest font-medium">Gestão centralizada de ativos logísticos (Real-time)</p>
          </div>
          
          <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
              <Button className="neon-glow font-bold h-12 px-8 rounded-xl bg-primary text-primary-foreground hover:scale-105 transition-all">
                <Plus className="w-5 h-5 mr-2" />
                CADASTRAR VEÍCULO
              </Button>
            </DialogTrigger>
            <DialogContent className="bg-card border-white/10 text-white max-w-2xl rounded-[2rem]">
              <DialogHeader>
                <DialogTitle className="text-2xl font-headline font-bold text-primary">Novo Cadastro de Veículo</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleAddTruck} className="space-y-6 py-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="plate">Placa</Label>
                    <Input 
                      id="plate" 
                      placeholder="AAA-0000" 
                      className="bg-white/5 border-white/10 uppercase" 
                      value={formData.plate}
                      onChange={(e) => setFormData({...formData, plate: e.target.value})}
                      required 
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="model">Modelo / Fabricante</Label>
                    <Input 
                      id="model" 
                      placeholder="Ex: Volvo FH 540" 
                      className="bg-white/5 border-white/10" 
                      value={formData.model}
                      onChange={(e) => setFormData({...formData, model: e.target.value})}
                      required 
                    />
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="year">Ano</Label>
                    <Input 
                      id="year" 
                      type="number" 
                      className="bg-white/5 border-white/10" 
                      value={formData.year}
                      onChange={(e) => setFormData({...formData, year: parseInt(e.target.value)})}
                      required 
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="km">Quilometragem Inicial</Label>
                    <Input 
                      id="km" 
                      type="number" 
                      className="bg-white/5 border-white/10" 
                      value={formData.km}
                      onChange={(e) => setFormData({...formData, km: parseInt(e.target.value)})}
                      required 
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="avg">Média Esperada (KM/L)</Label>
                    <Input 
                      id="avg" 
                      type="number"
                      step="0.1"
                      className="bg-white/5 border-white/10" 
                      value={formData.avg}
                      onChange={(e) => setFormData({...formData, avg: parseFloat(e.target.value)})}
                      required 
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Tipo de Veículo</Label>
                  <Select value={formData.type} onValueChange={(v) => setFormData({...formData, type: v})}>
                    <SelectTrigger className="bg-white/5 border-white/10 text-white">
                      <SelectValue placeholder="Selecione o tipo" />
                    </SelectTrigger>
                    <SelectContent className="bg-card border-white/10 text-white">
                      <SelectItem value="heavy">Caminhão Pesado (6x4)</SelectItem>
                      <SelectItem value="medium">Caminhão Médio (4x2)</SelectItem>
                      <SelectItem value="vlc">Veículo Leve de Carga (VLC)</SelectItem>
                      <SelectItem value="bitrem">Bitrem / Rodotrem</SelectItem>
                      <SelectItem value="trailer">Carreta Graneleira</SelectItem>
                      <SelectItem value="carreta_bau">Carreta Baú</SelectItem>
                      <SelectItem value="carreta_sider">Carreta Sider</SelectItem>
                      <SelectItem value="basculante">Caminhão Basculante</SelectItem>
                      <SelectItem value="frigorifico">Carreta Frigorífica</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <DialogFooter className="pt-4">
                  <Button type="button" variant="ghost" onClick={() => setIsOpen(false)} className="text-muted-foreground hover:text-white">Cancelar</Button>
                  <Button type="submit" disabled={isSubmitting} className="bg-primary text-primary-foreground neon-glow font-bold px-8">
                    {isSubmitting ? <Loader2 className="animate-spin h-4 w-4 mr-2" /> : null}
                    CONCLUIR CADASTRO
                  </Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            { label: "Total da Frota", value: loading ? "..." : trucks?.length || 0, icon: TruckIcon, color: "text-primary", bg: "bg-primary/10" },
            { label: "Veículos Ativos", value: trucks?.filter(t => t.status === 'Em Viagem').length || 0, icon: TruckIcon, color: "text-accent", bg: "bg-accent/10" },
            { label: "Disponíveis", value: trucks?.filter(t => t.status === 'Disponível').length || 0, icon: TruckIcon, color: "text-blue-500", bg: "bg-blue-500/10" },
          ].map((stat, i) => (
            <div key={i} className="glass-card rounded-[2rem] p-8 flex items-center gap-6 group hover:neon-border transition-all">
              <div className={cn("p-5 rounded-2xl group-hover:scale-110 transition-transform", stat.bg, stat.color)}>
                <stat.icon className="h-8 w-8" />
              </div>
              <div className="space-y-1">
                <p className="text-xs text-muted-foreground uppercase font-bold tracking-widest">{stat.label}</p>
                <div className="flex items-baseline gap-2">
                  <p className="text-3xl font-headline font-bold">{stat.value}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="glass-card rounded-[2.5rem] overflow-hidden border-white/5">
          <div className="p-8 border-b border-white/5 flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="relative w-full max-w-md">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <input placeholder="Buscar no banco de dados..." className="pl-12 h-12 w-full bg-white/5 border border-white/10 rounded-xl focus:outline-none focus:ring-1 focus:ring-primary/40 text-white" />
            </div>
          </div>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader className="bg-white/5">
                <TableRow className="border-white/5 hover:bg-transparent h-16">
                  <TableHead className="text-[10px] uppercase font-bold text-muted-foreground pl-8">Placa</TableHead>
                  <TableHead className="text-[10px] uppercase font-bold text-muted-foreground">Modelo / Fabricante</TableHead>
                  <TableHead className="text-[10px] uppercase font-bold text-muted-foreground">Ano</TableHead>
                  <TableHead className="text-[10px] uppercase font-bold text-muted-foreground">KM Atual</TableHead>
                  <TableHead className="text-[10px] uppercase font-bold text-muted-foreground">Média (KM/L)</TableHead>
                  <TableHead className="text-[10px] uppercase font-bold text-muted-foreground">Status Operacional</TableHead>
                  <TableHead className="text-right text-[10px] uppercase font-bold text-muted-foreground pr-8">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={7} className="h-32 text-center text-muted-foreground">
                      <Loader2 className="animate-spin h-8 w-8 mx-auto mb-2 opacity-20" />
                      Carregando frota do banco de dados...
                    </TableCell>
                  </TableRow>
                ) : trucks?.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="h-32 text-center text-muted-foreground">
                      Nenhum veículo cadastrado no sistema.
                    </TableCell>
                  </TableRow>
                ) : trucks?.map((truck: any) => (
                  <TableRow key={truck.id} className="border-white/5 table-row-hover h-20">
                    <TableCell className="font-bold text-primary text-base pl-8">{truck.plate}</TableCell>
                    <TableCell className="font-medium text-white/90">{truck.model}</TableCell>
                    <TableCell className="text-muted-foreground">{truck.year}</TableCell>
                    <TableCell className="font-mono text-sm">{truck.km} km</TableCell>
                    <TableCell className="font-bold text-accent">{truck.avg}</TableCell>
                    <TableCell>
                      <span className={cn(
                        "px-4 py-1.5 rounded-full text-[9px] font-bold uppercase tracking-widest",
                        truck.status === "Disponível" ? "bg-primary/10 text-primary border border-primary/20" : 
                        truck.status === "Em Viagem" ? "bg-accent/10 text-accent border border-accent/20" : 
                        "bg-red-500/10 text-red-500 border border-red-500/20"
                      )}>
                        {truck.status}
                      </span>
                    </TableCell>
                    <TableCell className="text-right pr-8">
                      <div className="flex items-center justify-end gap-3">
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          onClick={() => handleDeleteClick(truck.id, truck.plate)}
                          className="h-10 w-10 rounded-xl hover:bg-white/10 hover:text-red-500"
                        >
                          <Trash2 className="h-5 w-5" />
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

      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent className="bg-card border-white/10 text-white rounded-[2rem]">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-2xl font-headline font-bold text-primary">Confirmar Exclusão</AlertDialogTitle>
            <AlertDialogDescription className="text-muted-foreground">
              Você tem certeza que deseja excluir o veículo <strong>{truckToDelete?.plate}</strong>? Esta ação não pode ser desfeita e removerá todos os dados associados a este ativo no banco de dados.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="bg-white/5 border-white/10 text-white hover:bg-white/10 rounded-xl">Cancelar</AlertDialogCancel>
            <AlertDialogAction 
              onClick={confirmDelete}
              className="bg-red-500 text-white hover:bg-red-600 neon-glow font-bold rounded-xl"
            >
              EXCLUIR VEÍCULO
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </DashboardLayout>
  )
}
