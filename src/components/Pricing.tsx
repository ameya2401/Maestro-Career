"use client";

import React, { useState } from "react";
import { Check, X, Star, ChevronDown, ChevronUp } from "lucide-react";

type PlanType = "Basic" | "Intermediate" | "Advanced";

const commonFeatures = [
    "Pre-Career Counselling 1-1 Session (30 Min)",
    "Student Psychometric Analysis Test",
    "Student Parent Psychometric Test Evaluation (1 Session)",
    "Customize Career Discovery Planning Report",
    "General Career Sensitization & Awareness (Group Session)",
    "Live Group Sessions for Career Building Specific Career",
    "Lifetime Access to the Career Library",
    "New Age Career Opportunities After 12 (Group Session)",
    "Foreign Education & Scholarship Awareness (Group Session)",
    "Industry-Job Specific Technology Skill (Group Session)"
];

const tiers = [
    {
        name: "StartUp",
        id: "Basic" as PlanType,
        price: "₹5,000",
        description: "Essential career guidance for students starting their journey.",
        glowColor: "group-hover:shadow-[0_0_40px_rgba(59,130,246,0.2)]",
        borderColor: "border-blue-100/50 hover:border-blue-300",
        activeBorder: "border-blue-500 shadow-[0_0_30px_rgba(59,130,246,0.3)]",
        buttonColor: "bg-blue-50 text-blue-600 hover:bg-blue-600 hover:text-white",
        activeButtonColor: "bg-blue-600 text-white shadow-md shadow-blue-500/30",
        badge: null,
        shortFeatures: [
            "Live 1-1 Session (1 Session)",
            "Pre-Career Counselling Session (30 Min)",
            "Student Psychometric Analysis Test",
            "Student Parent Test Evaluation",
            "Customize Career Discovery Report"
        ],
        features: [
            { name: "Live 1-1 Session", value: "1 Session", included: true },
            { name: "Career Suitability Report", value: "Not included", included: false },
            { name: "Profile Building Guidance", value: "Not included", included: false },
            { name: "Mentor Discussion", value: "Not included", included: false },
            { name: "CV Review", value: "Not included", included: false },
            { name: "Career Discussion", value: "Not included", included: false },
        ],
    },
    {
        name: "Growth",
        id: "Intermediate" as PlanType,
        price: "₹8,000",
        description: "Comprehensive support with extra guidance and mentorship.",
        glowColor: "group-hover:shadow-[0_0_40px_rgba(168,85,247,0.3)]",
        borderColor: "border-purple-200/50 hover:border-purple-400",
        activeBorder: "border-purple-500 shadow-[0_0_30px_rgba(168,85,247,0.4)]",
        buttonColor: "bg-purple-600 text-white hover:bg-purple-700 shadow-md shadow-purple-500/30",
        activeButtonColor: "bg-purple-700 text-white shadow-md shadow-purple-500/40",
        badge: "Most Popular",
        shortFeatures: [
            "StartUp Plan Features",
            "Live 1-1 Session (2 Sessions)",
            "Career Suitability Report (2 Career Paths)",
            "Profile Building Guidance",
            "Mentor Discussion (80 Min)"
        ],
        features: [
            { name: "All StartUp Plan Features", value: "Included", included: true, special: true },
            { name: "Live 1-1 Session", value: "2 Sessions", included: true },
            { name: "Career Suitability Report", value: "2 Career Paths", included: true },
            { name: "Profile Building Guidance", value: "Included", included: true },
            { name: "Mentor Discussion", value: "80 Min", included: true },
            { name: "CV Review", value: "Not included", included: false },
            { name: "Career Discussion", value: "Not included", included: false },
        ],
    },
    {
        name: "Excel",
        id: "Advanced" as PlanType,
        price: "₹13,000",
        description: "Premium access, including CV review and extensive sessions.",
        glowColor: "group-hover:shadow-[0_0_40px_rgba(6,182,212,0.25)]",
        borderColor: "border-cyan-100/50 hover:border-cyan-300",
        activeBorder: "border-cyan-500 shadow-[0_0_30px_rgba(6,182,212,0.35)]",
        buttonColor: "bg-cyan-50 text-cyan-700 hover:bg-cyan-600 hover:text-white",
        activeButtonColor: "bg-cyan-600 text-white shadow-md shadow-cyan-500/30",
        badge: null,
        shortFeatures: [
            "StartUp + Growth Features",
            "Live 1-1 Session (4 Sessions)",
            "Career Suitability Report (3 Career Paths)",
            "Mentor Discussion (120 Min)",
            "CV Review",
            "Career Discussion"
        ],
        features: [
            { name: "All StartUp & Growth Features", value: "Included", included: true, special: true },
            { name: "Live 1-1 Session", value: "4 Sessions", included: true },
            { name: "Career Suitability Report", value: "3 Career Paths", included: true },
            { name: "Profile Building Guidance", value: "Included", included: true },
            { name: "Mentor Discussion", value: "120 Min", included: true },
            { name: "CV Review", value: "Included", included: true },
            { name: "Career Discussion", value: "Included", included: true },
        ],
    },
];

