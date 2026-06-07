
"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { Mail, Lock, Loader2, UserPlus, LogIn } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { signInWithEmailAndPassword, createUserWithEmailAndPassword } from "firebase/auth"
import { useAuth } from "@/firebase"
import { useToast } from "@/hooks/use-toast"
import { cn } from "@/lib/utils"
import { PlaceHolderImages } from "@/lib/placeholder-images"

export default function LoginPage() {
  const router = useRouter()
  const auth = useAuth()
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(false)
  const [isRegistering, setIsRegistering] = useState(false)
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")

  const logoImage = PlaceHolderImages.find(img => img.id === 'app-logo')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!auth) return

    setIsLoading(true)
    try {
      if (isRegistering) {
        await createUserWithEmailAndPassword(auth, email, password)
        toast({
          title: "Conta criada com sucesso!",
          description: "Você já pode acessar o sistema FC Frota."
        })
        setIsRegistering(false)
      } else {
        await signInWithEmailAndPassword(auth, email, password)
        router.push("/dashboard")
      }
    } catch (error: any) {
      console.error(error)
      let message = "E-mail ou senha incorretos."
      if (error.code === 'auth/email-already-in-use') message = "Este e-mail já está em uso."
      if (error.code === 'auth/weak-password') message = "A senha deve ter pelo menos 6 caracteres."
      
      toast({
        variant: "destructive",
        title: isRegistering ? "Erro no cadastro" : "Erro no login",
        description: message
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-[radial-gradient(circle_at_top_right,rgba(0,255,136,0.08),transparent_40%),radial-gradient(circle_at_bottom_left,rgba(204,255,0,0.05),transparent_40%),#040505]">
      <div className="w-full max-w-[420px] space-y-12 animate-in zoom-in-95 duration-700">
        <div className="text-center space-y-6">
          <div className="inline-flex items-center justify-center bg-white/5 p-4 rounded-[2rem] border border-primary/30 neon-glow relative w-28 h-28 mx-auto overflow-hidden">
            <Image 
              src={logoImage?.imageUrl || "https://picsum.photos/seed/fclogo/200/200"} 
              alt={logoImage?.description || "FC Logo"} 
              fill 
              className="object-contain p-3"
              data-ai-hint={logoImage?.imageHint || "industrial logo"}
            />
          </div>
          <div className="space-y-2">
            <h1 className="text-5xl font-headline font-bold text-white tracking-tighter">FC FROTA</h1>
            <p className="text-primary font-bold tracking-[0.3em] text-[10px] uppercase">
              {isRegistering ? "Cadastro de Novo Acesso" : "Controle de Logística Avançado"}
            </p>
          </div>
        </div>

        <div className="glass-card p-10 rounded-[2.5rem] relative overflow-hidden group">
          <form onSubmit={handleSubmit} className="space-y-8 relative z-10">
            <div className="space-y-3">
              <Label htmlFor="email" className="text-xs font-bold uppercase tracking-widest text-muted-foreground ml-1">E-mail Corporativo</Label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
                <Input 
                  id="email" 
                  type="email" 
                  placeholder="exemplo@fctransportes.com.br" 
                  className="h-14 pl-12 bg-white/5 border-white/10 rounded-2xl focus:ring-primary/30"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required 
                />
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between ml-1">
                <Label htmlFor="password" className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Senha de Acesso</Label>
                {!isRegistering && (
                  <button type="button" className="text-[10px] text-primary font-bold hover:underline uppercase tracking-tighter">Recuperar Senha</button>
                )}
              </div>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
                <Input 
                  id="password" 
                  type="password" 
                  placeholder="••••••••" 
                  className="h-14 pl-12 bg-white/5 border-white/10 rounded-2xl focus:ring-primary/30"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required 
                />
              </div>
            </div>

            <div className="space-y-4">
              <Button 
                type="submit" 
                className="w-full h-16 text-lg font-bold neon-glow rounded-2xl bg-primary text-primary-foreground hover:scale-[1.02] active:scale-[0.98] transition-all" 
                disabled={isLoading}
              >
                {isLoading ? (
                  <Loader2 className="animate-spin h-6 w-6" />
                ) : (
                  isRegistering ? "CADASTRAR AGORA" : "ENTRAR NO SISTEMA"
                )}
              </Button>

              <button
                type="button"
                onClick={() => setIsRegistering(!isRegistering)}
                className="w-full text-center text-[10px] font-bold text-muted-foreground hover:text-white uppercase tracking-widest flex items-center justify-center gap-2"
              >
                {isRegistering ? (
                  <><LogIn className="h-3 w-3" /> Já tenho uma conta</>
                ) : (
                  <><UserPlus className="h-3 w-3" /> Criar nova conta de acesso</>
                )}
              </button>
            </div>
          </form>
        </div>

        <p className="text-center text-[10px] text-muted-foreground uppercase font-bold tracking-[0.2em]">
          Software Exclusivo de Gestão <br/>
          <span className="text-white/40">FC Construções e Transportes © 2025</span>
        </p>
      </div>
    </div>
  )
}
