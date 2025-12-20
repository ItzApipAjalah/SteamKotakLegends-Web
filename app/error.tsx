'use client';

import { useEffect } from 'react';
import { HiRefresh, HiHome, HiExclamationCircle } from 'react-icons/hi';
import Link from 'next/link';

export default function Error({
    error,
    reset,
}: {
    error: Error & { digest?: string };
    reset: () => void;
}) {
    useEffect(() => {
        // Log the error to an error reporting service
        console.error(error);
    }, [error]);

    return (
        <div className="error-page">
            {/* Background Effects */}
            <div className="bg-effects">
                <div className="gradient-orb orb-1" />
                <div className="gradient-orb orb-2" />
                <div className="grid-pattern" />
            </div>

            <div className="content-wrapper">
                {/* Error Icon */}
                <div className="error-icon-container">
                    <div className="error-icon-ring" />
                    <HiExclamationCircle className="error-icon" />
                </div>

                {/* Error Message */}
                <h1 className="error-title">
                    Something went <span className="shimmer-text">wrong</span>
                </h1>
                <p className="error-description">
                    We encountered an unexpected error. Don&apos;t worry, these things happen.
                    Try refreshing the page or go back to the homepage.
                </p>

                {/* Error Details */}
                {error?.digest && (
                    <div className="error-digest">
                        <span>Error ID: {error.digest}</span>
                    </div>
                )}

                {/* Action Buttons */}
                <div className="button-group">
                    <button onClick={reset} className="btn btn-primary">
                        <HiRefresh size={20} />
                        <span>Try Again</span>
                    </button>
                    <Link href="/" className="btn btn-secondary">
                        <HiHome size={20} />
                        <span>Go Home</span>
                    </Link>
                </div>
            </div>

            <style jsx>{`
                .error-page {
                    min-height: 100vh;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    padding: 40px 24px;
                    position: relative;
                    overflow: hidden;
                }

                .bg-effects {
                    position: fixed;
                    inset: 0;
                    pointer-events: none;
                    z-index: -1;
                }

                .gradient-orb {
                    position: absolute;
                    border-radius: 50%;
                    filter: blur(100px);
                    opacity: 0.4;
                    animation: float 20s ease-in-out infinite;
                }

                .orb-1 {
                    width: 500px;
                    height: 500px;
                    background: linear-gradient(135deg, #dc2626, #f87171);
                    top: -150px;
                    left: -100px;
                    animation-delay: 0s;
                }

                .orb-2 {
                    width: 400px;
                    height: 400px;
                    background: linear-gradient(135deg, #8b5cf6, #c084fc);
                    bottom: -100px;
                    right: -50px;
                    animation-delay: -10s;
                }

                @keyframes float {
                    0%, 100% { transform: translate(0, 0) scale(1); }
                    25% { transform: translate(30px, -30px) scale(1.05); }
                    50% { transform: translate(-20px, 20px) scale(0.95); }
                    75% { transform: translate(-30px, -20px) scale(1.02); }
                }

                .grid-pattern {
                    position: absolute;
                    inset: 0;
                    background-image:
                        linear-gradient(rgba(139, 92, 246, 0.03) 1px, transparent 1px),
                        linear-gradient(90deg, rgba(139, 92, 246, 0.03) 1px, transparent 1px);
                    background-size: 60px 60px;
                    mask-image: radial-gradient(ellipse at center, black 20%, transparent 70%);
                    -webkit-mask-image: radial-gradient(ellipse at center, black 20%, transparent 70%);
                }

                .content-wrapper {
                    text-align: center;
                    max-width: 500px;
                    position: relative;
                    z-index: 1;
                }

                .error-icon-container {
                    position: relative;
                    width: 100px;
                    height: 100px;
                    margin: 0 auto 24px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                }

                .error-icon-ring {
                    position: absolute;
                    inset: 0;
                    border-radius: 50%;
                    border: 2px solid rgba(239, 68, 68, 0.3);
                    animation: ringPulse 2s ease-in-out infinite;
                }

                @keyframes ringPulse {
                    0%, 100% {
                        box-shadow: 0 0 0 0 rgba(239, 68, 68, 0.4);
                        transform: scale(1);
                    }
                    50% {
                        box-shadow: 0 0 0 20px rgba(239, 68, 68, 0);
                        transform: scale(1.05);
                    }
                }

                :global(.error-icon) {
                    font-size: 3rem;
                    color: #ef4444;
                    filter: drop-shadow(0 0 20px rgba(239, 68, 68, 0.5));
                    animation: iconShake 0.5s ease-in-out;
                }

                @keyframes iconShake {
                    0%, 100% { transform: translateX(0); }
                    25% { transform: translateX(-5px); }
                    75% { transform: translateX(5px); }
                }

                .error-title {
                    font-family: 'Space Grotesk', sans-serif;
                    font-size: clamp(1.8rem, 5vw, 2.5rem);
                    font-weight: 700;
                    color: white;
                    margin-bottom: 16px;
                }

                .shimmer-text {
                    background: linear-gradient(90deg, #ef4444, #f87171, #fca5a5, #fff, #fca5a5, #f87171, #ef4444);
                    background-size: 200% 100%;
                    -webkit-background-clip: text;
                    -webkit-text-fill-color: transparent;
                    background-clip: text;
                    animation: shimmer 3s linear infinite;
                }

                @keyframes shimmer {
                    0% { background-position: -200% 0; }
                    100% { background-position: 200% 0; }
                }

                .error-description {
                    font-size: 1.1rem;
                    color: rgba(255, 255, 255, 0.6);
                    line-height: 1.7;
                    margin-bottom: 24px;
                }

                .error-digest {
                    display: inline-block;
                    padding: 8px 16px;
                    background: rgba(255, 255, 255, 0.05);
                    border: 1px solid rgba(255, 255, 255, 0.1);
                    border-radius: 8px;
                    font-size: 0.8rem;
                    color: rgba(255, 255, 255, 0.4);
                    font-family: monospace;
                    margin-bottom: 32px;
                }

                .button-group {
                    display: flex;
                    gap: 16px;
                    justify-content: center;
                    flex-wrap: wrap;
                }

                .btn {
                    display: inline-flex;
                    align-items: center;
                    gap: 10px;
                    padding: 16px 28px;
                    font-size: 1rem;
                    font-weight: 600;
                    border-radius: 14px;
                    border: none;
                    cursor: none;
                    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
                    text-decoration: none;
                }

                .btn-primary {
                    background: linear-gradient(135deg, #ef4444, #f87171);
                    color: white;
                    box-shadow: 0 4px 25px rgba(239, 68, 68, 0.4);
                }

                .btn-primary:hover {
                    transform: translateY(-3px);
                    box-shadow: 0 8px 40px rgba(239, 68, 68, 0.6);
                }

                .btn-secondary {
                    background: rgba(255, 255, 255, 0.05);
                    color: white;
                    border: 1px solid rgba(255, 255, 255, 0.1);
                    backdrop-filter: blur(10px);
                    -webkit-backdrop-filter: blur(10px);
                }

                .btn-secondary:hover {
                    background: rgba(255, 255, 255, 0.1);
                    border-color: rgba(139, 92, 246, 0.4);
                    transform: translateY(-3px);
                }

                @media (max-width: 500px) {
                    .button-group {
                        flex-direction: column;
                        align-items: stretch;
                    }

                    .btn {
                        justify-content: center;
                    }
                }
            `}</style>
        </div>
    );
}
