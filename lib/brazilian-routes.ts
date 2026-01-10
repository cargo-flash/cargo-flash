// ============================================
// ROTAS E CIDADES BRASILEIRAS
// Motor de simulação de entregas realísticas
// ============================================

export interface BrazilianCity {
    name: string
    state: string
    lat: number
    lng: number
    isHub?: boolean // Centro de distribuição
}

// Principais cidades brasileiras com coordenadas
export const BRAZILIAN_CITIES: BrazilianCity[] = [
    // Sudeste
    { name: 'São Paulo', state: 'SP', lat: -23.5505, lng: -46.6333, isHub: true },
    { name: 'Rio de Janeiro', state: 'RJ', lat: -22.9068, lng: -43.1729, isHub: true },
    { name: 'Belo Horizonte', state: 'MG', lat: -19.9167, lng: -43.9345, isHub: true },
    { name: 'Campinas', state: 'SP', lat: -22.9064, lng: -47.0616, isHub: true },
    { name: 'Guarulhos', state: 'SP', lat: -23.4538, lng: -46.5333 },
    { name: 'Ribeirão Preto', state: 'SP', lat: -21.1767, lng: -47.8208 },
    { name: 'Santos', state: 'SP', lat: -23.9608, lng: -46.3336 },
    { name: 'São José dos Campos', state: 'SP', lat: -23.1791, lng: -45.8872 },
    { name: 'Sorocaba', state: 'SP', lat: -23.5015, lng: -47.4526 },
    { name: 'Niterói', state: 'RJ', lat: -22.8833, lng: -43.1036 },
    { name: 'Juiz de Fora', state: 'MG', lat: -21.7642, lng: -43.3496 },
    { name: 'Uberlândia', state: 'MG', lat: -18.9186, lng: -48.2772 },
    { name: 'Vitória', state: 'ES', lat: -20.3155, lng: -40.3128 },

    // Sul
    { name: 'Curitiba', state: 'PR', lat: -25.4290, lng: -49.2671, isHub: true },
    { name: 'Porto Alegre', state: 'RS', lat: -30.0346, lng: -51.2177, isHub: true },
    { name: 'Florianópolis', state: 'SC', lat: -27.5954, lng: -48.5480, isHub: true },
    { name: 'Londrina', state: 'PR', lat: -23.3045, lng: -51.1696 },
    { name: 'Maringá', state: 'PR', lat: -23.4205, lng: -51.9333 },
    { name: 'Joinville', state: 'SC', lat: -26.3045, lng: -48.8487 },
    { name: 'Blumenau', state: 'SC', lat: -26.9194, lng: -49.0661 },
    { name: 'Caxias do Sul', state: 'RS', lat: -29.1634, lng: -51.1797 },
    { name: 'Pelotas', state: 'RS', lat: -31.7654, lng: -52.3424 },

    // Nordeste
    { name: 'Salvador', state: 'BA', lat: -12.9714, lng: -38.5014, isHub: true },
    { name: 'Recife', state: 'PE', lat: -8.0476, lng: -34.8770, isHub: true },
    { name: 'Fortaleza', state: 'CE', lat: -3.7172, lng: -38.5433, isHub: true },
    { name: 'Natal', state: 'RN', lat: -5.7945, lng: -35.2110 },
    { name: 'João Pessoa', state: 'PB', lat: -7.1195, lng: -34.8450 },
    { name: 'Maceió', state: 'AL', lat: -9.6658, lng: -35.7350 },
    { name: 'Aracaju', state: 'SE', lat: -10.9472, lng: -37.0731 },
    { name: 'Teresina', state: 'PI', lat: -5.0920, lng: -42.8038 },
    { name: 'São Luís', state: 'MA', lat: -2.5387, lng: -44.2826 },
    { name: 'Feira de Santana', state: 'BA', lat: -12.2667, lng: -38.9667 },

    // Centro-Oeste
    { name: 'Brasília', state: 'DF', lat: -15.7942, lng: -47.8822, isHub: true },
    { name: 'Goiânia', state: 'GO', lat: -16.6869, lng: -49.2648, isHub: true },
    { name: 'Campo Grande', state: 'MS', lat: -20.4697, lng: -54.6201 },
    { name: 'Cuiabá', state: 'MT', lat: -15.6014, lng: -56.0979 },
    { name: 'Anápolis', state: 'GO', lat: -16.3281, lng: -48.9534 },

    // Norte
    { name: 'Manaus', state: 'AM', lat: -3.1190, lng: -60.0217, isHub: true },
    { name: 'Belém', state: 'PA', lat: -1.4558, lng: -48.4902, isHub: true },
    { name: 'Porto Velho', state: 'RO', lat: -8.7612, lng: -63.9004 },
    { name: 'Boa Vista', state: 'RR', lat: 2.8235, lng: -60.6758 },
    { name: 'Macapá', state: 'AP', lat: 0.0356, lng: -51.0705 },
    { name: 'Rio Branco', state: 'AC', lat: -9.9754, lng: -67.8249 },
    { name: 'Palmas', state: 'TO', lat: -10.2491, lng: -48.3243 },
]

