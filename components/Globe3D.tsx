'use client';

import { useEffect, useRef } from 'react';
import createGlobe from 'cobe';

interface GlobeProps {
    size?: number;
}

export default function Globe3D({ size = 300 }: GlobeProps) {
    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        let phi = 0;
        let width = 0;

        const onResize = () => {
            if (canvasRef.current) {
                width = canvasRef.current.offsetWidth;
            }
        };

        window.addEventListener('resize', onResize);
        onResize();

        const globe = createGlobe(canvasRef.current!, {
            devicePixelRatio: 2,
            width: size * 2,
            height: size * 2,
            phi: 0,
            theta: 0.3,
            dark: 1,
            diffuse: 1.2,
            mapSamples: 16000,
            mapBrightness: 12,
            baseColor: [0.05, 0.05, 0.05],
            markerColor: [1, 1, 1],
            glowColor: [0.54, 0.36, 0.97],
            markers: [],
            onRender: (state) => {
                // Auto rotate
                state.phi = phi;
                phi += 0.005;
            },
        });

        return () => {
            globe.destroy();
            window.removeEventListener('resize', onResize);
        };
    }, [size]);

    return (
        <div style={{
            width: size,
            height: size,
            margin: '0 auto',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            position: 'relative',
        }}>
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
