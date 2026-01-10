'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Search, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { toast } from 'sonner'

interface TrackingFormProps {
    initialValue?: string
    size?: 'default' | 'large'
    showButton?: boolean
    placeholder?: string
    className?: string
}

export function TrackingForm({
    initialValue = '',
    size = 'default',
    showButton = true,
    placeholder = 'Digite seu código de rastreamento (ex: CF123456789BR)',
    className = '',
}: TrackingFormProps) {
    const [code, setCode] = useState(initialValue)
    const [isLoading, setIsLoading] = useState(false)
    const router = useRouter()

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()

        const trimmedCode = code.trim().toUpperCase()

        if (!trimmedCode) {
            toast.error('Por favor, digite um código de rastreamento')
            return
        }

        if (trimmedCode.length < 8) {
            toast.error('Código de rastreamento inválido')
            return
        }

        setIsLoading(true)

        try {
            // Navigate to tracking page
            router.push(`/rastrear/${trimmedCode}`)
        } catch {
            toast.error('Erro ao buscar rastreamento')
            setIsLoading(false)
        }
    }

    const isLarge = size === 'large'

    return (
        <form onSubmit={handleSubmit} className={`w-full ${className}`}>
            <div className={`flex gap-2 ${isLarge ? 'flex-col sm:flex-row' : 'flex-row'}`}>
                <div className="relative flex-1">
                    <Search className={`absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground ${isLarge ? 'h-5 w-5' : 'h-4 w-4'}`} />
                    <Input
                        type="text"
                        value={code}
                        onChange={(e) => setCode(e.target.value.toUpperCase())}
                        placeholder={placeholder}
                        className={`${isLarge ? 'h-14 pl-11 pr-4 text-lg' : 'h-10 pl-10 pr-4'} font-mono tracking-wider`}
                        disabled={isLoading}
                    />
                </div>
                {showButton && (
                    <Button
                        type="submit"
                        disabled={isLoading}
                        size={isLarge ? 'xl' : 'default'}
                        className={`${isLarge ? 'h-14 px-8 text-lg' : ''} font-semibold bg-[#1e3a5f] hover:bg-[#2d4a6f]`}
                    >
                        {isLoading ? (
                            <>
                                <Loader2 className="h-5 w-5 animate-spin" />
                                <span className="ml-2">Buscando...</span>
                            </>
                        ) : (
                            'Rastrear'
                        )}
                    </Button>
                )}
            </div>
        </form>
    )
}
