'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { FaGithub, FaDiscord, FaHeart, FaGamepad, FaStar } from 'react-icons/fa';
import { HiSparkles, HiLightningBolt, HiGlobe } from 'react-icons/hi';
import type { Developer } from '@/app/api/discord/types';
import {
    STATUS_COLORS,
    getAvatarUrl,
    getDecorationUrl,
    getClanBadgeUrl
} from '@/app/api/discord/types';

const quickLinks = [
    { name: 'Features', href: '#features' },
    { name: 'Download', href: '#download' },
    { name: 'GitHub', href: 'https://github.com/ItzApipAjalah/SteamKotakLegends', external: true },
];

export default function Footer() {
    const [developers, setDevelopers] = useState<Developer[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchDevelopers = async () => {
            try {
                const response = await fetch('/api/discord');
                const data = await response.json();

                if (data.success && data.developers) {
                    setDevelopers(data.developers);
                }
            } catch (error) {
                console.error('Error fetching developers:', error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchDevelopers();

        // Refresh every 30 seconds for live status
        const interval = setInterval(fetchDevelopers, 30000);
        return () => clearInterval(interval);
    }, []);

    return (
        <footer className="footer-modern">
            {/* Decorative Background */}
            <div className="footer-bg-effects">
                <div className="footer-gradient-orb footer-orb-1" />
                <div className="footer-gradient-orb footer-orb-2" />
                <div className="footer-grid-pattern" />
            </div>

            <div className="container footer-container">
                {/* Main Footer Content */}
                <div className="footer-main">
                    {/* Brand Column */}
                    <div className="footer-brand-section">
                        <a href="#" className="footer-brand-logo">
                            <div className="brand-icon-wrapper">
                                <FaGamepad size={24} />
                            </div>
                            <div className="brand-text">
                                <span className="brand-name">
                                    SteamKotak<span className="brand-accent">Legends</span>
                                </span>
                                <span className="brand-tagline">
                                    <HiSparkles size={12} />
                                    Your Ultimate Steam Companion
                                </span>
                            </div>
                        </a>

                        <p className="footer-description">
                            Inject all your games to Steam
                        </p>

                        {/* Social Links */}
                        <div className="footer-socials">
                            <a
                                href="https://github.com/ItzApipAjalah/SteamKotakLegends"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="social-btn github"
                                title="GitHub"
                            >
                                <FaGithub size={18} />
                            </a>
                            <a
                                href="#"
                                className="social-btn discord"
                                title="Discord"
                            >
                                <FaDiscord size={18} />
                            </a>
                        </div>
                    </div>

                    {/* Quick Links */}
                    <div className="footer-links-section">
                        <h4 className="footer-heading">
                            <HiLightningBolt size={16} />
                            Quick Links
                        </h4>
                        <ul className="footer-nav">
                            {quickLinks.map((link) => (
                                <li key={link.name}>
                                    <a
                                        href={link.href}
                                        target={link.external ? '_blank' : undefined}
                                        rel={link.external ? 'noopener noreferrer' : undefined}
                                        className="footer-nav-link"
                                    >
                                        {link.name}
                                    </a>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Team Section */}
                    <div className="footer-team-section">
                        <h4 className="footer-heading">
                            <FaStar size={14} />
                            Meet The Team
                        </h4>
                        <div className="team-cards">
                            {developers.map((dev) => {
                                const lanyard = dev.lanyard;
                                const user = lanyard?.discord_user;
                                const status = lanyard?.discord_status || 'offline';
                                const activity = lanyard?.activities?.[0];

                                return (
                                    <div key={dev.discordId} className="team-card">
                                        {/* Avatar Section */}
                                        <div className="avatar-container">
                                            {user ? (
                                                <>
                                                    <Image
                                                        src={getAvatarUrl(user)}
                                                        alt={user.display_name || dev.name}
                                                        width={48}
                                                        height={48}
                                                        className="team-avatar-img"
                                                    />
                                                    {/* Avatar Decoration */}
                                                    {getDecorationUrl(user) && (
                                                        <Image
                                                            src={getDecorationUrl(user)!}
                                                            alt="decoration"
                                                            width={64}
                                                            height={64}
                                                            className="avatar-decoration"
                                                        />
                                                    )}
                                                </>
                                            ) : (
                                                <div
                                                    className="team-avatar-fallback"
                                                    style={{ background: dev.gradient }}
                                                >
                                                    <span>{dev.name.charAt(0)}</span>
                                                </div>
                                            )}
                                            {/* Status Indicator */}
                                            <div
                                                className="status-indicator"
                                                style={{ backgroundColor: STATUS_COLORS[status] }}
                                                title={status.toUpperCase()}
                                            />
                                            {isLoading && <div className="avatar-shimmer" />}
                                        </div>

                                        {/* Info Section */}
                                        <div className="team-info">
                                            <span className="team-name">
                                                {user?.display_name || user?.global_name || dev.name}
                                            </span>
                                            <span className="team-role">{dev.role}</span>
                                            {user && (
                                                <div className="team-user-row">
                                                    <span className="team-username">@{user.username}</span>
                                                    {/* Clan Badge */}
                                                    {getClanBadgeUrl(user) && user.primary_guild && (
                                                        <div className="clan-badge" title={`Clan: ${user.primary_guild.tag}`}>
                                                            <Image
                                                                src={getClanBadgeUrl(user)!}
                                                                alt={user.primary_guild.tag}
                                                                width={16}
                                                                height={16}
                                                                className="clan-badge-img"
                                                            />
                                                            <span className="clan-tag">{user.primary_guild.tag}</span>
                                                        </div>
                                                    )}
                                                </div>
                                            )}
                                            {/* Activity */}
                                            {activity && (
                                                <div className="team-activity">
                                                    <span className="activity-name">
                                                        {activity.type === 0 ? '🎮 ' : ''}
                                                        {activity.name}
                                                    </span>
                                                    {activity.details && (
                                                        <span className="activity-details">
                                                            {activity.details}
                                                        </span>
                                                    )}
                                                </div>
                                            )}
                                            {/* Spotify */}
                                            {lanyard?.listening_to_spotify && lanyard.spotify && (
                                                <div className="team-spotify">
                                                    <span>🎵 {lanyard.spotify.song}</span>
                                                    <span className="spotify-artist">
                                                        by {lanyard.spotify.artist}
                                                    </span>
                                                </div>
                                            )}
                                        </div>

                                        {/* Discord Badge */}
                                        <div className="team-discord">
                                            <FaDiscord size={16} />
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </div>

                {/* Footer Bottom */}
                <div className="footer-bottom-bar">
                    <div className="footer-copyright">
                        <span>&copy; 2025 SteamKotakLegends</span>
                        <span className="separator">•</span>
                        <span className="made-with">
                            Made with <FaHeart className="heart-pulse" size={12} /> in Indonesia
                        </span>
                    </div>
                    <div className="footer-meta">
                        <span className="version-badge">
                            <HiGlobe size={12} />
                            Open Source
                        </span>
                    </div>
                </div>
            </div>

            <style jsx>{`
                .footer-modern {
                    position: relative;
                    padding: 80px 0 24px;
                    background: linear-gradient(180deg, transparent 0%, rgba(10, 10, 20, 0.8) 100%);
                    overflow: hidden;
                }

                .footer-bg-effects {
                    position: absolute;
                    inset: 0;
                    pointer-events: none;
                    overflow: hidden;
                }

                .footer-gradient-orb {
                    position: absolute;
                    border-radius: 50%;
                    filter: blur(80px);
                    opacity: 0.15;
                }

                .footer-orb-1 {
                    width: 400px;
                    height: 400px;
                    background: linear-gradient(135deg, #5865f2, #7289da);
                    top: -100px;
                    left: -100px;
                }

                .footer-orb-2 {
                    width: 300px;
                    height: 300px;
                    background: linear-gradient(135deg, #5865f2, #99aab5);
                    bottom: -50px;
                    right: -50px;
                }

                .footer-grid-pattern {
                    position: absolute;
                    inset: 0;
                    background-image: 
                        linear-gradient(rgba(255,255,255,0.02) 1px, transparent 1px),
                        linear-gradient(90deg, rgba(255,255,255,0.02) 1px, transparent 1px);
                    background-size: 50px 50px;
                }

                .footer-container {
                    position: relative;
                    z-index: 1;
                }

                .footer-main {
                    display: grid;
                    grid-template-columns: 2fr 1fr 2fr;
                    gap: 60px;
                    padding-bottom: 48px;
                    border-bottom: 1px solid rgba(255, 255, 255, 0.08);
                }

                /* Brand Section */
                .footer-brand-section {
                    display: flex;
                    flex-direction: column;
                    gap: 20px;
                }

                .footer-brand-logo {
                    display: flex;
                    align-items: center;
                    gap: 14px;
                    text-decoration: none;
                }

                .brand-icon-wrapper {
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    width: 48px;
                    height: 48px;
                    background: linear-gradient(135deg, #5865f2 0%, #7289da 100%);
                    border-radius: 14px;
                    color: white;
                    box-shadow: 0 8px 32px rgba(88, 101, 242, 0.3);
                }

                .brand-text {
                    display: flex;
                    flex-direction: column;
                    gap: 2px;
                }

                .brand-name {
                    font-size: 1.4rem;
                    font-weight: 700;
                    color: white;
                    letter-spacing: -0.5px;
                }

                .brand-accent {
                    background: linear-gradient(135deg, #5865f2, #7289da);
                    -webkit-background-clip: text;
                    -webkit-text-fill-color: transparent;
                    background-clip: text;
                }

                .brand-tagline {
                    display: flex;
                    align-items: center;
                    gap: 4px;
                    font-size: 0.75rem;
                    color: rgba(255, 255, 255, 0.5);
                }

                .footer-description {
                    color: rgba(255, 255, 255, 0.6);
                    font-size: 0.95rem;
                    line-height: 1.7;
                    max-width: 320px;
                }

                .footer-socials {
                    display: flex;
                    gap: 10px;
                }

                .social-btn {
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    width: 42px;
                    height: 42px;
                    border-radius: 12px;
                    background: rgba(255, 255, 255, 0.05);
                    border: 1px solid rgba(255, 255, 255, 0.08);
                    color: rgba(255, 255, 255, 0.7);
                    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
                }

                .social-btn:hover {
                    transform: translateY(-3px);
                    color: white;
                }

                .social-btn.github:hover {
                    background: rgba(255, 255, 255, 0.1);
                    border-color: rgba(255, 255, 255, 0.2);
                }

                .social-btn.discord:hover {
                    background: rgba(88, 101, 242, 0.2);
                    border-color: rgba(88, 101, 242, 0.4);
                    color: #5865F2;
                }

                /* Links Section */
                .footer-links-section {
                    display: flex;
                    flex-direction: column;
                    gap: 20px;
                }

                .footer-heading {
                    display: flex;
                    align-items: center;
                    gap: 8px;
                    font-size: 0.85rem;
                    font-weight: 600;
                    color: white;
                    text-transform: uppercase;
                    letter-spacing: 1px;
                }

                .footer-nav {
                    display: flex;
                    flex-direction: column;
                    gap: 12px;
                    list-style: none;
                    padding: 0;
                    margin: 0;
                }

                .footer-nav-link {
                    color: rgba(255, 255, 255, 0.6);
                    text-decoration: none;
                    font-size: 0.95rem;
                    transition: all 0.2s ease;
                    display: inline-flex;
                    align-items: center;
                }

                .footer-nav-link:hover {
                    color: white;
                    transform: translateX(4px);
                }

                /* Team Section */
                .footer-team-section {
                    display: flex;
                    flex-direction: column;
                    gap: 20px;
                }

                .team-cards {
                    display: flex;
                    flex-direction: column;
                    gap: 12px;
                }

                .team-card {
                    display: flex;
                    align-items: flex-start;
                    gap: 14px;
                    padding: 16px;
                    background: rgba(255, 255, 255, 0.03);
                    border: 1px solid rgba(255, 255, 255, 0.06);
                    border-radius: 16px;
                    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
                }

                .team-card:hover {
                    background: rgba(88, 101, 242, 0.08);
                    border-color: rgba(88, 101, 242, 0.2);
                    transform: translateY(-2px);
                    box-shadow: 0 10px 40px rgba(0, 0, 0, 0.2);
                }

                .avatar-container {
                    position: relative;
                    width: 64px;
                    height: 64px;
                    flex-shrink: 0;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                }

                :global(.team-avatar-img) {
                    width: 48px;
                    height: 48px;
                    border-radius: 50%;
                    object-fit: cover;
                    position: relative;
                    z-index: 1;
                }

                :global(.avatar-decoration) {
                    position: absolute;
                    top: 0;
                    left: 0;
                    width: 64px;
                    height: 64px;
                    pointer-events: none;
                    z-index: 2;
                }

                .team-avatar-fallback {
                    width: 48px;
                    height: 48px;
                    border-radius: 50%;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-size: 1.3rem;
                    font-weight: 700;
                    color: white;
                }

                .status-indicator {
                    position: absolute;
                    bottom: 4px;
                    right: 4px;
                    width: 16px;
                    height: 16px;
                    border-radius: 50%;
                    border: 3px solid #0a0a14;
                    box-shadow: 0 0 0 1px rgba(255, 255, 255, 0.1);
                    z-index: 3;
                }

                .avatar-shimmer {
                    position: absolute;
                    inset: 8px;
                    border-radius: 50%;
                    background: linear-gradient(90deg, transparent, rgba(255,255,255,0.1), transparent);
                    background-size: 200% 100%;
                    animation: shimmer 1.5s infinite;
                }

                @keyframes shimmer {
                    0% { background-position: -200% 0; }
                    100% { background-position: 200% 0; }
                }

                .team-info {
                    flex: 1;
                    display: flex;
                    flex-direction: column;
                    gap: 2px;
                    min-width: 0;
                }

                .team-name {
                    font-size: 1rem;
                    font-weight: 600;
                    color: white;
                }

                .team-role {
                    font-size: 0.75rem;
                    color: rgba(255, 255, 255, 0.5);
                }

                .team-username {
                    font-size: 0.7rem;
                    color: rgba(255, 255, 255, 0.35);
                }

                .team-user-row {
                    display: flex;
                    align-items: center;
                    gap: 8px;
                    flex-wrap: wrap;
                }

                .clan-badge {
                    display: flex;
                    align-items: center;
                    gap: 4px;
                    padding: 2px 6px;
                    background: rgba(88, 101, 242, 0.15);
                    border-radius: 4px;
                    border: 1px solid rgba(88, 101, 242, 0.3);
                }

                :global(.clan-badge-img) {
                    width: 16px;
                    height: 16px;
                    border-radius: 2px;
                }

                .clan-tag {
                    font-size: 0.65rem;
                    font-weight: 600;
                    color: rgba(255, 255, 255, 0.7);
                    text-transform: uppercase;
                    letter-spacing: 0.5px;
                }

                .team-activity {
                    margin-top: 6px;
                    padding: 6px 10px;
                    background: rgba(255, 255, 255, 0.03);
                    border-radius: 8px;
                    display: flex;
                    flex-direction: column;
                    gap: 2px;
                }

                .activity-name {
                    font-size: 0.75rem;
                    color: rgba(255, 255, 255, 0.7);
                    font-weight: 500;
                }

                .activity-details {
                    font-size: 0.7rem;
                    color: rgba(255, 255, 255, 0.4);
                    white-space: nowrap;
                    overflow: hidden;
                    text-overflow: ellipsis;
                }

                .team-spotify {
                    margin-top: 6px;
                    padding: 6px 10px;
                    background: linear-gradient(135deg, rgba(30, 215, 96, 0.1), rgba(30, 215, 96, 0.05));
                    border-radius: 8px;
                    display: flex;
                    flex-direction: column;
                    gap: 2px;
                    font-size: 0.75rem;
                    color: #1ed760;
                }

                .spotify-artist {
                    font-size: 0.7rem;
                    color: rgba(30, 215, 96, 0.7);
                }

                .team-discord {
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    width: 36px;
                    height: 36px;
                    border-radius: 10px;
                    background: linear-gradient(135deg, #5865f2, #7289da);
                    color: white;
                    opacity: 0.7;
                    transition: all 0.3s ease;
                    flex-shrink: 0;
                    align-self: center;
                }

                .team-card:hover .team-discord {
                    opacity: 1;
                    transform: scale(1.05);
                }

                /* Footer Bottom */
                .footer-bottom-bar {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    padding-top: 24px;
                }

                .footer-copyright {
                    display: flex;
                    align-items: center;
                    gap: 12px;
                    font-size: 0.85rem;
                    color: rgba(255, 255, 255, 0.5);
                }

                .separator {
                    opacity: 0.3;
                }

                .made-with {
                    display: flex;
                    align-items: center;
                    gap: 4px;
                }

                :global(.heart-pulse) {
                    color: #ef4444;
                    animation: heartPulse 1.2s ease-in-out infinite;
                }

                @keyframes heartPulse {
                    0%, 100% { transform: scale(1); }
                    50% { transform: scale(1.2); }
                }

                .footer-meta {
                    display: flex;
                    gap: 12px;
                }

                .version-badge {
                    display: flex;
                    align-items: center;
                    gap: 6px;
                    padding: 6px 12px;
                    background: rgba(255, 255, 255, 0.05);
                    border: 1px solid rgba(255, 255, 255, 0.08);
                    border-radius: 20px;
                    font-size: 0.75rem;
                    color: rgba(255, 255, 255, 0.6);
                }

                /* Responsive */
                @media (max-width: 900px) {
                    .footer-main {
                        grid-template-columns: 1fr 1fr;
                        gap: 40px;
                    }

                    .footer-brand-section {
                        grid-column: 1 / -1;
                    }
                }

                @media (max-width: 600px) {
                    .footer-modern {
                        padding: 60px 0 20px;
                    }

                    .footer-main {
                        grid-template-columns: 1fr;
                        gap: 36px;
                        text-align: center;
                    }

                    .footer-brand-logo {
                        justify-content: center;
                    }

                    .footer-description {
                        margin: 0 auto;
                    }

                    .footer-socials {
                        justify-content: center;
                    }

                    .footer-heading {
                        justify-content: center;
                    }

                    .footer-nav {
                        align-items: center;
                    }

                    .footer-bottom-bar {
                        flex-direction: column;
                        gap: 16px;
                        text-align: center;
                    }

                    .footer-copyright {
                        flex-direction: column;
                        gap: 6px;
                    }

                    .separator {
                        display: none;
                    }
                }
            `}</style>
        </footer>
    );
}
