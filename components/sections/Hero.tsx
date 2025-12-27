'use client';

import { useCallback } from 'react';

export default function Hero() {
    const scrollToDownload = useCallback((e: React.MouseEvent<HTMLAnchorElement>) => {
        e.preventDefault();
        const element = document.getElementById('download');
        if (element) {
            const lenis = (window as unknown as { lenis?: { scrollTo: (target: HTMLElement, options?: object) => void } }).lenis;
            if (lenis) {
                lenis.scrollTo(element, { duration: 1.2, offset: -80 });
            } else {
                element.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        }
    }, []);

    return (
        <section className="hero" id="home">
            <div className="hero-container">
                <div className="hero-content">
                    <div className="hero-badge">
                        <span className="badge-dot"></span>
                        <span>Open Source Project</span>
                    </div>
                    <h1 className="hero-title">
                        <span className="title-line">SteamKotak</span>
                        <span className="title-line shimmer-text">Legends</span>
                    </h1>
                    <p className="hero-tagline">Inject all game to Steam</p>
                    <p className="hero-description">
                        The ultimate tool to search, manage, and inject games into your Steam library. Download
                        manifests, find online fixes, and take control of your gaming experience.
                    </p>
                    <div className="hero-buttons">
                        <a href="#download" onClick={scrollToDownload} className="btn btn-primary">
                            <svg className="btn-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                                <polyline points="7,10 12,15 17,10" />
                                <line x1="12" y1="15" x2="12" y2="3" />
                            </svg>
                            <span>Download Now</span>
                        </a>
                        <a
                            href="https://github.com/ItzApipAjalah/SteamKotakLegends"
                            target="_blank"
                            rel="noopener"
                            className="btn btn-secondary"
                        >
                            <svg className="btn-icon" viewBox="0 0 24 24" fill="currentColor">
                                <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                            </svg>
                            <span>View on GitHub</span>
                        </a>
                    </div>
                </div>
                <div className="hero-visual">
                    <div className="app-mockup">
                        <div className="mockup-window">
                            <div className="window-header">
                                <div className="window-dots">
                                    <span className="dot dot-red"></span>
                                    <span className="dot dot-yellow"></span>
                                    <span className="dot dot-green"></span>
                                </div>
                                <span className="window-title">SteamKotakLegends</span>
                            </div>
                            <div className="window-content">
                                <div className="app-sidebar">
                                    <div className="sidebar-item active">🎮 Games</div>
                                    <div className="sidebar-item">📥 Downloads</div>
                                    <div className="sidebar-item">🔧 Settings</div>
                                </div>
                                <div className="app-main">
                                    <div className="search-bar">
                                        <span className="search-icon">🔍</span>
                                        <span className="search-text">Search games...</span>
                                    </div>
                                    <div className="game-list">
                                        <div className="game-item">
                                            <div className="game-thumb"></div>
                                            <div className="game-info">
                                                <div className="game-name"></div>
                                                <div className="game-meta"></div>
                                            </div>
                                        </div>
                                        <div className="game-item">
                                            <div className="game-thumb"></div>
                                            <div className="game-info">
                                                <div className="game-name"></div>
                                                <div className="game-meta"></div>
                                            </div>
                                        </div>
                                        <div className="game-item">
                                            <div className="game-thumb"></div>
                                            <div className="game-info">
                                                <div className="game-name"></div>
                                                <div className="game-meta"></div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="mockup-glow"></div>
                    </div>
                    <div className="floating-cards">
                        <div className="float-card card-1">
                            <span className="card-icon">✅</span>
                            <span className="card-text">Game Added!</span>
                        </div>
                        <div className="float-card card-2">
                            <span className="card-icon">🎯</span>
                            <span className="card-text">Multiplayer</span>
                        </div>
                        <div className="float-card card-3">
                            <span className="card-icon">📦</span>
                            <span className="card-text">Manifest Ready</span>
                        </div>
                    </div>
                </div>
            </div>
            <div className="scroll-indicator">
                <span>Scroll to explore</span>
                <div className="scroll-arrow"></div>
            </div>
        </section>
    );
}
