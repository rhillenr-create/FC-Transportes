
"use client"

import { useState } from "react"
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
  Calendar
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

const maintenanceRecords = [
  { id: 1, truck: "ABC-1234", type: "Corretiva", service: "Troca de Embreagem", status: "Em Execução", date: "Hoje", cost: "R$ 4.200" },
  { id: 2, truck: "XYZ-9876", type: "Preventiva", service: "Revisão 100k", status: "Agendada", date: "22/05", cost: "Est. R$ 2.500" },
  { id: 3, truck: "KLT-4433", type: "Corretiva", service: "Reparo Elétrico", status: "Concluída", date: "15/05", cost: "R$ 850" },
]

export default function MaintenancePage() {
  const [isOpen, setIsOpen] = useState(false)

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
                      <SelectValue placeholder="Selecione o caminhão" />
                    </SelectTrigger>
                    <SelectContent className="bg-card border-white/10 text-white">
                      <SelectItem value="abc">ABC-1234 (Volvo FH 540)</SelectItem>
                      <SelectItem value="xyz">XYZ-9876 (Scania R 450)</SelectItem>
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
                        <SelectItem value="predictive">Preditiva (IA)</SelectItem>
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
                <p className="text-2xl font-headline font-bold">03</p>
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
                <p className="text-2xl font-headline font-bold">08</p>
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
                <p className="text-2xl font-headline font-bold">12</p>
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
                <p className="text-2xl font-headline font-bold">R$ 24k</p>
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
              {maintenanceRecords.map((record) => (
                <TableRow key={record.id} className="border-white/5 hover:bg-white/5 transition-colors">
                  <TableCell className="font-bold text-primary">{record.truck}</TableCell>
                  <TableCell>
                    <span className={cn(
                      "text-[10px] font-bold uppercase",
                      record.type === "Preventiva" ? "text-accent" : "text-orange-400"
                    )}>
                      {record.type}
                    </span>
                  </TableCell>
                  <TableCell className="font-medium">{record.service}</TableCell>
                  <TableCell>
                    <span className={cn(
                      "px-2 py-1 rounded text-[10px] font-bold uppercase",
                      record.status === "Concluída" ? "bg-primary/20 text-primary" : 
                      record.status === "Em Execução" ? "bg-orange-500/20 text-orange-500" : 
                      "bg-white/10 text-white"
                    )}>
                      {record.status}
                    </span>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2 text-muted-foreground text-sm">
                      <Calendar className="h-3 w-3" />
                      {record.date}
                    </div>
                  </TableCell>
                  <TableCell className="text-right font-bold">{record.cost}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    </DashboardLayout>
  )
}
