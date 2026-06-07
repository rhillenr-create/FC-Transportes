"use client"

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
  Navigation
} from "lucide-react"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

const trips = [
  { id: 1, origin: "Cuiabá, MT", dest: "Santos, SP", client: "Agro S/A", driver: "João Silva", truck: "ABC-1234", freight: "R$ 18.500", status: "Em Rota", date: "15/05" },
  { id: 2, origin: "Curitiba, PR", dest: "Belém, PA", client: "TransLog", driver: "Marcos Paulo", truck: "XYZ-9876", freight: "R$ 24.200", status: "Concluída", date: "12/05" },
  { id: 3, origin: "Goiânia, GO", dest: "Recife, PE", client: "Mundo Cargo", driver: "Roberto Souza", truck: "KLT-4433", freight: "R$ 15.900", status: "Pendente", date: "18/05" },
]

export default function TripsPage() {
  return (
    <DashboardLayout>
      <div className="space-y-8">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-headline font-bold text-white">Viagens e Fretes</h2>
            <p className="text-muted-foreground">Monitoramento de logística e rentabilidade.</p>
          </div>
          <Button className="neon-glow font-bold">
            <Plus className="w-4 h-4 mr-2" />
            NOVA VIAGEM
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-card border border-white/5 rounded-2xl p-6 flex items-center gap-4">
            <div className="bg-primary/20 p-3 rounded-xl text-primary">
              <Navigation className="h-6 w-6" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground uppercase font-bold tracking-wider">Em Rota</p>
              <p className="text-2xl font-headline font-bold">06</p>
            </div>
          </div>
          <div className="bg-card border border-white/5 rounded-2xl p-6 flex items-center gap-4">
            <div className="bg-accent/20 p-3 rounded-xl text-accent">
              <CheckCircle2 className="h-6 w-6" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground uppercase font-bold tracking-wider">Mês (Concluídas)</p>
              <p className="text-2xl font-headline font-bold">42</p>
            </div>
          </div>
          <div className="bg-card border border-white/5 rounded-2xl p-6 flex items-center gap-4">
            <div className="bg-blue-500/20 p-3 rounded-xl text-blue-500">
              <Clock className="h-6 w-6" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground uppercase font-bold tracking-wider">Aguardando</p>
              <p className="text-2xl font-headline font-bold">03</p>
            </div>
          </div>
          <div className="bg-card border border-white/5 rounded-2xl p-6 flex items-center gap-4">
            <div className="bg-emerald-500/20 p-3 rounded-xl text-emerald-500">
              <Route className="h-6 w-6" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground uppercase font-bold tracking-wider">Faturado Mês</p>
              <p className="text-xl font-headline font-bold">R$ 482k</p>
            </div>
          </div>
        </div>

        <div className="bg-card border border-white/5 rounded-2xl overflow-hidden">
          <div className="p-6 border-b border-white/5">
            <div className="relative w-full max-w-sm">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input placeholder="Buscar por motorista, cliente ou rota..." className="pl-10 bg-white/5 border-white/10" />
            </div>
          </div>
          <Table>
            <TableHeader className="bg-white/5">
              <TableRow className="border-white/5">
                <TableHead className="text-xs uppercase font-bold text-muted-foreground">Status</TableHead>
                <TableHead className="text-xs uppercase font-bold text-muted-foreground">Origem / Destino</TableHead>
                <TableHead className="text-xs uppercase font-bold text-muted-foreground">Motorista / Caminhão</TableHead>
                <TableHead className="text-xs uppercase font-bold text-muted-foreground">Data</TableHead>
                <TableHead className="text-xs uppercase font-bold text-muted-foreground">Valor Frete</TableHead>
                <TableHead className="text-right text-xs uppercase font-bold text-muted-foreground">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {trips.map((trip) => (
                <TableRow key={trip.id} className="border-white/5 hover:bg-white/5 transition-colors">
                  <TableCell>
                    <span className={cn(
                      "px-2 py-1 rounded text-[10px] font-bold uppercase",
                      trip.status === "Concluída" ? "bg-primary/20 text-primary" : 
                      trip.status === "Em Rota" ? "bg-accent/20 text-accent" : 
                      "bg-blue-500/20 text-blue-500"
                    )}>
                      {trip.status}
                    </span>
                  </TableCell>
                  <TableCell>
                    <div className="space-y-1">
                      <p className="text-sm font-bold flex items-center gap-1"><MapPin className="h-3 w-3 text-red-500" /> {trip.origin}</p>
                      <p className="text-sm font-bold flex items-center gap-1"><MapPin className="h-3 w-3 text-primary" /> {trip.dest}</p>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="space-y-1">
                      <p className="text-sm font-medium">{trip.driver}</p>
                      <p className="text-xs text-muted-foreground font-bold">{trip.truck}</p>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Calendar className="h-4 w-4" />
                      <span className="text-sm">{trip.date}</span>
                    </div>
                  </TableCell>
                  <TableCell className="font-bold text-white">{trip.freight}</TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="icon" className="h-8 w-8 hover:bg-white/10"><MoreVertical className="h-4 w-4" /></Button>
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