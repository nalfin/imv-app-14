'use client'

import { Loader2 } from 'lucide-react'

export function FullScreenLoader() {
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
            <div className="flex flex-col items-center space-y-3 text-white">
                <Loader2 className="h-8 w-8 animate-spin" />
                <span className="font-mono text-sm">Loading data...</span>
            </div>
        </div>
    )
}
