import { redirect } from 'next/navigation'
import { getSession } from '@/lib/auth'
import { AdminSidebar } from '@/components/admin/sidebar'
import { AdminWrapper } from '@/components/admin/admin-wrapper'
import '@/app/hacker-theme.css'

export default async function AdminLayout({
    children,
}: {
    children: React.ReactNode
}) {
    const session = await getSession()

    // Redirect to login if not authenticated
    if (!session) {
        redirect('/login')
    }

    return (
        <div className="min-h-screen bg-[#0a0a0a] matrix-theme matrix-bg-enhanced">
            <AdminWrapper>
                {/* Sidebar */}
                <AdminSidebar
                    user={{
                        full_name: session.full_name,
                        email: session.email,
                        role: session.role,
                    }}
                />

                {/* Main Content */}
                <main className="lg:pl-64 min-h-screen relative z-20">
                    <div className="p-6 lg:p-8">
                        {children}
                    </div>
                </main>
            </AdminWrapper>
        </div>
    )
}
