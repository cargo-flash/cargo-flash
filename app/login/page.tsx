'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import {
    Package,
    Loader2,
    Lock,
    Mail,
    Eye,
    EyeOff,
    Shield,
    Zap
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { MatrixRain } from '@/components/admin/matrix-background'
import { toast } from 'sonner'

export default function LoginPage() {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [showPassword, setShowPassword] = useState(false)
    const [isLoading, setIsLoading] = useState(false)
    const [mounted, setMounted] = useState(false)
    const router = useRouter()

    useEffect(() => {
        setMounted(true)
    }, [])

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()

        if (!email || !password) {
            toast.error('Preencha todos os campos')
            return
        }

        setIsLoading(true)

        try {
            const response = await fetch('/api/admin/auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password }),
            })

            const data = await response.json()

            if (data.success) {
                toast.success('Acesso concedido. Iniciando sessão...')
                router.push('/admin/dashboard')
            } else {
                toast.error(data.error || 'Credenciais inválidas')
            }
        } catch {
            toast.error('Erro de conexão com o servidor')
        } finally {
            setIsLoading(false)
        }
    }

    if (!mounted) {
        return null
    }

    return (
        <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center p-4 matrix-theme relative overflow-hidden">
            {/* Matrix Rain Background */}
            <MatrixRain />

            {/* Cyber Grid */}
            <div className="absolute inset-0 cyber-grid opacity-30" />

            {/* Scan Lines */}
            <div className="scanlines fixed inset-0 pointer-events-none z-10" />

            {/* Login Container */}
            <div className="relative z-20 w-full max-w-md">
                {/* Logo Section */}
                <div className="text-center mb-8 animate-slide-down">
                    <div className="inline-flex items-center justify-center p-4 rounded-2xl bg-[#00ff41]/10 border border-[#00ff41]/30 mb-4 box-glow">
                        <Package className="h-12 w-12 text-[#00ff41]" />
                    </div>
                    <h1 className="text-3xl font-bold font-mono text-[#00ff41] text-glow mb-2">
                        CARGO FLASH
                    </h1>
                    <p className="text-[#00ff41]/60 font-mono text-sm">
                        SISTEMA DE CONTROLE v2.0
                    </p>
                </div>

                {/* Login Card */}
                <div className="bg-[#0d1117]/90 border border-[#00ff41]/30 rounded-xl p-8 backdrop-blur-sm shadow-[0_0_40px_rgba(0,255,65,0.1)] animate-slide-up">
                    {/* Header */}
                    <div className="flex items-center gap-3 mb-6 pb-4 border-b border-[#00ff41]/20">
                        <Shield className="h-5 w-5 text-[#00ff41]" />
                        <span className="font-mono text-[#00ff41] text-sm">
                            AUTENTICAÇÃO NECESSÁRIA
                        </span>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* Email Field */}
                        <div className="space-y-2">
                            <Label htmlFor="email" variant="matrix" className="flex items-center gap-2">
                                <Mail className="h-4 w-4" />
                                IDENTIFICADOR
                            </Label>
                            <div className="relative">
                                <Input
                                    id="email"
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="seu@email.com"
                                    variant="matrix"
                                    className="h-12 pl-4"
                                    disabled={isLoading}
                                    autoComplete="email"
                                />
                            </div>
                        </div>

                        {/* Password Field */}
                        <div className="space-y-2">
                            <Label htmlFor="password" variant="matrix" className="flex items-center gap-2">
                                <Lock className="h-4 w-4" />
                                CÓDIGO DE ACESSO
                            </Label>
                            <div className="relative">
                                <Input
                                    id="password"
                                    type={showPassword ? 'text' : 'password'}
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder="••••••••"
                                    variant="matrix"
                                    className="h-12 pl-4 pr-12"
                                    disabled={isLoading}
                                    autoComplete="current-password"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-[#00ff41]/60 hover:text-[#00ff41] transition-colors"
                                >
                                    {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                                </button>
                            </div>
                        </div>

                        {/* Submit Button */}
                        <Button
                            type="submit"
                            variant="matrixSolid"
                            className="w-full h-12 text-base border-glow-pulse"
                            disabled={isLoading}
                        >
                            {isLoading ? (
                                <>
                                    <Loader2 className="h-5 w-5 animate-spin mr-2" />
                                    AUTENTICANDO...
                                </>
                            ) : (
                                <>
                                    <Zap className="h-5 w-5 mr-2" />
                                    INICIAR SESSÃO
                                </>
                            )}
                        </Button>
                    </form>

                    {/* Forgot Password */}
                    <div className="mt-4 text-center">
                        <a
                            href="/forgot-password"
                            className="font-mono text-sm text-[#00ff41]/60 hover:text-[#00ff41] transition-colors"
                        >
                            Esqueci minha senha
                        </a>
                    </div>

                    {/* Footer */}
                    <div className="mt-6 pt-4 border-t border-[#00ff41]/20 text-center">
                        <p className="text-[#00ff41]/40 font-mono text-xs">
                            CONEXÃO SEGURA • CRIPTOGRAFIA AES-256
                        </p>
                    </div>
                </div>

                {/* Demo credentials */}
                <div className="mt-6 text-center">
                    <p className="text-[#00ff41]/40 font-mono text-xs">
                        Demo: admin@cargoflash.com.br / admin123
                    </p>
                </div>
            </div>
        </div>
    )
}
