
"use client"

import { useState } from "react"
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

export default function FuelPage() {
  const [isOpen, setIsOpen] = useState(false)
  const [fuelLogs, setFuelLogs] = useState<any[]>([]) // Começa vazio para testes
  const { toast } = useToast()

  const handleAddFuel = (e: React.FormEvent) => {
    e.preventDefault()
    setIsOpen(false)
    toast({
      title: "Registro Salvo",
      description: "O abastecimento foi registrado com sucesso."
    })
  }

  return (
    <DashboardLayout>
      <div className="space-y-8">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-headline font-bold text-white">Controle de Abastecimento</h2>
            <p className="text-muted-foreground">Monitore o consumo e gastos com combustível da frota.</p>
          </div>
          
          <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
              <Button className="neon-glow font-bold">
                <Plus className="w-4 h-4 mr-2" />
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
                  <Select>
                    <SelectTrigger className="bg-white/5 border-white/10 text-white">
                      <SelectValue placeholder="Selecione o caminhão" />
                    </SelectTrigger>
                    <SelectContent className="bg-card border-white/10 text-white">
                      <SelectItem value="abc">ABC-1234</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="liters">Litros</Label>
                    <Input id="liters" type="number" placeholder="0.00" className="bg-white/5 border-white/10" required />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="price">Valor Total</Label>
                    <Input id="price" placeholder="R$ 0,00" className="bg-white/5 border-white/10" required />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Tipo de Diesel</Label>
                    <Select>
                      <SelectTrigger className="bg-white/5 border-white/10 text-white">
                        <SelectValue placeholder="Tipo" />
                      </SelectTrigger>
                      <SelectContent className="bg-card border-white/10 text-white">
                        <SelectItem value="s10">Diesel S10</SelectItem>
                        <SelectItem value="s500">Diesel S500</SelectItem>
                        <SelectItem value="arla">Arla 32</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="station">Posto</Label>
                    <Input id="station" placeholder="Nome do Posto" className="bg-white/5 border-white/10" required />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="km">KM Atual</Label>
                  <Input id="km" type="number" placeholder="0" className="bg-white/5 border-white/10" required />
                </div>
                <DialogFooter className="pt-4">
                  <Button type="button" variant="ghost" onClick={() => setIsOpen(false)} className="text-muted-foreground hover:text-white">Cancelar</Button>
                  <Button type="submit" className="bg-primary text-primary-foreground neon-glow font-bold px-8">SALVAR REGISTRO</Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="bg-card border-white/5">
            <CardContent className="p-6 flex items-center gap-4">
              <div className="bg-primary/20 p-3 rounded-xl">
                <Fuel className="h-6 w-6 text-primary" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground uppercase font-bold tracking-wider">Litros (Mês)</p>
                <p className="text-2xl font-headline font-bold">0 L</p>
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
                <p className="text-2xl font-headline font-bold">0 km/L</p>
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
                <p className="text-2xl font-headline font-bold">R$ 0</p>
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
              <Input placeholder="Filtrar por placa..." className="pl-10 bg-white/5 h-9 border-white/10" />
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
              {fuelLogs.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-10 text-muted-foreground">Nenhum registro de abastecimento encontrado.</TableCell>
                </TableRow>
              ) : fuelLogs.map((log) => (
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
