'use client';

import { useEffect } from 'react';

export function ServiceWorker() {
    useEffect(() => {
        if ('serviceWorker' in navigator) {
            navigator.serviceWorker.register('/service-worker.js');
        }
    }, []);

    return null;
}