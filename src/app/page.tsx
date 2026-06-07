
"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { Mail, Lock, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { signInWithEmailAndPassword } from "firebase/auth"
import { useAuth } from "@/firebase"
import { useToast } from "@/hooks/use-toast"

export default function LoginPage() {
  const router = useRouter()
  const auth = useAuth()
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(false)
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!auth) return

    setIsLoading(true)
    try {
      await signInWithEmailAndPassword(auth, email, password)
      router.push("/dashboard")
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Erro no login",
        description: "E-mail ou senha incorretos. Verifique suas credenciais."
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-[radial-gradient(circle_at_top_right,rgba(0,255,136,0.05),transparent_40%),radial-gradient(circle_at_bottom_left,rgba(204,255,0,0.03),transparent_40%)]">
      <div className="w-full max-w-[420px] space-y-8 animate-in zoom-in-95 duration-500">
        <div className="text-center space-y-4">
          <div className="inline-flex items-center justify-center bg-white/5 p-4 rounded-3xl border border-primary/30 neon-glow mb-2 relative w-24 h-24 mx-auto overflow-hidden">
            <Image 
              src="/logo.png" 
              alt="FC Construções Logo" 
              fill 
              className="object-contain p-2"
            />
          </div>
          <h1 className="text-4xl font-headline font-bold text-white tracking-tight">FC FROTA</h1>
          <p className="text-muted-foreground font-medium">Controle de Logística Avançado</p>
        </div>

        <div className="bg-card border border-white/5 p-8 rounded-3xl shadow-2xl relative overflow-hidden group">
          <form onSubmit={handleSubmit} className="space-y-6 relative z-10">
            <div className="space-y-2">
              <Label htmlFor="email">E-mail Corporativo</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input 
                  id="email" 
                  type="email" 
                  placeholder="seu@email.com" 
                  className="pl-10 bg-white/5 border-white/10"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required 
                />
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="password">Senha</Label>
                <button type="button" className="text-xs text-primary hover:underline">Esqueceu a senha?</button>
              </div>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input 
                  id="password" 
                  type="password" 
                  placeholder="••••••••" 
                  className="pl-10 bg-white/5 border-white/10"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required 
                />
              </div>
            </div>

            <Button 
              type="submit" 
              className="w-full h-12 text-lg font-bold neon-glow" 
              disabled={isLoading}
            >
              {isLoading ? (
                <Loader2 className="animate-spin h-5 w-5 mr-2" />
              ) : (
                "ENTRAR NO SISTEMA"
              )}
            </Button>
          </form>
        </div>

        <p className="text-center text-sm text-muted-foreground">
          Sistema Exclusivo de Gestão <br/>
          <span className="font-bold text-white/50">FC Construções e Transportes</span>
        </p>
      </div>
    </div>
  )
}
