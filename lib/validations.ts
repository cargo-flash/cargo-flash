import { z } from 'zod'

// Validação de email
const emailSchema = z.string().email('Email inválido')

// Validação de telefone brasileiro
const phoneSchema = z.string().regex(/^\d{10,11}$/, 'Telefone inválido').optional().or(z.literal(''))

// Validação de CEP
const cepSchema = z.string().regex(/^\d{8}$/, 'CEP inválido').optional().or(z.literal(''))

// Estado brasileiro
const stateSchema = z.string().length(2, 'Estado inválido')

// ============================================
// SCHEMAS DE AUTENTICAÇÃO
// ============================================

export const loginSchema = z.object({
    email: emailSchema,
    password: z.string().min(6, 'Senha deve ter no mínimo 6 caracteres'),
})

export const forgotPasswordSchema = z.object({
    email: emailSchema,
})

export const resetPasswordSchema = z.object({
    token: z.string().min(1, 'Token é obrigatório'),
    password: z.string().min(8, 'Senha deve ter no mínimo 8 caracteres'),
    confirmPassword: z.string().min(1, 'Confirmação é obrigatória'),
}).refine((data) => data.password === data.confirmPassword, {
    message: 'As senhas não coincidem',
    path: ['confirmPassword'],
})

// ============================================
// SCHEMAS DE ADMIN
// ============================================

export const createAdminSchema = z.object({
    email: emailSchema,
    password: z.string().min(8, 'Senha deve ter no mínimo 8 caracteres'),
    full_name: z.string().min(3, 'Nome deve ter no mínimo 3 caracteres'),
    role: z.enum(['super_admin', 'admin', 'operator']),
})

export const updateAdminSchema = z.object({
    email: emailSchema.optional(),
    password: z.string().min(8, 'Senha deve ter no mínimo 8 caracteres').optional().or(z.literal('')),
    full_name: z.string().min(3, 'Nome deve ter no mínimo 3 caracteres').optional(),
    role: z.enum(['super_admin', 'admin', 'operator']).optional(),
    is_active: z.boolean().optional(),
})

// ============================================
// SCHEMAS DE ENTREGA
// ============================================

export const createDeliverySchema = z.object({
    // Remetente
    sender_name: z.string().optional().or(z.literal('')),
    sender_email: z.string().email('Email inválido').optional().or(z.literal('')),
    sender_phone: z.string().optional().or(z.literal('')),
    origin_address: z.string().optional().or(z.literal('')),
    origin_city: z.string().optional().or(z.literal('')),
    origin_state: z.string().max(2).optional().or(z.literal('')),
    origin_zip: z.string().optional().or(z.literal('')),

    // Destinatário
    recipient_name: z.string().min(3, 'Nome do destinatário é obrigatório'),
    recipient_email: z.string().email('Email inválido').optional().or(z.literal('')),
    recipient_phone: z.string().optional().or(z.literal('')),
    destination_address: z.string().min(5, 'Endereço de destino é obrigatório'),
    destination_city: z.string().min(2, 'Cidade de destino é obrigatória'),
    destination_state: z.string().length(2, 'Estado deve ter 2 caracteres'),
    destination_zip: z.string().optional().or(z.literal('')),

    // Pacote
    package_description: z.string().optional().or(z.literal('')),
    package_weight: z.coerce.number().positive('Peso deve ser positivo').optional().or(z.literal('')),

    // Opções
    estimated_delivery: z.string().optional().or(z.literal('')),
    auto_simulate: z.boolean().optional().default(true),
})

export const updateDeliverySchema = createDeliverySchema.partial().extend({
    status: z.enum(['pending', 'collected', 'in_transit', 'out_for_delivery', 'delivered', 'failed', 'returned']).optional(),
    current_location: z.string().optional(),
    driver_name: z.string().optional(),
    driver_phone: phoneSchema,
    driver_vehicle: z.string().optional(),
    delivery_notes: z.string().optional(),
})

export const updateStatusSchema = z.object({
    status: z.enum(['pending', 'collected', 'in_transit', 'out_for_delivery', 'delivered', 'failed', 'returned']),
    location: z.string().min(3, 'Localização é obrigatória').optional().or(z.literal('')),
    description: z.string().optional().or(z.literal('')),
    city: z.string().optional(),
    state: stateSchema.optional(),
    lat: z.coerce.number().optional(),
    lng: z.coerce.number().optional(),
})

// ============================================
// SCHEMAS DE CONFIGURAÇÃO
// ============================================

export const simulationConfigSchema = z.object({
    origin_company_name: z.string().min(3, 'Nome da empresa é obrigatório'),
    origin_address: z.string().min(5, 'Endereço é obrigatório'),
    origin_city: z.string().min(2, 'Cidade é obrigatória'),
    origin_state: stateSchema,
    origin_zip: cepSchema,
    origin_lat: z.coerce.number(),
    origin_lng: z.coerce.number(),
    min_delivery_days: z.coerce.number().min(1).max(60),
    max_delivery_days: z.coerce.number().min(1).max(60),
    update_start_hour: z.coerce.number().min(0).max(23),
    update_end_hour: z.coerce.number().min(0).max(23),
})

export const notificationSettingsSchema = z.object({
    smtp_host: z.string().optional(),
    smtp_port: z.coerce.number().optional().default(587),
    smtp_user: z.string().optional(),
    smtp_password: z.string().optional(),
    from_email: emailSchema.optional(),
    from_name: z.string().optional(),
    notify_on_status_change: z.boolean().optional(),
    notify_on_delivery: z.boolean().optional(),
    notify_on_delay: z.boolean().optional(),
})

// ============================================
// SCHEMAS DE API KEY
// ============================================

export const createApiKeySchema = z.object({
    name: z.string().min(3, 'Nome é obrigatório'),
    expires_at: z.string().optional(),
})

// ============================================
// SCHEMAS DE WEBHOOK WOOCOMMERCE
// ============================================

export const wooCommerceWebhookSchema = z.object({
    order_id: z.coerce.number(),
    customer: z.object({
        name: z.string(),
        email: z.string().email().optional(),
        phone: z.string().optional(),
        address: z.object({
            street: z.string(),
            complement: z.string().optional(),
            city: z.string(),
            state: z.string(),
            zip: z.string(),
        }),
    }),
    items: z.array(z.object({
        name: z.string(),
        quantity: z.number(),
        price: z.number(),
    })).optional(),
    total: z.number().optional(),
})

// ============================================
// TIPOS INFERIDOS
// ============================================

export type LoginInput = z.infer<typeof loginSchema>
export type CreateDeliveryInput = z.infer<typeof createDeliverySchema>
export type UpdateDeliveryInput = z.infer<typeof updateDeliverySchema>
export type UpdateStatusInput = z.infer<typeof updateStatusSchema>
export type CreateAdminInput = z.infer<typeof createAdminSchema>
export type SimulationConfigInput = z.infer<typeof simulationConfigSchema>
export type WooCommerceWebhookInput = z.infer<typeof wooCommerceWebhookSchema>
