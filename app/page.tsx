'use client';

import { useEffect, useRef } from 'react';
import {
    BackgroundElements,
    Navbar,
    Hero,
    Features,
    HowItWorks,
    Preview,
    DownloadCTA,
    Footer,
    SmoothScroll
} from '@/components';

export default function Home() {
    const rafRef = useRef<number | null>(null);
    const isScrollingRef = useRef(false);

    useEffect(() => {
        // Scroll reveal animation
        const revealElements = document.querySelectorAll('.feature-card, .step-card, .section-header, .cta-card');
        revealElements.forEach((el) => el.classList.add('reveal'));

        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('active');
                        const siblings = entry.target.parentElement?.querySelectorAll('.reveal');
                        siblings?.forEach((sibling, index) => {
                            (sibling as HTMLElement).style.transitionDelay = `${index * 0.1}s`;
                        });
                    }
                });
            },
            { root: null, rootMargin: '0px', threshold: 0.15 }
        );

        revealElements.forEach((el) => observer.observe(el));

        // Throttled parallax effect for orbs (using RAF)
        const updateParallax = () => {
            if (!isScrollingRef.current) return;

            const scrolled = window.pageYOffset;
            const orbs = document.querySelectorAll('.orb');
            orbs.forEach((orb, index) => {
                const speed = (index + 1) * 0.03;
                (orb as HTMLElement).style.transform = `translate3d(0, ${scrolled * speed}px, 0)`;
            });

            isScrollingRef.current = false;
        };

        const handleScroll = () => {
            if (!isScrollingRef.current) {
                isScrollingRef.current = true;
                rafRef.current = requestAnimationFrame(updateParallax);
            }
        };

        window.addEventListener('scroll', handleScroll, { passive: true });

        return () => {
            window.removeEventListener('scroll', handleScroll);
            if (rafRef.current) cancelAnimationFrame(rafRef.current);
            observer.disconnect();
        };
    }, []);

    return (
        <SmoothScroll>
            <BackgroundElements />
            <Navbar />
            <Hero />
            <Features />
            <HowItWorks />
            <Preview />
            <DownloadCTA />
            <Footer />
        </SmoothScroll>
    );
}
