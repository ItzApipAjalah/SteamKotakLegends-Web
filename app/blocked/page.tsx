import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Access Denied | SteamKotakLegends',
    robots: 'noindex, nofollow',
};

export default function BlockedPage({
    searchParams,
}: {
    searchParams: { ray?: string };
}) {
    const rayId = searchParams.ray || 'UNKNOWN';

    return (
        <html lang="id">
            <body style={{ margin: 0, padding: 0 }}>
                <div
                    style={{
                        minHeight: '100vh',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        background: 'linear-gradient(180deg, #1a1a2e 0%, #0f0f1a 100%)',
                        fontFamily: 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
                        color: 'white',
                        textAlign: 'center',
                        padding: '40px 20px',
                    }}
                >
                    {/* Logo/Icon */}
                    <div
                        style={{
                            width: '80px',
                            height: '80px',
                            borderRadius: '50%',
                            background: 'linear-gradient(135deg, #ef4444, #f97316)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            marginBottom: '32px',
                            boxShadow: '0 0 60px rgba(239, 68, 68, 0.4)',
                        }}
                    >
                        <svg
                            width="40"
                            height="40"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="white"
                            strokeWidth="2.5"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        >
                            <circle cx="12" cy="12" r="10" />
                            <line x1="15" y1="9" x2="9" y2="15" />
                            <line x1="9" y1="9" x2="15" y2="15" />
                        </svg>
                    </div>

                    {/* Title */}
                    <h1
                        style={{
                            fontSize: 'clamp(1.5rem, 4vw, 2.5rem)',
                            fontWeight: 700,
                            margin: '0 0 16px 0',
                            background: 'linear-gradient(135deg, #ffffff, #94a3b8)',
                            WebkitBackgroundClip: 'text',
                            WebkitTextFillColor: 'transparent',
                            backgroundClip: 'text',
                        }}
                    >
                        Access Denied
                    </h1>

                    {/* Description */}
                    <p
                        style={{
                            fontSize: '1.1rem',
                            color: 'rgba(255, 255, 255, 0.7)',
                            maxWidth: '500px',
                            lineHeight: 1.6,
                            margin: '0 0 40px 0',
                        }}
                    >
                        Halaman ini tidak dapat diakses karena aktivitas mencurigakan terdeteksi pada browser Anda.
                    </p>

                    {/* Error Box */}
                    <div
                        style={{
                            background: 'rgba(255, 255, 255, 0.03)',
                            border: '1px solid rgba(255, 255, 255, 0.1)',
                            borderRadius: '16px',
                            padding: '24px 40px',
                            marginBottom: '40px',
                        }}
                    >
                        <div
                            style={{
                                display: 'grid',
                                gridTemplateColumns: 'repeat(2, 1fr)',
                                gap: '24px 48px',
                                textAlign: 'left',
                            }}
                        >
                            <div>
                                <div style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.4)', marginBottom: '4px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                                    Ray ID
                                </div>
                                <div style={{ fontSize: '0.95rem', fontFamily: 'monospace', color: '#fbbf24' }}>
                                    {rayId}
                                </div>
                            </div>
                            <div>
                                <div style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.4)', marginBottom: '4px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                                    Error Code
                                </div>
                                <div style={{ fontSize: '0.95rem', fontFamily: 'monospace', color: '#ef4444' }}>
                                    1020
                                </div>
                            </div>
                            <div>
                                <div style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.4)', marginBottom: '4px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                                    Time
                                </div>
                                <div style={{ fontSize: '0.95rem', fontFamily: 'monospace', color: 'rgba(255,255,255,0.8)' }}>
                                    {new Date().toISOString()}
                                </div>
                            </div>
                            <div>
                                <div style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.4)', marginBottom: '4px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                                    Reason
                                </div>
                                <div style={{ fontSize: '0.95rem', fontFamily: 'monospace', color: 'rgba(255,255,255,0.8)' }}>
                                    DEVTOOLS_DETECTED
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* What to do */}
                    <div
                        style={{
                            background: 'rgba(88, 101, 242, 0.1)',
                            border: '1px solid rgba(88, 101, 242, 0.2)',
                            borderRadius: '12px',
                            padding: '20px 32px',
                            marginBottom: '32px',
                            maxWidth: '500px',
                        }}
                    >
                        <h3 style={{ margin: '0 0 12px 0', fontSize: '1rem', color: '#818cf8' }}>
                            Cara mengatasi:
                        </h3>
                        <ol
                            style={{
                                margin: 0,
                                padding: '0 0 0 20px',
                                color: 'rgba(255, 255, 255, 0.7)',
                                fontSize: '0.9rem',
                                lineHeight: 1.8,
                                textAlign: 'left',
                            }}
                        >
                            <li>Tutup Developer Tools (F12)</li>
                            <li>Refresh halaman ini</li>
                            <li>Kembali ke halaman utama</li>
                        </ol>
                    </div>

                    {/* Buttons */}
                    <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap', justifyContent: 'center' }}>
                        <a
                            href="/"
                            style={{
                                padding: '14px 32px',
                                background: 'linear-gradient(135deg, #5865f2, #7c3aed)',
                                color: 'white',
                                border: 'none',
                                borderRadius: '12px',
                                textDecoration: 'none',
                                fontSize: '0.95rem',
                                fontWeight: 600,
                                boxShadow: '0 8px 32px rgba(88, 101, 242, 0.3)',
                                transition: 'transform 0.2s, box-shadow 0.2s',
                            }}
                        >
                            ← Kembali ke Beranda
                        </a>
                    </div>

                    {/* Footer */}
                    <div
                        style={{
                            marginTop: '60px',
                            paddingTop: '24px',
                            borderTop: '1px solid rgba(255, 255, 255, 0.1)',
                            width: '100%',
                            maxWidth: '600px',
                        }}
                    >
                        <p style={{ color: 'rgba(255, 255, 255, 0.3)', fontSize: '0.8rem', margin: 0 }}>
                            Protected by SteamKotakLegends Security
                        </p>
                    </div>
                </div>
            </body>
        </html>
    );
}
