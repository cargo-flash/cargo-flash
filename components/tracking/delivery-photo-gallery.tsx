'use client'

import {
    Camera,
    Image as ImageIcon,
    X,
    Download,
    ChevronLeft,
    ChevronRight,
    Maximize2
} from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { useState } from 'react'

interface DeliveryPhoto {
    url: string
    timestamp: string
    type: 'proof' | 'location' | 'package' | 'signature'
    description: string
}

interface DeliveryPhotoGalleryProps {
    photos?: DeliveryPhoto[]
    status: string
}

// Generate placeholder photos for demo
const demoPhotos: DeliveryPhoto[] = [
    {
        url: '/api/placeholder/400/300',
        timestamp: new Date().toISOString(),
        type: 'proof',
        description: 'Comprovante de entrega'
    },
    {
        url: '/api/placeholder/400/300',
        timestamp: new Date().toISOString(),
        type: 'location',
        description: 'Local de entrega'
    },
    {
        url: '/api/placeholder/400/300',
        timestamp: new Date().toISOString(),
        type: 'package',
        description: 'Embalagem'
    }
]

const typeLabels: Record<string, { label: string; color: string }> = {
    proof: { label: 'Comprovante', color: 'bg-emerald-100 text-emerald-700' },
    location: { label: 'Local', color: 'bg-blue-100 text-blue-700' },
    package: { label: 'Pacote', color: 'bg-amber-100 text-amber-700' },
    signature: { label: 'Assinatura', color: 'bg-purple-100 text-purple-700' }
}

export function DeliveryPhotoGallery({ photos = demoPhotos, status }: DeliveryPhotoGalleryProps) {
    const [selectedIndex, setSelectedIndex] = useState<number | null>(null)
    const [isFullscreen, setIsFullscreen] = useState(false)

    // Only show for delivered status
    if (status !== 'delivered' || photos.length === 0) {
        return null
    }

    const selectedPhoto = selectedIndex !== null ? photos[selectedIndex] : null

    const handlePrevious = () => {
        if (selectedIndex === null) return
        setSelectedIndex(selectedIndex === 0 ? photos.length - 1 : selectedIndex - 1)
    }

    const handleNext = () => {
        if (selectedIndex === null) return
        setSelectedIndex(selectedIndex === photos.length - 1 ? 0 : selectedIndex + 1)
    }

    return (
        <>
            <Card className="border border-slate-200/80 shadow-lg bg-white overflow-hidden">
                <CardHeader className="pb-3 border-b border-slate-100">
                    <CardTitle className="text-base flex items-center gap-2 text-slate-800">
                        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-pink-500 to-rose-500 flex items-center justify-center">
                            <Camera className="w-4 h-4 text-white" />
                        </div>
                        Galeria de Fotos
                        <span className="ml-auto text-xs text-slate-400 font-normal">
                            {photos.length} foto{photos.length > 1 ? 's' : ''}
                        </span>
                    </CardTitle>
                </CardHeader>
                <CardContent className="pt-4">
                    {/* Thumbnail Grid */}
                    <div className="grid grid-cols-3 gap-2">
                        {photos.map((photo, index) => {
                            const typeInfo = typeLabels[photo.type] || typeLabels.proof
                            return (
                                <div
                                    key={index}
                                    onClick={() => setSelectedIndex(index)}
                                    className="relative aspect-square rounded-lg overflow-hidden cursor-pointer group"
                                >
                                    {/* Placeholder Image */}
                                    <div className="w-full h-full bg-gradient-to-br from-slate-200 to-slate-300 flex items-center justify-center">
                                        <ImageIcon className="w-6 h-6 text-slate-400" />
                                    </div>

                                    {/* Overlay */}
                                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors flex items-center justify-center">
                                        <Maximize2 className="w-5 h-5 text-white opacity-0 group-hover:opacity-100 transition-opacity" />
                                    </div>

                                    {/* Type Badge */}
                                    <span className={`absolute top-1 left-1 text-[10px] px-1.5 py-0.5 rounded ${typeInfo.color}`}>
                                        {typeInfo.label}
                                    </span>
                                </div>
                            )
                        })}
                    </div>

                    {/* Info */}
                    <p className="text-xs text-slate-400 text-center mt-3">
                        Clique para ampliar
                    </p>
                </CardContent>
            </Card>

            {/* Full Screen Modal */}
            {selectedPhoto && (
                <div
                    className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4"
                    onClick={() => setSelectedIndex(null)}
                >
                    <div
                        className="relative max-w-3xl w-full"
                        onClick={(e) => e.stopPropagation()}
                    >
                        {/* Close Button */}
                        <button
                            onClick={() => setSelectedIndex(null)}
                            className="absolute -top-12 right-0 p-2 text-white hover:bg-white/10 rounded-full"
                        >
                            <X className="w-6 h-6" />
                        </button>

                        {/* Image */}
                        <div className="bg-slate-800 rounded-xl overflow-hidden aspect-video flex items-center justify-center">
                            <ImageIcon className="w-16 h-16 text-slate-600" />
                        </div>

                        {/* Navigation */}
                        <div className="flex items-center justify-between mt-4">
                            <Button
                                variant="ghost"
                                size="icon"
                                onClick={handlePrevious}
                                className="text-white hover:bg-white/10"
                            >
                                <ChevronLeft className="w-6 h-6" />
                            </Button>

                            <div className="text-center">
                                <p className="text-white font-medium">{selectedPhoto.description}</p>
                                <p className="text-sm text-slate-400">
                                    {new Date(selectedPhoto.timestamp).toLocaleString('pt-BR')}
                                </p>
                            </div>

                            <Button
                                variant="ghost"
                                size="icon"
                                onClick={handleNext}
                                className="text-white hover:bg-white/10"
                            >
                                <ChevronRight className="w-6 h-6" />
                            </Button>
                        </div>

                        {/* Counter */}
                        <div className="flex justify-center gap-1 mt-4">
                            {photos.map((_, index) => (
                                <button
                                    key={index}
                                    onClick={() => setSelectedIndex(index)}
                                    className={`w-2 h-2 rounded-full transition-colors ${index === selectedIndex ? 'bg-white' : 'bg-white/30'
                                        }`}
                                />
                            ))}
                        </div>
                    </div>
                </div>
            )}
        </>
    )
}
