import Link from 'next/link'
import {
    Truck,
    Phone,
    Mail,
    Clock,
    MapPin,
    ShieldCheck
} from 'lucide-react'

export const metadata = {
    title: 'Política de Privacidade',
    description: 'Política de Privacidade da Cargo Flash Transportes e Logística. Como coletamos, usamos e protegemos seus dados.',
}

export default function PrivacidadePage() {
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
                        <ShieldCheck className="h-8 w-8 text-white/80" />
                        <h1 className="text-3xl md:text-4xl font-bold">
                            Política de Privacidade
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
                            <h2>1. Introdução</h2>
                            <p>
                                A Cargo Flash Transportes e Logística Ltda. (&quot;Cargo Flash&quot;, &quot;nós&quot;, &quot;nosso&quot;)
                                está comprometida em proteger a privacidade dos usuários de nossos serviços.
                                Esta Política de Privacidade explica como coletamos, usamos, armazenamos e
                                protegemos suas informações pessoais em conformidade com a Lei Geral de
                                Proteção de Dados (LGPD - Lei nº 13.709/2018).
                            </p>

                            <h2>2. Dados que Coletamos</h2>
                            <h3>2.1 Dados fornecidos por você</h3>
                            <ul>
                                <li>Nome completo ou razão social</li>
                                <li>Endereço de email</li>
                                <li>Número de telefone</li>
                                <li>Endereço físico (origem e destino de entregas)</li>
                                <li>CPF</li>
                                <li>Informações sobre mercadorias transportadas</li>
                            </ul>

                            <h3>2.2 Dados coletados automaticamente</h3>
                            <ul>
                                <li>Endereço IP</li>
                                <li>Tipo de navegador e dispositivo</li>
                                <li>Páginas visitadas e tempo de permanência</li>
                                <li>Dados de geolocalização (para rastreamento de entregas)</li>
                            </ul>

                            <h2>3. Como Usamos Seus Dados</h2>
                            <p>
                                Utilizamos seus dados pessoais para:
                            </p>
                            <ul>
                                <li>Processar e gerenciar serviços de transporte</li>
                                <li>Fornecer rastreamento em tempo real das entregas</li>
                                <li>Enviar notificações sobre status de entregas</li>
                                <li>Entrar em contato para suporte ao cliente</li>
                                <li>Emitir documentos fiscais obrigatórios</li>
                                <li>Cumprir obrigações legais e regulatórias</li>
                                <li>Melhorar nossos serviços e experiência do usuário</li>
                            </ul>

                            <h2>4. Base Legal para Tratamento</h2>
                            <p>
                                O tratamento de seus dados pessoais é realizado com base em:
                            </p>
                            <ul>
                                <li><strong>Execução de contrato:</strong> Para prestação dos serviços de transporte</li>
                                <li><strong>Obrigação legal:</strong> Para cumprimento de exigências fiscais e regulatórias</li>
                                <li><strong>Legítimo interesse:</strong> Para melhoria contínua de nossos serviços</li>
                                <li><strong>Consentimento:</strong> Para envio de comunicações de marketing (quando aplicável)</li>
                            </ul>

                            <h2>5. Compartilhamento de Dados</h2>
                            <p>
                                Podemos compartilhar seus dados com:
                            </p>
                            <ul>
                                <li>Parceiros de transporte para conclusão da entrega</li>
                                <li>Órgãos governamentais quando exigido por lei</li>
                                <li>Seguradoras em caso de sinistros</li>
                                <li>Prestadores de serviços de tecnologia (hospedagem, analytics)</li>
                            </ul>
                            <p>
                                Todos os terceiros são contratualmente obrigados a proteger seus dados
                                com o mesmo nível de segurança que aplicamos.
                            </p>

                            <h2>6. Segurança dos Dados</h2>
                            <p>
                                Implementamos medidas técnicas e organizacionais para proteger seus dados:
                            </p>
                            <ul>
                                <li>Criptografia de dados em trânsito (HTTPS/TLS)</li>
                                <li>Criptografia de dados em repouso</li>
                                <li>Controle de acesso baseado em funções</li>
                                <li>Monitoramento contínuo de segurança</li>
                                <li>Backups regulares e plano de recuperação</li>
                            </ul>

                            <h2>7. Retenção de Dados</h2>
                            <p>
                                Mantemos seus dados pessoais pelo período necessário para:
                            </p>
                            <ul>
                                <li>Prestação dos serviços contratados</li>
                                <li>Cumprimento de obrigações legais (ex: documentos fiscais - 5 anos)</li>
                                <li>Defesa de direitos em processos judiciais</li>
                            </ul>
                            <p>
                                Após esses períodos, os dados são eliminados de forma segura.
                            </p>

                            <h2>8. Seus Direitos</h2>
                            <p>
                                Conforme a LGPD, você tem direito a:
                            </p>
                            <ul>
                                <li><strong>Acesso:</strong> Solicitar cópia dos seus dados pessoais</li>
                                <li><strong>Correção:</strong> Solicitar correção de dados incompletos ou incorretos</li>
                                <li><strong>Exclusão:</strong> Solicitar eliminação de dados desnecessários</li>
                                <li><strong>Portabilidade:</strong> Solicitar transferência de dados para outro fornecedor</li>
                                <li><strong>Revogação:</strong> Revogar consentimento a qualquer momento</li>
                                <li><strong>Informação:</strong> Saber com quem seus dados são compartilhados</li>
                            </ul>

                            <h2>9. Cookies</h2>
                            <p>
                                Utilizamos cookies para melhorar sua experiência em nosso site.
                                Você pode configurar seu navegador para recusar cookies,
                                embora isso possa afetar algumas funcionalidades.
                            </p>

                            <h2>10. Alterações nesta Política</h2>
                            <p>
                                Podemos atualizar esta Política de Privacidade periodicamente.
                                Alterações significativas serão comunicadas por email ou aviso em nosso site.
                                A data da última atualização está indicada no topo desta página.
                            </p>

                            <h2>11. Contato do Encarregado (DPO)</h2>
                            <p>
                                Para exercer seus direitos ou esclarecer dúvidas sobre privacidade:
                            </p>
                            <ul>
                                <li>Email: privacidade@cargoflash.com.br</li>
                                <li>Telefone: (11) 3000-0000</li>
                            </ul>

                            <h2>12. Autoridade Nacional de Proteção de Dados</h2>
                            <p>
                                Caso considere que o tratamento de seus dados viola a legislação,
                                você pode apresentar reclamação à Autoridade Nacional de Proteção de
                                Dados (ANPD) através do site{' '}
                                <a
                                    href="https://www.gov.br/anpd"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-[#0052cc] hover:underline"
                                >
                                    www.gov.br/anpd
                                </a>.
                            </p>
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
