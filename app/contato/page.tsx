'use client'

import { useState } from 'react'
import Link from 'next/link'
import {
    Truck,
    Phone,
    Mail,
    MapPin,
    Clock,
    Send,
    MessageCircle,
    Loader2,
    CheckCircle2
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { toast } from 'sonner'

export default function ContatoPage() {
    const [loading, setLoading] = useState(false)
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        subject: '',
        message: '',
    })

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)

        try {
            const response = await fetch('/api/contact', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
            })

            const data = await response.json()

            if (data.success) {
                toast.success(data.message)
                setFormData({ name: '', email: '', phone: '', subject: '', message: '' })
            } else {
                toast.error(data.error)
            }
        } catch {
            toast.error('Erro ao enviar mensagem')
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="min-h-screen bg-white flex flex-col">
            {/* Utility Bar */}
            <div className="bg-[#1a2332] text-white/90 text-sm">
                <div className="max-w-7xl mx-auto px-4 py-2.5 flex items-center justify-between">
                    <div className="hidden md:flex items-center divide-x divide-white/20">
                        <a href="tel:+551130000000" className="flex items-center gap-2 pr-4 hover:text-white transition-colors">
                            <Phone className="h-3.5 w-3.5" />
                            <span>(11) 3000-0000</span>
                        </a>
                        <a href="mailto:contato@cargoflash.com.br" className="flex items-center gap-2 px-4 hover:text-white transition-colors">
                            <Mail className="h-3.5 w-3.5" />
                            <span>contato@cargoflash.com.br</span>
                        </a>
                        <span className="flex items-center gap-2 pl-4 text-white/60">
                            <Clock className="h-3.5 w-3.5" />
                            Seg-Sex: 8h às 18h
                        </span>
                    </div>
                </div>
            </div>

            {/* Header */}
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
                            <Link href="/" className="text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors">Rastrear Pedido</Link>
                            <Link href="/sobre" className="text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors">A Empresa</Link>
                            <Link href="/contato" className="text-sm font-semibold text-[#0052cc]">Contato</Link>
                        </nav>

                        <div className="flex items-center gap-3">
                            <Link href="/login">
                                <Button variant="outline" className="hidden md:flex border-gray-300 text-gray-700 hover:bg-gray-50 h-10">
                                    Área do Cliente
                                </Button>
                            </Link>
                        </div>
                    </div>
                </div>
            </header>

            {/* Hero Section */}
            <section className="bg-[#1a2332] text-white py-16">
                <div className="max-w-7xl mx-auto px-4 text-center">
                    <h1 className="text-4xl md:text-5xl font-bold mb-4">
                        Fale Conosco
                    </h1>
                    <p className="text-xl text-white/70 max-w-2xl mx-auto">
                        Estamos prontos para atender você. Entre em contato por qualquer um de nossos canais.
                    </p>
                </div>
            </section>

            {/* Content */}
            <section className="flex-grow py-16 bg-gray-50">
                <div className="max-w-7xl mx-auto px-4">
                    <div className="grid lg:grid-cols-3 gap-8">
                        {/* Contact Info */}
                        <div className="space-y-6">
                            <h2 className="text-2xl font-bold text-gray-900 mb-6">
                                Informações de Contato
                            </h2>

                            {[
                                {
                                    icon: Phone,
                                    title: 'Telefone',
                                    content: '(11) 3000-0000',
                                    action: 'tel:+551130000000',
                                },
                                {
                                    icon: Mail,
                                    title: 'Email',
                                    content: 'contato@cargoflash.com.br',
                                    action: 'mailto:contato@cargoflash.com.br',
                                },
                                {
                                    icon: MessageCircle,
                                    title: 'WhatsApp',
                                    content: '(11) 99999-9999',
                                    action: 'https://wa.me/5511999999999',
                                },
                                {
                                    icon: MapPin,
                                    title: 'Endereço',
                                    content: 'Av. Eng. Luís Carlos Berrini, 1500\nBrooklin, São Paulo - SP\nCEP: 04571-000',
                                },
                            ].map((item, i) => (
                                <div key={i} className="bg-white rounded-xl border border-gray-200 p-4 flex items-start gap-4">
                                    <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-[#0052cc]/10 text-[#0052cc] shrink-0">
                                        <item.icon className="h-5 w-5" />
                                    </div>
                                    <div>
                                        <p className="font-semibold text-gray-900">{item.title}</p>
                                        {item.action ? (
                                            <a href={item.action} className="text-[#0052cc] hover:underline whitespace-pre-line text-sm">
                                                {item.content}
                                            </a>
                                        ) : (
                                            <p className="text-gray-600 whitespace-pre-line text-sm">{item.content}</p>
                                        )}
                                    </div>
                                </div>
                            ))}

                            {/* Hours */}
                            <div className="bg-white rounded-xl border border-gray-200 p-4">
                                <div className="flex items-center gap-2 mb-3">
                                    <Clock className="h-5 w-5 text-[#0052cc]" />
                                    <p className="font-semibold text-gray-900">Horário de Atendimento</p>
                                </div>
                                <p className="text-gray-600 text-sm">Segunda a Sexta: 08h às 18h</p>
                                <p className="text-gray-600 text-sm">Sábado: 08h às 12h</p>
                            </div>
                        </div>

                        {/* Contact Form */}
                        <div className="lg:col-span-2">
                            <div className="bg-white rounded-xl border border-gray-200 p-6">
                                <h2 className="text-2xl font-bold text-gray-900 mb-6">
                                    Envie sua Mensagem
                                </h2>

                                <form onSubmit={handleSubmit} className="space-y-4">
                                    <div className="grid md:grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <Label className="text-gray-700">Nome *</Label>
                                            <Input
                                                required
                                                placeholder="Seu nome completo"
                                                value={formData.name}
                                                onChange={(e) => setFormData(p => ({ ...p, name: e.target.value }))}
                                                className="h-11"
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <Label className="text-gray-700">Email *</Label>
                                            <Input
                                                required
                                                type="email"
                                                placeholder="seu@email.com"
                                                value={formData.email}
                                                onChange={(e) => setFormData(p => ({ ...p, email: e.target.value }))}
                                                className="h-11"
                                            />
                                        </div>
                                    </div>

                                    <div className="grid md:grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <Label className="text-gray-700">Telefone</Label>
                                            <Input
                                                placeholder="(11) 99999-9999"
                                                value={formData.phone}
                                                onChange={(e) => setFormData(p => ({ ...p, phone: e.target.value }))}
                                                className="h-11"
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <Label className="text-gray-700">Assunto *</Label>
                                            <Input
                                                required
                                                placeholder="Assunto da mensagem"
                                                value={formData.subject}
                                                onChange={(e) => setFormData(p => ({ ...p, subject: e.target.value }))}
                                                className="h-11"
                                            />
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <Label className="text-gray-700">Mensagem *</Label>
                                        <Textarea
                                            required
                                            rows={5}
                                            placeholder="Digite sua mensagem..."
                                            value={formData.message}
                                            onChange={(e) => setFormData(p => ({ ...p, message: e.target.value }))}
                                        />
                                    </div>

                                    <Button type="submit" className="bg-[#0052cc] hover:bg-[#003d99] h-11 px-8" disabled={loading}>
                                        {loading ? (
                                            <>
                                                <Loader2 className="h-4 w-4 animate-spin mr-2" />
                                                Enviando...
                                            </>
                                        ) : (
                                            <>
                                                <Send className="h-4 w-4 mr-2" />
                                                Enviar Mensagem
                                            </>
                                        )}
                                    </Button>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="bg-[#1a2332] text-white py-12">
                <div className="max-w-7xl mx-auto px-4">
                    <div className="grid md:grid-cols-4 gap-8 mb-8">
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
                            <p className="text-sm text-white/60">
                                Soluções logísticas inteligentes com tecnologia de rastreamento em tempo real.
                            </p>
                        </div>
                        <div>
                            <h4 className="font-semibold mb-4 text-sm">Institucional</h4>
                            <ul className="space-y-2.5 text-sm text-white/60">
                                <li><Link href="/sobre" className="hover:text-white transition-colors">A Empresa</Link></li>
                                <li><Link href="/contato" className="hover:text-white transition-colors">Contato</Link></li>
                                <li><Link href="/termos" className="hover:text-white transition-colors">Termos de Uso</Link></li>
                                <li><Link href="/privacidade" className="hover:text-white transition-colors">Privacidade</Link></li>
                            </ul>
                        </div>
                        <div>
                            <h4 className="font-semibold mb-4 text-sm">Serviços</h4>
                            <ul className="space-y-2.5 text-sm text-white/60">
                                <li>Transporte Rodoviário</li>
                                <li>Carga Fracionada</li>
                                <li>Logística Dedicada</li>
                            </ul>
                        </div>
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
                            </ul>
                        </div>
                    </div>
                    <div className="border-t border-white/10 pt-6 text-center text-sm text-white/40">
                        © {new Date().getFullYear()} Cargo Flash Transportes e Logística Ltda. Todos os direitos reservados.
                    </div>
                </div>
            </footer>
        </div>
    )
}
