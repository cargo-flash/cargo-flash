// ============================================
// ROUTE WAYPOINTS SERVICE
// Generates realistic intermediate waypoints between origin and destination
// With 2 daily updates for real-time tracking simulation
// ============================================

import { addDays, addHours, setHours, setMinutes, isWeekend, differenceInDays } from 'date-fns'
import { BRAZILIAN_CITIES, findOrCreateCity, calculateDistance, type BrazilianCity } from './brazilian-routes'

// Waypoint along the route
export interface RouteWaypoint {
    city: string
    state: string
    lat: number
    lng: number
    distanceFromOrigin: number      // km from origin
    cumulativeProgress: number      // 0-100%
    estimatedArrival: Date
    stopType: 'origin' | 'transit' | 'hub' | 'destination'
    highway?: string
    description?: string
}

// Route with all waypoints
export interface DeliveryRoute {
    origin: RouteWaypoint
    destination: RouteWaypoint
    waypoints: RouteWaypoint[]
    totalDistance: number           // km
    totalDays: number
    dailyUpdates: ScheduledUpdate[]
}

// Scheduled update for tracking
export interface ScheduledUpdate {
    scheduledFor: Date
    waypoint: RouteWaypoint
    progressPercent: number
    description: string
    eventType: 'collection' | 'departure' | 'arrival' | 'in_transit' | 'out_for_delivery' | 'delivery_attempt' | 'delivered'
    newStatus: 'pending' | 'collected' | 'in_transit' | 'out_for_delivery' | 'delivered' | null
}

// Highway routes with intermediate cities (ordered from origin to destination)
// ============================================
// VERIFIED REAL BRAZILIAN HIGHWAY ROUTES
// Each route follows actual highway paths with real cities along the way
// ============================================

