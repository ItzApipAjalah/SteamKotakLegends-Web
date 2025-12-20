declare module 'detect-gpu-js' {
    export interface GPUTierResult {
        tier: number;
        type: string;
        isMobile: boolean;
        gpu: string | undefined;
    }

    export function getGPUTier(): Promise<GPUTierResult | null>;
}
