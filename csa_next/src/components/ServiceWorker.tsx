'use client';
import { useEffect } from 'react';

export function ServiceWorker() {
    useEffect(() => {
        if ('serviceWorker' in navigator) {
            navigator.serviceWorker.register('/service-worker.js')
                .then(reg => console.log('Service Worker registered:', reg))
                .catch(err => console.error('SW registration failed:', err));
        }
    }, []);

    return null;
}
