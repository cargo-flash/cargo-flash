'use client'

import { useEffect, useState } from 'react'
import {
    Truck,
    Play,
    Pause,
    Settings,
    Clock,
    MapPin,
    Loader2,
    Save,
    RefreshCw
} from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Separator } from '@/components/ui/separator'
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select'
import { BRAZILIAN_STATES } from '@/lib/types'
import { toast } from 'sonner'

interface SimulationConfig {
    id: string
    origin_company_name: string
    origin_address: string
    origin_city: string
    origin_state: string
    origin_zip: string
    origin_lat: number
    origin_lng: number
    min_delivery_days: number
    max_delivery_days: number
    update_start_hour: number
    update_end_hour: number
}

export default function SimulacaoPage() {
    const [config, setConfig] = useState<SimulationConfig | null>(null)
    const [loading, setLoading] = useState(true)
    const [saving, setSaving] = useState(false)
    const [processing, setProcessing] = useState(false)

    useEffect(() => {
        fetchConfig()
    }, [])

    const fetchConfig = async () => {
        try {
            const response = await fetch('/api/admin/simulation/config')
            const data = await response.json()
            if (data.success && data.config) {
                setConfig(data.config)
            } else {
                // Default config
                setConfig({
                    id: '',
                    origin_company_name: 'Cargo Flash - Centro de Distribuição',
                    origin_address: 'Av. das Nações Unidas, 12901',
                    origin_city: 'São Paulo',
                    origin_state: 'SP',
                    origin_zip: '04578-910',
                    origin_lat: -23.6228,
                    origin_lng: -46.6998,
                    min_delivery_days: 15,
                    max_delivery_days: 19,
                    update_start_hour: 6,
                    update_end_hour: 20,
                })
            }
        } catch {
            toast.error('Erro ao carregar configuração')
        } finally {
            setLoading(false)
        }
    }

    const saveConfig = async () => {
        if (!config) return

        setSaving(true)
        try {
            const response = await fetch('/api/admin/simulation/config', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(config),
            })
            const data = await response.json()
            if (data.success) {
                toast.success('Configuração salva')
                if (data.config) setConfig(data.config)
            } else {
                toast.error(data.error || 'Erro ao salvar')
            }
        } catch {
            toast.error('Erro ao salvar configuração')
        } finally {
            setSaving(false)
        }
    }

    const processEvents = async () => {
        setProcessing(true)
        try {
            const response = await fetch('/api/cron/process-events', {
                method: 'POST',
            })
            const data = await response.json()
            if (data.success) {
                toast.success(`${data.processed} eventos processados`)
            } else {
                toast.error(data.error)
            }
        } catch {
            toast.error('Erro ao processar eventos')
        } finally {
            setProcessing(false)
        }
    }

    const handleChange = (field: keyof SimulationConfig, value: string | number) => {
        if (!config) return
        setConfig({ ...config, [field]: value })
    }

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <Loader2 className="h-8 w-8 animate-spin text-[#00ff41]" />
            </div>
        )
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold font-mono text-[#00ff41] text-glow-sm">
                        SIMULAÇÃO
                    </h1>
                    <p className="text-[#00ff41]/60 font-mono text-sm mt-1">
                        Configuração do motor de simulação de entregas
                    </p>
                </div>
                <div className="flex items-center gap-2">
                    <Button
                        variant="matrix"
                        onClick={processEvents}
                        disabled={processing}
                    >
                        {processing ? (
                            <Loader2 className="h-4 w-4 animate-spin mr-2" />
                        ) : (
                            <Play className="h-4 w-4 mr-2" />
                        )}
                        Processar Eventos Agora
                    </Button>
                </div>
            </div>

            <div className="grid lg:grid-cols-2 gap-6">
                {/* Origin Config */}
                <Card variant="matrix">
                    <CardHeader className="border-b border-[#00ff41]/20">
                        <CardTitle className="font-mono text-[#00ff41] flex items-center gap-2">
                            <MapPin className="h-5 w-5" />
                            ORIGEM (CENTRO DE DISTRIBUIÇÃO)
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="p-6 space-y-4">
                        <div className="space-y-2">
                            <Label variant="matrix">Nome da Empresa</Label>
                            <Input
                                variant="matrix"
                                value={config?.origin_company_name || ''}
                                onChange={(e) => handleChange('origin_company_name', e.target.value)}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label variant="matrix">Endereço</Label>
                            <Input
                                variant="matrix"
                                value={config?.origin_address || ''}
                                onChange={(e) => handleChange('origin_address', e.target.value)}
                            />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label variant="matrix">Cidade</Label>
                                <Input
                                    variant="matrix"
                                    value={config?.origin_city || ''}
                                    onChange={(e) => handleChange('origin_city', e.target.value)}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label variant="matrix">Estado</Label>
                                <Select
                                    value={config?.origin_state || 'SP'}
                                    onValueChange={(v) => handleChange('origin_state', v)}
                                >
                                    <SelectTrigger variant="matrix">
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent variant="matrix">
                                        {BRAZILIAN_STATES.map((s) => (
                                            <SelectItem key={s.value} value={s.value} variant="matrix">
                                                {s.value}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label variant="matrix">CEP</Label>
                                <Input
                                    variant="matrix"
                                    value={config?.origin_zip || ''}
                                    onChange={(e) => handleChange('origin_zip', e.target.value)}
                                />
                            </div>
                        </div>
                        <Separator variant="matrix" />
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label variant="matrix">Latitude</Label>
                                <Input
                                    variant="matrix"
                                    type="number"
                                    step="0.0001"
                                    value={config?.origin_lat || 0}
                                    onChange={(e) => handleChange('origin_lat', parseFloat(e.target.value))}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label variant="matrix">Longitude</Label>
                                <Input
                                    variant="matrix"
                                    type="number"
                                    step="0.0001"
                                    value={config?.origin_lng || 0}
                                    onChange={(e) => handleChange('origin_lng', parseFloat(e.target.value))}
                                />
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Timing Config */}
                <Card variant="matrix">
                    <CardHeader className="border-b border-[#00ff41]/20">
                        <CardTitle className="font-mono text-[#00ff41] flex items-center gap-2">
                            <Clock className="h-5 w-5" />
                            CONFIGURAÇÕES DE TEMPO
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="p-6 space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label variant="matrix">Dias Mínimos p/ Entrega</Label>
                                <Input
                                    variant="matrix"
                                    type="number"
                                    min="1"
                                    max="60"
                                    value={config?.min_delivery_days || 15}
                                    onChange={(e) => handleChange('min_delivery_days', parseInt(e.target.value))}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label variant="matrix">Dias Máximos p/ Entrega</Label>
                                <Input
                                    variant="matrix"
                                    type="number"
                                    min="1"
                                    max="60"
                                    value={config?.max_delivery_days || 19}
                                    onChange={(e) => handleChange('max_delivery_days', parseInt(e.target.value))}
                                />
                            </div>
                        </div>

                        <Separator variant="matrix" />

                        <p className="font-mono text-xs text-[#00ff41]/60">
                            Horário de atualizações (eventos de simulação só ocorrem neste período)
                        </p>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label variant="matrix">Hora Início</Label>
                                <Input
                                    variant="matrix"
                                    type="number"
                                    min="0"
                                    max="23"
                                    value={config?.update_start_hour || 6}
                                    onChange={(e) => handleChange('update_start_hour', parseInt(e.target.value))}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label variant="matrix">Hora Fim</Label>
                                <Input
                                    variant="matrix"
                                    type="number"
                                    min="0"
                                    max="23"
                                    value={config?.update_end_hour || 20}
                                    onChange={(e) => handleChange('update_end_hour', parseInt(e.target.value))}
                                />
                            </div>
                        </div>

                        <div className="p-4 bg-[#00ff41]/5 rounded-lg border border-[#00ff41]/20 mt-4">
                            <p className="font-mono text-sm text-[#00ff41]">
                                ⏰ Atualizações entre {config?.update_start_hour || 6}:00 e {config?.update_end_hour || 20}:00
                            </p>
                            <p className="font-mono text-xs text-[#00ff41]/60 mt-1">
                                Prazo de entrega: {config?.min_delivery_days || 15} a {config?.max_delivery_days || 19} dias úteis
                            </p>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Save Button */}
            <div className="flex justify-end">
                <Button variant="matrixSolid" onClick={saveConfig} disabled={saving}>
                    {saving ? (
                        <Loader2 className="h-4 w-4 animate-spin mr-2" />
                    ) : (
                        <Save className="h-4 w-4 mr-2" />
                    )}
                    Salvar Configurações
                </Button>
            </div>

            {/* Info Card */}
            <Card variant="matrix">
                <CardHeader className="border-b border-[#00ff41]/20">
                    <CardTitle className="font-mono text-[#00ff41] flex items-center gap-2">
                        <Settings className="h-5 w-5" />
                        COMO FUNCIONA
                    </CardTitle>
                </CardHeader>
                <CardContent className="p-6">
                    <div className="grid md:grid-cols-3 gap-6 font-mono text-sm">
                        <div>
                            <p className="text-[#00ff41] mb-2">1. Criação da Entrega</p>
                            <p className="text-[#00ff41]/60">
                                Quando uma entrega é criada com simulação ativada, eventos são agendados automaticamente.
                            </p>
                        </div>
                        <div>
                            <p className="text-[#00ff41] mb-2">2. Processamento</p>
                            <p className="text-[#00ff41]/60">
                                O CRON processa eventos agendados e atualiza status, localizações e histórico.
                            </p>
                        </div>
                        <div>
                            <p className="text-[#00ff41] mb-2">3. Rotas Realistas</p>
                            <p className="text-[#00ff41]/60">
                                O sistema calcula rotas passando por hubs regionais, simulando logística real.
                            </p>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}
