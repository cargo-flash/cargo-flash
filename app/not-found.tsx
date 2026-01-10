import Link from 'next/link'
import { Package, Search, ArrowLeft } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { TrackingForm } from '@/components/tracking/tracking-form'

export default function NotFound() {
    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 flex items-center justify-center p-4">
            <div className="max-w-lg text-center">
                <div className="inline-flex items-center justify-center p-4 rounded-2xl bg-red-100 text-red-600 mb-6">
                    <Package className="h-12 w-12" />
                </div>

                <h1 className="text-4xl font-bold text-slate-900 mb-4">
                    Entrega não encontrada
                </h1>

                <p className="text-lg text-slate-600 mb-8">
                    O código de rastreamento informado não foi encontrado em nosso sistema.
                    Verifique se o código está correto e tente novamente.
                </p>

                <div className="bg-white p-4 rounded-xl shadow-lg border border-slate-100 mb-6">
                    <TrackingForm size="default" />
                </div>

                <Link href="/">
                    <Button variant="outline">
                        <ArrowLeft className="h-4 w-4 mr-2" />
                        Voltar ao Início
                    </Button>
                </Link>
            </div>
        </div>
    )
}
