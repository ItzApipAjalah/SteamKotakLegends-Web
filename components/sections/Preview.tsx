'use client';

import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import dynamic from 'next/dynamic';

// Lazy load 3D Globe
const Globe3D = dynamic(() => import('@/components/Globe3D'), {
    ssr: false,
    loading: () => (
        <div style={{
            width: 320,
            height: 320,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: 'radial-gradient(circle, rgba(139, 92, 246, 0.1) 0%, transparent 70%)',
            borderRadius: '50%',
        }}>
            <div style={{
                width: 40,
                height: 40,
                border: '3px solid rgba(139, 92, 246, 0.3)',
                borderTopColor: '#8b5cf6',
                borderRadius: '50%',
                animation: 'spin 1s linear infinite',
            }} />
        </div>
    ),
});

const APP_PREVIEWS = [
    { id: 'main', src: '/preview-main.png', alt: 'SteamKotakLegends Main Interface', label: 'Main' },
    { id: 'freegames', src: '/preview-freegames.png', alt: 'Free Games Feature', label: 'Free Games' },
    { id: 'profile', src: '/preview-profile.png', alt: 'Profile Dashboard', label: 'Profile' },
    { id: 'sam', src: '/preview-sam.png', alt: 'Steam Achievement Manager', label: 'SAM' },
    { id: 'spoofer', src: '/preview-spoofer.png', alt: 'AppID Spoofer', label: 'Spoofer' },
];

import { motion, AnimatePresence, useMotionValue, useSpring, useTransform } from 'framer-motion';