const HIGHWAY_ROUTES: Record<string, string[]> = {
    // BR-116 Sul (Régis Bittencourt): SP → Curitiba → Porto Alegre
    // Real route via Régis Bittencourt (BR-116) through Serra do Mar
    'BR-116-SUL': [
        'São Paulo|SP', 'Embu das Artes|SP', 'Itapecerica da Serra|SP', 'Juquitiba|SP',
        'Miracatu|SP', 'Registro|SP', 'Barra do Turvo|SP',
        'Curitiba|PR', 'São José dos Pinhais|PR', 'Campo Largo|PR', 'Lapa|PR',
        'São Mateus do Sul|PR', 'Rio Negro|PR', 'Mafra|SC',
        'Rio Negrinho|SC', 'São Bento do Sul|SC', 'Joinville|SC',
        'Jaraguá do Sul|SC', 'Blumenau|SC', 'Brusque|SC', 'Itajaí|SC',
        'Balneário Camboriú|SC', 'Itapema|SC', 'Florianópolis|SC', 'Palhoça|SC',
        'São José|SC', 'Tubarão|SC', 'Criciúma|SC', 'Araranguá|SC',
        'Torres|RS', 'Capão da Canoa|RS', 'Osório|RS',
        'Gravataí|RS', 'Canoas|RS', 'Porto Alegre|RS'
    ],

    // BR-101 Litoral: SP → RJ → Vitória → Salvador
    // Real coastal route via BR-101
    'BR-101-NE': [
        'São Paulo|SP', 'Mogi das Cruzes|SP', 'São José dos Campos|SP',
        'Taubaté|SP', 'Pindamonhangaba|SP', 'Aparecida|SP', 'Guaratinguetá|SP',
        'Queluz|SP', 'Resende|RJ', 'Itatiaia|RJ', 'Barra Mansa|RJ', 'Volta Redonda|RJ',
        'Piraí|RJ', 'Paracambi|RJ', 'Nova Iguaçu|RJ', 'Rio de Janeiro|RJ',
        'Niterói|RJ', 'São Gonçalo|RJ', 'Itaboraí|RJ', 'Rio Bonito|RJ',
        'Macaé|RJ', 'Campos dos Goytacazes|RJ', 'São João da Barra|RJ',
        'São Mateus|ES', 'Linhares|ES', 'Aracruz|ES', 'Fundão|ES',
        'Serra|ES', 'Vitória|ES', 'Vila Velha|ES', 'Guarapari|ES',
        'Anchieta|ES', 'Cachoeiro de Itapemirim|ES',
        'Itabatan|BA', 'Teixeira de Freitas|BA', 'Eunápolis|BA',
        'Porto Seguro|BA', 'Belmonte|BA', 'Una|BA', 'Ilhéus|BA', 'Itabuna|BA',
        'Jequié|BA', 'Santo Antônio de Jesus|BA',
        'Feira de Santana|BA', 'Salvador|BA'
    ],

    // BR-381 Fernão Dias: SP → BH
    // Real route via Fernão Dias highway
    'BR-381': [
        'São Paulo|SP', 'Guarulhos|SP', 'Mairiporã|SP', 'Atibaia|SP',
        'Bragança Paulista|SP', 'Piracaia|SP', 'Vargem|SP',
        'Extrema|MG', 'Camanducaia|MG', 'Toledo|MG',
        'Pouso Alegre|MG', 'Cambuí|MG', 'Santa Rita do Sapucaí|MG',
        'Pouso Alto|MG', 'Caxambu|MG', 'Três Corações|MG',
        'Carmo da Cachoeira|MG', 'Lavras|MG', 'Nepomuceno|MG',
        'Oliveira|MG', 'Itatiaiuçu|MG', 'Betim|MG',
        'Contagem|MG', 'Belo Horizonte|MG'
    ],

    // BR-153 Transbrasiliana: SP → Goiânia → Brasília
    // Real route via BR-153 through Triângulo Mineiro
    'BR-153': [
        'São Paulo|SP', 'Jundiaí|SP', 'Campinas|SP', 'Americana|SP',
        'Limeira|SP', 'Rio Claro|SP', 'Araraquara|SP',
        'São Carlos|SP', 'Ribeirão Preto|SP', 'Jardinópolis|SP',
        'Orlândia|SP', 'Ituverava|SP', 'Franca|SP',
        'Uberaba|MG', 'Uberlândia|MG', 'Araguari|MG',
        'Itumbiara|GO', 'Caldas Novas|GO', 'Morrinhos|GO',
        'Goiânia|GO', 'Anápolis|GO', 'Alexânia|GO',
        'Águas Lindas de Goiás|GO', 'Brasília|DF'
    ],

    // BR-116 Norte para Nordeste via interior
    // Real route via BR-116/BR-040 interior
    'BR-116-NE': [
        'São Paulo|SP', 'Guarulhos|SP', 'Jacareí|SP', 'São José dos Campos|SP',
        'Taubaté|SP', 'Queluz|SP', 'Resende|RJ',
        'Além Paraíba|MG', 'Leopoldina|MG', 'Cataguases|MG',
        'Juiz de Fora|MG', 'Matias Barbosa|MG', 'Barbacena|MG',
        'Conselheiro Lafaiete|MG', 'Itabirito|MG', 'Belo Horizonte|MG',
        'Sete Lagoas|MG', 'Curvelo|MG', 'Augusto de Lima|MG',
        'Bocaiúva|MG', 'Montes Claros|MG', 'Janaúba|MG',
        'Jaíba|MG', 'Candiba|BA', 'Guanambi|BA',
        'Vitória da Conquista|BA', 'Jequié|BA',
        'Feira de Santana|BA', 'Alagoinhas|BA',
        'Cruz das Almas|BA', 'Santo Amaro|BA',
        'Aracaju|SE', 'Propriá|SE', 'Penedo|AL',
        'Maceió|AL', 'São Miguel dos Campos|AL',
        'Palmeira dos Índios|AL', 'Garanhuns|PE',
        'Caruaru|PE', 'Recife|PE',
        'João Pessoa|PB', 'Natal|RN',
        'Mossoró|RN', 'Fortaleza|CE'
    ],

    // BR-277/BR-376: SP → Curitiba → Foz do Iguaçu
    // Real route via BR-277 (Rodovia do Café)
    'BR-277': [
        'São Paulo|SP', 'Curitiba|PR', 'Campo Largo|PR',
        'Ponta Grossa|PR', 'Palmeira|PR', 'Prudentópolis|PR',
        'Irati|PR', 'Guarapuava|PR', 'Laranjeiras do Sul|PR',
        'Quedas do Iguaçu|PR', 'Cascavel|PR', 'Toledo|PR',
        'Santa Terezinha de Itaipu|PR', 'Foz do Iguaçu|PR'
    ],

    // Interior SP - Via Bandeirantes/Anhanguera
    'SP-INTERIOR': [
        'São Paulo|SP', 'Jundiaí|SP', 'Campinas|SP', 'Sumaré|SP',
        'Americana|SP', 'Santa Bárbara dOeste|SP', 'Limeira|SP',
        'Piracicaba|SP', 'Rio Claro|SP', 'São Carlos|SP',
        'Araraquara|SP', 'Matão|SP', 'Jaboticabal|SP',
        'Ribeirão Preto|SP', 'Sertãozinho|SP', 'Orlândia|SP',
        'Franca|SP', 'Batatais|SP', 'Barretos|SP'
    ],

    // BR-060 Norte (região Centro-Oeste e Norte)
    'BR-060-N': [
        'São Paulo|SP', 'Campinas|SP', 'Ribeirão Preto|SP',
        'Uberlândia|MG', 'Goiânia|GO', 'Brasília|DF',
        'Formosa|GO', 'Luziânia|GO', 'Cristalina|GO',
        'Paracatu|MG', 'Unaí|MG', 'João Pinheiro|MG',
        'Palmas|TO', 'Miracema do Tocantins|TO', 'Araguaína|TO',
        'Imperatriz|MA', 'Santa Inês|MA', 'Bacabal|MA',
        'São Luís|MA', 'Belém|PA'
    ],

    // Norte via BR-153/BR-230 (Transamazônica)
    'BR-230-N': [
        'São Paulo|SP', 'Campinas|SP', 'Ribeirão Preto|SP',
        'Uberlândia|MG', 'Goiânia|GO', 'Brasília|DF',
        'Palmas|TO', 'Marabá|PA', 'Altamira|PA',
        'Itaituba|PA', 'Santarém|PA', 'Manaus|AM'
    ]
}

