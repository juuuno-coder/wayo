import React, { useState } from 'react';
import NextImage from 'next/image';
import { X } from 'lucide-react';

interface GalleryBlockProps {
    block: {
        id: string;
        type: 'gallery';
        data: {
            images: Array<{
                id: string;
                url: string;
                caption?: string;
            }>;
            layout?: 'grid' | 'carousel';
            columns?: number;
        };
    };
}

export default function GalleryBlock({ block }: GalleryBlockProps) {
    const { images = [], layout = 'grid', columns = 3 } = block.data;
    const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

    if (images.length === 0) {
        return null;
    }

    const gridCols = {
        2: 'grid-cols-2',
        3: 'grid-cols-2 md:grid-cols-3',
        4: 'grid-cols-2 md:grid-cols-4'
    }[columns] || 'grid-cols-3';

    if (layout === 'carousel') {
        return (
            <div className="w-full px-4 py-6">
                <div className="max-w-4xl mx-auto">
                    <div className="relative overflow-x-auto">
                        <div className="flex gap-4 pb-4">
                            {images.map((image, index) => (
                                <div
                                    key={image.id}
                                    className="flex-shrink-0 w-80 cursor-pointer"
                                    onClick={() => setLightboxIndex(index)}
                                >
                                    <div className="relative aspect-[4/3] rounded-lg overflow-hidden shadow-md hover:shadow-xl transition-shadow">
                                        <NextImage
                                            src={image.url}
                                            alt={image.caption || `Gallery image ${index + 1}`}
                                            fill
                                            unoptimized
                                            className="object-cover"
                                        />
                                    </div>
                                    {image.caption && (
                                        <p className="mt-2 text-sm text-gray-600 text-center">{image.caption}</p>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <>
            <div className="w-full px-4 py-6">
                <div className={`grid ${gridCols} gap-4 max-w-6xl mx-auto`}>
                    {images.map((image, index) => (
                        <div
                            key={image.id}
                            className="cursor-pointer group"
                            onClick={() => setLightboxIndex(index)}
                        >
                            <div className="relative aspect-square rounded-lg overflow-hidden shadow-md group-hover:shadow-xl transition-shadow">
                                <NextImage
                                    src={image.url}
                                    alt={image.caption || `Gallery image ${index + 1}`}
                                    fill
                                    unoptimized
                                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                                />
                            </div>
                            {image.caption && (
                                <p className="mt-2 text-sm text-gray-600 text-center">{image.caption}</p>
                            )}
                        </div>
                    ))}
                </div>
            </div>

            {/* Lightbox */}
            {lightboxIndex !== null && (
                <div
                    className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4"
                    onClick={() => setLightboxIndex(null)}
                >
                    <button
                        className="absolute top-4 right-4 text-white hover:text-gray-300 transition-colors"
                        onClick={() => setLightboxIndex(null)}
                    >
                        <X size={32} />
                    </button>
                    <div className="relative max-w-5xl max-h-[90vh] w-full h-full">
                        <NextImage
                            src={images[lightboxIndex].url}
                            alt={images[lightboxIndex].caption || 'Gallery image'}
                            fill
                            unoptimized
                            className="object-contain"
                        />
                    </div>
                    {images[lightboxIndex].caption && (
                        <div className="absolute bottom-8 left-0 right-0 text-center">
                            <p className="text-white text-lg">{images[lightboxIndex].caption}</p>
                        </div>
                    )}
                </div>
            )}
        </>
    );
}
