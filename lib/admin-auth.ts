import { NextResponse } from 'next/server'
import { getSession } from './auth'
import type { AdminSession, AdminRole } from './types'

export interface AuthResult {
    success: boolean
    session?: AdminSession
    error?: string
    response?: NextResponse
}

// Valida sessão admin para APIs
export async function validateAdminSession(
    requiredRoles?: AdminRole[]
): Promise<AuthResult> {
    const session = await getSession()

    if (!session) {
        return {
            success: false,
            error: 'Não autorizado. Faça login para continuar.',
            response: NextResponse.json(
                { success: false, error: 'Não autorizado' },
                { status: 401 }
            ),
        }
    }

    // Verifica se a sessão expirou
    if (session.exp * 1000 < Date.now()) {
        return {
            success: false,
            error: 'Sessão expirada. Faça login novamente.',
            response: NextResponse.json(
                { success: false, error: 'Sessão expirada' },
                { status: 401 }
            ),
        }
    }

    // Verifica permissões de role
    if (requiredRoles && requiredRoles.length > 0) {
        if (!requiredRoles.includes(session.role)) {
            return {
                success: false,
                error: 'Acesso negado. Permissões insuficientes.',
                response: NextResponse.json(
                    { success: false, error: 'Acesso negado' },
                    { status: 403 }
                ),
            }
        }
    }

    return {
        success: true,
        session,
    }
}

// Helpers para verificar roles
export function isSuperAdmin(role: AdminRole): boolean {
    return role === 'super_admin'
}

export function isAdmin(role: AdminRole): boolean {
    return role === 'super_admin' || role === 'admin'
}

export function isOperator(role: AdminRole): boolean {
    return role === 'super_admin' || role === 'admin' || role === 'operator'
}

// Role labels para exibição
export const ROLE_LABELS: Record<AdminRole, string> = {
    super_admin: 'Super Administrador',
    admin: 'Administrador',
    operator: 'Operador',
}

// Permissões por role
export const ROLE_PERMISSIONS: Record<AdminRole, string[]> = {
    super_admin: [
        'create_admin',
        'delete_admin',
        'edit_admin',
        'view_admin',
        'create_delivery',
        'edit_delivery',
        'delete_delivery',
        'update_status',
        'view_analytics',
        'manage_settings',
        'manage_api_keys',
        'view_logs',
    ],
    admin: [
        'create_delivery',
        'edit_delivery',
        'delete_delivery',
        'update_status',
        'view_analytics',
        'manage_settings',
        'manage_api_keys',
    ],
    operator: [
        'view_delivery',
        'update_status',
    ],
}

// Verifica se role tem permissão específica
export function hasPermission(role: AdminRole, permission: string): boolean {
    return ROLE_PERMISSIONS[role]?.includes(permission) ?? false
}
