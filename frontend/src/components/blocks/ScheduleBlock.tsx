import React from 'react';
import { Clock } from 'lucide-react';

interface ScheduleBlockProps {
    block: {
        id: string;
        type: 'schedule';
        data: {
            items: Array<{
                id: string;
                time: string;
                title: string;
                description?: string;
            }>;
        };
    };
}

export default function ScheduleBlock({ block }: ScheduleBlockProps) {
    const { items = [] } = block.data;

    if (items.length === 0) {
        return null;
    }

    return (
        <div className="w-full px-6 py-8">
            <div className="max-w-3xl mx-auto">
                <div className="space-y-6">
                    {items.map((item, index) => (
                        <div key={item.id} className="flex gap-6 group">
                            {/* Timeline */}
                            <div className="flex flex-col items-center">
                                <div className="flex items-center justify-center w-12 h-12 rounded-full bg-blue-100 text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                                    <Clock size={20} />
                                </div>
                                {index < items.length - 1 && (
                                    <div className="w-0.5 flex-1 bg-gray-200 mt-2" style={{ minHeight: '40px' }} />
                                )}
                            </div>

                            {/* Content */}
                            <div className="flex-1 pb-8">
                                <div className="bg-white rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow border border-gray-100">
                                    <div className="flex items-baseline gap-3 mb-2">
                                        <span className="text-sm font-bold text-blue-600 bg-blue-50 px-3 py-1 rounded-full">
                                            {item.time}
                                        </span>
                                        <h3 className="text-lg font-bold text-gray-900">{item.title}</h3>
                                    </div>
                                    {item.description && (
                                        <p className="text-gray-600 mt-2 leading-relaxed">{item.description}</p>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
