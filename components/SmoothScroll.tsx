'use client';

import { useEffect, useRef, createContext, useContext } from 'react';
import Lenis from 'lenis';
import { useIsMobile } from '@/hooks/useIsMobile';

// Create context to share Lenis instance
const LenisContext = createContext<Lenis | null>(null);

export const useLenis = () => useContext(LenisContext);

interface SmoothScrollProps {
    children: React.ReactNode;
}

export default function SmoothScroll({ children }: SmoothScrollProps) {
    const isMobile = useIsMobile();
    const lenisRef = useRef<Lenis | null>(null);

    useEffect(() => {
        if (isMobile) return;
        // Initialize Lenis with premium settings
        lenisRef.current = new Lenis({
            duration: 1.4,
            easing: (t: number) => {
                // Custom easing - smooth and elegant
                return t === 1 ? 1 : 1 - Math.pow(2, -10 * t);
            },
            orientation: 'vertical',
            gestureOrientation: 'vertical',
            smoothWheel: true,
            wheelMultiplier: 0.8,
            touchMultiplier: 1.5,
            infinite: false,
        });

        // Animation loop
        function raf(time: number) {
            lenisRef.current?.raf(time);
            requestAnimationFrame(raf);
        }

        requestAnimationFrame(raf);

        // Make Lenis globally accessible for navbar
        (window as unknown as { lenis: Lenis }).lenis = lenisRef.current;

        // Cleanup
        return () => {
            lenisRef.current?.destroy();
            delete (window as unknown as { lenis?: Lenis }).lenis;
        };
    }, [isMobile]);

    return (
        <LenisContext.Provider value={lenisRef.current}>
            {children}
        </LenisContext.Provider>
    );
}