// Additional intermediate cities not in major hubs
const INTERMEDIATE_CITIES: BrazilianCity[] = [
    // SP Interior
    { name: 'Embu das Artes', state: 'SP', lat: -23.6489, lng: -46.8525 },
    { name: 'Itapecerica da Serra', state: 'SP', lat: -23.7172, lng: -46.8494 },
    { name: 'Juquitiba', state: 'SP', lat: -23.9311, lng: -47.0686 },
    { name: 'Registro', state: 'SP', lat: -24.4872, lng: -47.8442 },
    { name: 'Jacupiranga', state: 'SP', lat: -24.6928, lng: -48.0017 },
    { name: 'Taubaté', state: 'SP', lat: -23.0224, lng: -45.5558 },
    { name: 'Guaratinguetá', state: 'SP', lat: -22.8167, lng: -45.1928 },
    { name: 'Americana', state: 'SP', lat: -22.7394, lng: -47.3319 },
    { name: 'Limeira', state: 'SP', lat: -22.5642, lng: -47.4017 },
    { name: 'Rio Claro', state: 'SP', lat: -22.4111, lng: -47.5614 },
    { name: 'São Carlos', state: 'SP', lat: -22.0174, lng: -47.8908 },
    { name: 'Araraquara', state: 'SP', lat: -21.7947, lng: -48.1756 },
    { name: 'Franca', state: 'SP', lat: -20.5387, lng: -47.4008 },
    { name: 'Bragança Paulista', state: 'SP', lat: -22.9519, lng: -46.5417 },

    // MG
    { name: 'Extrema', state: 'MG', lat: -22.8547, lng: -46.3178 },
    { name: 'Pouso Alegre', state: 'MG', lat: -22.2300, lng: -45.9364 },
    { name: 'Três Corações', state: 'MG', lat: -21.6947, lng: -45.2556 },
    { name: 'Lavras', state: 'MG', lat: -21.2458, lng: -45.0000 },
    { name: 'Betim', state: 'MG', lat: -19.9678, lng: -44.1983 },
    { name: 'Montes Claros', state: 'MG', lat: -16.7350, lng: -43.8617 },
    { name: 'Uberaba', state: 'MG', lat: -19.7472, lng: -47.9319 },

    // PR
    { name: 'São José dos Pinhais', state: 'PR', lat: -25.5320, lng: -49.2058 },
    { name: 'Lapa', state: 'PR', lat: -25.7681, lng: -49.7175 },
    { name: 'Ponta Grossa', state: 'PR', lat: -25.0945, lng: -50.1633 },
    { name: 'Guarapuava', state: 'PR', lat: -25.3903, lng: -51.4567 },
    { name: 'Cascavel', state: 'PR', lat: -24.9556, lng: -53.4553 },
    { name: 'Foz do Iguaçu', state: 'PR', lat: -25.5478, lng: -54.5882 },

    // SC
    { name: 'Mafra', state: 'SC', lat: -26.1108, lng: -49.8053 },
    { name: 'São Bento do Sul', state: 'SC', lat: -26.2506, lng: -49.3786 },
    { name: 'Jaraguá do Sul', state: 'SC', lat: -26.4861, lng: -49.0664 },
    { name: 'Brusque', state: 'SC', lat: -27.0917, lng: -48.9175 },
    { name: 'Itajaí', state: 'SC', lat: -26.9078, lng: -48.6619 },
    { name: 'Palhoça', state: 'SC', lat: -27.6453, lng: -48.6678 },
    { name: 'Tubarão', state: 'SC', lat: -28.4739, lng: -49.0144 },
    { name: 'Criciúma', state: 'SC', lat: -28.6775, lng: -49.3697 },
    { name: 'Araranguá', state: 'SC', lat: -28.9356, lng: -49.4917 },

    // RS
    { name: 'Torres', state: 'RS', lat: -29.3350, lng: -49.7267 },
    { name: 'Osório', state: 'RS', lat: -29.8869, lng: -50.2703 },

    // RJ
    { name: 'Resende', state: 'RJ', lat: -22.4686, lng: -44.4469 },
    { name: 'Volta Redonda', state: 'RJ', lat: -22.5232, lng: -44.1042 },
    { name: 'Barra Mansa', state: 'RJ', lat: -22.5442, lng: -44.1708 },
    { name: 'São Gonçalo', state: 'RJ', lat: -22.8268, lng: -43.0634 },
    { name: 'Itaboraí', state: 'RJ', lat: -22.7447, lng: -42.8592 },
    { name: 'Campos dos Goytacazes', state: 'RJ', lat: -21.7545, lng: -41.3244 },

    // ES
    { name: 'Vila Velha', state: 'ES', lat: -20.3297, lng: -40.2925 },
    { name: 'Guarapari', state: 'ES', lat: -20.6733, lng: -40.4997 },
    { name: 'Cachoeiro de Itapemirim', state: 'ES', lat: -20.8489, lng: -41.1131 },
    { name: 'Linhares', state: 'ES', lat: -19.3911, lng: -40.0719 },

    // BA
    { name: 'Teixeira de Freitas', state: 'BA', lat: -17.5353, lng: -39.7422 },
    { name: 'Eunápolis', state: 'BA', lat: -16.3778, lng: -39.5803 },
    { name: 'Porto Seguro', state: 'BA', lat: -16.4500, lng: -39.0650 },
    { name: 'Ilhéus', state: 'BA', lat: -14.7936, lng: -39.0394 },
    { name: 'Itabuna', state: 'BA', lat: -14.7856, lng: -39.2803 },
    { name: 'Vitória da Conquista', state: 'BA', lat: -14.8661, lng: -40.8394 },
    { name: 'Alagoinhas', state: 'BA', lat: -12.1356, lng: -38.4192 },

    // GO
    { name: 'Itumbiara', state: 'GO', lat: -18.4192, lng: -49.2156 },
]

