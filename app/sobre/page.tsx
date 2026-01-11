import Link from 'next/link'
import {
    Truck,
    Shield,
    Globe,
    Clock,
    Users,
    Award,
    Building2,
    Phone,
    Mail,
    MapPin,
    CheckCircle2,
    Target,
    Heart
} from 'lucide-react'
import { Button } from '@/components/ui/button'

export const metadata = {
    title: 'A Empresa',
    description: 'Conheça a Cargo Flash Transportes e Logística. Desde 2015 conectando pessoas e empresas com soluções logísticas inteligentes.',
}

export default function SobrePage() {
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
                            <Link href="/sobre" className="text-sm font-semibold text-[#0052cc]">A Empresa</Link>
                            <Link href="/contato" className="text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors">Contato</Link>
                        </nav>


                    </div>
                </div>
            </header>

            {/* Hero Section */}
            <section className="bg-[#1a2332] text-white py-20">
                <div className="max-w-7xl mx-auto px-4 text-center">
                    <div className="inline-flex items-center gap-2 bg-white/10 text-white/90 text-sm font-medium px-4 py-2 rounded-full mb-6">
                        <Building2 className="h-4 w-4" />
                        Desde 2015 no mercado
                    </div>
                    <h1 className="text-4xl md:text-5xl font-bold mb-6">
                        Sobre a Cargo Flash
                    </h1>
                    <p className="text-xl text-white/70 max-w-2xl mx-auto">
                        Conectando pessoas e empresas através de soluções logísticas inteligentes e tecnologia de rastreamento avançada
                    </p>
                </div>
            </section>

            {/* Stats */}
            <section className="py-12 bg-gray-50 border-b border-gray-200">
                <div className="max-w-7xl mx-auto px-4">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                        {[
                            { value: '10+', label: 'Anos de Experiência', icon: Clock },
                            { value: '50K+', label: 'Entregas Realizadas', icon: Truck },
                            { value: '27', label: 'Estados Atendidos', icon: Globe },
                            { value: '99.9%', label: 'Taxa de Sucesso', icon: Award },
                        ].map((stat, i) => (
                            <div key={i} className="text-center">
                                <stat.icon className="h-8 w-8 text-[#0052cc] mx-auto mb-3" />
                                <div className="text-3xl font-bold text-gray-900">{stat.value}</div>
                                <div className="text-sm text-gray-600">{stat.label}</div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Mission & Vision */}
            <section className="py-16">
                <div className="max-w-7xl mx-auto px-4">
                    <div className="grid md:grid-cols-2 gap-12">
                        <div>
                            <div className="flex items-center gap-3 mb-4">
                                <div className="w-12 h-12 bg-[#0052cc]/10 rounded-lg flex items-center justify-center">
                                    <Target className="h-6 w-6 text-[#0052cc]" />
                                </div>
                                <h2 className="text-2xl font-bold text-gray-900">Nossa Missão</h2>
                            </div>
                            <p className="text-gray-600 leading-relaxed">
                                Oferecer soluções logísticas eficientes e transparentes, conectando pessoas e empresas
                                em todo o Brasil. Acreditamos que cada entrega carrega uma história, uma expectativa,
                                um momento importante para nossos clientes.
                            </p>
                        </div>
                        <div>
                            <div className="flex items-center gap-3 mb-4">
                                <div className="w-12 h-12 bg-[#0052cc]/10 rounded-lg flex items-center justify-center">
                                    <Heart className="h-6 w-6 text-[#0052cc]" />
                                </div>
                                <h2 className="text-2xl font-bold text-gray-900">Nossos Valores</h2>
                            </div>
                            <p className="text-gray-600 leading-relaxed">
                                Transparência, pontualidade e compromisso com a excelência são os pilares que guiam
                                nossas operações. Investimos continuamente em tecnologia e treinamento para garantir
                                que suas entregas cheguem com segurança e cuidado.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Differentials */}
            <section className="py-16 bg-gray-50">
                <div className="max-w-7xl mx-auto px-4">
                    <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">
                        Por que escolher a Cargo Flash?
                    </h2>
                    <div className="grid md:grid-cols-3 gap-8">
                        {[
                            {
                                icon: Shield,
                                title: 'Carga 100% Segurada',
                                description: 'Todas as cargas são protegidas contra avarias, extravios e roubos durante todo o trajeto.',
                            },
                            {
                                icon: Globe,
                                title: 'Cobertura Nacional',
                                description: 'Entregamos em todos os 27 estados brasileiros com rotas otimizadas e prazos competitivos.',
                            },
                            {
                                icon: Users,
                                title: 'Equipe Especializada',
                                description: 'Profissionais treinados e comprometidos com a excelência em cada etapa da operação.',
                            },
                        ].map((item, i) => (
                            <div key={i} className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-lg transition-shadow">
                                <div className="w-14 h-14 bg-[#0052cc]/10 rounded-xl flex items-center justify-center mb-4">
                                    <item.icon className="h-7 w-7 text-[#0052cc]" />
                                </div>
                                <h3 className="text-xl font-bold text-gray-900 mb-2">{item.title}</h3>
                                <p className="text-gray-600">{item.description}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Certifications */}
            <section className="py-12 border-t border-gray-200">
                <div className="max-w-7xl mx-auto px-4">
                    <div className="text-center mb-8">
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">Certificações e Registros</h3>
                        <p className="text-sm text-gray-600">Empresa regulamentada e certificada para operações de transporte</p>
                    </div>
                    <div className="flex flex-wrap items-center justify-center gap-8">
                        {[
                            { label: 'ISO 9001:2015', desc: 'Qualidade' },
                            { label: 'ANTT Regular', desc: 'Transporte' },
                            { label: 'SASSMAQ', desc: 'Segurança' },
                        ].map((cert, i) => (
                            <div key={i} className="flex items-center gap-2 px-4 py-2 bg-gray-50 rounded-lg border border-gray-200">
                                <CheckCircle2 className="h-5 w-5 text-green-600" />
                                <div>
                                    <div className="font-semibold text-gray-900 text-sm">{cert.label}</div>
                                    <div className="text-xs text-gray-500">{cert.desc}</div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA */}
            <section className="py-16 bg-[#0052cc]">
                <div className="max-w-4xl mx-auto px-4 text-center">
                    <h2 className="text-3xl font-bold text-white mb-4">
                        Pronto para começar?
                    </h2>
                    <p className="text-lg text-white/80 mb-8">
                        Entre em contato e descubra como podemos ajudar sua empresa
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <Link href="/contato">
                            <Button size="lg" className="bg-white text-[#0052cc] hover:bg-gray-100 h-12 px-8">
                                Fale Conosco
                            </Button>
                        </Link>
                        <Link href="/">
                            <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10 h-12 px-8">
                                Rastrear Entrega
                            </Button>
                        </Link>
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
                                <li className="flex items-start gap-2">
                                    <MapPin className="h-4 w-4 mt-0.5" />
                                    <span>
                                        Av. Eng. Luís Carlos Berrini, 1500<br />
                                        Brooklin, São Paulo - SP
                                    </span>
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
