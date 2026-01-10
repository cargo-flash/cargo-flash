'use client'

import {
    Leaf,
    TreePine,
    Droplets,
    Wind,
    Recycle,
    Sparkles
} from 'lucide-react'
import { useEffect, useState } from 'react'

interface SustainabilityCardProps {
    distanceKm?: number
    vehicleType?: string
}

export function SustainabilityCard({ distanceKm = 450, vehicleType = 'van' }: SustainabilityCardProps) {
    const [mounted, setMounted] = useState(false)
    const [animatedTrees, setAnimatedTrees] = useState(0)

    useEffect(() => {
        setMounted(true)

        // Calculate and animate trees planted
        const trees = Math.max(1, Math.floor(distanceKm / 100))
        const duration = 2000
        const steps = 30
        const increment = trees / steps
        let current = 0

        const timer = setInterval(() => {
            current += increment
            if (current >= trees) {
                setAnimatedTrees(trees)
                clearInterval(timer)
            } else {
                setAnimatedTrees(Math.floor(current))
            }
        }, duration / steps)

        return () => clearInterval(timer)
    }, [distanceKm])

    const carbonSaved = (distanceKm * 0.12).toFixed(1) // kg CO2
    const waterSaved = Math.floor(distanceKm * 0.5) // liters
    const energySaved = (distanceKm * 0.08).toFixed(1) // kWh

    const stats = [
        { icon: Leaf, value: `${carbonSaved} kg`, label: 'CO₂ economizado', color: 'text-emerald-600 bg-emerald-50' },
        { icon: Droplets, value: `${waterSaved} L`, label: 'Água preservada', color: 'text-blue-600 bg-blue-50' },
        { icon: Wind, value: `${energySaved} kWh`, label: 'Energia limpa', color: 'text-purple-600 bg-purple-50' }
    ]

    return (
        <div className={`relative overflow-hidden rounded-3xl bg-white shadow-xl shadow-slate-200/50 border border-slate-100 ${mounted ? 'animate-in fade-in slide-in-from-bottom-4 duration-700' : 'opacity-0'
            }`}>
            {/* Header */}
            <div className="relative bg-gradient-to-r from-green-400 via-emerald-500 to-teal-600 p-6">
                {/* Leaf pattern */}
                <div className="absolute inset-0 overflow-hidden opacity-10">
                    {[...Array(8)].map((_, i) => (
                        <Leaf
                            key={i}
                            className="absolute text-white animate-float"
                            style={{
                                left: `${10 + i * 12}%`,
                                top: `${20 + (i % 3) * 20}%`,
                                animationDelay: `${i * 0.3}s`,
                                width: 24,
                                height: 24
                            }}
                        />
                    ))}
                </div>

                <div className="relative flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <div className="w-14 h-14 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center">
                            <Recycle className="w-7 h-7 text-white" />
                        </div>
                        <div>
                            <h3 className="text-xl font-bold text-white">Entrega Sustentável</h3>
                            <p className="text-emerald-100">Contribuindo para o planeta</p>
                        </div>
                    </div>
                    <span className="px-4 py-2 bg-white/20 backdrop-blur-sm text-white rounded-full text-sm font-medium flex items-center gap-1">
                        <Sparkles className="w-4 h-4" />
                        Eco-friendly
                    </span>
                </div>
            </div>

            {/* Trees Planted */}
            <div className="p-6 border-b border-slate-100 bg-gradient-to-r from-emerald-50 to-teal-50">
                <div className="text-center">
                    <div className="flex items-center justify-center gap-2 mb-2">
                        {[...Array(Math.min(animatedTrees, 5))].map((_, i) => (
                            <TreePine
                                key={i}
                                className="w-8 h-8 text-emerald-600 animate-in zoom-in duration-300"
                                style={{ animationDelay: `${i * 100}ms` }}
                            />
                        ))}
                        {animatedTrees > 5 && (
                            <span className="text-3xl font-bold text-emerald-600">+{animatedTrees - 5}</span>
                        )}
                    </div>
                    <p className="text-2xl font-black text-emerald-700">
                        {animatedTrees} {animatedTrees === 1 ? 'árvore' : 'árvores'}
                    </p>
                    <p className="text-sm text-emerald-600">
                        plantadas para compensar esta entrega
                    </p>
                </div>
            </div>

            {/* Environmental Stats */}
            <div className="p-6">
                <div className="grid grid-cols-3 gap-4">
                    {stats.map((stat, index) => {
                        const Icon = stat.icon
                        return (
                            <div
                                key={index}
                                className={`text-center p-4 rounded-2xl ${stat.color}`}
                            >
                                <Icon className="w-6 h-6 mx-auto mb-2" />
                                <p className="text-lg font-bold">{stat.value}</p>
                                <p className="text-xs opacity-70">{stat.label}</p>
                            </div>
                        )
                    })}
                </div>

                {/* Certificate */}
                <div className="mt-6 p-4 bg-slate-50 rounded-2xl flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-emerald-100 flex items-center justify-center">
                        <Leaf className="w-6 h-6 text-emerald-600" />
                    </div>
                    <div className="flex-1">
                        <p className="font-bold text-slate-700">Certificado de Carbono Neutro</p>
                        <p className="text-sm text-slate-500">Esta entrega foi 100% compensada</p>
                    </div>
                </div>
            </div>

            <style jsx>{`
                @keyframes float {
                    0%, 100% { transform: translateY(0) rotate(0deg); }
                    50% { transform: translateY(-10px) rotate(5deg); }
                }
                .animate-float {
                    animation: float 3s ease-in-out infinite;
                }
            `}</style>
        </div>
    )
}
