'use client'

import { useState, useEffect, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, Key, Loader2, CheckCircle2, Eye, EyeOff } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { MatrixRain } from '@/components/admin/matrix-background'
import { toast } from 'sonner'

function ResetPasswordForm() {
    const searchParams = useSearchParams()
    const router = useRouter()
    const [token, setToken] = useState('')
    const [password, setPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')
    const [showPassword, setShowPassword] = useState(false)
    const [loading, setLoading] = useState(false)
    const [success, setSuccess] = useState(false)

    useEffect(() => {
        const urlToken = searchParams.get('token')
        if (urlToken) {
            setToken(urlToken)
        }
    }, [searchParams])

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()

        if (!token) {
            toast.error('Token inválido')
            return
        }

        if (password.length < 6) {
            toast.error('A senha deve ter pelo menos 6 caracteres')
            return
        }

        if (password !== confirmPassword) {
            toast.error('As senhas não coincidem')
            return
        }

        setLoading(true)

        try {
            const response = await fetch('/api/admin/auth/reset-password', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ token, password }),
            })

            const data = await response.json()

            if (data.success) {
                setSuccess(true)
                toast.success('Senha redefinida com sucesso!')
                setTimeout(() => {
                    router.push('/login')
                }, 3000)
            } else {
                toast.error(data.error)
            }
        } catch {
            toast.error('Erro de conexão')
        } finally {
            setLoading(false)
        }
    }

    if (success) {
        return (
            <div className="bg-[#0d1117]/90 border border-[#00ff41]/30 rounded-lg p-8 backdrop-blur-sm shadow-[0_0_50px_rgba(0,255,65,0.15)]">
                <div className="text-center">
                    <div className="mx-auto w-16 h-16 rounded-full bg-[#00ff41]/10 border border-[#00ff41]/30 flex items-center justify-center mb-6">
                        <CheckCircle2 className="h-8 w-8 text-[#00ff41]" />
                    </div>
                    <h1 className="text-2xl font-bold font-mono text-[#00ff41] mb-4">
                        SENHA REDEFINIDA
                    </h1>
                    <p className="text-[#00ff41]/60 font-mono text-sm mb-6">
                        Sua senha foi alterada com sucesso. Redirecionando para o login...
                    </p>
                    <Loader2 className="h-6 w-6 animate-spin text-[#00ff41] mx-auto" />
                </div>
            </div>
        )
    }

    if (!token) {
        return (
            <div className="bg-[#0d1117]/90 border border-[#00ff41]/30 rounded-lg p-8 backdrop-blur-sm shadow-[0_0_50px_rgba(0,255,65,0.15)]">
                <div className="text-center">
                    <h1 className="text-2xl font-bold font-mono text-[#ff0040] mb-4">
                        TOKEN INVÁLIDO
                    </h1>
                    <p className="text-[#00ff41]/60 font-mono text-sm mb-6">
                        O link de redefinição é inválido ou expirou.
                    </p>
                    <Link href="/forgot-password">
                        <Button variant="matrix" className="w-full">
                            Solicitar Novo Link
                        </Button>
                    </Link>
                </div>
            </div>
        )
    }

    return (
        <div className="bg-[#0d1117]/90 border border-[#00ff41]/30 rounded-lg p-8 backdrop-blur-sm shadow-[0_0_50px_rgba(0,255,65,0.15)]">
            <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                    <Label variant="matrix" className="flex items-center gap-2">
                        <Key className="h-4 w-4" />
                        NOVA SENHA
                    </Label>
                    <div className="relative">
                        <Input
                            variant="matrix"
                            type={showPassword ? 'text' : 'password'}
                            placeholder="Mínimo 6 caracteres"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            disabled={loading}
                        />
                        <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-[#00ff41]/50 hover:text-[#00ff41]"
                        >
                            {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </button>
                    </div>
                </div>

                <div className="space-y-2">
                    <Label variant="matrix">CONFIRMAR SENHA</Label>
                    <Input
                        variant="matrix"
                        type={showPassword ? 'text' : 'password'}
                        placeholder="Digite a senha novamente"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        disabled={loading}
                    />
                </div>

                <Button
                    type="submit"
                    variant="matrixSolid"
                    className="w-full"
                    disabled={loading}
                >
                    {loading ? (
                        <>
                            <Loader2 className="h-4 w-4 animate-spin mr-2" />
                            SALVANDO...
                        </>
                    ) : (
                        'REDEFINIR SENHA'
                    )}
                </Button>
            </form>

            <div className="mt-6 pt-6 border-t border-[#00ff41]/20 text-center">
                <Link
                    href="/login"
                    className="font-mono text-sm text-[#00ff41]/60 hover:text-[#00ff41] transition-colors flex items-center justify-center gap-2"
                >
                    <ArrowLeft className="h-4 w-4" />
                    Voltar ao Login
                </Link>
            </div>
        </div>
    )
}

export default function ResetPasswordPage() {
    return (
        <div className="min-h-screen bg-[#0d1117] flex items-center justify-center p-4 relative overflow-hidden">
            <MatrixRain />

            <div className="w-full max-w-md relative z-10">
                {/* Logo */}
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-bold font-mono text-[#00ff41] text-glow mb-2">
                        CARGO FLASH
                    </h1>
                    <p className="font-mono text-[#00ff41]/60 text-sm">
                        REDEFINIR SENHA
                    </p>
                </div>

                <Suspense fallback={
                    <div className="bg-[#0d1117]/90 border border-[#00ff41]/30 rounded-lg p-8 backdrop-blur-sm">
                        <Loader2 className="h-8 w-8 animate-spin text-[#00ff41] mx-auto" />
                    </div>
                }>
                    <ResetPasswordForm />
                </Suspense>
            </div>
        </div>
    )
}
