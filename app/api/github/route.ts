import { NextResponse } from 'next/server';
import {
    GITHUB_API_URL,
    GITHUB_RELEASES_URL,
    ReleaseInfo,
    ReleaseData,
    formatFileSize
} from './types';

export async function GET() {
    try {
        const response = await fetch(GITHUB_API_URL, {
            next: { revalidate: 300 }, // Cache for 5 minutes
            headers: {
                'Accept': 'application/vnd.github.v3+json',
            },
        });

        if (!response.ok) {
            throw new Error(`GitHub API error: ${response.status}`);
        }

        const data: ReleaseInfo = await response.json();

        // Find the .exe installer asset
        const exeAsset = data.assets.find(asset => asset.name.endsWith('.exe'));

        if (!exeAsset) {
            // Return fallback data if no .exe found
            return NextResponse.json({
                success: true,
                data: {
                    downloadUrl: GITHUB_RELEASES_URL,
                    version: data.tag_name,
                    fileSize: 'N/A',
                    fileSizeBytes: 0,
                    downloadCount: 0,
                    releaseName: data.name,
                    publishedAt: data.published_at,
                } as ReleaseData,
            });
        }

        const releaseData: ReleaseData = {
            downloadUrl: exeAsset.browser_download_url,
            version: data.tag_name,
            fileSize: formatFileSize(exeAsset.size),
            fileSizeBytes: exeAsset.size,
            downloadCount: exeAsset.download_count,
            releaseName: data.name,
            publishedAt: data.published_at,
        };

        return NextResponse.json({
            success: true,
            data: releaseData,
            timestamp: Date.now(),
        });
    } catch (error) {
        console.error('Error fetching GitHub release:', error);

        return NextResponse.json(
            {
                success: false,
                error: 'Failed to fetch release data',
                data: {
                    downloadUrl: GITHUB_RELEASES_URL,
                    version: '',
                    fileSize: '',
                    fileSizeBytes: 0,
                    downloadCount: 0,
                    releaseName: '',
                    publishedAt: '',
                } as ReleaseData,
            },
            { status: 500 }
        );
    }
}
