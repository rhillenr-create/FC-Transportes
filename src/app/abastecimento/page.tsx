
"use client"

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

const fuelLogs = [
  { id: 1, truck: "ABC-1234", date: "18/05/2024", liters: "320L", type: "S10", station: "Posto Graal", total: "R$ 1.856,00" },
  { id: 2, truck: "XYZ-9876", date: "17/05/2024", liters: "450L", type: "S500", station: "Posto Shell", total: "R$ 2.475,00" },
  { id: 3, truck: "KLT-4433", date: "16/05/2024", liters: "280L", type: "S10", station: "Ipiranga", total: "R$ 1.624,00" },
]

export default function FuelPage() {
  return (
    <DashboardLayout>
      <div className="space-y-8">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-headline font-bold text-white">Controle de Abastecimento</h2>
            <p className="text-muted-foreground">Monitore o consumo e gastos com combustível da frota.</p>
          </div>
          <Button className="neon-glow font-bold">
            <Plus className="w-4 h-4 mr-2" />
            REGISTRAR ABASTECIMENTO
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="bg-card border-white/5">
            <CardContent className="p-6 flex items-center gap-4">
              <div className="bg-primary/20 p-3 rounded-xl">
                <Fuel className="h-6 w-6 text-primary" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground uppercase font-bold tracking-wider">Litros (Mês)</p>
                <p className="text-2xl font-headline font-bold">12.450 L</p>
              </div>
            </CardContent>
          </Card>
          <Card className="bg-card border-white/5">
            <CardContent className="p-6 flex items-center gap-4">
              <div className="bg-accent/20 p-3 rounded-xl">
                <TrendingUp className="h-6 w-6 text-accent" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground uppercase font-bold tracking-wider">Média Frota</p>
                <p className="text-2xl font-headline font-bold">3.1 km/L</p>
              </div>
            </CardContent>
          </Card>
          <Card className="bg-card border-white/5">
            <CardContent className="p-6 flex items-center gap-4">
              <div className="bg-white/5 p-3 rounded-xl">
                <Droplets className="h-6 w-6 text-white" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground uppercase font-bold tracking-wider">Gasto Total (Mês)</p>
                <p className="text-2xl font-headline font-bold">R$ 72.210</p>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="bg-card border border-white/5 rounded-2xl overflow-hidden">
          <div className="p-6 border-b border-white/5 flex items-center justify-between">
            <h3 className="font-bold flex items-center gap-2">
              <History className="h-4 w-4 text-primary" />
              Últimos Registros
            </h3>
            <div className="relative w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input placeholder="Filtrar por placa..." className="pl-10 bg-white/5 h-9" />
            </div>
          </div>
          <Table>
            <TableHeader className="bg-white/5">
              <TableRow className="border-white/5 hover:bg-transparent">
                <TableHead className="text-xs uppercase font-bold">Caminhão</TableHead>
                <TableHead className="text-xs uppercase font-bold">Data</TableHead>
                <TableHead className="text-xs uppercase font-bold">Litros</TableHead>
                <TableHead className="text-xs uppercase font-bold">Tipo</TableHead>
                <TableHead className="text-xs uppercase font-bold">Posto</TableHead>
                <TableHead className="text-right text-xs uppercase font-bold">Valor Total</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {fuelLogs.map((log) => (
                <TableRow key={log.id} className="border-white/5 hover:bg-white/5 transition-colors">
                  <TableCell className="font-bold text-primary">{log.truck}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Calendar className="h-3 w-3 text-muted-foreground" />
                      {log.date}
                    </div>
                  </TableCell>
                  <TableCell>{log.liters}</TableCell>
                  <TableCell>
                    <span className="px-2 py-0.5 rounded bg-white/5 text-[10px] font-bold">{log.type}</span>
                  </TableCell>
                  <TableCell className="text-muted-foreground">{log.station}</TableCell>
                  <TableCell className="text-right font-bold text-white">{log.total}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    </DashboardLayout>
  )
}
