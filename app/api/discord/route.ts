import { NextResponse } from 'next/server';
import { DEVELOPERS, LanyardResponse, LanyardData } from './types';

const LANYARD_API_URL = 'https://lanyard.afifmedya.my.id/v1/users';

async function fetchLanyardData(discordId: string): Promise<LanyardData | null> {
    try {
        const response = await fetch(`${LANYARD_API_URL}/${discordId}`, {
            next: { revalidate: 30 }, // Cache for 30 seconds
        });

        // Return null for any non-ok response (including 530, 500, etc.)
        if (!response.ok) {
            return null;
        }

        const data: LanyardResponse = await response.json();

        if (data.success && data.data) {
            return data.data;
        }

        return null;
    } catch {
        // Silently return null on any error
        return null;
    }
}


export async function GET() {
    try {
        const developersWithLanyard = await Promise.all(
            DEVELOPERS.map(async (dev) => {
                const lanyard = await fetchLanyardData(dev.discordId);
                return {
                    ...dev,
                    lanyard,
                };
            })
        );

        return NextResponse.json({
            success: true,
            developers: developersWithLanyard,
            timestamp: Date.now(),
        });
    } catch (error) {
        console.error('Error in Discord API:', error);
        return NextResponse.json(
            {
                success: false,
                error: 'Failed to fetch Discord data',
                developers: DEVELOPERS.map(dev => ({ ...dev, lanyard: null })),
            },
            { status: 500 }
        );
    }
}
