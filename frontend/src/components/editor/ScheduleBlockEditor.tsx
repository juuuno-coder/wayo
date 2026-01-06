import React from 'react';
import { Plus, X, GripVertical } from 'lucide-react';

interface ScheduleBlockEditorProps {
    data: {
        items: Array<{
            id: string;
            time: string;
            title: string;
            description?: string;
        }>;
    };
    onChange: (data: any) => void;
}

export default function ScheduleBlockEditor({ data, onChange }: ScheduleBlockEditorProps) {
    const items = data.items || [];

    const handleAddItem = () => {
        const newItem = {
            id: `schedule-${Date.now()}`,
            time: '14:00',
            title: '새 일정',
            description: ''
        };
        onChange({ ...data, items: [...items, newItem] });
    };

    const handleRemoveItem = (id: string) => {
        onChange({ ...data, items: items.filter(item => item.id !== id) });
    };

    const handleUpdateItem = (id: string, field: string, value: string) => {
        onChange({
            ...data,
            items: items.map(item =>
                item.id === id ? { ...item, [field]: value } : item
            )
        });
    };

    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between">
                <label className="block text-sm font-medium text-gray-700">
                    일정 항목 ({items.length})
                </label>
                <button
                    type="button"
                    onClick={handleAddItem}
                    className="px-3 py-1 bg-blue-500 text-white text-sm rounded-lg hover:bg-blue-600 transition-colors flex items-center gap-1"
                >
                    <Plus size={14} />
                    추가
                </button>
            </div>

            <div className="space-y-3">
                {items.length === 0 ? (
                    <div className="text-center py-8 text-gray-400 border-2 border-dashed border-gray-200 rounded-lg">
                        일정 항목을 추가하세요
                    </div>
                ) : (
                    items.map((item, index) => (
                        <div key={item.id} className="border border-gray-200 rounded-lg p-3 space-y-2 bg-white">
                            <div className="flex items-start gap-2">
                                <div className="pt-2 cursor-move text-gray-400">
                                    <GripVertical size={16} />
                                </div>

                                <div className="flex-1 space-y-2">
                                    <div className="flex gap-2">
                                        <input
                                            type="time"
                                            value={item.time}
                                            onChange={(e) => handleUpdateItem(item.id, 'time', e.target.value)}
                                            className="px-2 py-1 border border-gray-300 rounded text-sm"
                                        />
                                        <input
                                            type="text"
                                            value={item.title}
                                            onChange={(e) => handleUpdateItem(item.id, 'title', e.target.value)}
                                            placeholder="일정 제목"
                                            className="flex-1 px-2 py-1 border border-gray-300 rounded text-sm font-medium"
                                        />
                                    </div>

                                    <textarea
                                        value={item.description || ''}
                                        onChange={(e) => handleUpdateItem(item.id, 'description', e.target.value)}
                                        placeholder="설명 (선택사항)"
                                        rows={2}
                                        className="w-full px-2 py-1 border border-gray-300 rounded text-sm resize-none"
                                    />
                                </div>

                                <button
                                    type="button"
                                    onClick={() => handleRemoveItem(item.id)}
                                    className="p-1 text-red-500 hover:bg-red-50 rounded"
                                >
                                    <X size={16} />
                                </button>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}
