// ============================================
// STATUS VALIDATOR
// Validates delivery status transitions
// ============================================

export type DeliveryStatus = 'pending' | 'collected' | 'in_transit' | 'out_for_delivery' | 'delivered' | 'failed' | 'returned'

// Ordered statuses for validation
const STATUS_ORDER: DeliveryStatus[] = [
    'pending',
    'collected',
    'in_transit',
    'out_for_delivery',
    'delivered'
]

// Special statuses that can be set from any state
const SPECIAL_STATUSES: DeliveryStatus[] = ['failed', 'returned']

// Status display names in Portuguese
export const STATUS_LABELS: Record<DeliveryStatus, string> = {
    'pending': 'Aguardando Coleta',
    'collected': 'Coletado',
    'in_transit': 'Em Trânsito',
    'out_for_delivery': 'Saiu para Entrega',
    'delivered': 'Entregue',
    'failed': 'Falhou',
    'returned': 'Devolvido'
}

/**
 * Check if a status transition is valid
 */
export function isValidStatusTransition(
    currentStatus: DeliveryStatus,
    newStatus: DeliveryStatus
): boolean {
    // Same status is always valid (no change)
    if (currentStatus === newStatus) {
        return true
    }

    // Special statuses can be set from any state
    if (SPECIAL_STATUSES.includes(newStatus)) {
        return true
    }

    // From failed/returned, can go back to in_transit (retry)
    if (SPECIAL_STATUSES.includes(currentStatus) && newStatus === 'in_transit') {
        return true
    }

    // Get order indices
    const currentIndex = STATUS_ORDER.indexOf(currentStatus)
    const newIndex = STATUS_ORDER.indexOf(newStatus)

    // Unknown statuses
    if (currentIndex === -1 || newIndex === -1) {
        return false
    }

    // New status must be after current status (no going backwards)
    // Exception: in_transit can be repeated (multiple transit updates)
    if (newStatus === 'in_transit' && currentStatus === 'in_transit') {
        return true
    }

    // Allow forward progression only
    return newIndex > currentIndex
}

/**
 * Get allowed next statuses from current status
 */
export function getAllowedNextStatuses(currentStatus: DeliveryStatus): DeliveryStatus[] {
    const allowed: DeliveryStatus[] = []
    const currentIndex = STATUS_ORDER.indexOf(currentStatus)

    // Add all forward statuses
    if (currentIndex >= 0) {
        for (let i = currentIndex + 1; i < STATUS_ORDER.length; i++) {
            allowed.push(STATUS_ORDER[i])
        }
    }

    // Special statuses are always allowed
    allowed.push(...SPECIAL_STATUSES)

    // in_transit can always return to in_transit
    if (currentStatus === 'in_transit' && !allowed.includes('in_transit')) {
        allowed.push('in_transit')
    }

    return allowed
}

/**
 * Get progress percentage for a status
 */
export function getStatusProgress(status: DeliveryStatus): number {
    const progressMap: Record<DeliveryStatus, number> = {
        'pending': 0,
        'collected': 15,
        'in_transit': 50,
        'out_for_delivery': 85,
        'delivered': 100,
        'failed': 85,
        'returned': 50
    }
    return progressMap[status] ?? 0
}

/**
 * Validate and optionally throw error on invalid transition
 */
export function validateStatusTransition(
    currentStatus: DeliveryStatus,
    newStatus: DeliveryStatus,
    throwOnError: boolean = false
): { valid: boolean; error?: string } {
    const valid = isValidStatusTransition(currentStatus, newStatus)

    if (!valid) {
        const error = `Transição inválida: ${STATUS_LABELS[currentStatus]} → ${STATUS_LABELS[newStatus]}`

        if (throwOnError) {
            throw new Error(error)
        }

        return { valid: false, error }
    }

    return { valid: true }
}
