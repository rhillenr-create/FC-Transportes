
"use client"

import { useState } from "react"
import { DashboardLayout } from "@/components/layout/DashboardLayout"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { 
  ClipboardCheck, 
  Camera, 
  CheckCircle2, 
  AlertCircle,
  Loader2,
  Wrench,
  Stethoscope
} from "lucide-react"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/hooks/use-toast"
import { intelligentMaintenanceDiagnostics } from "@/ai/flows/intelligent-maintenance-diagnostics"
import { cn } from "@/lib/utils"

const checklistItems = [
  { id: 'pneus', label: 'Pneus e Calibragem', category: 'Mecânica' },
  { id: 'oleo', label: 'Nível de Óleo', category: 'Mecânica' },
  { id: 'agua', label: 'Sistema de Arrefecimento', category: 'Mecânica' },
  { id: 'freios', label: 'Sistema de Freios', category: 'Mecânica' },
  { id: 'luzes', label: 'Faróis e Lanternas', category: 'Elétrica' },
  { id: 'doc', label: 'Documentação CRLV/CNH', category: 'Legal' },
  { id: 'seguranca', label: 'Extintor e Triângulo', category: 'Segurança' },
]

export default function ChecklistPage() {
  const { toast } = useToast()
  const [step, setStep] = useState<'start' | 'form' | 'result'>('start')
  const [results, setResults] = useState<Record<string, 'ok' | 'issue'>>({})
  const [observations, setObservations] = useState<Record<string, string>>({})
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [aiAnalysis, setAiAnalysis] = useState<any>(null)

  const handleStatusChange = (id: string, status: 'ok' | 'issue') => {
    setResults(prev => ({ ...prev, [id]: status }))
  }

  const handleFinalize = async () => {
    setIsAnalyzing(true)
    
    const log = checklistItems.map(item => {
      const status = results[item.id] || 'N/A'
      const obs = observations[item.id] ? ` (Obs: ${observations[item.id]})` : ''
      return `${item.label}: ${status}${obs}`
    }).join('\n')

    try {
      const diagnosis = await intelligentMaintenanceDiagnostics({
        checklistLog: log
      })
      setAiAnalysis(diagnosis)
      setStep('result')
      toast({
        title: "Checklist Finalizado",
        description: "Diagnóstico inteligente gerado com sucesso."
      })
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Erro na análise",
        description: "Não foi possível gerar o diagnóstico de IA."
      })
    } finally {
      setIsAnalyzing(false)
    }
  }

  if (step === 'start') {
    return (
      <DashboardLayout>
        <div className="max-w-4xl mx-auto py-12 text-center space-y-8">
          <div className="inline-flex items-center justify-center bg-primary/20 p-6 rounded-3xl border border-primary/30 neon-glow">
            <ClipboardCheck className="w-16 h-16 text-primary" />
          </div>
          <div className="space-y-4">
            <h1 className="text-4xl font-headline font-bold text-white">Inspeção Pré-Viagem</h1>
            <p className="text-muted-foreground text-lg max-w-xl mx-auto">
              Inicie o checklist obrigatório para garantir a segurança da operação e a longevidade da frota.
            </p>
          </div>
          <Button size="lg" className="h-14 px-12 text-lg font-bold neon-glow" onClick={() => setStep('form')}>
            INICIAR CHECKLIST AGORA
          </Button>
        </div>
      </DashboardLayout>
    )
  }

  if (step === 'result') {
    return (
      <DashboardLayout>
        <div className="max-w-4xl mx-auto space-y-8 animate-in slide-in-from-bottom-4 duration-500">
          <div className="flex items-center justify-between">
            <h2 className="text-3xl font-headline font-bold text-white flex items-center gap-3">
              <Stethoscope className="text-primary h-8 w-8" />
              Diagnóstico Inteligente
            </h2>
            <Button variant="outline" onClick={() => setStep('start')}>NOVA INSPEÇÃO</Button>
          </div>

          <Card className="bg-card border-white/5 overflow-hidden">
             <div className={cn(
               "h-2",
               aiAnalysis?.severity === 'critical' ? "bg-red-500" :
               aiAnalysis?.severity === 'high' ? "bg-orange-500" :
               aiAnalysis?.severity === 'medium' ? "bg-yellow-500" : "bg-primary"
             )} />
             <CardContent className="p-8 space-y-6">
               <div className="flex items-center justify-between">
                 <h3 className="text-xl font-bold uppercase tracking-wider text-muted-foreground">Status de Severidade</h3>
                 <span className={cn(
                   "px-4 py-2 rounded-full text-sm font-bold uppercase tracking-widest",
                   aiAnalysis?.severity === 'critical' ? "bg-red-500 text-white" :
                   aiAnalysis?.severity === 'high' ? "bg-orange-500 text-white" :
                   aiAnalysis?.severity === 'medium' ? "bg-yellow-500 text-black" : "bg-primary text-black"
                 )}>
                   {aiAnalysis?.severity || 'LOW'}
                 </span>
               </div>

               <div className="space-y-4">
                 <h4 className="font-headline font-bold text-lg text-primary flex items-center gap-2">
                   <AlertCircle className="h-5 w-5" />
                   Insights Diagnósticos
                 </h4>
                 <p className="text-muted-foreground leading-relaxed">{aiAnalysis?.diagnosticInsights}</p>
               </div>

               <div className="space-y-4">
                 <h4 className="font-headline font-bold text-lg text-accent flex items-center gap-2">
                   <Wrench className="h-5 w-5" />
                   Recomendações de Manutenção
                 </h4>
                 <p className="text-muted-foreground leading-relaxed">{aiAnalysis?.maintenanceRecommendations}</p>
               </div>
             </CardContent>
          </Card>
        </div>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout>
      <div className="max-w-4xl mx-auto space-y-8">
        <div>
          <h2 className="text-3xl font-headline font-bold text-white">Checklist Operacional</h2>
          <p className="text-muted-foreground">Preencha todos os itens com atenção.</p>
        </div>

        <div className="space-y-6">
          {checklistItems.map((item) => (
            <Card key={item.id} className="bg-card border-white/5 group hover:border-primary/20 transition-all duration-300">
              <CardContent className="p-6">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                  <div className="space-y-1">
                    <span className="text-[10px] font-bold uppercase text-primary tracking-widest">{item.category}</span>
                    <h3 className="text-lg font-bold">{item.label}</h3>
                  </div>
                  
                  <div className="flex items-center gap-4">
                    <Button 
                      onClick={() => handleStatusChange(item.id, 'ok')}
                      variant={results[item.id] === 'ok' ? "default" : "outline"}
                      className={cn(
                        "flex-1 md:flex-none font-bold",
                        results[item.id] === 'ok' && "bg-primary text-primary-foreground neon-glow"
                      )}
                    >
                      <CheckCircle2 className="w-4 h-4 mr-2" />
                      OK
                    </Button>
                    <Button 
                      onClick={() => handleStatusChange(item.id, 'issue')}
                      variant={results[item.id] === 'issue' ? "destructive" : "outline"}
                      className="flex-1 md:flex-none font-bold"
                    >
                      <AlertCircle className="w-4 h-4 mr-2" />
                      PROBLEMA
                    </Button>
                  </div>
                </div>

                {results[item.id] === 'issue' && (
                  <div className="mt-6 space-y-4 animate-in fade-in slide-in-from-top-2 duration-300">
                    <div className="space-y-2">
                      <Label className="text-xs uppercase text-muted-foreground font-bold">Observações do Problema</Label>
                      <Textarea 
                        placeholder="Descreva o que foi identificado..." 
                        className="bg-white/5 border-white/10"
                        value={observations[item.id] || ''}
                        onChange={(e) => setObservations(prev => ({ ...prev, [item.id]: e.target.value }))}
                      />
                    </div>
                    <Button variant="secondary" className="w-full bg-white/5 border border-white/10 hover:bg-white/10 text-xs h-10">
                      <Camera className="w-4 h-4 mr-2" />
                      ANEXAR FOTO DO PROBLEMA
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="pt-8 pb-12 flex justify-end">
          <Button 
            size="lg" 
            className="h-14 px-12 text-lg font-bold neon-glow w-full md:w-auto"
            onClick={handleFinalize}
            disabled={isAnalyzing || Object.keys(results).length < checklistItems.length}
          >
            {isAnalyzing ? (
              <>
                <Loader2 className="animate-spin mr-2" />
                ANALISANDO COM IA...
              </>
            ) : (
              "FINALIZAR E ANALISAR"
            )}
          </Button>
        </div>
      </div>
    </DashboardLayout>
  )
}
