
"use client"

import { useState, useMemo, useEffect } from "react"
import { DashboardLayout } from "@/components/layout/DashboardLayout"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { 
  Fuel, 
  Plus, 
  Search, 
  Droplets, 
  TrendingUp, 
  History,
  Calendar,
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
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/hooks/use-toast"
import { useFirestore, useCollection, useMemoFirebase } from "@/firebase"
import { collection, addDoc, serverTimestamp, query, orderBy } from "firebase/firestore"
import { errorEmitter } from "@/firebase/error-emitter"
import { FirestorePermissionError } from "@/firebase/errors"

export default function FuelPage() {
  const db = useFirestore()
  const { toast } = useToast()
  const [isOpen, setIsOpen] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  // Form state
  const [formData, setFormData] = useState({
    truckId: "",
    liters: "",
    totalValue: "",
    fuelType: "Diesel S10",
    station: "",
    km: ""
  })

  // Fetch Trucks for selection
  const trucksQuery = useMemoFirebase(() => {
    return query(collection(db, "trucks"), orderBy("plate", "asc"))
  }, [db])
  const { data: trucks } = useCollection(trucksQuery)

  // Fetch Fuel Logs
  const fuelQuery = useMemoFirebase(() => {
    return query(collection(db, "fuel_entries"), orderBy("createdAt", "desc"))
  }, [db])
  const { data: fuelLogs, loading: loadingLogs } = useCollection(fuelQuery)

  // Stats calculation
  const stats = useMemo(() => {
    if (!fuelLogs || fuelLogs.length === 0) return { totalLiters: 0, totalValue: 0, avg: 0 }
    
    const totalLiters = fuelLogs.reduce((acc, log) => acc + Number(log.liters || 0), 0)
    const totalValue = fuelLogs.reduce((acc, log) => acc + Number(log.totalValue || 0), 0)
    
    // Simple average calculation (KM based)
    const avg = fuelLogs.length > 0 ? (totalLiters / fuelLogs.length).toFixed(1) : 0

    return { totalLiters, totalValue, avg }
  }, [fuelLogs])

  const formatCurrency = (val: number) => {
    if (!mounted) return "R$ 0,00"
    return `R$ ${val.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`
  }

  const handleAddFuel = (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.truckId) {
      toast({ variant: "destructive", title: "Erro", description: "Selecione um veículo." })
      return
    }

    setIsSubmitting(true)

    const payload = {
      ...formData,
      liters: Number(formData.liters),
      totalValue: Number(formData.totalValue.replace(/[^0-9,.-]+/g, "").replace(",", ".")),
      km: Number(formData.km),
      createdAt: serverTimestamp()
    }

    addDoc(collection(db, "fuel_entries"), payload)
      .then(() => {
        setIsOpen(false)
        setFormData({
          truckId: "",
          liters: "",
          totalValue: "",
          fuelType: "Diesel S10",
          station: "",
          km: ""
        })
        toast({
          title: "Registro Salvo",
          description: "O abastecimento foi registrado com sucesso no banco de dados."
        })
      })
      .catch(async () => {
        const permissionError = new FirestorePermissionError({
          path: "fuel_entries",
          operation: "create",
          requestResourceData: payload
        })
        errorEmitter.emit("permission-error", permissionError)
      })
      .finally(() => setIsSubmitting(false))
  }

  const filteredLogs = fuelLogs?.filter(log => 
    log.truckId.toLowerCase().includes(searchTerm.toLowerCase()) ||
    log.station.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <DashboardLayout>
      <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <h2 className="text-4xl font-headline font-bold text-white tracking-tight">Controle de Abastecimento</h2>
            <p className="text-muted-foreground text-sm uppercase tracking-widest font-medium">Monitore o consumo e gastos com combustível em tempo real</p>
          </div>
          
          <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
              <Button className="neon-glow font-bold h-12 px-8 rounded-xl bg-primary text-primary-foreground">
                <Plus className="w-5 h-5 mr-2" />
                REGISTRAR ABASTECIMENTO
              </Button>
            </DialogTrigger>
            <DialogContent className="bg-card border-white/10 text-white max-w-xl rounded-[2rem]">
              <DialogHeader>
                <DialogTitle className="text-2xl font-headline font-bold text-primary">Novo Registro de Abastecimento</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleAddFuel} className="space-y-6 py-4">
                <div className="space-y-2">
                  <Label>Veículo</Label>
                  <Select value={formData.truckId} onValueChange={(v) => setFormData({...formData, truckId: v})}>
                    <SelectTrigger className="bg-white/5 border-white/10 text-white">
                      <SelectValue placeholder="Selecione o caminhão" />
                    </SelectTrigger>
                    <SelectContent className="bg-card border-white/10 text-white">
                      {trucks?.map(truck => (
                        <SelectItem key={truck.id} value={truck.plate}>{truck.plate} - {truck.model}</SelectItem>
                      ))}
                      {(!trucks || trucks.length === 0) && <SelectItem value="none" disabled>Nenhum veículo cadastrado</SelectItem>}
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="liters">Litros</Label>
                    <Input 
                      id="liters" 
                      type="number" 
                      step="0.01"
                      placeholder="0.00" 
                      className="bg-white/5 border-white/10" 
                      value={formData.liters}
                      onChange={(e) => setFormData({...formData, liters: e.target.value})}
                      required 
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="price">Valor Total</Label>
                    <Input 
                      id="price" 
                      placeholder="R$ 0,00" 
                      className="bg-white/5 border-white/10" 
                      value={formData.totalValue}
                      onChange={(e) => setFormData({...formData, totalValue: e.target.value})}
                      required 
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Tipo de Diesel</Label>
                    <Select value={formData.fuelType} onValueChange={(v) => setFormData({...formData, fuelType: v})}>
                      <SelectTrigger className="bg-white/5 border-white/10 text-white">
                        <SelectValue placeholder="Tipo" />
                      </SelectTrigger>
                      <SelectContent className="bg-card border-white/10 text-white">
                        <SelectItem value="Diesel S10">Diesel S10</SelectItem>
                        <SelectItem value="Diesel S500">Diesel S500</SelectItem>
                        <SelectItem value="Arla 32">Arla 32</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="station">Posto</Label>
                    <Input 
                      id="station" 
                      placeholder="Nome do Posto" 
                      className="bg-white/5 border-white/10" 
                      value={formData.station}
                      onChange={(e) => setFormData({...formData, station: e.target.value})}
                      required 
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="km">KM Atual</Label>
                  <Input 
                    id="km" 
                    type="number" 
                    placeholder="0" 
                    className="bg-white/5 border-white/10" 
                    value={formData.km}
                    onChange={(e) => setFormData({...formData, km: e.target.value})}
                    required 
                  />
                </div>
                <DialogFooter className="pt-4">
                  <Button type="button" variant="ghost" onClick={() => setIsOpen(false)} className="text-muted-foreground hover:text-white">Cancelar</Button>
                  <Button type="submit" disabled={isSubmitting} className="bg-primary text-primary-foreground neon-glow font-bold px-8">
                    {isSubmitting ? <Loader2 className="animate-spin h-4 w-4 mr-2" /> : null}
                    SALVAR REGISTRO
                  </Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="glass-card rounded-[2rem] p-8 group hover:neon-border transition-all">
            <CardContent className="p-0 flex items-center gap-6">
              <div className="bg-primary/20 p-5 rounded-2xl text-primary group-hover:scale-110 transition-transform">
                <Fuel className="h-8 w-8" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground uppercase font-bold tracking-widest">Litros Totais</p>
                <p className="text-3xl font-headline font-bold">{mounted ? stats.totalLiters.toLocaleString('pt-BR') : "0"} L</p>
              </div>
            </CardContent>
          </Card>
          <Card className="glass-card rounded-[2rem] p-8 group hover:neon-border transition-all">
            <CardContent className="p-0 flex items-center gap-6">
              <div className="bg-accent/20 p-5 rounded-2xl text-accent group-hover:scale-110 transition-transform">
                <TrendingUp className="h-8 w-8" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground uppercase font-bold tracking-widest">Média Abast.</p>
                <p className="text-3xl font-headline font-bold">{stats.avg} L/abast</p>
              </div>
            </CardContent>
          </Card>
          <Card className="glass-card rounded-[2rem] p-8 group hover:neon-border transition-all">
            <CardContent className="p-0 flex items-center gap-6">
              <div className="bg-blue-500/20 p-5 rounded-2xl text-blue-500 group-hover:scale-110 transition-transform">
                <Droplets className="h-8 w-8" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground uppercase font-bold tracking-widest">Investimento Total</p>
                <p className="text-3xl font-headline font-bold">{formatCurrency(stats.totalValue)}</p>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="glass-card rounded-[2.5rem] overflow-hidden border-white/5">
          <div className="p-8 border-b border-white/5 flex flex-col md:flex-row md:items-center justify-between gap-6">
            <h3 className="font-bold flex items-center gap-3 text-lg">
              <History className="h-5 w-5 text-primary" />
              Últimos Registros
            </h3>
            <div className="relative w-full max-w-md">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input 
                placeholder="Filtrar por placa ou posto..." 
                className="pl-12 bg-white/5 h-12 border-white/10 rounded-xl"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader className="bg-white/5">
                <TableRow className="border-white/5 hover:bg-transparent h-16">
                  <TableHead className="text-[10px] uppercase font-bold text-muted-foreground pl-8">Caminhão</TableHead>
                  <TableHead className="text-[10px] uppercase font-bold text-muted-foreground">Data</TableHead>
                  <TableHead className="text-[10px] uppercase font-bold text-muted-foreground">Litros</TableHead>
                  <TableHead className="text-[10px] uppercase font-bold text-muted-foreground">Tipo</TableHead>
                  <TableHead className="text-[10px] uppercase font-bold text-muted-foreground">Posto</TableHead>
                  <TableHead className="text-[10px] uppercase font-bold text-muted-foreground">KM</TableHead>
                  <TableHead className="text-right text-[10px] uppercase font-bold text-muted-foreground pr-8">Valor Total</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loadingLogs ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-12 text-muted-foreground">
                       <Loader2 className="animate-spin h-8 w-8 mx-auto mb-2 opacity-20" />
                       Carregando histórico...
                    </TableCell>
                  </TableRow>
                ) : !filteredLogs || filteredLogs.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-12 text-muted-foreground font-bold uppercase tracking-widest">Nenhum registro encontrado.</TableCell>
                  </TableRow>
                ) : filteredLogs.map((log) => (
                  <TableRow key={log.id} className="border-white/5 table-row-hover h-20">
                    <TableCell className="font-bold text-primary text-base pl-8">{log.truckId}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2 text-muted-foreground text-xs">
                        <Calendar className="h-3.5 w-3.5" />
                        {mounted && log.createdAt?.toDate ? log.createdAt.toDate().toLocaleDateString('pt-BR') : 'Recent'}
                      </div>
                    </TableCell>
                    <TableCell className="font-mono">{log.liters} L</TableCell>
                    <TableCell>
                      <span className="px-3 py-1 rounded-full bg-white/5 text-[9px] font-bold uppercase tracking-widest border border-white/10">{log.fuelType}</span>
                    </TableCell>
                    <TableCell className="text-muted-foreground font-medium">{log.station}</TableCell>
                    <TableCell className="font-mono text-xs">{mounted ? log.km?.toLocaleString('pt-BR') : log.km} km</TableCell>
                    <TableCell className="text-right font-headline font-bold text-white pr-8">
                      {formatCurrency(log.totalValue || 0)}
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
