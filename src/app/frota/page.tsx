"use client"

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
  MoreVertical
} from "lucide-react"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

const trucks = [
  { id: 1, plate: "ABC-1234", model: "Volvo FH 540", year: 2022, km: "142.000", avg: "2.8", status: "Em Viagem" },
  { id: 2, plate: "XYZ-9876", model: "Scania R 450", year: 2021, km: "210.500", avg: "3.2", status: "Disponível" },
  { id: 3, plate: "KLT-4433", model: "Mercedes Actros", year: 2023, km: "45.000", avg: "3.5", status: "Manutenção" },
  { id: 4, plate: "MNO-0099", model: "Volvo FH 460", year: 2020, km: "350.000", avg: "2.5", status: "Disponível" },
]

export default function FleetPage() {
  return (
    <DashboardLayout>
      <div className="space-y-8">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-headline font-bold text-white">Controle de Frota</h2>
            <p className="text-muted-foreground">Gerenciamento completo de veículos e ativos.</p>
          </div>
          <Button className="neon-glow font-bold">
            <Plus className="w-4 h-4 mr-2" />
            CADASTRAR CAMINHÃO
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-card border border-white/5 rounded-2xl p-6 flex items-center gap-4">
            <div className="bg-primary/20 p-3 rounded-xl">
              <Truck className="h-6 w-6 text-primary" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground uppercase font-bold tracking-wider">Total de Veículos</p>
              <p className="text-2xl font-headline font-bold">12</p>
            </div>
          </div>
          <div className="bg-card border border-white/5 rounded-2xl p-6 flex items-center gap-4">
            <div className="bg-accent/20 p-3 rounded-xl">
              <Truck className="h-6 w-6 text-accent" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground uppercase font-bold tracking-wider">Disponíveis</p>
              <p className="text-2xl font-headline font-bold">08</p>
            </div>
          </div>
          <div className="bg-card border border-white/5 rounded-2xl p-6 flex items-center gap-4">
            <div className="bg-red-500/20 p-3 rounded-xl">
              <Truck className="h-6 w-6 text-red-500" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground uppercase font-bold tracking-wider">Em Manutenção</p>
              <p className="text-2xl font-headline font-bold">02</p>
            </div>
          </div>
        </div>

        <div className="bg-card border border-white/5 rounded-2xl overflow-hidden">
          <div className="p-6 border-b border-white/5 flex items-center justify-between">
            <div className="relative w-72">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input placeholder="Buscar por placa ou modelo..." className="pl-10 bg-white/5" />
            </div>
          </div>
          <Table>
            <TableHeader className="bg-white/5">
              <TableRow className="border-white/5">
                <TableHead className="text-xs uppercase font-bold text-muted-foreground">Placa</TableHead>
                <TableHead className="text-xs uppercase font-bold text-muted-foreground">Modelo</TableHead>
                <TableHead className="text-xs uppercase font-bold text-muted-foreground">Ano</TableHead>
                <TableHead className="text-xs uppercase font-bold text-muted-foreground">KM Atual</TableHead>
                <TableHead className="text-xs uppercase font-bold text-muted-foreground">Média Consumo</TableHead>
                <TableHead className="text-xs uppercase font-bold text-muted-foreground">Status</TableHead>
                <TableHead className="text-right text-xs uppercase font-bold text-muted-foreground">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {trucks.map((truck) => (
                <TableRow key={truck.id} className="border-white/5 hover:bg-white/5 transition-colors">
                  <TableCell className="font-bold text-primary">{truck.plate}</TableCell>
                  <TableCell>{truck.model}</TableCell>
                  <TableCell>{truck.year}</TableCell>
                  <TableCell>{truck.km}</TableCell>
                  <TableCell>{truck.avg} km/L</TableCell>
                  <TableCell>
                    <span className={cn(
                      "px-2 py-1 rounded text-[10px] font-bold uppercase",
                      truck.status === "Disponível" ? "bg-primary/20 text-primary" : 
                      truck.status === "Em Viagem" ? "bg-accent/20 text-accent" : 
                      "bg-red-500/20 text-red-500"
                    )}>
                      {truck.status}
                    </span>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Button variant="ghost" size="icon" className="h-8 w-8 hover:bg-white/10 hover:text-primary"><Eye className="h-4 w-4" /></Button>
                      <Button variant="ghost" size="icon" className="h-8 w-8 hover:bg-white/10 hover:text-accent"><Edit2 className="h-4 w-4" /></Button>
                      <Button variant="ghost" size="icon" className="h-8 w-8 hover:bg-white/10 hover:text-red-500"><Trash2 className="h-4 w-4" /></Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    </DashboardLayout>
  )
}