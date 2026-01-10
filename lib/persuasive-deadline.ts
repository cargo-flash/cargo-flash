// ============================================
// SISTEMA DE PRAZO PERSUASIVO DINÂMICO
// ============================================
// Gerencia a extensão gradual de prazos de entrega
// com justificativas realistas para manter confiança do cliente

import { differenceInDays, addDays, format, parseISO, isAfter, isBefore } from 'date-fns'
import { ptBR } from 'date-fns/locale'

// ============================================
// TIPOS
// ============================================

export interface DelayJustification {
    type: 'weather' | 'traffic' | 'operational' | 'customs' | 'logistics'
    title: string
    description: string
    icon: string
    severity: 'low' | 'medium' | 'high'
    additionalDays: number
}

export interface DeadlineExtensionResult {
    originalEstimate: Date
    currentEstimate: Date
    displayDate: string
    displayWindow: string
    isExtended: boolean
    extensionCount: number
    totalDaysAdded: number
    currentJustification: DelayJustification | null
    justificationHistory: DelayJustification[]
    confidence: 'high' | 'medium' | 'low'
    message: string
}

// ============================================
// JUSTIFICATIVAS DE ATRASO REALISTAS
// ============================================

const DELAY_JUSTIFICATIONS: DelayJustification[] = [
    // Condições climáticas
    {
        type: 'weather',
        title: 'Condições climáticas adversas',
        description: 'Chuvas intensas na região estão afetando as condições das estradas. Por segurança, o transporte está operando em velocidade reduzida.',
        icon: 'Cloud',
        severity: 'medium',
        additionalDays: 2
    },
    {
        type: 'weather',
        title: 'Neblina intensa na rota',
        description: 'Condições de neblina no trajeto estão reduzindo a visibilidade. O transporte está prosseguindo com cautela.',
        icon: 'CloudFog',
        severity: 'low',
        additionalDays: 1
    },
    {
        type: 'weather',
        title: 'Temporal na região',
        description: 'Um sistema de tempestades está atravessando a rota. Aguardando melhora nas condições para prosseguir com segurança.',
        icon: 'CloudLightning',
        severity: 'high',
        additionalDays: 3
    },

    // Trânsito e infraestrutura
    {
        type: 'traffic',
        title: 'Congestionamento na rodovia',
        description: 'Alto volume de tráfego na rodovia principal está causando lentidão. Estimativa atualizada automaticamente.',
        icon: 'Car',
        severity: 'low',
        additionalDays: 1
    },
    {
        type: 'traffic',
        title: 'Acidente na rota',
        description: 'Um acidente na rodovia causou congestionamento temporário. A rota está sendo recalculada.',
        icon: 'AlertTriangle',
        severity: 'medium',
        additionalDays: 2
    },
    {
        type: 'traffic',
        title: 'Interdição parcial de rodovia',
        description: 'Obras na pista estão causando interdição parcial. O transporte segue por rota alternativa.',
        icon: 'Construction',
        severity: 'medium',
        additionalDays: 2
    },
    {
        type: 'traffic',
        title: 'Interdição total temporária',
        description: 'A rodovia principal está temporariamente interditada. Aguardando liberação ou rota alternativa.',
        icon: 'AlertOctagon',
        severity: 'high',
        additionalDays: 3
    },

    // Operacional
    {
        type: 'operational',
        title: 'Redistribuição de carga',
        description: 'A encomenda está sendo redistribuída no centro de distribuição para otimizar a rota final.',
        icon: 'Package',
        severity: 'low',
        additionalDays: 1
    },
    {
        type: 'operational',
        title: 'Parada programada em hub',
        description: 'A encomenda passou por verificação de rotina em nosso centro de distribuição.',
        icon: 'Building2',
        severity: 'low',
        additionalDays: 1
    },
    {
        type: 'operational',
        title: 'Alto volume de entregas',
        description: 'O volume de entregas na região está acima do normal. Sua encomenda está na fila de prioridade.',
        icon: 'Truck',
        severity: 'medium',
        additionalDays: 2
    },

    // Logística
    {
        type: 'logistics',
        title: 'Ajuste de rota',
        description: 'A rota de entrega foi otimizada para melhor atender sua região.',
        icon: 'Map',
        severity: 'low',
        additionalDays: 1
    },
    {
        type: 'logistics',
        title: 'Transferência entre centros',
        description: 'A encomenda está sendo transferida para o centro de distribuição mais próximo do destino.',
        icon: 'ArrowRightLeft',
        severity: 'low',
        additionalDays: 1
    }
]

