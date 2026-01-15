'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import {
    Package,
    Search,
    Truck,
    Shield,
    Clock,
    MapPin,
    ArrowRight,
    Phone,
    Mail,
    Building2,
    CheckCircle2,
    ChevronRight,
    Headphones
} from 'lucide-react'
import { Button } from '@/components/ui/button'

export default function HomePage() {
    const [mounted, setMounted] = useState(false)
    const [trackingCode, setTrackingCode] = useState('')

    useEffect(() => {
        setMounted(true)
    }, [])

    const handleTrack = () => {
        const code = trackingCode.trim().toUpperCase()
        if (code) {
            window.location.href = `/rastrear/${code}`
        }
    }

    if (!mounted) return null

    return (
        <div className="min-h-screen bg-white flex flex-col">
            {/* Utility Bar - Hidden for now */}
            {/* <div className="bg-[#1a2332] text-white/90 text-sm">...</div> */}

            {/* Main Header */}
            <header className="bg-white border-b border-gray-200">
                <div className="max-w-7xl mx-auto px-4">
                    <div className="flex items-center justify-between h-20">
                        <Link href="/" className="flex items-center gap-3">
                            <div className="flex items-center justify-center w-12 h-12 bg-[#0052cc] rounded-lg">
                                <Truck className="h-6 w-6 text-white" />
                            </div>
                            <div>
                                <div className="text-xl font-bold text-gray-900 tracking-tight">Cargo Flash</div>
                                <div className="text-[11px] text-gray-500 font-medium tracking-wider uppercase">Transportes &amp; Logística Ltda</div>
                            </div>
                        </Link>

                        <nav className="hidden lg:flex items-center gap-8">
                            <Link href="/" className="text-sm font-medium text-[#0052cc]">Rastrear Pedido</Link>
                            <Link href="/sobre" className="text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors">A Empresa</Link>
                            {/* <Link href="/contato" className="text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors">Contato</Link> */}
                        </nav>


                    </div>
                </div>
            </header>

            {/* Hero Section */}
            <section className="flex-grow bg-gradient-to-b from-gray-50 to-white">
                <div className="max-w-7xl mx-auto px-4 py-16 lg:py-24">
                    <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-start">
                        {/* Left Column */}
                        <div>
                            <div className="inline-flex items-center gap-2 bg-green-50 text-green-700 text-sm font-medium px-3 py-1.5 rounded-md mb-6 border border-green-200">
                                <CheckCircle2 className="h-4 w-4" />
                                Sistema de rastreamento disponível 24 horas
                            </div>

                            <h1 className="text-3xl lg:text-4xl xl:text-5xl font-bold text-gray-900 leading-tight mb-4">
                                Rastreie sua encomenda
                            </h1>

                            <p className="text-lg text-gray-600 mb-8 leading-relaxed max-w-lg">
                                Acompanhe em tempo real a localização e o status da sua carga.
                                Digite o código de rastreamento informado na nota fiscal ou etiqueta.
                            </p>

                            {/* Tracking Form */}
                            <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 mb-8">
                                <label htmlFor="tracking" className="block text-sm font-semibold text-gray-800 mb-2">
                                    Código de Rastreamento
                                </label>
                                <div className="flex flex-col sm:flex-row gap-3">
                                    <div className="relative flex-1">
                                        <input
                                            id="tracking"
                                            type="text"
                                            value={trackingCode}
                                            onChange={(e) => setTrackingCode(e.target.value.toUpperCase())}
                                            placeholder="Ex: CF123456789BR"
                                            className="w-full h-12 px-4 rounded-lg bg-gray-50 border border-gray-300 text-gray-900 font-mono tracking-wide focus:outline-none focus:ring-2 focus:ring-[#0052cc] focus:border-transparent transition-all placeholder:text-gray-400"
                                            onKeyDown={(e) => e.key === 'Enter' && handleTrack()}
                                        />
                                    </div>
                                    <button
                                        onClick={handleTrack}
                                        className="h-12 px-6 rounded-lg bg-[#0052cc] hover:bg-[#003d99] text-white font-semibold shadow-sm hover:shadow transition-all flex items-center justify-center gap-2 whitespace-nowrap"
                                    >
                                        <Search className="h-4 w-4" />
                                        Rastrear Pedido
                                    </button>
                                </div>
                                <p className="text-xs text-gray-500 mt-3">
                                    O código está presente na sua nota fiscal, etiqueta de envio ou e-mail de confirmação.
                                </p>
                            </div>

                            {/* Quick Info */}
                            <div className="grid grid-cols-3 gap-4">
                                <div className="text-center p-4 bg-gray-50 rounded-lg border border-gray-100">
                                    <div className="text-2xl font-bold text-[#0052cc]">24h</div>
                                    <div className="text-xs text-gray-600 mt-1">Atualização contínua</div>
                                </div>
                                <div className="text-center p-4 bg-gray-50 rounded-lg border border-gray-100">
                                    <div className="text-2xl font-bold text-[#0052cc]">27</div>
                                    <div className="text-xs text-gray-600 mt-1">Estados atendidos</div>
                                </div>
                                <div className="text-center p-4 bg-gray-50 rounded-lg border border-gray-100">
                                    <div className="text-2xl font-bold text-[#0052cc]">GPS</div>
                                    <div className="text-xs text-gray-600 mt-1">Rastreio via satélite</div>
                                </div>
                            </div>
                        </div>

                        {/* Right Column - Company Info Card */}
                        <div className="lg:mt-12">
                            <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                                {/* Card Header */}
                                <div className="bg-[#1a2332] text-white p-6">
                                    <div className="flex items-center gap-4">
                                        <div className="w-14 h-14 bg-white/10 rounded-lg flex items-center justify-center">
                                            <Building2 className="h-7 w-7" />
                                        </div>
                                        <div>
                                            <h3 className="font-bold text-lg">Cargo Flash Transportes</h3>
                                            <p className="text-white/70 text-sm">Desde 2015 no mercado</p>
                                        </div>
                                    </div>
                                </div>

                                {/* Card Body */}
                                <div className="p-6 space-y-4">
                                    <div className="flex items-start gap-3">
                                        <Shield className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                                        <div>
                                            <div className="font-medium text-gray-900">Carga 100% Segurada</div>
                                            <div className="text-sm text-gray-500">Seguro contra avarias, extravios e roubos</div>
                                        </div>
                                    </div>
                                    <div className="flex items-start gap-3">
                                        <MapPin className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
                                        <div>
                                            <div className="font-medium text-gray-900">Rastreamento em Tempo Real</div>
                                            <div className="text-sm text-gray-500">Monitoramento GPS de toda a frota</div>
                                        </div>
                                    </div>
                                    <div className="flex items-start gap-3">
                                        <Clock className="h-5 w-5 text-amber-600 mt-0.5 flex-shrink-0" />
                                        <div>
                                            <div className="font-medium text-gray-900">Pontualidade Garantida</div>
                                            <div className="text-sm text-gray-500">Cumprimento rigoroso de prazos</div>
                                        </div>
                                    </div>
                                    <div className="flex items-start gap-3">
                                        <Headphones className="h-5 w-5 text-purple-600 mt-0.5 flex-shrink-0" />
                                        <div>
                                            <div className="font-medium text-gray-900">Suporte ao Cliente</div>
                                            <div className="text-sm text-gray-500">Atendimento especializado</div>
                                        </div>
                                    </div>
                                </div>

                                {/* Card Footer */}
                                <div className="border-t border-gray-100 p-4 bg-gray-50">
                                    <Link href="/sobre" className="flex items-center justify-center gap-2 text-sm font-medium text-[#0052cc] hover:text-[#003d99] transition-colors">
                                        Saiba mais sobre a empresa
                                        <ChevronRight className="h-4 w-4" />
                                    </Link>
                                </div>
                            </div>

                            {/* Certifications */}
                            <div className="mt-6 p-4 bg-gray-50 rounded-lg border border-gray-100">
                                <div className="text-xs text-gray-500 text-center mb-3 font-medium uppercase tracking-wider">Certificações e Registros</div>
                                <div className="flex items-center justify-center gap-6 text-xs text-gray-600">
                                    <span className="flex items-center gap-1.5">
                                        <CheckCircle2 className="h-3.5 w-3.5 text-green-600" />
                                        ISO 9001:2015
                                    </span>
                                    <span className="flex items-center gap-1.5">
                                        <CheckCircle2 className="h-3.5 w-3.5 text-green-600" />
                                        ANTT Regular
                                    </span>
                                    <span className="flex items-center gap-1.5">
                                        <CheckCircle2 className="h-3.5 w-3.5 text-green-600" />
                                        SASSMAQ
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="bg-[#1a2332] text-white">
                <div className="max-w-7xl mx-auto px-4 py-12">
                    <div className="grid md:grid-cols-4 gap-8 mb-8">
                        {/* Company */}
                        <div>
                            <div className="flex items-center gap-2 mb-4">
                                <div className="w-10 h-10 bg-[#0052cc] rounded-lg flex items-center justify-center">
                                    <Truck className="h-5 w-5 text-white" />
                                </div>
                                <div>
                                    <div className="font-bold">Cargo Flash</div>
                                    <div className="text-xs text-white/50">Transportes Ltda</div>
                                </div>
                            </div>
                            <p className="text-sm text-white/60 leading-relaxed mb-4">
                                Empresa brasileira especializada em transporte rodoviário de cargas,
                                com cobertura nacional e tecnologia de rastreamento avançada.
                            </p>
                        </div>

                        {/* Links */}
                        <div>
                            <h4 className="font-semibold mb-4 text-sm">Institucional</h4>
                            <ul className="space-y-2.5 text-sm text-white/60">
                                <li><Link href="/sobre" className="hover:text-white transition-colors">A Empresa</Link></li>
                                {/* <li><Link href="/contato" className="hover:text-white transition-colors">Fale Conosco</Link></li> */}

                            </ul>
                        </div>

                        {/* Services */}
                        <div>
                            <h4 className="font-semibold mb-4 text-sm">Serviços</h4>
                            <ul className="space-y-2.5 text-sm text-white/60">
                                <li>Transporte Rodoviário</li>
                                <li>Carga Fracionada</li>
                                <li>Logística Dedicada</li>
                                <li>E-commerce</li>
                            </ul>
                        </div>

                        {/* Contact section hidden for now
                        <div>
                            <h4 className="font-semibold mb-4 text-sm">Contato</h4>
                            <ul className="space-y-2.5 text-sm text-white/60">
                                <li className="flex items-center gap-2">
                                    <Phone className="h-4 w-4" />
                                    (11) 3000-0000
                                </li>
                                <li className="flex items-center gap-2">
                                    <Mail className="h-4 w-4" />
                                    contato@cargoflash.com.br
                                </li>
                                <li className="flex items-start gap-2">
                                    <MapPin className="h-4 w-4 mt-0.5" />
                                    <span>
                                        Av. Eng. Luís Carlos Berrini, 1500<br />
                                        Brooklin, São Paulo - SP<br />
                                        CEP: 04571-000
                                    </span>
                                </li>
                            </ul>
                        </div>
                        */}
                    </div>

                    <div className="border-t border-white/10 pt-6 flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-white/40">
                        <div>© {new Date().getFullYear()} Cargo Flash Transportes e Logística Ltda. Todos os direitos reservados.</div>
                        <div className="flex items-center gap-4">
                            <span>Política de Privacidade</span>
                            <span>Termos de Uso</span>
                        </div>
                    </div>
                </div>
            </footer>
        </div>
    )
}
