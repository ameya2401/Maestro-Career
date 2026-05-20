"use client";

import React, { useEffect, useState } from "react";
import { MotionConfig, motion } from "framer-motion";
import { ReportData } from "@/types/report";
import ReportRadarChart from "../charts/ReportRadarChart";
import ReportBarChart from "../charts/ReportBarChart";
import ReportPieChart from "../charts/ReportPieChart";
import ComparisonGraph from "../charts/ComparisonGraph";
import { CognitiveVenn, CareerDNA } from "./visuals/CognitiveComponents";

interface ReportViewerProps {
    data: ReportData;
    isPrinting?: boolean;
}

export default function ReportViewer({ data, isPrinting = false }: ReportViewerProps) {
    const [isMounted, setIsMounted] = useState(false);

    useEffect(() => {
        setIsMounted(true);
    }, []);

    if (!isMounted) return null;

    return (
        <MotionConfig transition={{ duration: isPrinting ? 0 : 0.4 }}>
            <div className={`report-container ${isPrinting ? 'bg-white' : 'bg-[#010409] py-12'}`}>

                {/* PAGE 1: IDENTITY & INTRODUCTION */}
                <section className="dossier-page">
                    <div className="flex flex-col h-full justify-between">
                        <div>
                            <div className="dossier-label mb-2 text-primary">Maestro Career // Psychological Intelligence Unit</div>
                            <h1 className="dossier-title text-primary">Intelligence <br /> Dossier</h1>
                            <div className="mt-8 border-t border-foreground/10 pt-8 max-w-md">
                                <p className="text-sm opacity-60 leading-relaxed italic">
                                    "The measure of intelligence is the ability to change. This analysis quantifies the cognitive and behavioral architecture of the individual."
                                </p>
                            </div>
                        </div>

                        <div className="grid grid-cols-3 gap-12 border-t border-foreground/10 pt-12">
                            <div>
                                <div className="dossier-label">Subject ID</div>
                                <div className="text-xl font-bold">{data.user.name}</div>
                                <div className="text-xs opacity-50">{data.user.email}</div>
                            </div>
                            <div>
                                <div className="dossier-label">Analysis Date</div>
                                <div className="text-xl font-bold">{data.user.reportDate}</div>
                                <div className="text-xs opacity-50">Reference: MC-PR1-{data.user.id.slice(0, 8)}</div>
                            </div>
                            <div>
                                <div className="dossier-label">Percentile Rank</div>
                                <div className="text-4xl font-black text-primary italic">#{data.aptitudeScores.percentile || 99}</div>
                                <div className="text-[10px] opacity-50 uppercase font-black">Global Index</div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* PAGE 2: COGNITIVE FOUNDATION */}
                <section className="dossier-page">
                    <div className="dossier-section-header border-primary">
                        <h2 className="text-2xl font-bold uppercase">Cognitive Foundation</h2>
                        <p className="text-xs opacity-50 uppercase tracking-widest">Multi-dimensional Aptitude Mapping</p>
                    </div>

                    <div className="grid grid-cols-12 gap-8 items-center flex-1">
                        <div className="col-span-7">
                            <ReportRadarChart data={data.charts.radarChart} isPrinting={isPrinting} />
                        </div>
                        <div className="col-span-5 space-y-6">
                            <div className="bg-primary/5 p-6 border border-primary/20 rounded-sm">
                                <h3 className="text-sm font-bold uppercase mb-2">Internal Interpretation</h3>
                                <p className="text-xs leading-relaxed opacity-80">
                                    The subject displays significant concentration in <strong>Logical Reasoning</strong> and <strong>Analytical Synthesis</strong>.
                                    This indicates a structural preference for solving problems via objective decomposition rather than intuitive leap.
                                </p>
                            </div>
                            <div className="space-y-4">
                                {Object.entries(data.aptitudeScores).slice(0, 4).map(([key, value]) => (
                                    <div key={key} className="flex justify-between items-center border-b border-foreground/5 pb-2">
                                        <span className="text-[10px] uppercase font-bold opacity-60">{key.replace('_', ' ')}</span>
                                        <span className="font-mono text-sm">{value}%</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </section>

                {/* PAGE 3: BEHAVIORAL PERSONALITY MAPPING */}
                <section className="dossier-page">
                    <div className="dossier-section-header border-secondary">
                        <h2 className="text-2xl font-bold uppercase">Behavioral Architecture</h2>
                        <p className="text-xs opacity-50 uppercase tracking-widest">Psychometric Trait Distribution</p>
                    </div>

                    <div className="grid grid-cols-2 gap-12">
                        <div>
                            <ReportBarChart data={data.charts.barChart} isPrinting={isPrinting} />
                        </div>
                        <div className="space-y-8">
                            <div>
                                <h3 className="text-sm font-bold border-b border-foreground/10 pb-2 mb-4">Core Behavioral DNA</h3>
                                <CareerDNA data={data.careerDNA || { analytical: 85, creative: 60, leadership: 75, research: 90, innovation: 70 }} isPrinting={isPrinting} />
                            </div>
                            <div className="bg-background/20 p-4 rounded-lg">
                                <p className="text-xs italic opacity-60">
                                    The behavioral profile suggests a high <strong>Adaptability Quotient (AQ)</strong>, paired with disciplined execution cycles.
                                </p>
                            </div>
                        </div>
                    </div>
                </section>

                {/* PAGE 4: TRAIT OVERLAP + VENN SYSTEMS */}
                <section className="dossier-page">
                    <div className="dossier-section-header">
                        <h2 className="text-2xl font-bold uppercase">Synergistic Intersections</h2>
                        <p className="text-xs opacity-50 uppercase tracking-widest">Cognitive Venn Intelligence</p>
                    </div>

                    <div className="flex-1 flex flex-col justify-center gap-12">
                        <CognitiveVenn
                            circles={[
                                { label: 'Analytical Thinking', description: 'Logic-driven', color: '#3b82f6' },
                                { label: 'Strategic Leadership', description: 'Vision-driven', color: '#fbbf24' }
                            ]}
                            intersection="Strategic Architect"
                            isPrinting={isPrinting}
                        />
                        <div className="max-w-2xl mx-auto text-center">
                            <h3 className="text-lg font-bold uppercase mb-2">Archetype Analysis</h3>
                            <p className="text-sm opacity-70 leading-relaxed">
                                When high-level logic intersects with leadership potential, the candidate emerges as a <strong>Strategic Architect</strong>.
                                Capable of not just seeing the goal, but engineering the exact path to reach it with minimal error.
                            </p>
                        </div>
                    </div>
                </section>

                {/* PAGE 5: CAREER GENOME + ARCHETYPES */}
                <section className="dossier-page">
                    <div className="dossier-section-header">
                        <h2 className="text-2xl font-bold uppercase">Career Genome</h2>
                        <p className="text-xs opacity-50 uppercase tracking-widest">Genetic Alignment with Global Industries</p>
                    </div>

                    <div className="grid grid-cols-2 gap-8">
                        <div className="space-y-4">
                            {data.careerMatches.slice(0, 6).map((match, i) => (
                                <div key={i} className="p-4 bg-primary/5 border-l-4 border-primary">
                                    <div className="flex justify-between items-center mb-1">
                                        <span className="font-bold">{match.career}</span>
                                        <span className="text-xs font-mono">{match.score}%</span>
                                    </div>
                                    <p className="text-[10px] opacity-60 leading-tight">{match.description}</p>
                                </div>
                            ))}
                        </div>
                        <div className="flex flex-col justify-center items-center p-8 border border-foreground/10 bg-white/5">
                            <div className="dossier-label mb-6">Subject Archetype</div>
                            <div className="text-4xl font-black text-primary uppercase text-center mb-4">{data.archetype.title}</div>
                            <div className="text-center space-y-4">
                                <p className="text-sm opacity-80">{data.archetype.description}</p>
                                <div className="flex flex-wrap gap-2 justify-center">
                                    {data.archetype.traits.map(t => (
                                        <span key={t} className="px-3 py-1 bg-foreground/10 rounded-full text-[10px] font-bold uppercase">{t}</span>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* PAGE 6: BENCHMARK ANALYSIS */}
                <section className="dossier-page">
                    <div className="dossier-section-header">
                        <h2 className="text-2xl font-bold uppercase">Benchmark Analysis</h2>
                        <p className="text-xs opacity-50 uppercase tracking-widest">Subject vs. Industry Ideals</p>
                    </div>
                    <div className="flex-1">
                        <ComparisonGraph data={data.charts.comparisonData} isPrinting={isPrinting} />
                    </div>
                    <div className="mt-12 p-6 bg-foreground/5 flex items-center justify-between border border-foreground/10">
                        <div className="text-xs uppercase font-bold tracking-widest opacity-50">Overall Intelligence Index</div>
                        <div className="text-5xl font-black text-primary">8.8</div>
                    </div>
                </section>

                {/* PAGE 12: STRATEGIC ROADMAP */}
                <section className="dossier-page">
                    <div className="dossier-section-header">
                        <h2 className="text-2xl font-bold uppercase">Strategic Roadmap</h2>
                        <p className="text-xs opacity-50 uppercase tracking-widest">Phased Execution Plan</p>
                    </div>

                    <div className="space-y-8">
                        <div className="grid grid-cols-3 gap-6">
                            <div className="p-6 border border-foreground/10 rounded-sm">
                                <div className="text-primary font-black mb-2">PHASE 01: EXPLORATION</div>
                                <p className="text-[11px] opacity-60">Focus on foundational skill acquisition and mental model development.</p>
                            </div>
                            <div className="p-6 border border-foreground/10 rounded-sm">
                                <div className="text-primary font-black mb-2">PHASE 02: SPECIALIZATION</div>
                                <p className="text-[11px] opacity-60">Deep-dive into preferred career DNA clusters (STEM/AI).</p>
                            </div>
                            <div className="p-6 border border-foreground/10 rounded-sm">
                                <div className="text-primary font-black mb-2">PHASE 03: MASTERY</div>
                                <p className="text-[11px] opacity-60">Professional placement and leadership trajectory initiation.</p>
                            </div>
                        </div>
                        <div className="bg-primary text-white p-8">
                            <h3 className="text-lg font-bold mb-4 uppercase">Final Recommendation</h3>
                            <p className="text-sm leading-relaxed">
                                The subject is highly recommended for high-complexity analytical environments. Focus on developing soft-skill communication layers to complement existing technical logic depth.
                            </p>
                        </div>
                    </div>
                    <div className="mt-auto pt-8 border-t border-foreground/10 text-[10px] opacity-30 uppercase tracking-[0.5em] text-center">
                        Confidential Psychological Report // Maestro Career PR1
                    </div>
                </section>

            </div>
        </MotionConfig>
    );
}
