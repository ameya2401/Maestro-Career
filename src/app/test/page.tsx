"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { ASSESSMENT_BANK_V1, AssessmentQuestion, AssessmentOption } from "@/data/assessment-bank";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export default function AssessmentPage() {
    const router = useRouter();
    const [loading, setLoading] = useState(true);
    const [access, setAccess] = useState<any>(null);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [responses, setResponses] = useState<Record<number, string>>({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [timeLeft, setTimeLeft] = useState(3600); // 60 mins

    const currentQuestion = ASSESSMENT_BANK_V1[currentIndex];

    const checkAccess = useCallback(async () => {
        try {
            const resp = await fetch("/api/test/access");
            const data = await resp.json();

            if (!resp.ok || !data.hasAccess) {
                router.push("/dashboard");
                return;
            }

            setAccess(data);
            setLoading(false);
        } catch {
            router.push("/dashboard");
        }
    }, [router]);

    useEffect(() => {
        void checkAccess();
    }, [checkAccess]);

    useEffect(() => {
        if (loading || !access) return;
        const timer = setInterval(() => {
            setTimeLeft(prev => {
                if (prev <= 1) {
                    clearInterval(timer);
                    void handleSubmit();
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);
        return () => clearInterval(timer);
    }, [loading, access]);

    const handleSelect = (optionId: string) => {
        setResponses(prev => ({ ...prev, [currentQuestion.id]: optionId }));
    };

    const next = () => {
        if (currentIndex < ASSESSMENT_BANK_V1.length - 1) {
            setCurrentIndex(prev => prev + 1);
        }
    };

    const prev = () => {
        if (currentIndex > 0) {
            setCurrentIndex(prev => prev - 1);
        }
    };

    const handleSubmit = async () => {
        if (isSubmitting) return;
        setIsSubmitting(true);
        try {
            const resp = await fetch("/api/test/submit", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    attemptId: access.activeAttempt?.id || "",
                    responses
                })
            });
            const data = await resp.json();
            if (resp.ok && data.success) {
                router.push("/dashboard?status=completed");
            } else {
                alert(data.message || "Failed to submit");
            }
        } catch (err) {
            alert("Submission failed. Check your connection.");
        } finally {
            setIsSubmitting(false);
        }
    };

    if (loading) return (
        <div className="min-h-screen bg-[#030712] flex items-center justify-center text-white">
            <div className="animate-pulse flex flex-col items-center gap-4">
                <div className="w-12 h-12 rounded-full border-4 border-primary border-t-transparent animate-spin"></div>
                <p className="text-sm font-bold uppercase tracking-widest opacity-50">Initializing Secure Engine...</p>
            </div>
        </div>
    );

    const progress = Math.round(((currentIndex + 1) / ASSESSMENT_BANK_V1.length) * 100);
    const answeredCount = Object.keys(responses).length;

    return (
        <main className="min-h-screen bg-[#030712] text-white flex flex-col">
            <Header />

            <section className="flex-1 py-12 px-4 flex items-center justify-center">
                <div className="max-w-3xl w-full">
                    {/* Header Info */}
                    <div className="flex justify-between items-end mb-8">
                        <div>
                            <div className="text-[10px] uppercase font-black text-primary tracking-[0.2em] mb-1">Intelligence Assessment</div>
                            <h2 className="text-2xl font-bold">Section: {currentQuestion.section}</h2>
                        </div>
                        <div className="text-right">
                            <div className="text-[10px] uppercase font-black opacity-40 tracking-[0.2em] mb-1">Time Remaining</div>
                            <div className="text-xl font-mono font-bold text-primary">
                                {Math.floor(timeLeft / 60)}:{(timeLeft % 60).toString().padStart(2, '0')}
                            </div>
                        </div>
                    </div>

                    {/* Progress Bar */}
                    <div className="h-1 w-full bg-white/5 rounded-full mb-12 overflow-hidden">
                        <div
                            className="h-full bg-primary transition-all duration-500"
                            style={{ width: `${progress}%` }}
                        />
                    </div>

                    {/* Question Card */}
                    <div className="bg-white/5 border border-white/10 rounded-[32px] p-8 md:p-12 min-h-[400px] flex flex-col">
                        <div className="mb-10 text-[10px] uppercase font-bold opacity-30 tracking-widest">Question {currentIndex + 1} of {ASSESSMENT_BANK_V1.length}</div>

                        <h3 className="text-xl md:text-2xl font-bold mb-10 leading-snug">
                            {currentQuestion.prompt}
                        </h3>

                        <div className="space-y-4">
                            {currentQuestion.options.map((option: AssessmentOption) => {
                                const selected = responses[currentQuestion.id] === option.id;
                                return (
                                    <button
                                        key={option.id}
                                        onClick={() => handleSelect(option.id)}
                                        className={`w-full text-left p-6 rounded-2xl border-2 transition-all flex items-center justify-between group ${selected ? 'border-primary bg-primary/10' : 'border-white/5 bg-white/5 hover:border-white/20'}`}
                                    >
                                        <span className={`text-[15px] font-medium transition-colors ${selected ? 'text-white' : 'text-white/60 group-hover:text-white/80'}`}>
                                            {option.text}
                                        </span>
                                        <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all ${selected ? 'border-primary bg-primary' : 'border-white/20'}`}>
                                            {selected && <div className="w-2 h-2 rounded-full bg-white" />}
                                        </div>
                                    </button>
                                );
                            })}
                        </div>

                        <div className="mt-auto pt-12 flex justify-between gap-4">
                            <button
                                onClick={prev}
                                disabled={currentIndex === 0}
                                className="px-8 py-3 rounded-xl border border-white/10 hover:bg-white/5 transition-all disabled:opacity-20 flex items-center gap-2"
                            >
                                &larr; Back
                            </button>

                            {currentIndex === ASSESSMENT_BANK_V1.length - 1 ? (
                                <button
                                    onClick={handleSubmit}
                                    disabled={answeredCount < ASSESSMENT_BANK_V1.length || isSubmitting}
                                    className="px-10 py-3 rounded-xl bg-primary hover:bg-primary/90 text-primary-foreground font-bold shadow-lg shadow-primary/20 transition-all disabled:opacity-30 disabled:scale-100 active:scale-95"
                                >
                                    {isSubmitting ? "Processing Analysis..." : "Finish & Analyze"}
                                </button>
                            ) : (
                                <button
                                    onClick={next}
                                    disabled={responses[currentQuestion.id] === undefined}
                                    className="px-10 py-3 rounded-xl bg-white text-[#030712] font-bold hover:bg-white/90 transition-all disabled:opacity-30 flex items-center gap-2"
                                >
                                    Next Intelligence Check &rarr;
                                </button>
                            )}
                        </div>
                    </div>

                    <p className="mt-8 text-center text-xs opacity-30 tracking-widest uppercase font-bold">
                        Maestro Secure Environment • MC-ENG-V1
                    </p>
                </div>
            </section>

            <Footer />
        </main>
    );
}
