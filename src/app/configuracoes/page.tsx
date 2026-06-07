
"use client"

import { useState, useEffect } from "react"
import { DashboardLayout } from "@/components/layout/DashboardLayout"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Switch } from "@/components/ui/switch"
import { User, Bell, Shield, Palette, Save, Loader2 } from "lucide-react"
import { useAuth, useFirestore, useUser, useDoc } from "@/firebase"
import { doc, setDoc, serverTimestamp } from "firebase/firestore"
import { useToast } from "@/hooks/use-toast"
import { errorEmitter } from "@/firebase/error-emitter"
import { FirestorePermissionError } from "@/firebase/errors"

export default function SettingsPage() {
  const { user } = useUser()
  const db = useFirestore()
  const { toast } = useToast()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [mounted, setMounted] = useState(false)

  // Fetch User Profile
  const userDocRef = user ? doc(db, "users", user.uid) : null
  const { data: profile, loading: loadingProfile } = useDoc(userDocRef)

  // Form state
  const [formData, setFormData] = useState({
    displayName: "",
    email: "",
    phone: "",
    role: "Gestor de Frota"
  })

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    if (profile) {
      setFormData({
        displayName: profile.displayName || "",
        email: profile.email || user?.email || "",
        phone: profile.phone || "",
        role: profile.role || "Gestor de Frota"
      })
    } else if (user) {
      setFormData(prev => ({
        ...prev,
        email: user.email || ""
      }))
    }
  }, [profile, user])

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault()
    if (!user) return

    setIsSubmitting(true)
    const payload = {
      ...formData,
      uid: user.uid,
      updatedAt: serverTimestamp()
    }

    setDoc(doc(db, "users", user.uid), payload, { merge: true })
      .then(() => {
        toast({
          title: "Perfil Atualizado",
          description: "Suas informações foram salvas com sucesso no sistema."
        })
      })
      .catch(async () => {
        const permissionError = new FirestorePermissionError({
          path: `users/${user.uid}`,
          operation: "update",
          requestResourceData: payload
        })
        errorEmitter.emit("permission-error", permissionError)
      })
      .finally(() => setIsSubmitting(false))
  }

  if (!mounted) return null

  return (
    <DashboardLayout>
      <div className="space-y-8 max-w-4xl mx-auto animate-in fade-in slide-in-from-bottom-4">
        <div>
          <h2 className="text-3xl font-headline font-bold text-white">Configurações</h2>
          <p className="text-muted-foreground">Gerencie suas preferências e configurações de segurança.</p>
        </div>

        <Tabs defaultValue="profile" className="space-y-6">
          <TabsList className="bg-white/5 border border-white/10 p-1 rounded-xl h-auto">
            <TabsTrigger value="profile" className="flex items-center gap-2 py-2 px-4 rounded-lg data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
              <User className="h-4 w-4" />
              Perfil
            </TabsTrigger>
            <TabsTrigger value="notifications" className="flex items-center gap-2 py-2 px-4 rounded-lg data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
              <Bell className="h-4 w-4" />
              Notificações
            </TabsTrigger>
            <TabsTrigger value="security" className="flex items-center gap-2 py-2 px-4 rounded-lg data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
              <Shield className="h-4 w-4" />
              Segurança
            </TabsTrigger>
            <TabsTrigger value="appearance" className="flex items-center gap-2 py-2 px-4 rounded-lg data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
              <Palette className="h-4 w-4" />
              Aparência
            </TabsTrigger>
          </TabsList>

          <TabsContent value="profile">
            <Card className="bg-card border-white/5">
              <CardHeader>
                <CardTitle className="text-xl font-headline font-bold">Informações Pessoais</CardTitle>
                <CardDescription>Atualize seus dados de cadastro no sistema.</CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSaveProfile} className="space-y-6">
                  {loadingProfile ? (
                    <div className="flex justify-center py-10">
                      <Loader2 className="animate-spin h-8 w-8 text-primary opacity-20" />
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <Label htmlFor="name">Nome Completo</Label>
                        <Input 
                          id="name" 
                          placeholder="Seu nome"
                          value={formData.displayName}
                          onChange={(e) => setFormData({...formData, displayName: e.target.value})}
                          className="bg-white/5 border-white/10" 
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="email">E-mail Corporativo</Label>
                        <Input 
                          id="email" 
                          type="email"
                          value={formData.email}
                          onChange={(e) => setFormData({...formData, email: e.target.value})}
                          className="bg-white/5 border-white/10" 
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="phone">Telefone / WhatsApp</Label>
                        <Input 
                          id="phone" 
                          placeholder="(00) 00000-0000"
                          value={formData.phone}
                          onChange={(e) => setFormData({...formData, phone: e.target.value})}
                          className="bg-white/5 border-white/10" 
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="role">Cargo / Nível</Label>
                        <Input 
                          id="role" 
                          value={formData.role}
                          disabled 
                          className="bg-white/5 border-white/10 opacity-50" 
                        />
                      </div>
                    </div>
                  )}
                  <div className="pt-4">
                    <Button type="submit" disabled={isSubmitting || loadingProfile} className="neon-glow font-bold">
                      {isSubmitting ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Save className="h-4 w-4 mr-2" />}
                      SALVAR ALTERAÇÕES
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="notifications">
            <Card className="bg-card border-white/5">
              <CardHeader>
                <CardTitle className="text-xl font-headline font-bold">Preferências de Alerta</CardTitle>
                <CardDescription>Escolha como deseja ser notificado sobre a operação.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  {[
                    { title: "Manutenção Preventiva", desc: "Alertar quando um veículo estiver próximo da revisão.", checked: true },
                    { title: "Checklists Pendentes", desc: "Notificar quando um motorista não realizar o checklist diário.", checked: true },
                    { title: "Alertas de Velocidade", desc: "Receber aviso imediato em caso de excesso de velocidade.", checked: false },
                    { title: "Vencimento de Documentos", desc: "Avisar 30 dias antes do vencimento de CRLV ou CNH.", checked: true },
                  ].map((item, i) => (
                    <div key={i} className="flex items-center justify-between p-4 rounded-xl bg-white/5 border border-white/10">
                      <div className="space-y-0.5">
                        <p className="text-sm font-bold">{item.title}</p>
                        <p className="text-xs text-muted-foreground">{item.desc}</p>
                      </div>
                      <Switch checked={item.checked} />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="security">
            <Card className="bg-card border-white/5">
              <CardHeader>
                <CardTitle className="text-xl font-headline font-bold">Segurança da Conta</CardTitle>
                <CardDescription>Gerencie sua senha e autenticação em duas etapas.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4 max-w-md">
                  <div className="space-y-2">
                    <Label htmlFor="current-pass">Senha Atual</Label>
                    <Input id="current-pass" type="password" placeholder="••••••••" className="bg-white/5 border-white/10" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="new-pass">Nova Senha</Label>
                    <Input id="new-pass" type="password" placeholder="••••••••" className="bg-white/5 border-white/10" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="confirm-pass">Confirmar Nova Senha</Label>
                    <Input id="confirm-pass" type="password" placeholder="••••••••" className="bg-white/5 border-white/10" />
                  </div>
                </div>
                <div className="pt-4">
                  <Button className="neon-glow font-bold">ATUALIZAR SENHA</Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="appearance">
            <Card className="bg-card border-white/5">
              <CardHeader>
                <CardTitle className="text-xl font-headline font-bold">Personalização Visual</CardTitle>
                <CardDescription>Ajuste o visual do sistema FC Frota.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="p-6 rounded-2xl bg-white/5 border border-primary/30 neon-glow space-y-4">
                    <p className="font-bold text-primary uppercase text-xs tracking-widest">Modo Dark Premium</p>
                    <p className="text-sm text-muted-foreground">O visual escuro com detalhes neon está ativo como padrão operacional.</p>
                    <div className="h-24 w-full bg-background border border-white/10 rounded-lg overflow-hidden flex">
                       <div className="w-1/4 bg-card border-r border-white/5" />
                       <div className="flex-1 p-2 space-y-2">
                          <div className="h-2 w-3/4 bg-primary/20 rounded" />
                          <div className="h-10 w-full bg-white/5 rounded" />
                       </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  )
}
