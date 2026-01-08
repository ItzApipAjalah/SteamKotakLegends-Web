'use client';

import { useState, useEffect } from 'react';
import Lenis from 'lenis';

const navItems = [
    {
        id: 'home',
        label: 'Home',
        icon: (
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
                <polyline points="9 22 9 12 15 12 15 22" />
            </svg>
        )
    },
    {
        id: 'features',
        label: 'Features',
        icon: (
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="3" width="7" height="7" />
                <rect x="14" y="3" width="7" height="7" />
                <rect x="14" y="14" width="7" height="7" />
                <rect x="3" y="14" width="7" height="7" />
            </svg>
        )
    },
    {
        id: 'how-it-works',
        label: 'How It Works',
        icon: (
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="16 18 22 12 16 6" />
                <polyline points="8 6 2 12 8 18" />
            </svg>
        )
    },
    {
        id: 'preview',
        label: 'Preview',
        icon: (
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="2" y="3" width="20" height="14" rx="2" ry="2" />
                <line x1="8" y1="21" x2="16" y2="21" />
                <line x1="12" y1="17" x2="12" y2="21" />
            </svg>
        )
    },
];

export default function Navbar() {
    const [scrolled, setScrolled] = useState(false);
    const [activeSection, setActiveSection] = useState('home');
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [isMobile, setIsMobile] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 50);
        };

        const handleResize = () => {
            setIsMobile(window.innerWidth < 768);
            if (window.innerWidth >= 768) {
                setMobileMenuOpen(false);
            }
        };

        handleResize();
        window.addEventListener('scroll', handleScroll);
        window.addEventListener('resize', handleResize);
        return () => {
            window.removeEventListener('scroll', handleScroll);
            window.removeEventListener('resize', handleResize);
        };
    }, []);

    useEffect(() => {
        const sections = ['home', 'features', 'how-it-works', 'preview', 'download'];

        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        setActiveSection(entry.target.id);
                    }
                });
            },
            { rootMargin: '-20% 0px -70% 0px', threshold: 0 }
        );

        sections.forEach((sectionId) => {
            const element = document.getElementById(sectionId);
            if (element) observer.observe(element);
        });

        return () => observer.disconnect();
    }, []);

    const scrollToSection = (id: string) => {
        const element = document.getElementById(id);
        if (element) {
            const lenis = (window as unknown as { lenis?: Lenis }).lenis;
            if (lenis) {
                lenis.scrollTo(element, {
                    offset: -100,
                    duration: 1.5,
                    easing: (t: number) => t === 1 ? 1 : 1 - Math.pow(2, -10 * t)
                });
            } else {
                const offset = 100;
                const top = element.offsetTop - offset;
                window.scrollTo({ top, behavior: 'smooth' });
            }
        }
        setMobileMenuOpen(false);
    };

    const isActive = (id: string) => activeSection === id;

    // Dynamic sizes based on scroll and mobile
    const logoSize = scrolled ? 32 : (isMobile ? 36 : 42);
    const iconLogoSize = scrolled ? 18 : (isMobile ? 20 : 22);

    return (
        <>
            <header
                style={{
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    right: 0,
                    zIndex: 9999,
                    display: 'flex',
                    justifyContent: 'center',
                    padding: isMobile ? '12px 16px' : (scrolled ? '8px 24px' : '20px 24px'),
                    transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                }}
            >
                <nav
                    style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: isMobile ? '8px' : '10px',
                        padding: isMobile ? '8px 12px' : (scrolled ? '6px 6px 6px 12px' : '10px 10px 10px 20px'),
                        background: scrolled ? 'rgba(10, 5, 20, 0.98)' : 'rgba(15, 10, 25, 0.92)',
                        border: '1px solid rgba(139, 92, 246, 0.25)',
                        borderRadius: '100px',
                        backdropFilter: 'blur(24px)',
                        WebkitBackdropFilter: 'blur(24px)',
                        boxShadow: scrolled
                            ? '0 4px 20px rgba(0, 0, 0, 0.5), 0 0 0 1px rgba(139, 92, 246, 0.15)'
                            : '0 8px 40px rgba(0, 0, 0, 0.4), 0 0 0 1px rgba(139, 92, 246, 0.1)',
                        transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                        transform: scrolled && !isMobile ? 'scale(0.95)' : 'scale(1)',
                        width: isMobile ? 'calc(100% - 32px)' : 'auto',
                        maxWidth: isMobile ? '500px' : 'none',
                        justifyContent: isMobile ? 'space-between' : 'flex-start',
                    }}
                >
                    {/* Logo */}
                    <button
                        onClick={() => scrollToSection('home')}
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '10px',
                            background: 'none',
                            border: 'none',
                            cursor: 'pointer',
                            color: 'white',
                            fontFamily: 'var(--font-heading)',
                            fontWeight: 700,
                            fontSize: isMobile ? '0.95rem' : (scrolled ? '0.95rem' : '1.1rem'),
                            transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                        }}
                    >
                        <span
                            style={{
                                width: `${logoSize}px`,
                                height: `${logoSize}px`,
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                background: 'linear-gradient(135deg, #7c3aed 0%, #a855f7 100%)',
                                borderRadius: scrolled ? '10px' : '14px',
                                boxShadow: '0 4px 12px rgba(124, 58, 237, 0.4)',
                                transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                                flexShrink: 0,
                            }}
                        >
                            <svg
                                width={iconLogoSize}
                                height={iconLogoSize}
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2.5"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            >
                                <path d="M12 2L2 7L12 12L22 7L12 2Z" />
                                <path d="M2 17L12 22L22 17" />
                                <path d="M2 12L12 17L22 12" />
                            </svg>
                        </span>
                        {!isMobile && (
                            <span style={{ letterSpacing: '-0.02em' }}>
                                Steam
                                <span style={{
                                    background: 'linear-gradient(90deg, #a855f7, #c084fc, #e879f9)',
                                    WebkitBackgroundClip: 'text',
                                    WebkitTextFillColor: 'transparent',
                                }}>
                                    KotakLegend
                                </span>
                            </span>
                        )}
                    </button>

                    {/* Desktop Nav Links */}
                    {!isMobile && navItems.map((item) => (
                        <button
                            key={item.id}
                            onClick={() => scrollToSection(item.id)}
                            style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: scrolled ? '6px' : '8px',
                                padding: scrolled ? '8px 14px' : '12px 20px',
                                fontSize: scrolled ? '0.85rem' : '0.95rem',
                                fontWeight: 500,
                                color: isActive(item.id) ? 'white' : 'rgba(255, 255, 255, 0.65)',
                                background: isActive(item.id)
                                    ? 'linear-gradient(135deg, rgba(124, 58, 237, 0.9) 0%, rgba(139, 92, 246, 0.8) 100%)'
                                    : 'transparent',
                                border: 'none',
                                borderRadius: '50px',
                                cursor: 'pointer',
                                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                                boxShadow: isActive(item.id)
                                    ? '0 4px 15px rgba(124, 58, 237, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.15)'
                                    : 'none',
                            }}
                            onMouseEnter={(e) => {
                                if (!isActive(item.id)) {
                                    e.currentTarget.style.color = 'white';
                                    e.currentTarget.style.background = 'rgba(139, 92, 246, 0.15)';
                                }
                            }}
                            onMouseLeave={(e) => {
                                if (!isActive(item.id)) {
                                    e.currentTarget.style.color = 'rgba(255, 255, 255, 0.65)';
                                    e.currentTarget.style.background = 'transparent';
                                }
                            }}
                        >
                            <span style={{ opacity: isActive(item.id) ? 1 : 0.7, display: 'flex', alignItems: 'center' }}>
                                {item.icon}
                            </span>
                            {item.label}
                        </button>
                    ))}

                    {/* Desktop Download Button */}
                    {!isMobile && (
                        <button
                            onClick={() => scrollToSection('download')}
                            style={{
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                gap: scrolled ? '6px' : '8px',
                                padding: scrolled ? '10px 20px' : '14px 28px',
                                marginLeft: scrolled ? '2px' : '8px',
                                fontSize: scrolled ? '0.85rem' : '0.95rem',
                                fontWeight: 600,
                                color: 'white',
                                background: 'linear-gradient(135deg, #7c3aed 0%, #a855f7 50%, #c084fc 100%)',
                                border: 'none',
                                borderRadius: '100px',
                                cursor: 'pointer',
                                boxShadow: '0 4px 20px rgba(124, 58, 237, 0.5), inset 0 1px 0 rgba(255, 255, 255, 0.2)',
                                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                            }}
                            onMouseEnter={(e) => {
                                e.currentTarget.style.transform = 'translateY(-2px) scale(1.02)';
                                e.currentTarget.style.boxShadow = '0 8px 30px rgba(124, 58, 237, 0.6)';
                            }}
                            onMouseLeave={(e) => {
                                e.currentTarget.style.transform = 'translateY(0) scale(1)';
                                e.currentTarget.style.boxShadow = '0 4px 20px rgba(124, 58, 237, 0.5)';
                            }}
                        >
                            <svg width={scrolled ? 14 : 16} height={scrolled ? 14 : 16} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                                <polyline points="7 10 12 15 17 10" />
                                <line x1="12" y1="15" x2="12" y2="3" />
                            </svg>
                            <span>Download</span>
                        </button>
                    )}

                    {/* Desktop Manifest Getter Button */}
                    {!isMobile && (
                        <a
                            href="https://manifest.kotaklegend.my.id/"
                            target="_blank"
                            rel="noopener noreferrer"
                            style={{
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                gap: scrolled ? '6px' : '8px',
                                padding: scrolled ? '10px 20px' : '14px 28px',
                                marginLeft: scrolled ? '2px' : '4px',
                                fontSize: scrolled ? '0.85rem' : '0.95rem',
                                fontWeight: 600,
                                color: 'white',
                                background: 'linear-gradient(135deg, #0891b2 0%, #06b6d4 50%, #22d3ee 100%)',
                                border: 'none',
                                borderRadius: '100px',
                                cursor: 'pointer',
                                boxShadow: '0 4px 20px rgba(6, 182, 212, 0.5), inset 0 1px 0 rgba(255, 255, 255, 0.2)',
                                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                                textDecoration: 'none',
                            }}
                            onMouseEnter={(e) => {
                                e.currentTarget.style.transform = 'translateY(-2px) scale(1.02)';
                                e.currentTarget.style.boxShadow = '0 8px 30px rgba(6, 182, 212, 0.6)';
                            }}
                            onMouseLeave={(e) => {
                                e.currentTarget.style.transform = 'translateY(0) scale(1)';
                                e.currentTarget.style.boxShadow = '0 4px 20px rgba(6, 182, 212, 0.5)';
                            }}
                        >
                            <svg width={scrolled ? 14 : 16} height={scrolled ? 14 : 16} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                                <polyline points="14 2 14 8 20 8" />
                                <line x1="12" y1="18" x2="12" y2="12" />
                                <polyline points="9 15 12 18 15 15" />
                            </svg>
                            <span>Manifest</span>
                        </a>
                    )}

                    {/* Mobile Hamburger Menu */}
                    {isMobile && (
                        <button
                            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                            style={{
                                display: 'flex',
                                flexDirection: 'column',
                                gap: '5px',
                                padding: '8px',
                                background: 'none',
                                border: 'none',
                                cursor: 'pointer',
                            }}
                            aria-label="Toggle menu"
                        >
                            <span style={{
                                width: '22px',
                                height: '2px',
                                background: 'white',
                                borderRadius: '2px',
                                transition: 'all 0.3s ease',
                                transform: mobileMenuOpen ? 'rotate(45deg) translate(5px, 5px)' : 'none',
                            }} />
                            <span style={{
                                width: '22px',
                                height: '2px',
                                background: 'white',
                                borderRadius: '2px',
                                transition: 'all 0.3s ease',
                                opacity: mobileMenuOpen ? 0 : 1,
                            }} />
                            <span style={{
                                width: '22px',
                                height: '2px',
                                background: 'white',
                                borderRadius: '2px',
                                transition: 'all 0.3s ease',
                                transform: mobileMenuOpen ? 'rotate(-45deg) translate(5px, -5px)' : 'none',
                            }} />
                        </button>
                    )}
                </nav>
            </header>

            {/* Mobile Menu Dropdown */}
            {isMobile && (
                <div
                    style={{
                        position: 'fixed',
                        top: '70px',
                        left: '16px',
                        right: '16px',
                        zIndex: 9998,
                        background: 'rgba(15, 10, 25, 0.98)',
                        border: '1px solid rgba(139, 92, 246, 0.3)',
                        borderRadius: '20px',
                        padding: '16px',
                        backdropFilter: 'blur(24px)',
                        WebkitBackdropFilter: 'blur(24px)',
                        boxShadow: '0 12px 40px rgba(0, 0, 0, 0.5)',
                        transform: mobileMenuOpen ? 'translateY(0) scale(1)' : 'translateY(-20px) scale(0.95)',
                        opacity: mobileMenuOpen ? 1 : 0,
                        pointerEvents: mobileMenuOpen ? 'auto' : 'none',
                        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                    }}
                >
                    {navItems.map((item) => (
                        <button
                            key={item.id}
                            onClick={() => scrollToSection(item.id)}
                            style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '12px',
                                width: '100%',
                                padding: '14px 16px',
                                marginBottom: '8px',
                                fontSize: '1rem',
                                fontWeight: 500,
                                color: isActive(item.id) ? 'white' : 'rgba(255, 255, 255, 0.7)',
                                background: isActive(item.id)
                                    ? 'linear-gradient(135deg, rgba(124, 58, 237, 0.4) 0%, rgba(139, 92, 246, 0.3) 100%)'
                                    : 'rgba(255, 255, 255, 0.03)',
                                border: isActive(item.id) ? '1px solid rgba(139, 92, 246, 0.4)' : '1px solid transparent',
                                borderRadius: '12px',
                                cursor: 'pointer',
                                textAlign: 'left',
                                transition: 'all 0.2s ease',
                            }}
                        >
                            <span style={{ opacity: isActive(item.id) ? 1 : 0.7, display: 'flex' }}>
                                {item.icon}
                            </span>
                            {item.label}
                        </button>
                    ))}

                    {/* Mobile Download Button */}
                    <button
                        onClick={() => scrollToSection('download')}
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: '10px',
                            width: '100%',
                            padding: '16px',
                            marginTop: '8px',
                            fontSize: '1rem',
                            fontWeight: 600,
                            color: 'white',
                            background: 'linear-gradient(135deg, #7c3aed 0%, #a855f7 50%, #c084fc 100%)',
                            border: 'none',
                            borderRadius: '12px',
                            cursor: 'pointer',
                            boxShadow: '0 4px 20px rgba(124, 58, 237, 0.5)',
                        }}
                    >
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                            <polyline points="7 10 12 15 17 10" />
                            <line x1="12" y1="15" x2="12" y2="3" />
                        </svg>
                        <span>Download Now</span>
                    </button>
                </div>
            )}
        </>
    );
}
