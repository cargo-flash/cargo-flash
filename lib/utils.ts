import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'
import { format, formatDistanceToNow, parseISO, differenceInDays, differenceInHours, differenceInMinutes } from 'date-fns'
import { ptBR } from 'date-fns/locale'

// Combina classes do Tailwind
export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs))
}

// Formata data no padrão brasileiro
export function formatDate(date: string | Date, formatStr: string = 'dd/MM/yyyy'): string {
    const d = typeof date === 'string' ? parseISO(date) : date
    return format(d, formatStr, { locale: ptBR })
}

// Formata data e hora
export function formatDateTime(date: string | Date): { date: string; time: string } {
    const d = typeof date === 'string' ? parseISO(date) : date
    return {
        date: format(d, 'dd/MM/yyyy', { locale: ptBR }),
        time: format(d, 'HH:mm', { locale: ptBR })
    }
}

// Formata data e hora como string
export function formatDateTimeString(date: string | Date): string {
    const d = typeof date === 'string' ? parseISO(date) : date
    return format(d, "dd/MM/yyyy 'às' HH:mm", { locale: ptBR })
}

// Formata tempo relativo (ex: "há 2 horas")
export function formatRelativeTime(date: string | Date): string {
    const d = typeof date === 'string' ? parseISO(date) : date
    return formatDistanceToNow(d, { addSuffix: true, locale: ptBR })
}

// Calcula countdown para entrega
export function getDeliveryCountdown(estimatedDelivery: string | Date): {
    days: number
    hours: number
    minutes: number
    isOverdue: boolean
    text: string
} {
    const now = new Date()
    const delivery = typeof estimatedDelivery === 'string' ? parseISO(estimatedDelivery) : estimatedDelivery

    const days = differenceInDays(delivery, now)
    const hours = differenceInHours(delivery, now) % 24
    const minutes = differenceInMinutes(delivery, now) % 60
    const isOverdue = delivery < now

    let text = ''
    if (isOverdue) {
        text = 'Atrasado'
    } else if (days > 0) {
        text = `${days} dia${days > 1 ? 's' : ''}`
    } else if (hours > 0) {
        text = `${hours} hora${hours > 1 ? 's' : ''}`
    } else {
        text = `${minutes} minuto${minutes > 1 ? 's' : ''}`
    }

    return { days, hours, minutes, isOverdue, text }
}

// Formata peso em kg
export function formatWeight(weight: number | null | undefined): string {
    if (!weight) return '-'
    return `${weight.toFixed(2)} kg`
}

// Formata telefone brasileiro
export function formatPhone(phone: string | null | undefined): string {
    if (!phone) return '-'
    const cleaned = phone.replace(/\D/g, '')
    if (cleaned.length === 11) {
        return `(${cleaned.slice(0, 2)}) ${cleaned.slice(2, 7)}-${cleaned.slice(7)}`
    }
    if (cleaned.length === 10) {
        return `(${cleaned.slice(0, 2)}) ${cleaned.slice(2, 6)}-${cleaned.slice(6)}`
    }
    return phone
}

// Formata CEP
export function formatCEP(cep: string | null | undefined): string {
    if (!cep) return '-'
    const cleaned = cep.replace(/\D/g, '')
    if (cleaned.length === 8) {
        return `${cleaned.slice(0, 5)}-${cleaned.slice(5)}`
    }
    return cep
}

// Gera código de rastreamento
export function generateTrackingCode(): string {
    const num = Math.floor(Math.random() * 1000000000).toString().padStart(9, '0')
    return `CF${num}BR`
}

// Trunca texto
export function truncate(text: string, maxLength: number): string {
    if (text.length <= maxLength) return text
    return text.slice(0, maxLength - 3) + '...'
}

// Gera iniciais do nome
export function getInitials(name: string): string {
    return name
        .split(' ')
        .map(n => n[0])
        .join('')
        .toUpperCase()
        .slice(0, 2)
}

// Delay para simulação de loading
export function delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms))
}

// Valida email
export function isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(email)
}

// Copia para clipboard
export async function copyToClipboard(text: string): Promise<boolean> {
    try {
        await navigator.clipboard.writeText(text)
        return true
    } catch {
        return false
    }
}

// Formata endereço completo
export function formatFullAddress(
    address?: string | null,
    city?: string | null,
    state?: string | null,
    zip?: string | null
): string {
    const parts = [address, city, state].filter(Boolean)
    const addressStr = parts.join(', ')
    return zip ? `${addressStr} - ${formatCEP(zip)}` : addressStr
}

// Gera URL de compartilhamento
export function getShareUrl(trackingCode: string): string {
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'
    return `${baseUrl}/rastrear/${trackingCode}`
}

// Converte graus para radianos (para cálculos de distância)
function toRad(deg: number): number {
    return deg * (Math.PI / 180)
}

// Calcula distância entre dois pontos (Haversine)
export function calculateDistance(
    lat1: number,
    lng1: number,
    lat2: number,
    lng2: number
): number {
    const R = 6371 // Raio da Terra em km
    const dLat = toRad(lat2 - lat1)
    const dLng = toRad(lng2 - lng1)
    const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLng / 2) * Math.sin(dLng / 2)
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
    return R * c
}

// Estima tempo de viagem em horas (média 60km/h)
export function estimateTravelTime(distanceKm: number, avgSpeedKmh: number = 60): number {
    return distanceKm / avgSpeedKmh
}
