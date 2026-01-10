'use client'

import {
    Check,
    Package,
    Truck,
    MapPin,
    Home,
    Circle
} from 'lucide-react'

interface PremiumProgressStepsProps {
    status: string
}

const steps = [
    { id: 'pending', label: 'Postado', icon: Package },
    { id: 'collected', label: 'Coletado', icon: Package },
    { id: 'in_transit', label: 'Em Trânsito', icon: Truck },
    { id: 'out_for_delivery', label: 'Saiu para Entrega', icon: MapPin },
    { id: 'delivered', label: 'Entregue', icon: Home }
]

const statusOrder = ['pending', 'collected', 'in_transit', 'out_for_delivery', 'delivered']

export function PremiumProgressSteps({ status }: PremiumProgressStepsProps) {
    const currentIndex = statusOrder.indexOf(status)

    const getStepStatus = (stepIndex: number) => {
        if (stepIndex < currentIndex) return 'completed'
        if (stepIndex === currentIndex) return 'current'
        return 'pending'
    }

    return (
        <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
            {/* Header */}
            <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
                <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wide">
                    Acompanhamento
                </h3>
                <span className="text-xs text-slate-500 bg-slate-100 px-3 py-1 rounded-full font-medium">
                    Etapa {currentIndex + 1} de {steps.length}
                </span>
            </div>

            {/* Steps */}
            <div className="p-4 sm:p-6">
                <div className="relative overflow-x-auto">
                    {/* Background Line */}
                    <div className="absolute top-4 sm:top-5 left-4 sm:left-5 right-4 sm:right-5 h-0.5 bg-slate-200" />

                    {/* Active Line */}
                    <div
                        className="absolute top-4 sm:top-5 left-4 sm:left-5 h-0.5 bg-[#1e3a5f] transition-all duration-500"
                        style={{ width: `calc(${(currentIndex / (steps.length - 1)) * 100}% - 32px)` }}
                    />

                    {/* Steps */}
                    <div className="relative flex justify-between min-w-[280px]">
                        {steps.map((step, index) => {
                            const stepStatus = getStepStatus(index)
                            const StepIcon = step.icon

                            return (
                                <div
                                    key={step.id}
                                    className="flex flex-col items-center"
                                >
                                    {/* Circle */}
                                    <div
                                        className={`
                                            relative w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center
                                            transition-all duration-300 border-2
                                            ${stepStatus === 'completed'
                                                ? 'bg-[#1e3a5f] border-[#1e3a5f]'
                                                : stepStatus === 'current'
                                                    ? 'bg-[#1e3a5f] border-[#1e3a5f] ring-4 ring-slate-100'
                                                    : 'bg-white border-slate-300'
                                            }
                                        `}
                                    >
                                        {stepStatus === 'completed' ? (
                                            <Check className="w-3 h-3 sm:w-4 sm:h-4 text-white" strokeWidth={3} />
                                        ) : stepStatus === 'current' ? (
                                            <StepIcon className="w-3 h-3 sm:w-4 sm:h-4 text-white" />
                                        ) : (
                                            <Circle className="w-3 h-3 text-slate-300 fill-current" />
                                        )}
                                    </div>

                                    {/* Label */}
                                    <span className={`
                                        mt-2 sm:mt-3 text-[10px] sm:text-xs font-medium text-center max-w-[60px] sm:max-w-[80px] leading-tight
                                        ${stepStatus === 'current'
                                            ? 'text-[#1e3a5f] font-semibold'
                                            : stepStatus === 'completed'
                                                ? 'text-slate-700'
                                                : 'text-slate-400'
                                        }
                                    `}>
                                        {step.label}
                                    </span>
                                </div>
                            )
                        })}
                    </div>
                </div>
            </div>
        </div>
    )
}
