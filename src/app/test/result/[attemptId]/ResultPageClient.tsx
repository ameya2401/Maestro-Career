"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

type Result = {
    id: string;
    attempt_id: string;
    user_id: string;
    bank_version: string;
    score_version: string;
    aptitude_index: number;
    psychometric_index: number;
    overall_index: number;
    career_matches: Array<{ id: string; title: string; score: number; bucket?: string }>;
    summary: {
        areasRequiringImprovement?: Array<{ dimension: string; score: number }>;
    };
    created_at: string;
};

type ApiResponse = {
    success: boolean;
    data?: Result;
    message?: string;
};

function formatIndex(value: number) {
    const clamped = Math.max(0, Math.min(100, value));
    return `${Math.round(clamped)}%`;
}

export default function ResultPageClient({ attemptId }: { attemptId: string }) {
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [result, setResult] = useState<Result | null>(null);

    useEffect(() => {
        (async () => {
            setLoading(true);
            setError("");

            try {
                const resp = await fetch(`/api/test/result/${attemptId}`, { cache: "no-store" });
                const data: ApiResponse = await resp.json();

                if (!resp.ok || !data.success || !data.data) {
                    throw new Error(data.message || "Unable to load result.");
                }

                setResult(data.data);
            } catch (e) {
                setError(e instanceof Error ? e.message : "Unable to load result.");
            } finally {
                setLoading(false);
            }
        })();
    }, [attemptId]);

    const topMatches = useMemo(() => {
        if (!result?.career_matches) return [];
        return result.career_matches.slice(0, 5);
    }, [result?.career_matches]);

    return (
        <main className="min-h-screen bg-background text-foreground transition-colors duration-500">
            <Header />

            <section className="py-14 md:py-20">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="max-w-5xl mx-auto space-y-6">
                        <div className="rounded-3xl border border-border/20 bg-card p-8 shadow-sm">
                            <h1 className="text-2xl md:text-3xl font-bold">Assessment Result</h1>
                            <p className="text-sm text-foreground/60 mt-2">Attempt ID: {attemptId}</p>

                            {loading && <p className="mt-6 text-sm text-foreground/60">Loading...</p>}

                            {error && (
                                <div className="mt-6 rounded-xl border border-destructive/20 bg-destructive/10 px-4 py-3 text-sm font-medium text-destructive">
                                    {error}
                                </div>
                            )}

                            {result && (
                                <div className="mt-8 grid md:grid-cols-3 gap-4">
                                    {[{ label: "Aptitude", value: result.aptitude_index }, { label: "Psychometric", value: result.psychometric_index }, { label: "Overall", value: result.overall_index }].map((item) => (
                                        <div key={item.label} className="rounded-2xl border border-border/20 bg-background p-6">
                                            <p className="text-xs font-medium text-foreground/50">{item.label}</p>
                                            <p className="text-2xl font-bold text-primary mt-1">{formatIndex(item.value)}</p>
                                        </div>
                                    ))}
                                </div>
                            )}

                            {result && topMatches.length > 0 && (
                                <div className="mt-8 rounded-2xl border border-border/20 bg-background p-6">
                                    <h2 className="text-lg font-semibold">Top career matches</h2>
                                    <div className="mt-4 grid gap-3">
                                        {topMatches.map((m) => (
                                            <div key={m.id} className="flex items-center justify-between rounded-xl border border-border/20 bg-card px-4 py-3">
                                                <p className="text-sm font-medium">{m.title}</p>
                                                <p className="text-sm font-semibold text-foreground/70">{Math.round(m.score)}%</p>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {result && result.summary?.areasRequiringImprovement?.length ? (
                                <div className="mt-8 rounded-2xl border border-border/20 bg-background p-6">
                                    <h2 className="text-lg font-semibold">Areas to improve</h2>
                                    <div className="mt-4 grid gap-3">
                                        {result.summary.areasRequiringImprovement.slice(0, 8).map((item) => (
                                            <div
                                                key={item.dimension}
                                                className="flex items-center justify-between rounded-xl border border-border/20 bg-card px-4 py-3"
                                            >
                                                <p className="text-sm font-medium">{item.dimension}</p>
                                                <p className="text-sm font-semibold text-foreground/70">{Math.round(item.score)}%</p>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            ) : null}

                            <div className="mt-10 flex flex-col sm:flex-row gap-3">
                                <Link
                                    href="/dashboard"
                                    className="inline-flex items-center justify-center rounded-xl bg-background border border-border/20 hover:border-border/40 px-6 py-3 text-sm font-medium transition-colors"
                                >
                                    Back to dashboard
                                </Link>
                                <Link
                                    href="/test"
                                    className="inline-flex items-center justify-center rounded-xl bg-primary hover:bg-primary/90 text-primary-foreground px-6 py-3 text-sm font-medium transition-colors"
                                >
                                    Go to assessment
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <Footer />
        </main>
    );
}
