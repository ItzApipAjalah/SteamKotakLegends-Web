'use client';

import { useState, useEffect, useCallback, memo } from 'react';
import { createPortal } from 'react-dom';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import Tilt from 'react-parallax-tilt';
import { FaTimes, FaGithub, FaGamepad, FaSpotify, FaInstagram, FaGlobe } from 'react-icons/fa';
import { HiSparkles, HiStatusOnline, HiLightningBolt } from 'react-icons/hi';
import type { Developer } from '@/app/api/discord/types';
import { STATUS_COLORS, getAvatarUrl, getDecorationUrl } from '@/app/api/discord/types';

// Team profile images mapping
const TEAM_IMAGES: Record<string, string> = {
    '481734993622728715': '/team/amwp.png',
    '403425777833738240': '/team/kizutod.png',
};

// Team social links mapping
const TEAM_SOCIALS: Record<string, { github?: string; instagram?: string; website?: string }> = {
    '481734993622728715': {
        github: 'https://github.com/ItzApipAjalah/SteamKotakLegends',
        instagram: 'https://www.instagram.com/apip01____/',
        website: 'https://www.afifmedya.my.id/',
    },
    '403425777833738240': {
        instagram: 'https://www.instagram.com/rzts._/',
        website: 'https://restunih.my.id/',
    },
};

// Memoized social link button to prevent re-renders
const SocialLink = memo(({ href, color, bgColor, icon: Icon }: {
    href: string;
    color: string;
    bgColor: string;
    icon: React.ComponentType<{ size: number }>;
}) => (
    <motion.a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        whileHover={{ scale: 1.1, y: -3 }}
        whileTap={{ scale: 0.95 }}
        style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: '48px',
            height: '48px',
            borderRadius: '14px',
            background: bgColor,
            border: `1px solid ${color}40`,
            color: color,
            boxShadow: `0 4px 20px ${color}20`,
        }}
    >
        <Icon size={20} />
    </motion.a>
));
SocialLink.displayName = 'SocialLink';

interface ProfileCardModalProps {
    developer: Developer | null;
    isOpen: boolean;
    onClose: () => void;
}

