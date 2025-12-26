'use client';

import { useEffect, useRef, useState } from 'react';
import createGlobe from 'cobe';

interface GlobeProps {
    size?: number;
}

export default function Globe3D({ size = 300 }: GlobeProps) {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);
    const [isVisible, setIsVisible] = useState(false);

    // Visibility observer - pause globe when off-screen
    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => setIsVisible(entry.isIntersecting),
            { threshold: 0.1 }
        );
        if (containerRef.current) observer.observe(containerRef.current);
        return () => observer.disconnect();
    }, []);

    useEffect(() => {
        if (!isVisible || !canvasRef.current) return;

        let phi = 0;

        const globe = createGlobe(canvasRef.current, {
            devicePixelRatio: 1.5, // Reduced from 2 for better FPS
            width: size * 1.5,
            height: size * 1.5,
            phi: 0,
            theta: 0.3,
            dark: 1,
            diffuse: 1.2,
            mapSamples: 8000, // Reduced from 16000 for better FPS
            mapBrightness: 12,
            baseColor: [0.05, 0.05, 0.05],
            markerColor: [1, 1, 1],
            glowColor: [0.54, 0.36, 0.97],
            markers: [],
            onRender: (state) => {
                state.phi = phi;
                phi += 0.003; // Slower rotation for less CPU usage
            },
        });

        return () => {
            globe.destroy();
        };
    }, [size, isVisible]);

    return (
        <div
            ref={containerRef}
            style={{
                width: size,
                height: size,
                margin: '0 auto',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                position: 'relative',
            }}
        >
            <canvas
                ref={canvasRef}
                style={{
                    width: size,
                    height: size,
                    contain: 'layout paint size',
                    cursor: 'grab',
                }}
            />
            {/* Glow effect */}
            <div style={{
                position: 'absolute',
                inset: '-15%',
                background: 'radial-gradient(circle, rgba(139, 92, 246, 0.15) 0%, transparent 60%)',
                borderRadius: '50%',
                pointerEvents: 'none',
                zIndex: -1,
            }} />
        </div>
    );
}
