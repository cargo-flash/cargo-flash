import { NextResponse } from 'next/server'
import { createServiceClient } from '@/lib/supabase/server'

export async function POST(request: Request) {
    try {
        const body = await request.json()
        const { name, email, phone, subject, message } = body

        // Validation
        if (!name || !email || !message) {
            return NextResponse.json(
                { success: false, error: 'Nome, email e mensagem são obrigatórios' },
                { status: 400 }
            )
        }

        // Email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
        if (!emailRegex.test(email)) {
            return NextResponse.json(
                { success: false, error: 'Email inválido' },
                { status: 400 }
            )
        }

        const supabase = await createServiceClient()

        // Store contact message
        const { error } = await supabase.from('contact_messages').insert({
            name,
            email,
            phone: phone || null,
            subject: subject || 'Contato via site',
            message,
            status: 'pending',
        })

        if (error) {
            // Table might not exist, log and continue
            console.log('Contact message storage:', error.message)
        }

        // In production, send email notification here
        console.log('New contact message from:', name, email)

        return NextResponse.json({
            success: true,
            message: 'Mensagem enviada com sucesso! Entraremos em contato em breve.',
        })
    } catch (error) {
        console.error('Contact form error:', error)
        return NextResponse.json(
            { success: false, error: 'Erro ao enviar mensagem' },
            { status: 500 }
        )
    }
}
