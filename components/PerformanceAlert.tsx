'use client';

import { useState, useEffect } from 'react';
import { HiX, HiExclamation, HiDeviceMobile, HiDesktopComputer } from 'react-icons/hi';

interface Alert {
    id: string;
    type: 'mobile' | 'gpu';
    title: string;
    message: string;
    icon: 'mobile' | 'gpu';
}

// Simple GPU acceleration check using WebGL
function checkGPUAcceleration(): { supported: boolean; renderer: string | null } {
    try {
        const canvas = document.createElement('canvas');
        const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');

        if (!gl) {
            return { supported: false, renderer: null };
        }

        const debugInfo = (gl as WebGLRenderingContext).getExtension('WEBGL_debug_renderer_info');
        if (debugInfo) {
            const renderer = (gl as WebGLRenderingContext).getParameter(debugInfo.UNMASKED_RENDERER_WEBGL);
            // Check if it's software rendering
            const isSoftware = /SwiftShader|llvmpipe|Software|Microsoft Basic/i.test(renderer);
            return { supported: !isSoftware, renderer };
        }

        return { supported: true, renderer: null };
    } catch {
        return { supported: false, renderer: null };
    }
}

export default function PerformanceAlert() {
    const [alerts, setAlerts] = useState<Alert[]>([]);
    const [dismissed, setDismissed] = useState<Set<string>>(new Set());

    useEffect(() => {
        const checkPerformance = () => {
            const newAlerts: Alert[] = [];

            // Check if mobile device
            const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
                navigator.userAgent
            ) || window.innerWidth < 768;

            if (isMobile) {
                newAlerts.push({
                    id: 'mobile-warning',
                    type: 'mobile',
                    title: 'Mobile Device Detected',
                    message: 'Website ini tidak dirancang untuk mobile, mungkin ada performance issue.',
                    icon: 'mobile',
                });
            }

            // Check GPU acceleration (only on desktop)
            if (!isMobile) {
                const gpuCheck = checkGPUAcceleration();
                if (!gpuCheck.supported) {
                    newAlerts.push({
                        id: 'gpu-warning',
                        type: 'gpu',
                        title: 'GPU Acceleration Off',
                        message: 'Nyalakan GPU acceleration untuk performance yang lebih baik.',
                        icon: 'gpu',
                    });
                }
            }

            // Filter out already dismissed alerts from localStorage
            const dismissedFromStorage = localStorage.getItem('performance-alerts-dismissed');
            if (dismissedFromStorage) {
                const dismissedSet = new Set<string>(JSON.parse(dismissedFromStorage) as string[]);
                setDismissed(dismissedSet);
                const filteredAlerts = newAlerts.filter(alert => !dismissedSet.has(alert.id));
                setAlerts(filteredAlerts);
            } else {
                setAlerts(newAlerts);
            }
        };

        checkPerformance();
    }, []);

    const dismissAlert = (id: string, permanent: boolean = false) => {
        if (permanent) {
            const newDismissed = new Set(dismissed);
            newDismissed.add(id);
            setDismissed(newDismissed);
            localStorage.setItem('performance-alerts-dismissed', JSON.stringify([...newDismissed]));
        }
        setAlerts(prev => prev.filter(alert => alert.id !== id));
    };

    if (alerts.length === 0) return null;

    return (
        <>
            <div className="performance-alerts">
                {alerts.map((alert) => (
                    <div key={alert.id} className={`alert-card ${alert.type}`}>
                        <div className="alert-icon">
                            {alert.icon === 'mobile' ? (
                                <HiDeviceMobile size={24} />
                            ) : (
                                <HiDesktopComputer size={24} />
                            )}
                        </div>
                        <div className="alert-content">
                            <div className="alert-header">
                                <HiExclamation className="warning-icon" />
                                <h4>{alert.title}</h4>
                            </div>
                            <p>{alert.message}</p>
                        </div>
                        <div className="alert-actions">
                            <button
                                className="dismiss-btn"
                                onClick={() => dismissAlert(alert.id, false)}
                                title="Dismiss"
                            >
                                <HiX size={18} />
                            </button>
                            <button
                                className="dismiss-permanent-btn"
                                onClick={() => dismissAlert(alert.id, true)}
                                title="Don't show again"
                            >
                                Don&apos;t show again
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            <style jsx>{`
                .performance-alerts {
                    position: fixed;
                    bottom: 24px;
                    right: 24px;
                    z-index: 9999;
                    display: flex;
                    flex-direction: column;
                    gap: 12px;
                    max-width: 400px;
                }

                .alert-card {
                    display: flex;
                    align-items: flex-start;
                    gap: 12px;
                    padding: 16px;
                    background: rgba(10, 6, 18, 0.95);
                    backdrop-filter: blur(20px);
                    -webkit-backdrop-filter: blur(20px);
                    border-radius: 16px;
                    border: 1px solid rgba(255, 255, 255, 0.1);
                    box-shadow: 0 8px 32px rgba(0, 0, 0, 0.4);
                    animation: slideIn 0.3s ease-out;
                }

                @keyframes slideIn {
                    from {
                        opacity: 0;
                        transform: translateX(100px);
                    }
                    to {
                        opacity: 1;
                        transform: translateX(0);
                    }
                }

                .alert-card.mobile {
                    border-color: rgba(251, 191, 36, 0.3);
                }

                .alert-card.gpu {
                    border-color: rgba(239, 68, 68, 0.3);
                }

                .alert-icon {
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    width: 48px;
                    height: 48px;
                    border-radius: 12px;
                    flex-shrink: 0;
                }

                .alert-card.mobile .alert-icon {
                    background: linear-gradient(135deg, rgba(251, 191, 36, 0.2), rgba(245, 158, 11, 0.1));
                    color: #fbbf24;
                }

                .alert-card.gpu .alert-icon {
                    background: linear-gradient(135deg, rgba(239, 68, 68, 0.2), rgba(220, 38, 38, 0.1));
                    color: #ef4444;
                }

                .alert-content {
                    flex: 1;
                    min-width: 0;
                }

                .alert-header {
                    display: flex;
                    align-items: center;
                    gap: 6px;
                    margin-bottom: 4px;
                }

                .alert-header h4 {
                    margin: 0;
                    font-size: 0.95rem;
                    font-weight: 600;
                    color: white;
                }

                :global(.warning-icon) {
                    color: #fbbf24;
                    flex-shrink: 0;
                }

                .alert-content p {
                    margin: 0;
                    font-size: 0.85rem;
                    color: rgba(255, 255, 255, 0.6);
                    line-height: 1.5;
                }

                .alert-actions {
                    display: flex;
                    flex-direction: column;
                    gap: 8px;
                    align-items: flex-end;
                }

                .dismiss-btn {
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    width: 28px;
                    height: 28px;
                    padding: 0;
                    background: rgba(255, 255, 255, 0.05);
                    border: 1px solid rgba(255, 255, 255, 0.1);
                    border-radius: 8px;
                    color: rgba(255, 255, 255, 0.5);
                    cursor: pointer;
                    transition: all 0.2s ease;
                }

                .dismiss-btn:hover {
                    background: rgba(255, 255, 255, 0.1);
                    color: white;
                }

                .dismiss-permanent-btn {
                    padding: 4px 8px;
                    background: transparent;
                    border: none;
                    color: rgba(255, 255, 255, 0.4);
                    font-size: 0.7rem;
                    cursor: pointer;
                    transition: color 0.2s ease;
                }

                .dismiss-permanent-btn:hover {
                    color: rgba(255, 255, 255, 0.7);
                }

                @media (max-width: 480px) {
                    .performance-alerts {
                        left: 16px;
                        right: 16px;
                        bottom: 16px;
                        max-width: none;
                    }

                    .alert-card {
                        flex-wrap: wrap;
                    }

                    .alert-actions {
                        flex-direction: row;
                        width: 100%;
                        justify-content: flex-end;
                        margin-top: 8px;
                    }
                }
            `}</style>
        </>
    );
}
