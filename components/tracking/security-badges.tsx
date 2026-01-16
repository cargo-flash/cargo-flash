'use client'

import {
    Shield,
    Lock,
    CheckCircle
} from 'lucide-react'

interface SecurityBadgesProps {
    isVerified?: boolean
}

export function SecurityBadges({ isVerified = true }: SecurityBadgesProps) {
    return (
        <div className="py-6 border-t border-slate-100">
            <div className="flex flex-col sm:flex-row flex-wrap items-center justify-center gap-4 sm:gap-6 text-sm sm:text-xs text-slate-500">
                <div className="flex items-center gap-2">
                    <Shield className="w-4 h-4 text-slate-400" />
                    <span>Carga Segurada</span>
                </div>
                <div className="flex items-center gap-2">
                    <Lock className="w-4 h-4 text-slate-400" />
                    <span>Dados Protegidos</span>
                </div>
                {isVerified && (
                    <div className="flex items-center gap-2">
                        <CheckCircle className="w-4 h-4 text-[#166534]" />
                        <span>Código Verificado</span>
                    </div>
                )}
            </div>
        </div>
    )
}
