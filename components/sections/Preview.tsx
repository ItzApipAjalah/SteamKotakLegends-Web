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
    const sectionRef = useRef<HTMLElement>(null);

    // Mouse tracking for 3D tilt
    const mouseX = useMotionValue(0);
    const mouseY = useMotionValue(0);
    const springX = useSpring(mouseX, { stiffness: 100, damping: 30 });
    const springY = useSpring(mouseY, { stiffness: 100, damping: 30 });
    const rotateX = useTransform(springY, [-300, 300], [10, -10]);
    const rotateY = useTransform(springX, [-300, 300], [-15, 15]);

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
                    border-radius: 20px;
                    overflow: hidden;
                    border: 1px solid rgba(255, 255, 255, 0.1);
                    background: #0a0614;
                    box-shadow: 
                        0 20px 40px rgba(0, 0, 0, 0.5),
                        0 0 30px rgba(139, 92, 246, 0.1);
                    cursor: pointer;
                    /* Performance optimizations */
                    will-change: transform, opacity;
                    backface-visibility: hidden;
                    -webkit-backface-visibility: hidden;
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

                .preview-tilt-card::after {
                    content: '';
                    position: absolute;
                    inset: 0;
                    background: linear-gradient(135deg, rgba(255, 255, 255, 0.05), transparent 60%);
                    pointer-events: none;
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
                                                initial={{ opacity: 0, scale: 0.8, z: -100, x: isNext ? 100 : -100 }}
                                                animate={{
                                                    opacity: isActive ? 1 : 0.3,
                                                    scale: isActive ? 1 : 0.8,
                                                    z: isActive ? 0 : -150,
                                                    x: isActive ? 0 : (isNext ? 60 : -60),
                                                    y: isActive ? 0 : 10,
                                                    rotateY: isActive ? 0 : (isNext ? 8 : -8),
                                                    filter: isActive ? 'blur(0px)' : 'blur(4px)',
                                                }}
                                                exit={{ opacity: 0, scale: 0.5, z: -300, transition: { duration: 0.6 } }}
                                                transition={{
                                                    type: 'spring',
                                                    stiffness: 120,
                                                    damping: 20,
                                                    opacity: { duration: 0.8 }
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
