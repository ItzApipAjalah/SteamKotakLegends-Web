'use client';

import { useEffect, useRef } from 'react';
import Lenis from 'lenis';

interface SmoothScrollProps {
    children: React.ReactNode;
}

export default function SmoothScroll({ children }: SmoothScrollProps) {
    const lenisRef = useRef<Lenis | null>(null);

    useEffect(() => {
        // Initialize Lenis smooth scroll
        lenisRef.current = new Lenis({
            duration: 1.2,
            easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), // Expo easing
            orientation: 'vertical',
            gestureOrientation: 'vertical',
            smoothWheel: true,
            wheelMultiplier: 1,
            touchMultiplier: 2,
            infinite: false,
        });

        // Animation loop
        function raf(time: number) {
            lenisRef.current?.raf(time);
            requestAnimationFrame(raf);
        }

        requestAnimationFrame(raf);

        // Handle anchor links for smooth scrolling
        const handleAnchorClick = (e: MouseEvent) => {
            const target = e.target as HTMLElement;
            const anchor = target.closest('a[href^="#"]') as HTMLAnchorElement;

            if (anchor) {
                const href = anchor.getAttribute('href');
                if (href && href !== '#') {
                    e.preventDefault();
                    const targetElement = document.querySelector(href);
                    if (targetElement) {
                        lenisRef.current?.scrollTo(targetElement as HTMLElement, {
                            offset: -80, // Account for navbar
                            duration: 1.5,
                        });
                    }
                }
            }
        };

        document.addEventListener('click', handleAnchorClick);

        // Cleanup
        return () => {
            lenisRef.current?.destroy();
            document.removeEventListener('click', handleAnchorClick);
        };
    }, []);

    return <>{children}</>;
}
