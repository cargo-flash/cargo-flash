'use client'

import { useEffect, useState } from 'react'
import {
    Warehouse,
    Plus,
    Trash2,
    Edit2,
    MapPin,
    Save,
    Loader2,
    RefreshCw,
    X,
    CheckCircle2,
    Building2,
    Navigation
} from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from '@/components/ui/dialog'
import { toast } from 'sonner'

interface WarehouseData {
    id: string
    api_key_id: string | null
    name: string
    code: string | null
    address: string
    city: string
    state: string
    zip: string | null
    lat: number
    lng: number
    is_default: boolean
    is_active: boolean
    contact_name: string | null
    contact_phone: string | null
    contact_email: string | null
    created_at: string
    api_keys?: {
        id: string
        name: string
        store_url: string | null
    }
}

interface ApiKey {
    id: string
    name: string
    store_url: string | null
}

const EMPTY_WAREHOUSE = {
    name: '',
    code: '',
    address: '',
    city: '',
    state: '',
    zip: '',
    lat: -23.5505,
    lng: -46.6333,
    is_default: false,
    is_active: true,
    contact_name: '',
    contact_phone: '',
    contact_email: '',
    api_key_id: '',
}

export default function GalpoesPage() {
    const [warehouses, setWarehouses] = useState<WarehouseData[]>([])
    const [apiKeys, setApiKeys] = useState<ApiKey[]>([])
    const [loading, setLoading] = useState(true)
    const [saving, setSaving] = useState(false)

    const [showDialog, setShowDialog] = useState(false)
    const [editingId, setEditingId] = useState<string | null>(null)
    const [formData, setFormData] = useState(EMPTY_WAREHOUSE)

    useEffect(() => {
        fetchWarehouses()
        fetchApiKeys()
    }, [])

    const fetchWarehouses = async () => {
        try {
            const response = await fetch('/api/admin/warehouses')
            const data = await response.json()
            if (data.success) {
                setWarehouses(data.warehouses || [])
            }
        } catch (error) {
            console.error('Error fetching warehouses:', error)
            toast.error('Erro ao carregar galpões')
        } finally {
            setLoading(false)
        }
    }

    const fetchApiKeys = async () => {
        try {
            const response = await fetch('/api/admin/api-keys')
            const data = await response.json()
            if (data.success) {
                setApiKeys(data.keys || [])
            }
        } catch (error) {
            console.error('Error fetching API keys:', error)
        }
    }

    const openNewDialog = () => {
        setEditingId(null)
        setFormData(EMPTY_WAREHOUSE)
        setShowDialog(true)
    }

    const openEditDialog = (warehouse: WarehouseData) => {
        setEditingId(warehouse.id)
        setFormData({
            name: warehouse.name,
            code: warehouse.code || '',
            address: warehouse.address,
            city: warehouse.city,
            state: warehouse.state,
            zip: warehouse.zip || '',
            lat: warehouse.lat,
            lng: warehouse.lng,
            is_default: warehouse.is_default,
            is_active: warehouse.is_active,
            contact_name: warehouse.contact_name || '',
            contact_phone: warehouse.contact_phone || '',
            contact_email: warehouse.contact_email || '',
            api_key_id: warehouse.api_key_id || '',
        })
        setShowDialog(true)
    }

    const saveWarehouse = async () => {
        if (!formData.name.trim()) {
            toast.error('Nome é obrigatório')
            return
        }
        if (!formData.address.trim()) {
            toast.error('Endereço é obrigatório')
            return
        }
        if (!formData.city.trim()) {
            toast.error('Cidade é obrigatória')
            return
        }
        if (!formData.state.trim() || formData.state.length !== 2) {
            toast.error('Estado deve ter 2 caracteres (ex: SP)')
            return
        }

        setSaving(true)
        try {
            const payload = {
                ...formData,
                api_key_id: formData.api_key_id || null,
            }

            const url = '/api/admin/warehouses'
            const method = editingId ? 'PUT' : 'POST'
            const body = editingId ? { ...payload, id: editingId } : payload

            const response = await fetch(url, {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(body),
            })

            const data = await response.json()
            if (data.success) {
                toast.success(editingId ? 'Galpão atualizado!' : 'Galpão criado!')
                setShowDialog(false)
                fetchWarehouses()
            } else {
                toast.error(data.error || 'Erro ao salvar')
            }
        } catch (error) {
            console.error('Error saving warehouse:', error)
            toast.error('Erro ao salvar galpão')
        } finally {
            setSaving(false)
        }
    }

    const deleteWarehouse = async (id: string) => {
        if (!confirm('Tem certeza que deseja excluir este galpão?')) {
            return
        }

        try {
            const response = await fetch(`/api/admin/warehouses?id=${id}`, {
                method: 'DELETE',
            })

            const data = await response.json()
            if (data.success) {
                toast.success('Galpão excluído')
                fetchWarehouses()
            } else {
                toast.error(data.error || 'Erro ao excluir')
            }
        } catch (error) {
            console.error('Error deleting warehouse:', error)
            toast.error('Erro ao excluir galpão')
        }
    }

    const toggleDefault = async (warehouse: WarehouseData) => {
        try {
            const response = await fetch('/api/admin/warehouses', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    id: warehouse.id,
                    is_default: !warehouse.is_default,
                }),
            })

            const data = await response.json()
            if (data.success) {
                toast.success(warehouse.is_default ? 'Galpão não é mais padrão' : 'Galpão definido como padrão')
                fetchWarehouses()
            }
        } catch (error) {
            console.error('Error toggling default:', error)
        }
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold font-mono text-[#00ff41] text-glow-sm">
                        GALPÕES / ORIGENS
                    </h1>
                    <p className="text-[#00ff41]/60 font-mono text-sm mt-1">
                        Gerencie os galpões de origem para rotas de entrega
                    </p>
                </div>
                <div className="flex gap-2">
                    <Button variant="matrixGhost" size="icon" onClick={fetchWarehouses}>
                        <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
                    </Button>
                    <Button variant="matrixSolid" onClick={openNewDialog}>
                        <Plus className="h-4 w-4 mr-2" />
                        Novo Galpão
                    </Button>
                </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card variant="matrix" className="p-4">
                    <div className="flex items-center gap-3">
                        <div className="p-2 rounded-lg bg-[#00ff41]/10 border border-[#00ff41]/20">
                            <Warehouse className="h-5 w-5 text-[#00ff41]" />
                        </div>
                        <div>
                            <p className="font-mono text-2xl text-[#00ff41]">{warehouses.length}</p>
                            <p className="font-mono text-xs text-[#00ff41]/60">Total de Galpões</p>
                        </div>
                    </div>
                </Card>
                <Card variant="matrix" className="p-4">
                    <div className="flex items-center gap-3">
                        <div className="p-2 rounded-lg bg-[#00ff41]/10 border border-[#00ff41]/20">
                            <CheckCircle2 className="h-5 w-5 text-[#00ff41]" />
                        </div>
                        <div>
                            <p className="font-mono text-2xl text-[#00ff41]">
                                {warehouses.filter(w => w.is_active).length}
                            </p>
                            <p className="font-mono text-xs text-[#00ff41]/60">Ativos</p>
                        </div>
                    </div>
                </Card>
                <Card variant="matrix" className="p-4">
                    <div className="flex items-center gap-3">
                        <div className="p-2 rounded-lg bg-[#00ff41]/10 border border-[#00ff41]/20">
                            <Building2 className="h-5 w-5 text-[#00ff41]" />
                        </div>
                        <div>
                            <p className="font-mono text-2xl text-[#00ff41]">
                                {warehouses.filter(w => w.is_default).length}
                            </p>
                            <p className="font-mono text-xs text-[#00ff41]/60">Padrão</p>
                        </div>
                    </div>
                </Card>
            </div>

            {/* Warehouses List */}
            <Card variant="matrix">
                <CardHeader className="border-b border-[#00ff41]/20">
                    <CardTitle className="font-mono text-[#00ff41] flex items-center gap-2">
                        <Warehouse className="h-5 w-5" />
                        LISTA DE GALPÕES
                    </CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                    {loading ? (
                        <div className="p-8 text-center">
                            <Loader2 className="h-8 w-8 animate-spin text-[#00ff41] mx-auto" />
                        </div>
                    ) : warehouses.length === 0 ? (
                        <div className="p-8 text-center">
                            <Warehouse className="h-12 w-12 text-[#00ff41]/20 mx-auto mb-3" />
                            <p className="font-mono text-[#00ff41]/60">Nenhum galpão cadastrado</p>
                            <p className="font-mono text-xs text-[#00ff41]/40 mt-1">
                                Crie um galpão para definir origens personalizadas
                            </p>
                            <Button variant="matrix" className="mt-4" onClick={openNewDialog}>
                                <Plus className="h-4 w-4 mr-2" />
                                Criar Primeiro Galpão
                            </Button>
                        </div>
                    ) : (
                        <div className="divide-y divide-[#00ff41]/10">
                            {warehouses.map((warehouse) => (
                                <div
                                    key={warehouse.id}
                                    className="flex items-center gap-4 p-4 hover:bg-[#00ff41]/5 transition-colors"
                                >
                                    <div className="p-2 rounded-lg bg-[#00ff41]/10 border border-[#00ff41]/20">
                                        <Warehouse className={`h-5 w-5 ${warehouse.is_active ? 'text-[#00ff41]' : 'text-[#00ff41]/40'}`} />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center gap-2">
                                            <p className="font-mono text-[#00ff41]">{warehouse.name}</p>
                                            {warehouse.is_default && (
                                                <span className="px-2 py-0.5 bg-[#00ff41]/20 rounded text-xs font-mono text-[#00ff41]">
                                                    PADRÃO
                                                </span>
                                            )}
                                            {!warehouse.is_active && (
                                                <span className="px-2 py-0.5 bg-[#ff0040]/20 rounded text-xs font-mono text-[#ff0040]">
                                                    INATIVO
                                                </span>
                                            )}
                                        </div>
                                        <p className="font-mono text-xs text-[#00ff41]/50 truncate">
                                            <MapPin className="h-3 w-3 inline mr-1" />
                                            {warehouse.city}, {warehouse.state} • {warehouse.address}
                                        </p>
                                        {warehouse.api_keys && (
                                            <p className="font-mono text-xs text-[#00ff41]/40 mt-1">
                                                Vinculado: {warehouse.api_keys.name}
                                            </p>
                                        )}
                                    </div>
                                    <div className="flex items-center gap-1">
                                        <Button
                                            variant="matrixGhost"
                                            size="icon"
                                            className="h-8 w-8"
                                            onClick={() => toggleDefault(warehouse)}
                                            title={warehouse.is_default ? 'Remover como padrão' : 'Definir como padrão'}
                                        >
                                            <CheckCircle2 className={`h-4 w-4 ${warehouse.is_default ? 'text-[#00ff41]' : 'text-[#00ff41]/40'}`} />
                                        </Button>
                                        <Button
                                            variant="matrixGhost"
                                            size="icon"
                                            className="h-8 w-8"
                                            onClick={() => openEditDialog(warehouse)}
                                        >
                                            <Edit2 className="h-4 w-4" />
                                        </Button>
                                        <Button
                                            variant="matrixGhost"
                                            size="icon"
                                            className="h-8 w-8 text-[#ff0040] hover:text-[#ff0040] hover:bg-[#ff0040]/10"
                                            onClick={() => deleteWarehouse(warehouse.id)}
                                        >
                                            <Trash2 className="h-4 w-4" />
                                        </Button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </CardContent>
            </Card>

            {/* Warehouse Dialog */}
            <Dialog open={showDialog} onOpenChange={setShowDialog}>
                <DialogContent variant="matrix" className="max-w-2xl">
                    <DialogHeader>
                        <DialogTitle className="font-mono text-[#00ff41]">
                            {editingId ? 'EDITAR GALPÃO' : 'NOVO GALPÃO'}
                        </DialogTitle>
                    </DialogHeader>
                    <div className="py-4 space-y-4 max-h-[60vh] overflow-y-auto">
                        {/* Basic Info */}
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label variant="matrix">Nome *</Label>
                                <Input
                                    variant="matrix"
                                    placeholder="Ex: Galpão São Paulo"
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label variant="matrix">Código (opcional)</Label>
                                <Input
                                    variant="matrix"
                                    placeholder="Ex: SP-01"
                                    value={formData.code}
                                    onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                                />
                            </div>
                        </div>

                        {/* Address */}
                        <div className="space-y-2">
                            <Label variant="matrix">Endereço *</Label>
                            <Input
                                variant="matrix"
                                placeholder="Rua, número, bairro"
                                value={formData.address}
                                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                            />
                        </div>

                        <div className="grid grid-cols-3 gap-4">
                            <div className="space-y-2">
                                <Label variant="matrix">Cidade *</Label>
                                <Input
                                    variant="matrix"
                                    placeholder="São Paulo"
                                    value={formData.city}
                                    onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label variant="matrix">Estado *</Label>
                                <Input
                                    variant="matrix"
                                    placeholder="SP"
                                    maxLength={2}
                                    value={formData.state}
                                    onChange={(e) => setFormData({ ...formData, state: e.target.value.toUpperCase() })}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label variant="matrix">CEP</Label>
                                <Input
                                    variant="matrix"
                                    placeholder="00000-000"
                                    value={formData.zip}
                                    onChange={(e) => setFormData({ ...formData, zip: e.target.value })}
                                />
                            </div>
                        </div>

                        {/* Coordinates */}
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label variant="matrix">Latitude *</Label>
                                <Input
                                    variant="matrix"
                                    type="number"
                                    step="0.0001"
                                    placeholder="-23.5505"
                                    value={formData.lat}
                                    onChange={(e) => setFormData({ ...formData, lat: parseFloat(e.target.value) || 0 })}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label variant="matrix">Longitude *</Label>
                                <Input
                                    variant="matrix"
                                    type="number"
                                    step="0.0001"
                                    placeholder="-46.6333"
                                    value={formData.lng}
                                    onChange={(e) => setFormData({ ...formData, lng: parseFloat(e.target.value) || 0 })}
                                />
                            </div>
                        </div>

                        <p className="font-mono text-xs text-[#00ff41]/40">
                            <Navigation className="h-3 w-3 inline mr-1" />
                            Dica: Use Google Maps para obter as coordenadas exatas
                        </p>

                        {/* Link to API Key */}
                        <div className="space-y-2">
                            <Label variant="matrix">Vincular a API Key (opcional)</Label>
                            <select
                                value={formData.api_key_id}
                                onChange={(e) => setFormData({ ...formData, api_key_id: e.target.value })}
                                className="w-full h-10 px-3 rounded-md bg-[#0d1117] border border-[#00ff41]/30 text-[#00ff41] font-mono text-sm focus:outline-none focus:ring-2 focus:ring-[#00ff41]/50"
                            >
                                <option value="">Nenhuma (usar para todas)</option>
                                {apiKeys.map((key) => (
                                    <option key={key.id} value={key.id}>
                                        {key.name} {key.store_url ? `(${key.store_url})` : ''}
                                    </option>
                                ))}
                            </select>
                            <p className="font-mono text-xs text-[#00ff41]/40">
                                Vincular a uma API Key faz com que pedidos dessa loja usem este galpão automaticamente
                            </p>
                        </div>

                        {/* Contact */}
                        <div className="grid grid-cols-3 gap-4">
                            <div className="space-y-2">
                                <Label variant="matrix">Contato</Label>
                                <Input
                                    variant="matrix"
                                    placeholder="Nome"
                                    value={formData.contact_name}
                                    onChange={(e) => setFormData({ ...formData, contact_name: e.target.value })}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label variant="matrix">Telefone</Label>
                                <Input
                                    variant="matrix"
                                    placeholder="(11) 99999-9999"
                                    value={formData.contact_phone}
                                    onChange={(e) => setFormData({ ...formData, contact_phone: e.target.value })}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label variant="matrix">Email</Label>
                                <Input
                                    variant="matrix"
                                    type="email"
                                    placeholder="email@exemplo.com"
                                    value={formData.contact_email}
                                    onChange={(e) => setFormData({ ...formData, contact_email: e.target.value })}
                                />
                            </div>
                        </div>

                        {/* Toggles */}
                        <div className="flex gap-4">
                            <div className="flex items-center gap-2">
                                <button
                                    type="button"
                                    onClick={() => setFormData({ ...formData, is_active: !formData.is_active })}
                                    className={`w-10 h-5 rounded-full transition-colors ${formData.is_active ? 'bg-[#00ff41]' : 'bg-[#00ff41]/20'}`}
                                >
                                    <div className={`w-4 h-4 rounded-full bg-[#0d1117] transition-transform ${formData.is_active ? 'translate-x-5' : 'translate-x-0.5'}`} />
                                </button>
                                <span className="font-mono text-sm text-[#00ff41]">Ativo</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <button
                                    type="button"
                                    onClick={() => setFormData({ ...formData, is_default: !formData.is_default })}
                                    className={`w-10 h-5 rounded-full transition-colors ${formData.is_default ? 'bg-[#00ff41]' : 'bg-[#00ff41]/20'}`}
                                >
                                    <div className={`w-4 h-4 rounded-full bg-[#0d1117] transition-transform ${formData.is_default ? 'translate-x-5' : 'translate-x-0.5'}`} />
                                </button>
                                <span className="font-mono text-sm text-[#00ff41]">Padrão</span>
                            </div>
                        </div>
                    </div>
                    <DialogFooter>
                        <Button variant="matrix" onClick={() => setShowDialog(false)}>
                            <X className="h-4 w-4 mr-2" />
                            Cancelar
                        </Button>
                        <Button variant="matrixSolid" onClick={saveWarehouse} disabled={saving}>
                            {saving ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Save className="h-4 w-4 mr-2" />}
                            {editingId ? 'Atualizar' : 'Criar'} Galpão
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    )
}
