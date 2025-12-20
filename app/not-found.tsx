'use client';

import Link from 'next/link';
import { HiHome, HiArrowLeft, HiExclamation } from 'react-icons/hi';
import { FaGamepad, FaGhost } from 'react-icons/fa';

export default function NotFound() {
    return (
        <div className="not-found-page">
            {/* Background Effects */}
            <div className="bg-effects">
                <div className="gradient-orb orb-1" />
                <div className="gradient-orb orb-2" />
                <div className="gradient-orb orb-3" />
                <div className="grid-pattern" />
            </div>

            <div className="content-wrapper">
                {/* Floating Ghost Icon */}
                <div className="ghost-container">
                    <FaGhost className="ghost-icon" />
                    <div className="ghost-shadow" />
                </div>

                {/* 404 Text */}
                <div className="error-code">
                    <span className="digit">4</span>
                    <span className="digit zero">
                        <FaGamepad className="gamepad-icon" />
                    </span>
                    <span className="digit">4</span>
                </div>

                {/* Message */}
                <h1 className="title">
                    Page <span className="shimmer-text">Not Found</span>
                </h1>
                <p className="description">
                    Oops! The page you&apos;re looking for seems to have wandered off into the void.
                    Don&apos;t worry, even the best gamers get lost sometimes.
                </p>

                {/* Action Buttons */}
                <div className="button-group">
                    <Link href="/" className="btn btn-primary">
                        <HiHome size={20} />
                        <span>Back to Home</span>
                    </Link>
                    <button
                        onClick={() => window.history.back()}
                        className="btn btn-secondary"
                    >
                        <HiArrowLeft size={20} />
                        <span>Go Back</span>
                    </button>
                </div>

                {/* Fun Stats */}
                <div className="fun-stats">
                    <div className="stat-item">
                        <HiExclamation size={18} />
                        <span>Error 404</span>
                    </div>
                    <div className="stat-divider" />
                    <div className="stat-item">
                        <FaGamepad size={16} />
                        <span>Keep Gaming</span>
                    </div>
                </div>
            </div>

            <style jsx>{`
                .not-found-page {
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
                    background: linear-gradient(135deg, #6d28d9, #8b5cf6);
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
                    animation-delay: -7s;
                }

                .orb-3 {
                    width: 300px;
                    height: 300px;
                    background: linear-gradient(135deg, #f472b6, #c084fc);
                    top: 50%;
                    left: 50%;
                    transform: translate(-50%, -50%);
                    animation-delay: -14s;
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
                    max-width: 600px;
                    position: relative;
                    z-index: 1;
                }

                .ghost-container {
                    position: relative;
                    display: inline-block;
                    margin-bottom: 20px;
                }

                :global(.ghost-icon) {
                    font-size: 4rem;
                    color: rgba(255, 255, 255, 0.9);
                    filter: drop-shadow(0 0 30px rgba(139, 92, 246, 0.5));
                    animation: ghostFloat 3s ease-in-out infinite;
                }

                @keyframes ghostFloat {
                    0%, 100% { transform: translateY(0) rotate(-5deg); }
                    50% { transform: translateY(-15px) rotate(5deg); }
                }

                .ghost-shadow {
                    width: 60px;
                    height: 20px;
                    background: radial-gradient(ellipse, rgba(0,0,0,0.3), transparent);
                    border-radius: 50%;
                    margin: 10px auto 0;
                    animation: shadowPulse 3s ease-in-out infinite;
                }

                @keyframes shadowPulse {
                    0%, 100% { transform: scale(1); opacity: 0.3; }
                    50% { transform: scale(0.8); opacity: 0.15; }
                }

                .error-code {
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    gap: 8px;
                    margin-bottom: 24px;
                }

                .digit {
                    font-family: 'Space Grotesk', sans-serif;
                    font-size: clamp(5rem, 15vw, 10rem);
                    font-weight: 700;
                    background: linear-gradient(135deg, #8b5cf6, #c084fc, #f472b6);
                    -webkit-background-clip: text;
                    -webkit-text-fill-color: transparent;
                    background-clip: text;
                    line-height: 1;
                    text-shadow: 0 0 60px rgba(139, 92, 246, 0.3);
                }

                .digit.zero {
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    width: clamp(80px, 12vw, 140px);
                    height: clamp(80px, 12vw, 140px);
                    background: rgba(255, 255, 255, 0.03);
                    border: 2px solid rgba(139, 92, 246, 0.3);
                    border-radius: 50%;
                    backdrop-filter: blur(10px);
                    -webkit-backdrop-filter: blur(10px);
                    animation: pulse 2s ease-in-out infinite;
                }

                @keyframes pulse {
                    0%, 100% { 
                        box-shadow: 0 0 0 0 rgba(139, 92, 246, 0.4);
                        border-color: rgba(139, 92, 246, 0.3);
                    }
                    50% { 
                        box-shadow: 0 0 0 15px rgba(139, 92, 246, 0);
                        border-color: rgba(139, 92, 246, 0.6);
                    }
                }

                :global(.gamepad-icon) {
                    font-size: clamp(2.5rem, 6vw, 4rem);
                    color: #c084fc;
                    animation: rotate 8s linear infinite;
                }

                @keyframes rotate {
                    0% { transform: rotate(0deg); }
                    100% { transform: rotate(360deg); }
                }

                .title {
                    font-family: 'Space Grotesk', sans-serif;
                    font-size: clamp(1.8rem, 5vw, 2.5rem);
                    font-weight: 700;
                    color: white;
                    margin-bottom: 16px;
                }

                .shimmer-text {
                    background: linear-gradient(90deg, #8b5cf6, #c084fc, #f472b6, #fff, #f472b6, #c084fc, #8b5cf6);
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

                .description {
                    font-size: 1.1rem;
                    color: rgba(255, 255, 255, 0.6);
                    line-height: 1.7;
                    margin-bottom: 36px;
                    max-width: 480px;
                    margin-left: auto;
                    margin-right: auto;
                }

                .button-group {
                    display: flex;
                    gap: 16px;
                    justify-content: center;
                    flex-wrap: wrap;
                    margin-bottom: 40px;
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
                    background: linear-gradient(135deg, #6d28d9, #8b5cf6, #c084fc);
                    color: white;
                    box-shadow: 0 4px 25px rgba(139, 92, 246, 0.4);
                }

                .btn-primary:hover {
                    transform: translateY(-3px);
                    box-shadow: 0 8px 40px rgba(139, 92, 246, 0.6);
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

                .fun-stats {
                    display: inline-flex;
                    align-items: center;
                    gap: 16px;
                    padding: 12px 24px;
                    background: rgba(255, 255, 255, 0.03);
                    border: 1px solid rgba(255, 255, 255, 0.06);
                    border-radius: 50px;
                    backdrop-filter: blur(10px);
                    -webkit-backdrop-filter: blur(10px);
                }

                .stat-item {
                    display: flex;
                    align-items: center;
                    gap: 8px;
                    font-size: 0.85rem;
                    color: rgba(255, 255, 255, 0.6);
                }

                .stat-divider {
                    width: 1px;
                    height: 20px;
                    background: rgba(255, 255, 255, 0.15);
                }

                @media (max-width: 600px) {
                    .button-group {
                        flex-direction: column;
                        align-items: stretch;
                    }

                    .btn {
                        justify-content: center;
                    }

                    .fun-stats {
                        flex-direction: column;
                        gap: 8px;
                        border-radius: 16px;
                    }

                    .stat-divider {
                        width: 40px;
                        height: 1px;
                    }
                }
            `}</style>
        </div>
    );
}
