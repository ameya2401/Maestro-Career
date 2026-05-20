"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

type GrantStatus = {
    status: "active" | "revoked";
    bankVersion: string;
    grantedAt: string;
};

type AttemptStatus = "in_progress" | "submitted" | "expired";

type Attempt = {
    id: string;
    bank_version: string;
    status: AttemptStatus;
    score_version: string;
    time_limit_seconds: number;
    started_at: string;
    expires_at: string;
    last_activity_at: string;
    submitted_at: string | null;
};

type QuestionOption = { id: string; label: string; text: string };

type Question = {
    id: string;
    section: "A" | "B";
    category: string;
    prompt: string;
    options: QuestionOption[];
};

type AccessResponse = {
    success: boolean;
    authenticated: boolean;
    grant: GrantStatus | null;
    attempt: Attempt | null;
    latestAttempt: Attempt | null;
    latestResultId?: string | null;
    finalized: { attemptId: string; resultId: string } | null;
    serverTime: string;
    message?: string;
};

type StartResponse = {
    success: boolean;
    attempt?: Attempt;
    questions?: Question[];
    responses?: Record<string, string | null>;
    serverTime?: string;
    message?: string;
    code?: string;
    attemptId?: string;
    resultId?: string;
};

type SaveResponse = {
    success: boolean;
    code?: string;
    message?: string;
    attemptId?: string;
    resultId?: string;
};

