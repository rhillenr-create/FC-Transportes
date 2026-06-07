
"use client"

import { useState } from "react"
import { DashboardLayout } from "@/components/layout/DashboardLayout"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { 
  Plus, 
  Search, 
  Edit2, 
  Trash2, 
  Eye, 
  Truck,
  ArrowUpRight
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
import { cn } from "@/lib/utils"

const trucks = [
  { id: 1, plate: "ABC-1234", model: "Volvo FH 540", year: 2022, km: "142.000", avg: "2.8", status: "Em Viagem" },
  { id: 2, plate: "XYZ-9876", model: "Scania R 450", year: 2021, km: "210.500", avg: "3.2", status: "Disponível" },
  { id: 3, plate: "KLT-4433", model: "Mercedes Actros", year: 2023, km: "45.000", avg: "3.5", status: "Manutenção" },
  { id: 4, plate: "MNO-0099", model: "Volvo FH 460", year: 2020, km: "350.000", avg: "2.5", status: "Disponível" },
]

export default function FleetPage() {
  const [isOpen, setIsOpen] = useState(false)

  const handleAddTruck = (e: React.FormEvent) => {
    e.preventDefault()
    setIsOpen(false)
  }

  return (
    <DashboardLayout>
      <div className="space-y-8 max-w-[1600px] mx-auto animate-in fade-in slide-in-from-bottom-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-1">
            <h2 className="text-4xl font-headline font-bold text-white tracking-tight">Controle de Frota</h2>
            <p className="text-muted-foreground text-sm uppercase tracking-widest font-medium">Gestão centralizada de ativos logísticos</p>
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
                    <Input id="plate" placeholder="AAA-0000" className="bg-white/5 border-white/10 uppercase" required />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="model">Modelo / Fabricante</Label>
                    <Input id="model" placeholder="Ex: Volvo FH 540" className="bg-white/5 border-white/10" required />
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="year">Ano</Label>
                    <Input id="year" type="number" placeholder="2024" className="bg-white/5 border-white/10" required />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="km">Quilometragem Inicial</Label>
                    <Input id="km" type="number" placeholder="0" className="bg-white/5 border-white/10" required />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="avg">Média Esperada (KM/L)</Label>
                    <Input id="avg" placeholder="3.5" className="bg-white/5 border-white/10" required />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Tipo de Veículo</Label>
                  <Select>
                    <SelectTrigger className="bg-white/5 border-white/10 text-white">
                      <SelectValue placeholder="Selecione o tipo" />
                    </SelectTrigger>
                    <SelectContent className="bg-card border-white/10 text-white">
                      <SelectItem value="heavy">Caminhão Pesado (6x4)</SelectItem>
                      <SelectItem value="medium">Caminhão Médio (4x2)</SelectItem>
                      <SelectItem value="trailer">Carreta Graneleira</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <DialogFooter className="pt-4">
                  <Button type="button" variant="ghost" onClick={() => setIsOpen(false)} className="text-muted-foreground hover:text-white">Cancelar</Button>
                  <Button type="submit" className="bg-primary text-primary-foreground neon-glow font-bold px-8">CONCLUIR CADASTRO</Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            { label: "Total da Frota", value: "12", icon: Truck, color: "text-primary", bg: "bg-primary/10" },
            { label: "Veículos Ativos", value: "08", icon: Truck, color: "text-accent", bg: "bg-accent/10" },
            { label: "Em Manutenção", value: "02", icon: Truck, color: "text-red-500", bg: "bg-red-500/10" },
          ].map((stat, i) => (
            <div key={i} className="glass-card rounded-[2rem] p-8 flex items-center gap-6 group hover:neon-border transition-all">
              <div className={cn("p-5 rounded-2xl group-hover:scale-110 transition-transform", stat.bg, stat.color)}>
                <stat.icon className="h-8 w-8" />
              </div>
              <div className="space-y-1">
                <p className="text-xs text-muted-foreground uppercase font-bold tracking-widest">{stat.label}</p>
                <div className="flex items-baseline gap-2">
                  <p className="text-3xl font-headline font-bold">{stat.value}</p>
                  <span className="text-[10px] font-bold text-primary flex items-center gap-0.5">
                    <ArrowUpRight className="h-3 w-3" />
                    +2
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="glass-card rounded-[2.5rem] overflow-hidden border-white/5">
          <div className="p-8 border-b border-white/5 flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="relative w-full max-w-md">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <input placeholder="Buscar por placa, modelo ou motorista..." className="pl-12 h-12 w-full bg-white/5 border border-white/10 rounded-xl focus:outline-none focus:ring-1 focus:ring-primary/40 text-white" />
            </div>
            <div className="flex items-center gap-4">
               <span className="text-xs font-bold text-muted-foreground uppercase tracking-widest">Filtrar por Status:</span>
               <div className="flex gap-2">
                 {["Todos", "Disponível", "Viagem", "Manutenção"].map((f) => (
                   <button key={f} className="px-4 py-2 rounded-lg bg-white/5 text-[10px] font-bold uppercase hover:bg-primary hover:text-primary-foreground transition-all">
                     {f}
                   </button>
                 ))}
               </div>
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
                {trucks.map((truck) => (
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
                        <Button variant="ghost" size="icon" className="h-10 w-10 rounded-xl hover:bg-white/10 hover:text-primary"><Eye className="h-5 w-5" /></Button>
                        <Button variant="ghost" size="icon" className="h-10 w-10 rounded-xl hover:bg-white/10 hover:text-accent"><Edit2 className="h-5 w-5" /></Button>
                        <Button variant="ghost" size="icon" className="h-10 w-10 rounded-xl hover:bg-white/10 hover:text-red-500"><Trash2 className="h-5 w-5" /></Button>
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
