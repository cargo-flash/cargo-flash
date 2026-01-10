'use client'

import {
    Calendar,
    MapPin,
    Phone,
    Home,
    Building2,
    Clock,
    Check,
    X
} from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { useState } from 'react'

interface RescheduleCardProps {
    trackingCode: string
    status: string
    currentAddress?: string
}

const timeSlots = [
    { id: 'morning', label: 'Manhã', time: '08:00 - 12:00', icon: '🌅' },
    { id: 'afternoon', label: 'Tarde', time: '12:00 - 18:00', icon: '☀️' },
    { id: 'evening', label: 'Noite', time: '18:00 - 21:00', icon: '🌆' },
]

export function RescheduleCard({ trackingCode, status, currentAddress }: RescheduleCardProps) {
    const [selectedDate, setSelectedDate] = useState<string | null>(null)
    const [selectedSlot, setSelectedSlot] = useState<string | null>(null)
    const [alternateAddress, setAlternateAddress] = useState(false)
    const [submitted, setSubmitted] = useState(false)

    // Only show for failed deliveries
    if (status !== 'failed') {
        return null
    }

    // Generate next 5 business days
    const getNextBusinessDays = () => {
        const days: { date: Date; label: string; value: string }[] = []
        const current = new Date()
        current.setDate(current.getDate() + 1) // Start from tomorrow

        while (days.length < 5) {
            const dayOfWeek = current.getDay()
            if (dayOfWeek !== 0 && dayOfWeek !== 6) { // Skip weekends
                days.push({
                    date: new Date(current),
                    label: current.toLocaleDateString('pt-BR', { weekday: 'short', day: 'numeric' }),
                    value: current.toISOString().split('T')[0]
                })
            }
            current.setDate(current.getDate() + 1)
        }
        return days
    }

    const businessDays = getNextBusinessDays()

    const handleSubmit = () => {
        if (selectedDate && selectedSlot) {
            setSubmitted(true)
        }
    }

    if (submitted) {
        return (
            <Card className="border border-emerald-200 shadow-lg bg-gradient-to-br from-emerald-50 to-teal-50">
                <CardContent className="py-8 text-center">
                    <div className="w-16 h-16 mx-auto rounded-full bg-emerald-100 flex items-center justify-center mb-4">
                        <Check className="w-8 h-8 text-emerald-600" />
                    </div>
                    <h3 className="text-lg font-semibold text-emerald-800 mb-2">
                        Reagendamento Solicitado!
                    </h3>
                    <p className="text-sm text-emerald-600 mb-4">
                        Nova tentativa programada. Você receberá uma confirmação por e-mail.
                    </p>
                    <div className="inline-flex items-center gap-2 px-4 py-2 bg-white rounded-lg shadow-sm text-sm">
                        <Calendar className="w-4 h-4 text-emerald-600" />
                        <span className="font-medium text-emerald-700">
                            {new Date(selectedDate!).toLocaleDateString('pt-BR', {
                                weekday: 'long',
                                day: 'numeric',
                                month: 'long'
                            })}
                        </span>
                    </div>
                </CardContent>
            </Card>
        )
    }

    return (
        <Card className="border border-amber-200 shadow-lg bg-gradient-to-br from-amber-50 to-orange-50">
            <CardHeader className="pb-3 border-b border-amber-200">
                <CardTitle className="text-base flex items-center gap-2 text-slate-800">
                    <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-amber-500 to-orange-500 flex items-center justify-center">
                        <Calendar className="w-4 h-4 text-white" />
                    </div>
                    Reagendar Entrega
                </CardTitle>
            </CardHeader>
            <CardContent className="pt-4 space-y-4">
                <p className="text-sm text-amber-700">
                    Não estava disponível? Escolha uma nova data e horário:
                </p>

                {/* Date Selection */}
                <div>
                    <p className="text-xs text-slate-500 uppercase tracking-wider font-medium mb-2">
                        Escolha a data
                    </p>
                    <div className="flex gap-2 overflow-x-auto pb-2">
                        {businessDays.map((day) => (
                            <button
                                key={day.value}
                                onClick={() => setSelectedDate(day.value)}
                                className={`flex-shrink-0 px-4 py-3 rounded-xl border-2 text-center transition-all ${selectedDate === day.value
                                    ? 'border-amber-500 bg-amber-100 text-amber-800'
                                    : 'border-slate-200 bg-white hover:border-amber-300'
                                    }`}
                            >
                                <p className="text-xs text-slate-500 capitalize">{day.label.split(' ')[0]}</p>
                                <p className="text-lg font-bold">{day.label.split(' ')[1]}</p>
                            </button>
                        ))}
                    </div>
                </div>

                {/* Time Slot Selection */}
                <div>
                    <p className="text-xs text-slate-500 uppercase tracking-wider font-medium mb-2">
                        Escolha o horário
                    </p>
                    <div className="grid grid-cols-3 gap-2">
                        {timeSlots.map((slot) => (
                            <button
                                key={slot.id}
                                onClick={() => setSelectedSlot(slot.id)}
                                className={`p-3 rounded-xl border-2 text-center transition-all ${selectedSlot === slot.id
                                    ? 'border-amber-500 bg-amber-100'
                                    : 'border-slate-200 bg-white hover:border-amber-300'
                                    }`}
                            >
                                <span className="text-xl">{slot.icon}</span>
                                <p className="text-xs font-medium text-slate-700 mt-1">{slot.label}</p>
                                <p className="text-[10px] text-slate-500">{slot.time}</p>
                            </button>
                        ))}
                    </div>
                </div>

                {/* Alternate Address Option */}
                <div className="bg-white rounded-xl p-4 border border-amber-100">
                    <label className="flex items-start gap-3 cursor-pointer">
                        <input
                            type="checkbox"
                            checked={alternateAddress}
                            onChange={(e) => setAlternateAddress(e.target.checked)}
                            className="mt-1 w-4 h-4 rounded border-slate-300 text-amber-600 focus:ring-amber-500"
                        />
                        <div>
                            <p className="text-sm font-medium text-slate-700">Entregar em outro endereço</p>
                            <p className="text-xs text-slate-500">Deixar com vizinho ou portaria</p>
                        </div>
                    </label>
                </div>

                {/* Submit Button */}
                <Button
                    onClick={handleSubmit}
                    disabled={!selectedDate || !selectedSlot}
                    className="w-full bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 disabled:opacity-50"
                >
                    <Calendar className="w-4 h-4 mr-2" />
                    Confirmar Reagendamento
                </Button>

                {/* Current Address */}
                {currentAddress && (
                    <div className="flex items-start gap-2 pt-2 text-xs text-slate-500">
                        <MapPin className="w-4 h-4 flex-shrink-0" />
                        <span>Endereço atual: {currentAddress}</span>
                    </div>
                )}
            </CardContent>
        </Card>
    )
}
