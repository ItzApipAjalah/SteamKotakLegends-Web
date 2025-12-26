'use client';

import { useState, useEffect, useRef, useCallback } from 'react';

interface PerformanceData {
    fps: number;
    avgFps: number;
    minFps: number;
    maxFps: number;
    frameTime: number;
    memory: {
        usedJSHeapSize: number;
        totalJSHeapSize: number;
        jsHeapSizeLimit: number;
    } | null;
    domNodes: number;
    eventListeners: number;
    loadTime: number;
    connectionType: string;
    downlink: number;
    rtt: number;
    devicePixelRatio: number;
    screenSize: string;
    scrollY: number;
    renderTime: number;
    longTasks: number;
    layoutShifts: number;
    gpuInfo: string;
    cpuCores: number;
    deviceMemory: number;
    platform: string;
    language: string;
    cookiesEnabled: boolean;
    online: boolean;
}

export default function DebugPanel() {
    const [isVisible, setIsVisible] = useState(true); // Always visible
    const [isOpen, setIsOpen] = useState(false); // Minimized by default
    const [activeTab, setActiveTab] = useState<'performance' | 'system' | 'network'>('performance');
    const [data, setData] = useState<PerformanceData>({
        fps: 0,
        avgFps: 0,
        minFps: 999,
        maxFps: 0,
        frameTime: 0,
        memory: null,
        domNodes: 0,
        eventListeners: 0,
        loadTime: 0,
        connectionType: 'unknown',
        downlink: 0,
        rtt: 0,
        devicePixelRatio: 1,
        screenSize: '',
        scrollY: 0,
        renderTime: 0,
        longTasks: 0,
        layoutShifts: 0,
        gpuInfo: 'unknown',
        cpuCores: 0,
        deviceMemory: 0,
        platform: '',
        language: '',
        cookiesEnabled: false,
        online: true,
    });

    const frameTimesRef = useRef<number[]>([]);
    const lastFrameTimeRef = useRef(performance.now());
    const fpsHistoryRef = useRef<number[]>([]);
    const longTasksRef = useRef(0);
    const layoutShiftsRef = useRef(0);

    // F4 keyboard shortcut to toggle visibility
    const handleKeyDown = useCallback((e: KeyboardEvent) => {
        if (e.key === 'F4') {
            e.preventDefault();
            setIsVisible(prev => !prev);
        }
    }, []);

    useEffect(() => {
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [handleKeyDown]);

    // Long Tasks Observer
    useEffect(() => {
        if (typeof PerformanceObserver === 'undefined') return;

        try {
            const longTaskObserver = new PerformanceObserver((list) => {
                longTasksRef.current += list.getEntries().length;
            });
            longTaskObserver.observe({ entryTypes: ['longtask'] });

            const layoutShiftObserver = new PerformanceObserver((list) => {
                for (const entry of list.getEntries()) {
                    if (!(entry as PerformanceEntry & { hadRecentInput?: boolean }).hadRecentInput) {
                        layoutShiftsRef.current++;
                    }
                }
            });
            layoutShiftObserver.observe({ entryTypes: ['layout-shift'] });

            return () => {
                longTaskObserver.disconnect();
                layoutShiftObserver.disconnect();
            };
        } catch {
            // Observer not supported
        }
    }, []);

    // Get GPU info
    useEffect(() => {
        try {
            const canvas = document.createElement('canvas');
            const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
            if (gl) {
                const debugInfo = (gl as WebGLRenderingContext).getExtension('WEBGL_debug_renderer_info');
                if (debugInfo) {
                    const renderer = (gl as WebGLRenderingContext).getParameter(debugInfo.UNMASKED_RENDERER_WEBGL);
                    setData(prev => ({ ...prev, gpuInfo: renderer || 'unknown' }));
                }
            }
        } catch {
            // WebGL not available
        }
    }, []);

    useEffect(() => {
        let animationId: number;
        let lastUpdateTime = performance.now();

        const updatePerformance = (currentTime: number) => {
            // Calculate frame time (time since last frame)
            const frameTime = currentTime - lastFrameTimeRef.current;
            lastFrameTimeRef.current = currentTime;

            // Store frame times for averaging (keep last 60 frames)
            frameTimesRef.current.push(frameTime);
            if (frameTimesRef.current.length > 60) {
                frameTimesRef.current.shift();
            }

            // Update display every 200ms for smooth but responsive updates
            if (currentTime - lastUpdateTime >= 200) {
                // Calculate real FPS from actual frame times
                const avgFrameTime = frameTimesRef.current.reduce((a, b) => a + b, 0) / frameTimesRef.current.length;
                const fps = Math.round(1000 / avgFrameTime);

                // Track FPS history for min/max/avg
                fpsHistoryRef.current.push(fps);
                if (fpsHistoryRef.current.length > 300) { // 1 minute of history
                    fpsHistoryRef.current.shift();
                }
                const avgFps = Math.round(fpsHistoryRef.current.reduce((a, b) => a + b, 0) / fpsHistoryRef.current.length);
                const minFps = Math.min(...fpsHistoryRef.current);
                const maxFps = Math.max(...fpsHistoryRef.current);

                // Memory info (Chrome only)
                const memory = (performance as unknown as { memory?: PerformanceData['memory'] }).memory || null;

                // DOM nodes count
                const domNodes = document.getElementsByTagName('*').length;

                // Estimate event listeners (approximate)
                let eventListeners = 0;
                document.querySelectorAll('*').forEach(el => {
                    const clone = el.cloneNode() as Element;
                    if (clone.outerHTML !== el.outerHTML) eventListeners++;
                });

                // Page load time
                const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
                const loadTime = navigation ? Math.round(navigation.loadEventEnd - navigation.startTime) : 0;

                // Connection info
                const connection = (navigator as unknown as {
                    connection?: {
                        effectiveType?: string;
                        downlink?: number;
                        rtt?: number;
                    }
                }).connection;
                const connectionType = connection?.effectiveType || 'unknown';
                const downlink = connection?.downlink || 0;
                const rtt = connection?.rtt || 0;

                // Screen info
                const screenSize = `${window.innerWidth}x${window.innerHeight}`;
                const devicePixelRatio = window.devicePixelRatio;
                const scrollY = Math.round(window.scrollY);

                // Render time (last paint)
                const paintEntries = performance.getEntriesByType('paint');
                const lastPaint = paintEntries[paintEntries.length - 1];
                const renderTime = lastPaint ? Math.round(lastPaint.startTime) : 0;

                // System info
                const cpuCores = navigator.hardwareConcurrency || 0;
                const deviceMemory = (navigator as unknown as { deviceMemory?: number }).deviceMemory || 0;
                const platform = navigator.platform || '';
                const language = navigator.language || '';
                const cookiesEnabled = navigator.cookieEnabled;
                const online = navigator.onLine;

                setData(prev => ({
                    ...prev,
                    fps,
                    avgFps,
                    minFps,
                    maxFps,
                    frameTime: Math.round(avgFrameTime * 100) / 100,
                    memory,
                    domNodes,
                    eventListeners,
                    loadTime,
                    connectionType,
                    downlink,
                    rtt,
                    devicePixelRatio,
                    screenSize,
                    scrollY,
                    renderTime,
                    longTasks: longTasksRef.current,
                    layoutShifts: layoutShiftsRef.current,
                    cpuCores,
                    deviceMemory,
                    platform,
                    language,
                    cookiesEnabled,
                    online,
                }));

                lastUpdateTime = currentTime;
            }

            animationId = requestAnimationFrame(updatePerformance);
        };

        animationId = requestAnimationFrame(updatePerformance);

        return () => {
            cancelAnimationFrame(animationId);
        };
    }, []);

    // Only render UI when visible (F4 to toggle)
    if (!isVisible) return null;

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

    const tabStyle = (isActive: boolean) => ({
        padding: '6px 12px',
        background: isActive ? 'rgba(139, 92, 246, 0.3)' : 'transparent',
        border: 'none',
        borderRadius: '4px',
        color: isActive ? '#a855f7' : '#888',
        cursor: 'pointer',
        fontSize: '10px',
        fontWeight: 'bold' as const,
        transition: 'all 0.2s ease',
    });

    const statBoxStyle = {
        padding: '8px',
        background: 'rgba(255, 255, 255, 0.05)',
        borderRadius: '6px',
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
                {isOpen ? '▼ PERFORMANCE DEBUG [F4]' : '▶ DEBUG [F4]'}
            </button>

            {/* Debug Panel */}
            {isOpen && (
                <div
                    style={{
                        background: 'rgba(0, 0, 0, 0.95)',
                        border: '1px solid rgba(139, 92, 246, 0.4)',
                        borderRadius: '12px',
                        padding: '16px',
                        minWidth: '320px',
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
                        <span style={{ color: '#a855f7', fontWeight: 'bold', flex: 1 }}>PERFORMANCE MONITOR</span>
                        <span style={{ color: getFpsColor(data.fps), fontWeight: 'bold', fontSize: '16px' }}>
                            {data.fps} FPS
                        </span>
                    </div>

                    {/* Tabs */}
                    <div style={{ display: 'flex', gap: '4px', marginBottom: '12px' }}>
                        <button style={tabStyle(activeTab === 'performance')} onClick={() => setActiveTab('performance')}>
                            ⚡ Performance
                        </button>
                        <button style={tabStyle(activeTab === 'system')} onClick={() => setActiveTab('system')}>
                            💻 System
                        </button>
                        <button style={tabStyle(activeTab === 'network')} onClick={() => setActiveTab('network')}>
                            🌐 Network
                        </button>
                    </div>

                    {/* Performance Tab */}
                    {activeTab === 'performance' && (
                        <>
                            {/* FPS Section */}
                            <div style={{ marginBottom: '12px' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                                    <span style={{ color: '#888' }}>FPS (Min/Avg/Max)</span>
                                    <span style={{ color: '#fff', fontWeight: 'bold' }}>
                                        <span style={{ color: '#ef4444' }}>{data.minFps}</span>
                                        {' / '}
                                        <span style={{ color: '#eab308' }}>{data.avgFps}</span>
                                        {' / '}
                                        <span style={{ color: '#22c55e' }}>{data.maxFps}</span>
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
                                        <span style={{ color: '#888' }}>JS Heap</span>
                                        <span style={{ color: '#22d3ee', fontWeight: 'bold' }}>
                                            {formatBytes(data.memory.usedJSHeapSize)} / {formatBytes(data.memory.totalJSHeapSize)}
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
                                        {getMemoryPercent()}% of {formatBytes(data.memory.jsHeapSizeLimit)} limit
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
                                <div style={statBoxStyle}>
                                    <div style={{ color: '#888', marginBottom: '2px' }}>DOM Nodes</div>
                                    <div style={{ color: '#f472b6', fontWeight: 'bold' }}>{data.domNodes}</div>
                                </div>
                                <div style={statBoxStyle}>
                                    <div style={{ color: '#888', marginBottom: '2px' }}>Long Tasks</div>
                                    <div style={{ color: data.longTasks > 0 ? '#ef4444' : '#22c55e', fontWeight: 'bold' }}>
                                        {data.longTasks}
                                    </div>
                                </div>
                                <div style={statBoxStyle}>
                                    <div style={{ color: '#888', marginBottom: '2px' }}>Layout Shifts</div>
                                    <div style={{ color: data.layoutShifts > 5 ? '#ef4444' : '#22c55e', fontWeight: 'bold' }}>
                                        {data.layoutShifts}
                                    </div>
                                </div>
                                <div style={statBoxStyle}>
                                    <div style={{ color: '#888', marginBottom: '2px' }}>Scroll Y</div>
                                    <div style={{ color: '#a855f7', fontWeight: 'bold' }}>{data.scrollY}px</div>
                                </div>
                            </div>
                        </>
                    )}

                    {/* System Tab */}
                    {activeTab === 'system' && (
                        <div style={{
                            display: 'grid',
                            gridTemplateColumns: '1fr 1fr',
                            gap: '8px',
                            fontSize: '11px',
                        }}>
                            <div style={statBoxStyle}>
                                <div style={{ color: '#888', marginBottom: '2px' }}>Screen</div>
                                <div style={{ color: '#a855f7', fontWeight: 'bold' }}>{data.screenSize}</div>
                            </div>
                            <div style={statBoxStyle}>
                                <div style={{ color: '#888', marginBottom: '2px' }}>Pixel Ratio</div>
                                <div style={{ color: '#eab308', fontWeight: 'bold' }}>{data.devicePixelRatio}x</div>
                            </div>
                            <div style={statBoxStyle}>
                                <div style={{ color: '#888', marginBottom: '2px' }}>CPU Cores</div>
                                <div style={{ color: '#22d3ee', fontWeight: 'bold' }}>{data.cpuCores}</div>
                            </div>
                            <div style={statBoxStyle}>
                                <div style={{ color: '#888', marginBottom: '2px' }}>Device RAM</div>
                                <div style={{ color: '#f472b6', fontWeight: 'bold' }}>{data.deviceMemory} GB</div>
                            </div>
                            <div style={{ ...statBoxStyle, gridColumn: 'span 2' }}>
                                <div style={{ color: '#888', marginBottom: '2px' }}>GPU</div>
                                <div style={{ color: '#22c55e', fontWeight: 'bold', fontSize: '9px', wordBreak: 'break-all' }}>
                                    {data.gpuInfo}
                                </div>
                            </div>
                            <div style={statBoxStyle}>
                                <div style={{ color: '#888', marginBottom: '2px' }}>Platform</div>
                                <div style={{ color: '#f97316', fontWeight: 'bold' }}>{data.platform}</div>
                            </div>
                            <div style={statBoxStyle}>
                                <div style={{ color: '#888', marginBottom: '2px' }}>Language</div>
                                <div style={{ color: '#22d3ee', fontWeight: 'bold' }}>{data.language}</div>
                            </div>
                            <div style={statBoxStyle}>
                                <div style={{ color: '#888', marginBottom: '2px' }}>Cookies</div>
                                <div style={{ color: data.cookiesEnabled ? '#22c55e' : '#ef4444', fontWeight: 'bold' }}>
                                    {data.cookiesEnabled ? 'Enabled' : 'Disabled'}
                                </div>
                            </div>
                            <div style={statBoxStyle}>
                                <div style={{ color: '#888', marginBottom: '2px' }}>Status</div>
                                <div style={{ color: data.online ? '#22c55e' : '#ef4444', fontWeight: 'bold' }}>
                                    {data.online ? '🟢 Online' : '🔴 Offline'}
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Network Tab */}
                    {activeTab === 'network' && (
                        <div style={{
                            display: 'grid',
                            gridTemplateColumns: '1fr 1fr',
                            gap: '8px',
                            fontSize: '11px',
                        }}>
                            <div style={statBoxStyle}>
                                <div style={{ color: '#888', marginBottom: '2px' }}>Connection</div>
                                <div style={{ color: '#22d3ee', fontWeight: 'bold' }}>{data.connectionType}</div>
                            </div>
                            <div style={statBoxStyle}>
                                <div style={{ color: '#888', marginBottom: '2px' }}>Downlink</div>
                                <div style={{ color: '#22c55e', fontWeight: 'bold' }}>{data.downlink} Mbps</div>
                            </div>
                            <div style={statBoxStyle}>
                                <div style={{ color: '#888', marginBottom: '2px' }}>RTT (Latency)</div>
                                <div style={{ color: data.rtt > 100 ? '#ef4444' : '#22c55e', fontWeight: 'bold' }}>
                                    {data.rtt}ms
                                </div>
                            </div>
                            <div style={statBoxStyle}>
                                <div style={{ color: '#888', marginBottom: '2px' }}>Page Load</div>
                                <div style={{ color: '#eab308', fontWeight: 'bold' }}>{data.loadTime}ms</div>
                            </div>
                            <div style={statBoxStyle}>
                                <div style={{ color: '#888', marginBottom: '2px' }}>First Paint</div>
                                <div style={{ color: '#f97316', fontWeight: 'bold' }}>{data.renderTime}ms</div>
                            </div>
                            <div style={statBoxStyle}>
                                <div style={{ color: '#888', marginBottom: '2px' }}>Online</div>
                                <div style={{ color: data.online ? '#22c55e' : '#ef4444', fontWeight: 'bold' }}>
                                    {data.online ? 'Yes' : 'No'}
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Footer */}
                    <div style={{
                        marginTop: '12px',
                        paddingTop: '8px',
                        borderTop: '1px solid rgba(255, 255, 255, 0.1)',
                        fontSize: '10px',
                        color: '#555',
                        textAlign: 'center',
                    }}>
                        Press F4 to hide • Real-time monitoring
                    </div>
                </div>
            )}
        </div>
    );
}
