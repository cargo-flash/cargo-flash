// ============================================
// TIPOS TYPESCRIPT - CARGO FLASH
// ============================================

// Status possíveis de entrega
export type DeliveryStatus =
    | 'pending'
    | 'collected'
    | 'in_transit'
    | 'out_for_delivery'
    | 'delivered'
    | 'failed'
    | 'returned'

// Roles de administrador
export type AdminRole = 'super_admin' | 'admin' | 'operator'

// Tipos de evento de simulação
export type EventType =
    | 'collection'
    | 'departure'
    | 'arrival'
    | 'in_transit'
    | 'out_for_delivery'
    | 'delivery_attempt'
    | 'delivered'

// ============================================
// ENTIDADES DO BANCO
// ============================================

export interface Admin {
    id: string
    email: string
    password_hash?: string
    full_name: string
    role: AdminRole
    is_active: boolean
    reset_token?: string | null
    reset_token_expires?: string | null
    created_by?: string | null
    created_at: string
    updated_at: string
}

export interface Delivery {
    id: string
    tracking_code: string
    status: DeliveryStatus
    current_location?: string | null
    current_lat?: number | null
    current_lng?: number | null

    // Remetente
    sender_name?: string | null
    sender_email?: string | null
    sender_phone?: string | null
    origin_address?: string | null
    origin_city?: string | null
    origin_state?: string | null
    origin_zip?: string | null
    origin_lat?: number | null
    origin_lng?: number | null

    // Destinatário
    recipient_name: string
    recipient_email?: string | null
    recipient_phone?: string | null
    destination_address: string
    destination_city: string
    destination_state: string
    destination_zip?: string | null
    destination_lat?: number | null
    destination_lng?: number | null

    // Pacote
    package_description?: string | null
    package_weight?: number | null
    declared_value?: number | null

    // Comprovante
    proof_of_delivery_url?: string | null
    delivered_to?: string | null
    delivery_notes?: string | null

    // Motorista
    driver_name?: string | null
    driver_phone?: string | null
    driver_vehicle?: string | null
    driver_vehicle_plate?: string | null

    // Datas
    estimated_delivery?: string | null
    delivered_at?: string | null
    created_at: string
    updated_at: string
}

export interface DeliveryHistory {
    id: string
    delivery_id: string
    status: string
    location?: string | null
    city?: string | null
    state?: string | null
    lat?: number | null
    lng?: number | null
    description?: string | null
    progress_percent?: number | null
    created_at: string
}

export interface ApiKey {
    id: string
    name: string
    key_hash: string
    key_preview: string
    created_by?: string | null
    expires_at?: string | null
    last_used_at?: string | null
    is_active: boolean
    created_at: string
}

export interface ScheduledEvent {
    id: string
    delivery_id: string
    scheduled_for: string
    event_type: EventType
    new_status?: string | null
    location: string
    city: string
    state: string
    lat?: number | null
    lng?: number | null
    description: string
    progress_percent?: number | null
    executed: boolean
    executed_at?: string | null
    created_at: string
}

export interface SimulationConfig {
    id: string
    origin_company_name: string
    origin_address: string
    origin_city: string
    origin_state: string
    origin_zip: string
    origin_lat: number
    origin_lng: number
    min_delivery_days: number
    max_delivery_days: number
    update_start_hour: number
    update_end_hour: number
    created_at: string
    updated_at: string
}

export interface AdminActivityLog {
    id: string
    admin_id?: string | null
    admin_name?: string | null
    action: string
    resource_type?: string | null
    resource_id?: string | null
    details?: Record<string, unknown> | null
    ip_address?: string | null
    user_agent?: string | null
    created_at: string
}

export interface NotificationSettings {
    id: string
    smtp_host?: string | null
    smtp_port: number
    smtp_user?: string | null
    smtp_password?: string | null
    from_email: string
    from_name: string
    notify_on_status_change: boolean
    notify_on_delivery: boolean
    notify_on_delay: boolean
    created_at: string
    updated_at: string
}

// ============================================
// TIPOS DE API
// ============================================

export interface TrackingResponse {
    success: boolean
    delivery: Delivery | null
    history: DeliveryHistory[]
    error?: string
}

export interface DashboardStats {
    total_deliveries: number
    today_deliveries: number
    in_transit: number
    delivered: number
    pending: number
    failed: number
    delivery_rate: number
    deliveries_by_status: { status: string; count: number }[]
    deliveries_by_day: { date: string; count: number }[]
    recent_deliveries: Delivery[]
}

export interface PaginatedResponse<T> {
    data: T[]
    total: number
    page: number
    per_page: number
    total_pages: number
}

export interface ApiError {
    success: false
    error: string
    code?: string
}

export interface ApiSuccess<T = unknown> {
    success: true
    data?: T
    message?: string
}