// Merge with existing cities
const ALL_CITIES: BrazilianCity[] = [...BRAZILIAN_CITIES, ...INTERMEDIATE_CITIES]

/**
 * Find a city by name and state from the expanded list
 */
export function findCityExpanded(name: string, state: string): BrazilianCity | undefined {
    return ALL_CITIES.find(
        c => c.name.toLowerCase() === name.toLowerCase() && c.state === state
    )
}

/**
 * Determine which highway route to use based on origin and destination states
 */
function selectHighwayRoute(originState: string, destState: string): string[] {
    // Direct state mapping to routes
    const routeMapping: Record<string, Record<string, string>> = {
        'SP': {
            'PR': 'BR-116-SUL',
            'SC': 'BR-116-SUL',
            'RS': 'BR-116-SUL',
            'MG': 'BR-381',
            'RJ': 'BR-101-NE',
            'ES': 'BR-101-NE',
            'BA': 'BR-116-NE',
            'SE': 'BR-116-NE',
            'AL': 'BR-116-NE',
            'PE': 'BR-116-NE',
            'PB': 'BR-116-NE',
            'RN': 'BR-116-NE',
            'CE': 'BR-116-NE',
            'GO': 'BR-153',
            'DF': 'BR-153',
            'MS': 'BR-277',
            'MT': 'BR-153',
            'TO': 'BR-060-N',
            'PA': 'BR-060-N',
            'MA': 'BR-060-N',
            'AM': 'BR-230-N',
            'AP': 'BR-060-N',
            'RR': 'BR-230-N',
            'AC': 'BR-230-N',
            'RO': 'BR-277',
            'PI': 'BR-116-NE',
        }
    }

    const route = routeMapping[originState]?.[destState]
    if (route && HIGHWAY_ROUTES[route]) {
        return HIGHWAY_ROUTES[route]
    }

    // Fallback: return empty for direct route calculation
    return []
}

/**
 * Parse city string "CityName|State" into components
 */
function parseCityString(cityStr: string): { name: string; state: string } {
    const [name, state] = cityStr.split('|')
    return { name, state }
}

/**
 * Generate intermediate waypoints between origin and destination
 * Following real highway routes when available
 * FIXED: Now finds nearest highway entry/exit points instead of requiring exact match
 */