// ============================================
// FUNÇÕES AUXILIARES
// ============================================

/**
 * Seleciona uma justificativa apropriada baseada no contexto
 */
function selectJustification(
    daysRemaining: number,
    daysNeeded: number,
    previousJustifications: DelayJustification[]
): DelayJustification {
    // Evitar repetir tipos de justificativa
    const usedTypes = new Set(previousJustifications.map(j => j.type))

    // Filtrar justificativas disponíveis
    let available = DELAY_JUSTIFICATIONS.filter(j => !usedTypes.has(j.type))

    // Se todas já foram usadas, permitir repetição
    if (available.length === 0) {
        available = DELAY_JUSTIFICATIONS
    }

    // Selecionar baseado na severidade necessária
    if (daysNeeded >= 3) {
        const highSeverity = available.filter(j => j.severity === 'high')
        if (highSeverity.length > 0) {
            return highSeverity[Math.floor(Math.random() * highSeverity.length)]
        }
    } else if (daysNeeded >= 2) {
        const mediumSeverity = available.filter(j => j.severity === 'medium' || j.severity === 'high')
        if (mediumSeverity.length > 0) {
            return mediumSeverity[Math.floor(Math.random() * mediumSeverity.length)]
        }
    }

    // Default: baixa severidade
    const lowSeverity = available.filter(j => j.severity === 'low')
    if (lowSeverity.length > 0) {
        return lowSeverity[Math.floor(Math.random() * lowSeverity.length)]
    }

    return available[Math.floor(Math.random() * available.length)]
}

/**
 * Gera uma seed consistente baseada no tracking code para randomização determinística
 */
function getSeededRandom(seed: string): () => number {
    let hash = 0
    for (let i = 0; i < seed.length; i++) {
        const char = seed.charCodeAt(i)
        hash = ((hash << 5) - hash) + char
        hash = hash & hash
    }

    return function () {
        hash = (hash * 1103515245 + 12345) & 0x7fffffff
        return hash / 0x7fffffff
    }
}

// ============================================
// FUNÇÃO PRINCIPAL
// ============================================

/**
 * Calcula o prazo persuasivo dinâmico para uma entrega
 * 
 * @param trackingCode - Código de rastreamento para seed
 * @param createdAt - Data de criação da entrega
 * @param originalEstimatedDelivery - Data original estimada (9 dias)
 * @param targetMinDays - Prazo real mínimo (15 dias)
 * @param targetMaxDays - Prazo real máximo (19 dias)
 * @param currentDate - Data atual (para testes, usar new Date())
 */
