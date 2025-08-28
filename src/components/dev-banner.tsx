'use client';

import { AlertTriangle } from 'lucide-react';

export function DevBanner() {
    return (
        <div className="bg-destructive text-destructive-foreground text-center p-2 text-sm font-bold flex items-center justify-center gap-2">
            <AlertTriangle className="h-5 w-5 animate-pulse" />
            <span>Сайтът е в процес на разработка. Всички информационни блокове ще бъда актуализирани в най-скоро време!</span>
        </div>
    )
}
