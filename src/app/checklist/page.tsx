
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
  Stethoscope,
  ChevronLeft
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
        <div className="max-w-4xl mx-auto py-8 md:py-20 text-center space-y-8 px-4">
          <div className="inline-flex items-center justify-center bg-primary/10 p-6 md:p-8 rounded-[2.5rem] border border-primary/20 neon-glow">
            <ClipboardCheck className="w-16 h-16 md:w-20 md:h-20 text-primary" />
          </div>
          <div className="space-y-4">
            <h1 className="text-3xl md:text-5xl font-headline font-bold text-white tracking-tighter">Inspeção Pré-Viagem</h1>
            <p className="text-muted-foreground text-sm md:text-lg max-w-xl mx-auto uppercase tracking-widest font-medium">
              Checklist obrigatório para segurança operacional.
            </p>
          </div>
          <Button size="lg" className="h-16 px-12 text-lg font-bold neon-glow rounded-2xl w-full md:w-auto" onClick={() => setStep('form')}>
            INICIAR AGORA
          </Button>
        </div>
      </DashboardLayout>
    )
  }

  if (step === 'result') {
    return (
      <DashboardLayout>
        <div className="max-w-4xl mx-auto space-y-6 md:space-y-8 animate-in slide-in-from-bottom-6 duration-700 px-4">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <h2 className="text-2xl md:text-3xl font-headline font-bold text-white flex items-center gap-3">
              <Stethoscope className="text-primary h-7 w-7 md:h-8 md:w-8" />
              Diagnóstico IA
            </h2>
            <Button variant="outline" className="w-full md:w-auto rounded-xl border-white/10" onClick={() => setStep('start')}>NOVA INSPEÇÃO</Button>
          </div>

          <Card className="bg-card border-white/5 overflow-hidden rounded-[2.5rem]">
             <div className={cn(
               "h-2.5",
               aiAnalysis?.severity === 'critical' ? "bg-red-500" :
               aiAnalysis?.severity === 'high' ? "bg-orange-500" :
               aiAnalysis?.severity === 'medium' ? "bg-yellow-500" : "bg-primary"
             )} />
             <CardContent className="p-6 md:p-10 space-y-8">
               <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                 <h3 className="text-xs font-bold uppercase tracking-[0.3em] text-muted-foreground">Status de Urgência</h3>
                 <span className={cn(
                   "px-6 py-2.5 rounded-full text-xs font-bold uppercase tracking-widest text-center",
                   aiAnalysis?.severity === 'critical' ? "bg-red-500 text-white" :
                   aiAnalysis?.severity === 'high' ? "bg-orange-500 text-white" :
                   aiAnalysis?.severity === 'medium' ? "bg-yellow-500 text-black" : "bg-primary text-black"
                 )}>
                   {aiAnalysis?.severity || 'LOW'}
                 </span>
               </div>

               <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
                 <div className="space-y-4">
                   <h4 className="font-headline font-bold text-lg text-primary flex items-center gap-2">
                     <AlertCircle className="h-5 w-5" />
                     Insights
                   </h4>
                   <p className="text-muted-foreground leading-relaxed text-sm md:text-base">{aiAnalysis?.diagnosticInsights}</p>
                 </div>

                 <div className="space-y-4">
                   <h4 className="font-headline font-bold text-lg text-accent flex items-center gap-2">
                     <Wrench className="h-5 w-5" />
                     Manutenção
                   </h4>
                   <p className="text-muted-foreground leading-relaxed text-sm md:text-base">{aiAnalysis?.maintenanceRecommendations}</p>
                 </div>
               </div>
             </CardContent>
          </Card>
        </div>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout>
      <div className="max-w-4xl mx-auto space-y-6 md:space-y-8 px-4 pb-20">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => setStep('start')} className="rounded-full bg-white/5 border border-white/10 lg:hidden">
            <ChevronLeft className="h-5 w-5" />
          </Button>
          <div>
            <h2 className="text-2xl md:text-3xl font-headline font-bold text-white tracking-tight">Formulário de Inspeção</h2>
            <p className="text-muted-foreground text-xs uppercase tracking-widest font-medium">Verificação detalhada de componentes</p>
          </div>
        </div>

        <div className="space-y-4 md:space-y-6">
          {checklistItems.map((item) => (
            <Card key={item.id} className="bg-card border-white/5 rounded-[2rem] overflow-hidden group transition-all duration-300">
              <CardContent className="p-5 md:p-8">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                  <div className="space-y-1">
                    <span className="text-[10px] font-bold uppercase text-primary/70 tracking-[0.2em]">{item.category}</span>
                    <h3 className="text-lg md:text-xl font-bold tracking-tight">{item.label}</h3>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <Button 
                      onClick={() => handleStatusChange(item.id, 'ok')}
                      variant={results[item.id] === 'ok' ? "default" : "outline"}
                      className={cn(
                        "flex-1 md:flex-none h-12 md:h-14 md:px-10 font-bold rounded-2xl transition-all",
                        results[item.id] === 'ok' ? "bg-primary text-primary-foreground neon-glow scale-105" : "border-white/10"
                      )}
                    >
                      <CheckCircle2 className="w-5 h-5 md:mr-2" />
                      <span className="hidden md:inline">TUDO OK</span>
                      <span className="md:hidden">OK</span>
                    </Button>
                    <Button 
                      onClick={() => handleStatusChange(item.id, 'issue')}
                      variant={results[item.id] === 'issue' ? "destructive" : "outline"}
                      className={cn(
                        "flex-1 md:flex-none h-12 md:h-14 md:px-10 font-bold rounded-2xl transition-all",
                        results[item.id] === 'issue' ? "bg-red-500 scale-105" : "border-white/10"
                      )}
                    >
                      <AlertCircle className="w-5 h-5 md:mr-2" />
                      <span className="hidden md:inline">PROBLEMA</span>
                      <span className="md:hidden">AVARIA</span>
                    </Button>
                  </div>
                </div>

                {results[item.id] === 'issue' && (
                  <div className="mt-8 space-y-6 animate-in fade-in slide-in-from-top-4 duration-500">
                    <div className="space-y-2">
                      <Label className="text-[10px] uppercase text-muted-foreground font-bold tracking-[0.2em] ml-1">Observações do Motorista</Label>
                      <Textarea 
                        placeholder="Descreva o problema identificado..." 
                        className="bg-white/5 border-white/10 rounded-2xl min-h-[100px] md:min-h-[120px] p-4 text-sm"
                        value={observations[item.id] || ''}
                        onChange={(e) => setObservations(prev => ({ ...prev, [item.id]: e.target.value }))}
                      />
                    </div>
                    <Button variant="secondary" className="w-full h-12 rounded-xl bg-white/5 border border-white/10 text-xs font-bold uppercase tracking-widest">
                      <Camera className="w-4 h-4 mr-2" />
                      ANEXAR EVIDÊNCIA FOTOGRÁFICA
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="pt-10 pb-20 flex justify-end">
          <Button 
            size="lg" 
            className="h-16 px-16 text-lg font-bold neon-glow w-full md:w-auto rounded-[2rem]"
            onClick={handleFinalize}
            disabled={isAnalyzing || Object.keys(results).length < checklistItems.length}
          >
            {isAnalyzing ? (
              <>
                <Loader2 className="animate-spin mr-3 h-6 w-6" />
                PROCESSANDO IA...
              </>
            ) : (
              "FINALIZAR INSPEÇÃO"
            )}
          </Button>
        </div>
      </div>
    </DashboardLayout>
  )
}
