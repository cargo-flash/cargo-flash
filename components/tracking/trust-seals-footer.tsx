'use client'

import {
    Shield,
    Lock,
    Award,
    BadgeCheck,
    Star,
    Leaf,
    Globe,
    CreditCard
} from 'lucide-react'
import { useEffect, useState } from 'react'

export function TrustSealsFooter() {
    const [mounted, setMounted] = useState(false)

    useEffect(() => {
        setMounted(true)
    }, [])

    const seals = [
        {
            icon: Shield,
            label: 'SSL Seguro',
            description: 'Conexão criptografada',
            color: 'text-emerald-600 bg-emerald-50'
        },
        {
            icon: BadgeCheck,
            label: 'Dados Verificados',
            description: 'Sistema auditado',
            color: 'text-blue-600 bg-blue-50'
        },
        {
            icon: Lock,
            label: 'LGPD Compliant',
            description: 'Privacidade garantida',
            color: 'text-purple-600 bg-purple-50'
        },
        {
            icon: Award,
            label: 'ISO 9001',
            description: 'Qualidade certificada',
            color: 'text-amber-600 bg-amber-50'
        },
        {
            icon: Star,
            label: '4.9 Estrelas',
            description: '+50mil avaliações',
            color: 'text-yellow-600 bg-yellow-50'
        },
        {
            icon: Leaf,
            label: 'Carbono Neutro',
            description: 'Compromisso ambiental',
            color: 'text-green-600 bg-green-50'
        }
    ]

    const partners = [
        'Visa', 'Mastercard', 'Pix', 'SSL'
    ]

    return (
        <div className={`bg-slate-50 border-t border-slate-100 ${mounted ? 'animate-in fade-in duration-700' : 'opacity-0'
            }`}>
            <div className="container mx-auto px-4 py-12 max-w-6xl">
                {/* Trust Seals */}
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-12">
                    {seals.map((seal, index) => {
                        const Icon = seal.icon
                        return (
                            <div
                                key={index}
                                className={`
                                    flex flex-col items-center p-4 rounded-2xl text-center
                                    transition-all hover:scale-105 ${seal.color}
                                `}
                                style={{ animationDelay: `${index * 100}ms` }}
                            >
                                <Icon className="w-8 h-8 mb-2" />
                                <p className="font-semibold text-sm">{seal.label}</p>
                                <p className="text-xs opacity-70 mt-0.5">{seal.description}</p>
                            </div>
                        )
                    })}
                </div>

                {/* Central Message */}
                <div className="text-center mb-12">
                    <div className="inline-flex items-center gap-3 px-6 py-3 bg-white rounded-2xl shadow-lg shadow-slate-200/50 border border-slate-100">
                        <Globe className="w-6 h-6 text-indigo-600" />
                        <div className="text-left">
                            <p className="font-bold text-slate-800">+1.2 milhões de entregas realizadas</p>
                            <p className="text-sm text-slate-500">Confiança em todo o Brasil</p>
                        </div>
                    </div>
                </div>

                {/* Payment Methods */}
                <div className="flex flex-col md:flex-row items-center justify-between gap-6 pt-8 border-t border-slate-200">
                    <div className="flex items-center gap-6">
                        <span className="text-sm text-slate-500">Pagamentos aceitos:</span>
                        <div className="flex items-center gap-3">
                            {partners.map((partner, index) => (
                                <div
                                    key={index}
                                    className="px-3 py-1.5 bg-white rounded-lg border border-slate-200 text-xs font-medium text-slate-600"
                                >
                                    {partner}
                                </div>
                            ))}
                        </div>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-slate-400">
                        <CreditCard className="w-4 h-4" />
                        <span>Ambiente 100% seguro</span>
                    </div>
                </div>
            </div>
        </div>
    )
}
