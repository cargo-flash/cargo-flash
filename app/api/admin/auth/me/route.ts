import { NextResponse } from 'next/server'
import { getSession } from '@/lib/auth'

export async function GET() {
    try {
        const session = await getSession()

        if (!session) {
            return NextResponse.json(
                { success: false, error: 'Não autenticado' },
                { status: 401 }
            )
        }

        // Check expiration
        if (session.exp * 1000 < Date.now()) {
            return NextResponse.json(
                { success: false, error: 'Sessão expirada' },
                { status: 401 }
            )
        }

        return NextResponse.json({
            success: true,
            admin: {
                id: session.id,
                email: session.email,
                full_name: session.full_name,
                role: session.role,
            },
        })
    } catch (error) {
        console.error('Session check error:', error)
        return NextResponse.json(
            { success: false, error: 'Erro ao verificar sessão' },
            { status: 500 }
        )
    }
}
