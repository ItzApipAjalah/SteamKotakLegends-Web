'use client';

import { useEffect, useRef } from 'react';

/**
 * Generate a random Ray ID like Cloudflare
 */
function generateRayId(): string {
    const chars = '0123456789abcdef';
    let result = '';
    for (let i = 0; i < 16; i++) {
        result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
}

/**
 * DevToolsBlocker - Blocks DevTools access in production
 * Redirects to /blocked page with Ray ID when DevTools is detected
 */
export default function DevToolsBlocker() {
    const redirectedRef = useRef(false);

    useEffect(() => {
        // Only block in production
        if (process.env.NODE_ENV !== 'production') {
            return;
        }

        // Skip if already on blocked page
        if (window.location.pathname === '/blocked') {
            return;
        }

        const redirectToBlocked = () => {
            if (redirectedRef.current) return;
            redirectedRef.current = true;

            const rayId = generateRayId();
            window.location.href = `/blocked?ray=${rayId}`;
        };

        const blockDevTools = (e: KeyboardEvent) => {
            // Block F12
            if (e.key === 'F12') {
                e.preventDefault();
                e.stopPropagation();
                redirectToBlocked();
                return false;
            }

            // Block Ctrl+Shift+I (Inspect)
            if (e.ctrlKey && e.shiftKey && (e.key === 'I' || e.key === 'i')) {
                e.preventDefault();
                e.stopPropagation();
                redirectToBlocked();
                return false;
            }

            // Block Ctrl+Shift+J (Console)
            if (e.ctrlKey && e.shiftKey && (e.key === 'J' || e.key === 'j')) {
                e.preventDefault();
                e.stopPropagation();
                redirectToBlocked();
                return false;
            }

            // Block Ctrl+Shift+C (Element picker)
            if (e.ctrlKey && e.shiftKey && (e.key === 'C' || e.key === 'c')) {
                e.preventDefault();
                e.stopPropagation();
                redirectToBlocked();
                return false;
            }

            // Block Ctrl+U (View Source)
            if (e.ctrlKey && (e.key === 'u' || e.key === 'U')) {
                e.preventDefault();
                e.stopPropagation();
                redirectToBlocked();
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

        // Disable console methods in production
        const noop = () => { };
        const methods = ['log', 'debug', 'info', 'warn', 'error', 'table', 'trace', 'dir', 'group', 'groupEnd', 'time', 'timeEnd', 'count', 'assert'];

        methods.forEach((method) => {
            // @ts-ignore
            console[method] = noop;
        });

        // DevTools detection using size check
        let devtoolsCheckInterval: NodeJS.Timeout;

        const checkDevTools = () => {
            const threshold = 160;
            const widthThreshold = window.outerWidth - window.innerWidth > threshold;
            const heightThreshold = window.outerHeight - window.innerHeight > threshold;

            if (widthThreshold || heightThreshold) {
                redirectToBlocked();
            }
        };

        // Check every 500ms
        devtoolsCheckInterval = setInterval(checkDevTools, 500);

        // Initial check after a small delay
        setTimeout(checkDevTools, 1000);

        return () => {
            document.removeEventListener('keydown', blockDevTools, { capture: true });
            clearInterval(devtoolsCheckInterval);
        };
    }, []);

    return null;
}
