// Discord/Lanyard Types

export interface DiscordUser {
    id: string;
    username: string;
    avatar: string;
    global_name: string;
    display_name: string;
    avatar_decoration_data?: {
        asset: string;
    };
    primary_guild?: {
        tag: string;
        identity_guild_id: string;
        badge: string;
        identity_enabled: boolean;
    };
}

export interface Activity {
    name: string;
    type: number;
    state?: string;
    details?: string;
    assets?: {
        large_image?: string;
        large_text?: string;
        small_image?: string;
        small_text?: string;
    };
}

export interface SpotifyData {
    song: string;
    artist: string;
    album_art_url: string;
}

export interface LanyardData {
    discord_user: DiscordUser;
    discord_status: 'online' | 'idle' | 'dnd' | 'offline';
    activities: Activity[];
    listening_to_spotify: boolean;
    spotify?: SpotifyData;
}

export interface LanyardResponse {
    success: boolean;
    data: LanyardData;
}

export interface Developer {
    name: string;
    discordId: string;
    role: string;
    gradient: string;
    lanyard?: LanyardData;
}

// Developer configuration
export const DEVELOPERS: Omit<Developer, 'lanyard'>[] = [
    {
        name: 'AMWP',
        discordId: '481734993622728715',
        role: 'Lead Developer',
        gradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    },
    {
        name: 'KizuTOD',
        discordId: '403425777833738240',
        role: 'Developer',
        gradient: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
    },
];

// Status colors
export const STATUS_COLORS: Record<string, string> = {
    online: '#43b581',
    idle: '#faa61a',
    dnd: '#f04747',
    offline: '#747f8d',
};

// Helper functions
export function getAvatarUrl(user: DiscordUser): string {
    if (!user.avatar) {
        return `https://cdn.discordapp.com/embed/avatars/${Number(user.id) % 5}.png`;
    }
    // Use size=64 for 48px display (1.33x for retina), avoid GIFs for performance
    const ext = 'webp'; // Always use WebP for smaller size
    return `https://cdn.discordapp.com/avatars/${user.id}/${user.avatar}.${ext}?size=64`;
}

export function getDecorationUrl(user: DiscordUser): string | null {
    if (!user.avatar_decoration_data?.asset) return null;
    const asset = user.avatar_decoration_data.asset;
    // Use size=80 for 64px display, WebP for smaller size
    return `https://cdn.discordapp.com/avatar-decoration-presets/${asset}.png?size=80&passthrough=true`;
}

export function getClanBadgeUrl(user: DiscordUser): string | null {
    if (!user.primary_guild?.identity_guild_id || !user.primary_guild?.badge) return null;
    const { identity_guild_id, badge } = user.primary_guild;
    return `https://cdn.discordapp.com/clan-badges/${identity_guild_id}/${badge}.png?size=32`;
}
