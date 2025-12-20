'use client';

import { useLocale } from 'next-intl';
import { useRouter, usePathname } from 'next/navigation';
import { useState, useRef, useEffect } from 'react';
import { locales, localeNames, type Locale } from '@/i18n';

const FLAGS: Record<Locale, string> = {
    en: '🇺🇸',
    id: '🇮🇩',
    ja: '🇯🇵',
};

export default function LanguageSwitcher() {
    const locale = useLocale() as Locale;
    const router = useRouter();
    const pathname = usePathname();
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    const handleLocaleChange = (newLocale: Locale) => {
        // Get the current path without the locale prefix
        const segments = pathname.split('/');
        segments[1] = newLocale; // Replace locale segment
        const newPath = segments.join('/');

        router.push(newPath);
        setIsOpen(false);
    };

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    return (
        <>
            <style jsx>{`
                .lang-switcher {
                    position: relative;
                    z-index: 100;
                }

                .lang-trigger {
                    display: flex;
                    align-items: center;
                    gap: 6px;
                    padding: 8px 12px;
                    background: rgba(255, 255, 255, 0.05);
                    border: 1px solid rgba(255, 255, 255, 0.1);
                    border-radius: 10px;
                    color: rgba(255, 255, 255, 0.8);
                    font-size: 0.85rem;
                    cursor: pointer;
                    transition: all 0.2s ease;
                }

                .lang-trigger:hover {
                    background: rgba(255, 255, 255, 0.1);
                    border-color: rgba(255, 255, 255, 0.2);
                }

                .lang-flag {
                    font-size: 1.1rem;
                }

                .lang-code {
                    font-weight: 500;
                    text-transform: uppercase;
                    font-size: 0.75rem;
                    letter-spacing: 0.5px;
                }

                .lang-chevron {
                    width: 12px;
                    height: 12px;
                    opacity: 0.6;
                    transition: transform 0.2s ease;
                }

                .lang-chevron.open {
                    transform: rotate(180deg);
                }

                .lang-dropdown {
                    position: absolute;
                    top: calc(100% + 8px);
                    right: 0;
                    min-width: 150px;
                    background: rgba(20, 20, 30, 0.95);
                    backdrop-filter: blur(16px);
                    border: 1px solid rgba(255, 255, 255, 0.1);
                    border-radius: 12px;
                    padding: 6px;
                    box-shadow: 0 10px 40px rgba(0, 0, 0, 0.4);
                    opacity: 0;
                    visibility: hidden;
                    transform: translateY(-8px);
                    transition: all 0.2s ease;
                }

                .lang-dropdown.open {
                    opacity: 1;
                    visibility: visible;
                    transform: translateY(0);
                }

                .lang-option {
                    display: flex;
                    align-items: center;
                    gap: 10px;
                    width: 100%;
                    padding: 10px 12px;
                    background: transparent;
                    border: none;
                    border-radius: 8px;
                    color: rgba(255, 255, 255, 0.7);
                    font-size: 0.9rem;
                    cursor: pointer;
                    transition: all 0.15s ease;
                    text-align: left;
                }

                .lang-option:hover {
                    background: rgba(255, 255, 255, 0.08);
                    color: white;
                }

                .lang-option.active {
                    background: rgba(88, 101, 242, 0.2);
                    color: white;
                }

                .lang-option-flag {
                    font-size: 1.2rem;
                }

                .lang-option-name {
                    flex: 1;
                }

                .lang-check {
                    width: 14px;
                    height: 14px;
                    color: #5865f2;
                }

                @media (max-width: 768px) {
                    .lang-code {
                        display: none;
                    }
                    
                    .lang-trigger {
                        padding: 8px 10px;
                    }
                }
            `}</style>

            <div className="lang-switcher" ref={dropdownRef}>
                <button
                    className="lang-trigger"
                    onClick={() => setIsOpen(!isOpen)}
                    aria-label="Select Language"
                >
                    <span className="lang-flag">{FLAGS[locale]}</span>
                    <span className="lang-code">{locale}</span>
                    <svg
                        className={`lang-chevron ${isOpen ? 'open' : ''}`}
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                    >
                        <polyline points="6 9 12 15 18 9" />
                    </svg>
                </button>

                <div className={`lang-dropdown ${isOpen ? 'open' : ''}`}>
                    {locales.map((loc) => (
                        <button
                            key={loc}
                            className={`lang-option ${locale === loc ? 'active' : ''}`}
                            onClick={() => handleLocaleChange(loc)}
                        >
                            <span className="lang-option-flag">{FLAGS[loc]}</span>
                            <span className="lang-option-name">{localeNames[loc]}</span>
                            {locale === loc && (
                                <svg className="lang-check" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <polyline points="20 6 9 17 4 12" />
                                </svg>
                            )}
                        </button>
                    ))}
                </div>
            </div>
        </>
    );
}
