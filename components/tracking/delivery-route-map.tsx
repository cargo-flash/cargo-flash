'use client'

import { useEffect, useRef, useState } from 'react'
import type { DeliveryStatus } from '@/lib/types'

interface Location {
    lat: number
    lng: number
    label: string
}

interface DeliveryRouteMapProps {
    origin: Location
    destination: Location
    currentLocation?: Location
    status: DeliveryStatus
    waypoints?: Array<{ lat: number; lng: number; label: string }>
}

export function DeliveryRouteMap({ origin, destination, currentLocation, status, waypoints = [] }: DeliveryRouteMapProps) {
    const mapContainerRef = useRef<HTMLDivElement>(null)
    const mapInstanceRef = useRef<L.Map | null>(null)
    const [isLoading, setIsLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)
    const initAttempted = useRef(false)

    useEffect(() => {
        // Prevent multiple initialization attempts
        if (initAttempted.current) return
        if (typeof window === 'undefined') return

        let isMounted = true
        initAttempted.current = true

        const initMap = async () => {
            try {
                const L = (await import('leaflet')).default

                // Wait for next tick to ensure container is rendered
                await new Promise(resolve => setTimeout(resolve, 100))

                if (!mapContainerRef.current || !isMounted) return

                const container = mapContainerRef.current as HTMLElement & { _leaflet_id?: number }

                // If already initialized, just update loading state
                if (container._leaflet_id) {
                    setIsLoading(false)
                    return
                }

                // Clean up any previous instance
                if (mapInstanceRef.current) {
                    try {
                        mapInstanceRef.current.remove()
                    } catch {
                        // Ignore errors on cleanup
                    }
                    mapInstanceRef.current = null
                }

                // Calculate bounds
                const allPoints: [number, number][] = [
                    [origin.lat, origin.lng],
                    [destination.lat, destination.lng],
                ]

                if (currentLocation) {
                    allPoints.push([currentLocation.lat, currentLocation.lng])
                }

                waypoints.forEach(wp => {
                    allPoints.push([wp.lat, wp.lng])
                })

                // Create map
                const map = L.map(container, {
                    scrollWheelZoom: false,
                    zoomControl: true,
                })

                mapInstanceRef.current = map

                // Add dark tile layer for premium look
                L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
                    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="https://carto.com/attributions">CARTO</a>',
                    subdomains: 'abcd',
                    maxZoom: 20
                }).addTo(map)

                // Status colors
                const statusColors: Record<string, string> = {
                    pending: '#f59e0b',
                    collected: '#3b82f6',
                    in_transit: '#8b5cf6',
                    out_for_delivery: '#6366f1',
                    delivered: '#10b981',
                    failed: '#ef4444',
                    returned: '#6b7280',
                }

                const lineColor = statusColors[status] || '#3b82f6'

                // Custom icons
                const createIcon = (color: string, emoji: string) => {
                    return L.divIcon({
                        className: 'custom-marker',
                        html: `
                            <div style="
                                width: 40px;
                                height: 40px;
                                background: ${color};
                                border-radius: 50% 50% 50% 0;
                                transform: rotate(-45deg);
                                display: flex;
                                align-items: center;
                                justify-content: center;
                                box-shadow: 0 4px 12px ${color}60;
                                border: 3px solid white;
                            ">
                                <span style="transform: rotate(45deg); font-size: 18px;">${emoji}</span>
                            </div>
                        `,
                        iconSize: [40, 40],
                        iconAnchor: [20, 40],
                        popupAnchor: [0, -40],
                    })
                }

                const pulsingIcon = (color: string, emoji: string) => {
                    return L.divIcon({
                        className: 'custom-marker-pulsing',
                        html: `
                            <div style="position: relative; width: 50px; height: 50px;">
                                <div style="
                                    position: absolute;
                                    width: 50px;
                                    height: 50px;
                                    background: ${color}40;
                                    border-radius: 50%;
                                    animation: pulse 2s ease-out infinite;
                                "></div>
                                <div style="
                                    position: absolute;
                                    top: 5px;
                                    left: 5px;
                                    width: 40px;
                                    height: 40px;
                                    background: ${color};
                                    border-radius: 50%;
                                    display: flex;
                                    align-items: center;
                                    justify-content: center;
                                    box-shadow: 0 4px 20px ${color}80;
                                    border: 3px solid white;
                                ">
                                    <span style="font-size: 20px;">${emoji}</span>
                                </div>
                            </div>
                            <style>
                                @keyframes pulse {
                                    0% { transform: scale(1); opacity: 1; }
                                    100% { transform: scale(2); opacity: 0; }
                                }
                            </style>
                        `,
                        iconSize: [50, 50],
                        iconAnchor: [25, 25],
                        popupAnchor: [0, -25],
                    })
                }

                // Route line - build path through all waypoints
                // First, create the full planned route: Origin -> Waypoints -> Destination
                const fullRoutePath: L.LatLngExpression[] = [[origin.lat, origin.lng]]

                // Add all waypoints in order (they come from history, already in chronological order)
                waypoints.forEach(wp => {
                    fullRoutePath.push([wp.lat, wp.lng])
                })

                fullRoutePath.push([destination.lat, destination.lng])

                // Draw dashed line for the FULL planned route (background)
                L.polyline(fullRoutePath, {
                    color: '#e2e8f0',
                    weight: 4,
                    opacity: 1,
                    dashArray: '10, 10',
                }).addTo(map)

                // Draw solid line for completed path (follows waypoints from history)
                if (waypoints.length > 0 && status !== 'pending') {
                    // Completed path: Origin -> all waypoints so far
                    const completedPath: L.LatLngExpression[] = [[origin.lat, origin.lng]]

                    waypoints.forEach(wp => {
                        completedPath.push([wp.lat, wp.lng])
                    })

                    L.polyline(completedPath, {
                        color: lineColor,
                        weight: 5,
                        opacity: 0.9,
                    }).addTo(map)
                } else if (currentLocation && status !== 'pending') {
                    // Fallback: if no waypoints, just draw to current location
                    const completedPath: L.LatLngExpression[] = [
                        [origin.lat, origin.lng],
                        [currentLocation.lat, currentLocation.lng],
                    ]

                    L.polyline(completedPath, {
                        color: lineColor,
                        weight: 5,
                        opacity: 0.9,
                    }).addTo(map)
                }

                // Origin marker
                L.marker([origin.lat, origin.lng], { icon: createIcon('#3b82f6', '📦') })
                    .addTo(map)
                    .bindPopup(`
                        <div style="text-align: center; min-width: 150px;">
                            <p style="font-weight: 600; color: #1e40af; margin: 0 0 4px 0;">📦 Origem</p>
                            <p style="color: #64748b; margin: 0; font-size: 13px;">${origin.label}</p>
                        </div>
                    `)

                // Current location marker (pulsing)
                if (currentLocation && status !== 'pending' && status !== 'delivered') {
                    L.marker([currentLocation.lat, currentLocation.lng], { icon: pulsingIcon(lineColor, '🚚') })
                        .addTo(map)
                        .bindPopup(`
                            <div style="text-align: center; min-width: 150px;">
                                <p style="font-weight: 600; color: #7c3aed; margin: 0 0 4px 0;">🚚 Em Trânsito</p>
                                <p style="color: #64748b; margin: 0; font-size: 13px;">${currentLocation.label}</p>
                            </div>
                        `)
                        .openPopup()
                }

                // Destination marker
                const destEmoji = status === 'delivered' ? '✅' : '📍'
                const destColor = status === 'delivered' ? '#10b981' : '#6366f1'

                L.marker([destination.lat, destination.lng], { icon: createIcon(destColor, destEmoji) })
                    .addTo(map)
                    .bindPopup(`
                        <div style="text-align: center; min-width: 150px;">
                            <p style="font-weight: 600; color: ${destColor}; margin: 0 0 4px 0;">
                                ${status === 'delivered' ? '✅ Entregue!' : '📍 Destino'}
                            </p>
                            <p style="color: #64748b; margin: 0; font-size: 13px;">${destination.label}</p>
                        </div>
                    `)

                // Waypoint markers (intermediate stops from history)
                waypoints.forEach((wp, index) => {
                    // Small circle marker for waypoints
                    L.circleMarker([wp.lat, wp.lng], {
                        radius: 8,
                        fillColor: lineColor,
                        color: '#ffffff',
                        weight: 2,
                        opacity: 1,
                        fillOpacity: 0.9,
                    })
                        .addTo(map)
                        .bindPopup(`
                            <div style="text-align: center; min-width: 120px;">
                                <p style="font-weight: 600; color: ${lineColor}; margin: 0 0 4px 0;">
                                    📍 Parada ${index + 1}
                                </p>
                                <p style="color: #64748b; margin: 0; font-size: 12px;">${wp.label}</p>
                            </div>
                        `)
                })

                // Fit bounds
                const bounds = L.latLngBounds(allPoints)
                map.fitBounds(bounds, { padding: [60, 60] })

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

        return () => {
            isMounted = false
            if (mapInstanceRef.current) {
                try {
                    mapInstanceRef.current.remove()
                } catch {
                    // Ignore errors
                }
                mapInstanceRef.current = null
            }
        }
    }, []) // Empty dependency - only run once

    return (
        <div className="h-full w-full relative min-h-[400px] rounded-xl overflow-hidden">
            <link
                rel="stylesheet"
                href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css"
                integrity="sha256-p4NxAoJBhIIN+hmNHrzRCf9tD/miZyoHS5obTRR9BMY="
                crossOrigin=""
            />

            {isLoading && (
                <div className="absolute inset-0 bg-gradient-to-br from-slate-100 to-slate-200 animate-pulse flex flex-col items-center justify-center z-10">
                    <div className="w-12 h-12 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mb-4"></div>
                    <p className="text-slate-500 font-medium">Carregando mapa...</p>
                </div>
            )}

            {error && (
                <div className="absolute inset-0 bg-slate-100 flex flex-col items-center justify-center z-10">
                    <div className="text-4xl mb-4">🗺️</div>
                    <p className="text-red-500 font-medium">{error}</p>
                </div>
            )}

            <div
                ref={mapContainerRef}
                className="h-full w-full"
                style={{ minHeight: '400px' }}
            />
        </div>
    )
}