function formatSeconds(totalSeconds: number) {
    const seconds = Math.max(0, Math.floor(totalSeconds));
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${String(s).padStart(2, "0")}`;
}

export default function TestPageClient() {
    const router = useRouter();

    const [loading, setLoading] = useState(true);
    const [starting, setStarting] = useState(false);
    const [saving, setSaving] = useState(false);
    const [submitting, setSubmitting] = useState(false);

    const [error, setError] = useState("");

    const [grant, setGrant] = useState<GrantStatus | null>(null);
    const [attempt, setAttempt] = useState<Attempt | null>(null);
    const [latestAttempt, setLatestAttempt] = useState<Attempt | null>(null);
    const [latestResultId, setLatestResultId] = useState<string | null>(null);

    const [questions, setQuestions] = useState<Question[]>([]);
    const [responses, setResponses] = useState<Record<string, string | null>>({});
    const [activeIndex, setActiveIndex] = useState(0);

    const serverOffsetMsRef = useRef(0);
    const autoSubmitFiredRef = useRef(false);

    const expiresAtMs = useMemo(() => {
        if (!attempt?.expires_at) return null;
        return new Date(attempt.expires_at).getTime();
    }, [attempt?.expires_at]);

    const [remainingSeconds, setRemainingSeconds] = useState<number | null>(null);

    const activeQuestion = questions[activeIndex] ?? null;

    const answeredCount = useMemo(() => {
        if (!questions.length) return 0;
        return questions.reduce((acc, q) => acc + (responses[q.id] ? 1 : 0), 0);
    }, [questions, responses]);

    const loadAccess = useCallback(async () => {
        setError("");
        const resp = await fetch("/api/test/access", { cache: "no-store" });
        const data: AccessResponse = await resp.json();

        if (!resp.ok || !data.success) {
            throw new Error(data.message || "Unable to check access.");
        }

        if (!data.authenticated) {
            router.replace("/login?next=/test");
            return;
        }

        setGrant(data.grant);
        setAttempt(data.attempt);
        setLatestAttempt(data.latestAttempt);
        setLatestResultId(data.latestResultId ?? null);

        if (data.finalized?.attemptId) {
            router.replace(`/test/result/${data.finalized.attemptId}`);
            return;
        }

        const serverNow = new Date(data.serverTime).getTime();
        serverOffsetMsRef.current = serverNow - Date.now();
    }, [router]);

    useEffect(() => {
        (async () => {
            try {
                await loadAccess();
            } catch (e) {
                setError(e instanceof Error ? e.message : "Unable to load test access.");
            } finally {
                setLoading(false);
            }
        })();
    }, [loadAccess]);

    useEffect(() => {
        if (!expiresAtMs) {
            setRemainingSeconds(null);
            return;
        }

        const tick = () => {
            const now = Date.now() + serverOffsetMsRef.current;
            const remaining = Math.max(0, Math.floor((expiresAtMs - now) / 1000));
            setRemainingSeconds(remaining);

            if (remaining === 0 && attempt?.id && attempt.status === "in_progress") {
                if (!autoSubmitFiredRef.current) {
                    autoSubmitFiredRef.current = true;
                    void handleSubmit(attempt.id);
                }
            }
        };

        tick();
        const id = window.setInterval(tick, 1000);
        return () => window.clearInterval(id);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [expiresAtMs, attempt?.id, attempt?.status]);

    useEffect(() => {
        autoSubmitFiredRef.current = false;
    }, [attempt?.id]);

    const startOrResume = useCallback(async () => {
        setStarting(true);
        setError("");

        try {
            const resp = await fetch("/api/test/start", { method: "POST" });
            const data: StartResponse = await resp.json();

            if (resp.status === 409 && data?.code === "already_completed" && data.attemptId) {
                router.replace(`/test/result/${data.attemptId}`);
                return;
            }

            if (!resp.ok || !data.success || !data.attempt || !data.questions || !data.responses || !data.serverTime) {
                throw new Error(data.message || "Unable to start assessment.");
            }

            setAttempt(data.attempt);
            setQuestions(data.questions);
            setResponses(data.responses);
            setActiveIndex(0);

            const serverNow = new Date(data.serverTime).getTime();
            serverOffsetMsRef.current = serverNow - Date.now();
        } catch (e) {
            setError(e instanceof Error ? e.message : "Unable to start assessment.");
        } finally {
            setStarting(false);
        }
    }, [router]);

    const saveTimeoutRef = useRef<number | null>(null);

    const saveAnswer = useCallback(
        async (questionId: string, optionId: string | null) => {
            if (!attempt?.id) return;

            if (saveTimeoutRef.current) {
                window.clearTimeout(saveTimeoutRef.current);
            }

            saveTimeoutRef.current = window.setTimeout(async () => {
                setSaving(true);
                try {
                    const resp = await fetch("/api/test/response", {
                        method: "PATCH",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({ attemptId: attempt.id, questionId, optionId }),
                    });
                    const data: SaveResponse = await resp.json();

                    if (resp.status === 409 && data?.code === "expired" && data.attemptId) {
                        router.replace(`/test/result/${data.attemptId}`);
                        return;
                    }

                    if (!resp.ok || !data.success) {
                        throw new Error(data.message || "Unable to save response.");
                    }
                } catch (e) {
                    setError(e instanceof Error ? e.message : "Unable to save response.");
                } finally {
                    setSaving(false);
                }
            }, 250);
        },
        [attempt?.id, router],
    );

    const handleSelect = useCallback(
        (questionId: string, optionId: string) => {
            setResponses((prev) => ({ ...prev, [questionId]: optionId }));
            void saveAnswer(questionId, optionId);
        },
        [saveAnswer],
    );

    const handleSubmit = useCallback(
        async (attemptId: string) => {
            if (submitting) return;

            setSubmitting(true);
            setError("");

            try {
                const resp = await fetch("/api/test/submit", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ attemptId }),
                });
                const data = await resp.json();

                if (!resp.ok || !data.success || !data.attemptId) {
                    throw new Error(data.message || "Unable to submit.");
                }

                router.replace(`/test/result/${data.attemptId}`);
            } catch (e) {
                setError(e instanceof Error ? e.message : "Unable to submit.");
            } finally {
                setSubmitting(false);
            }
        },
        [router, submitting],
    );

    const progressLabel = useMemo(() => {
        if (!questions.length) return "";
        return `${answeredCount}/${questions.length} answered`;
    }, [answeredCount, questions.length]);

    const canStart = grant?.status === "active";

    return (
        <main className="min-h-screen bg-background text-foreground transition-colors duration-500">
            <Header />

            <section className="py-14 md:py-20">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="max-w-5xl mx-auto space-y-6">
                        <div className="rounded-3xl border border-border/20 bg-card p-8 shadow-sm">
                            <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                                <div>
                                    <h1 className="text-2xl md:text-3xl font-bold">Internal Career Assessment</h1>
                                    <p className="text-sm text-foreground/60 mt-2">
                                        This assessment is available only after an admin grant.
                                    </p>
                                </div>

                                {attempt?.status === "in_progress" && remainingSeconds !== null && (
                                    <div className="rounded-2xl border border-border/20 bg-background px-5 py-3 text-center">
                                        <p className="text-xs font-medium text-foreground/60">Time left</p>
                                        <p className="text-xl font-bold text-primary">{formatSeconds(remainingSeconds)}</p>
                                    </div>
                                )}
                            </div>

                            {error && (
                                <div className="mt-6 rounded-xl border border-destructive/20 bg-destructive/10 px-4 py-3 text-sm font-medium text-destructive">
                                    {error}
                                </div>
                            )}

                            {loading && (
                                <div className="mt-8 text-sm text-foreground/60">Loading...</div>
                            )}

                            {!loading && !canStart && (
                                <div className="mt-8 rounded-2xl border border-border/20 bg-background p-6">
                                    <h2 className="text-lg font-semibold">Awaiting access</h2>
                                    <p className="text-sm text-foreground/60 mt-2">
                                        Your account does not have access to the internal assessment yet. Please contact support.
                                    </p>
                                </div>
                            )}

                            {!loading && canStart && questions.length === 0 && (
                                <div className="mt-8 flex flex-col sm:flex-row gap-3">
                                    <button
                                        type="button"
                                        onClick={startOrResume}
                                        disabled={starting}
                                        className="rounded-xl bg-primary hover:bg-primary/90 text-primary-foreground px-6 py-3 text-sm font-medium transition-colors disabled:opacity-70"
                                    >
                                        {attempt?.status === "in_progress" ? (starting ? "Resuming..." : "Resume") : starting ? "Starting..." : "Start"}
                                    </button>

                                    {latestAttempt && (latestAttempt.status === "submitted" || latestAttempt.status === "expired") && latestResultId && (
                                        <button
                                            type="button"
                                            onClick={() => router.push(`/test/result/${latestAttempt.id}`)}
                                            className="rounded-xl bg-background border border-border/20 hover:border-border/40 px-6 py-3 text-sm font-medium transition-colors"
                                        >
                                            View latest result
                                        </button>
                                    )}
                                </div>
                            )}
                        </div>

                        {questions.length > 0 && attempt?.status === "in_progress" && activeQuestion && (
                            <div className="rounded-3xl border border-border/20 bg-card p-8 shadow-sm">
                                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                                    <div>
                                        <p className="text-xs font-medium text-foreground/50">Progress</p>
                                        <p className="text-sm font-semibold text-foreground">{progressLabel}</p>
                                    </div>
                                    <div className="flex items-center gap-3 text-sm">
                                        {(saving || submitting) && (
                                            <span className="text-foreground/60">{submitting ? "Submitting..." : "Saving..."}</span>
                                        )}
                                        <button
                                            type="button"
                                            onClick={() => handleSubmit(attempt.id)}
                                            disabled={submitting}
                                            className="rounded-xl bg-primary hover:bg-primary/90 text-primary-foreground px-6 py-2.5 text-sm font-medium transition-colors disabled:opacity-70"
                                        >
                                            Submit
                                        </button>
                                    </div>
                                </div>

                                <div className="mt-8">
                                    <p className="text-xs font-medium text-foreground/50">
                                        Question {activeIndex + 1} of {questions.length}
                                    </p>
                                    <h2 className="text-lg md:text-xl font-semibold text-foreground mt-2">
                                        {activeQuestion.prompt}
                                    </h2>

                                    <div className="mt-6 grid gap-3">
                                        {activeQuestion.options.map((opt) => {
                                            const selected = responses[activeQuestion.id] === opt.id;
                                            return (
                                                <button
                                                    key={opt.id}
                                                    type="button"
                                                    onClick={() => handleSelect(activeQuestion.id, opt.id)}
                                                    className={`text-left rounded-2xl border px-5 py-4 transition-colors ${selected
                                                            ? "border-primary bg-primary/10"
                                                            : "border-border/20 bg-background hover:border-border/40"
                                                        }`}
                                                >
                                                    <div className="flex items-start gap-3">
                                                        <span className={`mt-0.5 inline-flex h-6 w-6 items-center justify-center rounded-lg text-xs font-bold ${selected ? "bg-primary text-primary-foreground" : "bg-card border border-border/20 text-foreground/70"}`}>
                                                            {opt.label}
                                                        </span>
                                                        <div>
                                                            <p className="text-sm font-medium text-foreground">{opt.text}</p>
                                                        </div>
                                                    </div>
                                                </button>
                                            );
                                        })}
                                    </div>

                                    <div className="mt-8 flex items-center justify-between gap-4">
                                        <button
                                            type="button"
                                            onClick={() => setActiveIndex((i) => Math.max(0, i - 1))}
                                            disabled={activeIndex === 0}
                                            className="rounded-xl bg-background border border-border/20 hover:border-border/40 px-5 py-2.5 text-sm font-medium transition-colors disabled:opacity-60"
                                        >
                                            Previous
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => setActiveIndex((i) => Math.min(questions.length - 1, i + 1))}
                                            disabled={activeIndex >= questions.length - 1}
                                            className="rounded-xl bg-background border border-border/20 hover:border-border/40 px-5 py-2.5 text-sm font-medium transition-colors disabled:opacity-60"
                                        >
                                            Next
                                        </button>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </section>

            <Footer />
        </main>
    );
}