function ProfileCardModal({ developer, isOpen, onClose }: ProfileCardModalProps) {
    const [mounted, setMounted] = useState(false);

    // Mount check for portal
    useEffect(() => {
        setMounted(true);
        return () => setMounted(false);
    }, []);

    // Close on escape key
    useEffect(() => {
        if (!isOpen) return;

        const handleEscape = (e: KeyboardEvent) => {
            if (e.key === 'Escape') onClose();
        };

        window.addEventListener('keydown', handleEscape);
        document.body.style.overflow = 'hidden';

        return () => {
            window.removeEventListener('keydown', handleEscape);
            document.body.style.overflow = '';
        };
    }, [isOpen, onClose]);

    // Stable close handler
    const handleOverlayClick = useCallback(() => onClose(), [onClose]);
    const stopPropagation = useCallback((e: React.MouseEvent) => e.stopPropagation(), []);

    if (!developer || !mounted) return null;

    const lanyard = developer.lanyard;
    const user = lanyard?.discord_user;
    const status = lanyard?.discord_status || 'offline';
    const activity = lanyard?.activities?.[0];
    const profileImage = TEAM_IMAGES[developer.discordId];
    const socials = TEAM_SOCIALS[developer.discordId] || {};
    const statusColor = STATUS_COLORS[status];

    const modalContent = (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    onClick={handleOverlayClick}
                    style={{
                        position: 'fixed',
                        inset: 0,
                        background: 'rgba(0, 0, 0, 0.9)',
                        backdropFilter: 'blur(12px)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        zIndex: 99999,
                        padding: '20px',
                    }}
                >
                    {/* Center wrapper */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9, y: 30 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.9, y: 30 }}
                        transition={{ type: 'spring', damping: 25, stiffness: 300 }}
                        onClick={stopPropagation}
                        style={{ position: 'relative' }}
                    >
                        {/* Close button */}
                        <button
                            onClick={onClose}
                            aria-label="Close modal"
                            style={{
                                position: 'absolute',
                                top: '-50px',
                                right: '0',
                                width: '44px',
                                height: '44px',
                                borderRadius: '50%',
                                background: 'rgba(255, 255, 255, 0.1)',
                                border: '1px solid rgba(255, 255, 255, 0.2)',
                                color: 'white',
                                cursor: 'pointer',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                transition: 'transform 0.2s, background 0.2s',
                                zIndex: 10,
                            }}
                            onMouseEnter={(e) => {
                                e.currentTarget.style.transform = 'rotate(90deg) scale(1.1)';
                                e.currentTarget.style.background = 'rgba(255, 255, 255, 0.2)';
                            }}
                            onMouseLeave={(e) => {
                                e.currentTarget.style.transform = 'rotate(0deg) scale(1)';
                                e.currentTarget.style.background = 'rgba(255, 255, 255, 0.1)';
                            }}
                        >
                            <FaTimes size={18} />
                        </button>

                        {/* 3D Tilt Card - Simplified for performance */}
                        <Tilt
                            tiltMaxAngleX={12}
                            tiltMaxAngleY={12}
                            perspective={1000}
                            scale={1.02}
                            transitionSpeed={400}
                            glareEnable={true}
                            glareMaxOpacity={0.15}
                            glareColor="#5865f2"
                            glarePosition="all"
                            glareBorderRadius="24px"
                        >
                            <div
                                style={{
                                    position: 'relative',
                                    width: '340px',
                                    minHeight: '500px',
                                    borderRadius: '24px',
                                    overflow: 'hidden',
                                    background: 'linear-gradient(160deg, rgba(25, 25, 45, 0.98) 0%, rgba(15, 15, 30, 0.99) 100%)',
                                    border: '1px solid rgba(88, 101, 242, 0.2)',
                                    boxShadow: '0 25px 60px rgba(0, 0, 0, 0.5), 0 0 80px rgba(88, 101, 242, 0.15)',
                                }}
                            >
                                {/* Simple gradient overlay */}
                                <div
                                    style={{
                                        position: 'absolute',
                                        inset: 0,
                                        background: 'radial-gradient(ellipse at 30% 0%, rgba(88, 101, 242, 0.15) 0%, transparent 50%)',
                                        pointerEvents: 'none',
                                    }}
                                />

                                {/* Card content */}
                                <div
                                    style={{
                                        position: 'relative',
                                        zIndex: 2,
                                        display: 'flex',
                                        flexDirection: 'column',
                                        alignItems: 'center',
                                        padding: '32px 28px',
                                        textAlign: 'center',
                                    }}
                                >
                                    {/* Header */}
                                    <div style={{ marginBottom: '20px' }}>
                                        <h2
                                            style={{
                                                fontSize: '1.9rem',
                                                fontWeight: 800,
                                                margin: 0,
                                                background: 'linear-gradient(135deg, #ffffff 0%, #a8b4ff 100%)',
                                                WebkitBackgroundClip: 'text',
                                                WebkitTextFillColor: 'transparent',
                                                backgroundClip: 'text',
                                            }}
                                        >
                                            {user?.display_name || user?.global_name || developer.name}
                                        </h2>
                                        <div
                                            style={{
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                gap: '6px',
                                                marginTop: '8px',
                                                padding: '6px 14px',
                                                background: 'rgba(88, 101, 242, 0.15)',
                                                borderRadius: '16px',
                                                border: '1px solid rgba(88, 101, 242, 0.25)',
                                            }}
                                        >
                                            <HiLightningBolt size={14} style={{ color: '#fbbf24' }} />
                                            <span style={{ fontSize: '0.85rem', color: 'rgba(255, 255, 255, 0.8)', fontWeight: 600 }}>
                                                {developer.role}
                                            </span>
                                            <HiSparkles size={14} style={{ color: '#a855f7' }} />
                                        </div>
                                    </div>

                                    {/* Profile image */}
                                    <div
                                        style={{
                                            position: 'relative',
                                            width: '220px',
                                            height: '220px',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            margin: '0 0 24px',
                                        }}
                                    >
                                        {/* Glow */}
                                        <div
                                            style={{
                                                position: 'absolute',
                                                inset: '10%',
                                                borderRadius: '50%',
                                                background: `radial-gradient(circle, ${statusColor}40 0%, transparent 70%)`,
                                                filter: 'blur(25px)',
                                            }}
                                        />

                                        {profileImage ? (
                                            <Image
                                                src={profileImage}
                                                alt={developer.name}
                                                width={220}
                                                height={280}
                                                style={{
                                                    objectFit: 'contain',
                                                    filter: 'drop-shadow(0 15px 30px rgba(0, 0, 0, 0.5))',
                                                    position: 'relative',
                                                    zIndex: 1,
                                                }}
                                                priority
                                            />
                                        ) : user ? (
                                            <div style={{ position: 'relative' }}>
                                                <Image
                                                    src={getAvatarUrl(user)}
                                                    alt={developer.name}
                                                    width={120}
                                                    height={120}
                                                    style={{
                                                        borderRadius: '50%',
                                                        border: '3px solid rgba(88, 101, 242, 0.4)',
                                                        boxShadow: '0 0 30px rgba(88, 101, 242, 0.3)',
                                                    }}
                                                />
                                                {getDecorationUrl(user) && (
                                                    <Image
                                                        src={getDecorationUrl(user)!}
                                                        alt=""
                                                        width={150}
                                                        height={150}
                                                        style={{
                                                            position: 'absolute',
                                                            top: '-15px',
                                                            left: '-15px',
                                                            pointerEvents: 'none',
                                                        }}
                                                    />
                                                )}
                                            </div>
                                        ) : (
                                            <div
                                                style={{
                                                    width: '120px',
                                                    height: '120px',
                                                    borderRadius: '50%',
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    justifyContent: 'center',
                                                    fontSize: '3.5rem',
                                                    fontWeight: 700,
                                                    color: 'white',
                                                    background: developer.gradient,
                                                    boxShadow: '0 0 40px rgba(88, 101, 242, 0.4)',
                                                }}
                                            >
                                                {developer.name.charAt(0)}
                                            </div>
                                        )}
                                    </div>

                                    {/* Status and info */}
                                    <div
                                        style={{
                                            display: 'flex',
                                            flexDirection: 'column',
                                            alignItems: 'center',
                                            gap: '12px',
                                            width: '100%',
                                        }}
                                    >
                                        {/* Status badge */}
                                        <div
                                            style={{
                                                display: 'flex',
                                                alignItems: 'center',
                                                gap: '8px',
                                                padding: '10px 20px',
                                                borderRadius: '20px',
                                                border: `1px solid ${statusColor}50`,
                                                background: `${statusColor}15`,
                                                fontSize: '0.9rem',
                                                fontWeight: 600,
                                            }}
                                        >
                                            <HiStatusOnline size={14} style={{ color: statusColor }} />
                                            <span style={{ color: statusColor, textTransform: 'capitalize' }}>
                                                {status}
                                            </span>
                                        </div>

                                        {/* Username */}
                                        {user && (
                                            <p style={{ color: 'rgba(255, 255, 255, 0.5)', fontSize: '0.9rem', margin: 0 }}>
                                                @{user.username}
                                            </p>
                                        )}

                                        {/* Activity */}
                                        {activity && (
                                            <div
                                                style={{
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    gap: '10px',
                                                    padding: '12px 16px',
                                                    background: 'rgba(88, 101, 242, 0.1)',
                                                    border: '1px solid rgba(88, 101, 242, 0.2)',
                                                    borderRadius: '12px',
                                                    color: '#7289da',
                                                    width: '100%',
                                                    textAlign: 'left',
                                                }}
                                            >
                                                <FaGamepad size={16} style={{ flexShrink: 0 }} />
                                                <div style={{ overflow: 'hidden' }}>
                                                    <div style={{ fontSize: '0.85rem', fontWeight: 600, color: '#8b9dff' }}>
                                                        {activity.name}
                                                    </div>
                                                    {activity.details && (
                                                        <div style={{ fontSize: '0.75rem', opacity: 0.6, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                                                            {activity.details}
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        )}

                                        {/* Spotify */}
                                        {lanyard?.listening_to_spotify && lanyard.spotify && (
                                            <div
                                                style={{
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    gap: '10px',
                                                    padding: '12px 16px',
                                                    background: 'rgba(30, 215, 96, 0.1)',
                                                    border: '1px solid rgba(30, 215, 96, 0.2)',
                                                    borderRadius: '12px',
                                                    color: '#1ed760',
                                                    width: '100%',
                                                    textAlign: 'left',
                                                }}
                                            >
                                                <FaSpotify size={16} style={{ flexShrink: 0 }} />
                                                <div style={{ overflow: 'hidden' }}>
                                                    <div style={{ fontSize: '0.85rem', fontWeight: 600 }}>
                                                        {lanyard.spotify.song}
                                                    </div>
                                                    <div style={{ fontSize: '0.75rem', opacity: 0.6 }}>
                                                        by {lanyard.spotify.artist}
                                                    </div>
                                                </div>
                                            </div>
                                        )}

                                        {/* Social links */}
                                        <div style={{ display: 'flex', gap: '12px', marginTop: '8px' }}>
                                            {socials.github && (
                                                <SocialLink
                                                    href={socials.github}
                                                    color="rgba(255, 255, 255, 0.9)"
                                                    bgColor="rgba(255, 255, 255, 0.08)"
                                                    icon={FaGithub}
                                                />
                                            )}
                                            {socials.instagram && (
                                                <SocialLink
                                                    href={socials.instagram}
                                                    color="#E1306C"
                                                    bgColor="rgba(225, 48, 108, 0.15)"
                                                    icon={FaInstagram}
                                                />
                                            )}
                                            {socials.website && (
                                                <SocialLink
                                                    href={socials.website}
                                                    color="#00c896"
                                                    bgColor="rgba(0, 200, 150, 0.15)"
                                                    icon={FaGlobe}
                                                />
                                            )}
                                        </div>
                                    </div>
                                </div>

                                {/* Border glow */}
                                <div
                                    style={{
                                        position: 'absolute',
                                        inset: '-1px',
                                        borderRadius: '25px',
                                        background: 'linear-gradient(135deg, rgba(88, 101, 242, 0.3) 0%, transparent 50%, rgba(138, 43, 226, 0.2) 100%)',
                                        WebkitMask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
                                        WebkitMaskComposite: 'xor',
                                        maskComposite: 'exclude',
                                        padding: '1px',
                                        pointerEvents: 'none',
                                    }}
                                />
                            </div>
                        </Tilt>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );

    return createPortal(modalContent, document.body);
}

export default memo(ProfileCardModal);
