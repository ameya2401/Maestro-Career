"use client";

import React, { useEffect, useState } from "react";
import { MotionConfig } from "framer-motion";
import { ReportData } from "@/types/report";
import ReportRadarChart from "../charts/ReportRadarChart";
import ComparisonGraph from "../charts/ComparisonGraph";

interface ReportViewerProps {
    data: ReportData;
    isPrinting?: boolean;
}

/* ── tiny helper ── */
const Footer = ({ page }: { page: number }) => (
    <div className="dossier-footer">
        <span>Maestro Career &copy; {new Date().getFullYear()}</span>
        <span>Confidential</span>
        <span>Page {page} of 13</span>
    </div>
);

export default function ReportViewer({ data, isPrinting = false }: ReportViewerProps) {
    const [isMounted, setIsMounted] = useState(false);
    useEffect(() => { setIsMounted(true); }, []);
    if (!isMounted) return null;

    const overallScore = data.charts?.comparisonData?.find(d => d.label === 'Overall')?.userScore || 85;

    /* ── find top aptitude key ── */
    const aptEntries = Object.entries(data.aptitudeScores);
    const topApt = aptEntries.length > 0
        ? aptEntries.reduce((a, b) => (Number(b[1]) > Number(a[1]) ? b : a))
        : ["N/A", 0];

    return (
        <MotionConfig transition={{ duration: isPrinting ? 0 : 0.4 }}>
            <div className={`report-container ${isPrinting ? 'bg-white' : 'bg-[#0a0a0a] py-12'}`}>

                {/* ═══════════════════════════════════════════════
                    PAGE 1 — COVER
                ═══════════════════════════════════════════════ */}
                <section className="dossier-page" style={{ justifyContent: 'center', alignItems: 'center', textAlign: 'center' }}>
                    <div style={{ position: 'absolute', top: '20mm', left: '20mm', right: '20mm', borderTop: '1px solid #ddd' }} />

                    <div style={{ marginBottom: '3rem' }}>
                        <div style={{ fontSize: '9pt', letterSpacing: '0.25em', textTransform: 'uppercase', color: '#999', marginBottom: '2rem' }}>
                            Maestro Career &middot; Psychometric &amp; Aptitude Division
                        </div>
                        <h1 className="dossier-title" style={{ fontSize: '54pt', color: '#030712', lineHeight: 1 }}>
                            Your Career<br />Report
                        </h1>
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
                    <div>
                        <div className="dossier-label">Overall Index</div>
                        <div style={{ fontSize: '13pt', fontWeight: 700, marginTop: '4px', color: '#1294DD' }}>{overallScore}/100</div>
                    </div>

                    <div style={{ position: 'absolute', bottom: '22mm', left: 0, right: 0, textAlign: 'center', fontSize: '7pt', letterSpacing: '0.2em', textTransform: 'uppercase', color: '#bbb' }}>
                        www.maestrocareer.com
                    </div>
                </section>

                {/* ═══════════════════════════════════════════════
                    PAGE 2 — EXECUTIVE SUMMARY
                ═══════════════════════════════════════════════ */}
                <section className="dossier-page">
                    <div className="dossier-section-header border-primary">
                        <h2 className="text-2xl font-bold uppercase">Executive Summary</h2>
                        <p className="text-xs opacity-50 tracking-wider">High-Level Architectural Overview</p>
                    </div>

                    <div className="dossier-body" style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: '1.5rem' }}>
                        <p>
                            This report presents the findings of a structured psychometric and aptitude assessment
                            conducted on the above-named subject. The evaluation covered cognitive reasoning,
                            analytical ability, behavioural disposition, and professional inclination to form a
                            comprehensive profile of the individual&apos;s natural strengths and development needs.
                        </p>

                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem', marginTop: '1rem' }}>
                            <div>
                                <h3 style={{ fontSize: '10pt', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.75rem', fontFamily: 'var(--font-inter), sans-serif' }}>
                                    Core Strengths
                                </h3>
                                <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                                    {data.strengths.map((s, i) => (
                                        <li key={i} className="dossier-body-sm" style={{ marginBottom: '0.5rem', paddingLeft: '1rem', borderLeft: '2px solid #1294DD' }}>{s}</li>
                                    ))}
                                </ul>
                            </div>
                            <div>
                                <h3 style={{ fontSize: '10pt', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.75rem', fontFamily: 'var(--font-inter), sans-serif' }}>
                                    Areas for Development
                                </h3>
                                <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                                    {data.improvementAreas.map((a, i) => (
                                        <li key={i} className="dossier-body-sm" style={{ marginBottom: '0.5rem', paddingLeft: '1rem', borderLeft: '2px solid #e74c3c' }}>{a}</li>
                                    ))}
                                </ul>
                            </div>
                        </div>

                        <p className="dossier-body-sm" style={{ marginTop: '1.5rem', padding: '1rem', background: '#f8f8f8', borderLeft: '3px solid #1294DD' }}>
                            The subject demonstrates strong capacity across multiple cognitive dimensions.
                            The following pages present detailed aptitude metrics, personality traits,
                            career alignment data, and a personalised strategic roadmap.
                        </p>
                    </div>
                    <Footer page={2} />
                </section>

                {/* ═══════════════════════════════════════════════
                    PAGE 3 — APTITUDE RADAR
                ═══════════════════════════════════════════════ */}
                <section className="dossier-page">
                    <div className="dossier-section-header border-primary">
                        <h2 className="text-2xl font-bold uppercase">Cognitive Foundation</h2>
                        <p className="text-xs opacity-50 tracking-wider">Multi-dimensional Aptitude Mapping</p>
                    </div>

                    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
                        <div style={{ width: '100%', maxWidth: '520px' }}>
                            <ReportRadarChart data={data.charts.radarChart} isPrinting={isPrinting} />
                        </div>
                        <p className="dossier-body-sm" style={{ textAlign: 'center', maxWidth: '480px', marginTop: '2rem' }}>
                            The radar chart above maps the subject&apos;s cognitive bandwidth across core assessment domains.
                            Outward peaks indicate areas of natural proficiency; inward valleys suggest opportunity for targeted development.
                        </p>
                    </div>
                    <Footer page={3} />
                </section>

                {/* ═══════════════════════════════════════════════
                    PAGE 4 — APTITUDE SCORE BREAKDOWN
                ═══════════════════════════════════════════════ */}
                <section className="dossier-page">
                    <div className="dossier-section-header border-primary">
                        <h2 className="text-2xl font-bold uppercase">Cognitive Deep-Dive</h2>
                        <p className="text-xs opacity-50 tracking-wider">Aptitude Vector Breakdown</p>
                    </div>

                    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: '1.25rem' }}>
                        {Object.entries(data.aptitudeScores).map(([key, value]) => (
                            <div key={key} className="border-b border-foreground/10 pb-4">
                                <div className="flex justify-between items-end mb-2">
                                    <h3 className="text-sm font-semibold tracking-wide">{key.replace(/_/g, ' ')}</h3>
                                    <span className="text-2xl font-bold text-primary">{value}%</span>
                                </div>
                                <div style={{ width: '100%', background: '#f0f0f0', height: '6px', borderRadius: '3px', overflow: 'hidden' }}>
                                    <div style={{ width: `${value}%`, background: '#1294DD', height: '100%', borderRadius: '3px' }} />
                                </div>
                                <p className="dossier-body-sm" style={{ marginTop: '0.4rem', fontSize: '8.5pt' }}>
                                    {Number(value) > 75
                                        ? `Strong proficiency. The subject handles ${key.replace(/_/g, ' ').toLowerCase()} tasks with confidence and speed.`
                                        : `Developing proficiency. Focused practice in ${key.replace(/_/g, ' ').toLowerCase()} will yield measurable improvement.`}
                                </p>
                            </div>
                        ))}
                    </div>
                    <Footer page={4} />
                </section>

                {/* ═══════════════════════════════════════════════
                    PAGE 5 — PSYCHOMETRIC PROFILE (Polarity Scales)
                ═══════════════════════════════════════════════ */}
                <section className="dossier-page">
                    <div className="dossier-section-header border-secondary">
                        <h2 className="text-2xl font-bold uppercase">Behavioral Architecture</h2>
                        <p className="text-xs opacity-50 tracking-wider">Psychometric Trait Distribution</p>
                    </div>

                    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: '1.5rem' }}>
                        <p className="dossier-body">
                            While aptitude measures raw cognitive ability, the personality profile captures how that ability
                            is expressed in real-world contexts — under pressure, in teams, and in unfamiliar situations.
                        </p>

                        {Object.entries(data.careerDNA || {}).map(([key, val]) => {
                            const opposite: Record<string, string> = {
                                analytical: 'Intuitive', creative: 'Systematic', leadership: 'Collaborative',
                                research: 'Applied', innovation: 'Conventional'
                            };
                            return (
                                <div key={key} style={{ marginBottom: '0.5rem' }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '8pt', textTransform: 'uppercase', letterSpacing: '0.08em', fontWeight: 700, color: '#666', marginBottom: '0.35rem' }}>
                                        <span>{opposite[key] || 'Low'}</span>
                                        <span style={{ fontWeight: 800, color: '#030712' }}>{key}</span>
                                    </div>
                                    <div style={{ position: 'relative', width: '100%', height: '8px', background: '#f0f0f0', borderRadius: '4px' }}>
                                        <div style={{ position: 'absolute', left: `${val}%`, top: '-3px', width: '14px', height: '14px', borderRadius: '50%', background: '#1294DD', border: '2px solid white', boxShadow: '0 1px 4px rgba(0,0,0,0.2)', transform: 'translateX(-50%)' }} />
                                        <div style={{ width: `${val}%`, height: '100%', background: 'linear-gradient(90deg, #e0e0e0, #1294DD)', borderRadius: '4px' }} />
                                    </div>
                                    <div style={{ textAlign: 'right', fontSize: '8pt', color: '#1294DD', fontWeight: 700, marginTop: '2px' }}>{val}%</div>
                                </div>
                            );
                        })}
                    </div>
                    <Footer page={5} />
                </section>

                {/* ═══════════════════════════════════════════════
                    PAGE 6 — PERSONALITY TRAITS
                ═══════════════════════════════════════════════ */}
                <section className="dossier-page">
                    <div className="dossier-section-header border-secondary">
                        <h2 className="text-2xl font-bold uppercase">Psychometric Deep-Dive</h2>
                        <p className="text-xs opacity-50 tracking-wider">Core Behavioral DNA Drivers</p>
                    </div>

                    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.25rem' }}>
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
                    <Footer page={6} />
                </section>

                {/* ═══════════════════════════════════════════════
                    PAGE 7 — SKILLS MATCH
                ═══════════════════════════════════════════════ */}
                <section className="dossier-page">
                    <div className="dossier-section-header">
                        <h2 className="text-2xl font-bold uppercase">Synergistic Intersections</h2>
                        <p className="text-xs opacity-50 tracking-wider">Cognitive Venn Intelligence</p>
                    </div>

                    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: '2rem' }}>
                        <p className="dossier-body">
                            The most reliable indicator of career success is found not in any single trait, but at the
                            intersection of multiple well-developed abilities. The following analysis identifies where
                            analytical thinking and personality tendencies converge, creating your unique advantage.
                        </p>

                        <div style={{ display: 'flex', justifyContent: 'center' }}>
                            <svg viewBox="0 0 400 220" width="400" height="220" style={{ maxWidth: '100%' }}>
                                <circle cx="155" cy="110" r="85" fill="rgba(18,148,221,0.12)" stroke="#1294DD" strokeWidth="1.5" />
                                <circle cx="245" cy="110" r="85" fill="rgba(251,191,36,0.12)" stroke="#fbbf24" strokeWidth="1.5" />
                                <text x="120" y="105" textAnchor="middle" fontSize="9" fontWeight="700" fill="#1294DD" style={{ textTransform: 'uppercase', letterSpacing: '0.05em' }}>Analytical</text>
                                <text x="120" y="120" textAnchor="middle" fontSize="8" fill="#888">Thinking</text>
                                <text x="280" y="105" textAnchor="middle" fontSize="9" fontWeight="700" fill="#d97706" style={{ textTransform: 'uppercase', letterSpacing: '0.05em' }}>Personality</text>
                                <text x="280" y="120" textAnchor="middle" fontSize="8" fill="#888">Execution</text>
                                <text x="200" y="105" textAnchor="middle" fontSize="8" fontWeight="800" fill="#030712" style={{ textTransform: 'uppercase' }}>Optimal</text>
                                <text x="200" y="118" textAnchor="middle" fontSize="8" fontWeight="800" fill="#030712" style={{ textTransform: 'uppercase' }}>Zone</text>
                            </svg>
                        </div>

                        <p className="dossier-body-sm" style={{ padding: '1rem', background: '#f8f8f8', borderLeft: '3px solid #1294DD' }}>
                            The subject&apos;s overlap zone indicates a practical problem-solver — someone who analyses
                            situations thoroughly and then acts on those findings with decisiveness. This combination
                            is particularly valuable in consulting, engineering, and strategic management roles.
                        </p>
                    </div>
                    <Footer page={7} />
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
                                &quot;{data.archetype.description}&quot;
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
                    <Footer page={8} />
                </section>

                {/* ═══════════════════════════════════════════════
                    PAGE 9 — BENCHMARK COMPARISON
                ═══════════════════════════════════════════════ */}
                <section className="dossier-page">
                    <div className="dossier-section-header">
                        <h2 className="text-2xl font-bold uppercase">Benchmark Analysis</h2>
                        <p className="text-xs opacity-50 tracking-wider">Subject vs. Ideal Paradigms</p>
                    </div>

                    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
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
                    <Footer page={9} />
                </section>

                {/* ═══════════════════════════════════════════════
                    PAGE 10 — CAREER ALIGNMENT
                ═══════════════════════════════════════════════ */}
                <section className="dossier-page">
                    <div className="dossier-section-header">
                        <h2 className="text-2xl font-bold uppercase">Career Genome</h2>
                        <p className="text-xs opacity-50 tracking-wider">Genetic Alignment with Global Industries</p>
                    </div>

                    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: '0.75rem' }}>
                        <p className="dossier-body" style={{ marginBottom: '1rem' }}>
                            Based on the composite analysis of aptitude scores and personality traits,
                            the following career paths represent the strongest alignment with your profile:
                        </p>
                        <div className="space-y-4">
                            {data.careerMatches.map((match, i) => (
                                <div key={i} className="p-6 bg-primary/5 border-l-4 border-primary flex items-center justify-between">
                                    <div style={{ flex: 1 }}>
                                        <div style={{ fontSize: '11pt', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.02em' }}>{match.career}</div>
                                        <p className="dossier-body-sm" style={{ marginTop: '0.25rem', fontSize: '8pt' }}>{match.description}</p>
                                    </div>
                                    <div style={{ fontSize: '16pt', fontWeight: 900, color: '#1294DD', flexShrink: 0 }}>{match.score}%</div>
                                </div>
                            ))}
                        </div>
                    </div>
                    <Footer page={10} />
                </section>

                {/* ═══════════════════════════════════════════════
                    PAGE 11 — CAREER COMPARISON (5-Circle Venn)
                ═══════════════════════════════════════════════ */}
                <section className="dossier-page">
                    <div className="dossier-section-header">
                        <h2 className="text-2xl font-bold uppercase">Career Comparison</h2>
                        <p className="text-xs opacity-50 tracking-wider">Best vs Good vs Poor Career Fits</p>
                    </div>

                    <p className="dossier-body-sm" style={{ marginBottom: '1rem', color: '#555' }}>
                        Not every career is right for every person. This diagram compares your <strong>best-fit</strong>,
                        <strong> good-fit</strong>, and <strong>poor-fit</strong> career options based on your aptitude scores,
                        personality traits, and overall profile alignment.
                    </p>

                    {(() => {
                        const bestCareer = data.careerMatches[0]?.career ?? 'Best Career';
                        const goodCareers = data.recommendations.alternativeCareers.slice(0, 2);
                        const badCareers = (data.recommendations.badCareers ?? []).slice(0, 4);

                        return (
                            <div style={{ display: 'flex', justifyContent: 'center', margin: '0.5rem 0' }}>
                                <svg viewBox="0 0 480 380" width="420" height="320" style={{ fontFamily: 'var(--font-inter), sans-serif' }}>
                                    <circle cx="240" cy="100" r="72" fill="rgba(239,68,68,0.07)" stroke="#ef4444" strokeWidth="1.5" />
                                    <circle cx="240" cy="280" r="72" fill="rgba(239,68,68,0.07)" stroke="#ef4444" strokeWidth="1.5" />
                                    <circle cx="130" cy="190" r="72" fill="rgba(239,68,68,0.07)" stroke="#ef4444" strokeWidth="1.5" />
                                    <circle cx="350" cy="190" r="72" fill="rgba(239,68,68,0.07)" stroke="#ef4444" strokeWidth="1.5" />
                                    <circle cx="240" cy="190" r="60" fill="rgba(22,163,74,0.12)" stroke="#16a34a" strokeWidth="2" />

                                    <text x="240" y="62" textAnchor="middle" fontSize="7.5" fontWeight="700" fill="#dc2626" style={{ textTransform: 'uppercase', letterSpacing: '0.04em' }}>{badCareers[0]?.career ?? 'Poor Fit 1'}</text>
                                    <text x="240" y="74" textAnchor="middle" fontSize="6.5" fill="#999">{badCareers[0]?.score ?? 20}% match</text>

                                    <text x="240" y="318" textAnchor="middle" fontSize="7.5" fontWeight="700" fill="#dc2626" style={{ textTransform: 'uppercase', letterSpacing: '0.04em' }}>{badCareers[1]?.career ?? 'Poor Fit 2'}</text>
                                    <text x="240" y="330" textAnchor="middle" fontSize="6.5" fill="#999">{badCareers[1]?.score ?? 20}% match</text>

                                    <text x="80" y="188" textAnchor="middle" fontSize="7.5" fontWeight="700" fill="#dc2626" style={{ textTransform: 'uppercase', letterSpacing: '0.04em' }}>{badCareers[2]?.career ?? 'Poor Fit 3'}</text>
                                    <text x="80" y="200" textAnchor="middle" fontSize="6.5" fill="#999">{badCareers[2]?.score ?? 20}% match</text>

                                    <text x="400" y="188" textAnchor="middle" fontSize="7.5" fontWeight="700" fill="#dc2626" style={{ textTransform: 'uppercase', letterSpacing: '0.04em' }}>{badCareers[3]?.career ?? 'Poor Fit 4'}</text>
                                    <text x="400" y="200" textAnchor="middle" fontSize="6.5" fill="#999">{badCareers[3]?.score ?? 30}% match</text>

                                    <text x="240" y="136" textAnchor="middle" fontSize="7.5" fontWeight="700" fill="#d97706" style={{ textTransform: 'uppercase', letterSpacing: '0.04em' }}>{goodCareers[0] ?? 'Good Fit 1'}</text>
                                    <text x="240" y="248" textAnchor="middle" fontSize="7.5" fontWeight="700" fill="#d97706" style={{ textTransform: 'uppercase', letterSpacing: '0.04em' }}>{goodCareers[1] ?? 'Good Fit 2'}</text>

                                    <text x="240" y="183" textAnchor="middle" fontSize="10" fontWeight="900" fill="#15803d" style={{ textTransform: 'uppercase', letterSpacing: '0.04em' }}>{bestCareer}</text>
                                    <text x="240" y="198" textAnchor="middle" fontSize="8" fontWeight="700" fill="#16a34a">{data.careerMatches[0]?.score ?? 95}% match</text>
                                    <text x="240" y="212" textAnchor="middle" fontSize="7" fill="#555">Best Fit</text>
                                </svg>
                            </div>
                        );
                    })()}

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '0.75rem', marginTop: '0.5rem' }}>
                        <div style={{ padding: '0.75rem', background: 'rgba(22,163,74,0.08)', borderLeft: '3px solid #16a34a' }}>
                            <div style={{ fontSize: '7pt', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: '#15803d', marginBottom: '0.4rem' }}>Best Fit (Centre)</div>
                            <p style={{ fontSize: '7.5pt', lineHeight: 1.5, color: '#333', margin: 0 }}>
                                Your aptitude scores, personality traits, and natural strengths all converge strongly with this career.
                            </p>
                        </div>
                        <div style={{ padding: '0.75rem', background: 'rgba(217,119,6,0.08)', borderLeft: '3px solid #d97706' }}>
                            <div style={{ fontSize: '7pt', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: '#b45309', marginBottom: '0.4rem' }}>Good Fit (Overlap)</div>
                            <p style={{ fontSize: '7.5pt', lineHeight: 1.5, color: '#333', margin: 0 }}>
                                These careers share significant overlap with your core strengths but require building 1–2 additional skills.
                            </p>
                        </div>
                        <div style={{ padding: '0.75rem', background: 'rgba(239,68,68,0.06)', borderLeft: '3px solid #ef4444' }}>
                            <div style={{ fontSize: '7pt', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: '#dc2626', marginBottom: '0.4rem' }}>Poor Fit (Outer)</div>
                            <p style={{ fontSize: '7.5pt', lineHeight: 1.5, color: '#333', margin: 0 }}>
                                Your aptitude scores or personality traits are significantly misaligned with these careers.
                            </p>
                        </div>
                    </div>

                    {(data.recommendations.badCareers ?? []).length > 0 && (
                        <div style={{ marginTop: '0.75rem' }}>
                            <h3 style={{ fontSize: '8pt', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: '#dc2626', marginBottom: '0.5rem' }}>
                                Why These Careers Are a Poor Fit
                            </h3>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem' }}>
                                {(data.recommendations.badCareers ?? []).map((bc, i) => (
                                    <div key={i} style={{ padding: '0.6rem', background: '#fef2f2', fontSize: '7.5pt', lineHeight: 1.5, color: '#333' }}>
                                        <strong style={{ color: '#b91c1c' }}>{bc.career} ({bc.score}%)</strong>
                                        <span style={{ display: 'block', marginTop: '0.15rem' }}>{bc.reason}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    <Footer page={11} />
                </section>

                {/* ═══════════════════════════════════════════════
                    PAGE 12 — IDEAL LEARNING ENVIRONMENT
                ═══════════════════════════════════════════════ */}
                <section className="dossier-page">
                    <div style={{ borderBottom: '2px solid #030712', paddingBottom: '0.75rem', marginBottom: '1.5rem' }}>
                        <h2 style={{ fontSize: '20pt', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '-0.02em' }}>Ideal Learning Environment</h2>
                        <p style={{ fontSize: '8pt', textTransform: 'uppercase', letterSpacing: '0.1em', color: '#999', marginTop: '0.25rem' }}>How the Subject Learns Best</p>
                    </div>

                    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: '2rem' }}>
                        <p className="dossier-body">
                            Understanding what to pursue is only part of the equation. How the individual absorbs
                            and processes new information is equally critical to long-term success.
                        </p>

                        <div style={{ padding: '1.5rem', background: '#f8f8f8', borderLeft: '4px solid #1294DD' }}>
                            <h3 style={{ fontSize: '10pt', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.75rem' }}>Recommended Approaches</h3>
                            <ul className="dossier-body-sm" style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                                <li style={{ paddingLeft: '0.75rem', borderLeft: '2px solid #1294DD' }}>Project-based, hands-on problem solving</li>
                                <li style={{ paddingLeft: '0.75rem', borderLeft: '2px solid #1294DD' }}>Deep-focus individual study sessions</li>
                                <li style={{ paddingLeft: '0.75rem', borderLeft: '2px solid #1294DD' }}>Visual and diagrammatic learning materials</li>
                                <li style={{ paddingLeft: '0.75rem', borderLeft: '2px solid #1294DD' }}>Structured mentorship with clear milestones</li>
                            </ul>
                        </div>

                        <div style={{ padding: '1.5rem', background: '#fef8f8', borderLeft: '4px solid #e74c3c' }}>
                            <h3 style={{ fontSize: '10pt', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.75rem' }}>Approaches to Avoid</h3>
                            <ul className="dossier-body-sm" style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                                <li style={{ paddingLeft: '0.75rem', borderLeft: '2px solid #e74c3c' }}>Rote memorisation without context</li>
                                <li style={{ paddingLeft: '0.75rem', borderLeft: '2px solid #e74c3c' }}>Passive lecture-only formats</li>
                                <li style={{ paddingLeft: '0.75rem', borderLeft: '2px solid #e74c3c' }}>Unstructured, open-ended group discussions</li>
                            </ul>
                        </div>
                    </div>
                    <Footer page={12} />
                </section>

                {/* ═══════════════════════════════════════════════
                    PAGE 13 — STRATEGIC ROADMAP & CONCLUSION
                ═══════════════════════════════════════════════ */}
                <section className="dossier-page">
                    <div className="dossier-section-header">
                        <h2 className="text-2xl font-bold uppercase">Strategic Roadmap</h2>
                        <p className="text-xs opacity-50 tracking-wider">Final Recommendations &amp; Execution</p>
                    </div>
                    <div className="flex-1 flex flex-col justify-between pt-8">
                        <div className="space-y-8">
                            <div className="grid grid-cols-3 gap-6">
                                <div className="p-6 border border-foreground/10 rounded-sm">
                                    <div className="text-primary font-bold mb-2 text-sm">PHASE 01: EXPLORATION</div>
                                    <p className="text-sm opacity-70 leading-relaxed">Focus on foundational skill acquisition and broad mental model development.</p>
                                </div>
                                <div className="p-6 border border-foreground/10 rounded-sm">
                                    <div className="text-primary font-bold mb-2 text-sm">PHASE 02: SPECIALIZATION</div>
                                    <p className="text-sm opacity-70 leading-relaxed">Deep-dive into preferred career DNA clusters. Begin eliminating extraneous vectors.</p>
                                </div>
                                <div className="p-6 border border-foreground/10 rounded-sm">
                                    <div className="text-primary font-bold mb-2 text-sm">PHASE 03: MASTERY</div>
                                    <p className="text-sm opacity-70 leading-relaxed">Professional placement and leadership trajectory initiation.</p>
                                </div>
                            </div>
                            <div className="bg-primary text-primary-foreground p-10 rounded-lg shadow-xl mt-12">
                                <h3 className="text-xl font-bold mb-4 tracking-wider border-b border-primary-foreground/20 pb-4">Conclusion Directive</h3>
                                <p className="text-md leading-relaxed font-serif">
                                    The subject is highly recommended for high-complexity analytical environments. Their primary mandate should be to find roles that allow autonomy in problem-solving. By developing their secondary soft-skill communication layers, they can effectively bridge the gap between technical logic depth and organizational leadership.
                                </p>
                            </div>
                        </div>

                        <div className="text-xs opacity-30 uppercase tracking-[0.5em] text-center mt-12 pb-4">
                            End of Confidential Psychological Report // Maestro Career
                        </div>
                    </div>

                    <div style={{ textAlign: 'center', marginTop: 'auto', paddingTop: '1rem', fontSize: '7pt', letterSpacing: '0.15em', textTransform: 'uppercase', color: '#bbb' }}>
                        End of Report &middot; Maestro Career &copy; {new Date().getFullYear()}
                    </div>
                </section>

            </div>
        </MotionConfig>
    );
}
