import { Metadata } from 'next';
import { API_BASE_URL } from '@/config';
import InvitationDetailPageClient from './InvitationDetailPageClient';

async function getInvitation(id: string) {
    const res = await fetch(`${API_BASE_URL}/invitations/${id}`, {
        cache: 'no-store'
    });
    if (!res.ok) return null;
    return res.json();
}

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
    const { id } = await params;
    const invitation = await getInvitation(id);

    if (!invitation) {
        return {
            title: '초대장을 찾을 수 없습니다 | 가보자고 Wayo',
        };
    }

    const hostName = invitation.user?.nickname || "친구";
    const imageUrl = invitation.image_urls?.[0] || invitation.cover_image_url || "https://gabojago.fly.dev/images/wayo_envelope_3d.png";

    return {
        title: `${hostName}님이 당신을 초대합니다! | ${invitation.title}`,
        description: invitation.description || '가보자고에서 만든 특별한 초대장을 확인해보세요.',
        openGraph: {
            title: `${hostName}님이 당신을 초대합니다!`,
            description: invitation.description || '가보자고에서 만든 특별한 초대장을 확인해보세요.',
            images: [
                {
                    url: imageUrl,
                    width: 1200,
                    height: 630,
                    alt: invitation.title,
                },
            ],
            type: 'website',
        },
        twitter: {
            card: 'summary_large_image',
            title: `${hostName}님이 당신을 초대합니다!`,
            description: invitation.description || '가보자고에서 만든 특별한 초대장을 확인해보세요.',
            images: [imageUrl],
        },
    };
}

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const invitation = await getInvitation(id);

    if (!invitation) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="text-center">
                    <h1 className="text-2xl font-bold text-gray-900 mb-4">초대장을 찾을 수 없습니다</h1>
                    <p className="text-gray-600">올바른 링크인지 다시 확인해주세요.</p>
                </div>
            </div>
        );
    }

    return <InvitationDetailPageClient initialInvitation={invitation} params={params} />;
}
