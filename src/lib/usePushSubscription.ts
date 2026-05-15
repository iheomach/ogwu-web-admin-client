import { useEffect } from 'react';
import { supabase } from './supabase';

const VAPID_PUBLIC_KEY = import.meta.env.VITE_VAPID_PUBLIC_KEY as string | undefined;

function urlBase64ToUint8Array(base64String: string): ArrayBuffer {
  const padding = '='.repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/');
  const raw = atob(base64);
  const arr = new Uint8Array([...raw].map((c) => c.charCodeAt(0)));
  return arr.buffer as ArrayBuffer;
}

export function usePushSubscription(hospitalId: string | null) {
  useEffect(() => {
    if (!hospitalId || !VAPID_PUBLIC_KEY) return;
    if (!('serviceWorker' in navigator) || !('PushManager' in window)) return;

    (async () => {
      try {
        const permission = await Notification.requestPermission();
        if (permission !== 'granted') return;

        const reg = await navigator.serviceWorker.register('/sw.js');
        await navigator.serviceWorker.ready;

        const existing = await reg.pushManager.getSubscription();
        const subscription = existing ?? await reg.pushManager.subscribe({
          userVisibleOnly: true,
          applicationServerKey: urlBase64ToUint8Array(VAPID_PUBLIC_KEY),
        });

        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return;

        await supabase.from('push_subscriptions').upsert(
          { user_id: user.id, hospital_id: hospitalId, subscription: subscription.toJSON() },
          { onConflict: 'user_id' },
        );
      } catch (err) {
        console.error('[push] subscription error:', (err as Error)?.message);
      }
    })();
  }, [hospitalId]);
}
