import { addDays, isWeekend } from 'date-fns'
import {
    findOrCreateCity,
    calculateDistance,
} from './brazilian-routes'
import {
    calculateDeliveryRoute,
    type ScheduledUpdate
} from './route-waypoints'
import type { SimulationConfig, Delivery } from './types'

interface ScheduleEventInput {
    delivery_id: string
    scheduled_for: Date
    event_type: string
    new_status: string | null
    location: string
    city: string
    state: string
    lat: number
    lng: number
    description: string
    progress_percent?: number
    distance_traveled?: number
}

/**
 * Generates delivery events based on realistic route with 2 daily updates
 * Uses the new route-waypoints service for real Brazilian highway routes
 */
export function generateDeliveryEvents(
    delivery: Delivery,
    config: SimulationConfig
): ScheduleEventInput[] {
    try {
        // Validate delivery has required fields
        if (!delivery.destination_city || !delivery.destination_state) {
            console.error('Missing destination fields:', {
                tracking_code: delivery.tracking_code,
                destination_city: delivery.destination_city,
                destination_state: delivery.destination_state
            })
            return []
        }

        // Ensure we have valid config values with defaults
        const originCity = config.origin_city || 'São Paulo'
        const originState = config.origin_state || 'SP'
        const originLat = config.origin_lat ?? -23.5505
        const originLng = config.origin_lng ?? -46.6333
        const minDays = config.min_delivery_days ?? 15
        const maxDays = config.max_delivery_days ?? 19

        console.log(`Generating route: ${originCity}/${originState} -> ${delivery.destination_city}/${delivery.destination_state}`)

        // Calculate route with all waypoints and daily updates
        const route = calculateDeliveryRoute(
            originCity,
            originState,
            originLat,
            originLng,
            delivery.destination_city,
            delivery.destination_state,
            delivery.destination_lat ?? undefined,
            delivery.destination_lng ?? undefined,
            minDays,
            maxDays,
            delivery.tracking_code  // Pass tracking code for deterministic scheduling
        )

        console.log(`Route calculated: ${route.waypoints.length} waypoints, ${route.dailyUpdates.length} updates`)

        // Convert scheduled updates to event inputs
        const events: ScheduleEventInput[] = route.dailyUpdates.map((update: ScheduledUpdate) => ({
            delivery_id: delivery.id,
            scheduled_for: update.scheduledFor,
            event_type: update.eventType,
            new_status: update.newStatus,
            location: update.waypoint.description || `${update.waypoint.city}, ${update.waypoint.state}`,
            city: update.waypoint.city,
            state: update.waypoint.state,
            lat: update.waypoint.lat,
            lng: update.waypoint.lng,
            description: update.description,
            progress_percent: update.progressPercent,
            distance_traveled: update.waypoint.distanceFromOrigin
        }))

        return events
    } catch (error) {
        console.error('Error generating delivery events:', error)
        console.error('Delivery:', { id: delivery.id, tracking_code: delivery.tracking_code })
        console.error('Config:', { origin_city: config.origin_city, origin_state: config.origin_state })
        // Return empty array on error to allow delivery creation to succeed
        return []
    }
}

/**
 * Estimate delivery date based on distance
 */
export function estimateDeliveryDate(
    config: SimulationConfig,
    destinationCity: string,
    destinationState: string
): Date {
    const originCity = findOrCreateCity(config.origin_city, config.origin_state)
    const destCity = findOrCreateCity(destinationCity, destinationState)

    const distance = calculateDistance(originCity, destCity)
    const baseDays = Math.ceil(distance / 200) // ~200km per day

    const deliveryDays = Math.min(
        Math.max(baseDays, config.min_delivery_days),
        config.max_delivery_days
    )

    let deliveryDate = addDays(new Date(), deliveryDays)
    deliveryDate = skipWeekend(deliveryDate)

    return deliveryDate
}

/**
 * Skip weekends
 */
function skipWeekend(date: Date): Date {
    while (isWeekend(date)) {
        date = addDays(date, 1)
    }
    return date
}

/**
 * Get route preview for a delivery (useful for displaying route on map)
 */
export function getRoutePreview(
    originCity: string,
    originState: string,
    originLat: number,
    originLng: number,
    destCity: string,
    destState: string,
    destLat?: number,
    destLng?: number
) {
    const route = calculateDeliveryRoute(
        originCity,
        originState,
        originLat,
        originLng,
        destCity,
        destState,
        destLat,
        destLng
    )

    return {
        waypoints: route.waypoints.map(wp => ({
            city: wp.city,
            state: wp.state,
            lat: wp.lat,
            lng: wp.lng,
            progress: wp.cumulativeProgress
        })),
        totalDistance: route.totalDistance,
        totalDays: route.totalDays,
        estimatedDelivery: route.destination.estimatedArrival
    }
}

