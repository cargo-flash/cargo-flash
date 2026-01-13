import { notFound } from 'next/navigation'
import Link from 'next/link'
import {
    Package,
    ArrowLeft,
    Share2,
    Clock,
    MapPin,
    Shield,
    MessageCircle,
    RefreshCw,
    ChevronDown,
    Layers,
    Sparkles
} from 'lucide-react'
import { createServiceClient } from '@/lib/supabase/server'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { type DeliveryStatus, type Delivery, type DeliveryHistory } from '@/lib/types'

// Premium Design Components
import { ImmersiveHero } from '@/components/tracking/immersive-hero'
import { PremiumProgressSteps } from '@/components/tracking/premium-progress-steps'
import { GlassCard, GlassCardHeader, GlassCardContent } from '@/components/tracking/glass-card'
import { PremiumTimeline } from '@/components/tracking/premium-timeline'
import { FloatingActions } from '@/components/tracking/floating-actions'
import { ConfidenceMeters } from '@/components/tracking/confidence-meters'

// Existing Components
import { TrackingQRCode } from '@/components/tracking/tracking-qr-code'
import { ConfettiCelebration } from '@/components/tracking/confetti-celebration'
import { DeliveryRouteMap } from '@/components/tracking/delivery-route-map'

import { LogisticsInfoCard } from '@/components/tracking/logistics-info-card'
import { SupportCard } from '@/components/tracking/support-card'
import { RecipientCard } from '@/components/tracking/recipient-card'
import { ProofOfDeliveryCard } from '@/components/tracking/proof-of-delivery-card'
import { DriverInfoCard } from '@/components/tracking/driver-info-card'
import { SenderCard } from '@/components/tracking/sender-card'
import { NotificationPreferences } from '@/components/tracking/notification-preferences'
import { DeliveryAttemptsCard } from '@/components/tracking/delivery-attempts-card'
import { FeedbackCard } from '@/components/tracking/feedback-card'
import { ShareCard } from '@/components/tracking/share-card'
import { SecurityBadges } from '@/components/tracking/security-badges'
import { EstimatedArrivalCard } from '@/components/tracking/estimated-arrival-card'
import { CompanyStats } from '@/components/tracking/company-stats'
import { RescheduleCard } from '@/components/tracking/reschedule-card'
import { DeliveryAlerts } from '@/components/tracking/delivery-alerts'
import { LiveLocationTracker } from '@/components/tracking/live-location-tracker'
import { JourneyVisualizer } from '@/components/tracking/journey-visualizer'
import { DeliveryHistoryExport } from '@/components/tracking/delivery-history-export'
import { InsuranceInfoCard } from '@/components/tracking/insurance-info-card'
import { SpecialHandlingCard } from '@/components/tracking/special-handling-card'
import { DeliveryRatingsSummary } from '@/components/tracking/delivery-ratings-summary'
import { DeliveryPhotoGallery } from '@/components/tracking/delivery-photo-gallery'
import { DeliveryCountdown } from '@/components/tracking/delivery-countdown'

// New Premium Visual Components
import { LiveNotificationToast } from '@/components/tracking/live-notification-toast'
import { DeliveryVehicleTracker } from '@/components/tracking/delivery-vehicle-tracker'
import { AnimatedRoutePath } from '@/components/tracking/animated-route-path'

// Additional Premium Components
import { PulseIndicator, LiveStatusBar } from '@/components/tracking/pulse-indicator'
import { SuccessCelebration } from '@/components/tracking/success-celebration'
import { DeliveryGuaranteeBadge } from '@/components/tracking/delivery-guarantee-badge'
import { PackageConditionMonitor } from '@/components/tracking/package-condition-monitor'
import { SocialShareCard } from '@/components/tracking/social-share-card'
import { DeliveryDriverCard } from '@/components/tracking/delivery-driver-card'

// Ultra Premium Components
import { DeliverySignaturePad } from '@/components/tracking/delivery-signature-pad'
import { SatisfactionSurvey } from '@/components/tracking/satisfaction-survey'

// Auto-refresh component for real-time updates
import { AutoRefresh } from '@/components/tracking/auto-refresh'

// Distance Counter for immersive tracking
import { DistanceCounter } from '@/components/tracking/distance-counter'

interface PageProps {
    params: Promise<{ code: string }>
}

