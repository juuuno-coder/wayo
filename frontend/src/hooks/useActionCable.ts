import { useEffect, useRef } from 'react';
import { createConsumer, Consumer, Subscription } from '@rails/actioncable';
import { API_BASE_URL } from '@/config';

const WEBSOCKET_URL = API_BASE_URL.replace(/^http/, 'ws') + '/cable';

// ActionCable WebSockets don't easily support custom headers, so we pass the token via query params.
// The backend ApplicationCable::Connection must be configured to read from params[:token].

export const useActionCable = (token: string | null, onMessage: (data: any) => void) => {
    const consumerRef = useRef<Consumer | null>(null);
    const subscriptionRef = useRef<Subscription | null>(null);
    const onMessageRef = useRef(onMessage);

    // Update effect for the message handler to avoid unnecessary subscription restarts
    useEffect(() => {
        onMessageRef.current = onMessage;
    }, [onMessage]);

    useEffect(() => {
        if (!token) {
            if (consumerRef.current) {
                consumerRef.current.disconnect();
                consumerRef.current = null;
            }
            return;
        }

        console.log('[ActionCable] Connecting to', WEBSOCKET_URL);

        // Create consumer with token in query params
        const url = `${WEBSOCKET_URL}?token=${token}`;
        consumerRef.current = createConsumer(url);

        subscriptionRef.current = consumerRef.current.subscriptions.create(
            { channel: 'InvitationChannel' },
            {
                received: (data: any) => {
                    console.log('[ActionCable] Received:', data);
                    onMessageRef.current(data);
                },
                connected: () => {
                    console.log('[ActionCable] Connected to InvitationChannel');
                },
                disconnected: () => {
                    console.log('[ActionCable] Disconnected from InvitationChannel');
                },
                rejected: () => {
                    console.error('[ActionCable] Connection Rejected');
                }
            }
        );

        return () => {
            console.log('[ActionCable] Cleaning up connection');
            if (subscriptionRef.current) {
                subscriptionRef.current.unsubscribe();
            }
            if (consumerRef.current) {
                consumerRef.current.disconnect();
            }
        };
    }, [token]);
};
