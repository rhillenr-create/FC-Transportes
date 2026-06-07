"use client"

import { useState, useEffect } from "react"
import { DashboardLayout } from "@/components/layout/DashboardLayout"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { 
  Plus, 
  Search, 
  Route, 
  MapPin, 
  Calendar,
  MoreVertical,
  CheckCircle2,
  Clock,
  Navigation,
  ArrowRight,
  Trash2,
  CheckCircle,
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
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
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
import { useToast } from "@/hooks/use-toast"
import { PageHeader } from "@/components/app/PageHeader"
import { useFirestore, useCollection, useMemoFirebase, useUser } from "@/firebase"
import { collection, addDoc, serverTimestamp, query, orderBy, deleteDoc, doc, updateDoc } from "firebase/firestore"
import { errorEmitter } from "@/firebase/error-emitter"
import { FirestorePermissionError } from "@/firebase/errors"

export default function TripsPage() {
  const db = useFirestore()
  const { user } = useUser()
  const { toast } = useToast()
  const [isOpen, setIsOpen] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [mounted, setMounted] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [tripToDelete, setTripToDelete] = useState<{id: string, route: string} | null>(null)

  useEffect(() => {
    setMounted(true)
  }, [])
  
  // Form state
  const [formData, setFormData] = useState({
    origin: "",
    destination: "",
    client: "",
    freight: "",
    driver: "",
    truck: ""
  })

  // Fetch Trucks - Gated by user
  const trucksQuery = useMemoFirebase(() => {
    if (!db || !user) return null
    return query(collection(db, "trucks"), orderBy("plate", "asc"))
  }, [db, user])
  const { data: trucks, loading: loadingTrucks } = useCollection(trucksQuery)

  // Fetch Drivers - Gated by user
  const driversQuery = useMemoFirebase(() => {
    if (!db || !user) return null
    return query(collection(db, "drivers"), orderBy("name", "asc"))
  }, [db, user])
  const { data: drivers, loading: loadingDrivers } = useCollection(driversQuery)

  // Fetch Trips - Gated by user
  const tripsQuery = useMemoFirebase(() => {
    if (!db || !user) return null
    return query(collection(db, "trips"), orderBy("createdAt", "desc"))
  }, [db, user])
  const { data: trips, loading } = useCollection(tripsQuery)

  const handleProgramTrip = (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.truck) {
      toast({ variant: "destructive", title: "Erro", description: "Selecione um veículo." })
      return
    }
    if (!formData.driver) {
      toast({ variant: "destructive", title: "Erro", description: "Selecione um motorista." })
      return
    }

    setIsSubmitting(true)

    const tripData = {
      ...formData,
      status: "Pendente",
      progress: 0,
      createdAt: serverTimestamp()
    }

    addDoc(collection(db, "trips"), tripData)
      .then(() => {
        setIsOpen(false)
        setFormData({
          origin: "",
          destination: "",
          client: "",
          freight: "",
          driver: "",
          truck: ""
        })
        toast({
          title: "Viagem Programada",
          description: `Rota de ${formData.origin} para ${formData.destination} salva com sucesso.`,
        })
      })
      .catch(async () => {
        const permissionError = new FirestorePermissionError({
          path: "trips",
          operation: "create",
          requestResourceData: tripData
        })
        errorEmitter.emit("permission-error", permissionError)
      })
      .finally(() => setIsSubmitting(false))
  }

  const handleDeleteClick = (id: string, origin: string, dest: string) => {
    setTripToDelete({ id, route: `${origin} → ${dest}` })
    setIsDeleteDialogOpen(true)
  }

  const confirmDelete = () => {
    if (!tripToDelete) return

    deleteDoc(doc(db, "trips", tripToDelete.id))
      .then(() => {
        toast({
          title: "Viagem Excluída",
          description: "O registro foi removido do sistema.",
        })
      })
      .catch(async () => {
        const permissionError = new FirestorePermissionError({
          path: `trips/${tripToDelete.id}`,
          operation: "delete"
        })
        errorEmitter.emit("permission-error", permissionError)
      })
      .finally(() => {
        setIsDeleteDialogOpen(false)
        setTripToDelete(null)
      })
  }

  const handleFinishTrip = (id: string) => {
    updateDoc(doc(db, "trips", id), {
      status: "Concluída",
      progress: 100
    })
      .then(() => {
        toast({
          title: "Viagem Finalizada",
          description: "O status foi atualizado para Concluída.",
        })
      })
      .catch(async () => {
        const permissionError = new FirestorePermissionError({
          path: `trips/${id}`,
          operation: "update"
        })
        errorEmitter.emit("permission-error", permissionError)
      })
  }

  const handleStartTrip = (id: string) => {
    updateDoc(doc(db, "trips", id), {
      status: "Em Rota",
      progress: 10
    })
      .then(() => {
        toast({
          title: "Viagem Iniciada",
          description: "O motorista iniciou o trajeto.",
        })
      })
      .catch(async () => {
        const permissionError = new FirestorePermissionError({
          path: `trips/${id}`,
          operation: "update"
        })
        errorEmitter.emit("permission-error", permissionError)
      })
  }

  return (
    <DashboardLayout>
      <div className="space-y-8 max-w-[1600px] mx-auto animate-in fade-in slide-in-from-bottom-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <PageHeader
            title="Viagens e Logística"
            description="Controle de fretes e monitoramento de rotas em tempo real"
          />
          
          <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
              <Button className="neon-glow font-bold h-12 px-8 rounded-xl bg-primary text-primary-foreground hover:scale-105 transition-all">
                <Plus className="w-5 h-5 mr-2" />
                PROGRAMAR VIAGEM
              </Button>
            </DialogTrigger>
            <DialogContent className="bg-card border-white/10 text-white max-w-2xl rounded-[2rem]">
              <DialogHeader>
                <DialogTitle className="text-2xl font-headline font-bold text-primary">Nova Programação de Viagem</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleProgramTrip} className="space-y-6 py-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="origin">Origem</Label>
                    <Input 
                      id="origin" 
                      placeholder="Cidade, UF" 
                      className="bg-white/5 border-white/10" 
                      value={formData.origin}
                      onChange={(e) => setFormData({...formData, origin: e.target.value})}
                      required 
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="dest">Destino</Label>
                    <Input 
                      id="dest" 
                      placeholder="Cidade, UF" 
                      className="bg-white/5 border-white/10" 
                      value={formData.destination}
                      onChange={(e) => setFormData({...formData, destination: e.target.value})}
                      required 
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="client">Cliente</Label>
                    <Input 
                      id="client" 
                      placeholder="Nome do Cliente" 
                      className="bg-white/5 border-white/10" 
                      value={formData.client}
                      onChange={(e) => setFormData({...formData, client: e.target.value})}
                      required 
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="freight">Valor do Frete</Label>
                    <Input 
                      id="freight" 
                      placeholder="R$ 15.000,00" 
                      className="bg-white/5 border-white/10" 
                      value={formData.freight}
                      onChange={(e) => setFormData({...formData, freight: e.target.value})}
                      required 
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Motorista</Label>
                    <Select value={formData.driver} onValueChange={(v) => setFormData({...formData, driver: v})}>
                      <SelectTrigger className="bg-white/5 border-white/10 text-white">
                        <SelectValue placeholder={loadingDrivers ? "Carregando..." : "Selecionar Motorista"} />
                      </SelectTrigger>
                      <SelectContent className="bg-card border-white/10 text-white">
                        {drivers?.map(driver => (
                          <SelectItem key={driver.id} value={driver.name}>{driver.name}</SelectItem>
                        ))}
                        {(!loadingDrivers && (!drivers || drivers.length === 0)) && (
                          <SelectItem value="none" disabled>Nenhum motorista cadastrado</SelectItem>
                        )}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Veículo</Label>
                    <Select value={formData.truck} onValueChange={(v) => setFormData({...formData, truck: v})}>
                      <SelectTrigger className="bg-white/5 border-white/10 text-white">
                        <SelectValue placeholder={loadingTrucks ? "Carregando..." : "Selecionar Caminhão"} />
                      </SelectTrigger>
                      <SelectContent className="bg-card border-white/10 text-white">
                        {trucks?.map(truck => (
                          <SelectItem key={truck.id} value={truck.plate}>{truck.plate} - {truck.model}</SelectItem>
                        ))}
                        {(!loadingTrucks && (!trucks || trucks.length === 0)) && (
                          <SelectItem value="none" disabled>Nenhum veículo cadastrado</SelectItem>
                        )}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <DialogFooter className="pt-4">
                  <Button type="button" variant="ghost" onClick={() => setIsOpen(false)} className="text-muted-foreground hover:text-white">Cancelar</Button>
                  <Button type="submit" disabled={isSubmitting} className="bg-primary text-primary-foreground neon-glow font-bold px-8">
                    {isSubmitting ? <Loader2 className="animate-spin h-4 w-4 mr-2" /> : null}
                    SALVAR E PROGRAMAR
                  </Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {[
            { label: "Viagens em Rota", value: trips?.filter(t => t.status === 'Em Rota').length || 0, icon: Navigation, color: "text-primary", bg: "bg-primary/10" },
            { label: "Mês (Concluídas)", value: trips?.filter(t => t.status === 'Concluída').length || 0, icon: CheckCircle2, color: "text-accent", bg: "bg-accent/10" },
            { label: "Aguardando Início", value: trips?.filter(t => t.status === 'Pendente').length || 0, icon: Clock, color: "text-blue-500", bg: "bg-blue-500/10" },
            { label: "Total de Viagens", value: trips?.length || 0, icon: Route, color: "text-emerald-400", bg: "bg-emerald-400/10" },
          ].map((stat, i) => (
            <div key={i} className="glass-card rounded-[2rem] p-8 group hover:neon-border transition-all">
              <div className="flex items-center gap-5">
                <div className={cn("p-4 rounded-2xl group-hover:scale-110 transition-transform", stat.bg, stat.color)}>
                  <stat.icon className="h-7 w-7" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground uppercase font-bold tracking-widest">{stat.label}</p>
                  <p className="text-2xl font-headline font-bold">{stat.value}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="glass-card rounded-[2.5rem] overflow-hidden border-white/5">
          <div className="p-8 border-b border-white/5">
            <div className="relative w-full max-w-lg">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <input placeholder="Buscar por motorista, cliente ou rota..." className="pl-12 h-12 w-full bg-white/5 border border-white/10 rounded-xl focus:outline-none focus:ring-1 focus:ring-primary/40 text-white" />
            </div>
          </div>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader className="bg-white/5">
                <TableRow className="border-white/5 hover:bg-transparent h-16">
                  <TableHead className="text-[10px] uppercase font-bold text-muted-foreground pl-8">Status</TableHead>
                  <TableHead className="text-[10px] uppercase font-bold text-muted-foreground">Logística (Origem x Destino)</TableHead>
                  <TableHead className="text-[10px] uppercase font-bold text-muted-foreground">Progresso</TableHead>
                  <TableHead className="text-[10px] uppercase font-bold text-muted-foreground">Motorista / Ativo</TableHead>
                  <TableHead className="text-[10px] uppercase font-bold text-muted-foreground">Data</TableHead>
                  <TableHead className="text-[10px] uppercase font-bold text-muted-foreground">Frete Total</TableHead>
                  <TableHead className="text-right text-[10px] uppercase font-bold text-muted-foreground pr-8">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={7} className="h-32 text-center text-muted-foreground">
                      <Loader2 className="animate-spin h-8 w-8 mx-auto mb-2 opacity-20" />
                      Carregando logística...
                    </TableCell>
                  </TableRow>
                ) : trips?.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="h-32 text-center text-muted-foreground">
                      Nenhuma viagem programada no momento.
                    </TableCell>
                  </TableRow>
                ) : trips?.map((trip: any) => (
                  <TableRow key={trip.id} className="border-white/5 table-row-hover h-24">
                    <TableCell className="pl-8">
                      <span className={cn(
                        "px-4 py-1.5 rounded-full text-[9px] font-bold uppercase tracking-widest border",
                        trip.status === "Concluída" ? "bg-primary/10 text-primary border-primary/20" : 
                        trip.status === "Em Rota" ? "bg-accent/10 text-accent border-accent/20" : 
                        "bg-blue-500/10 text-blue-500 border-blue-500/20"
                      )}>
                        {trip.status}
                      </span>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-4">
                        <div className="space-y-1">
                          <p className="text-sm font-bold text-white flex items-center gap-2"><MapPin className="h-3 w-3 text-red-500" /> {trip.origin}</p>
                          <p className="text-sm font-bold text-white flex items-center gap-2"><MapPin className="h-3 w-3 text-primary" /> {trip.destination}</p>
                        </div>
                        <ArrowRight className="h-4 w-4 text-muted-foreground opacity-30" />
                        <span className="text-[10px] font-bold text-muted-foreground uppercase">{trip.client}</span>
                      </div>
                    </TableCell>
                    <TableCell className="min-w-[150px]">
                       <div className="space-y-1.5">
                          <div className="flex justify-between text-[10px] font-bold uppercase tracking-tighter">
                             <span className="text-muted-foreground">Evolução</span>
                             <span className="text-primary">{trip.progress}%</span>
                          </div>
                          <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                             <div 
                               className="h-full bg-primary transition-all duration-1000" 
                               style={{ width: `${trip.progress}%` }} 
                             />
                          </div>
                       </div>
                    </TableCell>
                    <TableCell>
                      <div className="space-y-1">
                        <p className="text-sm font-bold text-white">{trip.driver}</p>
                        <p className="text-[10px] text-primary font-bold uppercase tracking-widest">{trip.truck}</p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <Calendar className="h-4 w-4" />
                        <span className="text-xs font-medium tracking-tight">
                          {mounted && trip.createdAt?.toDate ? trip.createdAt.toDate().toLocaleDateString('pt-BR') : 'Recent'}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell className="font-headline font-bold text-lg text-white">{trip.freight}</TableCell>
                    <TableCell className="text-right pr-8">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-10 w-10 rounded-xl hover:bg-white/10 transition-colors">
                            <MoreVertical className="h-5 w-5" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="bg-card border-white/10 text-white w-48 rounded-xl">
                          <DropdownMenuLabel className="text-[10px] uppercase font-bold text-muted-foreground tracking-widest">Opções</DropdownMenuLabel>
                          <DropdownMenuSeparator className="bg-white/5" />
                          <DropdownMenuItem onClick={() => handleStartTrip(trip.id)} className="gap-2 cursor-pointer hover:bg-white/5 focus:bg-white/5">
                            <Navigation className="h-4 w-4 text-primary" /> Iniciar Rota
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleFinishTrip(trip.id)} className="gap-2 cursor-pointer hover:bg-white/5 focus:bg-white/5">
                            <CheckCircle className="h-4 w-4 text-accent" /> Finalizar
                          </DropdownMenuItem>
                          <DropdownMenuSeparator className="bg-white/5" />
                          <DropdownMenuItem onClick={() => handleDeleteClick(trip.id, trip.origin, trip.destination)} className="gap-2 cursor-pointer text-red-500 hover:bg-red-500/10 focus:bg-red-500/10">
                            <Trash2 className="h-4 w-4" /> Excluir
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
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
              Você tem certeza que deseja excluir o registro da viagem <strong>{tripToDelete?.route}</strong>? Esta ação não pode ser desfeita.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="bg-white/5 border-white/10 text-white hover:bg-white/10 rounded-xl">Cancelar</AlertDialogCancel>
            <AlertDialogAction 
              onClick={confirmDelete}
              className="bg-red-500 text-white hover:bg-red-600 neon-glow font-bold rounded-xl"
            >
              EXCLUIR VIAGEM
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </DashboardLayout>
  )
}