export default async function PremiumTrackingPage({ params }: PageProps) {
    const { code } = await params
    const supabase = await createServiceClient()

    // Fetch delivery data
    const { data: delivery } = await supabase
        .from('deliveries')
        .select('*')
        .eq('tracking_code', code.toUpperCase())
        .single()

    if (!delivery) {
        notFound()
    }

    // Fetch delivery history
    const { data: history } = await supabase
        .from('delivery_history')
        .select('*')
        .eq('delivery_id', delivery.id)
        .order('created_at', { ascending: false })

    const status = delivery.status as DeliveryStatus
    const isDelivered = status === 'delivered'
    const isFailed = status === 'failed'
    const isOutForDelivery = status === 'out_for_delivery'

    // Helper function to get default progress based on status
    const getDefaultProgress = (s: string): number => {
        switch (s) {
            case 'pending': return 0
            case 'collected': return 10
            case 'in_transit': return 50
            case 'out_for_delivery': return 95
            case 'delivered': return 100
            case 'failed': return 85
            default: return 0
        }
    }

    // Calculate REAL progress from latest history entry
    const latestHistory = history?.[0]
    const progressPercent = latestHistory?.progress_percent ?? getDefaultProgress(status)

    // Get real current coordinates from latest history
    const currentLat = latestHistory?.lat ?? delivery.current_lat
    const currentLng = latestHistory?.lng ?? delivery.current_lng
    const currentCity = latestHistory?.city
    const currentState = latestHistory?.state

    // Extract waypoints from history for the map route (in chronological order)
    // Filter entries with valid coordinates, excluding origin/destination, and deduplicate
    const originLat = delivery.origin_lat || -23.5505
    const originLng = delivery.origin_lng || -46.6333
    const destLat = delivery.destination_lat || 0
    const destLng = delivery.destination_lng || 0

    // Track seen coordinates to avoid duplicates
    const seenCoords = new Set<string>()
    // Add origin and destination to seen (to exclude them)
    seenCoords.add(`${originLat.toFixed(2)},${originLng.toFixed(2)}`)
    if (destLat !== 0 && destLng !== 0) {
        seenCoords.add(`${destLat.toFixed(2)},${destLng.toFixed(2)}`)
    }

    const historyWaypoints = history
        ? [...history]
            .reverse() // Chronological order (oldest first)
            .filter(h => {
                if (!h.lat || !h.lng) return false

                const coordKey = `${h.lat.toFixed(2)},${h.lng.toFixed(2)}`

                // Skip if we've already seen these coordinates
                if (seenCoords.has(coordKey)) return false

                // Add to seen set
                seenCoords.add(coordKey)
                return true
            })
            .map(h => ({
                lat: h.lat as number,
                lng: h.lng as number,
                label: h.city ? `${h.city}, ${h.state}` : h.location || 'Em trânsito'
            }))
        : []

    // WhatsApp share URL
    const whatsappText = encodeURIComponent(`🚚 Rastreie minha entrega:\n📦 Código: ${code.toUpperCase()}\n🔗 ${process.env.NEXT_PUBLIC_APP_URL || ''}/rastrear/${code}`)

    return (
        <div className="min-h-screen bg-slate-50 relative">
            {/* Confetti for delivered */}
            {isDelivered && <ConfettiCelebration />}

            {/* Success Celebration Modal */}
            <SuccessCelebration
                isDelivered={isDelivered}
                deliveredTo={delivery.delivered_to}
                deliveredAt={delivery.delivered_at}
            />

            {/* Floating Action Buttons */}
            <FloatingActions trackingCode={code} status={status} />

            {/* Auto-refresh every 60 seconds */}
            <AutoRefresh intervalSeconds={60} showIndicator={true} />



            {/* Live Notification Toast System */}
            <LiveNotificationToast trackingCode={code} status={status} />

            {/* Corporate Header */}
            <header className="sticky top-0 z-50 w-full border-b border-slate-200 bg-white shadow-sm">
                <div className="container mx-auto flex h-16 items-center justify-between px-4">
                    <Link href="/" className="flex items-center gap-3 group">
                        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#1e3a5f]">
                            <Package className="h-5 w-5 text-white" />
                        </div>
                        <div className="hidden sm:block">
                            <span className="text-lg font-bold text-slate-800">
                                Cargo Flash
                            </span>
                            <p className="text-[10px] text-slate-500 uppercase tracking-wider -mt-0.5">
                                Logística e Transportes
                            </p>
                        </div>
                    </Link>

                    <div className="flex items-center gap-2">
                        <TrackingQRCode code={code} />
                        <Button
                            variant="outline"
                            size="icon"
                            className="h-9 w-9 border-slate-200 hover:bg-slate-50 rounded-lg"
                            asChild
                        >
                            <a
                                href={`https://wa.me/?text=${whatsappText}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                title="Compartilhar no WhatsApp"
                            >
                                <MessageCircle className="h-4 w-4 text-slate-600" />
                            </a>
                        </Button>
                        <Button variant="outline" size="icon" title="Compartilhar" className="h-9 w-9 border-slate-200 hover:bg-slate-50 rounded-lg">
                            <Share2 className="h-4 w-4 text-slate-600" />
                        </Button>
                    </div>
                </div>
            </header>

            <main className="container mx-auto px-4 py-8 max-w-7xl">
                {/* Breadcrumb */}
                <div className="flex items-center gap-2 text-sm text-slate-500 mb-8">
                    <Link href="/" className="hover:text-blue-600 flex items-center gap-1.5 transition-colors">
                        <ArrowLeft className="h-4 w-4" />
                        <span className="hidden sm:inline">Rastrear outra entrega</span>
                        <span className="sm:hidden">Voltar</span>
                    </Link>
                    <span className="text-slate-300">|</span>
                    <span className="font-mono text-xs bg-slate-100 px-2 py-1 rounded-lg">{code.toUpperCase()}</span>
                </div>


                {/* HERO SECTION - THE MAIN ATTRACTION */}
                <section className="mb-10">
                    <ImmersiveHero
                        status={status}
                        trackingCode={code}
                        estimatedDelivery={delivery.estimated_delivery}
                        createdAt={delivery.created_at}
                        destinationCity={delivery.destination_city}
                        destinationState={delivery.destination_state}
                        originCity={delivery.origin_city || 'São Paulo'}
                        originState={delivery.origin_state || 'SP'}
                        recipientName={delivery.recipient_name}
                        currentLocation={currentCity ? `${currentCity}, ${currentState}` : delivery.current_location}
                        progressPercent={progressPercent}
                    />
                </section>



                {/* Delivery Alerts (conditional) */}
                {(isOutForDelivery || isFailed) && (
                    <section className="mb-8">
                        <DeliveryAlerts
                            status={status}
                            estimatedDelivery={delivery.estimated_delivery}
                            lastUpdate={delivery.updated_at}
                        />
                    </section>
                )}

                {/* Premium Progress Steps */}
                <section className="mb-10">
                    <PremiumProgressSteps status={status} />
                </section>

                {/* Distance Counter - Shows remaining distance to destination */}
                {!isDelivered && (
                    <section className="mb-10">
                        <DistanceCounter
                            currentLat={currentLat}
                            currentLng={currentLng}
                            destinationLat={delivery.destination_lat}
                            destinationLng={delivery.destination_lng}
                            originLat={delivery.origin_lat}
                            originLng={delivery.origin_lng}
                            progressPercent={progressPercent}
                            estimatedDelivery={delivery.estimated_delivery}
                            status={status}
                        />
                    </section>
                )}

                {/* Driver Info (when out for delivery) */}
                {isOutForDelivery && (delivery.driver_name || delivery.driver_phone) && (
                    <section className="mb-8">
                        <DriverInfoCard delivery={delivery as Delivery} />
                    </section>
                )}

                {/* Live Location Tracker (when out for delivery) */}
                {isOutForDelivery && (
                    <section className="mb-8">
                        <LiveLocationTracker
                            status={status}
                            currentLocation={delivery.current_location}
                            destination={`${delivery.destination_city}, ${delivery.destination_state}`}
                            estimatedArrival={delivery.estimated_delivery}
                        />
                    </section>
                )}

                {/* Delivery Vehicle Tracker (when out for delivery) */}
                {isOutForDelivery && (
                    <section className="mb-8">
                        <DeliveryVehicleTracker
                            status={status}
                            progress={75}
                            driverName={delivery.driver_name}
                            vehiclePlate={delivery.driver_vehicle_plate}
                            estimatedMinutes={25}
                        />
                    </section>
                )}

                {/* Delivery Driver Card (when out for delivery) */}
                {isOutForDelivery && (
                    <section className="mb-8">
                        <DeliveryDriverCard status={status} />
                    </section>
                )}

                {/* Delivery Attempts Warning (for failed) */}
                {isFailed && (
                    <section className="mb-8">
                        <DeliveryAttemptsCard history={history as DeliveryHistory[] || []} status={status} />
                    </section>
                )}

                {/* Reschedule Card (for failed deliveries) */}
                {isFailed && (
                    <section className="mb-8">
                        <RescheduleCard
                            trackingCode={code}
                            status={status}
                            currentAddress={delivery.destination_address}
                        />
                    </section>
                )}

                {/* Main Content Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                    {/* Left Column - 7 cols */}
                    <div className="lg:col-span-7 space-y-8">
                        {/* TODO: Re-enable map when Google Maps API is configured
                        <GlassCard animate>
                            <GlassCardHeader
                                icon={<MapPin className="w-5 h-5 text-white" />}
                                title="Rota da Entrega"
                                subtitle="Acompanhe em tempo real"
                                gradient="from-blue-500 to-blue-600"
                            />
                            <GlassCardContent className="p-0">
                                <div className="h-[400px] md:h-[450px]">
                                    <DeliveryRouteMap
                                        origin={{
                                            lat: delivery.origin_lat || -23.5505,
                                            lng: delivery.origin_lng || -46.6333,
                                            label: `${delivery.origin_city || 'São Paulo'}, ${delivery.origin_state || 'SP'}`
                                        }}
                                        destination={{
                                            lat: delivery.destination_lat || -21.1767,
                                            lng: delivery.destination_lng || -47.8208,
                                            label: `${delivery.destination_city}, ${delivery.destination_state}`
                                        }}
                                        currentLocation={(status === 'in_transit' || status === 'out_for_delivery') && currentLat && currentLng ? {
                                            lat: currentLat,
                                            lng: currentLng,
                                            label: currentCity ? `${currentCity}, ${currentState}` : delivery.current_location || 'Em trânsito'
                                        } : undefined}
                                        status={status}
                                        waypoints={historyWaypoints}
                                    />
                                </div>
                            </GlassCardContent>
                        </GlassCard>
                        */}

                        {/* Timeline Card */}
                        <GlassCard animate>
                            <GlassCardHeader
                                icon={<Clock className="w-5 h-5 text-white" />}
                                title="Histórico de Movimentações"
                                subtitle="Todas as atualizações"
                                gradient="from-blue-600 to-blue-700"
                            />
                            <GlassCardContent>
                                <PremiumTimeline history={history || []} status={status} />
                            </GlassCardContent>
                        </GlassCard>

                        {/* Sender Card */}
                        <SenderCard delivery={delivery as Delivery} />
                    </div>

                    {/* Right Column - 5 cols */}
                    <div className="lg:col-span-5 space-y-8">
                        {/* Proof of Delivery (if delivered) */}
                        {isDelivered && (
                            <ProofOfDeliveryCard
                                deliveredTo={delivery.delivered_to}
                                deliveredAt={delivery.delivered_at}
                                proofUrl={delivery.proof_of_delivery_url}
                            />
                        )}

                        {/* Estimated Arrival (when out for delivery) */}
                        {isOutForDelivery && (
                            <EstimatedArrivalCard
                                estimatedDelivery={delivery.estimated_delivery}
                                status={status}
                            />
                        )}

                        {/* Logistics Info */}
                        <LogisticsInfoCard delivery={delivery as Delivery} />

                        {/* Recipient Card */}
                        <RecipientCard delivery={delivery as Delivery} />





                        {/* Share Card */}
                        <ShareCard trackingCode={code} />

                        {/* Feedback Card (only for delivered/failed) */}
                        <FeedbackCard trackingCode={code} status={status} />

                        {/* Insurance Info */}
                        <InsuranceInfoCard
                            trackingCode={code}
                            declaredValue={delivery.declared_value}
                            status={status}
                        />


                    </div>
                </div>




                {/* Security Badges */}
                <section className="mt-8">
                    <SecurityBadges />
                </section>

                {/* Company Info */}
                <section className="mt-12 mb-8">
                    <div className="bg-slate-50 border border-slate-200 rounded-lg p-6">
                        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 rounded-lg bg-[#1e3a5f] flex items-center justify-center">
                                    <Package className="w-6 h-6 text-white" />
                                </div>
                                <div>
                                    <p className="font-bold text-slate-800">Cargo Flash Logística Ltda</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-6 text-sm text-slate-500">
                                <span>Rastreio: {code.toUpperCase()}</span>
                            </div>
                        </div>
                    </div>
                </section>
            </main>

            {/* Footer */}
            <footer className="border-t border-slate-200 bg-white">
                <div className="container mx-auto px-4 py-8">
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 text-sm text-slate-500">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-lg bg-[#1e3a5f] flex items-center justify-center">
                                <Package className="h-5 w-5 text-white" />
                            </div>
                            <div>
                                <span className="font-semibold text-slate-700">Cargo Flash Logística</span>
                                <p className="text-xs text-slate-400">&copy; {new Date().getFullYear()} Todos os direitos reservados</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-6 text-sm">
                            <a href="/termos" className="hover:text-[#1e3a5f] transition-colors">Termos</a>
                            <a href="/privacidade" className="hover:text-[#1e3a5f] transition-colors">Privacidade</a>
                            <a href="/contato" className="hover:text-[#1e3a5f] transition-colors">Contato</a>
                        </div>
                    </div>
                </div>
            </footer>
        </div>
    )
}
