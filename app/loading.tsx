'use client';

export default function Loading() {
    return (
        <div className="loading-page">
            {/* Background Effects */}
            <div className="bg-effects">
                <div className="gradient-orb orb-1" />
                <div className="gradient-orb orb-2" />
                <div className="grid-pattern" />
            </div>

            <div className="content-wrapper">
                {/* Animated Logo/Spinner */}
                <div className="loader-container">
                    <div className="loader-ring">
                        <div className="loader-ring-inner" />
                    </div>
                    <div className="loader-icon">
                        <svg
                            width="32"
                            height="32"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        >
                            <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
                        </svg>
                    </div>
                </div>

                {/* Loading Text */}
                <h2 className="loading-title">
                    <span className="shimmer-text">Loading</span>
                </h2>
                <div className="loading-dots">
                    <span className="dot" />
                    <span className="dot" />
                    <span className="dot" />
                </div>
            </div>

            <style jsx>{`
                .loading-page {
                    min-height: 100vh;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    padding: 40px 24px;
                    position: relative;
                    overflow: hidden;
                    background: #050208;
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
                    opacity: 0.3;
                    animation: float 15s ease-in-out infinite;
                }

                .orb-1 {
                    width: 400px;
                    height: 400px;
                    background: linear-gradient(135deg, #6d28d9, #8b5cf6);
                    top: 30%;
                    left: 20%;
                    animation-delay: 0s;
                }

                .orb-2 {
                    width: 300px;
                    height: 300px;
                    background: linear-gradient(135deg, #8b5cf6, #c084fc);
                    bottom: 30%;
                    right: 20%;
                    animation-delay: -7s;
                }

                @keyframes float {
                    0%, 100% { transform: translate(0, 0) scale(1); }
                    50% { transform: translate(20px, -20px) scale(1.05); }
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
                    position: relative;
                    z-index: 1;
                }

                .loader-container {
                    position: relative;
                    width: 100px;
                    height: 100px;
                    margin: 0 auto 24px;
                }

                .loader-ring {
                    position: absolute;
                    inset: 0;
                    border-radius: 50%;
                    border: 3px solid rgba(139, 92, 246, 0.2);
                    animation: ringPulse 2s ease-in-out infinite;
                }

                .loader-ring-inner {
                    position: absolute;
                    inset: -3px;
                    border-radius: 50%;
                    border: 3px solid transparent;
                    border-top-color: #8b5cf6;
                    border-right-color: #c084fc;
                    animation: spin 1s linear infinite;
                }

                @keyframes spin {
                    to { transform: rotate(360deg); }
                }

                @keyframes ringPulse {
                    0%, 100% {
                        box-shadow: 0 0 0 0 rgba(139, 92, 246, 0.4);
                    }
                    50% {
                        box-shadow: 0 0 0 15px rgba(139, 92, 246, 0);
                    }
                }

                .loader-icon {
                    position: absolute;
                    top: 50%;
                    left: 50%;
                    transform: translate(-50%, -50%);
                    color: #c084fc;
                    animation: iconFloat 2s ease-in-out infinite;
                }

                @keyframes iconFloat {
                    0%, 100% { transform: translate(-50%, -50%) scale(1); }
                    50% { transform: translate(-50%, -50%) scale(1.1); }
                }

                .loading-title {
                    font-family: 'Space Grotesk', sans-serif;
                    font-size: 1.5rem;
                    font-weight: 600;
                    color: white;
                    margin: 0;
                }

                .shimmer-text {
                    background: linear-gradient(90deg, #8b5cf6, #c084fc, #f472b6, #fff, #f472b6, #c084fc, #8b5cf6);
                    background-size: 200% 100%;
                    -webkit-background-clip: text;
                    -webkit-text-fill-color: transparent;
                    background-clip: text;
                    animation: shimmer 2s linear infinite;
                }

                @keyframes shimmer {
                    0% { background-position: -200% 0; }
                    100% { background-position: 200% 0; }
                }

                .loading-dots {
                    display: flex;
                    gap: 8px;
                    justify-content: center;
                    margin-top: 16px;
                }

                .dot {
                    width: 8px;
                    height: 8px;
                    background: #8b5cf6;
                    border-radius: 50%;
                    animation: dotBounce 1.4s ease-in-out infinite;
                }

                .dot:nth-child(2) {
                    animation-delay: 0.2s;
                }

                .dot:nth-child(3) {
                    animation-delay: 0.4s;
                }

                @keyframes dotBounce {
                    0%, 80%, 100% {
                        transform: translateY(0);
                        opacity: 0.5;
                    }
                    40% {
                        transform: translateY(-10px);
                        opacity: 1;
                    }
                }
            `}</style>
        </div>
    );
}