export function generateRouteWaypoints(
    originCity: string,
    originState: string,
    destCity: string,
    destState: string,
    originLat: number,
    originLng: number,
    destLat?: number,
    destLng?: number
): RouteWaypoint[] {
    const waypoints: RouteWaypoint[] = []

    // Get origin city data
    const origin = findCityExpanded(originCity, originState) || {
        name: originCity,
        state: originState,
        lat: originLat,
        lng: originLng
    }

    // Get destination city data
    const destination = findCityExpanded(destCity, destState) || findOrCreateCity(destCity, destState)
    if (destLat && destLng) {
        destination.lat = destLat
        destination.lng = destLng
    }

    // Calculate total distance
    const totalDistance = calculateDistance(origin, destination)

    // Get highway route if available
    const highwayRoute = selectHighwayRoute(originState, destState)

    let currentDistance = 0

    // Add origin
    waypoints.push({
        city: origin.name,
        state: origin.state,
        lat: origin.lat,
        lng: origin.lng,
        distanceFromOrigin: 0,
        cumulativeProgress: 0,
        estimatedArrival: new Date(),
        stopType: 'origin',
        description: `Centro de Distribuição ${origin.name}`
    })

    if (highwayRoute.length > 0) {
        // Parse all highway cities with their coordinates
        const highwayCities: Array<{ name: string; state: string; data: BrazilianCity | undefined; index: number }> = []

        for (let i = 0; i < highwayRoute.length; i++) {
            const { name, state } = parseCityString(highwayRoute[i])
            const cityData = findCityExpanded(name, state)
            highwayCities.push({ name, state, data: cityData, index: i })
        }

        // Find the ENTRY point: nearest highway city to origin
        let entryIndex = 0
        let minDistToOrigin = Infinity

        for (const hc of highwayCities) {
            if (hc.data) {
                const dist = calculateDistance(origin, hc.data)
                if (dist < minDistToOrigin) {
                    minDistToOrigin = dist
                    entryIndex = hc.index
                }
            }
        }

        // Find the EXIT point: nearest highway city to destination
        let exitIndex = highwayCities.length - 1
        let minDistToDest = Infinity

        for (const hc of highwayCities) {
            if (hc.data) {
                const dist = calculateDistance(hc.data, destination)
                if (dist < minDistToDest) {
                    minDistToDest = dist
                    exitIndex = hc.index
                }
            }
        }

        // Ensure correct order (entry before exit)
        if (entryIndex > exitIndex) {
            // Route is reversed - swap and iterate backwards
            [entryIndex, exitIndex] = [exitIndex, entryIndex]
        }

        console.log(`Highway route: entry at index ${entryIndex} (${highwayCities[entryIndex]?.name}), exit at index ${exitIndex} (${highwayCities[exitIndex]?.name})`)

        // Follow highway from entry point to exit point
        let prevCity: BrazilianCity = origin
        const usedCities = new Set<string>([origin.name])

        for (let i = entryIndex; i <= exitIndex; i++) {
            const hc = highwayCities[i]
            if (!hc.data) continue

            // Skip if already used (avoid duplicates)
            if (usedCities.has(hc.name)) continue
            usedCities.add(hc.name)

            // Calculate distance from previous waypoint
            const segmentDistance = calculateDistance(prevCity, hc.data)
            currentDistance += segmentDistance

            // Check if this is close to or past destination
            const distToDestination = calculateDistance(hc.data, destination)

            // Only add if we haven't significantly passed the destination
            if (currentDistance <= totalDistance * 1.2) {
                waypoints.push({
                    city: hc.data.name,
                    state: hc.data.state,
                    lat: hc.data.lat,
                    lng: hc.data.lng,
                    distanceFromOrigin: currentDistance,
                    cumulativeProgress: Math.min((currentDistance / totalDistance) * 100, 95),
                    estimatedArrival: new Date(), // Will be calculated later
                    stopType: hc.data.isHub ? 'hub' : 'transit',
                    description: hc.data.isHub
                        ? `Centro de Distribuição ${hc.data.name}`
                        : `Em trânsito - ${hc.data.name}`
                })

                prevCity = hc.data
            }

            // Stop if we're very close to destination
            if (distToDestination < 30) break
        }
    } else {
        // No highway route - generate intermediate points along straight line
        const numIntermediatePoints = Math.min(Math.floor(totalDistance / 150), 10)
        const usedCityNames = new Set<string>([origin.name])

        for (let i = 1; i <= numIntermediatePoints; i++) {
            const progress = i / (numIntermediatePoints + 1)
            const lat = origin.lat + (destination.lat - origin.lat) * progress
            const lng = origin.lng + (destination.lng - origin.lng) * progress

            // Find nearest city to this point
            const nearestCity = findNearestCity(lat, lng)

            if (nearestCity && !usedCityNames.has(nearestCity.name)) {
                usedCityNames.add(nearestCity.name)
                currentDistance = totalDistance * progress

                waypoints.push({
                    city: nearestCity.name,
                    state: nearestCity.state,
                    lat: nearestCity.lat,
                    lng: nearestCity.lng,
                    distanceFromOrigin: currentDistance,
                    cumulativeProgress: progress * 100,
                    estimatedArrival: new Date(),
                    stopType: nearestCity.isHub ? 'hub' : 'transit',
                    description: nearestCity.isHub
                        ? `Centro de Distribuição ${nearestCity.name}`
                        : `Em trânsito - ${nearestCity.name}`
                })
            }
        }
    }

    // Add destination (if not already the last waypoint)
    const lastWaypoint = waypoints[waypoints.length - 1]
    if (lastWaypoint.city !== destination.name || lastWaypoint.state !== destination.state) {
        waypoints.push({
            city: destination.name,
            state: destination.state,
            lat: destination.lat,
            lng: destination.lng,
            distanceFromOrigin: totalDistance,
            cumulativeProgress: 100,
            estimatedArrival: new Date(),
            stopType: 'destination',
            description: `${destCity}, ${destState}`
        })
    }

    console.log(`Generated ${waypoints.length} waypoints for route ${originCity}/${originState} -> ${destCity}/${destState}`)

    return waypoints
}

/**
 * Find nearest city to given coordinates
 */
function findNearestCity(lat: number, lng: number): BrazilianCity | undefined {
    let nearest: BrazilianCity | undefined
    let minDist = Infinity

    for (const city of ALL_CITIES) {
        const dist = Math.sqrt(
            Math.pow(city.lat - lat, 2) + Math.pow(city.lng - lng, 2)
        )
        if (dist < minDist) {
            minDist = dist
            nearest = city
        }
    }

    return nearest
}

/**
 * Generate 2 daily updates schedule for a delivery
 * @param trackingCode - Used for deterministic randomization
 */
