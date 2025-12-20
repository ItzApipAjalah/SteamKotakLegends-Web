'use client';

import { useState, useEffect } from 'react';
import { HiDownload, HiShieldCheck, HiSparkles, HiCheck } from 'react-icons/hi';
import { FaGithub } from 'react-icons/fa';
import type { ReleaseData } from '@/app/api/github/types';
import { GITHUB_RELEASES_URL, DOWNLOAD_STATS } from '@/app/api/github/types';

type DownloadState = 'idle' | 'downloading' | 'complete';

// Icon mapping for stats
const STAT_ICONS: Record<string, typeof HiSparkles> = {
    opensource: HiSparkles,
    secure: HiShieldCheck,
};

export default function DownloadCTA() {
    const [releaseData, setReleaseData] = useState<ReleaseData | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [downloadState, setDownloadState] = useState<DownloadState>('idle');

    useEffect(() => {
        const fetchReleaseData = async () => {
            try {
                const response = await fetch('/api/github');
                const result = await response.json();

                if (result.success && result.data) {
                    setReleaseData(result.data);
                }
            } catch (error) {
                console.error('Error fetching release data:', error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchReleaseData();
    }, []);

    const handleDownload = (e: React.MouseEvent<HTMLAnchorElement>) => {
        if (downloadState === 'downloading') {
            e.preventDefault();
            return;
        }

        setDownloadState('downloading');

        // Simulate download animation for a few seconds, then show complete
        setTimeout(() => {
            setDownloadState('complete');
            // Reset after showing complete state
            setTimeout(() => {
                setDownloadState('idle');
            }, 3000);
        }, 2500);
    };

    const getButtonContent = () => {
        if (isLoading) {
            return (
                <>
                    <div className="download-spinner" />
                    <span>Loading...</span>
                </>
            );
        }

        switch (downloadState) {
            case 'downloading':
                return (
                    <>
                        <div className="download-progress-icon">
                            <HiDownload size={22} className="download-bounce" />
                            <div className="download-ripple" />
                        </div>
                        <span className="download-text-animate">Downloading...</span>
                    </>
                );
            case 'complete':
                return (
                    <>
                        <HiCheck size={22} className="download-check" />
                        <span>Download Started!</span>
                    </>
                );
            default:
                return (
                    <>
                        <HiDownload size={22} />
                        <span>Download Now{releaseData?.version ? ` ${releaseData.version}` : ''}</span>
                    </>
                );
        }
    };

    const getButtonClass = () => {
        let baseClass = 'btn btn-primary btn-large cta-btn-main';
        if (downloadState === 'downloading') baseClass += ' downloading';
        if (downloadState === 'complete') baseClass += ' complete';
        return baseClass;
    };

    const downloadUrl = releaseData?.downloadUrl || GITHUB_RELEASES_URL;

    return (
        <>
            <style jsx>{`
                .download-spinner {
                    width: 20px;
                    height: 20px;
                    border: 2px solid rgba(255, 255, 255, 0.3);
                    border-top-color: white;
                    border-radius: 50%;
                    animation: spin 0.8s linear infinite;
                }

                @keyframes spin {
                    to { transform: rotate(360deg); }
                }

                .download-progress-icon {
                    position: relative;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                }

                .download-bounce {
                    animation: bounce 0.6s ease-in-out infinite;
                }

                @keyframes bounce {
                    0%, 100% { transform: translateY(0); }
                    50% { transform: translateY(4px); }
                }

                .download-ripple {
                    position: absolute;
                    width: 30px;
                    height: 30px;
                    border: 2px solid rgba(255, 255, 255, 0.5);
                    border-radius: 50%;
                    animation: ripple 1s ease-out infinite;
                }

                @keyframes ripple {
                    0% {
                        transform: scale(0.8);
                        opacity: 1;
                    }
                    100% {
                        transform: scale(1.8);
                        opacity: 0;
                    }
                }

                .download-text-animate {
                    background: linear-gradient(90deg, #fff, #a78bfa, #fff);
                    background-size: 200% auto;
                    -webkit-background-clip: text;
                    -webkit-text-fill-color: transparent;
                    background-clip: text;
                    animation: shimmer 1.5s linear infinite;
                }

                @keyframes shimmer {
                    to { background-position: 200% center; }
                }

                .download-check {
                    animation: popIn 0.4s cubic-bezier(0.68, -0.55, 0.265, 1.55);
                    color: #10b981;
                }

                @keyframes popIn {
                    0% { transform: scale(0); opacity: 0; }
                    100% { transform: scale(1); opacity: 1; }
                }


                :global(.cta-btn-main.downloading) {
                    background: linear-gradient(135deg, #7c3aed 0%, #a78bfa 50%, #7c3aed 100%) !important;
                    background-size: 200% 200% !important;
                    animation: gradientShift 1.5s ease infinite !important;
                    pointer-events: none;
                }

                @keyframes gradientShift {
                    0% { background-position: 0% 50%; }
                    50% { background-position: 100% 50%; }
                    100% { background-position: 0% 50%; }
                }

                :global(.cta-btn-main.complete) {
                    background: linear-gradient(135deg, #10b981, #059669) !important;
                    transform: scale(1.02);
                }

                :global(.cta-btn-main) {
                    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1) !important;
                }
            `}</style>

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
                                    href={downloadUrl}
                                    onClick={handleDownload}
                                    className={getButtonClass()}
                                >
                                    {getButtonContent()}
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
                                {DOWNLOAD_STATS.map((stat) => {
                                    const Icon = STAT_ICONS[stat.id] || HiSparkles;
                                    return (
                                        <div key={stat.id} className="cta-stat-item">
                                            <Icon size={20} color={stat.color} />
                                            <span>{stat.label}</span>
                                        </div>
                                    );
                                })}
                                {releaseData?.fileSize && (
                                    <div className="cta-stat-item">
                                        <HiDownload size={20} color="#f472b6" />
                                        <span>{releaseData.fileSize}</span>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </>
    );
}
