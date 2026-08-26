"use client";

import { Download, ShieldCheck } from "lucide-react";

interface ReportHeaderProps {
    isPrinting?: boolean;
    resultId?: string;
}

export default function ReportHeader({ isPrinting = false, resultId }: ReportHeaderProps) {
    if (isPrinting) return null;

    const handleDownload = () => {
        // Redirect to the specialized print view which will auto-trigger window.print()
        const currentId = resultId || new URLSearchParams(window.location.search).get('resultId') || 'latest';
        window.location.href = `/report?resultId=${currentId}&print=true`;
    };

    return (
        <header className="no-print fixed top-0 left-0 right-0 z-50 py-4 px-8 bg-[#030712]/80 backdrop-blur-md border-b border-white/5 flex justify-between items-center">
            <div className="flex items-center gap-3">
                <div className="text-xl font-bold tracking-tighter text-white">MAESTRO<span className="text-primary">CAREER</span></div>
                <div className="h-4 w-[1px] bg-white/20 mx-2" />
                <div className="text-xs uppercase font-bold text-white/40 tracking-[0.3em]">Intelligence Unit</div>
            </div>

            <div className="flex items-center gap-6">
                <div className="hidden md:flex items-center gap-2 text-xs uppercase font-bold text-emerald-500">
                    <ShieldCheck size={14} />
                    Verified Assessment
                </div>

                <button
                    onClick={handleDownload}
                    className="flex items-center gap-2 bg-white text-[#030712] px-6 py-2 rounded-full text-[12px] font-bold tracking-wider transition-all hover:bg-primary hover:text-white shadow-xl active:scale-95"
                >
                    <Download size={14} />
                    Download Intelligence Report
                </button>
            </div>
        </header>
    );
}
