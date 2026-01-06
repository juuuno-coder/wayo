import React, { useState } from 'react';
import { CheckCircle2 } from 'lucide-react';

interface RSVPBlockProps {
    block: {
        id: string;
        type: 'rsvp';
        data: {
            buttonText?: string;
            deadline?: string;
            fields?: {
                name: boolean;
                message: boolean;
                phone: boolean;
            };
        };
    };
    invitationId?: string;
}

export default function RSVPBlock({ block, invitationId }: RSVPBlockProps) {
    const { buttonText = '참석 여부 알려주기', fields = { name: true, message: true, phone: false } } = block.data;
    const [hasResponded, setHasResponded] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        message: '',
        phone: ''
    });
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!invitationId) return;

        setIsSubmitting(true);
        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3401'}/invitations/${invitationId}/guests`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('authToken') || ''}`
                },
                body: JSON.stringify({
                    guest: {
                        name: formData.name,
                        message: formData.message,
                        phone: formData.phone || undefined,
                        status: 'attending'
                    }
                })
            });

            if (response.ok) {
                const data = await response.json();
                localStorage.setItem(`wayo_guest_${invitationId}`, String(data.id));
                setHasResponded(true);
            } else {
                alert('참석 등록에 실패했습니다. 다시 시도해주세요.');
            }
        } catch (error) {
            console.error('RSVP failed:', error);
            alert('서버 오류가 발생했습니다.');
        } finally {
            setIsSubmitting(false);
        }
    };

    if (hasResponded) {
        return (
            <div className="w-full px-6 py-8">
                <div className="max-w-md mx-auto bg-green-50 rounded-2xl p-8 text-center border-2 border-green-200">
                    <CheckCircle2 size={48} className="text-green-500 mx-auto mb-4" />
                    <h3 className="text-xl font-bold text-gray-900 mb-2">참석이 확인되었습니다!</h3>
                    <p className="text-gray-600">소중한 발걸음 기다리겠습니다.</p>
                </div>
            </div>
        );
    }

    return (
        <div className="w-full px-6 py-8">
            <div className="max-w-md mx-auto bg-white rounded-2xl p-8 shadow-lg border border-gray-100">
                <h3 className="text-2xl font-bold text-gray-900 mb-6 text-center">참석 여부를 알려주세요</h3>

                <form onSubmit={handleSubmit} className="space-y-4">
                    {fields.name && (
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                이름 <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="text"
                                required
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                placeholder="홍길동"
                            />
                        </div>
                    )}

                    {fields.phone && (
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                연락처
                            </label>
                            <input
                                type="tel"
                                value={formData.phone}
                                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                placeholder="010-1234-5678"
                            />
                        </div>
                    )}

                    {fields.message && (
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                축하 메시지
                            </label>
                            <textarea
                                value={formData.message}
                                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                                rows={3}
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                                placeholder="축하의 메시지를 남겨주세요"
                            />
                        </div>
                    )}

                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className="w-full py-4 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
                    >
                        {isSubmitting ? '등록 중...' : buttonText}
                    </button>
                </form>
            </div>
        </div>
    );
}