export default function Pricing() {
    const [activePlan, setActivePlan] = useState<PlanType | null>(null);
    const [expandedPlans, setExpandedPlans] = useState<Record<string, boolean>>({});

    const toggleExpand = (id: string, e: React.MouseEvent) => {
        e.stopPropagation();
        setExpandedPlans((prev) => ({ ...prev, [id]: !prev[id] }));
    };

    return (
        <div className="bg-background py-24 sm:py-32 transition-colors duration-500">
            <div className="mx-auto max-w-7xl px-6 lg:px-8">
                <div className="mx-auto max-w-4xl text-center">
                    <h2 className="text-base font-semibold leading-7 text-primary">Pricing</h2>
                    <p className="mt-2 text-4xl font-bold tracking-tight text-foreground sm:text-5xl">
                        Choose the right plan for you
                    </p>
                </div>
                <p className="mx-auto mt-6 max-w-2xl text-center text-lg leading-8 text-muted-foreground">
                    Lorem ipsum dolor sit, amet consectetur adipisicing elit. Velit numquam eligendi quos odit doloribus perspiciatis.
                </p>
                <div className="isolate mx-auto mt-16 grid max-w-md grid-cols-1 gap-y-8 sm:mt-20 lg:mx-0 lg:max-w-none lg:grid-cols-3 lg:gap-x-8 xl:gap-x-12">
                    {PLANS.map((tier) => (
                        <div
                            key={tier.id}
                            className={`rounded-3xl p-8 ring-1 ring-border xl:p-10 transition-all duration-300 ${tier.mostPopular ? 'ring-2 ring-primary bg-primary/5 scale-105 shadow-xl' : 'hover:shadow-lg bg-card'
                                }`}
                        >
                            <div className="flex items-center justify-between gap-x-4">
                                <h3
                                    className={`text-lg font-semibold leading-8 ${tier.mostPopular ? 'text-primary' : 'text-foreground'
                                        }`}
                                >
                                    {tier.name}
                                </h3>
                                {tier.mostPopular && (
                                    <p className="rounded-full bg-primary/10 px-2.5 py-1 text-xs font-semibold leading-5 text-primary">
                                        Most popular
                                    </p>
                                )}

                                <div className="mb-6">
                                    <h3 className="text-xl font-bold text-slate-900">{tier.name}</h3>
                                    <p className="mt-2 text-sm text-slate-500 min-h-[40px] leading-relaxed">{tier.description}</p>
                                </div>

                                <div className="mb-6 flex items-baseline gap-x-2">
                                    <span className="text-4xl font-extrabold tracking-tight text-slate-900">{tier.price}</span>
                                </div>

                                {/* Always visible short details */}
                                <div className="mb-8 flex-1">
                                    <ul className="space-y-3 text-sm leading-6 text-slate-700">
                                        {tier.shortFeatures.map((feat, idx) => (
                                            <li key={idx} className="flex gap-x-3 items-start">
                                                <Check className={`h-5 w-5 flex-none mt-0.5 ${feat.includes("StartUp Plan") || feat.includes("StartUp + Growth") ? 'text-indigo-500' : 'text-slate-400'}`} aria-hidden="true" />
                                                <span className={feat.includes("StartUp Plan") || feat.includes("StartUp + Growth") ? "font-bold text-indigo-700" : "font-medium"}>
                                                    {feat}
                                                </span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>

                                <button
                                    className={`mt-auto block w-full rounded-xl px-4 py-3 text-center text-sm font-semibold transition-all duration-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2
                                        ${isActive ? tier.activeButtonColor : tier.buttonColor}
                                    `}
                                >
                                    {isActive ? "Plan Selected" : "Get Started"}
                                </button>

                                <button
                                    onClick={(e) => toggleExpand(tier.id, e)}
                                    className="mt-6 w-full flex items-center justify-center gap-2 text-sm font-semibold text-slate-500 hover:text-slate-800 transition-colors py-2"
                                >
                                    {isExpanded ? (
                                        <>Hide full details <ChevronUp className="w-4 h-4" /></>
                                    ) : (
                                        <>See full details <ChevronDown className="w-4 h-4" /></>
                                    )}
                                </button>

                                {/* Expanded full features */}
                                <div
                                    className={`overflow-hidden transition-all duration-500 ease-in-out ${isExpanded ? "max-h-[2000px] opacity-100 mt-6" : "max-h-0 opacity-0 mt-0"}`}
                                >
                                    <div className="h-px w-full bg-gradient-to-r from-transparent via-slate-200 to-transparent mb-6"></div>

                                    <ul className="space-y-4 text-sm leading-6 text-slate-600">
                                        {/* Plan specific features */}
                                        <div className="mb-6 space-y-4">
                                            <p className="text-xs font-semibold text-slate-900 uppercase tracking-wider mb-4">Complete Plan Breakdown</p>
                                            {tier.features.map((feature, i) => (
                                                <li key={i} className="flex gap-x-3 items-start">
                                                    {feature.included ? (
                                                        <Check className={`h-5 w-5 flex-none mt-0.5 ${feature.special ? 'text-indigo-500' : 'text-green-500'}`} aria-hidden="true" />
                                                    ) : (
                                                        <X className="h-5 w-5 flex-none text-slate-300 mt-0.5" aria-hidden="true" />
                                                    )}
                                                    <span className={feature.included ? (feature.special ? "text-indigo-700 font-bold" : "text-slate-700 font-medium") : "text-slate-400"}>
                                                        {feature.name}
                                                        {feature.included && feature.value !== "Included" && (
                                                            <span className="text-slate-500 font-normal"> — {feature.value}</span>
                                                        )}
                                                    </span>
                                                </li>
                                            ))}
                                        </div>

                                        {/* Common features */}
                                        <div className="space-y-4 pt-4 border-t border-slate-100">
                                            <p className="text-xs font-semibold text-slate-900 uppercase tracking-wider mb-4">Core Benefits (All Plans)</p>
                                            {commonFeatures.map((feature, idx) => (
                                                <li key={idx} className="flex gap-x-3 items-start">
                                                    <Check className="h-4 w-4 flex-none text-slate-400 mt-1" aria-hidden="true" />
                                                    <span className="text-slate-500 text-sm">{feature}</span>
                                                </li>
                                            ))}
                                        </div>
                                    </ul>
                                </div>

                            </div>
                            <p className="mt-4 text-sm leading-6 text-muted-foreground">{tier.description}</p>
                            <p className="mt-6 flex items-baseline gap-x-1">
                                <span className="text-4xl font-bold tracking-tight text-foreground">{formatInr(tier.priceInr)}</span>
                                <span className="text-sm font-semibold leading-6 text-muted-foreground">one-time</span>
                            </p>
                            <Link
                                href={`/checkout/${tier.id}`}
                                className={`mt-6 block rounded-md px-3 py-2 text-center text-sm font-semibold leading-6 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 transition-colors duration-200 ${tier.mostPopular
                                    ? 'bg-primary text-white hover:bg-primary-dark focus-visible:outline-primary'
                                    : 'bg-primary/10 text-primary hover:bg-primary/20 focus-visible:outline-primary'
                                    }`}
                            >
                                Buy plan
                            </Link>
                            <ul className="mt-8 space-y-3 text-sm leading-6 text-muted-foreground xl:mt-10">
                                {tier.features.map((feature) => (
                                    <li key={feature} className="flex gap-x-3">
                                        <Check className="h-6 w-5 flex-none text-primary" aria-hidden="true" />
                                        {feature}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
