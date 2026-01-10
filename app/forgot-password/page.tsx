'use client'

import { useState } from 'react'
import Link from 'next/link'
import { ArrowLeft, Mail, Loader2, CheckCircle2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { MatrixRain } from '@/components/admin/matrix-background'
import { toast } from 'sonner'

export default function ForgotPasswordPage() {
    const [email, setEmail] = useState('')
    const [loading, setLoading] = useState(false)
    const [submitted, setSubmitted] = useState(false)

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()

        if (!email) {
            toast.error('Digite seu email')
            return
        }

        setLoading(true)

        try {
            const response = await fetch('/api/admin/auth/forgot-password', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email }),
            })

            const data = await response.json()

            if (data.success) {
                setSubmitted(true)
                // In development, show the token
                if (data.debug_token) {
                    console.log('Reset token:', data.debug_token)
                    toast.info(`Token de reset (dev): ${data.debug_token.substring(0, 20)}...`)
                }
            } else {
                toast.error(data.error)
            }
        } catch {
            toast.error('Erro de conexão')
        } finally {
            setLoading(false)
        }
    }

    if (submitted) {
        return (
            <div className="min-h-screen bg-[#0d1117] flex items-center justify-center p-4 relative overflow-hidden">
                <MatrixRain />

                <div className="w-full max-w-md relative z-10">
                    <div className="bg-[#0d1117]/90 border border-[#00ff41]/30 rounded-lg p-8 backdrop-blur-sm shadow-[0_0_50px_rgba(0,255,65,0.15)]">
                        <div className="text-center">
                            <div className="mx-auto w-16 h-16 rounded-full bg-[#00ff41]/10 border border-[#00ff41]/30 flex items-center justify-center mb-6">
                                <CheckCircle2 className="h-8 w-8 text-[#00ff41]" />
                            </div>
                            <h1 className="text-2xl font-bold font-mono text-[#00ff41] mb-4">
                                EMAIL ENVIADO
                            </h1>
                            <p className="text-[#00ff41]/60 font-mono text-sm mb-6">
                                Se o email estiver cadastrado, você receberá instruções para redefinir sua senha.
                            </p>
                            <Link href="/login">
                                <Button variant="matrix" className="w-full">
                                    <ArrowLeft className="h-4 w-4 mr-2" />
                                    Voltar ao Login
                                </Button>
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        )
    }

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
                        RECUPERAÇÃO DE SENHA
                    </p>
                </div>

                {/* Form Card */}
                <div className="bg-[#0d1117]/90 border border-[#00ff41]/30 rounded-lg p-8 backdrop-blur-sm shadow-[0_0_50px_rgba(0,255,65,0.15)]">
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="space-y-2">
                            <Label variant="matrix" className="flex items-center gap-2">
                                <Mail className="h-4 w-4" />
                                EMAIL
                            </Label>
                            <Input
                                variant="matrix"
                                type="email"
                                placeholder="admin@cargoflash.com.br"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
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
                                    ENVIANDO...
                                </>
                            ) : (
                                'ENVIAR INSTRUÇÕES'
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
            </div>
        </div>
    )
}
