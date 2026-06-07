
"use client"

import { DashboardLayout } from "@/components/layout/DashboardLayout"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Switch } from "@/components/ui/switch"
import { User, Bell, Shield, Palette, Save } from "lucide-react"

export default function SettingsPage() {
  return (
    <DashboardLayout>
      <div className="space-y-8 max-w-4xl mx-auto">
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
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="name">Nome Completo</Label>
                    <Input id="name" defaultValue="Administrador FC" className="bg-white/5 border-white/10" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">E-mail Corporativo</Label>
                    <Input id="email" defaultValue="admin@fctransportes.com.br" className="bg-white/5 border-white/10" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone">Telefone / WhatsApp</Label>
                    <Input id="phone" defaultValue="(65) 99999-9999" className="bg-white/5 border-white/10" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="role">Cargo / Nível</Label>
                    <Input id="role" defaultValue="Gestor de Frota" disabled className="bg-white/5 border-white/10 opacity-50" />
                  </div>
                </div>
                <div className="pt-4">
                  <Button className="neon-glow font-bold">
                    <Save className="h-4 w-4 mr-2" />
                    SALVAR ALTERAÇÕES
                  </Button>
                </div>
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
