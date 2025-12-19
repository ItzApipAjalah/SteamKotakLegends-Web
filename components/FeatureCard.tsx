'use client';

import { useState } from 'react';

interface FeatureCardProps {
    icon: React.ReactNode;
    title: string;
    desc: string;
}

export default function FeatureCard({ icon, title, desc }: FeatureCardProps) {
    const [transform, setTransform] = useState('');

    const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
        const card = e.currentTarget;
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;

        const rotateX = (y - centerY) / 15;
        const rotateY = (centerX - x) / 15;

        setTransform(`perspective(800px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-8px) scale(1.02)`);
    };

    const handleMouseLeave = () => {
        setTransform('');
    };

    return (
        <div
            className="feature-card"
            data-tilt
            style={{
                transform: transform,
                transition: transform ? 'transform 0.1s ease-out' : 'transform 0.4s ease-out'
            }}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
        >
            <div className="feature-icon">{icon}</div>
            <h3 className="feature-title">{title}</h3>
            <p className="feature-desc">{desc}</p>
        </div>
    );
}
