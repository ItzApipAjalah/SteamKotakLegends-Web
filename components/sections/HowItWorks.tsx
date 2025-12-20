'use client';

import { useTranslations } from 'next-intl';
import { HiDownload, HiSearch, HiPlay } from 'react-icons/hi';

export default function HowItWorks() {
    const t = useTranslations('HowItWorks');

    const steps = [
        {
            number: '01',
            title: t('step1.title'),
            description: t('step1.description'),
            icon: HiDownload,
            color: '#8b5cf6',
        },
        {
            number: '02',
            title: t('step2.title'),
            description: t('step2.description'),
            icon: HiSearch,
            color: '#c084fc',
        },
        {
            number: '03',
            title: t('step3.title'),
            description: t('step3.description'),
            icon: HiPlay,
            color: '#f472b6',
        },
    ];

    return (
        <section className="how-it-works" id="how-it-works">
            <div className="container">
                <div className="section-header">
                    <span className="section-badge">{t('badge')}</span>
                    <h2 className="section-title">{t('title')}</h2>
                    <p className="section-subtitle">{t('subtitle')}</p>
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
