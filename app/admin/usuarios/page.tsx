'use client'

import { useEffect, useState } from 'react'
import {
    Users,
    Plus,
    Edit,
    Trash2,
    Shield,
    CheckCircle,
    XCircle,
    Loader2,
    Mail,
    Key
} from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from '@/components/ui/dialog'
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select'
import { formatDateTimeString } from '@/lib/utils'
import { toast } from 'sonner'

interface Admin {
    id: string
    email: string
    full_name: string
    role: string
    is_active: boolean
    created_at: string
}

export default function UsuariosPage() {
    const [users, setUsers] = useState<Admin[]>([])
    const [loading, setLoading] = useState(true)
    const [isDialogOpen, setIsDialogOpen] = useState(false)
    const [saving, setSaving] = useState(false)
    const [formData, setFormData] = useState({
        email: '',
        full_name: '',
        password: '',
        role: 'admin',
    })

    useEffect(() => {
        fetchUsers()
    }, [])

    const fetchUsers = async () => {
        try {
            const response = await fetch('/api/admin/users')
            const data = await response.json()
            if (data.success) {
                setUsers(data.users)
            }
        } catch {
            toast.error('Erro ao carregar usuários')
        } finally {
            setLoading(false)
        }
    }

    const createUser = async () => {
        if (!formData.email || !formData.full_name || !formData.password) {
            toast.error('Preencha todos os campos')
            return
        }

        setSaving(true)
        try {
            const response = await fetch('/api/admin/users', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
            })
            const data = await response.json()
            if (data.success) {
                toast.success('Usuário criado')
                setIsDialogOpen(false)
                setFormData({ email: '', full_name: '', password: '', role: 'admin' })
                fetchUsers()
            } else {
                toast.error(data.error)
            }
        } catch {
            toast.error('Erro ao criar usuário')
        } finally {
            setSaving(false)
        }
    }

    const toggleStatus = async (id: string, isActive: boolean) => {
        try {
            const response = await fetch(`/api/admin/users/${id}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ is_active: !isActive }),
            })
            const data = await response.json()
            if (data.success) {
                toast.success(isActive ? 'Usuário desativado' : 'Usuário ativado')
                fetchUsers()
            }
        } catch {
            toast.error('Erro ao atualizar')
        }
    }

    const deleteUser = async (id: string) => {
        if (!confirm('Tem certeza que deseja excluir este usuário?')) return

        try {
            const response = await fetch(`/api/admin/users/${id}`, {
                method: 'DELETE',
            })
            const data = await response.json()
            if (data.success) {
                toast.success('Usuário excluído')
                fetchUsers()
            }
        } catch {
            toast.error('Erro ao excluir')
        }
    }

    const getRoleBadge = (role: string) => {
        switch (role) {
            case 'super_admin':
                return <Badge variant="matrix">Super Admin</Badge>
            case 'admin':
                return <Badge variant="matrixCyan">Admin</Badge>
            default:
                return <Badge variant="matrixAmber">Operador</Badge>
        }
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
                        USUÁRIOS
                    </h1>
                    <p className="text-[#00ff41]/60 font-mono text-sm mt-1">
                        Gerenciamento de administradores do sistema
                    </p>
                </div>
                <Button variant="matrixSolid" onClick={() => setIsDialogOpen(true)}>
                    <Plus className="h-4 w-4 mr-2" />
                    Novo Usuário
                </Button>
            </div>

            {/* Users List */}
            <Card variant="matrix">
                <CardHeader className="border-b border-[#00ff41]/20">
                    <CardTitle className="font-mono text-[#00ff41] flex items-center gap-2">
                        <Users className="h-5 w-5" />
                        LISTA DE USUÁRIOS
                    </CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                    {users.length === 0 ? (
                        <div className="p-8 text-center">
                            <Users className="h-12 w-12 text-[#00ff41]/20 mx-auto mb-3" />
                            <p className="font-mono text-[#00ff41]/60">Nenhum usuário encontrado</p>
                        </div>
                    ) : (
                        <div className="divide-y divide-[#00ff41]/10">
                            {users.map((user) => (
                                <div key={user.id} className="flex items-center gap-4 p-4 hover:bg-[#00ff41]/5">
                                    <div className="p-2 rounded-lg bg-[#00ff41]/10 border border-[#00ff41]/20">
                                        <Shield className="h-5 w-5 text-[#00ff41]" />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center gap-2">
                                            <span className="font-mono text-[#00ff41]">{user.full_name}</span>
                                            {getRoleBadge(user.role)}
                                            {!user.is_active && (
                                                <Badge variant="matrixRed">Inativo</Badge>
                                            )}
                                        </div>
                                        <p className="font-mono text-xs text-[#00ff41]/60">{user.email}</p>
                                    </div>
                                    <div className="text-right shrink-0">
                                        <p className="font-mono text-xs text-[#00ff41]/40">
                                            Criado em {formatDateTimeString(user.created_at)}
                                        </p>
                                    </div>
                                    <div className="flex items-center gap-1">
                                        <Button
                                            variant="matrixGhost"
                                            size="icon"
                                            className="h-8 w-8"
                                            onClick={() => toggleStatus(user.id, user.is_active)}
                                        >
                                            {user.is_active ? (
                                                <XCircle className="h-4 w-4 text-amber-500" />
                                            ) : (
                                                <CheckCircle className="h-4 w-4 text-green-500" />
                                            )}
                                        </Button>
                                        <Button
                                            variant="matrixGhost"
                                            size="icon"
                                            className="h-8 w-8 text-[#ff0040] hover:text-[#ff0040]"
                                            onClick={() => deleteUser(user.id)}
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

            {/* Create Dialog */}
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogContent variant="matrix" className="max-w-md">
                    <DialogHeader>
                        <DialogTitle className="font-mono text-[#00ff41]">NOVO USUÁRIO</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                        <div className="space-y-2">
                            <Label variant="matrix">Nome Completo</Label>
                            <Input
                                variant="matrix"
                                value={formData.full_name}
                                onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label variant="matrix">Email</Label>
                            <Input
                                variant="matrix"
                                type="email"
                                value={formData.email}
                                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label variant="matrix">Senha</Label>
                            <Input
                                variant="matrix"
                                type="password"
                                value={formData.password}
                                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label variant="matrix">Permissão</Label>
                            <Select value={formData.role} onValueChange={(v) => setFormData({ ...formData, role: v })}>
                                <SelectTrigger variant="matrix">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent variant="matrix">
                                    <SelectItem value="operator" variant="matrix">Operador</SelectItem>
                                    <SelectItem value="admin" variant="matrix">Admin</SelectItem>
                                    <SelectItem value="super_admin" variant="matrix">Super Admin</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                    <DialogFooter>
                        <Button variant="matrix" onClick={() => setIsDialogOpen(false)}>
                            Cancelar
                        </Button>
                        <Button variant="matrixSolid" onClick={createUser} disabled={saving}>
                            {saving ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
                            Criar
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    )
}
