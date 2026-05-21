"use client";

import { Star } from "lucide-react";
import manualGoogleReviews from "@/data/manualGoogleReviews.json";

type GoogleReview = {
    authorName: string;
    text: string;
    rating: number;
};

function normalizeReviewText(text: string) {
    const trimmed = text.trim();

    // Remove common Google UI suffix when text is truncated.
    const withoutMore = trimmed
        .replace(/\s*…\s*More\s*$/i, "")
        .replace(/\s*\.\.\.\s*More\s*$/i, "");

    return withoutMore.trim();
}

function GoogleWordmark() {
    return (
        <span className="inline-flex items-center font-extrabold tracking-tight select-none" aria-label="Google">
            <span className="text-vibe-blue">G</span>
            <span className="text-accent-pink">o</span>
            <span className="text-accent-orange">o</span>
            <span className="text-vibe-blue">g</span>
            <span className="text-vibe-emerald">l</span>
            <span className="text-accent-pink">e</span>
        </span>
    );
}

export default function Testimonials() {
    const reviews = (manualGoogleReviews as GoogleReview[]).filter((r) => r.rating === 5);
    const testimonials = reviews.length > 0 ? [...reviews, ...reviews] : [];

    return (
        <section className="bg-background py-32 relative overflow-hidden transition-colors duration-500">
            <div className="mx-auto max-w-7xl px-6 lg:px-8 relative z-10">
                <div className="mx-auto max-w-2xl text-center mb-20">
                    <h2 className="text-primary font-semibold tracking-wider text-sm mb-4">Success Stories</h2>
                    <p className="text-5xl font-bold tracking-tighter text-foreground sm:text-6xl leading-[1.1]">
                        Trusted by the <br />
                        <span className="text-gradient">Next Generation</span>
                    </p>

                    <div className="mt-6 flex items-center justify-center gap-2 text-sm text-muted-foreground">
                        <GoogleWordmark />
                        <span className="font-semibold">Reviews</span>
                    </div>
                </div>
            </div>

            {/* Google-style review cards (carousel) */}
            <div className="relative flex overflow-hidden w-full group mt-16 cursor-grab active:cursor-grabbing">
                {/* Gradient Masks for smooth edge fading */}
                <div className="absolute inset-y-0 left-0 w-1/6 md:w-1/4 bg-gradient-to-r from-background to-transparent z-20 pointer-events-none" />
                <div className="absolute inset-y-0 right-0 w-1/6 md:w-1/4 bg-gradient-to-l from-background to-transparent z-20 pointer-events-none" />

                {testimonials.length > 0 ? (
                    <div className="flex shrink-0 gap-8 min-w-max px-4 animate-marquee hover:[animation-play-state:paused]">
                        {testimonials.map((testimonial, idx) => (
                            <div
                                key={idx}
                                className="relative w-[280px] sm:w-[350px] md:w-[450px] shrink-0 rounded-xl bg-card p-6 md:p-7 border border-border shadow-sm flex flex-col whitespace-normal"
                            >
                                <div className="flex items-start justify-between gap-4">
                                    <div className="flex items-center gap-3 min-w-0">
                                        <div className="h-10 w-10 rounded-full bg-muted border border-border flex items-center justify-center text-foreground font-extrabold">
                                            {(testimonial.authorName || "A").slice(0, 1).toUpperCase()}
                                        </div>
                                        <div className="min-w-0">
                                            <div className="font-extrabold text-foreground text-sm leading-tight truncate">
                                                {testimonial.authorName}
                                            </div>
                                            <div className="mt-1 flex items-center gap-0.5 text-accent-orange" aria-label="5 star review">
                                                {Array.from({ length: 5 }).map((_, i) => (
                                                    <Star key={i} className="h-4 w-4" fill="currentColor" />
                                                ))}
                                            </div>
                                        </div>
                                    </div>

                                    <div className="shrink-0 text-xs text-muted-foreground">
                                        <GoogleWordmark />
                                    </div>
                                </div>

                                <div className="mt-4 text-foreground/90 text-sm leading-relaxed whitespace-pre-line">
                                    {normalizeReviewText(testimonial.text)}
                                </div>

                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="w-full px-6 lg:px-8">
                        <div className="mx-auto max-w-2xl text-center text-muted-foreground">
                            {"No 5-star reviews found."}
                        </div>
                    </div>
                )}
            </div>
        </section>
    );
}

