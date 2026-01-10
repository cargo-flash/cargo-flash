// Email templates for delivery notifications
// These can be used with any email service (SendGrid, Nodemailer, etc.)

export interface EmailTemplateData {
    tracking_code: string
    recipient_name: string
    sender_name?: string
    status: string
    status_label: string
    current_location?: string
    estimated_delivery?: string
    delivered_at?: string
    tracking_url: string
}

export const emailTemplates = {
    // Email when order is created
    orderCreated: (data: EmailTemplateData) => ({
        subject: `Seu pedido foi recebido - Rastreio: ${data.tracking_code}`,
        html: `
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Pedido Recebido</title>
</head>
<body style="font-family: 'Segoe UI', Arial, sans-serif; margin: 0; padding: 0; background-color: #f4f4f5;">
    <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="background: linear-gradient(135deg, #2563eb 0%, #4f46e5 100%); border-radius: 16px 16px 0 0; padding: 30px; text-align: center;">
            <h1 style="color: white; margin: 0; font-size: 24px;">📦 Pedido Recebido!</h1>
        </div>
        <div style="background: white; padding: 30px; border-radius: 0 0 16px 16px; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
            <p style="color: #374151; font-size: 16px; margin-bottom: 20px;">
                Olá <strong>${data.recipient_name}</strong>,
            </p>
            <p style="color: #6b7280; font-size: 14px;">
                Seu pedido foi recebido e está sendo preparado para envio.
            </p>
            
            <div style="background: #f9fafb; border-radius: 12px; padding: 20px; margin: 20px 0;">
                <p style="margin: 0 0 10px 0; color: #6b7280; font-size: 12px; text-transform: uppercase;">Código de Rastreio</p>
                <p style="margin: 0; color: #111827; font-size: 24px; font-weight: bold; letter-spacing: 2px;">
                    ${data.tracking_code}
                </p>
            </div>
            
            ${data.estimated_delivery ? `
            <p style="color: #6b7280; font-size: 14px; margin-bottom: 10px;">
                📅 Previsão de entrega: <strong style="color: #111827;">${data.estimated_delivery}</strong>
            </p>
            ` : ''}
            
            <a href="${data.tracking_url}" style="display: inline-block; background: linear-gradient(135deg, #2563eb 0%, #4f46e5 100%); color: white; text-decoration: none; padding: 14px 28px; border-radius: 8px; font-weight: 600; margin-top: 20px;">
                Rastrear Pedido
            </a>
            
            <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 30px 0;">
            
            <p style="color: #9ca3af; font-size: 12px; text-align: center; margin: 0;">
                Este é um email automático. Não responda a esta mensagem.<br>
                © ${new Date().getFullYear()} Cargo Flash. Todos os direitos reservados.
            </p>
        </div>
    </div>
</body>
</html>
        `.trim(),
        text: `
Olá ${data.recipient_name},

Seu pedido foi recebido e está sendo preparado para envio.

Código de Rastreio: ${data.tracking_code}
${data.estimated_delivery ? `Previsão de entrega: ${data.estimated_delivery}` : ''}

Rastreie seu pedido em: ${data.tracking_url}

© ${new Date().getFullYear()} Cargo Flash
        `.trim()
    }),

    // Email when status changes
    statusUpdate: (data: EmailTemplateData) => ({
        subject: `Atualização do seu pedido - ${data.status_label}`,
        html: `
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Atualização de Status</title>
</head>
<body style="font-family: 'Segoe UI', Arial, sans-serif; margin: 0; padding: 0; background-color: #f4f4f5;">
    <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="background: linear-gradient(135deg, #059669 0%, #10b981 100%); border-radius: 16px 16px 0 0; padding: 30px; text-align: center;">
            <h1 style="color: white; margin: 0; font-size: 24px;">🚚 Atualização de Entrega</h1>
        </div>
        <div style="background: white; padding: 30px; border-radius: 0 0 16px 16px; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
            <p style="color: #374151; font-size: 16px; margin-bottom: 20px;">
                Olá <strong>${data.recipient_name}</strong>,
            </p>
            
            <div style="background: #ecfdf5; border-left: 4px solid #10b981; padding: 15px; border-radius: 0 8px 8px 0; margin: 20px 0;">
                <p style="margin: 0; color: #059669; font-weight: 600; font-size: 18px;">
                    ${data.status_label}
                </p>
                ${data.current_location ? `
                <p style="margin: 5px 0 0 0; color: #6b7280; font-size: 14px;">
                    📍 ${data.current_location}
                </p>
                ` : ''}
            </div>
            
            <div style="background: #f9fafb; border-radius: 12px; padding: 20px; margin: 20px 0;">
                <p style="margin: 0 0 10px 0; color: #6b7280; font-size: 12px; text-transform: uppercase;">Código de Rastreio</p>
                <p style="margin: 0; color: #111827; font-size: 20px; font-weight: bold; letter-spacing: 2px;">
                    ${data.tracking_code}
                </p>
            </div>
            
            <a href="${data.tracking_url}" style="display: inline-block; background: linear-gradient(135deg, #059669 0%, #10b981 100%); color: white; text-decoration: none; padding: 14px 28px; border-radius: 8px; font-weight: 600;">
                Ver Detalhes
            </a>
            
            <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 30px 0;">
            
            <p style="color: #9ca3af; font-size: 12px; text-align: center; margin: 0;">
                © ${new Date().getFullYear()} Cargo Flash. Todos os direitos reservados.
            </p>
        </div>
    </div>
</body>
</html>
        `.trim(),
        text: `
Olá ${data.recipient_name},

Atualização do seu pedido:
Status: ${data.status_label}
${data.current_location ? `Local: ${data.current_location}` : ''}

Código de Rastreio: ${data.tracking_code}

Acompanhe em: ${data.tracking_url}

© ${new Date().getFullYear()} Cargo Flash
        `.trim()
    }),

    // Email when delivered
    delivered: (data: EmailTemplateData) => ({
        subject: `Seu pedido foi entregue! 🎉 - ${data.tracking_code}`,
        html: `
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Pedido Entregue</title>
</head>
<body style="font-family: 'Segoe UI', Arial, sans-serif; margin: 0; padding: 0; background-color: #f4f4f5;">
    <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="background: linear-gradient(135deg, #16a34a 0%, #22c55e 100%); border-radius: 16px 16px 0 0; padding: 30px; text-align: center;">
            <h1 style="color: white; margin: 0; font-size: 28px;">🎉 Entregue!</h1>
        </div>
        <div style="background: white; padding: 30px; border-radius: 0 0 16px 16px; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
            <p style="color: #374151; font-size: 16px; margin-bottom: 20px;">
                Olá <strong>${data.recipient_name}</strong>,
            </p>
            <p style="color: #6b7280; font-size: 14px;">
                Ótimas notícias! Seu pedido foi entregue com sucesso.
            </p>
            
            <div style="background: #f0fdf4; border-radius: 12px; padding: 20px; margin: 20px 0; text-align: center;">
                <p style="margin: 0; color: #16a34a; font-size: 48px;">✓</p>
                <p style="margin: 10px 0 0 0; color: #166534; font-weight: 600; font-size: 18px;">
                    Entrega Confirmada
                </p>
                ${data.delivered_at ? `
                <p style="margin: 5px 0 0 0; color: #6b7280; font-size: 14px;">
                    ${data.delivered_at}
                </p>
                ` : ''}
            </div>
            
            <div style="background: #f9fafb; border-radius: 12px; padding: 20px; margin: 20px 0;">
                <p style="margin: 0 0 10px 0; color: #6b7280; font-size: 12px; text-transform: uppercase;">Código de Rastreio</p>
                <p style="margin: 0; color: #111827; font-size: 20px; font-weight: bold; letter-spacing: 2px;">
                    ${data.tracking_code}
                </p>
            </div>
            
            <p style="color: #6b7280; font-size: 14px;">
                Obrigado por utilizar a Cargo Flash! 💚
            </p>
            
            <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 30px 0;">
            
            <p style="color: #9ca3af; font-size: 12px; text-align: center; margin: 0;">
                © ${new Date().getFullYear()} Cargo Flash. Todos os direitos reservados.
            </p>
        </div>
    </div>
</body>
</html>
        `.trim(),
        text: `
Olá ${data.recipient_name},

Ótimas notícias! Seu pedido foi entregue com sucesso.

Código de Rastreio: ${data.tracking_code}
${data.delivered_at ? `Data/Hora: ${data.delivered_at}` : ''}

Obrigado por utilizar a Cargo Flash!

© ${new Date().getFullYear()} Cargo Flash
        `.trim()
    }),
}

// Helper to get appropriate template based on status
export function getEmailTemplate(status: string, data: EmailTemplateData) {
    if (status === 'delivered') {
        return emailTemplates.delivered(data)
    }
    if (status === 'pending') {
        return emailTemplates.orderCreated(data)
    }
    return emailTemplates.statusUpdate(data)
}
