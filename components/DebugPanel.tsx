'use client';

import { useState, useEffect, useRef } from 'react';

// ============================================
// CONFIGURATION - Set to true to enable debug panel
// ============================================
const DEBUG_ENABLED = false;
// ============================================

interface PerformanceData {
    fps: number;
    frameTime: number;
    memory: {
        usedJSHeapSize: number;
        totalJSHeapSize: number;
        jsHeapSizeLimit: number;
    } | null;
    domNodes: number;
    loadTime: number;
    connectionType: string;
    devicePixelRatio: number;
    screenSize: string;
    renderTime: number;
}

export default function DebugPanel() {
    const [isOpen, setIsOpen] = useState(true);
    const [data, setData] = useState<PerformanceData>({
        fps: 0,
        frameTime: 0,
        memory: null,
        domNodes: 0,
        loadTime: 0,
        connectionType: 'unknown',
        devicePixelRatio: 1,
        screenSize: '',
        renderTime: 0,
    });

    const frameCountRef = useRef(0);
    const lastTimeRef = useRef(performance.now());
    const framesRef = useRef<number[]>([]);

    useEffect(() => {
        if (!DEBUG_ENABLED) return;

        let animationId: number;

        const updatePerformance = () => {
            const now = performance.now();
            frameCountRef.current++;

            // Calculate FPS every frame for smoother updates
            const delta = now - lastTimeRef.current;
            framesRef.current.push(delta);

            // Keep last 60 frames for average
            if (framesRef.current.length > 60) {
                framesRef.current.shift();
            }

            // Update every 500ms instead of 100ms for performance
            if (delta >= 500) {
                const avgFrameTime = framesRef.current.reduce((a, b) => a + b, 0) / framesRef.current.length;
                const fps = Math.round(1000 / avgFrameTime);

                // Memory info (Chrome only)
                const memory = (performance as unknown as { memory?: PerformanceData['memory'] }).memory || null;

                // DOM nodes count
                const domNodes = document.getElementsByTagName('*').length;

                // Page load time
                const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
                const loadTime = navigation ? Math.round(navigation.loadEventEnd - navigation.startTime) : 0;

                // Connection info
                const connection = (navigator as unknown as { connection?: { effectiveType?: string } }).connection;
                const connectionType = connection?.effectiveType || 'unknown';

                // Screen info
                const screenSize = `${window.innerWidth}x${window.innerHeight}`;
                const devicePixelRatio = window.devicePixelRatio;

                // Render time (last paint)
                const paintEntries = performance.getEntriesByType('paint');
                const lastPaint = paintEntries[paintEntries.length - 1];
                const renderTime = lastPaint ? Math.round(lastPaint.startTime) : 0;

                setData({
                    fps,
                    frameTime: Math.round(avgFrameTime * 100) / 100,
                    memory,
                    domNodes,
                    loadTime,
                    connectionType,
                    devicePixelRatio,
                    screenSize,
                    renderTime,
                });

                frameCountRef.current = 0;
                lastTimeRef.current = now;
            }

            animationId = requestAnimationFrame(updatePerformance);
        };

        animationId = requestAnimationFrame(updatePerformance);

        return () => {
            cancelAnimationFrame(animationId);
        };
    }, []);

    if (!DEBUG_ENABLED) return null;

    const formatBytes = (bytes: number) => {
        if (bytes === 0) return '0 B';
        const k = 1024;
        const sizes = ['B', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    };

    const getFpsColor = (fps: number) => {
        if (fps >= 55) return '#22c55e'; // Green
        if (fps >= 30) return '#eab308'; // Yellow
        return '#ef4444'; // Red
    };

    const getMemoryPercent = () => {
        if (!data.memory) return 0;
        return Math.round((data.memory.usedJSHeapSize / data.memory.jsHeapSizeLimit) * 100);
    };

    return (
        <div
            style={{
                position: 'fixed',
                bottom: '20px',
                left: '20px',
                zIndex: 99999,
                fontFamily: 'monospace',
                fontSize: '12px',
                color: 'white',
                userSelect: 'none',
            }}
        >
            {/* Toggle Button */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                style={{
                    position: 'absolute',
                    top: isOpen ? '-30px' : '0',
                    left: '0',
                    padding: '6px 12px',
                    background: 'rgba(0, 0, 0, 0.8)',
                    border: '1px solid rgba(139, 92, 246, 0.5)',
                    borderRadius: '6px',
                    color: '#a855f7',
                    cursor: 'pointer',
                    fontSize: '11px',
                    fontWeight: 'bold',
                    transition: 'all 0.2s ease',
                }}
            >
                {isOpen ? '▼ DEBUG' : '▶ DEBUG'}
            </button>

            {/* Debug Panel */}
            {isOpen && (
                <div
                    style={{
                        background: 'rgba(0, 0, 0, 0.9)',
                        border: '1px solid rgba(139, 92, 246, 0.4)',
                        borderRadius: '12px',
                        padding: '16px',
                        minWidth: '280px',
                        backdropFilter: 'blur(10px)',
                        boxShadow: '0 8px 32px rgba(0, 0, 0, 0.5)',
                    }}
                >
                    {/* Header */}
                    <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        marginBottom: '12px',
                        paddingBottom: '8px',
                        borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
                    }}>
                        <div style={{
                            width: '8px',
                            height: '8px',
                            borderRadius: '50%',
                            background: getFpsColor(data.fps),
                            animation: 'pulse 1s infinite',
                        }} />
                        <span style={{ color: '#a855f7', fontWeight: 'bold' }}>PERFORMANCE MONITOR</span>
                    </div>

                    {/* FPS Section */}
                    <div style={{ marginBottom: '12px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                            <span style={{ color: '#888' }}>FPS</span>
                            <span style={{ color: getFpsColor(data.fps), fontWeight: 'bold', fontSize: '14px' }}>
                                {data.fps}
                            </span>
                        </div>
                        <div style={{
                            height: '4px',
                            background: 'rgba(255, 255, 255, 0.1)',
                            borderRadius: '2px',
                            overflow: 'hidden',
                        }}>
                            <div style={{
                                height: '100%',
                                width: `${Math.min(100, (data.fps / 60) * 100)}%`,
                                background: getFpsColor(data.fps),
                                transition: 'width 0.2s ease',
                            }} />
                        </div>
                        <div style={{ fontSize: '10px', color: '#666', marginTop: '2px' }}>
                            Frame time: {data.frameTime}ms
                        </div>
                    </div>

                    {/* Memory Section */}
                    {data.memory && (
                        <div style={{ marginBottom: '12px' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                                <span style={{ color: '#888' }}>Memory</span>
                                <span style={{ color: '#22d3ee', fontWeight: 'bold' }}>
                                    {formatBytes(data.memory.usedJSHeapSize)}
                                </span>
                            </div>
                            <div style={{
                                height: '4px',
                                background: 'rgba(255, 255, 255, 0.1)',
                                borderRadius: '2px',
                                overflow: 'hidden',
                            }}>
                                <div style={{
                                    height: '100%',
                                    width: `${getMemoryPercent()}%`,
                                    background: getMemoryPercent() > 80 ? '#ef4444' : '#22d3ee',
                                    transition: 'width 0.2s ease',
                                }} />
                            </div>
                            <div style={{ fontSize: '10px', color: '#666', marginTop: '2px' }}>
                                {getMemoryPercent()}% of {formatBytes(data.memory.jsHeapSizeLimit)}
                            </div>
                        </div>
                    )}

                    {/* Stats Grid */}
                    <div style={{
                        display: 'grid',
                        gridTemplateColumns: '1fr 1fr',
                        gap: '8px',
                        fontSize: '11px',
                    }}>
                        <div style={{
                            padding: '8px',
                            background: 'rgba(255, 255, 255, 0.05)',
                            borderRadius: '6px'
                        }}>
                            <div style={{ color: '#888', marginBottom: '2px' }}>DOM Nodes</div>
                            <div style={{ color: '#f472b6', fontWeight: 'bold' }}>{data.domNodes}</div>
                        </div>

                        <div style={{
                            padding: '8px',
                            background: 'rgba(255, 255, 255, 0.05)',
                            borderRadius: '6px'
                        }}>
                            <div style={{ color: '#888', marginBottom: '2px' }}>Load Time</div>
                            <div style={{ color: '#22c55e', fontWeight: 'bold' }}>{data.loadTime}ms</div>
                        </div>

                        <div style={{
                            padding: '8px',
                            background: 'rgba(255, 255, 255, 0.05)',
                            borderRadius: '6px'
                        }}>
                            <div style={{ color: '#888', marginBottom: '2px' }}>Screen</div>
                            <div style={{ color: '#a855f7', fontWeight: 'bold' }}>{data.screenSize}</div>
                        </div>

                        <div style={{
                            padding: '8px',
                            background: 'rgba(255, 255, 255, 0.05)',
                            borderRadius: '6px'
                        }}>
                            <div style={{ color: '#888', marginBottom: '2px' }}>Pixel Ratio</div>
                            <div style={{ color: '#eab308', fontWeight: 'bold' }}>{data.devicePixelRatio}x</div>
                        </div>

                        <div style={{
                            padding: '8px',
                            background: 'rgba(255, 255, 255, 0.05)',
                            borderRadius: '6px'
                        }}>
                            <div style={{ color: '#888', marginBottom: '2px' }}>Network</div>
                            <div style={{ color: '#22d3ee', fontWeight: 'bold' }}>{data.connectionType}</div>
                        </div>

                        <div style={{
                            padding: '8px',
                            background: 'rgba(255, 255, 255, 0.05)',
                            borderRadius: '6px'
                        }}>
                            <div style={{ color: '#888', marginBottom: '2px' }}>First Paint</div>
                            <div style={{ color: '#f97316', fontWeight: 'bold' }}>{data.renderTime}ms</div>
                        </div>
                    </div>

                    {/* Footer */}
                    <div style={{
                        marginTop: '12px',
                        paddingTop: '8px',
                        borderTop: '1px solid rgba(255, 255, 255, 0.1)',
                        fontSize: '10px',
                        color: '#555',
                        textAlign: 'center',
                    }}>
                        Set DEBUG_ENABLED = false to hide
                    </div>
                </div>
            )}
        </div>
    );
}
