import type { Metadata } from 'next'
import { Inter, JetBrains_Mono } from 'next/font/google'
import { Toaster } from 'sonner'
import './globals.css'

const inter = Inter({
    subsets: ['latin'],
    variable: '--font-inter',
    display: 'swap',
})

const jetbrainsMono = JetBrains_Mono({
    subsets: ['latin'],
    variable: '--font-jetbrains-mono',
    display: 'swap',
})

export const metadata: Metadata = {
    title: {
        default: 'Cargo Flash - Rastreamento de Entregas',
        template: '%s | Cargo Flash',
    },
    description: 'Rastreie suas entregas em tempo real com o Cargo Flash. Sistema de rastreamento premium para transportadoras.',
    keywords: ['rastreamento', 'entregas', 'transporte', 'logística', 'tracking'],
    authors: [{ name: 'Cargo Flash' }],
    creator: 'Cargo Flash',
    openGraph: {
        type: 'website',
        locale: 'pt_BR',
        siteName: 'Cargo Flash',
        title: 'Cargo Flash - Rastreamento de Entregas',
        description: 'Rastreie suas entregas em tempo real com o Cargo Flash.',
    },
    robots: {
        index: true,
        follow: true,
    },
}

export default function RootLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <html lang="pt-BR" className={`${inter.variable} ${jetbrainsMono.variable}`}>
            <body className="min-h-screen font-sans antialiased">
                {children}
                <Toaster
                    richColors
                    position="top-right"
                    toastOptions={{
                        duration: 4000,
                    }}
                />
            </body>
        </html>
    )
}
