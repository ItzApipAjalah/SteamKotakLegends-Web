'use client';

import { HiDownload, HiSearch, HiPlay } from 'react-icons/hi';

const steps = [
    {
        number: '01',
        title: 'Download & Install',
        description: 'Get SteamKotakLegends from GitHub and run the installer. Quick setup, no complex configuration needed.',
        icon: HiDownload,
        color: '#8b5cf6',
    },
    {
        number: '02',
        title: 'Search Your Games',
        description: 'Use the powerful search to find any game by name or App ID. Browse through thousands of titles.',
        icon: HiSearch,
        color: '#c084fc',
    },
    {
        number: '03',
        title: 'Inject to Steam',
        description: 'One click to add the game to your Steam library. Launch and play instantly.',
        icon: HiPlay,
        color: '#f472b6',
    },
];

export default function HowItWorks() {
    return (
        <section className="how-it-works" id="how-it-works">
            <div className="container">
                <div className="section-header">
                    <span className="section-badge">Simple Process</span>
                    <h2 className="section-title">How it works</h2>
                    <p className="section-subtitle">Get started in just three easy steps</p>
                </div>

                <div className="steps-grid">
                    {steps.map((step, index) => (
                        <div key={step.number} className="step-card-new">
                            <div className="step-number-badge" style={{ background: step.color }}>
                                {step.number}
                            </div>
                            <div className="step-icon-wrapper" style={{ background: `${step.color}20`, borderColor: `${step.color}40` }}>
                                <step.icon size={32} color={step.color} />
                            </div>
                            <h3 className="step-card-title">{step.title}</h3>
                            <p className="step-card-desc">{step.description}</p>
                            {index < steps.length - 1 && (
                                <div className="step-connector-line" style={{ background: `linear-gradient(to bottom, ${step.color}, ${steps[index + 1].color})` }} />
                            )}
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