export function generateDailyUpdates(
    waypoints: RouteWaypoint[],
    startDate: Date,
    totalDays: number,
    trackingCode?: string
): ScheduledUpdate[] {
    const updates: ScheduledUpdate[] = []

    // Calculate waypoint distribution across days
    const totalWaypoints = waypoints.length
    const waypointsPerDay = totalWaypoints / totalDays

    let currentDate = new Date(startDate)
    let previousState = waypoints[0].state  // Track state for crossing detection

    // Calculate collection time: 30 minutes from now for quick feedback
    // This ensures the first event is processable on the next cron run
    const collectionTime = new Date()
    collectionTime.setMinutes(collectionTime.getMinutes() + 30)

    // Day 1: Collection - scheduled 30 min from now for immediate processing
    updates.push({
        scheduledFor: collectionTime,
        waypoint: waypoints[0],
        progressPercent: 0,
        description: 'Objeto coletado e em processamento',
        eventType: 'departure',
        newStatus: 'collected'
    })

    // Update hour constants for the whole function
    const EARLY_HOUR = 8
    const MID_MORNING_HOUR = 11
    const AFTERNOON_HOUR = 14
    const LATE_AFTERNOON_HOUR = 17

    // Day 1 afternoon: First transit update
    updates.push({
        scheduledFor: setHours(setMinutes(currentDate, 0), LATE_AFTERNOON_HOUR),
        waypoint: waypoints[0],
        progressPercent: 5,
        description: `Objeto saiu de ${waypoints[0].city} em direção a ${waypoints[waypoints.length - 1].city}`,
        eventType: 'in_transit',
        newStatus: 'in_transit'
    })

    // Subsequent days: 3-4 updates per day (early morning, mid-morning, afternoon, late afternoon)

    for (let day = 1; day < totalDays - 1; day++) {
        currentDate = addDays(startDate, day)

        // Skip weekends
        if (isWeekend(currentDate)) {
            currentDate = addDays(currentDate, currentDate.getDay() === 6 ? 2 : 1)
        }

        // Calculate which waypoint we should be at by different times of day
        // Each day covers ~4 update slots
        const updatesPerDay = 4
        const totalUpdateSlots = (totalDays - 2) * updatesPerDay
        const baseSlot = (day - 1) * updatesPerDay

        // Calculate waypoint indices for each time slot
        const calculateWaypointIndex = (slot: number) => {
            const progress = (slot + 1) / totalUpdateSlots
            return Math.min(
                Math.floor(progress * (totalWaypoints - 1)),
                totalWaypoints - 2
            )
        }

        // Early morning update (08:00-08:xx) - typically an arrival
        const earlyProgress = baseSlot / totalUpdateSlots
        const earlyWaypointIndex = calculateWaypointIndex(baseSlot)
        const earlyWaypoint = waypoints[earlyWaypointIndex]
        const earlyMinute = trackingCode ? (hashString(`${trackingCode}-e-${day}`) % 30) : (day * 5) % 30

        updates.push({
            scheduledFor: setHours(setMinutes(currentDate, earlyMinute), EARLY_HOUR),
            waypoint: earlyWaypoint,
            progressPercent: Math.round(earlyProgress * 90) + 5,
            description: generateTransitDescription(
                earlyWaypoint,
                waypoints[waypoints.length - 1],
                earlyProgress,
                trackingCode,
                previousState
            ),
            eventType: earlyWaypoint.stopType === 'hub' ? 'arrival' : 'in_transit',
            newStatus: 'in_transit'
        })
        previousState = earlyWaypoint.state

        // Mid-morning update (11:00-11:xx) - typically processing or departure
        const midMorningProgress = (baseSlot + 1) / totalUpdateSlots
        const midMorningWaypointIndex = calculateWaypointIndex(baseSlot + 1)
        const midMorningWaypoint = waypoints[midMorningWaypointIndex]
        const midMorningMinute = trackingCode ? (hashString(`${trackingCode}-mm-${day}`) % 30) + 15 : (day * 8) % 30

        if (midMorningWaypointIndex !== earlyWaypointIndex || midMorningProgress - earlyProgress > 0.02) {
            updates.push({
                scheduledFor: setHours(setMinutes(currentDate, midMorningMinute), MID_MORNING_HOUR),
                waypoint: midMorningWaypoint,
                progressPercent: Math.round(midMorningProgress * 90) + 5,
                description: generateTransitDescription(
                    midMorningWaypoint,
                    waypoints[waypoints.length - 1],
                    midMorningProgress,
                    trackingCode,
                    previousState
                ),
                eventType: midMorningWaypoint.stopType === 'hub' ? 'departure' : 'in_transit',
                newStatus: 'in_transit'
            })
            previousState = midMorningWaypoint.state
        }

        // Afternoon update (14:00-14:xx) - typically in transit
        const afternoonProgress = (baseSlot + 2) / totalUpdateSlots
        const afternoonWaypointIndex = calculateWaypointIndex(baseSlot + 2)
        const afternoonWaypoint = waypoints[afternoonWaypointIndex]
        const afternoonMinute = trackingCode ? (hashString(`${trackingCode}-a-${day}`) % 30) : (day * 11) % 30

        if (afternoonWaypointIndex !== midMorningWaypointIndex || afternoonProgress - midMorningProgress > 0.02) {
            updates.push({
                scheduledFor: setHours(setMinutes(currentDate, afternoonMinute), AFTERNOON_HOUR),
                waypoint: afternoonWaypoint,
                progressPercent: Math.round(afternoonProgress * 90) + 5,
                description: generateTransitDescription(
                    afternoonWaypoint,
                    waypoints[waypoints.length - 1],
                    afternoonProgress,
                    trackingCode,
                    previousState
                ),
                eventType: 'in_transit',
                newStatus: 'in_transit'
            })
            previousState = afternoonWaypoint.state
        }

        // Late afternoon update (17:00-17:xx) - typically arrival at next hub or transit
        const lateProgress = (baseSlot + 3) / totalUpdateSlots
        const lateWaypointIndex = calculateWaypointIndex(baseSlot + 3)
        const lateWaypoint = waypoints[lateWaypointIndex]
        const lateMinute = trackingCode ? (hashString(`${trackingCode}-l-${day}`) % 30) : (day * 13) % 30

        if (lateWaypointIndex !== afternoonWaypointIndex || lateProgress - afternoonProgress > 0.02) {
            updates.push({
                scheduledFor: setHours(setMinutes(currentDate, lateMinute), LATE_AFTERNOON_HOUR),
                waypoint: lateWaypoint,
                progressPercent: Math.round(lateProgress * 90) + 5,
                description: generateTransitDescription(
                    lateWaypoint,
                    waypoints[waypoints.length - 1],
                    lateProgress,
                    trackingCode,
                    previousState
                ),
                eventType: lateWaypoint.stopType === 'hub' ? 'arrival' : 'in_transit',
                newStatus: 'in_transit'
            })
            previousState = lateWaypoint.state
        }
    }

    // ============================================
    // DELIVERY ATTEMPTS (2 attempts before final delivery)
    // 1st attempt: 2 days before delivery at 07:00
    // 2nd attempt: 1 day before delivery at 07:00 (next day after 1st)
    // ============================================

    // Calculate attempt days (2 days before final delivery, then every 2 days)
    const attemptDay1 = addDays(startDate, totalDays - 1) // First attempt day
    const attemptDay2 = addDays(attemptDay1, 2) // Second attempt - 2 days later
    const finalDeliveryDay = addDays(attemptDay2, 2) // Final delivery - 2 days after 2nd attempt

    const destWaypoint = waypoints[waypoints.length - 1]

    // Out for delivery attempt 1 (07:00 AM)
    updates.push({
        scheduledFor: setHours(setMinutes(attemptDay1, 0), 7),
        waypoint: destWaypoint,
        progressPercent: 90,
        description: `1ª tentativa de entrega - Objeto saiu para entrega em ${destWaypoint.city}`,
        eventType: 'out_for_delivery',
        newStatus: 'out_for_delivery'
    })

    // Delivery attempt 1 failed (afternoon)
    updates.push({
        scheduledFor: setHours(setMinutes(attemptDay1, 30), 14),
        waypoint: destWaypoint,
        progressPercent: 92,
        description: 'Tentativa de entrega não realizada - destinatário ausente',
        eventType: 'delivery_attempt',
        newStatus: 'in_transit'
    })

    // Return to hub after failed attempt 1
    updates.push({
        scheduledFor: setHours(setMinutes(attemptDay1, 0), 18),
        waypoint: destWaypoint,
        progressPercent: 92,
        description: `Objeto retornou à unidade de ${destWaypoint.city} - nova tentativa será realizada`,
        eventType: 'arrival',
        newStatus: 'in_transit'
    })

    // Out for delivery attempt 2 (07:00 AM, 2 days later)
    updates.push({
        scheduledFor: setHours(setMinutes(attemptDay2, 0), 7),
        waypoint: destWaypoint,
        progressPercent: 94,
        description: `2ª tentativa de entrega - Objeto saiu para entrega em ${destWaypoint.city}`,
        eventType: 'out_for_delivery',
        newStatus: 'out_for_delivery'
    })

    // Delivery attempt 2 failed (afternoon)
    updates.push({
        scheduledFor: setHours(setMinutes(attemptDay2, 30), 14),
        waypoint: destWaypoint,
        progressPercent: 96,
        description: 'Tentativa de entrega não realizada - endereço com acesso restrito',
        eventType: 'delivery_attempt',
        newStatus: 'in_transit'
    })

    // Return to hub after failed attempt 2
    updates.push({
        scheduledFor: setHours(setMinutes(attemptDay2, 0), 18),
        waypoint: destWaypoint,
        progressPercent: 96,
        description: `Objeto aguardando na unidade de ${destWaypoint.city} - última tentativa programada`,
        eventType: 'arrival',
        newStatus: 'in_transit'
    })

    // ============================================
    // FINAL DELIVERY (2 days after 2nd attempt)
    // ============================================

    // Out for final delivery (07:00 AM)
    updates.push({
        scheduledFor: setHours(setMinutes(finalDeliveryDay, 0), 7),
        waypoint: destWaypoint,
        progressPercent: 98,
        description: 'Objeto saiu para entrega ao destinatário - última tentativa',
        eventType: 'out_for_delivery',
        newStatus: 'out_for_delivery'
    })

    // Delivered (deterministic afternoon time based on tracking code)
    const deliveryHour = trackingCode ? 10 + (hashString(trackingCode) % 6) : 12 // 10-15h
    const deliveryMinute = trackingCode ? (hashString(`${trackingCode}-delivery`) % 60) : 30
    updates.push({
        scheduledFor: setHours(setMinutes(finalDeliveryDay, deliveryMinute), deliveryHour),
        waypoint: destWaypoint,
        progressPercent: 100,
        description: 'Objeto entregue ao destinatário',
        eventType: 'delivered',
        newStatus: 'delivered'
    })

    return updates
}

