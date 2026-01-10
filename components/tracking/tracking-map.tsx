'use client'

import { useEffect, useRef, useState } from 'react'
import type { DeliveryStatus } from '@/lib/types'

interface Location {
    lat: number
    lng: number
    label: string
}

interface TrackingMapProps {
    origin: Location
    destination: Location
    currentLocation?: Location
    status: DeliveryStatus
}

export function TrackingMap({ origin, destination, currentLocation, status }: TrackingMapProps) {
    const mapContainerRef = useRef<HTMLDivElement>(null)
    const mapInstanceRef = useRef<L.Map | null>(null)
    const [isLoading, setIsLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        // Don't run on server
        if (typeof window === 'undefined') return

        let isMounted = true

        const initMap = async () => {
            try {
                // Dynamic import Leaflet only on client
                const L = (await import('leaflet')).default

                // Wait for container to be ready
                if (!mapContainerRef.current || !isMounted) return

                // Check if there's already a map on this container and remove it
                const container = mapContainerRef.current

                // Check Leaflet's internal state on the container
                if ((container as HTMLElement & { _leaflet_id?: number })._leaflet_id) {
                    // Container already has a map, skip initialization
                    setIsLoading(false)
                    return
                }

                // If we have a previous instance, remove it
                if (mapInstanceRef.current) {
                    mapInstanceRef.current.remove()
                    mapInstanceRef.current = null
                }

                // Calculate center point
                const centerLat = (origin.lat + destination.lat) / 2
                const centerLng = (origin.lng + destination.lng) / 2

                // Calculate zoom based on distance
                const latDiff = Math.abs(origin.lat - destination.lat)
                const lngDiff = Math.abs(origin.lng - destination.lng)
                const maxDiff = Math.max(latDiff, lngDiff)

                let zoom = 6
                if (maxDiff < 1) zoom = 10
                else if (maxDiff < 3) zoom = 8
                else if (maxDiff < 6) zoom = 6
                else zoom = 5

                // Create map instance
                const map = L.map(container, {
                    center: [centerLat, centerLng],
                    zoom: zoom,
                    scrollWheelZoom: false,
                })

                mapInstanceRef.current = map

                // Add tile layer
                L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
                }).addTo(map)

                // Status color
                const getStatusColor = () => {
                    switch (status) {
                        case 'delivered':
                            return '#10b981'
                        case 'failed':
                            return '#ef4444'
                        case 'out_for_delivery':
                            return '#8b5cf6'
                        default:
                            return '#3b82f6'
                    }
                }

                // Route points
                const routePoints: L.LatLngExpression[] = [
                    [origin.lat, origin.lng],
                ]

                if (currentLocation && status !== 'pending' && status !== 'delivered') {
                    routePoints.push([currentLocation.lat, currentLocation.lng])
                }

                routePoints.push([destination.lat, destination.lng])

                // Draw route line
                L.polyline(routePoints, {
                    color: getStatusColor(),
                    weight: 4,
                    opacity: 0.7,
                    dashArray: status === 'in_transit' ? '10, 10' : undefined,
                }).addTo(map)

                // Custom icon
                const defaultIcon = L.icon({
                    iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
                    iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
                    shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
                    iconSize: [25, 41],
                    iconAnchor: [12, 41],
                    popupAnchor: [1, -34],
                    shadowSize: [41, 41],
                })

                // Origin marker
                L.marker([origin.lat, origin.lng], { icon: defaultIcon })
                    .addTo(map)
                    .bindPopup(`<div style="text-align: center;"><b>📦 Origem</b><br/>${origin.label}</div>`)

                // Current location marker
                if (currentLocation && status !== 'pending' && status !== 'delivered') {
                    L.marker([currentLocation.lat, currentLocation.lng], { icon: defaultIcon })
                        .addTo(map)
                        .bindPopup(`<div style="text-align: center;"><b>🚚 Posição Atual</b><br/>${currentLocation.label}</div>`)
                }

                // Destination marker
                const destLabel = status === 'delivered' ? '✅ Entregue' : '📍 Destino'
                L.marker([destination.lat, destination.lng], { icon: defaultIcon })
                    .addTo(map)
                    .bindPopup(`<div style="text-align: center;"><b>${destLabel}</b><br/>${destination.label}</div>`)

                // Fit bounds to show all points
                const bounds = L.latLngBounds(routePoints)
                map.fitBounds(bounds, { padding: [50, 50] })

                if (isMounted) {
                    setIsLoading(false)
                }
            } catch (err) {
                console.error('Map initialization error:', err)
                if (isMounted) {
                    setError('Erro ao carregar mapa')
                    setIsLoading(false)
                }
            }
        }

        initMap()

        // Cleanup function
        return () => {
            isMounted = false
            if (mapInstanceRef.current) {
                mapInstanceRef.current.remove()
                mapInstanceRef.current = null
            }
        }
    }, [origin, destination, currentLocation, status])

    return (
        <div className="h-[400px] w-full relative">
            <link
                rel="stylesheet"
                href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css"
                integrity="sha256-p4NxAoJBhIIN+hmNHrzRCf9tD/miZyoHS5obTRR9BMY="
                crossOrigin=""
            />

            {isLoading && (
                <div className="absolute inset-0 bg-slate-100 animate-pulse flex items-center justify-center z-10">
                    <p className="text-slate-500">Carregando mapa...</p>
                </div>
            )}

            {error && (
                <div className="absolute inset-0 bg-slate-100 flex items-center justify-center z-10">
                    <p className="text-red-500">{error}</p>
                </div>
            )}

            <div
                ref={mapContainerRef}
                className="h-full w-full rounded-b-xl"
                style={{ zIndex: 1 }}
            />
        </div>
    )
}
