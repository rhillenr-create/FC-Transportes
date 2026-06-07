
"use client"

import { useState } from "react"
import { DashboardLayout } from "@/components/layout/DashboardLayout"
import { PageHeader } from "@/components/app/PageHeader"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { FileText, Download, Clock, AlertCircle, Search, Filter, Plus } from "lucide-react"
import { Input } from "@/components/ui/input"
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

export default function DocumentsPage() {
  const [isOpen, setIsOpen] = useState(false)
  const [documents, setDocuments] = useState<any[]>([]) // Começa vazio para testes
  const { toast } = useToast()

  const handleAddDocument = (e: React.FormEvent) => {
    e.preventDefault()
    setIsOpen(false)
    toast({
      title: "Documento Enviado",
      description: "O novo documento foi processado e adicionado à biblioteca com sucesso.",
    })
  }

  return (
    <DashboardLayout>
      <div className="space-y-8 max-w-[1600px] mx-auto animate-in fade-in slide-in-from-bottom-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <PageHeader
            title="Gestão de Documentos"
            description="Controle centralizado de toda a documentação legal"
          />
          
          <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
              <Button className="neon-glow font-bold h-12 px-8 rounded-xl bg-primary text-primary-foreground">
                <Plus className="h-4 w-4 mr-2" />
                NOVO DOCUMENTO
              </Button>
            </DialogTrigger>
            <DialogContent className="bg-card border-white/10 text-white max-w-xl rounded-[2rem]">
              <DialogHeader>
                <DialogTitle className="text-2xl font-headline font-bold text-primary">Upload de Novo Documento</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleAddDocument} className="space-y-6 py-4">
                <div className="space-y-2">
                  <Label htmlFor="doc-name">Nome do Documento</Label>
                  <Input id="doc-name" placeholder="Ex: CRLV Volvo 2024" className="bg-white/5 border-white/10" required />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Tipo de Documento</Label>
                    <Select>
                      <SelectTrigger className="bg-white/5 border-white/10 text-white">
                        <SelectValue placeholder="Selecione" />
                      </SelectTrigger>
                      <SelectContent className="bg-card border-white/10 text-white">
                        <SelectItem value="veiculo">Veículo (CRLV)</SelectItem>
                        <SelectItem value="motorista">Motorista (CNH/Exame)</SelectItem>
                        <SelectItem value="seguro">Seguros</SelectItem>
                        <SelectItem value="fiscal">Documentos Fiscais</SelectItem>
                        <SelectItem value="legal">Legal / Contratos</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="expiry">Data de Vencimento</Label>
                    <Input id="expiry" type="date" className="bg-white/5 border-white/10" required />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Arquivo (PDF ou Imagem)</Label>
                  <div className="border-2 border-dashed border-white/10 rounded-2xl p-8 text-center hover:border-primary/50 transition-colors cursor-pointer group">
                    <FileText className="h-10 w-10 text-muted-foreground mx-auto mb-2 group-hover:text-primary transition-colors" />
                    <p className="text-xs text-muted-foreground font-bold uppercase tracking-widest">Clique para selecionar ou arraste o arquivo</p>
                  </div>
                </div>
                <DialogFooter className="pt-4">
                  <Button type="button" variant="ghost" onClick={() => setIsOpen(false)} className="text-muted-foreground hover:text-white">Cancelar</Button>
                  <Button type="submit" className="bg-primary text-primary-foreground neon-glow font-bold px-8">FAZER UPLOAD</Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        <div className="flex flex-col md:flex-row items-center gap-4">
          <div className="relative flex-1 w-full md:max-w-md">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input placeholder="Buscar documento por nome ou tipo..." className="pl-12 h-12 bg-white/5 border-white/10 rounded-xl" />
          </div>
          <Button variant="outline" className="w-full md:w-auto border-white/10 bg-white/5 h-12 rounded-xl">
            <Filter className="h-4 w-4 mr-2" />
            FILTRAR POR CATEGORIA
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pb-20 md:pb-0">
          {documents.length === 0 ? (
            <div className="col-span-full py-20 text-center text-muted-foreground font-bold uppercase tracking-widest border border-dashed border-white/10 rounded-[2rem]">
              Nenhum documento arquivado
            </div>
          ) : documents.map((doc) => (
            <Card key={doc.id} className="glass-card group hover:neon-border transition-all duration-300 rounded-[2rem]">
              <CardContent className="p-8">
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-5">
                    <div className="p-4 rounded-2xl bg-primary/10 text-primary group-hover:scale-110 transition-transform">
                      <FileText className="h-7 w-7" />
                    </div>
                    <div className="space-y-2">
                      <span className="text-[10px] font-bold uppercase text-muted-foreground tracking-[0.2em]">{doc.type}</span>
                      <h3 className="text-lg font-bold text-white group-hover:text-primary transition-colors">{doc.name}</h3>
                      <div className="flex flex-wrap items-center gap-6 pt-2">
                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                          <Clock className="h-3.5 w-3.5" />
                          Vencimento: <span className="text-white font-medium">{doc.expiry}</span>
                        </div>
                        <span className={`text-[10px] font-bold uppercase tracking-widest flex items-center gap-1.5 px-3 py-1 rounded-full ${
                          doc.status === "Vencido" ? "bg-red-500/10 text-red-500 border border-red-500/20" : 
                          doc.status === "Próximo ao Vencimento" ? "bg-orange-500/10 text-orange-500 border border-orange-500/20" : 
                          "bg-primary/10 text-primary border border-primary/20"
                        }`}>
                          {doc.status === "Vencido" && <AlertCircle className="h-3 w-3" />}
                          {doc.status}
                        </span>
                      </div>
                    </div>
                  </div>
                  <Button variant="ghost" size="icon" className="h-12 w-12 rounded-xl hover:bg-primary/10 hover:text-primary transition-colors">
                    <Download className="h-5 w-5" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </DashboardLayout>
  )
}
