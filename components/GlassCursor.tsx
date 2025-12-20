'use client';

import { useEffect, useRef } from 'react';
import styles from './css/GlassCursor.module.css';

interface GlassCursorProps {
    color?: string;
    size?: number;
    trailSize?: number;
}

export default function GlassCursor({
    color = '#8b5cf6',
    size = 24,
    trailSize = 8
}: GlassCursorProps) {
    const cursorRef = useRef<HTMLDivElement>(null);
    const cursorTrailRef = useRef<HTMLDivElement>(null);
    const mousePosition = useRef({ x: 0, y: 0 });
    const cursorPosition = useRef({ x: 0, y: 0 });
    const trailPosition = useRef({ x: 0, y: 0 });

    useEffect(() => {
        // Hide cursor on touch devices
        if ('ontouchstart' in window) {
            return;
        }

        const cursor = cursorRef.current;
        const trail = cursorTrailRef.current;
        if (!cursor || !trail) return;

        // Mouse move handler
        const handleMouseMove = (e: MouseEvent) => {
            mousePosition.current = { x: e.clientX, y: e.clientY };
        };

        // Animation loop for smooth cursor movement
        let animationId: number;
        const animate = () => {
            // Cursor follows with slight delay (glass effect)
            const cursorEase = 0.2;
            cursorPosition.current.x += (mousePosition.current.x - cursorPosition.current.x) * cursorEase;
            cursorPosition.current.y += (mousePosition.current.y - cursorPosition.current.y) * cursorEase;

            // Trail follows cursor with more delay
            const trailEase = 0.12;
            trailPosition.current.x += (mousePosition.current.x - trailPosition.current.x) * trailEase;
            trailPosition.current.y += (mousePosition.current.y - trailPosition.current.y) * trailEase;

            // Apply positions
            cursor.style.transform = `translate3d(${cursorPosition.current.x - size / 2}px, ${cursorPosition.current.y - size / 2}px, 0)`;
            trail.style.transform = `translate3d(${trailPosition.current.x - trailSize / 2}px, ${trailPosition.current.y - trailSize / 2}px, 0)`;

            animationId = requestAnimationFrame(animate);
        };

        // Cursor hover effects on interactive elements
        const handleMouseEnter = () => {
            cursor.classList.add(styles.hover);
            trail.classList.add(styles.hover);
        };

        const handleMouseLeave = () => {
            cursor.classList.remove(styles.hover);
            trail.classList.remove(styles.hover);
        };

        // Add listeners for interactive elements
        const interactiveElements = document.querySelectorAll('a, button, [role="button"], input, textarea, select, .interactive');
        interactiveElements.forEach((el) => {
            el.addEventListener('mouseenter', handleMouseEnter);
            el.addEventListener('mouseleave', handleMouseLeave);
        });

        // Click effect
        const handleMouseDown = () => {
            cursor.classList.add(styles.click);
            trail.classList.add(styles.click);
        };

        const handleMouseUp = () => {
            cursor.classList.remove(styles.click);
            trail.classList.remove(styles.click);
        };

        // Add event listeners
        window.addEventListener('mousemove', handleMouseMove);
        window.addEventListener('mousedown', handleMouseDown);
        window.addEventListener('mouseup', handleMouseUp);

        // Start animation
        animationId = requestAnimationFrame(animate);

        // Cleanup
        return () => {
            cancelAnimationFrame(animationId);
            window.removeEventListener('mousemove', handleMouseMove);
            window.removeEventListener('mousedown', handleMouseDown);
            window.removeEventListener('mouseup', handleMouseUp);
            interactiveElements.forEach((el) => {
                el.removeEventListener('mouseenter', handleMouseEnter);
                el.removeEventListener('mouseleave', handleMouseLeave);
            });
        };
    }, [size, trailSize]);

    return (
        <>
            <div
                ref={cursorRef}
                className={styles.cursor}
                style={{
                    '--cursor-color': color,
                    '--cursor-size': `${size}px`,
                } as React.CSSProperties}
            />
            <div
                ref={cursorTrailRef}
                className={styles.trail}
                style={{
                    '--cursor-color': color,
                    '--trail-size': `${trailSize}px`,
                } as React.CSSProperties}
            />
        </>
    );
}
