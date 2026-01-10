'use client'

import {
    Bell,
    Mail,
    MessageSquare,
    Smartphone,
    Check
} from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { useState } from 'react'

interface NotificationPreferencesProps {
    trackingCode: string
    email?: string | null
    phone?: string | null
}

// Custom Toggle Component
function Toggle({ checked, onChange }: { checked: boolean; onChange: (checked: boolean) => void }) {
    return (
        <button
            type="button"
            role="switch"
            aria-checked={checked}
            onClick={() => onChange(!checked)}
            className={`
                relative inline-flex h-6 w-11 shrink-0 cursor-pointer items-center rounded-full 
                border-2 border-transparent transition-colors duration-200 ease-in-out
                focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2
                ${checked ? 'bg-blue-600' : 'bg-slate-200'}
            `}
        >
            <span
                className={`
                    pointer-events-none inline-block h-5 w-5 rounded-full bg-white shadow-lg 
                    ring-0 transition-transform duration-200 ease-in-out
                    ${checked ? 'translate-x-5' : 'translate-x-0'}
                `}
            />
        </button>
    )
}

export function NotificationPreferences({ trackingCode, email, phone }: NotificationPreferencesProps) {
    const [emailEnabled, setEmailEnabled] = useState(true)
    const [smsEnabled, setSmsEnabled] = useState(false)
    const [whatsappEnabled, setWhatsappEnabled] = useState(true)
    const [saved, setSaved] = useState(false)

    const handleSave = () => {
        setSaved(true)
        setTimeout(() => setSaved(false), 2000)
    }

    return (
        <Card className="border border-slate-200/80 shadow-lg shadow-slate-200/40 bg-white">
            <CardHeader className="pb-3 border-b border-slate-100">
                <CardTitle className="text-base flex items-center gap-2 text-slate-800">
                    <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-amber-500 to-orange-500 flex items-center justify-center">
                        <Bell className="w-4 h-4 text-white" />
                    </div>
                    Notificações
                    {saved && (
                        <span className="ml-auto flex items-center gap-1 text-xs text-emerald-600 bg-emerald-50 px-2 py-1 rounded-full">
                            <Check className="w-3 h-3" />
                            Salvo
                        </span>
                    )}
                </CardTitle>
            </CardHeader>
            <CardContent className="pt-4 space-y-4">
                <p className="text-sm text-slate-500">
                    Receba atualizações sobre sua entrega nos canais de sua preferência.
                </p>

                {/* Notification Options */}
                <div className="space-y-3">
                    {/* Email */}
                    <div className="flex items-center justify-between p-3 bg-slate-50 rounded-xl">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-lg bg-white shadow-sm flex items-center justify-center">
                                <Mail className="w-5 h-5 text-blue-500" />
                            </div>
                            <div>
                                <p className="font-medium text-slate-700">E-mail</p>
                                {email && (
                                    <p className="text-xs text-slate-400">{email}</p>
                                )}
                            </div>
                        </div>
                        <Toggle
                            checked={emailEnabled}
                            onChange={(checked) => {
                                setEmailEnabled(checked)
                                handleSave()
                            }}
                        />
                    </div>

                    {/* SMS */}
                    <div className="flex items-center justify-between p-3 bg-slate-50 rounded-xl">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-lg bg-white shadow-sm flex items-center justify-center">
                                <Smartphone className="w-5 h-5 text-slate-500" />
                            </div>
                            <div>
                                <p className="font-medium text-slate-700">SMS</p>
                                {phone && (
                                    <p className="text-xs text-slate-400">{phone}</p>
                                )}
                            </div>
                        </div>
                        <Toggle
                            checked={smsEnabled}
                            onChange={(checked) => {
                                setSmsEnabled(checked)
                                handleSave()
                            }}
                        />
                    </div>

                    {/* WhatsApp */}
                    <div className="flex items-center justify-between p-3 bg-slate-50 rounded-xl">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-lg bg-white shadow-sm flex items-center justify-center">
                                <MessageSquare className="w-5 h-5 text-green-500" />
                            </div>
                            <div>
                                <p className="font-medium text-slate-700">WhatsApp</p>
                                {phone && (
                                    <p className="text-xs text-slate-400">{phone}</p>
                                )}
                            </div>
                        </div>
                        <Toggle
                            checked={whatsappEnabled}
                            onChange={(checked) => {
                                setWhatsappEnabled(checked)
                                handleSave()
                            }}
                        />
                    </div>
                </div>

                {/* Info */}
                <div className="bg-blue-50 border border-blue-100 rounded-lg p-3">
                    <p className="text-xs text-blue-700">
                        <strong>Eventos notificados:</strong> Coleta, em trânsito, saiu para entrega, entregue,
                        tentativa de entrega e atrasos.
                    </p>
                </div>

                {/* Tracking Code Reference */}
                <div className="text-center pt-2">
                    <p className="text-[10px] text-slate-400">
                        Configurações vinculadas ao código <span className="font-mono">{trackingCode.toUpperCase()}</span>
                    </p>
                </div>
            </CardContent>
        </Card>
    )
}