// Encontra cidade por nome e estado
export function findCity(name: string, state: string): BrazilianCity | undefined {
    return BRAZILIAN_CITIES.find(
        c => c.name.toLowerCase() === name.toLowerCase() && c.state === state
    )
}

// Encontra ou cria cidade com coordenadas aproximadas
export function findOrCreateCity(name: string, state: string): BrazilianCity {
    const existing = findCity(name, state)
    if (existing) return existing

    // Busca hub do estado para coordenadas aproximadas
    const stateHub = BRAZILIAN_CITIES.find(c => c.state === state && c.isHub)
    if (stateHub) {
        return {
            name,
            state,
            lat: stateHub.lat + (Math.random() - 0.5) * 2,
            lng: stateHub.lng + (Math.random() - 0.5) * 2,
        }
    }

    // Fallback para São Paulo com offset
    return {
        name,
        state,
        lat: -23.5505 + (Math.random() - 0.5) * 10,
        lng: -46.6333 + (Math.random() - 0.5) * 10,
    }
}

// Encontra hubs entre origem e destino
export function findRouteHubs(
    originState: string,
    destState: string
): BrazilianCity[] {
    // Se mesmo estado, retorna apenas o hub do estado
    if (originState === destState) {
        const hub = BRAZILIAN_CITIES.find(c => c.state === originState && c.isHub)
        return hub ? [hub] : []
    }

    // Mapa de rotas regionais
    const routes: Record<string, string[]> = {
        // Sudeste
        'SP-RJ': ['Campinas', 'São José dos Campos'],
        'SP-MG': ['Campinas', 'Ribeirão Preto'],
        'SP-ES': ['Campinas', 'Vitória'],
        'RJ-MG': ['Juiz de Fora'],

        // Sul
        'SP-PR': ['Campinas', 'Sorocaba', 'Curitiba'],
        'SP-SC': ['Campinas', 'Curitiba', 'Joinville'],
        'SP-RS': ['Campinas', 'Curitiba', 'Florianópolis'],
        'PR-SC': ['Joinville'],
        'PR-RS': ['Florianópolis'],
        'SC-RS': ['Florianópolis'],

        // Nordeste
        'SP-BA': ['Belo Horizonte', 'Feira de Santana'],
        'SP-PE': ['Belo Horizonte', 'Salvador', 'Recife'],
        'SP-CE': ['Belo Horizonte', 'Salvador', 'Recife'],
        'BA-PE': ['Feira de Santana'],
        'PE-CE': ['João Pessoa', 'Natal'],

        // Centro-Oeste
        'SP-DF': ['Campinas', 'Ribeirão Preto', 'Uberlândia'],
        'SP-GO': ['Campinas', 'Ribeirão Preto', 'Uberlândia'],
        'SP-MS': ['Campinas', 'Londrina', 'Maringá'],
        'SP-MT': ['Campinas', 'Goiânia', 'Cuiabá'],

        // Norte
        'SP-AM': ['Brasília', 'Belém'],
        'SP-PA': ['Brasília', 'Goiânia'],
    }

    // Busca rota direta ou inversa
    const routeKey = `${originState}-${destState}`
    const reverseKey = `${destState}-${originState}`

    const hubNames = routes[routeKey] || routes[reverseKey] || []

    // Se não tem rota específica, usa hubs genéricos
    if (hubNames.length === 0) {
        const originHub = BRAZILIAN_CITIES.find(c => c.state === originState && c.isHub)
        const destHub = BRAZILIAN_CITIES.find(c => c.state === destState && c.isHub)
        return [originHub, destHub].filter(Boolean) as BrazilianCity[]
    }

    // Converte nomes em cidades
    return hubNames
        .map(name => BRAZILIAN_CITIES.find(c => c.name === name))
        .filter(Boolean) as BrazilianCity[]
}

