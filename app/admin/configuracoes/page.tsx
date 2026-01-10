'use client'

import { useEffect, useState } from 'react'
import {
    Settings,
    Bell,
    Mail,
    Key,
    Shield,
    Save,
    Loader2,
    Plus,
    Trash2,
    Copy,
    Eye,
    EyeOff,
    RefreshCw,
    Lock,
    MessageSquare,
    Phone,
    Send,
    CheckCircle2,
    XCircle
} from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Separator } from '@/components/ui/separator'
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from '@/components/ui/dialog'
import { formatDateTimeString } from '@/lib/utils'
import { toast } from 'sonner'

interface ApiKey {
    id: string
    name: string
    key_preview: string
    is_active: boolean
    last_used_at: string | null
    created_at: string
}

export default function ConfiguracoesPage() {
    const [saving, setSaving] = useState(false)
    const [showApiDialog, setShowApiDialog] = useState(false)
    const [newApiKey, setNewApiKey] = useState('')
    const [newApiKeyName, setNewApiKeyName] = useState('')
    const [showKey, setShowKey] = useState(false)
    const [savingKey, setSavingKey] = useState(false)
    const [apiKeys, setApiKeys] = useState<ApiKey[]>([])
    const [loadingKeys, setLoadingKeys] = useState(true)

    // Password change state
    const [showPasswordDialog, setShowPasswordDialog] = useState(false)
    const [currentPassword, setCurrentPassword] = useState('')
    const [newPassword, setNewPassword] = useState('')
    const [confirmNewPassword, setConfirmNewPassword] = useState('')
    const [changingPassword, setChangingPassword] = useState(false)
    const [showPasswords, setShowPasswords] = useState(false)

    const [emailConfig, setEmailConfig] = useState({
        smtp_host: 'smtp.gmail.com',
        smtp_port: '587',
        smtp_user: '',
        smtp_password: '',
        from_email: 'naoresponder@cargoflash.com.br',
        from_name: 'Cargo Flash',
    })

    // Notification config state
    const [notifConfig, setNotifConfig] = useState({
        provider: 'log',
        enabled: false,
        twilio_account_sid: '',
        twilio_auth_token: '',
        twilio_phone_number: '',
        twilio_whatsapp_number: '',
        notify_on_create: true,
        notify_on_status_change: true,
        notify_on_delivery: true,
        preferred_channel: 'whatsapp',
    })
    const [loadingNotifConfig, setLoadingNotifConfig] = useState(true)
    const [savingNotifConfig, setSavingNotifConfig] = useState(false)
    const [testPhone, setTestPhone] = useState('')
    const [sendingTest, setSendingTest] = useState(false)
    const [showTwilioToken, setShowTwilioToken] = useState(false)

    useEffect(() => {
        fetchApiKeys()
        fetchNotificationConfig()
    }, [])

    const fetchApiKeys = async () => {
        try {
            const response = await fetch('/api/admin/api-keys')
            const data = await response.json()
            if (data.success) {
                setApiKeys(data.keys || [])
            }
        } catch (error) {
            console.error('Error fetching API keys:', error)
        } finally {
            setLoadingKeys(false)
        }
    }

    const saveEmailConfig = async () => {
        setSaving(true)
        // Simulate save - in production this would call an API
        await new Promise(r => setTimeout(r, 1000))
        toast.success('Configurações salvas')
        setSaving(false)
    }

    const fetchNotificationConfig = async () => {
        try {
            const response = await fetch('/api/admin/notifications/config')
            const data = await response.json()
            if (data.success && data.config) {
                setNotifConfig(data.config)
            }
        } catch (error) {
            console.error('Error fetching notification config:', error)
        } finally {
            setLoadingNotifConfig(false)
        }
    }

    const saveNotificationConfig = async () => {
        setSavingNotifConfig(true)
        try {
            const response = await fetch('/api/admin/notifications/config', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(notifConfig),
            })
            const data = await response.json()
            if (data.success) {
                toast.success('Configurações de notificação salvas!')
            } else {
                toast.error(data.error || 'Erro ao salvar')
            }
        } catch (error) {
            console.error('Error saving notification config:', error)
            toast.error('Erro ao salvar configurações')
        } finally {
            setSavingNotifConfig(false)
        }
    }

    const sendTestNotification = async () => {
        if (!testPhone.trim()) {
            toast.error('Informe um número de telefone')
            return
        }
        setSendingTest(true)
        try {
            const response = await fetch('/api/admin/notifications/test', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    phone: testPhone,
                    channel: notifConfig.preferred_channel,
                }),
            })
            const data = await response.json()
            if (data.success) {
                toast.success('Mensagem de teste enviada!')
            } else {
                toast.error(data.error || 'Falha ao enviar')
            }
        } catch (error) {
            console.error('Error sending test:', error)
            toast.error('Erro ao enviar teste')
        } finally {
            setSendingTest(false)
        }
    }

    const generateApiKey = () => {
        // Generate random API key
        const key = 'cf_' + Array.from(crypto.getRandomValues(new Uint8Array(24)))
            .map(b => b.toString(16).padStart(2, '0'))
            .join('')
        setNewApiKey(key)
        setNewApiKeyName('')
        setShowKey(false)
    }

    const copyApiKey = () => {
        navigator.clipboard.writeText(newApiKey)
        toast.success('API Key copiada para a área de transferência')
    }

    const saveApiKey = async () => {
        if (!newApiKeyName.trim()) {
            toast.error('Informe um nome para a API Key')
            return
        }

        setSavingKey(true)
        try {
            const response = await fetch('/api/admin/api-keys', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    name: newApiKeyName,
                    key: newApiKey,
                }),
            })

            const data = await response.json()
            if (data.success) {
                toast.success('API Key criada com sucesso!')
                setShowApiDialog(false)
                setNewApiKey('')
                setNewApiKeyName('')
                fetchApiKeys()
            } else {
                toast.error(data.error || 'Erro ao criar API Key')
            }
        } catch (error) {
            console.error('Error saving API key:', error)
            toast.error('Erro ao salvar API Key')
        } finally {
            setSavingKey(false)
        }
    }

    const deleteApiKey = async (id: string) => {
        if (!confirm('Tem certeza que deseja excluir esta API Key? Esta ação não pode ser desfeita.')) {
            return
        }

        try {
            const response = await fetch(`/api/admin/api-keys/${id}`, {
                method: 'DELETE',
            })

            const data = await response.json()
            if (data.success) {
                toast.success('API Key excluída')
                fetchApiKeys()
            } else {
                toast.error(data.error || 'Erro ao excluir')
            }
        } catch (error) {
            console.error('Error deleting API key:', error)
            toast.error('Erro ao excluir API Key')
        }
    }

    const openNewKeyDialog = () => {
        generateApiKey()
        setShowApiDialog(true)
    }

    const changePassword = async () => {
        if (!currentPassword || !newPassword || !confirmNewPassword) {
            toast.error('Preencha todos os campos')
            return
        }

        if (newPassword.length < 6) {
            toast.error('A nova senha deve ter pelo menos 6 caracteres')
            return
        }

        if (newPassword !== confirmNewPassword) {
            toast.error('As senhas não coincidem')
            return
        }

        setChangingPassword(true)
        try {
            const response = await fetch('/api/admin/auth/change-password', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    currentPassword,
                    newPassword,
                }),
            })

            const data = await response.json()
            if (data.success) {
                toast.success('Senha alterada com sucesso!')
                setShowPasswordDialog(false)
                setCurrentPassword('')
                setNewPassword('')
                setConfirmNewPassword('')
            } else {
                toast.error(data.error)
            }
        } catch {
            toast.error('Erro ao alterar senha')
        } finally {
            setChangingPassword(false)
        }
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div>
                <h1 className="text-2xl font-bold font-mono text-[#00ff41] text-glow-sm">
                    CONFIGURAÇÕES
                </h1>
                <p className="text-[#00ff41]/60 font-mono text-sm mt-1">
                    Configurações gerais do sistema
                </p>
            </div>

            <div className="grid lg:grid-cols-2 gap-6">
                {/* Email Config */}
                <Card variant="matrix">
                    <CardHeader className="border-b border-[#00ff41]/20">
                        <CardTitle className="font-mono text-[#00ff41] flex items-center gap-2">
                            <Mail className="h-5 w-5" />
                            CONFIGURAÇÕES DE EMAIL
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="p-6 space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label variant="matrix">Servidor SMTP</Label>
                                <Input
                                    variant="matrix"
                                    value={emailConfig.smtp_host}
                                    onChange={(e) => setEmailConfig({ ...emailConfig, smtp_host: e.target.value })}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label variant="matrix">Porta</Label>
                                <Input
                                    variant="matrix"
                                    value={emailConfig.smtp_port}
                                    onChange={(e) => setEmailConfig({ ...emailConfig, smtp_port: e.target.value })}
                                />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <Label variant="matrix">Usuário SMTP</Label>
                            <Input
                                variant="matrix"
                                type="email"
                                value={emailConfig.smtp_user}
                                onChange={(e) => setEmailConfig({ ...emailConfig, smtp_user: e.target.value })}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label variant="matrix">Senha SMTP</Label>
                            <Input
                                variant="matrix"
                                type="password"
                                value={emailConfig.smtp_password}
                                onChange={(e) => setEmailConfig({ ...emailConfig, smtp_password: e.target.value })}
                            />
                        </div>
                        <Separator variant="matrix" />
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label variant="matrix">Email Remetente</Label>
                                <Input
                                    variant="matrix"
                                    value={emailConfig.from_email}
                                    onChange={(e) => setEmailConfig({ ...emailConfig, from_email: e.target.value })}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label variant="matrix">Nome Remetente</Label>
                                <Input
                                    variant="matrix"
                                    value={emailConfig.from_name}
                                    onChange={(e) => setEmailConfig({ ...emailConfig, from_name: e.target.value })}
                                />
                            </div>
                        </div>
                        <Button variant="matrixSolid" onClick={saveEmailConfig} disabled={saving} className="w-full">
                            {saving ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Save className="h-4 w-4 mr-2" />}
                            Salvar Configurações
                        </Button>
                    </CardContent>
                </Card>

                {/* SMS/WhatsApp Notifications */}
                <Card variant="matrix">
                    <CardHeader className="border-b border-[#00ff41]/20">
                        <CardTitle className="font-mono text-[#00ff41] flex items-center gap-2">
                            <MessageSquare className="h-5 w-5" />
                            NOTIFICAÇÕES SMS/WHATSAPP
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="p-6 space-y-4">
                        {loadingNotifConfig ? (
                            <div className="flex items-center justify-center py-8">
                                <Loader2 className="h-8 w-8 animate-spin text-[#00ff41]" />
                            </div>
                        ) : (
                            <>
                                {/* Enable/Disable Toggle */}
                                <div className="flex items-center justify-between p-3 bg-[#00ff41]/5 rounded-lg border border-[#00ff41]/20">
                                    <div className="flex items-center gap-3">
                                        {notifConfig.enabled ? (
                                            <CheckCircle2 className="h-5 w-5 text-[#00ff41]" />
                                        ) : (
                                            <XCircle className="h-5 w-5 text-[#ff0040]" />
                                        )}
                                        <div>
                                            <span className="font-mono text-sm text-[#00ff41]">Notificações Ativas</span>
                                            <p className="font-mono text-xs text-[#00ff41]/50">
                                                {notifConfig.enabled ? 'Clientes receberão SMS/WhatsApp' : 'Notificações desativadas'}
                                            </p>
                                        </div>
                                    </div>
                                    <button
                                        onClick={() => setNotifConfig({ ...notifConfig, enabled: !notifConfig.enabled })}
                                        className={`w-12 h-6 rounded-full transition-colors ${notifConfig.enabled ? 'bg-[#00ff41]' : 'bg-[#00ff41]/20'}`}
                                    >
                                        <div className={`w-5 h-5 rounded-full bg-[#0d1117] transition-transform ${notifConfig.enabled ? 'translate-x-6' : 'translate-x-0.5'}`} />
                                    </button>
                                </div>

                                {/* Provider Selection */}
                                <div className="space-y-2">
                                    <Label variant="matrix">Provedor</Label>
                                    <div className="flex gap-2">
                                        <button
                                            onClick={() => setNotifConfig({ ...notifConfig, provider: 'twilio' })}
                                            className={`flex-1 p-3 rounded-lg border font-mono text-sm transition-colors ${notifConfig.provider === 'twilio'
                                                    ? 'border-[#00ff41] bg-[#00ff41]/10 text-[#00ff41]'
                                                    : 'border-[#00ff41]/20 text-[#00ff41]/60 hover:border-[#00ff41]/40'
                                                }`}
                                        >
                                            Twilio
                                        </button>
                                        <button
                                            onClick={() => setNotifConfig({ ...notifConfig, provider: 'log' })}
                                            className={`flex-1 p-3 rounded-lg border font-mono text-sm transition-colors ${notifConfig.provider === 'log'
                                                    ? 'border-[#00ff41] bg-[#00ff41]/10 text-[#00ff41]'
                                                    : 'border-[#00ff41]/20 text-[#00ff41]/60 hover:border-[#00ff41]/40'
                                                }`}
                                        >
                                            Log (Teste)
                                        </button>
                                    </div>
                                </div>

                                {/* Preferred Channel */}
                                <div className="space-y-2">
                                    <Label variant="matrix">Canal Preferido</Label>
                                    <div className="flex gap-2">
                                        <button
                                            onClick={() => setNotifConfig({ ...notifConfig, preferred_channel: 'whatsapp' })}
                                            className={`flex-1 p-3 rounded-lg border font-mono text-sm transition-colors flex items-center justify-center gap-2 ${notifConfig.preferred_channel === 'whatsapp'
                                                    ? 'border-[#25D366] bg-[#25D366]/10 text-[#25D366]'
                                                    : 'border-[#00ff41]/20 text-[#00ff41]/60 hover:border-[#00ff41]/40'
                                                }`}
                                        >
                                            <MessageSquare className="h-4 w-4" />
                                            WhatsApp
                                        </button>
                                        <button
                                            onClick={() => setNotifConfig({ ...notifConfig, preferred_channel: 'sms' })}
                                            className={`flex-1 p-3 rounded-lg border font-mono text-sm transition-colors flex items-center justify-center gap-2 ${notifConfig.preferred_channel === 'sms'
                                                    ? 'border-[#00ff41] bg-[#00ff41]/10 text-[#00ff41]'
                                                    : 'border-[#00ff41]/20 text-[#00ff41]/60 hover:border-[#00ff41]/40'
                                                }`}
                                        >
                                            <Phone className="h-4 w-4" />
                                            SMS
                                        </button>
                                    </div>
                                </div>

                                {/* Twilio Config */}
                                {notifConfig.provider === 'twilio' && (
                                    <div className="space-y-3 p-4 bg-[#00ff41]/5 rounded-lg border border-[#00ff41]/20">
                                        <p className="font-mono text-xs text-[#00ff41]/60 mb-3">
                                            Configure suas credenciais do Twilio. Obtenha-as em twilio.com/console
                                        </p>
                                        <div className="space-y-2">
                                            <Label variant="matrix">Account SID</Label>
                                            <Input
                                                variant="matrix"
                                                placeholder="ACxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
                                                value={notifConfig.twilio_account_sid}
                                                onChange={(e) => setNotifConfig({ ...notifConfig, twilio_account_sid: e.target.value })}
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <Label variant="matrix">Auth Token</Label>
                                            <div className="flex gap-2">
                                                <Input
                                                    variant="matrix"
                                                    type={showTwilioToken ? 'text' : 'password'}
                                                    placeholder="Seu Auth Token"
                                                    value={notifConfig.twilio_auth_token}
                                                    onChange={(e) => setNotifConfig({ ...notifConfig, twilio_auth_token: e.target.value })}
                                                />
                                                <Button variant="matrixGhost" size="icon" onClick={() => setShowTwilioToken(!showTwilioToken)}>
                                                    {showTwilioToken ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                                </Button>
                                            </div>
                                        </div>
                                        <div className="grid grid-cols-2 gap-3">
                                            <div className="space-y-2">
                                                <Label variant="matrix">Número SMS</Label>
                                                <Input
                                                    variant="matrix"
                                                    placeholder="+1234567890"
                                                    value={notifConfig.twilio_phone_number}
                                                    onChange={(e) => setNotifConfig({ ...notifConfig, twilio_phone_number: e.target.value })}
                                                />
                                            </div>
                                            <div className="space-y-2">
                                                <Label variant="matrix">Número WhatsApp</Label>
                                                <Input
                                                    variant="matrix"
                                                    placeholder="+14155238886"
                                                    value={notifConfig.twilio_whatsapp_number}
                                                    onChange={(e) => setNotifConfig({ ...notifConfig, twilio_whatsapp_number: e.target.value })}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {/* Notification Triggers */}
                                <Separator variant="matrix" />
                                <p className="font-mono text-xs text-[#00ff41]/60">Quando notificar:</p>
                                {[
                                    { key: 'notify_on_create', label: 'Ao criar entrega' },
                                    { key: 'notify_on_status_change', label: 'Ao mudar status' },
                                    { key: 'notify_on_delivery', label: 'Ao entregar' },
                                ].map((item) => (
                                    <div key={item.key} className="flex items-center justify-between p-3 bg-[#00ff41]/5 rounded-lg border border-[#00ff41]/20">
                                        <span className="font-mono text-sm text-[#00ff41]">{item.label}</span>
                                        <button
                                            onClick={() => setNotifConfig({ ...notifConfig, [item.key]: !notifConfig[item.key as keyof typeof notifConfig] })}
                                            className={`w-12 h-6 rounded-full transition-colors ${notifConfig[item.key as keyof typeof notifConfig] ? 'bg-[#00ff41]' : 'bg-[#00ff41]/20'
                                                }`}
                                        >
                                            <div className={`w-5 h-5 rounded-full bg-[#0d1117] transition-transform ${notifConfig[item.key as keyof typeof notifConfig] ? 'translate-x-6' : 'translate-x-0.5'
                                                }`} />
                                        </button>
                                    </div>
                                ))}

                                {/* Test Section */}
                                <Separator variant="matrix" />
                                <div className="space-y-2">
                                    <Label variant="matrix">Enviar Teste</Label>
                                    <div className="flex gap-2">
                                        <Input
                                            variant="matrix"
                                            placeholder="(11) 99999-9999"
                                            value={testPhone}
                                            onChange={(e) => setTestPhone(e.target.value)}
                                        />
                                        <Button
                                            variant="matrix"
                                            onClick={sendTestNotification}
                                            disabled={sendingTest || !notifConfig.enabled}
                                        >
                                            {sendingTest ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
                                        </Button>
                                    </div>
                                    <p className="font-mono text-xs text-[#00ff41]/50">
                                        Envia uma mensagem de teste para verificar a configuração
                                    </p>
                                </div>

                                {/* Save Button */}
                                <Button variant="matrixSolid" onClick={saveNotificationConfig} disabled={savingNotifConfig} className="w-full">
                                    {savingNotifConfig ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Save className="h-4 w-4 mr-2" />}
                                    Salvar Configurações
                                </Button>
                            </>
                        )}
                    </CardContent>
                </Card>
            </div>

            {/* API Keys */}
            <Card variant="matrix">
                <CardHeader className="border-b border-[#00ff41]/20 flex flex-row items-center justify-between">
                    <CardTitle className="font-mono text-[#00ff41] flex items-center gap-2">
                        <Key className="h-5 w-5" />
                        API KEYS
                    </CardTitle>
                    <div className="flex items-center gap-2">
                        <Button variant="matrixGhost" size="icon" onClick={fetchApiKeys} className="h-8 w-8">
                            <RefreshCw className={`h-4 w-4 ${loadingKeys ? 'animate-spin' : ''}`} />
                        </Button>
                        <Button variant="matrix" size="sm" onClick={openNewKeyDialog}>
                            <Plus className="h-4 w-4 mr-2" />
                            Nova API Key
                        </Button>
                    </div>
                </CardHeader>
                <CardContent className="p-0">
                    {loadingKeys ? (
                        <div className="p-8 text-center">
                            <Loader2 className="h-8 w-8 animate-spin text-[#00ff41] mx-auto" />
                        </div>
                    ) : apiKeys.length === 0 ? (
                        <div className="p-8 text-center">
                            <Key className="h-12 w-12 text-[#00ff41]/20 mx-auto mb-3" />
                            <p className="font-mono text-[#00ff41]/60">Nenhuma API Key cadastrada</p>
                            <p className="font-mono text-xs text-[#00ff41]/40 mt-1">
                                Crie uma API Key para integrar com sistemas externos
                            </p>
                        </div>
                    ) : (
                        <div className="divide-y divide-[#00ff41]/10">
                            {apiKeys.map((key) => (
                                <div key={key.id} className="flex items-center gap-4 p-4 hover:bg-[#00ff41]/5 transition-colors">
                                    <div className="p-2 rounded-lg bg-[#00ff41]/10 border border-[#00ff41]/20">
                                        <Key className="h-5 w-5 text-[#00ff41]" />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="font-mono text-[#00ff41]">{key.name}</p>
                                        <p className="font-mono text-xs text-[#00ff41]/50">
                                            {key.key_preview} • Criada: {formatDateTimeString(key.created_at)} •
                                            Último uso: {key.last_used_at ? formatDateTimeString(key.last_used_at) : 'Nunca'}
                                        </p>
                                    </div>
                                    <Button
                                        variant="matrixGhost"
                                        size="icon"
                                        className="h-8 w-8 text-[#ff0040] hover:text-[#ff0040] hover:bg-[#ff0040]/10"
                                        onClick={() => deleteApiKey(key.id)}
                                    >
                                        <Trash2 className="h-4 w-4" />
                                    </Button>
                                </div>
                            ))}
                        </div>
                    )}
                </CardContent>
            </Card>

            {/* Security */}
            <Card variant="matrix">
                <CardHeader className="border-b border-[#00ff41]/20">
                    <CardTitle className="font-mono text-[#00ff41] flex items-center gap-2">
                        <Shield className="h-5 w-5" />
                        SEGURANÇA
                    </CardTitle>
                </CardHeader>
                <CardContent className="p-6">
                    <div className="grid md:grid-cols-2 gap-6">
                        <div className="p-4 bg-[#00ff41]/5 rounded-lg border border-[#00ff41]/20">
                            <p className="font-mono text-sm text-[#00ff41] mb-2">Sessão Atual</p>
                            <p className="font-mono text-xs text-[#00ff41]/60">
                                Logado desde: Agora<br />
                                Expira em: 7 dias
                            </p>
                        </div>
                        <div className="p-4 bg-[#00ff41]/5 rounded-lg border border-[#00ff41]/20">
                            <p className="font-mono text-sm text-[#00ff41] mb-2">Alterar Senha</p>
                            <Button variant="matrix" size="sm" className="mt-2" onClick={() => setShowPasswordDialog(true)}>
                                <Lock className="h-4 w-4 mr-2" />
                                Alterar Senha
                            </Button>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* API Key Dialog */}
            <Dialog open={showApiDialog} onOpenChange={setShowApiDialog}>
                <DialogContent variant="matrix" className="max-w-md">
                    <DialogHeader>
                        <DialogTitle className="font-mono text-[#00ff41]">NOVA API KEY</DialogTitle>
                    </DialogHeader>
                    <div className="py-4">
                        <div className="space-y-4">
                            <div className="space-y-2">
                                <Label variant="matrix">Nome *</Label>
                                <Input
                                    variant="matrix"
                                    placeholder="Ex: WooCommerce Loja Principal"
                                    value={newApiKeyName}
                                    onChange={(e) => setNewApiKeyName(e.target.value)}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label variant="matrix">API Key (copie agora - não será mostrada novamente)</Label>
                                <div className="flex gap-2">
                                    <Input
                                        variant="matrix"
                                        type={showKey ? 'text' : 'password'}
                                        value={newApiKey}
                                        readOnly
                                        className="font-mono text-xs"
                                    />
                                    <Button variant="matrixGhost" size="icon" onClick={() => setShowKey(!showKey)}>
                                        {showKey ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                    </Button>
                                    <Button variant="matrixGhost" size="icon" onClick={copyApiKey}>
                                        <Copy className="h-4 w-4" />
                                    </Button>
                                </div>
                                <p className="font-mono text-xs text-[#ff0040]/80">
                                    ⚠️ Copie esta chave agora! Ela não poderá ser visualizada novamente.
                                </p>
                            </div>
                        </div>
                    </div>
                    <DialogFooter>
                        <Button variant="matrix" onClick={() => setShowApiDialog(false)}>
                            Cancelar
                        </Button>
                        <Button variant="matrixSolid" onClick={saveApiKey} disabled={savingKey}>
                            {savingKey ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Save className="h-4 w-4 mr-2" />}
                            Salvar API Key
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Password Change Dialog */}
            <Dialog open={showPasswordDialog} onOpenChange={setShowPasswordDialog}>
                <DialogContent variant="matrix" className="max-w-md">
                    <DialogHeader>
                        <DialogTitle className="font-mono text-[#00ff41]">ALTERAR SENHA</DialogTitle>
                    </DialogHeader>
                    <div className="py-4 space-y-4">
                        <div className="space-y-2">
                            <Label variant="matrix">Senha Atual</Label>
                            <div className="relative">
                                <Input
                                    variant="matrix"
                                    type={showPasswords ? 'text' : 'password'}
                                    placeholder="Digite sua senha atual"
                                    value={currentPassword}
                                    onChange={(e) => setCurrentPassword(e.target.value)}
                                />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <Label variant="matrix">Nova Senha</Label>
                            <Input
                                variant="matrix"
                                type={showPasswords ? 'text' : 'password'}
                                placeholder="Mínimo 6 caracteres"
                                value={newPassword}
                                onChange={(e) => setNewPassword(e.target.value)}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label variant="matrix">Confirmar Nova Senha</Label>
                            <Input
                                variant="matrix"
                                type={showPasswords ? 'text' : 'password'}
                                placeholder="Digite novamente"
                                value={confirmNewPassword}
                                onChange={(e) => setConfirmNewPassword(e.target.value)}
                            />
                        </div>
                        <div className="flex items-center gap-2">
                            <button
                                type="button"
                                onClick={() => setShowPasswords(!showPasswords)}
                                className="flex items-center gap-2 font-mono text-xs text-[#00ff41]/60 hover:text-[#00ff41]"
                            >
                                {showPasswords ? <EyeOff className="h-3 w-3" /> : <Eye className="h-3 w-3" />}
                                {showPasswords ? 'Ocultar senhas' : 'Mostrar senhas'}
                            </button>
                        </div>
                    </div>
                    <DialogFooter>
                        <Button variant="matrix" onClick={() => {
                            setShowPasswordDialog(false)
                            setCurrentPassword('')
                            setNewPassword('')
                            setConfirmNewPassword('')
                        }}>
                            Cancelar
                        </Button>
                        <Button variant="matrixSolid" onClick={changePassword} disabled={changingPassword}>
                            {changingPassword ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Lock className="h-4 w-4 mr-2" />}
                            Alterar Senha
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    )
}
