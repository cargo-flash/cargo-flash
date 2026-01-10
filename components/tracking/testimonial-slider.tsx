'use client'

import {
    Star,
    Quote,
    ChevronLeft,
    ChevronRight,
    User
} from 'lucide-react'
import { useState, useEffect } from 'react'

interface TestimonialSliderProps {
    routeInfo?: string
}

interface Testimonial {
    id: number
    name: string
    location: string
    rating: number
    text: string
    date: string
    avatar?: string
}

const testimonials: Testimonial[] = [
    {
        id: 1,
        name: 'Maria Silva',
        location: 'São Paulo, SP',
        rating: 5,
        text: 'Entrega super rápida e com comunicação impecável. Recebi atualizações em tempo real e o pacote chegou antes do prazo!',
        date: 'há 2 dias'
    },
    {
        id: 2,
        name: 'João Santos',
        location: 'Rio de Janeiro, RJ',
        rating: 5,
        text: 'Melhor rastreamento que já usei. A página é linda e me deu total confiança de que minha encomenda chegaria.',
        date: 'há 3 dias'
    },
    {
        id: 3,
        name: 'Ana Oliveira',
        location: 'Belo Horizonte, MG',
        rating: 5,
        text: 'Atendimento excepcional! Tive um problema e foi resolvido em minutos. Entrega perfeita.',
        date: 'há 1 semana'
    },
    {
        id: 4,
        name: 'Carlos Mendes',
        location: 'Curitiba, PR',
        rating: 5,
        text: 'A experiência de rastreamento é incrível. Senti que estava acompanhando minha encomenda a cada passo.',
        date: 'há 1 semana'
    },
    {
        id: 5,
        name: 'Fernanda Costa',
        location: 'Porto Alegre, RS',
        rating: 5,
        text: 'Segurança e agilidade. Meu produto frágil chegou intacto e no prazo. Super recomendo!',
        date: 'há 2 semanas'
    }
]

export function TestimonialSlider({ routeInfo }: TestimonialSliderProps) {
    const [currentIndex, setCurrentIndex] = useState(0)
    const [isAutoPlaying, setIsAutoPlaying] = useState(true)
    const [mounted, setMounted] = useState(false)

    useEffect(() => {
        setMounted(true)
    }, [])

    useEffect(() => {
        if (!isAutoPlaying) return

        const interval = setInterval(() => {
            setCurrentIndex((prev) => (prev + 1) % testimonials.length)
        }, 5000)

        return () => clearInterval(interval)
    }, [isAutoPlaying])

    const goToNext = () => {
        setIsAutoPlaying(false)
        setCurrentIndex((prev) => (prev + 1) % testimonials.length)
    }

    const goToPrev = () => {
        setIsAutoPlaying(false)
        setCurrentIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length)
    }

    const currentTestimonial = testimonials[currentIndex]

    return (
        <div className={`relative bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600 rounded-3xl overflow-hidden shadow-2xl ${mounted ? 'animate-in fade-in slide-in-from-bottom-4 duration-700' : 'opacity-0'
            }`}>
            {/* Background Decorations */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/10 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2" />

            {/* Quote Icon */}
            <div className="absolute top-6 left-6 opacity-20">
                <Quote className="w-24 h-24 text-white" />
            </div>

            <div className="relative z-10 p-8 md:p-10">
                {/* Header */}
                <div className="flex items-center justify-between mb-8">
                    <div>
                        <h3 className="text-xl font-bold text-white mb-1">O que nossos clientes dizem</h3>
                        <p className="text-white/60 text-sm">+50.000 avaliações 5 estrelas</p>
                    </div>
                    <div className="flex items-center gap-1">
                        {[...Array(5)].map((_, i) => (
                            <Star key={i} className="w-5 h-5 text-amber-400 fill-amber-400" />
                        ))}
                    </div>
                </div>

                {/* Testimonial Content */}
                <div className="min-h-[180px] flex flex-col justify-center">
                    <p className="text-xl md:text-2xl text-white font-medium leading-relaxed mb-6">
                        &ldquo;{currentTestimonial.text}&rdquo;
                    </p>

                    <div className="flex items-center gap-4">
                        {/* Avatar */}
                        <div className="w-14 h-14 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center">
                            <User className="w-7 h-7 text-white" />
                        </div>

                        {/* Info */}
                        <div>
                            <p className="font-bold text-white">{currentTestimonial.name}</p>
                            <p className="text-white/60 text-sm">{currentTestimonial.location}</p>
                        </div>

                        {/* Date */}
                        <div className="ml-auto text-white/40 text-sm">
                            {currentTestimonial.date}
                        </div>
                    </div>
                </div>

                {/* Navigation */}
                <div className="flex items-center justify-between mt-8 pt-6 border-t border-white/10">
                    <div className="flex items-center gap-2">
                        {testimonials.map((_, index) => (
                            <button
                                key={index}
                                onClick={() => {
                                    setIsAutoPlaying(false)
                                    setCurrentIndex(index)
                                }}
                                className={`h-2 rounded-full transition-all duration-300 ${index === currentIndex
                                    ? 'w-8 bg-white'
                                    : 'w-2 bg-white/30 hover:bg-white/50'
                                    }`}
                            />
                        ))}
                    </div>

                    <div className="flex items-center gap-2">
                        <button
                            onClick={goToPrev}
                            className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors"
                        >
                            <ChevronLeft className="w-5 h-5 text-white" />
                        </button>
                        <button
                            onClick={goToNext}
                            className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors"
                        >
                            <ChevronRight className="w-5 h-5 text-white" />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}
