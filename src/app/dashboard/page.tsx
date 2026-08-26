"use client";

import Link from "next/link";
import { FormEvent, useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Script from "next/script";
import { formatInr, getPlanById, PLANS } from "@/data/plans";

import { DashboardData } from "@/lib/auth-supabase";

interface DashboardResponse {
    success: boolean;
    data?: DashboardData;
    message?: string;
}

interface RazorpaySuccessResponse {
    razorpay_payment_id: string;
    razorpay_order_id: string;
    razorpay_signature: string;
}

interface RazorpayOptions {
    key: string;
    amount: number;
    currency: string;
    name: string;
    description: string;
    order_id: string;
    prefill: {
        name: string;
        email: string;
        contact: string;
    };
    theme: {
        color: string;
    };
    handler: (response: RazorpaySuccessResponse) => Promise<void>;
    modal: {
        ondismiss: () => void;
    };
}

type RazorpayCtor = new (options: RazorpayOptions) => { open: () => void };

type InternalTestAccessResponse = {
    success: boolean;
    authenticated: boolean;
    grant: { status: "active" | "revoked"; bankVersion: string; grantedAt: string } | null;
    attempt: { id: string; status: "in_progress" | "submitted" | "expired"; expires_at: string } | null;
    latestAttempt: { id: string; status: "in_progress" | "submitted" | "expired" } | null;
    latestResultId: string | null;
    serverTime: string;
};

const SERVICE_OPTIONS = [
    "Career Coaching",
    "Psychometric Assessment",
    "Interview Prep",
    "Skill Mapping",
    "College Guidance",
];

export default function DashboardPage() {
    const router = useRouter();
    const [loading, setLoading] = useState(true);
    const [savingProfile, setSavingProfile] = useState(false);
    const [error, setError] = useState("");
    const [profileMessage, setProfileMessage] = useState("");
    const [dashboard, setDashboard] = useState<DashboardResponse["data"]>(undefined);
    const [isPaying, setIsPaying] = useState(false);
    const [selectingPlanId, setSelectingPlanId] = useState<string | null>(null);
    const [internalTestAccess, setInternalTestAccess] = useState<InternalTestAccessResponse | null>(null);
    const [internalTestLoading, setInternalTestLoading] = useState(false);
    const [careerGoals, setCareerGoals] = useState({ dream: "", profession: "", education: "" });
    const [savingGoals, setSavingGoals] = useState(false);
    const [goalsMessage, setGoalsMessage] = useState("");

    const selectedPlan = dashboard?.profile.selectedPlanId ? getPlanById(dashboard.profile.selectedPlanId) : null;

    const [onboardingData, setOnboardingData] = useState({
        name: "",
        preferredServices: [] as string[],
        password: "",
    });

    const loadData = useCallback(async () => {
        try {
            const [meResp, accessResp, resultResp] = await Promise.all([
                fetch("/api/auth/me", { method: "GET" }),
                fetch("/api/test/access", { method: "GET" }),
                fetch("/api/test/results/latest", { method: "GET" })
            ]);

            const data: DashboardResponse = await meResp.json();
            const accessData = await accessResp.json();
            const resultData = await resultResp.json();

            if (!meResp.ok || !data.success || !data.data) {
                router.replace("/login");
                return;
            }

            const profile = data.data.profile;
            setDashboard(data.data);
            setInternalTestAccess(accessData);
            if (resultData.success) setInternalTestAccess((prev) => ({ ...(prev ?? {}), latestResultId: resultData.result?.id ?? null } as any));
            setOnboardingData((prev) => ({
                ...prev,
                name: profile.name === "Learner" ? "" : profile.name,
                preferredServices: profile.preferredServices,
            }));
            try {
                if (profile.careerGoals) {
                    const parsed = JSON.parse(profile.careerGoals);
                    setCareerGoals({
                        dream: parsed.dream || "",
                        profession: parsed.profession || "",
                        education: parsed.education || ""
                    });
                }
            } catch (e) { }
        } catch {
            setError("Unable to load dashboard right now.");
        } finally {
            setLoading(false);
        }
    }, [router]);

    const loadInternalTest = useCallback(async () => {
        setInternalTestLoading(true);
        try {
            const resp = await fetch("/api/test/access", { method: "GET", cache: "no-store" });
            const data = (await resp.json()) as InternalTestAccessResponse;
            if (!resp.ok || !data.success) return;
            setInternalTestAccess(data);
        } catch {
            // Ignore internal test status failures to avoid blocking dashboard.
        } finally {
            setInternalTestLoading(false);
        }
    }, []);

    useEffect(() => {
        void loadData();
    }, [loadData]);

    useEffect(() => {
        if (!dashboard) return;
        void loadInternalTest();
    }, [dashboard, loadInternalTest]);

    const handleLogout = async () => {
        await fetch("/api/auth/logout", { method: "POST" });
        router.push("/login");
    };

    const toggleService = (service: string) => {
        setOnboardingData((prev) => {
            const exists = prev.preferredServices.includes(service);
            if (exists) {
                return {
                    ...prev,
                    preferredServices: prev.preferredServices.filter((item) => item !== service),
                };
            }
            if (prev.preferredServices.length >= 5) {
                return prev;
            }
            return {
                ...prev,
                preferredServices: [...prev.preferredServices, service],
            };
        });
    };

    const handleCompleteProfile = async (e: FormEvent) => {
        e.preventDefault();
        setError("");
        setProfileMessage("");
        setSavingProfile(true);

        try {
            const resp = await fetch("/api/auth/profile/setup", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(onboardingData),
            });
            const data = await resp.json();

            if (!resp.ok || !data.success) {
                throw new Error(data.message || "Unable to complete profile.");
            }

            setProfileMessage("Profile setup completed. You can now access everything.");
            await loadData();
        } catch (err) {
            setError(err instanceof Error ? err.message : "Unable to complete profile.");
        } finally {
            setSavingProfile(false);
        }
    };

    const handleSaveGoals = async (e: FormEvent) => {
        e.preventDefault();
        setError("");
        setGoalsMessage("");
        setSavingGoals(true);

        try {
            const resp = await fetch("/api/profile/aspirations", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ career_goals: JSON.stringify(careerGoals) }),
            });
            const data = await resp.json();

            if (!resp.ok || !data.success) {
                throw new Error(data.message || "Unable to save goals.");
            }
            setGoalsMessage("Goals saved successfully.");
            await loadData();
        } catch (err) {
            setGoalsMessage(`Error: ${err instanceof Error ? err.message : "Unable to save goals."}`);
        } finally {
            setSavingGoals(false);
        }
    };

    const handlePayNow = async () => {
        if (!selectedPlan || !dashboard) return;

        setError("");
        const razorpayCtor = (window as Window & { Razorpay?: RazorpayCtor }).Razorpay;
        if (!razorpayCtor) {
            setError("Payment gateway did not load. Please refresh.");
            return;
        }

        setIsPaying(true);

        try {
            const orderResp = await fetch("/api/payments/create-order", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    planId: selectedPlan.id,
                    buyerName: dashboard.profile.name,
                    buyerEmail: dashboard.profile.email,
                    buyerMobile: dashboard.profile.mobile,
                }),
            });

            const orderData = await orderResp.json();
            if (!orderResp.ok || !orderData.success) {
                throw new Error(orderData.message || "Unable to start payment.");
            }

            const options = {
                key: orderData.keyId,
                amount: orderData.order.amount,
                currency: orderData.order.currency,
                name: "Maestro Career",
                description: `${selectedPlan.name} Plan`,
                order_id: orderData.order.id,
                prefill: {
                    name: dashboard.profile.name,
                    email: dashboard.profile.email,
                    contact: dashboard.profile.mobile,
                },
                theme: { color: "#1294DD" },
                handler: async function (response: RazorpaySuccessResponse) {
                    try {
                        const verifyResp = await fetch("/api/payments/verify", {
                            method: "POST",
                            headers: { "Content-Type": "application/json" },
                            body: JSON.stringify(response),
                        });
                        const verifyData = await verifyResp.json();

                        if (verifyResp.ok && verifyData.success) {
                            await loadData();
                        } else {
                            throw new Error(verifyData.message || "Verification failed.");
                        }
                    } catch (err) {
                        setError(err instanceof Error ? err.message : "Payment verification failed.");
                    } finally {
                        setIsPaying(false);
                    }
                },
                modal: {
                    ondismiss: function () {
                        setIsPaying(false);
                    }
                }
            };

            const razorpay = new razorpayCtor(options);
            razorpay.open();
        } catch (err) {
            setError(err instanceof Error ? err.message : "Could not start payment.");
            setIsPaying(false);
        }
    };

    const handleSelectPlan = async (planId: string) => {
        setError("");
        setSelectingPlanId(planId);

        try {
            const resp = await fetch("/api/profile/select-plan", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ planId }),
            });
            const data = await resp.json();

            if (!resp.ok || !data.success) {
                throw new Error(data.message || "Unable to select plan.");
            }

            // Redirect to payment/checkout page instead of just reloading data
            router.push(`/checkout/${planId}`);
        } catch (planError) {
            setError(planError instanceof Error ? planError.message : "Unable to select plan.");
            setSelectingPlanId(null);
        }
    };

    const internalGrantActive = internalTestAccess?.grant?.status === "active";
    const internalInProgress = internalTestAccess?.attempt?.status === "in_progress";
    const internalCompletedAttemptId =
        internalTestAccess?.latestAttempt &&
            (internalTestAccess.latestAttempt.status === "submitted" || internalTestAccess.latestAttempt.status === "expired")
            ? internalTestAccess.latestAttempt.id
            : null;

    const latestResult = (internalTestAccess as any)?.latestResultId ?? null;

    return (
        <main className="min-h-screen bg-background text-foreground transition-colors duration-500">
            <Script src="https://checkout.razorpay.com/v1/checkout.js" strategy="afterInteractive" />
            <Header />

            <section className="py-14 md:py-20">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                    {loading && (
                        <div className="max-w-4xl mx-auto rounded-3xl border border-border/20 bg-card p-12 text-center shadow-sm animate-pulse">
                            <div className="flex flex-col items-center gap-4">
                                <p className="text-foreground/60 font-medium text-sm">Loading your dashboard...</p>
                            </div>
                        </div>
                    )}

                    {!loading && error && (
                        <div className="max-w-4xl mx-auto rounded-3xl border border-destructive/20 bg-destructive/10 p-8 text-destructive text-center">
                            <h3 className="text-lg font-semibold mb-2">Error loading data</h3>
                            <p className="text-sm opacity-80">{error}</p>
                            <button onClick={loadData} className="mt-6 px-6 py-2.5 bg-destructive text-destructive-foreground rounded-lg text-sm font-medium hover:bg-destructive/90 transition-colors">Try again</button>
                        </div>
                    )}

                    {!loading && dashboard && (
                        <div className="max-w-7xl mx-auto space-y-8">
                            {/* Top Header Card */}
                            <div className="rounded-3xl border border-border/20 bg-card p-6 md:p-8 flex flex-col md:flex-row md:items-center md:justify-between gap-6 relative overflow-hidden transition-all shadow-sm w-full">
                                <div className="relative z-10 flex flex-col items-start gap-2">
                                    <h1 className="text-2xl md:text-3xl font-bold text-foreground">
                                        Welcome, <span className="text-primary">{dashboard.profile.name}</span>
                                    </h1>
                                    <p className="text-foreground/60 text-sm">Manage your profile, assessments, and services.</p>
                                </div>
                                <button
                                    type="button"
                                    onClick={handleLogout}
                                    className="relative z-10 rounded-xl bg-background border border-border/20 hover:border-border/20 text-foreground px-6 py-2.5 text-sm font-medium transition-colors flex items-center gap-2"
                                >
                                    Logout
                                </button>
                            </div>

                            {/* Plan and Assessment Section */}
                            <div className="grid lg:grid-cols-2 gap-8">
                                {dashboard.profile.selectedPlanId ? (
                                    <div className="rounded-3xl border border-border/20 bg-card p-8 flex flex-col justify-between shadow-sm relative overflow-hidden">
                                        <div className="relative z-10">
                                            <div className="flex items-center gap-3 justify-start mb-6">
                                                <h2 className="text-lg font-semibold text-foreground">Current Plan</h2>
                                            </div>
                                            <h3 className="text-2xl font-bold text-foreground mb-4">{selectedPlan?.name}</h3>

                                            <div className="mt-6 flex flex-col sm:flex-row items-start sm:items-center justify-between bg-background border border-border/20 rounded-2xl p-6 gap-4">
                                                <div>
                                                    <p className="text-xs font-medium text-foreground/50 mb-1">Total Fee</p>
                                                    <p className="text-xl font-bold text-primary">{formatInr(selectedPlan?.priceInr || 0)}</p>
                                                </div>
                                                <div className="text-left sm:text-right">
                                                    <p className="text-xs font-medium text-foreground/50 mb-1">Status</p>
                                                    <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-semibold uppercase ${dashboard.profile.paymentStatus === 'paid' ? 'bg-emerald-500/10 text-emerald-600 border border-emerald-500/20' : 'bg-rose-500/10 text-rose-600 border border-rose-500/20'}`}>
                                                        {dashboard.profile.paymentStatus || 'UNPAID'}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="mt-8 relative z-10">
                                            {dashboard.profile.paymentStatus === 'paid' ? (
                                                <div className="flex items-center gap-3 text-emerald-600 font-medium bg-emerald-500/5 rounded-xl p-4 justify-center border border-emerald-500/20">
                                                    <span className="text-sm">Payment Verified</span>
                                                </div>
                                            ) : (
                                                <button
                                                    onClick={handlePayNow}
                                                    disabled={isPaying}
                                                    className="w-full rounded-xl bg-primary hover:bg-primary/90 text-primary-foreground font-medium text-sm py-4 transition-colors disabled:opacity-70"
                                                >
                                                    {isPaying ? "Loading gateway..." : "Pay Now"}
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                ) : (
                                    <div className="rounded-3xl border border-border/20 bg-card p-10 flex flex-col text-center shadow-sm">
                                        <h3 className="text-xl font-semibold text-foreground mb-2">No Plan Selected</h3>
                                        <p className="text-foreground/60 text-sm max-w-sm mx-auto mb-8">Select a plan from below. Once selected, you&apos;ll be able to proceed with payment.</p>

                                        <div className="grid sm:grid-cols-3 gap-4 text-left mb-6">
                                            {PLANS.map((plan) => {
                                                const active = selectingPlanId === plan.id;
                                                return (
                                                    <div key={plan.id} className="rounded-2xl border border-border/20 bg-background p-4 flex flex-col gap-3">
                                                        <div>
                                                            <p className="text-sm font-semibold text-foreground">{plan.name}</p>
                                                            <p className="text-xs text-foreground/60 mt-1">{formatInr(plan.priceInr)}</p>
                                                        </div>
                                                        <button
                                                            type="button"
                                                            onClick={() => handleSelectPlan(plan.id)}
                                                            disabled={!!selectingPlanId}
                                                            className="rounded-lg bg-primary text-primary-foreground px-3 py-2 text-xs font-medium hover:bg-primary/90 transition-colors disabled:opacity-60 text-center"
                                                        >
                                                            {active ? "Selecting..." : "Select"}
                                                        </button>
                                                    </div>
                                                );
                                            })}
                                        </div>

                                        <Link href="/#pricing" className="text-sm text-primary hover:text-primary/80 font-medium inline-flex items-center justify-center gap-1">
                                            Compare full plan details &rarr;
                                        </Link>
                                    </div>
                                )}

                                {latestResult && (
                                    <div className="rounded-3xl border border-emerald-500/20 bg-emerald-500/5 p-8 flex flex-col justify-between relative overflow-hidden shadow-sm">
                                        <div className="relative z-10">
                                            <div className="flex items-center gap-3 justify-start mb-4">
                                                <h2 className="text-lg font-bold text-foreground">Intelligence Analysis</h2>
                                            </div>
                                            <div className="space-y-1 mb-6">
                                                <div className="text-xs uppercase font-bold tracking-widest opacity-70">Your Archetype</div>
                                                <div className="text-xl font-bold text-emerald-600 tracking-tight">{(internalTestAccess as any)?.archetypeTitle ?? 'N/A'}</div>
                                            </div>
                                            <p className="text-sm text-foreground/60 leading-relaxed mb-8">
                                                Your comprehensive psychometric dossier is ready. Review your multi-dimensional career DNA and strategic roadmap.
                                            </p>
                                        </div>
                                        <div className="relative z-10 mt-auto flex flex-col gap-2">
                                            <Link
                                                href={`/report?resultId=${latestResult}`}
                                                className="w-full inline-flex items-center justify-center rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-[14px] py-4 shadow-lg shadow-emerald-900/20 transition-all active:scale-[0.98]"
                                            >
                                                View Intelligence Dossier &rarr;
                                            </Link>
                                            <a
                                                href={`/api/generate-report?resultId=${latestResult}`}
                                                target="_blank"
                                                className="text-center text-sm font-semibold tracking-wide opacity-70 hover:opacity-100 transition-opacity py-2"
                                            >
                                                Download PDF (High Fidelity)
                                            </a>
                                        </div>
                                    </div>
                                )}

                                {internalTestAccess?.grant?.status === 'active' || dashboard.profile.psychometricTestLink ? (
                                    <div className={`rounded-3xl border border-primary/20 bg-primary/5 p-8 flex flex-col justify-between relative overflow-hidden shadow-sm ${latestResult ? 'opacity-60 scale-95' : ''}`}>
                                        <div className="relative z-10">
                                            <div className="flex items-center gap-3 justify-start mb-4">
                                                <h2 className="text-lg font-bold text-foreground">Psychometric Intelligence</h2>
                                            </div>
                                            <p className="text-sm text-foreground/60 leading-relaxed mb-8">
                                                {internalTestAccess?.grant?.status === 'active'
                                                    ? "Your secure internal assessment is active. This is a 50-question comprehensive evaluation."
                                                    : "Your personalized external assessment link is ready. Click below to begin."}
                                            </p>
                                        </div>
                                        <div className="relative z-10 mt-auto flex flex-col gap-3">
                                            {internalTestAccess?.grant?.status === 'active' && (
                                                <Link
                                                    href="/test"
                                                    className="w-full inline-flex items-center justify-center rounded-xl bg-primary hover:bg-primary/90 text-primary-foreground font-bold text-[14px] py-4 shadow-lg shadow-primary/20 transition-all active:scale-[0.98]"
                                                >
                                                    Start Internal Assessment &rarr;
                                                </Link>
                                            )}
                                            {dashboard.profile.psychometricTestLink && (
                                                <a
                                                    href={dashboard.profile.psychometricTestLink}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className={`w-full inline-flex items-center justify-center rounded-xl border border-border/20 hover:border-border/60 text-foreground font-medium text-[14px] py-4 transition-all ${internalTestAccess?.grant?.status === 'active' ? 'opacity-80 scale-95' : 'bg-primary text-primary-foreground border-transparent'}`}
                                                >
                                                    {internalTestAccess?.grant?.status === 'active' ? "Manual External Link" : "Start Assessment \u2192"}
                                                </a>
                                            )}
                                        </div>
                                    </div>
                                ) : (
                                    <div className="rounded-3xl border border-border/20 bg-card p-10 flex flex-col items-center justify-center text-center shadow-sm">
                                        <div className="w-12 h-12 rounded-full bg-foreground/5 flex items-center justify-center mb-6">
                                            <span className="text-foreground/60 text-xl">🔒</span>
                                        </div>
                                        <h3 className="text-xl font-bold text-foreground mb-2">Assessment Locked</h3>
                                        <p className="text-sm text-foreground/50 max-w-sm mb-6">
                                            {dashboard.profile.paymentStatus === 'paid'
                                                ? "You have paid. Awaiting admin to grant your internal test access (usually within 12-24 hours)."
                                                : "Purchase a plan to unlock the full psychometric intelligence assessment."}
                                        </p>
                                        {dashboard.profile.paymentStatus !== 'paid' && (
                                            <button
                                                onClick={handlePayNow}
                                                className="text-primary text-sm font-bold hover:underline"
                                            >
                                                Pay Now to Unlock &rarr;
                                            </button>
                                        )}
                                    </div>
                                )}

                                <div className="rounded-3xl border border-border/20 bg-card p-8 flex flex-col justify-between shadow-sm relative overflow-hidden">
                                    <div className="relative z-10">
                                        <div className="flex items-center justify-between gap-4 mb-6">
                                            <h2 className="text-lg font-semibold text-foreground">Internal Assessment</h2>
                                            <button
                                                type="button"
                                                onClick={loadInternalTest}
                                                disabled={internalTestLoading}
                                                className="rounded-lg border border-border/20 bg-background px-3 py-1.5 text-xs font-medium text-foreground transition hover:border-primary/30 disabled:opacity-60"
                                            >
                                                {internalTestLoading ? "Refreshing..." : "Refresh"}
                                            </button>
                                        </div>

                                        {!internalTestAccess ? (
                                            <p className="text-sm text-foreground/60 leading-relaxed">
                                                {internalTestLoading ? "Checking access..." : "Access status unavailable right now."}
                                            </p>
                                        ) : internalCompletedAttemptId ? (
                                            <p className="text-sm text-foreground/60 leading-relaxed">
                                                You&apos;ve completed the internal assessment. View your stored results anytime.
                                            </p>
                                        ) : internalInProgress ? (
                                            <p className="text-sm text-foreground/60 leading-relaxed">
                                                Your internal assessment is in progress. Resume where you left off.
                                            </p>
                                        ) : internalGrantActive ? (
                                            <p className="text-sm text-foreground/60 leading-relaxed">
                                                Your internal assessment is ready. Start when you&apos;re prepared.
                                            </p>
                                        ) : dashboard.profile.paymentStatus !== "paid" ? (
                                            <p className="text-sm text-foreground/60 leading-relaxed">
                                                Complete payment first. Admin access is granted after payment is verified.
                                            </p>
                                        ) : (
                                            <p className="text-sm text-foreground/60 leading-relaxed">
                                                Awaiting admin access grant. This will appear once issued.
                                            </p>
                                        )}
                                    </div>

                                    <div className="relative z-10 mt-8">
                                        {internalCompletedAttemptId ? (
                                            <Link
                                                href={`/test/result/${internalCompletedAttemptId}`}
                                                className="w-full inline-flex items-center justify-center rounded-xl bg-primary hover:bg-primary/90 text-primary-foreground font-medium text-sm py-4 transition-colors"
                                            >
                                                View Result →
                                            </Link>
                                        ) : internalGrantActive ? (
                                            <Link
                                                href="/test"
                                                className="w-full inline-flex items-center justify-center rounded-xl bg-primary hover:bg-primary/90 text-primary-foreground font-medium text-sm py-4 transition-colors"
                                            >
                                                {internalInProgress ? "Resume Internal Test →" : "Start Internal Test →"}
                                            </Link>
                                        ) : (
                                            <button
                                                type="button"
                                                disabled
                                                className="w-full inline-flex items-center justify-center rounded-xl bg-primary text-primary-foreground font-medium text-sm py-4 opacity-50"
                                            >
                                                Awaiting Access
                                            </button>
                                        )}
                                    </div>
                                </div>

                            </div>

                            {/* MY CAREER GOALS */}
                            <div className="rounded-2xl border border-border/20 bg-card p-6 md:p-8 shadow-sm">
                                <div className="max-w-2xl">
                                    <h2 className="text-xl font-bold text-foreground mb-1">My Career Goals</h2>
                                    <p className="text-foreground/60 text-sm mb-6">
                                        Tell us what you want to achieve. This will be included in your final Career Report.
                                    </p>

                                    <form onSubmit={handleSaveGoals} className="flex flex-col gap-5">
                                        <div>
                                            <label className="block text-sm font-medium text-foreground mb-1.5">My Goal / Dream</label>
                                            <input
                                                type="text"
                                                value={careerGoals.dream}
                                                onChange={(e) => setCareerGoals({ ...careerGoals, dream: e.target.value })}
                                                placeholder="e.g. I want to build houses"
                                                className="w-full bg-background border border-border/40 text-foreground text-sm px-4 py-2.5 rounded-lg focus:border-primary/50 transition-colors"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-foreground mb-1.5">Profession I Want</label>
                                            <input
                                                type="text"
                                                value={careerGoals.profession}
                                                onChange={(e) => setCareerGoals({ ...careerGoals, profession: e.target.value })}
                                                placeholder="e.g. Civil Engineer"
                                                className="w-full bg-background border border-border/40 text-foreground text-sm px-4 py-2.5 rounded-lg focus:border-primary/50 transition-colors"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-foreground mb-1.5">Degree / Education to Pursue</label>
                                            <input
                                                type="text"
                                                value={careerGoals.education}
                                                onChange={(e) => setCareerGoals({ ...careerGoals, education: e.target.value })}
                                                placeholder="e.g. B.Tech in Civil Engineering"
                                                className="w-full bg-background border border-border/40 text-foreground text-sm px-4 py-2.5 rounded-lg focus:border-primary/50 transition-colors"
                                            />
                                        </div>
                                        <div className="pt-2 flex items-center gap-4">
                                            <button
                                                type="submit"
                                                disabled={savingGoals}
                                                className="rounded-lg bg-primary hover:bg-primary/90 text-white px-6 py-2.5 text-sm font-medium transition-colors disabled:opacity-70"
                                            >
                                                {savingGoals ? "Saving..." : "Save Goals"}
                                            </button>
                                            {goalsMessage && <span className="text-emerald-600 text-sm font-medium">{goalsMessage}</span>}
                                        </div>
                                    </form>
                                </div>
                            </div>

                            {/* ... rest of dashboard omitted for brevity, unchanged ... */}
                        </div>
                    )}
                </div>
            </section>

            <Footer />
        </main>
    );
}
