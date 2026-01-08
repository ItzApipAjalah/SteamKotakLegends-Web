import FeatureCard from '../FeatureCard';

export default function Features() {
    return (
        <section className="features" id="features">
            <div className="container">
                <div className="section-header">
                    <span className="section-badge">Features</span>
                    <h2 className="section-title">Everything you need</h2>
                    <p className="section-subtitle">Powerful features to manage your Steam library like never before</p>
                </div>
                <div className="features-grid">
                    <FeatureCard
                        icon={
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <circle cx="11" cy="11" r="8" />
                                <path d="M21 21l-4.35-4.35" />
                            </svg>
                        }
                        title="Game Search"
                        desc="Search and explore Steam games by App ID or name with lightning-fast results."
                    />
                    <FeatureCard
                        icon={
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                                <polyline points="14,2 14,8 20,8" />
                                <line x1="16" y1="13" x2="8" y2="13" />
                                <line x1="16" y1="17" x2="8" y2="17" />
                                <line x1="10" y1="9" x2="8" y2="9" />
                            </svg>
                        }
                        title="Game Details"
                        desc="View detailed information including prices, release dates, and complete metadata."
                    />
                    <FeatureCard
                        icon={
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                                <circle cx="9" cy="7" r="4" />
                                <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
                                <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                            </svg>
                        }
                        title="Multiplayer Detection"
                        desc="Automatically detect multiplayer and co-op support for any game."
                    />
                    <FeatureCard
                        icon={
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z" />
                            </svg>
                        }
                        title="Library Management"
                        desc="Add or remove games from your local library with a single click."
                    />
                    <FeatureCard
                        icon={
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                                <polyline points="7,10 12,15 17,10" />
                                <line x1="12" y1="15" x2="12" y2="3" />
                            </svg>
                        }
                        title="Manifest Download"
                        desc="Download game manifests directly from ManifestKotakLegend."
                    />
                    <FeatureCard
                        icon={
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <circle cx="12" cy="12" r="10" />
                                <line x1="2" y1="12" x2="22" y2="12" />
                                <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
                            </svg>
                        }
                        title="Online Fix Integration"
                        desc="Find and download online fixes for multiplayer games seamlessly."
                    />
                </div>
            </div>
        </section>
    );
}
