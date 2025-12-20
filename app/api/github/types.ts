// GitHub Release Types

export interface ReleaseAsset {
    name: string;
    browser_download_url: string;
    size: number;
    download_count: number;
}

export interface ReleaseInfo {
    tag_name: string;
    name: string;
    published_at: string;
    assets: ReleaseAsset[];
}

export interface ReleaseData {
    downloadUrl: string;
    version: string;
    fileSize: string;
    fileSizeBytes: number;
    downloadCount: number;
    releaseName: string;
    publishedAt: string;
}

// GitHub API configuration
export const GITHUB_REPO = 'ItzApipAjalah/SteamKotakLegends';
export const GITHUB_API_URL = `https://api.github.com/repos/${GITHUB_REPO}/releases/latest`;
export const GITHUB_RELEASES_URL = `https://github.com/${GITHUB_REPO}/releases`;

// Stats configuration
export const DOWNLOAD_STATS = [
    { id: 'opensource', label: 'Open Source', color: '#8b5cf6' },
    { id: 'secure', label: 'Safe & Secure', color: '#10b981' },
] as const;

// Helper functions
export function formatFileSize(bytes: number): string {
    const mb = bytes / (1024 * 1024);
    return `${mb.toFixed(1)} MB`;
}

export function formatDownloadCount(count: number): string {
    if (count >= 1000) {
        return `${(count / 1000).toFixed(1)}K`;
    }
    return count.toString();
}