// Calcula distância entre duas cidades (Haversine)
export function calculateDistance(city1: BrazilianCity, city2: BrazilianCity): number {
    const R = 6371 // Raio da Terra em km
    const dLat = toRad(city2.lat - city1.lat)
    const dLng = toRad(city2.lng - city1.lng)
    const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(toRad(city1.lat)) *
        Math.cos(toRad(city2.lat)) *
        Math.sin(dLng / 2) *
        Math.sin(dLng / 2)
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
    return R * c
}

function toRad(deg: number): number {
    return deg * (Math.PI / 180)
}

// Estima dias de entrega baseado na distância
export function estimateDeliveryDays(
    originCity: BrazilianCity,
    destCity: BrazilianCity,
    minDays: number = 15,
    maxDays: number = 19
): number {
    const distance = calculateDistance(originCity, destCity)

    // Fórmula: mais distante = mais dias, com variação aleatória
    const baseDays = Math.ceil(distance / 300) // ~300km por dia
    const randomVariation = Math.floor(Math.random() * 3) - 1 // -1 a 1

    return Math.min(Math.max(baseDays + randomVariation, minDays), maxDays)
}

// Gera descrições de eventos realísticas
export const EVENT_DESCRIPTIONS = {
    collection: [
        'Pacote coletado no remetente',
        'Objeto coletado e em processamento',
        'Coleta realizada com sucesso',
    ],
    departure: [
        'Objeto saiu de {city}',
        'Em transferência para {destination}',
        'Encaminhado para centro de distribuição',
    ],
    arrival: [
        'Objeto chegou em {city}',
        'Recebido no centro de distribuição de {city}',
        'Em processamento em {city}',
    ],
    in_transit: [
        'Em trânsito para {destination}',
        'Objeto em movimento',
        'Seguindo para destino',
    ],
    out_for_delivery: [
        'Objeto saiu para entrega ao destinatário',
        'Com motorista, saiu para entrega',
        'Em rota de entrega',
    ],
    delivery_attempt: [
        'Tentativa de entrega não realizada - Destinatário ausente',
        'Tentativa de entrega - Endereço não localizado',
        'Aguardando nova tentativa de entrega',
    ],
    delivered: [
        'Objeto entregue ao destinatário',
        'Entrega realizada com sucesso',
        'Entregue para {recipient}',
    ],
}

// Seleciona descrição aleatória
export function getRandomDescription(
    eventType: keyof typeof EVENT_DESCRIPTIONS,
    variables: Record<string, string> = {}
): string {
    const descriptions = EVENT_DESCRIPTIONS[eventType]
    const description = descriptions[Math.floor(Math.random() * descriptions.length)]

    return Object.entries(variables).reduce(
        (desc, [key, value]) => desc.replace(`{${key}}`, value),
        description
    )
}