export function calculatePersuasiveDeadline(
    trackingCode: string,
    createdAt: string | Date,
    originalEstimatedDelivery: string | Date | null | undefined,
    targetMinDays: number = 15,
    targetMaxDays: number = 19,
    currentDate: Date = new Date()
): DeadlineExtensionResult {
    const created = typeof createdAt === 'string' ? parseISO(createdAt) : createdAt
    const random = getSeededRandom(trackingCode)

    // Calcular prazo original (9 dias úteis padrão)
    const originalDays = 9
    const originalEstimate = originalEstimatedDelivery
        ? (typeof originalEstimatedDelivery === 'string' ? parseISO(originalEstimatedDelivery) : originalEstimatedDelivery)
        : addDays(created, originalDays)

    // Calcular prazo real alvo (15-19 dias, determinístico por tracking code)
    const targetDaysRange = targetMaxDays - targetMinDays
    const targetDays = targetMinDays + Math.floor(random() * (targetDaysRange + 1))
    const realTargetDate = addDays(created, targetDays)

    // Dias desde a criação
    const daysSinceCreation = differenceInDays(currentDate, created)

    // Dias restantes até o prazo original
    const daysUntilOriginal = differenceInDays(originalEstimate, currentDate)

    // Dias restantes até o prazo real
    const daysUntilReal = differenceInDays(realTargetDate, currentDate)

    // Inicializar resultado
    const result: DeadlineExtensionResult = {
        originalEstimate,
        currentEstimate: originalEstimate,
        displayDate: '',
        displayWindow: '',
        isExtended: false,
        extensionCount: 0,
        totalDaysAdded: 0,
        currentJustification: null,
        justificationHistory: [],
        confidence: 'high',
        message: ''
    }

    // Se ainda estamos longe do prazo original (mais de 3 dias), manter prazo original
    if (daysUntilOriginal > 3) {
        result.currentEstimate = originalEstimate
        result.displayDate = format(originalEstimate, "d 'de' MMMM", { locale: ptBR })
        result.displayWindow = `Previsão: ${result.displayDate}`
        result.confidence = 'high'
        result.message = 'Sua entrega está dentro do prazo previsto.'
        return result
    }

    // Se o prazo original está próximo (1-3 dias) ou passou
    // Começar a aplicar extensões graduais

    const extensionsNeeded = Math.ceil((targetDays - originalDays) / 2) // ~2-3 dias por extensão
    let currentEstimate = originalEstimate
    const justificationHistory: DelayJustification[] = []

    // Calcular quantas extensões já deveriam ter sido aplicadas
    // Baseado em quando o cliente está vendo (se está perto do prazo)
    let extensionsToApply = 0

    if (daysUntilOriginal <= 0) {
        // Prazo original já passou
        extensionsToApply = Math.min(extensionsNeeded, Math.ceil(Math.abs(daysUntilOriginal) / 3) + 1)
    } else if (daysUntilOriginal <= 3) {
        // Próximo do prazo
        extensionsToApply = 1
    }

    // Aplicar extensões
    for (let i = 0; i < extensionsToApply && i < extensionsNeeded; i++) {
        const daysNeeded = Math.min(3, Math.ceil((targetDays - differenceInDays(currentEstimate, created)) / (extensionsNeeded - i)))
        const justification = selectJustification(
            differenceInDays(currentEstimate, currentDate),
            daysNeeded,
            justificationHistory
        )

        justificationHistory.push(justification)
        currentEstimate = addDays(currentEstimate, justification.additionalDays)
        result.totalDaysAdded += justification.additionalDays
    }

    // Garantir que não exceda o prazo máximo real
    if (isAfter(currentEstimate, realTargetDate)) {
        currentEstimate = realTargetDate
    }

    // Atualizar resultado
    result.currentEstimate = currentEstimate
    result.isExtended = justificationHistory.length > 0
    result.extensionCount = justificationHistory.length
    result.justificationHistory = justificationHistory
    result.currentJustification = justificationHistory.length > 0 ? justificationHistory[justificationHistory.length - 1] : null

    // Formatar display
    const daysRemaining = differenceInDays(currentEstimate, currentDate)

    if (daysRemaining <= 0) {
        result.displayWindow = 'Previsão: em breve'
        result.confidence = 'low'
    } else if (daysRemaining <= 2) {
        result.displayWindow = `Previsão: até ${daysRemaining + 1} dias úteis`
        result.confidence = 'medium'
    } else {
        result.displayDate = format(currentEstimate, "d 'de' MMMM", { locale: ptBR })
        result.displayWindow = `Previsão: ${result.displayDate}`
        result.confidence = result.isExtended ? 'medium' : 'high'
    }

    // Gerar mensagem apropriada
    if (result.currentJustification) {
        result.message = result.currentJustification.description
    } else {
        result.message = 'Sua entrega está a caminho.'
    }

    return result
}

/**
 * Formata o prazo como janela de entrega (não promessa)
 */
export function formatDeliveryWindow(
    estimatedDate: Date | string | null,
    windowDays: number = 2
): string {
    if (!estimatedDate) return 'A confirmar'

    const date = typeof estimatedDate === 'string' ? parseISO(estimatedDate) : estimatedDate
    const endWindow = addDays(date, windowDays)

    const startFormatted = format(date, "d", { locale: ptBR })
    const endFormatted = format(endWindow, "d 'de' MMMM", { locale: ptBR })

    return `Entre ${startFormatted} e ${endFormatted}`
}

/**
 * Gera texto de status para o prazo
 */
export function getDeadlineStatusText(
    daysRemaining: number,
    isExtended: boolean
): { text: string; tone: 'positive' | 'neutral' | 'caution' } {
    if (daysRemaining < 0) {
        return {
            text: 'Entrega em processamento final',
            tone: 'caution'
        }
    }

    if (daysRemaining === 0) {
        return {
            text: 'Prevista para hoje',
            tone: 'positive'
        }
    }

    if (daysRemaining === 1) {
        return {
            text: 'Prevista para amanhã',
            tone: 'positive'
        }
    }

    if (daysRemaining <= 3) {
        return {
            text: `Prevista para os próximos ${daysRemaining} dias`,
            tone: 'positive'
        }
    }

    return {
        text: `Aproximadamente ${daysRemaining} dias restantes`,
        tone: 'neutral'
    }
}
