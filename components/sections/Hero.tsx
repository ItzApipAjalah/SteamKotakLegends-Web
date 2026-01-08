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
                        <span className="title-line">Steam</span>
                        <span className="title-line shimmer-text">KotakLegend</span>
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
                            href="https://manifest.kotaklegend.my.id/"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="btn btn-secondary"
                        >
                            <svg className="btn-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                                <polyline points="14 2 14 8 20 8" />
                                <line x1="12" y1="18" x2="12" y2="12" />
                                <polyline points="9 15 12 18 15 15" />
                            </svg>
                            <span>Manifest Getter</span>
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
                                <span className="window-title">SteamKotakLegends Explorer</span>
                            </div>
                            <div className="window-content">
                                <div className="app-sidebar">
                                    <div className="sidebar-section">
                                        <div className="sidebar-item">
                                            <span className="sidebar-icon">👤</span>
                                            <span>Steam Accounts</span>
                                        </div>
                                    </div>
                                    <div className="sidebar-section">
                                        <div className="sidebar-item">
                                            <span className="sidebar-icon">📦</span>
                                            <span>My DLC</span>
                                        </div>
                                        <div className="sidebar-item">
                                            <span className="sidebar-icon">📚</span>
                                            <span>My Library</span>
                                        </div>
                                    </div>

                                </div>
                                <div className="app-main">
                                    <div className="main-header">
                                        <div className="app-logo">
                                            <span className="logo-icon">🎮</span>
                                            <span className="logo-text">Steam<span className="shimmer-text">KotakLegends</span></span>
                                        </div>
                                        <div className="app-subtitle">Discover & Explore Steam Games</div>
                                    </div>
                                    <div className="search-section">
                                        <div className="search-label">🔍 Search Game by Name or App ID</div>
                                        <div className="search-bar">
                                            <input type="text" placeholder="Enter game name or App ID..." disabled />
                                            <button className="search-btn">Search →</button>
                                        </div>
                                        <div className="popular-tags">
                                            <span className="tag">Call of Duty MW3</span>
                                            <span className="tag">Marvel Spider-Man</span>
                                            <span className="tag">Team Fortress 2</span>
                                        </div>
                                    </div>
                                </div>
                                <div className="app-games">
                                    <div className="games-header">Popular Games</div>
                                    <div className="games-tabs">
                                        <span className="tab active">🔥 Top Sellers</span>
                                        <span className="tab">✨ New Releases</span>
                                    </div>
                                    <div className="game-list">
                                        <div className="game-item">
                                            <span className="game-rank">1</span>
                                            <div className="game-thumb"></div>
                                            <span className="game-name">StarRupture</span>
                                        </div>
                                        <div className="game-item">
                                            <span className="game-rank">2</span>
                                            <div className="game-thumb"></div>
                                            <span className="game-name">ARC Raiders</span>
                                        </div>
                                        <div className="game-item">
                                            <span className="game-rank">3</span>
                                            <div className="game-thumb"></div>
                                            <span className="game-name">Baldur&apos;s Gate 3</span>
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
