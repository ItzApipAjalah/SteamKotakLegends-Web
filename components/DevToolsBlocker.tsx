'use client';

import { useEffect } from 'react';

/**
 * DevToolsBlocker - Blocks DevTools shortcuts in production
 * Only blocks keyboard shortcuts, no detection/redirect
 */
export default function DevToolsBlocker() {
    useEffect(() => {
        // Only block in production
        if (process.env.NODE_ENV !== 'production') {
            return;
        }

        const blockDevTools = (e: KeyboardEvent) => {
            // Block F12
            if (e.key === 'F12') {
                e.preventDefault();
                e.stopPropagation();
                return false;
            }

            // Block Ctrl+Shift+I (Inspect)
            if (e.ctrlKey && e.shiftKey && (e.key === 'I' || e.key === 'i')) {
                e.preventDefault();
                e.stopPropagation();
                return false;
            }

            // Block Ctrl+Shift+J (Console)
            if (e.ctrlKey && e.shiftKey && (e.key === 'J' || e.key === 'j')) {
                e.preventDefault();
                e.stopPropagation();
                return false;
            }

            // Block Ctrl+Shift+C (Element picker)
            if (e.ctrlKey && e.shiftKey && (e.key === 'C' || e.key === 'c')) {
                e.preventDefault();
                e.stopPropagation();
                return false;
            }

            // Block Ctrl+U (View Source)
            if (e.ctrlKey && (e.key === 'u' || e.key === 'U')) {
                e.preventDefault();
                e.stopPropagation();
                return false;
            }

            // Block Ctrl+S (Save page)
            if (e.ctrlKey && !e.shiftKey && (e.key === 's' || e.key === 'S')) {
                e.preventDefault();
                e.stopPropagation();
                return false;
            }
        };

        // Add listener with capture to catch early
        document.addEventListener('keydown', blockDevTools, { capture: true });

        return () => {
            document.removeEventListener('keydown', blockDevTools, { capture: true });
        };
    }, []);

    return null;
}
