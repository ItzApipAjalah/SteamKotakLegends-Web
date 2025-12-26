'use client';

import dynamic from 'next/dynamic';

// ============================================
// PERFORMANCE CONFIG
// ============================================
const ENABLE_LIQUID_ETHER = true; // Set to true for liquid effect (heavy on GPU)
const ENABLE_ORBS = true;          // Floating orb animations
// ============================================

// Lazy load LiquidEther (heavy Three.js component - ~46KB)
// This reduces initial bundle size and improves LCP
const LiquidEther = dynamic(() => import('./LiquidEther'), {
    ssr: false,
    loading: () => null, // No loading state to avoid layout shift
});

export default function BackgroundElements() {
    return (
        <>
            <div className="bg-gradient"></div>
            <div className="bg-grid"></div>

            {ENABLE_ORBS && (
                <div className="floating-orbs">
                    <div className="orb orb-1"></div>
                    <div className="orb orb-2"></div>
                    <div className="orb orb-3"></div>
                </div>
            )}

            {ENABLE_LIQUID_ETHER && (
                <div style={{ position: 'fixed', inset: 0, width: '100%', height: '100%', zIndex: -1, pointerEvents: 'none' }}>
                    <LiquidEther
                        colors={['#5227FF', '#FF9FFC', '#B19EEF']}
                        mouseForce={20}
                        cursorSize={100}
                        isViscous={false}
                        viscous={30}
                        iterationsViscous={16}
                        iterationsPoisson={16}
                        resolution={0.25}
                        isBounce={false}
                        autoDemo={true}
                        autoSpeed={0.3}
                        autoIntensity={1.5}
                        takeoverDuration={0.25}
                        autoResumeDelay={3000}
                        autoRampDuration={0.6}
                    />
                </div>
            )}
        </>
    );
}
