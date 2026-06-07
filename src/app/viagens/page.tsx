
"use client"

import { useState } from "react"
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
  Eye,
  Edit,
  Trash2,
  CheckCircle
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
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { cn } from "@/lib/utils"
import { useToast } from "@/hooks/use-toast"

const initialTrips = [
  { id: 1, origin: "Cuiabá, MT", dest: "Santos, SP", client: "Agro S/A", driver: "João Silva", truck: "ABC-1234", freight: "R$ 18.500", status: "Em Rota", date: "15/05", progress: 65 },
  { id: 2, origin: "Curitiba, PR", dest: "Belém, PA", client: "TransLog", driver: "Marcos Paulo", truck: "XYZ-9876", freight: "R$ 24.200", status: "Concluída", date: "12/05", progress: 100 },
  { id: 3, origin: "Goiânia, GO", dest: "Recife, PE", client: "Mundo Cargo", driver: "Roberto Souza", truck: "KLT-4433", freight: "R$ 15.900", status: "Pendente", date: "18/05", progress: 0 },
]

export default function TripsPage() {
  const [isOpen, setIsOpen] = useState(false)
  const { toast } = useToast()
  const [trips, setTrips] = useState(initialTrips)

  const handleProgramTrip = (e: React.FormEvent) => {
    e.preventDefault()
    setIsOpen(false)
    toast({
      title: "Viagem Programada",
      description: "A nova rota foi salva e o motorista será notificado.",
    })
  }

  const handleAction = (action: string, id: number) => {
    toast({
      title: action,
      description: `Ação realizada com sucesso para a viagem #${id}.`,
    })
  }

  return (
    <DashboardLayout>
      <div className="space-y-8 max-w-[1600px] mx-auto animate-in fade-in slide-in-from-bottom-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-1">
            <h2 className="text-4xl font-headline font-bold text-white tracking-tight">Viagens e Logística</h2>
            <p className="text-muted-foreground text-sm uppercase tracking-widest font-medium">Controle de fretes e monitoramento de rotas em tempo real</p>
          </div>
          
          <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
              <Button className="neon-glow font-bold h-12 px-8 rounded-xl bg-primary text-primary-foreground">
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
                    <Input id="origin" placeholder="Cidade, UF" className="bg-white/5 border-white/10" required />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="dest">Destino</Label>
                    <Input id="dest" placeholder="Cidade, UF" className="bg-white/5 border-white/10" required />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="client">Cliente</Label>
                    <Input id="client" placeholder="Nome do Cliente/Empresa" className="bg-white/5 border-white/10" required />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="freight">Valor do Frete</Label>
                    <Input id="freight" placeholder="R$ 0,00" className="bg-white/5 border-white/10" required />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Motorista</Label>
                    <Select>
                      <SelectTrigger className="bg-white/5 border-white/10 text-white">
                        <SelectValue placeholder="Selecionar Motorista" />
                      </SelectTrigger>
                      <SelectContent className="bg-card border-white/10 text-white">
                        <SelectItem value="joao">João Silva</SelectItem>
                        <SelectItem value="pedro">Pedro Santos</SelectItem>
                        <SelectItem value="marcos">Marcos Paulo</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Veículo</Label>
                    <Select>
                      <SelectTrigger className="bg-white/5 border-white/10 text-white">
                        <SelectValue placeholder="Selecionar Caminhão" />
                      </SelectTrigger>
                      <SelectContent className="bg-card border-white/10 text-white">
                        <SelectItem value="abc">Volvo FH 540 (ABC-1234)</SelectItem>
                        <SelectItem value="xyz">Scania R 450 (XYZ-9876)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <DialogFooter className="pt-4">
                  <Button type="button" variant="ghost" onClick={() => setIsOpen(false)} className="text-muted-foreground hover:text-white">Cancelar</Button>
                  <Button type="submit" className="bg-primary text-primary-foreground neon-glow font-bold px-8">SALVAR E INICIAR</Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {[
            { label: "Viagens em Rota", value: "06", icon: Navigation, color: "text-primary", bg: "bg-primary/10" },
            { label: "Mês (Concluídas)", value: "42", icon: CheckCircle2, color: "text-accent", bg: "bg-accent/10" },
            { label: "Aguardando Início", value: "03", icon: Clock, color: "text-blue-500", bg: "bg-blue-500/10" },
            { label: "Faturamento Mensal", value: "R$ 482k", icon: Route, color: "text-emerald-400", bg: "bg-emerald-400/10" },
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
                {trips.map((trip) => (
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
                          <p className="text-sm font-bold text-white flex items-center gap-2"><MapPin className="h-3 w-3 text-primary" /> {trip.dest}</p>
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
                        <span className="text-xs font-medium tracking-tight">{trip.date}</span>
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
                          <DropdownMenuItem onClick={() => handleAction("Visualizando Detalhes", trip.id)} className="gap-2 cursor-pointer hover:bg-white/5 focus:bg-white/5">
                            <Eye className="h-4 w-4 text-primary" /> Detalhes
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleAction("Editando Viagem", trip.id)} className="gap-2 cursor-pointer hover:bg-white/5 focus:bg-white/5">
                            <Edit className="h-4 w-4 text-blue-400" /> Editar
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleAction("Finalizando Viagem", trip.id)} className="gap-2 cursor-pointer hover:bg-white/5 focus:bg-white/5">
                            <CheckCircle className="h-4 w-4 text-accent" /> Finalizar
                          </DropdownMenuItem>
                          <DropdownMenuSeparator className="bg-white/5" />
                          <DropdownMenuItem onClick={() => handleAction("Excluindo Viagem", trip.id)} className="gap-2 cursor-pointer text-red-500 hover:bg-red-500/10 focus:bg-red-500/10">
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
    </DashboardLayout>
  )
}
