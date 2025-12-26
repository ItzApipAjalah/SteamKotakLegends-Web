'use client';

import { useState, useEffect, useRef, useCallback } from 'react';

// API Endpoints to display (URLs are server-side only)
const API_ENDPOINTS = [
    { name: 'Lanyard', key: 'lanyard' },
    { name: 'Backend', key: 'freegames' },
    { name: 'Cookies', key: 'cookies' },
];

interface ApiStatus {
    status: 'checking' | 'online' | 'offline' | 'slow';
    latency: number;
    lastCheck: number;
}

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
    // Storage
    localStorageUsed: number;
    sessionStorageUsed: number;
    // Server
    serverStatus: 'checking' | 'online' | 'offline' | 'slow';
    serverLatency: number;
    // Browser
    userAgent: string;
    browserName: string;
    browserVersion: string;
    // Battery
    batteryLevel: number;
    batteryCharging: boolean;
    // Errors
    consoleErrors: number;
    consoleWarnings: number;
    // Cache
    serviceWorker: string;
    // Session
    sessionDuration: number;
    // Environment
    nodeEnv: string;
}

export default function DebugPanel() {
    const [isOpen, setIsOpen] = useState(false);
    const [activeTab, setActiveTab] = useState<'performance' | 'system' | 'network' | 'apis' | 'storage'>('performance');
    const [apiStatuses, setApiStatuses] = useState<Record<string, ApiStatus>>({
        lanyard: { status: 'checking', latency: 0, lastCheck: 0 },
        freegames: { status: 'checking', latency: 0, lastCheck: 0 },
        cookies: { status: 'checking', latency: 0, lastCheck: 0 },
    });
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
        localStorageUsed: 0,
        sessionStorageUsed: 0,
        serverStatus: 'checking',
        serverLatency: 0,
        userAgent: '',
        browserName: '',
        browserVersion: '',
        batteryLevel: 100,
        batteryCharging: false,
        consoleErrors: 0,
        consoleWarnings: 0,
        serviceWorker: 'unknown',
        sessionDuration: 0,
        nodeEnv: process.env.NODE_ENV || 'unknown',
    });

    const frameTimesRef = useRef<number[]>([]);
    const lastFrameTimeRef = useRef(performance.now());
    const fpsHistoryRef = useRef<number[]>([]);
    const longTasksRef = useRef(0);
    const layoutShiftsRef = useRef(0);
    const sessionStartRef = useRef(Date.now());
    const errorCountRef = useRef(0);
    const warningCountRef = useRef(0);

    // F4 keyboard shortcut to toggle panel open/close
    const handleKeyDown = useCallback((e: KeyboardEvent) => {
        if (e.key === 'F4') {
            e.preventDefault();
            setIsOpen(prev => !prev);
        }
    }, []);

    useEffect(() => {
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [handleKeyDown]);

    // Console error/warning interceptor
    useEffect(() => {
        const originalError = console.error;
        const originalWarn = console.warn;

        console.error = (...args) => {
            errorCountRef.current++;
            originalError.apply(console, args);
        };

        console.warn = (...args) => {
            warningCountRef.current++;
            originalWarn.apply(console, args);
        };

        return () => {
            console.error = originalError;
            console.warn = originalWarn;
        };
    }, []);

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

    // Battery API
    useEffect(() => {
        const getBattery = async () => {
            try {
                const battery = await (navigator as Navigator & { getBattery?: () => Promise<{ level: number; charging: boolean }> }).getBattery?.();
                if (battery) {
                    setData(prev => ({
                        ...prev,
                        batteryLevel: Math.round(battery.level * 100),
                        batteryCharging: battery.charging,
                    }));
                }
            } catch {
                // Battery API not available
            }
        };
        getBattery();
    }, []);

    // Browser detection
    useEffect(() => {
        const ua = navigator.userAgent;
        let browserName = 'Unknown';
        let browserVersion = '';

        if (ua.includes('Firefox/')) {
            browserName = 'Firefox';
            browserVersion = ua.split('Firefox/')[1]?.split(' ')[0] || '';
        } else if (ua.includes('Chrome/')) {
            browserName = 'Chrome';
            browserVersion = ua.split('Chrome/')[1]?.split(' ')[0] || '';
        } else if (ua.includes('Safari/') && !ua.includes('Chrome')) {
            browserName = 'Safari';
            browserVersion = ua.split('Version/')[1]?.split(' ')[0] || '';
        } else if (ua.includes('Edge/')) {
            browserName = 'Edge';
            browserVersion = ua.split('Edge/')[1]?.split(' ')[0] || '';
        }

        setData(prev => ({
            ...prev,
            userAgent: ua,
            browserName,
            browserVersion,
        }));
    }, []);

    // Service Worker status
    useEffect(() => {
        if ('serviceWorker' in navigator) {
            navigator.serviceWorker.getRegistrations().then(registrations => {
                setData(prev => ({
                    ...prev,
                    serviceWorker: registrations.length > 0 ? 'Active' : 'None',
                }));
            });
        }
    }, []);

    // API Status Checks (Server-Side Rendered)
    const [apiCacheInfo, setApiCacheInfo] = useState({ cached: false, cacheAge: 0 });

    const fetchApiStatus = useCallback(async () => {
        try {
            const response = await fetch('/api/debug-check', {
                method: 'GET',
                cache: 'no-store',
                headers: {
                    'x-internal-key': process.env.NEXT_PUBLIC_DEBUG_KEY || '',
                },
            });

            if (!response.ok) return;

            const data = await response.json();

            // Update API statuses from server response
            const newStatuses: Record<string, ApiStatus> = {};
            for (const api of data.apis) {
                newStatuses[api.key] = {
                    status: api.status,
                    latency: api.latency,
                    lastCheck: api.lastCheck,
                };
            }
            setApiStatuses(newStatuses);
            setApiCacheInfo({
                cached: data.cached,
                cacheAge: data.cacheAge,
            });
        } catch {
            // API route not available, set all to offline
            setApiStatuses({
                lanyard: { status: 'offline', latency: 0, lastCheck: Date.now() },
                freegames: { status: 'offline', latency: 0, lastCheck: Date.now() },
                cookies: { status: 'offline', latency: 0, lastCheck: Date.now() },
            });
        }
    }, []);

    useEffect(() => {
        // Check server status (main site)
        const checkServer = async () => {
            const startTime = performance.now();
            try {
                const response = await fetch('/', { method: 'HEAD', cache: 'no-store' });
                const latency = Math.round(performance.now() - startTime);
                setData(prev => ({
                    ...prev,
                    serverStatus: response.ok ? (latency > 500 ? 'slow' : 'online') : 'offline',
                    serverLatency: latency,
                }));
            } catch {
                setData(prev => ({
                    ...prev,
                    serverStatus: 'offline',
                    serverLatency: 0,
                }));
            }
        };

        // Initial fetch
        fetchApiStatus();
        checkServer();

        // Refresh intervals
        const apiInterval = setInterval(() => fetchApiStatus(), 10 * 60 * 1000); // 10 minutes for APIs
        const serverInterval = setInterval(checkServer, 10000); // 10 seconds for server

        return () => {
            clearInterval(apiInterval);
            clearInterval(serverInterval);
        };
    }, [fetchApiStatus]);

    // Storage usage
    const getStorageSize = (storage: Storage): number => {
        let total = 0;
        for (const key in storage) {
            if (Object.prototype.hasOwnProperty.call(storage, key)) {
                total += (storage.getItem(key)?.length || 0) * 2;
            }
        }
        return total;
    };

    useEffect(() => {
        let animationId: number;
        let lastUpdateTime = performance.now();

        const updatePerformance = (currentTime: number) => {
            const frameTime = currentTime - lastFrameTimeRef.current;
            lastFrameTimeRef.current = currentTime;

            frameTimesRef.current.push(frameTime);
            if (frameTimesRef.current.length > 60) {
                frameTimesRef.current.shift();
            }

            if (currentTime - lastUpdateTime >= 200) {
                const avgFrameTime = frameTimesRef.current.reduce((a, b) => a + b, 0) / frameTimesRef.current.length;
                const fps = Math.round(1000 / avgFrameTime);

                fpsHistoryRef.current.push(fps);
                if (fpsHistoryRef.current.length > 300) {
                    fpsHistoryRef.current.shift();
                }
                const avgFps = Math.round(fpsHistoryRef.current.reduce((a, b) => a + b, 0) / fpsHistoryRef.current.length);
                const minFps = Math.min(...fpsHistoryRef.current);
                const maxFps = Math.max(...fpsHistoryRef.current);

                const memory = (performance as unknown as { memory?: PerformanceData['memory'] }).memory || null;
                const domNodes = document.getElementsByTagName('*').length;

                const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
                const loadTime = navigation ? Math.round(navigation.loadEventEnd - navigation.startTime) : 0;

                const connection = (navigator as unknown as {
                    connection?: { effectiveType?: string; downlink?: number; rtt?: number; }
                }).connection;
                const connectionType = connection?.effectiveType || 'unknown';
                const downlink = connection?.downlink || 0;
                const rtt = connection?.rtt || 0;

                const screenSize = `${window.innerWidth}x${window.innerHeight}`;
                const devicePixelRatio = window.devicePixelRatio;
                const scrollY = Math.round(window.scrollY);

                const paintEntries = performance.getEntriesByType('paint');
                const lastPaint = paintEntries[paintEntries.length - 1];
                const renderTime = lastPaint ? Math.round(lastPaint.startTime) : 0;

                const cpuCores = navigator.hardwareConcurrency || 0;
                const deviceMemory = (navigator as unknown as { deviceMemory?: number }).deviceMemory || 0;
                const platform = navigator.platform || '';
                const language = navigator.language || '';
                const cookiesEnabled = navigator.cookieEnabled;
                const online = navigator.onLine;

                const localStorageUsed = getStorageSize(localStorage);
                const sessionStorageUsed = getStorageSize(sessionStorage);
                const sessionDuration = Math.round((Date.now() - sessionStartRef.current) / 1000);

                setData(prev => ({
                    ...prev,
                    fps,
                    avgFps,
                    minFps,
                    maxFps,
                    frameTime: Math.round(avgFrameTime * 100) / 100,
                    memory,
                    domNodes,
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
                    localStorageUsed,
                    sessionStorageUsed,
                    sessionDuration,
                    consoleErrors: errorCountRef.current,
                    consoleWarnings: warningCountRef.current,
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


    const formatBytes = (bytes: number) => {
        if (bytes === 0) return '0 B';
        const k = 1024;
        const sizes = ['B', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    };

    const formatDuration = (seconds: number) => {
        const h = Math.floor(seconds / 3600);
        const m = Math.floor((seconds % 3600) / 60);
        const s = seconds % 60;
        if (h > 0) return `${h}h ${m}m`;
        if (m > 0) return `${m}m ${s}s`;
        return `${s}s`;
    };

    const getFpsColor = (fps: number) => {
        if (fps >= 55) return '#22c55e';
        if (fps >= 30) return '#eab308';
        return '#ef4444';
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'online': return '#22c55e';
            case 'slow': return '#eab308';
            case 'offline': return '#ef4444';
            default: return '#888';
        }
    };

    const getStatusEmoji = (status: string) => {
        switch (status) {
            case 'online': return '🟢';
            case 'slow': return '🟡';
            case 'offline': return '🔴';
            default: return '⏳';
        }
    };

    const getMemoryPercent = () => {
        if (!data.memory) return 0;
        return Math.round((data.memory.usedJSHeapSize / data.memory.jsHeapSizeLimit) * 100);
    };

    const getOverallApiStatus = () => {
        const statuses = Object.values(apiStatuses);
        if (statuses.some(s => s.status === 'offline')) return 'offline';
        if (statuses.some(s => s.status === 'slow')) return 'slow';
        if (statuses.some(s => s.status === 'checking')) return 'checking';
        return 'online';
    };

    const tabStyle = (isActive: boolean) => ({
        padding: '4px 8px',
        background: isActive ? 'rgba(139, 92, 246, 0.3)' : 'transparent',
        border: 'none',
        borderRadius: '4px',
        color: isActive ? '#a855f7' : '#888',
        cursor: 'pointer',
        fontSize: '9px',
        fontWeight: 'bold' as const,
        transition: 'all 0.2s ease',
    });

    const statBoxStyle = {
        padding: '6px',
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
                fontSize: '11px',
                color: 'white',
                userSelect: 'none',
            }}
        >
            {/* Toggle Button - Always visible */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                style={{
                    padding: '6px 12px',
                    background: 'rgba(0, 0, 0, 0.9)',
                    border: '1px solid rgba(139, 92, 246, 0.5)',
                    borderRadius: '6px',
                    color: '#a855f7',
                    cursor: 'pointer',
                    fontSize: '10px',
                    fontWeight: 'bold',
                    transition: 'all 0.2s ease',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    marginBottom: isOpen ? '8px' : '0',
                }}
            >
                <span style={{ color: getFpsColor(data.fps), fontWeight: 'bold' }}>{data.fps}</span>
                <span style={{ color: '#888' }}>FPS</span>
                <span style={{ color: getStatusColor(data.serverStatus) }}>●</span>
                <span style={{ color: getStatusColor(getOverallApiStatus()) }}>●</span>
                <span style={{ color: '#666', fontSize: '9px' }}>[F4]</span>
            </button>

            {/* Debug Panel */}
            {isOpen && (
                <div
                    style={{
                        background: 'rgba(0, 0, 0, 0.95)',
                        border: '1px solid rgba(139, 92, 246, 0.4)',
                        borderRadius: '12px',
                        padding: '12px',
                        minWidth: '360px',
                        maxHeight: '500px',
                        overflowY: 'auto',
                        backdropFilter: 'blur(10px)',
                        boxShadow: '0 8px 32px rgba(0, 0, 0, 0.5)',
                    }}
                >
                    {/* Header */}
                    <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        marginBottom: '10px',
                        paddingBottom: '8px',
                        borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
                    }}>
                        <div style={{
                            width: '8px',
                            height: '8px',
                            borderRadius: '50%',
                            background: getFpsColor(data.fps),
                        }} />
                        <span style={{ color: '#a855f7', fontWeight: 'bold', flex: 1, fontSize: '12px' }}>
                            PERFORMANCE MONITOR
                        </span>
                        <span style={{ color: getFpsColor(data.fps), fontWeight: 'bold', fontSize: '14px' }}>
                            {data.fps} FPS
                        </span>
                    </div>

                    {/* Quick Stats Bar */}
                    <div style={{
                        display: 'flex',
                        gap: '12px',
                        marginBottom: '10px',
                        fontSize: '9px',
                        flexWrap: 'wrap',
                    }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                            <span style={{ color: getStatusColor(data.serverStatus) }}>●</span>
                            <span style={{ color: '#888' }}>Server</span>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                            <span style={{ color: getStatusColor(getOverallApiStatus()) }}>●</span>
                            <span style={{ color: '#888' }}>APIs</span>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                            <span style={{ color: data.online ? '#22c55e' : '#ef4444' }}>●</span>
                            <span style={{ color: '#888' }}>Net</span>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                            <span style={{ color: data.consoleErrors > 0 ? '#ef4444' : '#22c55e' }}>●</span>
                            <span style={{ color: '#888' }}>Err: {data.consoleErrors}</span>
                        </div>
                    </div>

                    {/* Tabs */}
                    <div style={{ display: 'flex', gap: '4px', marginBottom: '10px', flexWrap: 'wrap' }}>
                        <button style={tabStyle(activeTab === 'performance')} onClick={() => setActiveTab('performance')}>
                            ⚡ Perf
                        </button>
                        <button style={tabStyle(activeTab === 'system')} onClick={() => setActiveTab('system')}>
                            💻 System
                        </button>
                        <button style={tabStyle(activeTab === 'network')} onClick={() => setActiveTab('network')}>
                            🌐 Network
                        </button>
                        <button style={tabStyle(activeTab === 'apis')} onClick={() => setActiveTab('apis')}>
                            🖥️ APIs
                        </button>
                        <button style={tabStyle(activeTab === 'storage')} onClick={() => setActiveTab('storage')}>
                            💾 Storage
                        </button>
                    </div>

                    {/* Performance Tab */}
                    {activeTab === 'performance' && (
                        <>
                            <div style={{ marginBottom: '10px' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                                    <span style={{ color: '#888' }}>FPS (Min/Avg/Max)</span>
                                    <span style={{ color: '#fff', fontWeight: 'bold', fontSize: '10px' }}>
                                        <span style={{ color: '#ef4444' }}>{data.minFps}</span>
                                        {' / '}
                                        <span style={{ color: '#eab308' }}>{data.avgFps}</span>
                                        {' / '}
                                        <span style={{ color: '#22c55e' }}>{data.maxFps}</span>
                                    </span>
                                </div>
                                <div style={{ height: '4px', background: 'rgba(255, 255, 255, 0.1)', borderRadius: '2px', overflow: 'hidden' }}>
                                    <div style={{ height: '100%', width: `${Math.min(100, (data.fps / 60) * 100)}%`, background: getFpsColor(data.fps), transition: 'width 0.2s ease' }} />
                                </div>
                                <div style={{ fontSize: '9px', color: '#666', marginTop: '2px' }}>Frame time: {data.frameTime}ms</div>
                            </div>

                            {data.memory && (
                                <div style={{ marginBottom: '10px' }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                                        <span style={{ color: '#888' }}>JS Heap</span>
                                        <span style={{ color: '#22d3ee', fontWeight: 'bold', fontSize: '10px' }}>{formatBytes(data.memory.usedJSHeapSize)}</span>
                                    </div>
                                    <div style={{ height: '4px', background: 'rgba(255, 255, 255, 0.1)', borderRadius: '2px', overflow: 'hidden' }}>
                                        <div style={{ height: '100%', width: `${getMemoryPercent()}%`, background: getMemoryPercent() > 80 ? '#ef4444' : '#22d3ee' }} />
                                    </div>
                                </div>
                            )}

                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '6px', fontSize: '10px' }}>
                                <div style={statBoxStyle}>
                                    <div style={{ color: '#888', fontSize: '9px' }}>DOM</div>
                                    <div style={{ color: '#f472b6', fontWeight: 'bold' }}>{data.domNodes}</div>
                                </div>
                                <div style={statBoxStyle}>
                                    <div style={{ color: '#888', fontSize: '9px' }}>Long Tasks</div>
                                    <div style={{ color: data.longTasks > 0 ? '#ef4444' : '#22c55e', fontWeight: 'bold' }}>{data.longTasks}</div>
                                </div>
                                <div style={statBoxStyle}>
                                    <div style={{ color: '#888', fontSize: '9px' }}>CLS</div>
                                    <div style={{ color: data.layoutShifts > 5 ? '#ef4444' : '#22c55e', fontWeight: 'bold' }}>{data.layoutShifts}</div>
                                </div>
                                <div style={statBoxStyle}>
                                    <div style={{ color: '#888', fontSize: '9px' }}>Errors</div>
                                    <div style={{ color: data.consoleErrors > 0 ? '#ef4444' : '#22c55e', fontWeight: 'bold' }}>{data.consoleErrors}</div>
                                </div>
                                <div style={statBoxStyle}>
                                    <div style={{ color: '#888', fontSize: '9px' }}>Warnings</div>
                                    <div style={{ color: data.consoleWarnings > 0 ? '#eab308' : '#22c55e', fontWeight: 'bold' }}>{data.consoleWarnings}</div>
                                </div>
                                <div style={statBoxStyle}>
                                    <div style={{ color: '#888', fontSize: '9px' }}>Session</div>
                                    <div style={{ color: '#a855f7', fontWeight: 'bold' }}>{formatDuration(data.sessionDuration)}</div>
                                </div>
                            </div>
                        </>
                    )}

                    {/* System Tab */}
                    {activeTab === 'system' && (
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '6px', fontSize: '10px' }}>
                            <div style={statBoxStyle}>
                                <div style={{ color: '#888', fontSize: '9px' }}>Screen</div>
                                <div style={{ color: '#a855f7', fontWeight: 'bold' }}>{data.screenSize}</div>
                            </div>
                            <div style={statBoxStyle}>
                                <div style={{ color: '#888', fontSize: '9px' }}>DPR</div>
                                <div style={{ color: '#eab308', fontWeight: 'bold' }}>{data.devicePixelRatio}x</div>
                            </div>
                            <div style={statBoxStyle}>
                                <div style={{ color: '#888', fontSize: '9px' }}>CPU Cores</div>
                                <div style={{ color: '#22d3ee', fontWeight: 'bold' }}>{data.cpuCores}</div>
                            </div>
                            <div style={statBoxStyle}>
                                <div style={{ color: '#888', fontSize: '9px' }}>RAM</div>
                                <div style={{ color: '#f472b6', fontWeight: 'bold' }}>{data.deviceMemory} GB</div>
                            </div>
                            <div style={statBoxStyle}>
                                <div style={{ color: '#888', fontSize: '9px' }}>Browser</div>
                                <div style={{ color: '#22c55e', fontWeight: 'bold' }}>{data.browserName} {data.browserVersion?.split('.')[0]}</div>
                            </div>
                            <div style={statBoxStyle}>
                                <div style={{ color: '#888', fontSize: '9px' }}>Battery</div>
                                <div style={{ color: data.batteryLevel < 20 ? '#ef4444' : '#22c55e', fontWeight: 'bold' }}>
                                    {data.batteryLevel}% {data.batteryCharging ? '⚡' : ''}
                                </div>
                            </div>
                            <div style={{ ...statBoxStyle, gridColumn: 'span 2' }}>
                                <div style={{ color: '#888', fontSize: '9px' }}>GPU</div>
                                <div style={{ color: '#22c55e', fontWeight: 'bold', fontSize: '8px', wordBreak: 'break-all' }}>
                                    {data.gpuInfo.length > 60 ? data.gpuInfo.substring(0, 60) + '...' : data.gpuInfo}
                                </div>
                            </div>
                            <div style={statBoxStyle}>
                                <div style={{ color: '#888', fontSize: '9px' }}>Platform</div>
                                <div style={{ color: '#f97316', fontWeight: 'bold' }}>{data.platform}</div>
                            </div>
                            <div style={statBoxStyle}>
                                <div style={{ color: '#888', fontSize: '9px' }}>Environment</div>
                                <div style={{ color: data.nodeEnv === 'production' ? '#22c55e' : '#eab308', fontWeight: 'bold' }}>{data.nodeEnv}</div>
                            </div>
                        </div>
                    )}

                    {/* Network Tab */}
                    {activeTab === 'network' && (
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '6px', fontSize: '10px' }}>
                            <div style={statBoxStyle}>
                                <div style={{ color: '#888', fontSize: '9px' }}>Status</div>
                                <div style={{ color: data.online ? '#22c55e' : '#ef4444', fontWeight: 'bold' }}>
                                    {data.online ? '🟢 Online' : '🔴 Offline'}
                                </div>
                            </div>
                            <div style={statBoxStyle}>
                                <div style={{ color: '#888', fontSize: '9px' }}>Type</div>
                                <div style={{ color: '#22d3ee', fontWeight: 'bold' }}>{data.connectionType}</div>
                            </div>
                            <div style={statBoxStyle}>
                                <div style={{ color: '#888', fontSize: '9px' }}>Downlink</div>
                                <div style={{ color: '#22c55e', fontWeight: 'bold' }}>{data.downlink} Mbps</div>
                            </div>
                            <div style={statBoxStyle}>
                                <div style={{ color: '#888', fontSize: '9px' }}>RTT</div>
                                <div style={{ color: data.rtt > 100 ? '#ef4444' : '#22c55e', fontWeight: 'bold' }}>{data.rtt}ms</div>
                            </div>
                            <div style={statBoxStyle}>
                                <div style={{ color: '#888', fontSize: '9px' }}>Page Load</div>
                                <div style={{ color: '#eab308', fontWeight: 'bold' }}>{data.loadTime}ms</div>
                            </div>
                            <div style={statBoxStyle}>
                                <div style={{ color: '#888', fontSize: '9px' }}>First Paint</div>
                                <div style={{ color: '#f97316', fontWeight: 'bold' }}>{data.renderTime}ms</div>
                            </div>
                            <div style={statBoxStyle}>
                                <div style={{ color: '#888', fontSize: '9px' }}>Server Status</div>
                                <div style={{ color: getStatusColor(data.serverStatus), fontWeight: 'bold' }}>
                                    {getStatusEmoji(data.serverStatus)} {data.serverLatency}ms
                                </div>
                            </div>
                            <div style={statBoxStyle}>
                                <div style={{ color: '#888', fontSize: '9px' }}>Service Worker</div>
                                <div style={{ color: data.serviceWorker === 'Active' ? '#22c55e' : '#888', fontWeight: 'bold' }}>{data.serviceWorker}</div>
                            </div>
                        </div>
                    )}

                    {/* APIs Tab */}
                    {activeTab === 'apis' && (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '10px' }}>
                            <div style={{ color: '#888', fontSize: '9px', marginBottom: '4px', display: 'flex', justifyContent: 'space-between' }}>
                                <span>External API Status</span>
                                <span style={{ color: apiCacheInfo.cached ? '#eab308' : '#22c55e' }}>
                                    {apiCacheInfo.cached ? `${Math.floor(apiCacheInfo.cacheAge / 60)}m ago` : 'Fresh'}
                                </span>
                            </div>
                            {API_ENDPOINTS.map(endpoint => {
                                const status = apiStatuses[endpoint.key];
                                return (
                                    <div key={endpoint.key} style={{
                                        ...statBoxStyle,
                                        display: 'flex',
                                        justifyContent: 'space-between',
                                        alignItems: 'center',
                                    }}>
                                        <div style={{ color: '#fff', fontWeight: 'bold' }}>{endpoint.name}</div>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                            <span style={{ color: status.latency > 1000 ? '#ef4444' : '#22c55e', fontSize: '9px' }}>
                                                {status.latency}ms
                                            </span>
                                            <span style={{ color: getStatusColor(status.status), fontWeight: 'bold' }}>
                                                {getStatusEmoji(status.status)}
                                            </span>
                                        </div>
                                    </div>
                                );
                            })}
                            <div style={{ color: '#555', fontSize: '8px', textAlign: 'center', marginTop: '4px' }}>
                                Auto-refresh setiap 10 menit
                            </div>
                        </div>
                    )}

                    {/* Storage Tab */}
                    {activeTab === 'storage' && (
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '6px', fontSize: '10px' }}>
                            <div style={statBoxStyle}>
                                <div style={{ color: '#888', fontSize: '9px' }}>LocalStorage</div>
                                <div style={{ color: '#22d3ee', fontWeight: 'bold' }}>{formatBytes(data.localStorageUsed)}</div>
                            </div>
                            <div style={statBoxStyle}>
                                <div style={{ color: '#888', fontSize: '9px' }}>SessionStorage</div>
                                <div style={{ color: '#f472b6', fontWeight: 'bold' }}>{formatBytes(data.sessionStorageUsed)}</div>
                            </div>
                            {data.memory && (
                                <>
                                    <div style={statBoxStyle}>
                                        <div style={{ color: '#888', fontSize: '9px' }}>JS Heap Used</div>
                                        <div style={{ color: '#22c55e', fontWeight: 'bold' }}>{formatBytes(data.memory.usedJSHeapSize)}</div>
                                    </div>
                                    <div style={statBoxStyle}>
                                        <div style={{ color: '#888', fontSize: '9px' }}>JS Heap Total</div>
                                        <div style={{ color: '#eab308', fontWeight: 'bold' }}>{formatBytes(data.memory.totalJSHeapSize)}</div>
                                    </div>
                                    <div style={{ ...statBoxStyle, gridColumn: 'span 2' }}>
                                        <div style={{ color: '#888', fontSize: '9px' }}>JS Heap Limit</div>
                                        <div style={{ color: '#a855f7', fontWeight: 'bold' }}>{formatBytes(data.memory.jsHeapSizeLimit)}</div>
                                    </div>
                                </>
                            )}
                            <div style={statBoxStyle}>
                                <div style={{ color: '#888', fontSize: '9px' }}>Cookies</div>
                                <div style={{ color: data.cookiesEnabled ? '#22c55e' : '#ef4444', fontWeight: 'bold' }}>
                                    {data.cookiesEnabled ? 'Enabled' : 'Disabled'}
                                </div>
                            </div>
                            <div style={statBoxStyle}>
                                <div style={{ color: '#888', fontSize: '9px' }}>Service Worker</div>
                                <div style={{ color: data.serviceWorker === 'Active' ? '#22c55e' : '#888', fontWeight: 'bold' }}>{data.serviceWorker}</div>
                            </div>
                        </div>
                    )}

                    {/* Footer */}
                    <div style={{
                        marginTop: '10px',
                        paddingTop: '8px',
                        borderTop: '1px solid rgba(255, 255, 255, 0.1)',
                        fontSize: '9px',
                        color: '#555',
                        textAlign: 'center',
                    }}>
                        Press F4 to toggle • Session: {formatDuration(data.sessionDuration)}
                    </div>
                </div>
            )}
        </div>
    );
}
