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
                                <p className="text-sm opacity-80 leading-relaxed italic">
                                    "The measure of intelligence is the ability to change." This comprehensive analysis quantifies the cognitive, behavioral, and professional architecture of the subject. It is designed to provide actionable pathways based on empirical data derived from rigorous psychometric evaluation.
                                </p>
                            </div>
                        </div>

                        <div className="grid grid-cols-3 gap-12 border-t border-foreground/10 pt-12">
                            <div>
                                <div className="dossier-label">Subject ID</div>
                                <div className="text-xl font-bold">{data.user.name}</div>
                                <div className="text-xs opacity-50">{data.user.email}</div>
                                <div className="text-xs opacity-50 mt-1">Age: {data.user.age} | Class: {data.user.class}</div>
                            </div>
                            <div>
                                <div className="dossier-label">Analysis Date</div>
                                <div className="text-xl font-bold">{data.user.reportDate}</div>
                                <div className="text-xs opacity-50">Reference: MC-PR1-{data.user.id.slice(0, 8)}</div>
                                <div className="text-xs opacity-50 mt-1">Classification: Level 1 Analysis</div>
                            </div>
                            <div>
                                <div className="dossier-label">Global Index</div>
                                <div className="text-4xl font-bold text-primary italic">{(data.charts?.comparisonData?.find(d => d.label === 'Overall')?.userScore || 85)} / 100</div>
                                <div className="text-xs opacity-50 uppercase font-bold mt-1">Intelligence Quotient</div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* PAGE 2: EXECUTIVE SUMMARY */}
                <section className="dossier-page">
                    <div className="dossier-section-header border-primary">
                        <h2 className="text-2xl font-bold uppercase">Executive Summary</h2>
                        <p className="text-xs opacity-50 tracking-wider">High-Level Architectural Overview</p>
                    </div>
                    <div className="flex-1 space-y-8 flex flex-col justify-center">
                        <p className="text-sm leading-relaxed opacity-80">
                            This dossier presents a synthesized view of the subject's operational parameters. The evaluation methodology encompasses multi-dimensional aptitude testing, behavioral response analysis, and professional affinity mapping. The resulting data isolates both dominant capabilities and structural vulnerabilities.
                        </p>
                        <div className="grid grid-cols-2 gap-8">
                            <div className="bg-primary/5 p-6 border-l-4 border-primary">
                                <h3 className="text-md font-bold uppercase mb-4">Core Strengths</h3>
                                <ul className="space-y-3">
                                    {data.strengths.map((s, i) => (
                                        <li key={i} className="text-sm flex items-start"><span className="text-primary mr-2">▪</span> {s}</li>
                                    ))}
                                </ul>
                            </div>
                            <div className="bg-destructive/5 p-6 border-l-4 border-destructive">
                                <h3 className="text-md font-bold uppercase mb-4">Optimization Areas</h3>
                                <ul className="space-y-3">
                                    {data.improvementAreas.map((a, i) => (
                                        <li key={i} className="text-sm flex items-start"><span className="text-destructive mr-2">▪</span> {a}</li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                        <div className="bg-foreground/5 p-6 border border-foreground/10 rounded-sm">
                            <h3 className="text-sm font-bold uppercase mb-2">Preliminary Conclusion</h3>
                            <p className="text-xs leading-relaxed opacity-80">
                                The subject demonstrates a high capacity for complex systemic comprehension. Their profile suggests rapid adaptation to new rule sets, making them highly viable for dynamic, non-linear environments where strategic foresight is required.
                            </p>
                        </div>
                    </div>
                </section>

                {/* PAGE 3: COGNITIVE FOUNDATION */}
                <section className="dossier-page">
                    <div className="dossier-section-header border-primary">
                        <h2 className="text-2xl font-bold uppercase">Cognitive Foundation</h2>
                        <p className="text-xs opacity-50 tracking-wider">Multi-dimensional Aptitude Mapping</p>
                    </div>
                    <div className="flex-1 flex flex-col justify-center">
                        <div className="w-full max-w-2xl mx-auto mb-8">
                            <ReportRadarChart data={data.charts.radarChart} isPrinting={isPrinting} />
                        </div>
                        <div className="bg-primary/5 p-6 border border-primary/20 rounded-sm mt-4">
                            <h3 className="text-sm font-bold uppercase mb-2">Visual Interpretation</h3>
                            <p className="text-xs leading-relaxed opacity-80">
                                The radar topology illustrates the subject's cognitive bandwidth across core domains. Peaks represent natural neurological efficiencies—areas where processing speed and accuracy are significantly elevated above the baseline.
                            </p>
                        </div>
                    </div>
                </section>

                {/* PAGE 4: DETAILED COGNITIVE METRICS */}
                <section className="dossier-page">
                    <div className="dossier-section-header border-primary">
                        <h2 className="text-2xl font-bold uppercase">Cognitive Deep-Dive</h2>
                        <p className="text-xs opacity-50 tracking-wider">Aptitude Vector Breakdown</p>
                    </div>
                    <div className="flex-1 space-y-6 flex flex-col justify-center">
                        <p className="text-sm mb-4">A granular analysis of the specific logical structures utilized by the subject:</p>
                        {Object.entries(data.aptitudeScores).map(([key, value]) => (
                            <div key={key} className="border-b border-foreground/10 pb-4">
                                <div className="flex justify-between items-end mb-2">
                                    <h3 className="text-sm font-semibold tracking-wide">{key.replace(/_/g, ' ')}</h3>
                                    <span className="text-2xl font-bold text-primary">{value}%</span>
                                </div>
                                <div className="w-full bg-foreground/10 h-2 rounded-full overflow-hidden mb-3">
                                    <div className="bg-primary h-full" style={{ width: `${value}%` }}></div>
                                </div>
                                <p className="text-xs opacity-70">
                                    {Number(value) > 75 
                                        ? `Exhibits exceptional proficiency. Capable of executing complex ${key.replace(/_/g, ' ')} operations with minimal cognitive fatigue.` 
                                        : `Demonstrates standard capability. Can reliably process ${key.replace(/_/g, ' ')} tasks within normal environmental parameters.`}
                                </p>
                            </div>
                        ))}
                    </div>
                </section>

                {/* PAGE 5: BEHAVIORAL PERSONALITY MAPPING */}
                <section className="dossier-page">
                    <div className="dossier-section-header border-secondary">
                        <h2 className="text-2xl font-bold uppercase">Behavioral Architecture</h2>
                        <p className="text-xs opacity-50 tracking-wider">Psychometric Trait Distribution</p>
                    </div>
                    <div className="flex-1 flex flex-col justify-center gap-12">
                        <div className="w-full">
                            <ReportBarChart data={data.charts.barChart} isPrinting={isPrinting} />
                        </div>
                        <div className="bg-background/20 p-6 rounded-lg border border-foreground/10 mt-8">
                            <p className="text-sm italic opacity-80 leading-relaxed">
                                Unlike cognitive aptitude, which measures raw processing power, the behavioral architecture maps how that power is deployed in social, high-stress, and collaborative environments. The subject's distribution indicates their operational "comfort zone."
                            </p>
                        </div>
                    </div>
                </section>

                {/* PAGE 6: BEHAVIORAL DETAILED ANALYSIS */}
                <section className="dossier-page">
                    <div className="dossier-section-header border-secondary">
                        <h2 className="text-2xl font-bold uppercase">Psychometric Deep-Dive</h2>
                        <p className="text-xs opacity-50 tracking-wider">Core Behavioral DNA Drivers</p>
                    </div>
                    <div className="flex-1 flex flex-col justify-center space-y-8">
                        <div>
                            <h3 className="text-sm font-bold border-b border-foreground/10 pb-2 mb-6 uppercase">Genetic Behavior Mapping</h3>
                            <CareerDNA data={data.careerDNA || { analytical: 85, creative: 60, leadership: 75, research: 90, innovation: 70 }} isPrinting={isPrinting} />
                        </div>
                        <div className="grid grid-cols-2 gap-6 mt-8">
                            {Object.entries(data.careerDNA || {}).map(([key, val]) => (
                                <div key={key} className="p-4 bg-foreground/5 rounded border border-foreground/5">
                                    <div className="text-sm font-semibold mb-1">{key} Drive</div>
                                    <div className="text-xl font-bold text-secondary mb-2">{val}% Intensity</div>
                                    <p className="text-xs opacity-70">
                                        Dictates the baseline requirement for {key}-oriented stimuli in their daily operational environment.
                                    </p>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* PAGE 7: TRAIT OVERLAP + VENN SYSTEMS */}
                <section className="dossier-page">
                    <div className="dossier-section-header">
                        <h2 className="text-2xl font-bold uppercase">Synergistic Intersections</h2>
                        <p className="text-xs opacity-50 tracking-wider">Cognitive Venn Intelligence</p>
                    </div>
                    <div className="flex-1 flex flex-col justify-center gap-12">
                        <p className="text-sm opacity-80 mb-4">
                            True capability is rarely derived from a single isolated trait. It is generated in the intersection of multiple highly-developed cognitive pathways.
                        </p>
                        <CognitiveVenn
                            circles={[
                                { label: 'Analytical Framework', description: 'Logic-driven', color: '#3b82f6' },
                                { label: 'Behavioral Execution', description: 'Action-driven', color: '#fbbf24' }
                            ]}
                            intersection="Optimal Output State"
                            isPrinting={isPrinting}
                        />
                        <div className="bg-primary/5 p-6 border-t border-b border-primary/20">
                            <h3 className="text-md font-bold uppercase mb-2">Intersection Dynamics</h3>
                            <p className="text-xs leading-relaxed opacity-80">
                                The overlap between their logical frameworks and execution behaviors reveals a pragmatic optimizer. They do not just analyze systems; they are compelled to implement their analytical findings into actionable protocols.
                            </p>
                        </div>
                    </div>
                </section>

                {/* PAGE 8: ARCHETYPES */}
                <section className="dossier-page">
                    <div className="dossier-section-header">
                        <h2 className="text-2xl font-bold uppercase">Subject Archetype</h2>
                        <p className="text-xs opacity-50 tracking-wider">Primary Classification Protocol</p>
                    </div>
                    <div className="flex-1 flex flex-col justify-center items-center">
                        <div className="dossier-label mb-6">Confirmed Designation</div>
                        <div className="text-6xl font-bold text-primary uppercase text-center mb-8 border-b-4 border-primary pb-4">{data.archetype.title}</div>
                        <div className="text-center max-w-xl space-y-6">
                            <p className="text-lg opacity-80 leading-relaxed font-serif italic">
                                "{data.archetype.description}"
                            </p>
                            <p className="text-sm opacity-60 leading-relaxed mt-4">
                                This archetype is characterized by an innate ability to navigate complexity. They thrive in environments where rules are defined but outcomes are highly variable, requiring constant strategic recalibration.
                            </p>
                            <div className="flex flex-wrap gap-3 justify-center mt-8">
                                {data.archetype.traits.map((t, i) => (
                                    <span key={i} className="px-4 py-2 bg-foreground/10 rounded-full text-xs font-bold tracking-wider">{t}</span>
                                ))}
                            </div>
                        </div>
                    </div>
                </section>

                {/* PAGE 9: BENCHMARK ANALYSIS */}
                <section className="dossier-page">
                    <div className="dossier-section-header">
                        <h2 className="text-2xl font-bold uppercase">Benchmark Analysis</h2>
                        <p className="text-xs opacity-50 tracking-wider">Subject vs. Ideal Paradigms</p>
                    </div>
                    <div className="flex-1 flex flex-col justify-center">
                        <p className="text-sm opacity-80 mb-12">
                            Comparing the subject's raw indices against the theoretical ideals for high-performance operational roles.
                        </p>
                        <ComparisonGraph data={data.charts.comparisonData} isPrinting={isPrinting} />
                        
                        <div className="grid grid-cols-3 gap-6 mt-16">
                            {data.charts.comparisonData.map((cd, i) => (
                                <div key={i} className="text-center p-4 border border-foreground/10 bg-foreground/5">
                                    <div className="text-xs uppercase font-bold tracking-widest opacity-50 mb-2">{cd.label} Delta</div>
                                    <div className={`text-2xl font-bold ${cd.userScore >= cd.idealScore ? 'text-green-500' : 'text-orange-500'}`}>
                                        {cd.userScore >= cd.idealScore ? '+' : ''}{(cd.userScore - cd.idealScore).toFixed(1)}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* PAGE 10: CAREER GENOME */}
                <section className="dossier-page">
                    <div className="dossier-section-header">
                        <h2 className="text-2xl font-bold uppercase">Career Genome</h2>
                        <p className="text-xs opacity-50 tracking-wider">Genetic Alignment with Global Industries</p>
                    </div>
                    <div className="flex-1 flex flex-col justify-center space-y-6">
                        <p className="text-sm opacity-80 mb-2">
                            Based on the composite analysis of aptitude, psychometrics, and behavioral DNA, the following pathways represent the path of least resistance to maximal professional success:
                        </p>
                        <div className="space-y-4">
                            {data.careerMatches.map((match, i) => (
                                <div key={i} className="p-6 bg-primary/5 border-l-4 border-primary flex flex-col justify-center">
                                    <div className="flex justify-between items-center mb-2">
                                        <span className="font-bold text-lg uppercase tracking-wide">{match.career}</span>
                                        <span className="text-xl font-mono font-bold text-primary">{match.score}% MATCH</span>
                                    </div>
                                    <p className="text-xs opacity-70 leading-relaxed">{match.description}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* PAGE 11: SKILL ACQUISITION PATHWAY */}
                <section className="dossier-page">
                    <div className="dossier-section-header">
                        <h2 className="text-2xl font-bold uppercase">Learning Pathway</h2>
                        <p className="text-xs opacity-50 tracking-wider">Optimal Data Ingestion Protocols</p>
                    </div>
                    <div className="flex-1 flex flex-col justify-center space-y-8">
                        <p className="text-sm opacity-80">
                            Understanding *what* the subject should do is secondary to understanding *how* they learn to do it. The following represents their optimal educational vector:
                        </p>
                        
                        <div className="p-6 border border-foreground/10 bg-white/5 space-y-4">
                            <h3 className="text-md font-bold uppercase text-primary">Primary Acquisition Modality</h3>
                            <p className="text-sm leading-relaxed">
                                The subject absorbs complex structures best through abstract deconstruction followed by applied repetition. They should avoid rote memorization environments and seek out project-based, conceptual frameworks.
                            </p>
                        </div>

                        <div className="grid grid-cols-2 gap-6">
                            <div className="p-5 bg-foreground/5">
                                <h4 className="font-bold text-xs uppercase mb-2">Recommended Formats</h4>
                                <ul className="text-xs space-y-2 opacity-80">
                                    <li>• Algorithmic problem solving</li>
                                    <li>• Deep-work isolation sprints</li>
                                    <li>• Systems architecture mapping</li>
                                </ul>
                            </div>
                            <div className="p-5 bg-foreground/5">
                                <h4 className="font-bold text-xs uppercase mb-2">Sub-Optimal Formats</h4>
                                <ul className="text-xs space-y-2 opacity-80">
                                    <li>• Heavy semantic reading</li>
                                    <li>• Passive lecture consumption</li>
                                    <li>• Highly subjective debate forums</li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </section>

                {/* PAGE 12: STRATEGIC ROADMAP */}
                <section className="dossier-page">
                    <div className="dossier-section-header">
                        <h2 className="text-2xl font-bold uppercase">Strategic Roadmap</h2>
                        <p className="text-xs opacity-50 tracking-wider">Final Recommendations & Execution</p>
                    </div>
                    <div className="flex-1 flex flex-col justify-between pt-8">
                        <div className="space-y-8">
                            <div className="grid grid-cols-3 gap-6">
                                <div className="p-6 border border-foreground/10 rounded-sm">
                                    <div className="text-primary font-bold mb-2 text-sm">PHASE 01: EXPLORATION</div>
                                    <p className="text-sm opacity-70 leading-relaxed">Focus on foundational skill acquisition and broad mental model development. Identify core constraints.</p>
                                </div>
                                <div className="p-6 border border-foreground/10 rounded-sm">
                                    <div className="text-primary font-bold mb-2 text-sm">PHASE 02: SPECIALIZATION</div>
                                    <p className="text-sm opacity-70 leading-relaxed">Deep-dive into preferred career DNA clusters. Begin eliminating extraneous vectors to focus energy.</p>
                                </div>
                                <div className="p-6 border border-foreground/10 rounded-sm">
                                    <div className="text-primary font-bold mb-2 text-sm">PHASE 03: MASTERY</div>
                                    <p className="text-sm opacity-70 leading-relaxed">Professional placement and leadership trajectory initiation. Execute primary archetype strengths.</p>
                                </div>
                            </div>
                            <div className="bg-primary text-primary-foreground p-10 rounded-lg shadow-xl mt-12">
                                <h3 className="text-xl font-bold mb-4 tracking-wider border-b border-primary-foreground/20 pb-4">Conclusion Directive</h3>
                                <p className="text-md leading-relaxed font-serif">
                                    The subject is highly recommended for high-complexity analytical environments. Their primary mandate should be to find roles that allow autonomy in problem-solving. By developing their secondary soft-skill communication layers, they can effectively bridge the gap between technical logic depth and organizational leadership, maximizing their overall global index impact.
                                </p>
                            </div>
                        </div>
                        
                        <div className="text-xs opacity-30 uppercase tracking-[0.5em] text-center mt-12 pb-4">
                            End of Confidential Psychological Report // Maestro Career
                        </div>
                    </div>
                </section>

            </div>
        </MotionConfig>
    );
}
