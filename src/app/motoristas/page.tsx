
"use client"

import { DashboardLayout } from "@/components/layout/DashboardLayout"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Plus, Search, User, MoreVertical, Star, ShieldCheck } from "lucide-react"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

const drivers = [
  { id: 1, name: "João Silva", cnh: "123456789", cat: "AE", status: "Em Viagem", score: 4.8 },
  { id: 2, name: "Pedro Santos", cnh: "987654321", cat: "E", status: "Disponível", score: 4.9 },
  { id: 3, name: "Carlos Lima", cnh: "456123789", cat: "D", status: "Folga", score: 4.5 },
  { id: 4, name: "Roberto Souza", cnh: "741852963", cat: "AE", status: "Disponível", score: 5.0 },
]

export default function DriversPage() {
  return (
    <DashboardLayout>
      <div className="space-y-8">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-headline font-bold text-white">Gestão de Motoristas</h2>
            <p className="text-muted-foreground">Controle de condutores, categorias e performance.</p>
          </div>
          <Button className="neon-glow font-bold">
            <Plus className="w-4 h-4 mr-2" />
            CADASTRAR MOTORISTA
          </Button>
        </div>

        <div className="bg-card border border-white/5 rounded-2xl overflow-hidden">
          <div className="p-6 border-b border-white/5 flex items-center justify-between">
            <div className="relative w-72">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input placeholder="Buscar por nome ou CNH..." className="pl-10 bg-white/5 border-white/10" />
            </div>
          </div>
          <Table>
            <TableHeader className="bg-white/5">
              <TableRow className="border-white/5">
                <TableHead className="text-xs uppercase font-bold">Motorista</TableHead>
                <TableHead className="text-xs uppercase font-bold">CNH / Categoria</TableHead>
                <TableHead className="text-xs uppercase font-bold">Score Performance</TableHead>
                <TableHead className="text-xs uppercase font-bold">Status Atual</TableHead>
                <TableHead className="text-right text-xs uppercase font-bold">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {drivers.map((driver) => (
                <TableRow key={driver.id} className="border-white/5 hover:bg-white/5 transition-colors">
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <Avatar className="h-10 w-10 border border-white/10">
                        <AvatarImage src={`https://picsum.photos/seed/${driver.id}/100`} />
                        <AvatarFallback><User /></AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-bold text-white">{driver.name}</p>
                        <p className="text-xs text-muted-foreground">ID: #00{driver.id}</p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="space-y-1">
                      <p className="font-medium">{driver.cnh}</p>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-primary/20 text-primary uppercase">CAT {driver.cat}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      <Star className="h-4 w-4 text-accent fill-accent" />
                      <span className="font-bold">{driver.score}</span>
                      {driver.score >= 4.8 && <ShieldCheck className="h-4 w-4 text-primary ml-2" />}
                    </div>
                  </TableCell>
                  <TableCell>
                    <span className={`px-2 py-1 rounded text-[10px] font-bold uppercase ${
                      driver.status === "Disponível" ? "bg-primary/20 text-primary" : 
                      driver.status === "Em Viagem" ? "bg-accent/20 text-accent" : 
                      "bg-white/10 text-white"
                    }`}>
                      {driver.status}
                    </span>
                  </TableCell>
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
