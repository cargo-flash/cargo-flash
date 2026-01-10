import { NextResponse } from 'next/server'
import { createServiceClient } from '@/lib/supabase/server'
import { validateAdminSession } from '@/lib/admin-auth'
import { formatDateTime } from '@/lib/utils'
import { STATUS_LABELS, type DeliveryStatus } from '@/lib/types'

export async function GET(request: Request) {
    try {
        const auth = await validateAdminSession()
        if (!auth.success || !auth.session) {
            return auth.response || NextResponse.json({ success: false, error: 'Não autorizado' }, { status: 401 })
        }

        const { searchParams } = new URL(request.url)
        const format = searchParams.get('format') || 'csv'
        const status = searchParams.get('status')
        const startDate = searchParams.get('start_date')
        const endDate = searchParams.get('end_date')

        const supabase = await createServiceClient()

        let query = supabase
            .from('deliveries')
            .select('*')
            .order('created_at', { ascending: false })

        if (status) {
            query = query.eq('status', status)
        }

        if (startDate) {
            query = query.gte('created_at', startDate)
        }

        if (endDate) {
            query = query.lte('created_at', endDate)
        }

        const { data: deliveries, error } = await query

        if (error) {
            console.error('Export error:', error)
            return NextResponse.json({ success: false, error: 'Erro ao exportar' }, { status: 500 })
        }

        if (!deliveries || deliveries.length === 0) {
            return NextResponse.json({ success: false, error: 'Nenhuma entrega encontrada' }, { status: 404 })
        }

        // Generate CSV
        const headers = [
            'Código',
            'Status',
            'Destinatário',
            'Telefone',
            'Email',
            'Endereço',
            'Cidade',
            'Estado',
            'CEP',
            'Remetente',
            'Descrição',
            'Peso (kg)',
            'Motorista',
            'Previsão',
            'Entregue em',
            'Criado em',
        ]

        const rows = deliveries.map((d) => [
            d.tracking_code,
            STATUS_LABELS[d.status as DeliveryStatus] || d.status,
            d.recipient_name,
            d.recipient_phone || '',
            d.recipient_email || '',
            d.destination_address,
            d.destination_city,
            d.destination_state,
            d.destination_zip || '',
            d.sender_name || '',
            d.package_description || '',
            d.package_weight || '',
            d.driver_name || '',
            d.estimated_delivery || '',
            d.delivered_at ? formatDateTime(d.delivered_at) : '',
            formatDateTime(d.created_at),
        ])

        // Escape CSV values
        const escapeCSV = (value: string | number) => {
            const str = String(value)
            if (str.includes(',') || str.includes('"') || str.includes('\n')) {
                return `"${str.replace(/"/g, '""')}"`
            }
            return str
        }

        const csvContent = [
            headers.join(','),
            ...rows.map((row) => row.map(escapeCSV).join(',')),
        ].join('\n')

        // Add BOM for Excel compatibility
        const bom = '\uFEFF'
        const csvWithBom = bom + csvContent

        // Log activity
        await supabase.from('admin_activity_logs').insert({
            admin_id: auth.session.id,
            admin_name: auth.session.full_name,
            action: 'export_deliveries',
            details: { count: deliveries.length, format },
        })

        return new NextResponse(csvWithBom, {
            status: 200,
            headers: {
                'Content-Type': 'text/csv; charset=utf-8',
                'Content-Disposition': `attachment; filename="entregas_${new Date().toISOString().split('T')[0]}.csv"`,
            },
        })
    } catch (error) {
        console.error('Export error:', error)
        return NextResponse.json({ success: false, error: 'Erro interno' }, { status: 500 })
    }
}
