'use client';

import { useEffect } from 'react';
import {
    ParticleCanvas,
    BackgroundElements,
    Navbar,
    Hero,
    Features,
    HowItWorks,
    DownloadCTA,
    Footer,
    GlassCursor,
    SmoothScroll
} from '@/components';

export default function Home() {
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

        // Parallax effect for orbs
        const handleScroll = () => {
            const scrolled = window.pageYOffset;
            const orbs = document.querySelectorAll('.orb');
            orbs.forEach((orb, index) => {
                const speed = (index + 1) * 0.05;
                (orb as HTMLElement).style.transform = `translateY(${scrolled * speed}px)`;
            });
        };
        window.addEventListener('scroll', handleScroll);

        return () => {
            window.removeEventListener('scroll', handleScroll);
            observer.disconnect();
        };
    }, []);

    return (
        <SmoothScroll>
            <GlassCursor color="#8b5cf6" size={28} trailSize={10} />
            <BackgroundElements />
            <ParticleCanvas />
            <Navbar />
            <Hero />
            <Features />
            <HowItWorks />
            <DownloadCTA />
            <Footer />
        </SmoothScroll>
    );
}