// ============================================
// ENHANCED DESCRIPTION TEMPLATES
// ============================================

const DESCRIPTION_TEMPLATES = {
    // Hub arrivals (when package arrives at distribution center)
    hubArrival: [
        'Objeto recebido no Centro de Distribuição de {city}',
        'Pacote chegou ao CD {city} para triagem',
        'Mercadoria no polo logístico de {city}',
        'Objeto em processamento no CD {city}, {state}',
        'Carga recepcionada na unidade de {city}',
        'Objeto conferido e triado no CD {city}',
    ],

    // Hub departures (when package leaves distribution center)
    hubDeparture: [
        'Objeto encaminhado do CD {city} para {destination}',
        'Carga despachada do Centro de Distribuição {city}',
        'Veículo partiu do CD {city} com destino a {destination}',
        'Objeto em transferência do CD {city}',
        'Mercadoria liberada do CD {city} para transporte',
        'Saída registrada do CD {city} - em rota para {destination}',
    ],

    // Transit between cities
    transit: [
        'Objeto em trânsito por {city}, {state}',
        'Carga em deslocamento - passou por {city}',
        'Em transferência via {city}, {state}',
        'Objeto em {city}, seguindo para destino',
        'Trânsito registrado em {city}, {state}',
        'Mercadoria em transporte - {city}, {state}',
        'Objeto passou pela região de {city}',
        'Carga em movimento - localização: {city}, {state}',
    ],

    // Near destination (last 20% of journey)
    nearDestination: [
        'Objeto chegou em {city}, aguardando distribuição local',
        'Mercadoria na região de {city}, em rota final',
        'Próximo ao destino - {city}, {state}',
        'Objeto na base local de {city} para entrega',
        'Em {city} - preparando para última milha',
        'Carga recebida na unidade local de {city}',
        'Objeto sendo encaminhado para região de entrega em {city}',
    ],

    // State border crossings
    stateCrossing: [
        'Objeto cruzou divisa para {state}',
        'Carga entrou no estado de {state}',
        'Trânsito interestadual - chegou em {state}',
        'Mercadoria em {city}, {state} - nova jurisdição',
    ],

    // Processing updates
    processing: [
        'Processamento concluído em {city}',
        'Objeto liberado após conferência em {city}',
        'Triagem finalizada em {city}, {state}',
        'Objeto preparado para próximo trecho em {city}',
    ],
}