export default function Preview() {
    const [activeIdx, setActiveIdx] = useState(0);
    const [isInView, setIsInView] = useState(false);
    const [totalGames, setTotalGames] = useState<number | null>(null);
    const [totalUsers, setTotalUsers] = useState<number | null>(null);
    const [totalValueSaved, setTotalValueSaved] = useState<string | null>(null);
    const [isTyping, setIsTyping] = useState(false);
    const [displayValue, setDisplayValue] = useState<string>('');
    const [currencyIndex, setCurrencyIndex] = useState(0); // 0=USD, 1=IDR, 2=JPY, 3=MYR, 4=SGD
    const sectionRef = useRef<HTMLElement>(null);
    const [exchangeRates, setExchangeRates] = useState<{ IDR: number; JPY: number; MYR: number; SGD: number }>({
        IDR: 16000, JPY: 157, MYR: 4.47, SGD: 1.35
    });

    // Fetch real-time exchange rates
    useEffect(() => {
        fetch('https://api.frankfurter.app/latest?from=USD&to=IDR,JPY,MYR,SGD')
            .then(res => res.json())
            .then(data => {
                if (data.rates) {
                    setExchangeRates({
                        IDR: data.rates.IDR || 16000,
                        JPY: data.rates.JPY || 157,
                        MYR: data.rates.MYR || 4.47,
                        SGD: data.rates.SGD || 1.35,
                    });
                }
            })
            .catch(err => console.error('Failed to fetch exchange rates:', err));
    }, []);

    // Convert USD string to other currencies
    const convertCurrency = (usdString: string, currency: number): string => {
        const usdAmount = parseFloat(usdString.replace('$', '').replace(',', ''));

        switch (currency) {
            case 1: // IDR
                const idrAmount = Math.round(usdAmount * exchangeRates.IDR);
                return `Rp ${idrAmount.toLocaleString('id-ID')}`;
            case 2: // JPY
                const jpyAmount = Math.round(usdAmount * exchangeRates.JPY);
                return `¥${jpyAmount.toLocaleString('ja-JP')}`;
            case 3: // MYR
                const myrAmount = (usdAmount * exchangeRates.MYR).toFixed(2);
                return `RM ${parseFloat(myrAmount).toLocaleString('ms-MY')}`;
            case 4: // SGD
                const sgdAmount = (usdAmount * exchangeRates.SGD).toFixed(2);
                return `S$${parseFloat(sgdAmount).toLocaleString('en-SG')}`;
            default: // USD
                return usdString;
        }
    };

    // Typing animation effect with delete first
    useEffect(() => {
        if (!totalValueSaved) return;

        const targetValue = convertCurrency(totalValueSaved, currencyIndex);
        const currentValue = displayValue || '';

        setIsTyping(true);

        // Phase 1: Delete current text
        let deleteIndex = currentValue.length;
        const deleteInterval = setInterval(() => {
            if (deleteIndex > 0) {
                deleteIndex--;
                setDisplayValue(currentValue.slice(0, deleteIndex));
            } else {
                clearInterval(deleteInterval);

                // Phase 2: Type new text
                let typeIndex = 0;
                const typeInterval = setInterval(() => {
                    if (typeIndex <= targetValue.length) {
                        setDisplayValue(targetValue.slice(0, typeIndex));
                        typeIndex++;
                    } else {
                        clearInterval(typeInterval);
                        setIsTyping(false);
                    }
                }, 40);
            }
        }, 30);

        return () => clearInterval(deleteInterval);
    }, [currencyIndex, totalValueSaved]);

    // Cycle through currencies every 4 seconds
    useEffect(() => {
        if (!totalValueSaved) return;

        const toggleInterval = setInterval(() => {
            setCurrencyIndex(prev => (prev + 1) % 5);
        }, 4000);

        return () => clearInterval(toggleInterval);
    }, [totalValueSaved]);


    // Fetch stats
    useEffect(() => {
        fetch('https://sauth.kotaklegend.my.id/stats/total')
            .then(res => res.json())
            .then(data => {
                if (data.success && data.data) {
                    setTotalGames(data.data.grand_total ?? null);
                    setTotalUsers(data.data.total_user ?? null);
                    setTotalValueSaved(data.data.total_value_saved ?? null);
                }
            })
            .catch(err => console.error('Failed to fetch stats:', err));
    }, []);

    // Mouse tracking for 3D tilt - optimized for performance
    const mouseX = useMotionValue(0);
    const mouseY = useMotionValue(0);
    const springX = useSpring(mouseX, { stiffness: 50, damping: 30 }); // Smoother, less CPU
    const springY = useSpring(mouseY, { stiffness: 50, damping: 30 });
    const rotateX = useTransform(springY, [-400, 400], [5, -5]); // Reduced tilt range
    const rotateY = useTransform(springX, [-400, 400], [-8, 8]);

    const handleMouseMove = (e: React.MouseEvent) => {
        if (!sectionRef.current) return;
        const rect = sectionRef.current.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;
        mouseX.set(e.clientX - centerX);
        mouseY.set(e.clientY - centerY);
    };

    const handleMouseLeave = () => {
        mouseX.set(0);
        mouseY.set(0);
    };

    // Auto-advance
    useEffect(() => {
        if (!isInView) return;
        const timer = setInterval(() => {
            setActiveIdx((prev) => (prev + 1) % APP_PREVIEWS.length);
        }, 5000);
        return () => clearInterval(timer);
    }, [isInView]);

    // Intersection Observer
    useEffect(() => {
        const observer = new IntersectionObserver(([entry]) => {
            if (entry.isIntersecting) setIsInView(true);
        }, { threshold: 0.1 });
        if (sectionRef.current) observer.observe(sectionRef.current);
        return () => observer.disconnect();
    }, []);

    return (
        <>
            <style jsx>{`
                .preview-section {
                    padding: 120px 0 240px;
                    position: relative;
                    z-index: 1;
                    isolation: isolate;
                    /* Removed overflow: hidden to prevent 3D clipping */
                    background: radial-gradient(circle at 100% 100%, rgba(139, 92, 246, 0.04) 0%, transparent 40%);
                }

                .section-header {
                    position: relative;
                    z-index: 50;
                    margin-bottom: 80px;
                }

                .container {
                    max-width: 1400px;
                    margin: 0 auto;
                    padding: 0 24px;
                    position: relative;
                    z-index: 1;
                }

                .preview-grid {
                    display: grid;
                    grid-template-columns: 1fr 0.8fr;
                    gap: 120px;
                    align-items: center;
                }

                /* 3D Gallery Side */
                .gallery-3d-side {
                    position: relative;
                    perspective: 2000px;
                    width: 100%;
                    height: 700px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    transform-style: preserve-3d;
                }

                .card-stack {
                    position: relative;
                    width: 100%;
                    max-width: 600px;
                    aspect-ratio: 16/10;
                    transform-style: preserve-3d;
                }

                .preview-tilt-card {
                    position: absolute;
                    inset: 0;
                    border-radius: 24px;
                    overflow: hidden;
                    background: #0a0614;
                    /* Modern Border & Reflection */
                    border: 1px solid rgba(255, 255, 255, 0.08);
                    box-shadow: 
                        0 30px 60px -12px rgba(0, 0, 0, 0.5),
                        0 18px 36px -18px rgba(0, 0, 0, 0.5),
                        0 0 40px -10px rgba(139, 92, 246, 0.15);
                    cursor: pointer;
                    /* Performance optimizations */
                    will-change: transform, opacity;
                    backface-visibility: hidden;
                    -webkit-backface-visibility: hidden;
                }

                /* Inner Glow / Glass Border Effect */
                .preview-tilt-card::before {
                    content: '';
                    position: absolute;
                    inset: 0;
                    border-radius: 24px;
                    padding: 1px;
                    background: linear-gradient(
                        135deg, 
                        rgba(255, 255, 255, 0.15), 
                        transparent 40%, 
                        transparent 60%, 
                        rgba(139, 92, 246, 0.2)
                    );
                    -webkit-mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
                    mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
                    -webkit-mask-composite: xor;
                    mask-composite: exclude;
                    pointer-events: none;
                    z-index: 2;
                }

                /* Light Sweep / Lens Flare Effect */
                .preview-tilt-card::after {
                    content: '';
                    position: absolute;
                    top: 0;
                    left: -100%;
                    width: 50%;
                    height: 100%;
                    background: linear-gradient(
                        90deg,
                        transparent,
                        rgba(255, 255, 255, 0.05),
                        transparent
                    );
                    transform: skewX(-25deg);
                    transition: none;
                    pointer-events: none;
                    z-index: 3;
                }

                .preview-tilt-card:hover::after {
                    left: 200%;
                    transition: left 0.8s ease-in-out;
                }

                .preview-tilt-card img {
                    /* Ultra-HD Smoothing & Enhancement */
                    filter: 
                        contrast(1.15) 
                        saturate(1.25) 
                        brightness(1.1)
                        drop-shadow(0 0 1px rgba(255, 255, 255, 0.15));
                    image-rendering: auto;
                    image-rendering: -webkit-optimize-contrast;
                    transition: all 0.5s cubic-bezier(0.4, 0, 0.2, 1);
                }

                .preview-tilt-card:hover img {
                    filter: 
                        contrast(1.25) 
                        saturate(1.4) 
                        brightness(1.18)
                        drop-shadow(0 0 2px rgba(255, 255, 255, 0.25));
                }

                /* Right Side */
                .content-side {
                    display: flex;
                    flex-direction: column;
                    align-items: flex-start;
                    text-align: left;
                }

                .title {
                    font-family: var(--font-heading);
                    font-size: 3.5rem;
                    font-weight: 800;
                    color: white;
                    margin-bottom: 24px;
                    letter-spacing: -0.04em;
                    line-height: 1.1;
                }

                .desc {
                    color: rgba(255, 255, 255, 0.5);
                    font-size: 1.2rem;
                    line-height: 1.7;
                    margin-bottom: 40px;
                    max-width: 500px;
                }

                .glow-text {
                    background: linear-gradient(90deg, #a855f7, #c084fc);
                    -webkit-background-clip: text;
                    -webkit-text-fill-color: transparent;
                }

                .nav-indicators {
                    display: flex;
                    gap: 16px;
                    margin-top: 40px;
                    width: 100%;
                    justify-content: center;
                }

                .nav-dot {
                    width: 30px;
                    height: 4px;
                    background: rgba(255, 255, 255, 0.1);
                    border-radius: 2px;
                    transition: all 0.4s ease;
                    cursor: pointer;
                }

                .nav-dot.active {
                    background: #a855f7;
                    width: 60px;
                    box-shadow: 0 0 15px rgba(168, 85, 247, 0.4);
                }

                @media (max-width: 1200px) {
                    .preview-section { padding: 120px 0; }
                    .preview-grid { grid-template-columns: 1fr; gap: 40px; }
                    .content-side { align-items: center; text-align: center; }
                    .gallery-3d-side { height: 480px; }
                    .title { font-size: 2.8rem; }
                }

                @media (max-width: 640px) {
                    .gallery-3d-side { height: 300px; }
                    .title { font-size: 2.2rem; }
                    .preview-tilt-card { border-radius: 12px; }
                }
            `}</style>

            <section
                className={`preview-section ${isInView ? 'active' : ''}`}
                id="preview"
                ref={sectionRef}
                onMouseMove={handleMouseMove}
                onMouseLeave={handleMouseLeave}
            >
                <div className="section-header">
                    <span className="section-badge">App Preview</span>
                    <h2 className="section-title">See it in Action</h2>
                    <p className="section-subtitle">A modern, sleek interface designed for the ultimate gaming experience.</p>
                </div>
                <div className="container">
                    <div className="preview-grid">
                        {/* Left Side - 3D Perspective Card Stack */}
                        <div className="gallery-3d-side">
                            <motion.div
                                className="card-stack"
                                style={{
                                    rotateX,
                                    rotateY,
                                    transformStyle: 'preserve-3d',
                                }}
                            >
                                <AnimatePresence mode="popLayout">
                                    {APP_PREVIEWS.map((img, i) => {
                                        // Simple stacking logic: active in front, others tucked behind
                                        const isPrev = (activeIdx - 1 + APP_PREVIEWS.length) % APP_PREVIEWS.length === i;
                                        const isNext = (activeIdx + 1) % APP_PREVIEWS.length === i;
                                        const isActive = i === activeIdx;

                                        if (!isActive && !isPrev && !isNext) return null;

                                        return (
                                            <motion.div
                                                key={img.id}
                                                className="preview-tilt-card"
                                                initial={{
                                                    opacity: 0,
                                                    scale: 0.95,
                                                    z: -100,
                                                    x: isNext ? 60 : -60,
                                                    rotateY: isNext ? 10 : -10
                                                }}
                                                animate={{
                                                    opacity: isActive ? 1 : 0.4,
                                                    scale: isActive ? 1 : 0.88,
                                                    z: isActive ? 0 : -150,
                                                    x: isActive ? 0 : (isNext ? 50 : -50),
                                                    y: isActive ? 0 : 20,
                                                    rotateY: isActive ? 0 : (isNext ? 8 : -8),
                                                    filter: isActive ? 'blur(0px)' : 'blur(8px)',
                                                }}
                                                exit={{
                                                    opacity: 0,
                                                    scale: 0.9,
                                                    z: -200,
                                                    transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] }
                                                }}
                                                transition={{
                                                    type: 'spring',
                                                    stiffness: 45,
                                                    damping: 22,
                                                    mass: 1.5,
                                                    opacity: { duration: 0.8 },
                                                    filter: { duration: 1.0 }
                                                }}
                                                style={{ zIndex: isActive ? 10 : 1 }}
                                                onClick={() => setActiveIdx(i)}
                                            >
                                                <Image
                                                    src={img.src}
                                                    alt={img.alt}
                                                    width={1024}
                                                    height={640}
                                                    priority={isActive}
                                                    unoptimized={true}
                                                    style={{
                                                        width: '100%',
                                                        height: '100%',
                                                        objectFit: 'cover'
                                                    }}
                                                />
                                            </motion.div>
                                        );
                                    })}
                                </AnimatePresence>
                            </motion.div>
                        </div>

                        {/* Right Side - Content */}
                        <div className="content-side">
                            <motion.h2
                                className="title"
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                            >
                                Premium <span className="glow-text">Perspective.</span>
                            </motion.h2>
                            <motion.p
                                className="desc"
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: 0.1 }}
                            >
                                Experience the future of gaming management. Our interface is designed
                                to be as powerful as it is beautiful. Fast, and always evolving.
                                {/* Stats Data */}
                                {(totalGames !== null || totalUsers !== null || totalValueSaved !== null) && (
                                    <>
                                        <span style={{ display: 'block', marginTop: '12px', color: 'rgba(255, 255, 255, 0.5)' }}>
                                            {totalGames !== null && (
                                                <><span style={{ color: '#a78bfa', fontWeight: 600 }}>{totalGames.toLocaleString()}</span> games injected</>)}
                                            {totalGames !== null && totalUsers !== null && ' • '}
                                            {totalUsers !== null && (
                                                <><span style={{ color: '#a78bfa', fontWeight: 600 }}>{totalUsers.toLocaleString()}</span> users</>)}
                                            {(totalGames !== null || totalUsers !== null) && totalValueSaved !== null && ' • '}
                                            {totalValueSaved !== null && (
                                                <>
                                                    <span style={{
                                                        color: '#22c55e',
                                                        fontWeight: 600,
                                                    }}>
                                                        {displayValue}
                                                        {isTyping && <span style={{ opacity: 0.7 }}>|</span>}
                                                    </span> saved
                                                </>)}
                                        </span>
                                        <span style={{ display: 'block', marginTop: '6px', fontSize: '0.75rem', color: 'rgba(255, 255, 255, 0.25)' }}>
                                            Stats refresh every hour
                                        </span>
                                    </>
                                )}
                            </motion.p>


                            <Globe3D size={420} />

                            <div className="nav-indicators">
                                {APP_PREVIEWS.map((_, i) => (
                                    <div
                                        key={i}
                                        className={`nav-dot ${i === activeIdx ? 'active' : ''}`}
                                        onClick={() => setActiveIdx(i)}
                                    />
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </>
    );
}
