'use client'

import {
    Clock,
    Calendar,
    Sun,
    Moon,
    AlertCircle,
    CheckCircle2
} from 'lucide-react'
import { useEffect, useState } from 'react'

interface DeliveryTimeSlotPickerProps {
    trackingCode: string
    onSelect?: (date: string, slot: string) => void
}

interface TimeSlot {
    id: string
    label: string
    time: string
    available: boolean
    icon: typeof Sun
}

export function DeliveryTimeSlotPicker({ trackingCode, onSelect }: DeliveryTimeSlotPickerProps) {
    const [mounted, setMounted] = useState(false)
    const [selectedDate, setSelectedDate] = useState<string>('')
    const [selectedSlot, setSelectedSlot] = useState<string>('')

    useEffect(() => {
        setMounted(true)
    }, [])

    // Generate next 5 days
    const dates = [...Array(5)].map((_, i) => {
        const date = new Date()
        date.setDate(date.getDate() + i + 1)
        return {
            date: date.toISOString().split('T')[0],
            day: date.toLocaleDateString('pt-BR', { weekday: 'short' }),
            number: date.getDate(),
            month: date.toLocaleDateString('pt-BR', { month: 'short' })
        }
    })

    const timeSlots: TimeSlot[] = [
        { id: 'morning', label: 'Manhã', time: '08:00 - 12:00', available: true, icon: Sun },
        { id: 'afternoon', label: 'Tarde', time: '12:00 - 18:00', available: true, icon: Sun },
        { id: 'evening', label: 'Noite', time: '18:00 - 21:00', available: Math.random() > 0.3, icon: Moon }
    ]

    const handleConfirm = () => {
        if (selectedDate && selectedSlot) {
            onSelect?.(selectedDate, selectedSlot)
        }
    }

    return (
        <div className={`relative overflow-hidden rounded-3xl bg-white shadow-xl shadow-slate-200/50 border border-slate-100 ${mounted ? 'animate-in fade-in slide-in-from-bottom-4 duration-700' : 'opacity-0'
            }`}>
            {/* Header */}
            <div className="relative bg-gradient-to-r from-teal-500 to-cyan-600 p-6">
                <div className="absolute inset-0 opacity-20">
                    <div className="absolute inset-0" style={{
                        backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)',
                        backgroundSize: '16px 16px'
                    }} />
                </div>
                <div className="relative flex items-center gap-4">
                    <div className="w-14 h-14 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center">
                        <Calendar className="w-7 h-7 text-white" />
                    </div>
                    <div>
                        <h3 className="text-xl font-bold text-white">Agendar Entrega</h3>
                        <p className="text-teal-100">Escolha o melhor horário</p>
                    </div>
                </div>
            </div>

            {/* Date Selection */}
            <div className="p-6 border-b border-slate-100">
                <p className="text-sm text-slate-500 mb-4">Selecione a data:</p>
                <div className="flex gap-2 overflow-x-auto pb-2">
                    {dates.map((date) => (
                        <button
                            key={date.date}
                            onClick={() => setSelectedDate(date.date)}
                            className={`
                                flex-shrink-0 w-20 p-4 rounded-2xl text-center transition-all
                                ${selectedDate === date.date
                                    ? 'bg-teal-600 text-white shadow-lg shadow-teal-500/30 scale-105'
                                    : 'bg-slate-50 hover:bg-teal-50 text-slate-600'
                                }
                            `}
                        >
                            <p className="text-xs uppercase opacity-70">{date.day}</p>
                            <p className="text-2xl font-bold my-1">{date.number}</p>
                            <p className="text-xs capitalize">{date.month}</p>
                        </button>
                    ))}
                </div>
            </div>

            {/* Time Slot Selection */}
            <div className="p-6">
                <p className="text-sm text-slate-500 mb-4">Selecione o horário:</p>
                <div className="grid grid-cols-3 gap-3">
                    {timeSlots.map((slot) => {
                        const Icon = slot.icon
                        const isSelected = selectedSlot === slot.id
                        const isDisabled = !slot.available

                        return (
                            <button
                                key={slot.id}
                                onClick={() => !isDisabled && setSelectedSlot(slot.id)}
                                disabled={isDisabled}
                                className={`
                                    relative p-4 rounded-2xl text-center transition-all
                                    ${isDisabled
                                        ? 'bg-slate-100 opacity-50 cursor-not-allowed'
                                        : isSelected
                                            ? 'bg-teal-600 text-white shadow-lg shadow-teal-500/30'
                                            : 'bg-slate-50 hover:bg-teal-50 text-slate-600'
                                    }
                                `}
                            >
                                <Icon className={`w-5 h-5 mx-auto mb-2 ${isSelected ? 'text-white' : 'text-teal-500'}`} />
                                <p className="font-bold text-sm">{slot.label}</p>
                                <p className={`text-xs mt-1 ${isSelected ? 'text-teal-100' : 'text-slate-400'}`}>
                                    {slot.time}
                                </p>
                                {isDisabled && (
                                    <span className="absolute top-2 right-2 text-xs text-red-500">
                                        Indisponível
                                    </span>
                                )}
                            </button>
                        )
                    })}
                </div>

                {/* Confirmation */}
                <div className="mt-6">
                    <button
                        onClick={handleConfirm}
                        disabled={!selectedDate || !selectedSlot}
                        className={`
                            w-full py-4 rounded-2xl font-bold transition-all flex items-center justify-center gap-2
                            ${selectedDate && selectedSlot
                                ? 'bg-gradient-to-r from-teal-500 to-cyan-600 text-white hover:shadow-lg'
                                : 'bg-slate-100 text-slate-400 cursor-not-allowed'
                            }
                        `}
                    >
                        <CheckCircle2 className="w-5 h-5" />
                        Confirmar Agendamento
                    </button>
                </div>

                {/* Info */}
                <div className="mt-4 flex items-start gap-2 text-xs text-slate-400">
                    <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
                    <span>Você receberá uma confirmação por e-mail com os detalhes do agendamento.</span>
                </div>
            </div>
        </div>
    )
}
