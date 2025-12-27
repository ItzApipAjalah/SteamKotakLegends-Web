'use client';

import { ContextMenu } from '@/components';

interface ContextMenuProviderProps {
    children: React.ReactNode;
}

export default function ContextMenuProvider({ children }: ContextMenuProviderProps) {
    return <ContextMenu>{children}</ContextMenu>;
}
