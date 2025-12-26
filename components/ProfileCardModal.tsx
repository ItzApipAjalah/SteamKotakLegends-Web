'use client';

import { useState, useEffect, useCallback, useMemo } from 'react';
import { createPortal } from 'react-dom';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import Tilt from 'react-parallax-tilt';
import Particles, { initParticlesEngine } from '@tsparticles/react';
import { loadSlim } from '@tsparticles/slim';
import { FaDiscord, FaTimes, FaGithub, FaGamepad, FaSpotify, FaInstagram, FaGlobe } from 'react-icons/fa';
import { HiSparkles, HiStatusOnline, HiLightningBolt } from 'react-icons/hi';
import type { Developer } from '@/app/api/discord/types';
import { STATUS_COLORS, getAvatarUrl, getDecorationUrl } from '@/app/api/discord/types';

// Team profile images mapping
const TEAM_IMAGES: Record<string, string> = {
    '481734993622728715': '/team/amwp.png',    // AMWP
    '403425777833738240': '/team/kizutod.png', // KizuTOD
};

// Team social links mapping
const TEAM_SOCIALS: Record<string, { github?: string; instagram?: string; website?: string }> = {
    '481734993622728715': { // AMWP
        github: 'https://github.com/ItzApipAjalah/SteamKotakLegends',
        instagram: 'https://www.instagram.com/apip01____/',
        website: 'https://www.afifmedya.my.id/',
    },
    '403425777833738240': { // KizuTOD
        instagram: 'https://www.instagram.com/rzts._/',
        website: 'https://restunih.my.id/',
    },
};

interface ProfileCardModalProps {
    developer: Developer | null;
    isOpen: boolean;
    onClose: () => void;
}

