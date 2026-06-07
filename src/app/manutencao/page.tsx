
"use client"

import { useState, useEffect } from "react"
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
import { Textarea } from "@/components/ui/textarea"
import { cn } from "@/lib/utils"
import { useFirestore, useCollection, useMemoFirebase } from "@/firebase"
import { collection, query, orderBy } from "firebase/firestore"

export default function MaintenancePage() {
  const db = useFirestore()
  const [isOpen, setIsOpen] = useState(false)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  // Fetch Trucks for selection
  const trucksQuery = useMemoFirebase(() => {
    return query(collection(db, "trucks"), orderBy("plate", "asc"))
  }, [db])
  const { data: trucks, loading: loadingTrucks } = useCollection(trucksQuery)

  const handleScheduleMaintenance = (e: React.FormEvent) => {
    e.preventDefault()
    setIsOpen(false)
  }

  return (
    <DashboardLayout>
      <div className="space-y-8">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-headline font-bold text-white">Plano de Manutenção</h2>
            <p className="text-muted-foreground">Gerencie revisões preventivas e reparos emergenciais.</p>
          </div>
          
          <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
              <Button className="neon-glow font-bold">
                <Plus className="w-4 h-4 mr-2" />
                AGENDAR MANUTENÇÃO
              </Button>
            </DialogTrigger>
            <DialogContent className="bg-card border-white/10 text-white max-w-xl rounded-[2rem]">
              <DialogHeader>
                <DialogTitle className="text-2xl font-headline font-bold text-primary">Novo Agendamento de Manutenção</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleScheduleMaintenance} className="space-y-6 py-4">
                <div className="space-y-2">
                  <Label>Veículo</Label>
                  <Select>
                    <SelectTrigger className="bg-white/5 border-white/10 text-white">
                      <SelectValue placeholder={loadingTrucks ? "Carregando..." : "Selecione o caminhão"} />
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
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Tipo de Manutenção</Label>
                    <Select>
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
                    <Input id="date" type="date" className="bg-white/5 border-white/10" required />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="service">Descrição do Serviço</Label>
                  <Input id="service" placeholder="Ex: Troca de óleo, Reparo de suspensão..." className="bg-white/5 border-white/10" required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="obs">Observações Adicionais</Label>
                  <Textarea id="obs" placeholder="Detalhes técnicos ou sintomas identificados..." className="bg-white/5 border-white/10 min-h-[100px]" />
                </div>
                <DialogFooter className="pt-4">
                  <Button type="button" variant="ghost" onClick={() => setIsOpen(false)} className="text-muted-foreground hover:text-white">Cancelar</Button>
                  <Button type="submit" className="bg-primary text-primary-foreground neon-glow font-bold px-8">AGENDAR SERVIÇO</Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card className="bg-card border-white/5">
            <CardContent className="p-6">
              <div className="flex flex-col gap-2">
                <div className="p-2 w-fit rounded-lg bg-orange-500/20 text-orange-500">
                  <AlertTriangle className="h-5 w-5" />
                </div>
                <p className="text-xs text-muted-foreground uppercase font-bold">Urgentes</p>
                <p className="text-2xl font-headline font-bold">0</p>
              </div>
            </CardContent>
          </Card>
          <Card className="bg-card border-white/5">
            <CardContent className="p-6">
              <div className="flex flex-col gap-2">
                <div className="p-2 w-fit rounded-lg bg-primary/20 text-primary">
                  <Clock className="h-5 w-5" />
                </div>
                <p className="text-xs text-muted-foreground uppercase font-bold">Agendadas</p>
                <p className="text-2xl font-headline font-bold">0</p>
              </div>
            </CardContent>
          </Card>
          <Card className="bg-card border-white/5">
            <CardContent className="p-6">
              <div className="flex flex-col gap-2">
                <div className="p-2 w-fit rounded-lg bg-accent/20 text-accent">
                  <CheckCircle2 className="h-5 w-5" />
                </div>
                <p className="text-xs text-muted-foreground uppercase font-bold">Concluídas (Mês)</p>
                <p className="text-2xl font-headline font-bold">0</p>
              </div>
            </CardContent>
          </Card>
          <Card className="bg-card border-white/5">
            <CardContent className="p-6">
              <div className="flex flex-col gap-2">
                <div className="p-2 w-fit rounded-lg bg-red-500/20 text-red-500">
                  <Wrench className="h-5 w-5" />
                </div>
                <p className="text-xs text-muted-foreground uppercase font-bold">Investimento</p>
                <p className="text-2xl font-headline font-bold">R$ 0</p>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="bg-card border border-white/5 rounded-2xl overflow-hidden">
          <div className="p-6 border-b border-white/5">
            <h3 className="font-bold flex items-center gap-2 text-white">
              <Settings2 className="h-4 w-4 text-primary" />
              Cronograma e Histórico
            </h3>
          </div>
          <Table>
            <TableHeader className="bg-white/5">
              <TableRow className="border-white/5 hover:bg-transparent">
                <TableHead className="text-xs uppercase font-bold">Caminhão</TableHead>
                <TableHead className="text-xs uppercase font-bold">Tipo</TableHead>
                <TableHead className="text-xs uppercase font-bold">Serviço</TableHead>
                <TableHead className="text-xs uppercase font-bold">Status</TableHead>
                <TableHead className="text-xs uppercase font-bold">Data</TableHead>
                <TableHead className="text-right text-xs uppercase font-bold">Custo</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow>
                <TableCell colSpan={6} className="text-center py-10 text-muted-foreground">Nenhum registro de manutenção.</TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </div>
      </div>
    </DashboardLayout>
  )
}
