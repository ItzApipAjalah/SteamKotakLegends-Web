import { NextRequest, NextResponse } from 'next/server';

// Secret key from environment variable
const INTERNAL_SECRET = process.env.DEBUG_SECRET_KEY || '';

// API Endpoints to monitor (hidden from client)
const API_ENDPOINTS = [
    { name: 'Lanyard', url: 'https://lanyard.afifmedya.my.id/', key: 'lanyard' },
    { name: 'FreeGames', url: 'https://steam-kotak-legends-backend.vercel.app/freegames', key: 'freegames' },
    { name: 'Cookies', url: 'https://cookies.kotaklegend.my.id/', key: 'cookies' },
];

interface ApiStatusResult {
    key: string;
    name: string;
    status: 'online' | 'offline' | 'slow';
    latency: number;
    lastCheck: number;
}

// Cache the results
let cachedResults: ApiStatusResult[] | null = null;
let lastFetchTime = 0;
const CACHE_DURATION = 10 * 60 * 1000; // 10 minutes

async function checkApi(endpoint: typeof API_ENDPOINTS[0]): Promise<ApiStatusResult> {
    const startTime = Date.now();
    try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 15000);

        const response = await fetch(endpoint.url, {
            method: 'GET',
            cache: 'no-store',
            signal: controller.signal,
        });

        clearTimeout(timeoutId);
        const latency = Date.now() - startTime;

        return {
            key: endpoint.key,
            name: endpoint.name,
            status: response.ok ? (latency > 2000 ? 'slow' : 'online') : 'offline',
            latency,
            lastCheck: Date.now(),
        };
    } catch {
        const latency = Date.now() - startTime;
        return {
            key: endpoint.key,
            name: endpoint.name,
            status: 'offline',
            latency,
            lastCheck: Date.now(),
        };
    }
}

export async function GET(request: NextRequest) {
    // Check for internal secret header
    const secret = request.headers.get('x-internal-key');
    if (secret !== INTERNAL_SECRET) {
        return NextResponse.json({ error: 'Not Found' }, { status: 404 });
    }

    const now = Date.now();

    // Return cached results if still valid
    if (cachedResults && (now - lastFetchTime) < CACHE_DURATION) {
        return NextResponse.json({
            apis: cachedResults,
            cached: true,
            cacheAge: Math.round((now - lastFetchTime) / 1000),
        });
    }

    // Fetch fresh results
    const results = await Promise.all(API_ENDPOINTS.map(checkApi));

    // Cache the results
    cachedResults = results;
    lastFetchTime = now;

    return NextResponse.json({
        apis: results,
        cached: false,
        cacheAge: 0,
    });
}
