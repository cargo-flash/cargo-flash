import Link from 'next/link'
import {
    Truck,
    Phone,
    Mail,
    Clock,
    MapPin,
    FileText
} from 'lucide-react'

export const metadata = {
    title: 'Termos de Uso',
    description: 'Termos de Uso da Cargo Flash Transportes e Logística. Condições gerais de utilização dos serviços.',
}

export default function TermosPage() {
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
                            <Link href="/contato" className="text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors">Contato</Link>
                        </nav>
                    </div>
                </div>
            </header>

            {/* Hero Section */}
            <section className="bg-[#1a2332] text-white py-12">
                <div className="max-w-7xl mx-auto px-4">
                    <div className="flex items-center gap-3 mb-4">
                        <FileText className="h-8 w-8 text-white/80" />
                        <h1 className="text-3xl md:text-4xl font-bold">
                            Termos de Uso
                        </h1>
                    </div>
                    <p className="text-white/70">
                        Última atualização: Janeiro de 2026
                    </p>
                </div>
            </section>

            {/* Content */}
            <section className="flex-grow py-12 bg-gray-50">
                <div className="max-w-4xl mx-auto px-4">
                    <div className="bg-white rounded-xl border border-gray-200 p-8">
                        <div className="prose prose-gray max-w-none">
                            <h2>1. Aceitação dos Termos</h2>
                            <p>
                                Ao acessar ou utilizar os serviços da Cargo Flash Transportes e Logística Ltda.
                                (&quot;Cargo Flash&quot;), você concorda em estar vinculado a estes Termos de Uso.
                                Se você não concordar com qualquer parte destes termos, não poderá utilizar nossos serviços.
                            </p>

                            <h2>2. Descrição dos Serviços</h2>
                            <p>
                                A Cargo Flash oferece serviços de transporte rodoviário de cargas, rastreamento em tempo real,
                                logística dedicada e carga fracionada. Nossos serviços incluem:
                            </p>
                            <ul>
                                <li>Coleta e entrega de mercadorias em território nacional</li>
                                <li>Sistema de rastreamento online via código de rastreamento</li>
                                <li>Seguro de carga conforme condições contratadas</li>
                                <li>Notificações por email sobre status das entregas</li>
                            </ul>

                            <h2>3. Uso do Sistema de Rastreamento</h2>
                            <p>
                                O sistema de rastreamento é fornecido exclusivamente para consulta de encomendas
                                transportadas pela Cargo Flash. O usuário se compromete a:
                            </p>
                            <ul>
                                <li>Utilizar o sistema apenas para fins legítimos de consulta</li>
                                <li>Não tentar acessar informações de terceiros sem autorização</li>
                                <li>Não utilizar sistemas automatizados para consultas em massa</li>
                                <li>Não tentar interferir ou comprometer a segurança do sistema</li>
                            </ul>

                            <h2>4. Responsabilidades</h2>
                            <h3>4.1 Da Cargo Flash</h3>
                            <p>
                                A Cargo Flash se compromete a transportar as mercadorias com segurança e
                                dentro dos prazos estimados, ressalvadas as situações de força maior,
                                caso fortuito ou outras circunstâncias alheias à nossa vontade.
                            </p>

                            <h3>4.2 Do Cliente</h3>
                            <p>
                                O cliente é responsável por fornecer informações corretas sobre a carga,
                                endereços de origem e destino, e garantir que a mercadoria esteja
                                adequadamente embalada para o transporte.
                            </p>

                            <h2>5. Limitação de Responsabilidade</h2>
                            <p>
                                A Cargo Flash não se responsabiliza por atrasos decorrentes de:
                            </p>
                            <ul>
                                <li>Condições climáticas adversas</li>
                                <li>Bloqueios de estradas ou paralisações</li>
                                <li>Greves ou manifestações</li>
                                <li>Problemas com documentação fiscal</li>
                                <li>Endereço incorreto ou incompleto fornecido pelo remetente</li>
                            </ul>

                            <h2>6. Seguro de Carga</h2>
                            <p>
                                Todas as cargas transportadas pela Cargo Flash possuem seguro básico conforme
                                legislação vigente. Seguros adicionais podem ser contratados mediante solicitação
                                e pagamento do valor correspondente.
                            </p>

                            <h2>7. Privacidade</h2>
                            <p>
                                O tratamento de dados pessoais é regido por nossa{' '}
                                <Link href="/privacidade" className="text-[#0052cc] hover:underline">
                                    Política de Privacidade
                                </Link>
                                , que faz parte integrante destes Termos de Uso.
                            </p>

                            <h2>8. Modificações</h2>
                            <p>
                                A Cargo Flash reserva-se o direito de modificar estes Termos de Uso a qualquer momento,
                                mediante publicação da versão atualizada em nosso site. O uso continuado dos serviços
                                após tais modificações constitui aceitação dos novos termos.
                            </p>

                            <h2>9. Foro</h2>
                            <p>
                                Fica eleito o foro da Comarca de São Paulo, Estado de São Paulo, para dirimir
                                quaisquer questões oriundas destes Termos de Uso, com renúncia expressa a
                                qualquer outro, por mais privilegiado que seja.
                            </p>

                            <h2>10. Contato</h2>
                            <p>
                                Em caso de dúvidas sobre estes Termos de Uso, entre em contato:
                            </p>
                            <ul>
                                <li>Email: contato@cargoflash.com.br</li>
                                <li>Telefone: (11) 3000-0000</li>
                                <li>Endereço: Av. Eng. Luís Carlos Berrini, 1500 - Brooklin, São Paulo - SP</li>
                            </ul>
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