// ============================================
// TIPOS DE SESSÃO
// ============================================

export interface AdminSession {
    id: string
    email: string
    full_name: string
    role: AdminRole
    exp: number
}

// ============================================
// TIPOS DE FORMULÁRIO
// ============================================

export interface CreateDeliveryInput {
    sender_name?: string
    sender_email?: string
    sender_phone?: string
    origin_address?: string
    origin_city?: string
    origin_state?: string
    origin_zip?: string

    recipient_name: string
    recipient_email?: string
    recipient_phone?: string
    destination_address: string
    destination_city: string
    destination_state: string
    destination_zip?: string

    package_description?: string
    package_weight?: number

    estimated_delivery?: string
    auto_simulate?: boolean
}

export interface UpdateDeliveryInput extends Partial<CreateDeliveryInput> {
    status?: DeliveryStatus
    current_location?: string
    driver_name?: string
    driver_phone?: string
    driver_vehicle?: string
    delivery_notes?: string
}

export interface UpdateStatusInput {
    status: DeliveryStatus
    location: string
    description: string
    lat?: number
    lng?: number
}

export interface CreateAdminInput {
    email: string
    password: string
    full_name: string
    role: AdminRole
}

export interface LoginInput {
    email: string
    password: string
}

// ============================================
// MAPAS E CONSTANTES
// ============================================

export const STATUS_LABELS: Record<DeliveryStatus, string> = {
    pending: 'Aguardando Coleta',
    collected: 'Coletado',
    in_transit: 'Em Trânsito',
    out_for_delivery: 'Saiu para Entrega',
    delivered: 'Entregue',
    failed: 'Falha na Entrega',
    returned: 'Devolvido',
}

export const STATUS_COLORS: Record<DeliveryStatus, string> = {
    pending: 'bg-amber-100 text-amber-800 border-amber-200',
    collected: 'bg-blue-100 text-blue-800 border-blue-200',
    in_transit: 'bg-indigo-100 text-indigo-800 border-indigo-200',
    out_for_delivery: 'bg-purple-100 text-purple-800 border-purple-200',
    delivered: 'bg-emerald-100 text-emerald-800 border-emerald-200',
    failed: 'bg-red-100 text-red-800 border-red-200',
    returned: 'bg-gray-100 text-gray-800 border-gray-200',
}

export const STATUS_ICONS: Record<DeliveryStatus, string> = {
    pending: 'Clock',
    collected: 'Package',
    in_transit: 'Truck',
    out_for_delivery: 'MapPin',
    delivered: 'CheckCircle2',
    failed: 'XCircle',
    returned: 'RotateCcw',
}

export const STATUS_ORDER: DeliveryStatus[] = [
    'pending',
    'collected',
    'in_transit',
    'out_for_delivery',
    'delivered',
]

export const DELIVERY_STATUSES: { value: DeliveryStatus; label: string }[] = [
    { value: 'pending', label: 'Aguardando Coleta' },
    { value: 'collected', label: 'Coletado' },
    { value: 'in_transit', label: 'Em Trânsito' },
    { value: 'out_for_delivery', label: 'Saiu para Entrega' },
    { value: 'delivered', label: 'Entregue' },
    { value: 'failed', label: 'Falha na Entrega' },
    { value: 'returned', label: 'Devolvido' },
]

export const BRAZILIAN_STATES = [
    { value: 'AC', label: 'Acre' },
    { value: 'AL', label: 'Alagoas' },
    { value: 'AP', label: 'Amapá' },
    { value: 'AM', label: 'Amazonas' },
    { value: 'BA', label: 'Bahia' },
    { value: 'CE', label: 'Ceará' },
    { value: 'DF', label: 'Distrito Federal' },
    { value: 'ES', label: 'Espírito Santo' },
    { value: 'GO', label: 'Goiás' },
    { value: 'MA', label: 'Maranhão' },
    { value: 'MT', label: 'Mato Grosso' },
    { value: 'MS', label: 'Mato Grosso do Sul' },
    { value: 'MG', label: 'Minas Gerais' },
    { value: 'PA', label: 'Pará' },
    { value: 'PB', label: 'Paraíba' },
    { value: 'PR', label: 'Paraná' },
    { value: 'PE', label: 'Pernambuco' },
    { value: 'PI', label: 'Piauí' },
    { value: 'RJ', label: 'Rio de Janeiro' },
    { value: 'RN', label: 'Rio Grande do Norte' },
    { value: 'RS', label: 'Rio Grande do Sul' },
    { value: 'RO', label: 'Rondônia' },
    { value: 'RR', label: 'Roraima' },
    { value: 'SC', label: 'Santa Catarina' },
    { value: 'SP', label: 'São Paulo' },
    { value: 'SE', label: 'Sergipe' },
    { value: 'TO', label: 'Tocantins' },
] as const
