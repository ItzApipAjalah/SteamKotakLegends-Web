'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
    FaHome,
    FaDownload,
    FaDiscord,
    FaGithub,
    FaArrowUp,
    FaCopy,
    FaShare,
    FaInfoCircle,
} from 'react-icons/fa';
import { HiRefresh, HiExternalLink } from 'react-icons/hi';

interface MenuItem {
    label: string;
    icon: React.ReactNode;
    action?: () => void;
    href?: string;
    divider?: boolean;
    disabled?: boolean;
    shortcut?: string;
}

interface ContextMenuProps {
    children: React.ReactNode;
}

export default function ContextMenu({ children }: ContextMenuProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [position, setPosition] = useState({ x: 0, y: 0 });
    const [mounted, setMounted] = useState(false);
    const [isSharing, setIsSharing] = useState(false);
    const menuRef = useRef<HTMLDivElement>(null);

    // Set mounted immediately on client
    useEffect(() => {
        setMounted(true);
    }, []);

    // Handle context menu - must be attached ASAP
    useEffect(() => {
        if (!mounted) return;

        const handleContextMenu = (e: MouseEvent) => {
            e.preventDefault();
            e.stopPropagation();

            const menuWidth = 220;
            const menuHeight = 380;

            let x = e.clientX;
            let y = e.clientY;

            // Adjust position if menu would go off screen
            if (x + menuWidth > window.innerWidth) {
                x = window.innerWidth - menuWidth - 10;
            }
            if (y + menuHeight > window.innerHeight) {
                y = window.innerHeight - menuHeight - 10;
            }

            setPosition({ x, y });
            setIsOpen(true);

            return false;
        };

        const handleClick = (e: MouseEvent) => {
            // Only close if clicking outside menu
            if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
                setIsOpen(false);
            }
        };

        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Escape') {
                setIsOpen(false);
            }
        };

        // Use capture phase to ensure our handler runs first
        document.addEventListener('contextmenu', handleContextMenu, { capture: true });
        document.addEventListener('click', handleClick);
        document.addEventListener('keydown', handleKeyDown);

        return () => {
            document.removeEventListener('contextmenu', handleContextMenu, { capture: true });
            document.removeEventListener('click', handleClick);
            document.removeEventListener('keydown', handleKeyDown);
        };
    }, [mounted]);

    const closeMenu = useCallback(() => {
        setIsOpen(false);
    }, []);

    const scrollToTop = useCallback(() => {
        closeMenu();
        setTimeout(() => {
            // Use Lenis if available, fallback to native
            const lenis = (window as unknown as { lenis?: { scrollTo: (target: number | string | HTMLElement, options?: object) => void } }).lenis;
            if (lenis) {
                lenis.scrollTo(0, { duration: 1.2 });
            } else {
                window.scrollTo({ top: 0, behavior: 'smooth' });
            }
        }, 100);
    }, [closeMenu]);

    const scrollToBottom = useCallback(() => {
        closeMenu();
        setTimeout(() => {
            const lenis = (window as unknown as { lenis?: { scrollTo: (target: number | string | HTMLElement, options?: object) => void } }).lenis;
            if (lenis) {
                lenis.scrollTo(document.body.scrollHeight, { duration: 1.5 });
            } else {
                window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
            }
        }, 100);
    }, [closeMenu]);

    const scrollToSection = useCallback((id: string) => {
        closeMenu();
        setTimeout(() => {
            const element = document.getElementById(id);
            if (element) {
                const lenis = (window as unknown as { lenis?: { scrollTo: (target: number | string | HTMLElement, options?: object) => void } }).lenis;
                if (lenis) {
                    lenis.scrollTo(element, { duration: 1.2, offset: -80 });
                } else {
                    element.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }
            }
        }, 100);
    }, [closeMenu]);

    const copyLink = useCallback(async () => {
        try {
            await navigator.clipboard.writeText(window.location.href);
        } catch (err) {
            console.error('Failed to copy:', err);
        }
        closeMenu();
    }, [closeMenu]);

    const shareLink = useCallback(async () => {
        // Prevent multiple share calls
        if (isSharing) return;

        closeMenu();

        if (navigator.share) {
            setIsSharing(true);
            try {
                await navigator.share({
                    title: 'SteamKotakLegends',
                    text: 'Inject All Game to Steam!',
                    url: window.location.href,
                });
            } catch (err: unknown) {
                // Only log if not AbortError (user cancelled)
                if (err instanceof Error && err.name !== 'AbortError') {
                    console.error('Failed to share:', err);
                }
            } finally {
                setIsSharing(false);
            }
        } else {
            // Fallback to copy
            try {
                await navigator.clipboard.writeText(window.location.href);
            } catch (err) {
                console.error('Failed to copy:', err);
            }
        }
    }, [isSharing, closeMenu]);

    const refreshPage = useCallback(() => {
        window.location.reload();
    }, []);

    const menuItems: MenuItem[] = [
        { label: 'Home', icon: <FaHome size={14} />, action: () => scrollToSection('home'), shortcut: 'H' },
        { label: 'Download', icon: <FaDownload size={14} />, action: () => scrollToSection('download'), shortcut: 'D' },
        { label: 'Scroll to Top', icon: <FaArrowUp size={14} />, action: scrollToTop, shortcut: '↑' },
        { label: '', icon: null, divider: true },
        { label: 'Refresh', icon: <HiRefresh size={15} />, action: refreshPage, shortcut: 'F5' },
        { label: 'Copy Link', icon: <FaCopy size={14} />, action: copyLink, shortcut: 'Ctrl+C' },
        { label: 'Share', icon: <FaShare size={14} />, action: shareLink, disabled: isSharing },
        { label: '', icon: null, divider: true },
        { label: 'Discord', icon: <FaDiscord size={15} />, href: 'https://discord.gg/7M3SRrWYFM' },
        { label: 'GitHub', icon: <FaGithub size={14} />, href: 'https://github.com/ItzApipAjalah/SteamKotakLegends' },
        { label: '', icon: null, divider: true },
        { label: 'About', icon: <FaInfoCircle size={14} />, action: scrollToBottom },
    ];

    if (!mounted) {
        return <>{children}</>;
    }

    const menuContent = (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    ref={menuRef}
                    initial={{ opacity: 0, scale: 0.9, y: -10 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.9, y: -10 }}
                    transition={{ duration: 0.15, ease: 'easeOut' }}
                    style={{
                        position: 'fixed',
                        top: position.y,
                        left: position.x,
                        zIndex: 100000,
                        minWidth: '200px',
                        padding: '6px',
                        background: 'rgba(20, 20, 30, 0.95)',
                        backdropFilter: 'blur(20px)',
                        border: '1px solid rgba(255, 255, 255, 0.1)',
                        borderRadius: '12px',
                        boxShadow: '0 20px 50px rgba(0, 0, 0, 0.5), 0 0 0 1px rgba(255, 255, 255, 0.05)',
                        overflow: 'hidden',
                    }}
                    onContextMenu={(e) => e.preventDefault()}
                >
                    {/* Header */}
                    <div
                        style={{
                            padding: '10px 12px',
                            marginBottom: '4px',
                            borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '8px',
                        }}
                    >
                        <div
                            style={{
                                width: '24px',
                                height: '24px',
                                borderRadius: '6px',
                                background: 'linear-gradient(135deg, #5865f2, #7c3aed)',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                fontSize: '12px',
                                fontWeight: 700,
                                color: 'white',
                            }}
                        >
                            S
                        </div>
                        <span style={{ fontSize: '0.85rem', fontWeight: 600, color: 'white' }}>
                            SteamKotakLegends
                        </span>
                    </div>

                    {/* Menu Items */}
                    {menuItems.map((item, index) => {
                        if (item.divider) {
                            return (
                                <div
                                    key={`divider-${index}`}
                                    style={{
                                        height: '1px',
                                        background: 'rgba(255, 255, 255, 0.08)',
                                        margin: '4px 8px',
                                    }}
                                />
                            );
                        }

                        const isLink = !!item.href;

                        const handleItemClick = () => {
                            if (item.disabled) return;
                            if (item.action) {
                                item.action();
                            }
                            if (isLink) {
                                closeMenu();
                            }
                        };

                        const commonProps = {
                            style: {
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'space-between',
                                width: '100%',
                                padding: '9px 12px',
                                background: 'transparent',
                                border: 'none',
                                borderRadius: '8px',
                                color: item.disabled ? 'rgba(255, 255, 255, 0.3)' : 'rgba(255, 255, 255, 0.85)',
                                fontSize: '0.85rem',
                                cursor: item.disabled ? 'not-allowed' : 'pointer',
                                textDecoration: 'none',
                                transition: 'background 0.15s, color 0.15s',
                            } as React.CSSProperties,
                            onMouseEnter: (e: React.MouseEvent) => {
                                if (!item.disabled) {
                                    (e.currentTarget as HTMLElement).style.background = 'rgba(88, 101, 242, 0.2)';
                                    (e.currentTarget as HTMLElement).style.color = 'white';
                                }
                            },
                            onMouseLeave: (e: React.MouseEvent) => {
                                (e.currentTarget as HTMLElement).style.background = 'transparent';
                                (e.currentTarget as HTMLElement).style.color = item.disabled ? 'rgba(255, 255, 255, 0.3)' : 'rgba(255, 255, 255, 0.85)';
                            },
                        };

                        const content = (
                            <>
                                <span style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                    <span style={{ opacity: 0.8, display: 'flex' }}>{item.icon}</span>
                                    {item.label}
                                </span>
                                <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                                    {item.shortcut && (
                                        <span style={{
                                            fontSize: '0.7rem',
                                            color: 'rgba(255, 255, 255, 0.4)',
                                            background: 'rgba(255, 255, 255, 0.05)',
                                            padding: '2px 6px',
                                            borderRadius: '4px',
                                        }}>
                                            {item.shortcut}
                                        </span>
                                    )}
                                    {isLink && <HiExternalLink size={12} style={{ opacity: 0.5 }} />}
                                </span>
                            </>
                        );

                        if (isLink) {
                            return (
                                <a
                                    key={item.label}
                                    href={item.href}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    onClick={handleItemClick}
                                    {...commonProps}
                                >
                                    {content}
                                </a>
                            );
                        }

                        return (
                            <button
                                key={item.label}
                                onClick={handleItemClick}
                                disabled={item.disabled}
                                {...commonProps}
                            >
                                {content}
                            </button>
                        );
                    })}

                    {/* Footer */}
                    <div
                        style={{
                            padding: '8px 12px',
                            marginTop: '4px',
                            borderTop: '1px solid rgba(255, 255, 255, 0.08)',
                            fontSize: '0.7rem',
                            color: 'rgba(255, 255, 255, 0.3)',
                            textAlign: 'center',
                        }}
                    >
                        Jawa
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );

    return (
        <>
            {children}
            {createPortal(menuContent, document.body)}
        </>
    );
}
