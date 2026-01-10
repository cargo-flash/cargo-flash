'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import {
    Package,
    MapPin,
    User,
    Save,
    ArrowLeft,
    Loader2
} from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select'
import { Separator } from '@/components/ui/separator'
import { BRAZILIAN_STATES } from '@/lib/types'
import { toast } from 'sonner'
import Link from 'next/link'

export default function NovaEntregaPage() {
    const router = useRouter()
    const [loading, setLoading] = useState(false)
    const [formData, setFormData] = useState({
        sender_name: '',
        sender_email: '',
        sender_phone: '',
        recipient_name: '',
        recipient_email: '',
        recipient_phone: '',
        destination_address: '',
        destination_city: '',
        destination_state: 'SP',
        destination_zip: '',
        package_description: '',
        package_weight: '',
        auto_simulate: true,
    })

    const handleChange = (field: string, value: string | boolean) => {
        setFormData(prev => ({ ...prev, [field]: value }))
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()

        if (!formData.recipient_name || !formData.destination_address || !formData.destination_city) {
            toast.error('Preencha os campos obrigatórios')
            return
        }

        setLoading(true)

        try {
            const response = await fetch('/api/admin/deliveries', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    ...formData,
                    package_weight: formData.package_weight ? parseFloat(formData.package_weight) : undefined,
                }),
            })

            const data = await response.json()

            if (data.success) {
                toast.success(`Entrega criada: ${data.delivery.tracking_code}`)
                router.push(`/admin/entregas/${data.delivery.id}`)
            } else {
                toast.error(data.error || 'Erro ao criar entrega')
            }
        } catch {
            toast.error('Erro de conexão')
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="space-y-6 max-w-4xl">
            {/* Header */}
            <div className="flex items-center gap-4">
                <Link href="/admin/entregas">
                    <Button variant="matrixGhost" size="icon">
                        <ArrowLeft className="h-5 w-5" />
                    </Button>
                </Link>
                <div>
                    <h1 className="text-2xl font-bold font-mono text-[#00ff41] text-glow-sm">
                        NOVA ENTREGA
                    </h1>
                    <p className="text-[#00ff41]/60 font-mono text-sm mt-1">
                        Cadastrar nova entrega no sistema
                    </p>
                </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
                {/* Remetente */}
                <Card variant="matrix">
                    <CardHeader className="border-b border-[#00ff41]/20">
                        <CardTitle className="font-mono text-[#00ff41] flex items-center gap-2">
                            <User className="h-5 w-5" />
                            REMETENTE (OPCIONAL)
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="p-6 grid gap-4 md:grid-cols-3">
                        <div className="space-y-2">
                            <Label variant="matrix">Nome</Label>
                            <Input
                                variant="matrix"
                                placeholder="Nome do remetente"
                                value={formData.sender_name}
                                onChange={(e) => handleChange('sender_name', e.target.value)}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label variant="matrix">Email</Label>
                            <Input
                                variant="matrix"
                                type="email"
                                placeholder="email@exemplo.com"
                                value={formData.sender_email}
                                onChange={(e) => handleChange('sender_email', e.target.value)}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label variant="matrix">Telefone</Label>
                            <Input
                                variant="matrix"
                                placeholder="11999999999"
                                value={formData.sender_phone}
                                onChange={(e) => handleChange('sender_phone', e.target.value.replace(/\D/g, ''))}
                                maxLength={11}
                            />
                        </div>
                    </CardContent>
                </Card>

                {/* Destinatário */}
                <Card variant="matrix">
                    <CardHeader className="border-b border-[#00ff41]/20">
                        <CardTitle className="font-mono text-[#00ff41] flex items-center gap-2">
                            <MapPin className="h-5 w-5" />
                            DESTINATÁRIO *
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="p-6 space-y-4">
                        <div className="grid gap-4 md:grid-cols-3">
                            <div className="space-y-2">
                                <Label variant="matrix">Nome *</Label>
                                <Input
                                    variant="matrix"
                                    placeholder="Nome do destinatário"
                                    value={formData.recipient_name}
                                    onChange={(e) => handleChange('recipient_name', e.target.value)}
                                    required
                                />
                            </div>
                            <div className="space-y-2">
                                <Label variant="matrix">Email</Label>
                                <Input
                                    variant="matrix"
                                    type="email"
                                    placeholder="email@exemplo.com"
                                    value={formData.recipient_email}
                                    onChange={(e) => handleChange('recipient_email', e.target.value)}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label variant="matrix">Telefone</Label>
                                <Input
                                    variant="matrix"
                                    placeholder="11999999999"
                                    value={formData.recipient_phone}
                                    onChange={(e) => handleChange('recipient_phone', e.target.value.replace(/\D/g, ''))}
                                    maxLength={11}
                                />
                            </div>
                        </div>

                        <Separator variant="matrix" />

                        <div className="space-y-2">
                            <Label variant="matrix">Endereço *</Label>
                            <Input
                                variant="matrix"
                                placeholder="Rua, número, complemento"
                                value={formData.destination_address}
                                onChange={(e) => handleChange('destination_address', e.target.value)}
                                required
                            />
                        </div>

                        <div className="grid gap-4 md:grid-cols-3">
                            <div className="space-y-2">
                                <Label variant="matrix">Cidade *</Label>
                                <Input
                                    variant="matrix"
                                    placeholder="Cidade"
                                    value={formData.destination_city}
                                    onChange={(e) => handleChange('destination_city', e.target.value)}
                                    required
                                />
                            </div>
                            <div className="space-y-2">
                                <Label variant="matrix">Estado *</Label>
                                <Select value={formData.destination_state} onValueChange={(v) => handleChange('destination_state', v)}>
                                    <SelectTrigger variant="matrix">
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent variant="matrix">
                                        {BRAZILIAN_STATES.map((state) => (
                                            <SelectItem key={state.value} value={state.value} variant="matrix">
                                                {state.value} - {state.label}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="space-y-2">
                                <Label variant="matrix">CEP</Label>
                                <Input
                                    variant="matrix"
                                    placeholder="00000000"
                                    value={formData.destination_zip}
                                    onChange={(e) => handleChange('destination_zip', e.target.value.replace(/\D/g, ''))}
                                    maxLength={8}
                                />
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Pacote */}
                <Card variant="matrix">
                    <CardHeader className="border-b border-[#00ff41]/20">
                        <CardTitle className="font-mono text-[#00ff41] flex items-center gap-2">
                            <Package className="h-5 w-5" />
                            PACOTE
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="p-6 space-y-4">
                        <div className="space-y-2">
                            <Label variant="matrix">Descrição do Conteúdo</Label>
                            <Textarea
                                variant="matrix"
                                placeholder="Ex: Smartphone Samsung Galaxy, Notebook Dell..."
                                value={formData.package_description}
                                onChange={(e) => handleChange('package_description', e.target.value)}
                                rows={2}
                            />
                        </div>
                        <div className="grid gap-4 md:grid-cols-2">
                            <div className="space-y-2">
                                <Label variant="matrix">Peso (kg)</Label>
                                <Input
                                    variant="matrix"
                                    type="number"
                                    step="0.01"
                                    min="0"
                                    placeholder="0.00"
                                    value={formData.package_weight}
                                    onChange={(e) => handleChange('package_weight', e.target.value)}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label variant="matrix">Simulação Automática</Label>
                                <Select
                                    value={formData.auto_simulate ? 'true' : 'false'}
                                    onValueChange={(v) => handleChange('auto_simulate', v === 'true')}
                                >
                                    <SelectTrigger variant="matrix">
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent variant="matrix">
                                        <SelectItem value="true" variant="matrix">Ativar (eventos automáticos)</SelectItem>
                                        <SelectItem value="false" variant="matrix">Desativar (manual)</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Submit */}
                <div className="flex justify-end gap-4">
                    <Link href="/admin/entregas">
                        <Button variant="matrix" type="button">
                            Cancelar
                        </Button>
                    </Link>
                    <Button variant="matrixSolid" type="submit" disabled={loading}>
                        {loading ? (
                            <>
                                <Loader2 className="h-4 w-4 animate-spin mr-2" />
                                Criando...
                            </>
                        ) : (
                            <>
                                <Save className="h-4 w-4 mr-2" />
                                Criar Entrega
                            </>
                        )}
                    </Button>
                </div>
            </form>
        </div>
    )
}