export default function ProfileCardModal({ developer, isOpen, onClose }: ProfileCardModalProps) {
    const [mounted, setMounted] = useState(false);
    const [particlesReady, setParticlesReady] = useState(false);
    const [mousePos, setMousePos] = useState({ x: 50, y: 50 });

    // Initialize particles engine
    useEffect(() => {
        initParticlesEngine(async (engine) => {
            await loadSlim(engine);
        }).then(() => {
            setParticlesReady(true);
        });
    }, []);

    // Mount check for portal
    useEffect(() => {
        setMounted(true);
        return () => setMounted(false);
    }, []);

    // Close on escape key
    useEffect(() => {
        const handleEscape = (e: KeyboardEvent) => {
            if (e.key === 'Escape') onClose();
        };
        if (isOpen) {
            window.addEventListener('keydown', handleEscape);
            document.body.style.overflow = 'hidden';
        }
        return () => {
            window.removeEventListener('keydown', handleEscape);
            document.body.style.overflow = '';
        };
    }, [isOpen, onClose]);

    // Track mouse position for holographic effect
    const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
        const rect = e.currentTarget.getBoundingClientRect();
        const x = ((e.clientX - rect.left) / rect.width) * 100;
        const y = ((e.clientY - rect.top) / rect.height) * 100;
        setMousePos({ x, y });
    }, []);

    // Particles configuration
    const particlesOptions = useMemo(() => ({
        fullScreen: false,
        background: { color: { value: 'transparent' } },
        fpsLimit: 60,
        particles: {
            color: { value: ['#5865f2', '#7289da', '#99aab5', '#ffffff', '#a855f7'] },
            move: {
                enable: true,
                speed: 0.8,
                direction: 'none' as const,
                random: true,
                straight: false,
                outModes: { default: 'out' as const },
            },
            number: { value: 40, density: { enable: true } },
            opacity: { value: { min: 0.1, max: 0.6 }, animation: { enable: true, speed: 1 } },
            shape: { type: 'circle' },
            size: { value: { min: 1, max: 3 } },
            twinkle: { particles: { enable: true, frequency: 0.05 } },
        },
    }), []);

    if (!developer || !mounted) return null;

    const lanyard = developer.lanyard;
    const user = lanyard?.discord_user;
    const status = lanyard?.discord_status || 'offline';
    const activity = lanyard?.activities?.[0];
    const profileImage = TEAM_IMAGES[developer.discordId];
    const socials = TEAM_SOCIALS[developer.discordId] || {};

    const modalContent = (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onClick={onClose}
                    style={{
                        position: 'fixed',
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        width: '100vw',
                        height: '100vh',
                        background: 'radial-gradient(ellipse at center, rgba(10, 10, 30, 0.95) 0%, rgba(0, 0, 0, 0.98) 100%)',
                        backdropFilter: 'blur(25px)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        zIndex: 99999,
                        padding: '20px',
                        overflow: 'hidden',
                    }}
                >
                    {/* Background particles - absolute positioned, no layout impact */}
                    {particlesReady && (
                        <div style={{ position: 'absolute', inset: 0, zIndex: 0, pointerEvents: 'none' }}>
                            <Particles
                                options={particlesOptions}
                                style={{
                                    position: 'absolute',
                                    inset: 0,
                                }}
                            />
                        </div>
                    )}

                    {/* Center wrapper */}
                    <div style={{
                        position: 'absolute',
                        top: '50%',
                        left: '50%',
                        transform: 'translate(-50%, -50%)',
                        zIndex: 1,
                    }}>
                        <motion.div
                            initial={{ opacity: 0, scale: 0.7, y: 80, rotateX: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0, rotateX: 0 }}
                            exit={{ opacity: 0, scale: 0.7, y: 80, rotateX: -20 }}
                            transition={{ type: 'spring', damping: 18, stiffness: 200 }}
                            onClick={(e) => e.stopPropagation()}
                            style={{ position: 'relative' }}
                        >
                            {/* Close button */}
                            <motion.button
                                onClick={onClose}
                                whileHover={{ scale: 1.15, rotate: 90 }}
                                whileTap={{ scale: 0.9 }}
                                style={{
                                    position: 'absolute',
                                    top: '-60px',
                                    right: '0px',
                                    width: '48px',
                                    height: '48px',
                                    borderRadius: '50%',
                                    background: 'linear-gradient(135deg, rgba(88, 101, 242, 0.3) 0%, rgba(138, 43, 226, 0.2) 100%)',
                                    border: '1px solid rgba(255, 255, 255, 0.2)',
                                    color: 'white',
                                    cursor: 'pointer',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    backdropFilter: 'blur(10px)',
                                    boxShadow: '0 8px 32px rgba(88, 101, 242, 0.3)',
                                    zIndex: 10,
                                }}
                            >
                                <FaTimes size={20} />
                            </motion.button>

                            {/* ULTRA 3D Holographic Tilt Card */}
                            <Tilt
                                tiltMaxAngleX={20}
                                tiltMaxAngleY={20}
                                perspective={1200}
                                scale={1.05}
                                transitionSpeed={1500}
                                gyroscope={true}
                                glareEnable={true}
                                glareMaxOpacity={0.35}
                                glareColor="linear-gradient(135deg, rgba(255,255,255,0.8), rgba(88,101,242,0.6))"
                                glarePosition="all"
                                glareBorderRadius="32px"
                            >
                                <div
                                    onMouseMove={handleMouseMove}
                                    style={{
                                        position: 'relative',
                                        width: '360px',
                                        minHeight: '560px',
                                        borderRadius: '32px',
                                        overflow: 'hidden',
                                        background: 'linear-gradient(160deg, rgba(20, 20, 45, 0.98) 0%, rgba(10, 10, 25, 0.99) 50%, rgba(5, 5, 15, 1) 100%)',
                                        boxShadow: `
                                        0 0 0 1px rgba(255, 255, 255, 0.1),
                                        0 30px 80px rgba(0, 0, 0, 0.6),
                                        0 0 120px rgba(88, 101, 242, 0.25),
                                        0 0 200px rgba(138, 43, 226, 0.15),
                                        inset 0 0 100px rgba(88, 101, 242, 0.05)
                                    `,
                                    }}
                                >
                                    {/* Holographic rainbow overlay */}
                                    <div
                                        style={{
                                            position: 'absolute',
                                            inset: 0,
                                            background: `
                                            linear-gradient(
                                                ${mousePos.x * 3.6}deg,
                                                transparent 0%,
                                                rgba(255, 0, 100, 0.08) 15%,
                                                rgba(255, 165, 0, 0.08) 25%,
                                                rgba(255, 255, 0, 0.06) 35%,
                                                rgba(0, 255, 100, 0.08) 45%,
                                                rgba(0, 200, 255, 0.08) 55%,
                                                rgba(100, 100, 255, 0.08) 65%,
                                                rgba(200, 0, 255, 0.08) 75%,
                                                rgba(255, 0, 100, 0.08) 85%,
                                                transparent 100%
                                            )
                                        `,
                                            opacity: 0.7,
                                            mixBlendMode: 'overlay',
                                            pointerEvents: 'none',
                                            transition: 'background 0.1s ease-out',
                                        }}
                                    />

                                    {/* Spotlight effect following mouse */}
                                    <div
                                        style={{
                                            position: 'absolute',
                                            inset: 0,
                                            background: `radial-gradient(
                                            circle at ${mousePos.x}% ${mousePos.y}%,
                                            rgba(255, 255, 255, 0.15) 0%,
                                            rgba(88, 101, 242, 0.1) 20%,
                                            transparent 50%
                                        )`,
                                            pointerEvents: 'none',
                                            transition: 'background 0.05s ease-out',
                                        }}
                                    />

                                    {/* Animated gradient mesh */}
                                    <div
                                        style={{
                                            position: 'absolute',
                                            inset: 0,
                                            background: `
                                            radial-gradient(ellipse at 20% 0%, rgba(138, 43, 226, 0.2) 0%, transparent 40%),
                                            radial-gradient(ellipse at 80% 20%, rgba(88, 101, 242, 0.15) 0%, transparent 40%),
                                            radial-gradient(ellipse at 40% 100%, rgba(0, 150, 255, 0.1) 0%, transparent 40%),
                                            radial-gradient(ellipse at 100% 80%, rgba(255, 0, 150, 0.1) 0%, transparent 40%)
                                        `,
                                            pointerEvents: 'none',
                                            animation: 'meshMove 8s ease-in-out infinite alternate',
                                        }}
                                    />

                                    {/* Scanning line effect */}
                                    <div
                                        style={{
                                            position: 'absolute',
                                            top: 0,
                                            left: 0,
                                            right: 0,
                                            height: '2px',
                                            background: 'linear-gradient(90deg, transparent, rgba(88, 101, 242, 0.8), rgba(255, 255, 255, 0.9), rgba(88, 101, 242, 0.8), transparent)',
                                            animation: 'scanLine 3s linear infinite',
                                            opacity: 0.6,
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
                                            padding: '36px 30px',
                                            textAlign: 'center',
                                        }}
                                    >
                                        {/* Header with epic name styling */}
                                        <motion.div
                                            initial={{ opacity: 0, y: -30 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ delay: 0.1, type: 'spring' }}
                                            style={{ marginBottom: '24px' }}
                                        >
                                            <h2
                                                style={{
                                                    fontSize: '2.2rem',
                                                    fontWeight: 900,
                                                    margin: 0,
                                                    background: 'linear-gradient(135deg, #ffffff 0%, #c4c9ff 30%, #8b9dff 50%, #a855f7 70%, #ffffff 100%)',
                                                    backgroundSize: '200% 200%',
                                                    animation: 'shimmer 3s linear infinite',
                                                    WebkitBackgroundClip: 'text',
                                                    WebkitTextFillColor: 'transparent',
                                                    backgroundClip: 'text',
                                                    letterSpacing: '-1px',
                                                    filter: 'drop-shadow(0 0 20px rgba(88, 101, 242, 0.5))',
                                                }}
                                            >
                                                {user?.display_name || user?.global_name || developer.name}
                                            </h2>
                                            <motion.div
                                                initial={{ opacity: 0, scale: 0.8 }}
                                                animate={{ opacity: 1, scale: 1 }}
                                                transition={{ delay: 0.2 }}
                                                style={{
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    justifyContent: 'center',
                                                    gap: '8px',
                                                    marginTop: '8px',
                                                    padding: '6px 16px',
                                                    background: 'linear-gradient(135deg, rgba(88, 101, 242, 0.2) 0%, rgba(138, 43, 226, 0.15) 100%)',
                                                    borderRadius: '20px',
                                                    border: '1px solid rgba(88, 101, 242, 0.3)',
                                                }}
                                            >
                                                <HiLightningBolt size={14} style={{ color: '#fbbf24' }} />
                                                <span style={{ fontSize: '0.9rem', color: 'rgba(255, 255, 255, 0.8)', fontWeight: 600 }}>
                                                    {developer.role}
                                                </span>
                                                <HiSparkles size={14} style={{ color: '#a855f7' }} />
                                            </motion.div>
                                        </motion.div>

                                        {/* Profile image with EPIC glow */}
                                        <motion.div
                                            initial={{ opacity: 0, scale: 0.6, rotateY: -30 }}
                                            animate={{ opacity: 1, scale: 1, rotateY: 0 }}
                                            transition={{ delay: 0.15, type: 'spring', stiffness: 150 }}
                                            style={{
                                                position: 'relative',
                                                width: '250px',
                                                height: '250px',
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                margin: '10px 0 28px',
                                            }}
                                        >
                                            {/* Epic triple glow ring */}
                                            <div
                                                style={{
                                                    position: 'absolute',
                                                    inset: '-20%',
                                                    borderRadius: '50%',
                                                    background: `
                                                    radial-gradient(circle, ${STATUS_COLORS[status]}60 0%, transparent 50%),
                                                    radial-gradient(circle at 30% 30%, rgba(138, 43, 226, 0.4) 0%, transparent 40%),
                                                    radial-gradient(circle at 70% 70%, rgba(88, 101, 242, 0.4) 0%, transparent 40%)
                                                `,
                                                    filter: 'blur(40px)',
                                                    animation: 'pulse 4s ease-in-out infinite',
                                                }}
                                            />

                                            {/* Rotating ring */}
                                            <div
                                                style={{
                                                    position: 'absolute',
                                                    inset: '-10%',
                                                    borderRadius: '50%',
                                                    border: '2px solid transparent',
                                                    borderTopColor: 'rgba(88, 101, 242, 0.5)',
                                                    borderRightColor: 'rgba(138, 43, 226, 0.3)',
                                                    animation: 'rotate 8s linear infinite',
                                                }}
                                            />

                                            {profileImage ? (
                                                <Image
                                                    src={profileImage}
                                                    alt={developer.name}
                                                    width={250}
                                                    height={310}
                                                    style={{
                                                        objectFit: 'contain',
                                                        filter: 'drop-shadow(0 20px 50px rgba(0, 0, 0, 0.7)) drop-shadow(0 0 30px rgba(88, 101, 242, 0.3))',
                                                        position: 'relative',
                                                        zIndex: 1,
                                                    }}
                                                    priority
                                                />
                                            ) : user ? (
                                                <div style={{ position: 'relative', width: '130px', height: '130px' }}>
                                                    <Image
                                                        src={getAvatarUrl(user)}
                                                        alt={developer.name}
                                                        width={130}
                                                        height={130}
                                                        style={{
                                                            borderRadius: '50%',
                                                            objectFit: 'cover',
                                                            border: '3px solid rgba(88, 101, 242, 0.5)',
                                                            boxShadow: '0 0 40px rgba(88, 101, 242, 0.5), 0 0 80px rgba(138, 43, 226, 0.3)',
                                                        }}
                                                    />
                                                    {getDecorationUrl(user) && (
                                                        <Image
                                                            src={getDecorationUrl(user)!}
                                                            alt="decoration"
                                                            width={160}
                                                            height={160}
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
                                                        width: '130px',
                                                        height: '130px',
                                                        borderRadius: '50%',
                                                        display: 'flex',
                                                        alignItems: 'center',
                                                        justifyContent: 'center',
                                                        fontSize: '4rem',
                                                        fontWeight: 800,
                                                        color: 'white',
                                                        background: developer.gradient,
                                                        boxShadow: '0 0 60px rgba(88, 101, 242, 0.5)',
                                                    }}
                                                >
                                                    {developer.name.charAt(0)}
                                                </div>
                                            )}
                                        </motion.div>

                                        {/* Status and info section with glass effect */}
                                        <motion.div
                                            initial={{ opacity: 0, y: 30 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ delay: 0.3 }}
                                            style={{
                                                display: 'flex',
                                                flexDirection: 'column',
                                                alignItems: 'center',
                                                gap: '16px',
                                                width: '100%',
                                            }}
                                        >
                                            {/* Epic status badge */}
                                            <motion.div
                                                whileHover={{ scale: 1.05 }}
                                                style={{
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    gap: '10px',
                                                    padding: '12px 24px',
                                                    borderRadius: '28px',
                                                    border: `2px solid ${STATUS_COLORS[status]}`,
                                                    background: `linear-gradient(135deg, ${STATUS_COLORS[status]}25 0%, ${STATUS_COLORS[status]}10 100%)`,
                                                    backdropFilter: 'blur(10px)',
                                                    boxShadow: `0 0 30px ${STATUS_COLORS[status]}40, inset 0 0 20px ${STATUS_COLORS[status]}10`,
                                                    fontSize: '0.95rem',
                                                    fontWeight: 700,
                                                }}
                                            >
                                                <HiStatusOnline
                                                    size={16}
                                                    style={{
                                                        color: STATUS_COLORS[status],
                                                        filter: `drop-shadow(0 0 8px ${STATUS_COLORS[status]})`,
                                                        animation: 'pulse 2s ease-in-out infinite',
                                                    }}
                                                />
                                                <span style={{ color: STATUS_COLORS[status], textTransform: 'uppercase', letterSpacing: '1px' }}>
                                                    {status}
                                                </span>
                                            </motion.div>

                                            {/* Username */}
                                            {user && (
                                                <p
                                                    style={{
                                                        display: 'flex',
                                                        alignItems: 'center',
                                                        gap: '8px',
                                                        color: 'rgba(255, 255, 255, 0.5)',
                                                        fontSize: '0.95rem',
                                                        margin: 0,
                                                    }}
                                                >
                                                    <FaDiscord size={16} style={{ color: '#5865f2' }} />
                                                    @{user.username}
                                                </p>
                                            )}

                                            {/* Activity with glass morphism */}
                                            {activity && (
                                                <motion.div
                                                    whileHover={{ scale: 1.02 }}
                                                    style={{
                                                        display: 'flex',
                                                        alignItems: 'center',
                                                        gap: '14px',
                                                        padding: '14px 20px',
                                                        background: 'linear-gradient(135deg, rgba(88, 101, 242, 0.15) 0%, rgba(88, 101, 242, 0.05) 100%)',
                                                        border: '1px solid rgba(88, 101, 242, 0.3)',
                                                        borderRadius: '16px',
                                                        backdropFilter: 'blur(10px)',
                                                        color: '#8b9dff',
                                                        width: '100%',
                                                        textAlign: 'left',
                                                    }}
                                                >
                                                    <FaGamepad size={18} style={{ flexShrink: 0, filter: 'drop-shadow(0 0 4px rgba(88, 101, 242, 0.5))' }} />
                                                    <div style={{ display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
                                                        <span style={{ fontSize: '0.9rem', fontWeight: 700, color: '#a8b4ff' }}>{activity.name}</span>
                                                        {activity.details && (
                                                            <span style={{ fontSize: '0.8rem', opacity: 0.6, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{activity.details}</span>
                                                        )}
                                                    </div>
                                                </motion.div>
                                            )}

                                            {/* Spotify */}
                                            {lanyard?.listening_to_spotify && lanyard.spotify && (
                                                <motion.div
                                                    whileHover={{ scale: 1.02 }}
                                                    style={{
                                                        display: 'flex',
                                                        alignItems: 'center',
                                                        gap: '14px',
                                                        padding: '14px 20px',
                                                        background: 'linear-gradient(135deg, rgba(30, 215, 96, 0.15) 0%, rgba(30, 215, 96, 0.05) 100%)',
                                                        border: '1px solid rgba(30, 215, 96, 0.3)',
                                                        borderRadius: '16px',
                                                        backdropFilter: 'blur(10px)',
                                                        color: '#1ed760',
                                                        width: '100%',
                                                        textAlign: 'left',
                                                    }}
                                                >
                                                    <FaSpotify size={18} style={{ flexShrink: 0, filter: 'drop-shadow(0 0 4px rgba(30, 215, 96, 0.5))' }} />
                                                    <div style={{ display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
                                                        <span style={{ fontSize: '0.9rem', fontWeight: 700 }}>{lanyard.spotify.song}</span>
                                                        <span style={{ fontSize: '0.8rem', opacity: 0.6 }}>by {lanyard.spotify.artist}</span>
                                                    </div>
                                                </motion.div>
                                            )}

                                            {/* Social links with glow */}
                                            <div style={{ display: 'flex', gap: '12px', marginTop: '12px', flexWrap: 'wrap', justifyContent: 'center' }}>
                                                {/* GitHub */}
                                                {socials.github && (
                                                    <motion.a
                                                        href={socials.github}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        whileHover={{ scale: 1.15, y: -5 }}
                                                        whileTap={{ scale: 0.95 }}
                                                        style={{
                                                            display: 'flex',
                                                            alignItems: 'center',
                                                            justifyContent: 'center',
                                                            width: '50px',
                                                            height: '50px',
                                                            borderRadius: '14px',
                                                            background: 'linear-gradient(145deg, rgba(255, 255, 255, 0.12) 0%, rgba(255, 255, 255, 0.04) 100%)',
                                                            border: '1px solid rgba(255, 255, 255, 0.2)',
                                                            color: 'rgba(255, 255, 255, 0.9)',
                                                            boxShadow: '0 8px 32px rgba(255, 255, 255, 0.05), inset 0 0 20px rgba(255, 255, 255, 0.05)',
                                                        }}
                                                    >
                                                        <FaGithub size={22} />
                                                    </motion.a>
                                                )}
                                                {/* Instagram */}
                                                {socials.instagram && (
                                                    <motion.a
                                                        href={socials.instagram}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        whileHover={{ scale: 1.15, y: -5 }}
                                                        whileTap={{ scale: 0.95 }}
                                                        style={{
                                                            display: 'flex',
                                                            alignItems: 'center',
                                                            justifyContent: 'center',
                                                            width: '50px',
                                                            height: '50px',
                                                            borderRadius: '14px',
                                                            background: 'linear-gradient(145deg, rgba(225, 48, 108, 0.25) 0%, rgba(225, 48, 108, 0.1) 100%)',
                                                            border: '1px solid rgba(225, 48, 108, 0.4)',
                                                            color: '#E1306C',
                                                            boxShadow: '0 8px 32px rgba(225, 48, 108, 0.2), inset 0 0 20px rgba(225, 48, 108, 0.1)',
                                                        }}
                                                    >
                                                        <FaInstagram size={22} />
                                                    </motion.a>
                                                )}
                                                {/* Website */}
                                                {socials.website && (
                                                    <motion.a
                                                        href={socials.website}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        whileHover={{ scale: 1.15, y: -5 }}
                                                        whileTap={{ scale: 0.95 }}
                                                        style={{
                                                            display: 'flex',
                                                            alignItems: 'center',
                                                            justifyContent: 'center',
                                                            width: '50px',
                                                            height: '50px',
                                                            borderRadius: '14px',
                                                            background: 'linear-gradient(145deg, rgba(0, 200, 150, 0.25) 0%, rgba(0, 200, 150, 0.1) 100%)',
                                                            border: '1px solid rgba(0, 200, 150, 0.4)',
                                                            color: '#00c896',
                                                            boxShadow: '0 8px 32px rgba(0, 200, 150, 0.2), inset 0 0 20px rgba(0, 200, 150, 0.1)',
                                                        }}
                                                    >
                                                        <FaGlobe size={22} />
                                                    </motion.a>
                                                )}
                                            </div>
                                        </motion.div>
                                    </div>

                                    {/* Animated border gradient */}
                                    <div
                                        style={{
                                            position: 'absolute',
                                            inset: '-3px',
                                            borderRadius: '35px',
                                            padding: '3px',
                                            background: 'linear-gradient(135deg, rgba(88, 101, 242, 0.6) 0%, rgba(138, 43, 226, 0.4) 25%, rgba(0, 150, 255, 0.4) 50%, rgba(255, 0, 150, 0.4) 75%, rgba(88, 101, 242, 0.6) 100%)',
                                            backgroundSize: '400% 400%',
                                            animation: 'borderGlow 6s linear infinite',
                                            WebkitMask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
                                            WebkitMaskComposite: 'xor',
                                            maskComposite: 'exclude',
                                            pointerEvents: 'none',
                                        }}
                                    />
                                </div>
                            </Tilt>

                            {/* CSS Animations */}
                            <style>{`
                            @keyframes pulse {
                                0%, 100% { opacity: 0.5; transform: scale(1); }
                                50% { opacity: 0.8; transform: scale(1.05); }
                            }
                            @keyframes shimmer {
                                0% { background-position: 200% 50%; }
                                100% { background-position: -200% 50%; }
                            }
                            @keyframes rotate {
                                0% { transform: rotate(0deg); }
                                100% { transform: rotate(360deg); }
                            }
                            @keyframes scanLine {
                                0% { top: 0; opacity: 0; }
                                50% { opacity: 0.6; }
                                100% { top: 100%; opacity: 0; }
                            }
                            @keyframes borderGlow {
                                0% { background-position: 0% 50%; }
                                50% { background-position: 100% 50%; }
                                100% { background-position: 0% 50%; }
                            }
                            @keyframes meshMove {
                                0% { transform: scale(1) rotate(0deg); }
                                100% { transform: scale(1.1) rotate(5deg); }
                            }
                        `}</style>
                        </motion.div>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );

    return createPortal(modalContent, document.body);
}