/**
 * Generate deterministic hash from string for consistent selection
 */
function hashString(str: string): number {
    let hash = 0
    for (let i = 0; i < str.length; i++) {
        const char = str.charCodeAt(i)
        hash = ((hash << 5) - hash) + char
        hash = hash & hash
    }
    return Math.abs(hash)
}

/**
 * Generate realistic transit description with deterministic selection
 */
function generateTransitDescription(
    currentWaypoint: RouteWaypoint,
    destination: RouteWaypoint,
    progress: number,
    trackingCode?: string,
    previousState?: string
): string {
    // Create seed for deterministic selection based on waypoint and progress
    const seed = trackingCode
        ? `${trackingCode}-${currentWaypoint.city}-${Math.round(progress * 100)}`
        : `${currentWaypoint.city}-${Math.round(progress * 100)}`
    const hash = hashString(seed)

    let templates: string[]

    // Select template category based on context
    if (currentWaypoint.stopType === 'hub') {
        // Alternate between arrival and departure based on progress
        templates = progress < 0.5
            ? DESCRIPTION_TEMPLATES.hubArrival
            : DESCRIPTION_TEMPLATES.hubDeparture
    } else if (progress > 0.8) {
        templates = DESCRIPTION_TEMPLATES.nearDestination
    } else if (previousState && previousState !== currentWaypoint.state) {
        templates = DESCRIPTION_TEMPLATES.stateCrossing
    } else if (progress < 0.15) {
        templates = DESCRIPTION_TEMPLATES.processing
    } else {
        templates = DESCRIPTION_TEMPLATES.transit
    }

    // Deterministically select template
    const index = hash % templates.length
    let description = templates[index]

    // Replace placeholders
    description = description
        .replace('{city}', currentWaypoint.city)
        .replace('{state}', currentWaypoint.state)
        .replace('{destination}', destination.city)

    return description
}

/**
 * Calculate complete delivery route with all updates
 */
export function calculateDeliveryRoute(
    originCity: string,
    originState: string,
    originLat: number,
    originLng: number,
    destCity: string,
    destState: string,
    destLat?: number,
    destLng?: number,
    minDays: number = 15,
    maxDays: number = 19,
    trackingCode?: string
): DeliveryRoute {
    // Generate waypoints
    const waypoints = generateRouteWaypoints(
        originCity, originState, destCity, destState,
        originLat, originLng, destLat, destLng
    )

    // Calculate total distance
    const origin = waypoints[0]
    const destination = waypoints[waypoints.length - 1]
    const totalDistance = calculateDistance(
        { name: origin.city, state: origin.state, lat: origin.lat, lng: origin.lng },
        { name: destination.city, state: destination.state, lat: destination.lat, lng: destination.lng }
    )

    // Calculate delivery days based on distance
    const baseDays = Math.ceil(totalDistance / 200) // ~200km per day average
    const totalDays = Math.min(Math.max(baseDays, minDays), maxDays)

    // Start date: same day if before 14:00, otherwise next day
    // Events will be scheduled starting from this date
    const now = new Date()
    let startDate = new Date(now)

    // If order placed after 14:00, start simulation next day
    if (now.getHours() >= 14) {
        startDate = addDays(now, 1)
    }

    // Note: We allow weekends for simulation purposes
    // Real packages can show updates on weekends in tracking systems

    // Generate daily updates with tracking code for deterministic scheduling
    const dailyUpdates = generateDailyUpdates(waypoints, startDate, totalDays, trackingCode)

    // Update waypoint arrival estimates
    const daysPerWaypoint = totalDays / waypoints.length
    waypoints.forEach((wp, index) => {
        wp.estimatedArrival = addDays(startDate, Math.floor(index * daysPerWaypoint))
    })

    return {
        origin: waypoints[0],
        destination: waypoints[waypoints.length - 1],
        waypoints,
        totalDistance: Math.round(totalDistance),
        totalDays,
        dailyUpdates
    }
}
