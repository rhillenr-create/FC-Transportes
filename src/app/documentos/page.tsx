
"use client"

import { DashboardLayout } from "@/components/layout/DashboardLayout"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { FileText, Download, Clock, AlertCircle, Search, Filter } from "lucide-react"
import { Input } from "@/components/ui/input"

const documents = [
  { id: 1, name: "CRLV - Volvo FH 540 (ABC-1234)", type: "Veículo", expiry: "20/05/2025", status: "Próximo ao Vencimento" },
  { id: 2, name: "Apólice de Seguro Porto - Frota", type: "Seguros", expiry: "15/12/2025", status: "Vigente" },
  { id: 3, name: "Licenciamento Anual 2024 - Todos", type: "Legal", expiry: "30/11/2025", status: "Vigente" },
  { id: 4, name: "Exame Toxicológico - João Silva", type: "Motorista", expiry: "12/04/2025", status: "Vencido" },
]

export default function DocumentsPage() {
  return (
    <DashboardLayout>
      <div className="space-y-8">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-headline font-bold text-white">Gestão de Documentos</h2>
            <p className="text-muted-foreground">Controle centralizado de toda a documentação legal.</p>
          </div>
          <Button className="neon-glow font-bold">
            <FileText className="h-4 w-4 mr-2" />
            NOVO DOCUMENTO
          </Button>
        </div>

        <div className="flex items-center gap-4">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input placeholder="Buscar documento..." className="pl-10 bg-white/5 border-white/10" />
          </div>
          <Button variant="outline" className="border-white/10 bg-white/5">
            <Filter className="h-4 w-4 mr-2" />
            FILTRAR POR TIPO
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {documents.map((doc) => (
            <Card key={doc.id} className="bg-card border-white/5 group hover:border-primary/20 transition-all duration-300">
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-4">
                    <div className="p-3 rounded-xl bg-primary/10 text-primary">
                      <FileText className="h-6 w-6" />
                    </div>
                    <div className="space-y-1">
                      <span className="text-[10px] font-bold uppercase text-muted-foreground tracking-widest">{doc.type}</span>
                      <h3 className="font-bold text-white group-hover:text-primary transition-colors">{doc.name}</h3>
                      <div className="flex items-center gap-4 pt-2">
                        <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                          <Clock className="h-3 w-3" />
                          Vencimento: {doc.expiry}
                        </div>
                        <span className={`text-[10px] font-bold uppercase flex items-center gap-1 ${
                          doc.status === "Vencido" ? "text-red-500" : 
                          doc.status === "Próximo ao Vencimento" ? "text-orange-500" : 
                          "text-primary"
                        }`}>
                          {doc.status === "Vencido" && <AlertCircle className="h-3 w-3" />}
                          {doc.status}
                        </span>
                      </div>
                    </div>
                  </div>
                  <Button variant="ghost" size="icon" className="hover:bg-primary/20 hover:text-primary">
                    <Download className="h-4 w-4" />
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
