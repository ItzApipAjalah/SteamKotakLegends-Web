'use client';

import { HiDownload, HiCode, HiShieldCheck, HiSparkles } from 'react-icons/hi';
import { FaGithub } from 'react-icons/fa';

const stats = [
    { icon: HiSparkles, label: 'Open Source', color: '#8b5cf6' },
    { icon: HiShieldCheck, label: 'Safe & Secure', color: '#10b981' },
    { icon: HiCode, label: '100% Free', color: '#f472b6' },
];

export default function DownloadCTA() {
    return (
        <section className="download-cta" id="download">
            <div className="container">
                <div className="cta-card-new">
                    <div className="cta-glow-orb cta-orb-1" />
                    <div className="cta-glow-orb cta-orb-2" />

                    <div className="cta-content-new">
                        <span className="cta-badge">Ready to Start?</span>
                        <h2 className="cta-title-new">
                            Level up your <span className="shimmer-text">gaming</span> experience
                        </h2>
                        <p className="cta-desc-new">
                            Download SteamKotakLegends now and take full control of your Steam library.
                            Free, open-source, and constantly updated.
                        </p>

                        <div className="cta-buttons-new">
                            <a
                                href="https://github.com/ItzApipAjalah/SteamKotakLegends/releases"
                                target="_blank"
                                rel="noopener"
                                className="btn btn-primary btn-large cta-btn-main"
                            >
                                <HiDownload size={22} />
                                <span>Download Now</span>
                            </a>
                            <a
                                href="https://github.com/ItzApipAjalah/SteamKotakLegends"
                                target="_blank"
                                rel="noopener"
                                className="btn btn-secondary btn-large"
                            >
                                <FaGithub size={20} />
                                <span>View Source</span>
                            </a>
                        </div>

                        <div className="cta-stats-new">
                            {stats.map((stat) => (
                                <div key={stat.label} className="cta-stat-item">
                                    <stat.icon size={20} color={stat.color} />
                                    <span>{stat.label}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
