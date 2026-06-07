
"use client"

import { useState, useEffect } from "react"
import { DashboardLayout } from "@/components/layout/DashboardLayout"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { 
  Plus, 
  Search, 
  Trash2, 
  Star, 
  ShieldCheck, 
  Loader2,
  Edit
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
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useFirestore, useCollection, useMemoFirebase } from "@/firebase"
import { collection, addDoc, serverTimestamp, query, orderBy, deleteDoc, doc, updateDoc } from "firebase/firestore"
import { useToast } from "@/hooks/use-toast"
import { errorEmitter } from "@/firebase/error-emitter"
import { FirestorePermissionError } from "@/firebase/errors"
import { cn } from "@/lib/utils"

export default function DriversPage() {
  const db = useFirestore()
  const { toast } = useToast()
  const [mounted, setMounted] = useState(false)
  const [isOpen, setIsOpen] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const [editingId, setEditingId] = useState<string | null>(null)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [recordToDelete, setRecordToDelete] = useState<{id: string, name: string} | null>(null)

  useEffect(() => {
    setMounted(true)
  }, [])

  // Form state
  const [formData, setFormData] = useState({
    name: "",
    cnh: "",
    category: "E",
    status: "Disponível",
    score: 5.0
  })

  // Fetch Drivers
  const driversQuery = useMemoFirebase(() => {
    return query(collection(db, "drivers"), orderBy("createdAt", "desc"))
  }, [db])
  const { data: drivers, loading } = useCollection(driversQuery)

  const resetForm = () => {
    setEditingId(null)
    setFormData({
      name: "",
      cnh: "",
      category: "E",
      status: "Disponível",
      score: 5.0
    })
  }

  const handleEdit = (driver: any) => {
    setEditingId(driver.id)
    setFormData({
      name: driver.name,
      cnh: driver.cnh,
      category: driver.category,
      status: driver.status,
      score: driver.score
    })
    setIsOpen(true)
  }

  const handleDeleteClick = (id: string, name: string) => {
    setRecordToDelete({ id, name })
    setIsDeleteDialogOpen(true)
  }

  const confirmDelete = () => {
    if (!recordToDelete) return

    deleteDoc(doc(db, "drivers", recordToDelete.id))
      .then(() => {
        toast({
          title: "Cadastro Removido",
          description: `O motorista ${recordToDelete.name} foi excluído do sistema.`
        })
      })
      .catch(async () => {
        const permissionError = new FirestorePermissionError({
          path: `drivers/${recordToDelete.id}`,
          operation: "delete"
        })
        errorEmitter.emit("permission-error", permissionError)
      })
      .finally(() => {
        setIsDeleteDialogOpen(false)
        setRecordToDelete(null)
      })
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    const payload = {
      ...formData,
      score: Number(formData.score),
      updatedAt: serverTimestamp()
    }

    if (editingId) {
      updateDoc(doc(db, "drivers", editingId), payload)
        .then(() => {
          setIsOpen(false)
          resetForm()
          toast({
            title: "Cadastro Atualizado",
            description: "Os dados do motorista foram atualizados com sucesso."
          })
        })
        .catch(async () => {
          const permissionError = new FirestorePermissionError({
            path: `drivers/${editingId}`,
            operation: "update",
            requestResourceData: payload
          })
          errorEmitter.emit("permission-error", permissionError)
        })
        .finally(() => setIsSubmitting(false))
    } else {
      const newPayload = { ...payload, createdAt: serverTimestamp() }
      addDoc(collection(db, "drivers"), newPayload)
        .then(() => {
          setIsOpen(false)
          resetForm()
          toast({
            title: "Motorista Cadastrado",
            description: "O condutor foi adicionado ao sistema com sucesso."
          })
        })
        .catch(async () => {
          const permissionError = new FirestorePermissionError({
            path: "drivers",
            operation: "create",
            requestResourceData: newPayload
          })
          errorEmitter.emit("permission-error", permissionError)
        })
        .finally(() => setIsSubmitting(false))
    }
  }

  const filteredDrivers = drivers?.filter(d => 
    d.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    d.cnh.toLowerCase().includes(searchTerm.toLowerCase())
  )

  if (!mounted) return null

  return (
    <DashboardLayout>
      <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <h2 className="text-4xl font-headline font-bold text-white tracking-tight">Gestão de Motoristas</h2>
            <p className="text-muted-foreground text-sm uppercase tracking-widest font-medium">Controle de condutores e performance operacional</p>
          </div>
          
          <Dialog open={isOpen} onOpenChange={(open) => { if (!open) resetForm(); setIsOpen(open); }}>
            <DialogTrigger asChild>
              <Button className="neon-glow font-bold h-12 px-8 rounded-xl bg-primary text-primary-foreground">
                <Plus className="w-5 h-5 mr-2" />
                CADASTRAR MOTORISTA
              </Button>
            </DialogTrigger>
            <DialogContent className="bg-card border-white/10 text-white max-w-xl rounded-[2rem]">
              <DialogHeader>
                <DialogTitle className="text-2xl font-headline font-bold text-primary">
                  {editingId ? "Editar Cadastro" : "Novo Cadastro de Motorista"}
                </DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-6 py-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Nome Completo</Label>
                  <Input 
                    id="name" 
                    placeholder="Ex: João da Silva" 
                    className="bg-white/5 border-white/10" 
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    required 
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="cnh">Número da CNH</Label>
                    <Input 
                      id="cnh" 
                      placeholder="00000000000" 
                      className="bg-white/5 border-white/10" 
                      value={formData.cnh}
                      onChange={(e) => setFormData({...formData, cnh: e.target.value})}
                      required 
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Categoria</Label>
                    <Select value={formData.category} onValueChange={(v) => setFormData({...formData, category: v})}>
                      <SelectTrigger className="bg-white/5 border-white/10 text-white">
                        <SelectValue placeholder="Selecione" />
                      </SelectTrigger>
                      <SelectContent className="bg-card border-white/10 text-white">
                        <SelectItem value="A">Categoria A</SelectItem>
                        <SelectItem value="B">Categoria B</SelectItem>
                        <SelectItem value="C">Categoria C</SelectItem>
                        <SelectItem value="D">Categoria D</SelectItem>
                        <SelectItem value="E">Categoria E</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Status Atual</Label>
                    <Select value={formData.status} onValueChange={(v) => setFormData({...formData, status: v})}>
                      <SelectTrigger className="bg-white/5 border-white/10 text-white">
                        <SelectValue placeholder="Status" />
                      </SelectTrigger>
                      <SelectContent className="bg-card border-white/10 text-white">
                        <SelectItem value="Disponível">Disponível</SelectItem>
                        <SelectItem value="Em Viagem">Em Viagem</SelectItem>
                        <SelectItem value="Inativo">Inativo</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="score">Score Performance (0-5)</Label>
                    <Input 
                      id="score" 
                      type="number"
                      step="0.1"
                      min="0"
                      max="5"
                      className="bg-white/5 border-white/10" 
                      value={formData.score}
                      onChange={(e) => setFormData({...formData, score: parseFloat(e.target.value)})}
                      required 
                    />
                  </div>
                </div>
                <DialogFooter className="pt-4">
                  <Button type="button" variant="ghost" onClick={() => setIsOpen(false)} className="text-muted-foreground hover:text-white">Cancelar</Button>
                  <Button type="submit" disabled={isSubmitting} className="bg-primary text-primary-foreground neon-glow font-bold px-8">
                    {isSubmitting ? <Loader2 className="animate-spin h-4 w-4 mr-2" /> : null}
                    {editingId ? "SALVAR ALTERAÇÕES" : "SALVAR CADASTRO"}
                  </Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        <div className="glass-card rounded-[2.5rem] overflow-hidden border-white/5">
          <div className="p-8 border-b border-white/5 flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="relative w-full max-w-md">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input 
                placeholder="Buscar por nome ou CNH..." 
                className="pl-12 h-12 bg-white/5 border-white/10 rounded-xl"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader className="bg-white/5">
                <TableRow className="border-white/5 hover:bg-transparent h-16">
                  <TableHead className="text-[10px] uppercase font-bold text-muted-foreground pl-8">Motorista</TableHead>
                  <TableHead className="text-[10px] uppercase font-bold text-muted-foreground">CNH / Categoria</TableHead>
                  <TableHead className="text-[10px] uppercase font-bold text-muted-foreground">Score Performance</TableHead>
                  <TableHead className="text-[10px] uppercase font-bold text-muted-foreground">Status Atual</TableHead>
                  <TableHead className="text-right text-[10px] uppercase font-bold text-muted-foreground pr-8">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center py-12 text-muted-foreground">
                      <Loader2 className="animate-spin h-8 w-8 mx-auto mb-2 opacity-20" />
                      Carregando banco de dados...
                    </TableCell>
                  </TableRow>
                ) : !filteredDrivers || filteredDrivers.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center py-12 text-muted-foreground font-bold uppercase tracking-widest italic">Nenhum motorista encontrado.</TableCell>
                  </TableRow>
                ) : filteredDrivers.map((driver) => (
                  <TableRow key={driver.id} className="border-white/5 table-row-hover h-24">
                    <TableCell className="pl-8">
                      <div className="flex items-center gap-4">
                        <Avatar className="h-12 w-12 border border-white/10">
                          <AvatarImage src={`https://picsum.photos/seed/${driver.id}/100`} />
                          <AvatarFallback className="bg-primary/10 text-primary font-bold">{driver.name[0]}</AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-bold text-white text-base">{driver.name}</p>
                          <p className="text-[10px] text-muted-foreground uppercase font-bold tracking-widest">ID: {driver.id.slice(0, 6)}</p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="space-y-1">
                        <p className="font-medium text-white/90">{driver.cnh}</p>
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-primary/20 text-primary uppercase border border-primary/20">CAT {driver.category}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <Star className="h-4 w-4 text-accent fill-accent" />
                        <span className="font-bold text-lg">{driver.score}</span>
                        {driver.score >= 4.8 && <ShieldCheck className="h-4 w-4 text-primary ml-2" />}
                      </div>
                    </TableCell>
                    <TableCell>
                      <span className={cn(
                        "px-4 py-1.5 rounded-full text-[9px] font-bold uppercase tracking-widest border",
                        driver.status === "Disponível" ? "bg-primary/10 text-primary border-primary/20" : 
                        driver.status === "Em Viagem" ? "bg-accent/10 text-accent border-accent/20" : 
                        "bg-white/10 text-white border-white/20"
                      )}>
                        {driver.status}
                      </span>
                    </TableCell>
                    <TableCell className="text-right pr-8">
                      <div className="flex items-center justify-end gap-2">
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          onClick={() => handleEdit(driver)}
                          className="h-10 w-10 rounded-xl hover:bg-white/10 hover:text-primary transition-colors"
                        >
                          <Edit className="h-5 w-5" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          onClick={() => handleDeleteClick(driver.id, driver.name)}
                          className="h-10 w-10 rounded-xl hover:bg-white/10 hover:text-red-500 transition-colors"
                        >
                          <Trash2 className="h-5 w-5" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>
      </div>

      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent className="bg-card border-white/10 text-white rounded-[2rem]">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-2xl font-headline font-bold text-primary">Confirmar Exclusão</AlertDialogTitle>
            <AlertDialogDescription className="text-muted-foreground">
              Você tem certeza que deseja excluir o motorista <strong>{recordToDelete?.name}</strong>? Esta ação não pode ser desfeita.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="bg-white/5 border-white/10 text-white hover:bg-white/10 rounded-xl">Cancelar</AlertDialogCancel>
            <AlertDialogAction 
              onClick={confirmDelete}
              className="bg-red-500 text-white hover:bg-red-600 neon-glow font-bold rounded-xl"
            >
              EXCLUIR CADASTRO
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </DashboardLayout>
  )
}
