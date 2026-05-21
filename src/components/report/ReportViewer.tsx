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
        <span>Page {page} of 12</span>
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
                    PAGE 1 — COVER  (McKinsey-style centered)
                ═══════════════════════════════════════════════ */}
                <section className="dossier-page" style={{ justifyContent: 'center', alignItems: 'center', textAlign: 'center' }}>
                    {/* Thin top rule */}
                    <div style={{ position: 'absolute', top: '20mm', left: '20mm', right: '20mm', borderTop: '1px solid #ddd' }} />

                    <div style={{ marginBottom: '3rem' }}>
                        <div style={{ fontSize: '9pt', letterSpacing: '0.25em', textTransform: 'uppercase', color: '#999', marginBottom: '2rem' }}>
                            Maestro Career &middot; Psychometric &amp; Aptitude Division
                        </div>
                        <h1 className="dossier-title" style={{ fontSize: '54pt', color: '#030712', lineHeight: 1 }}>
                            Intelligence<br />Dossier
                        </h1>
                    </div>

                    {/* Subject bio block */}
                    <div style={{ borderTop: '2px solid #030712', borderBottom: '2px solid #030712', padding: '1.5rem 0', maxWidth: '420px', width: '100%' }}>
                        <div style={{ fontSize: '22pt', fontWeight: 800, marginBottom: '0.25rem' }}>{data.user.name}</div>
                        <div style={{ fontSize: '9pt', color: '#666' }}>{data.user.email}</div>
                        <div style={{ fontSize: '9pt', color: '#666', marginTop: '0.25rem' }}>Age {data.user.age} &middot; Class {data.user.class}</div>
                    </div>

                    {/* Date & Reference */}
                    <div style={{ marginTop: '2.5rem', display: 'flex', gap: '3rem', justifyContent: 'center' }}>
                        <div>
                            <div className="dossier-label">Report Date</div>
                            <div style={{ fontSize: '13pt', fontWeight: 700, marginTop: '4px' }}>{data.user.reportDate}</div>
                        </div>
                        <div>
                            <div className="dossier-label">Reference</div>
                            <div style={{ fontSize: '13pt', fontWeight: 700, marginTop: '4px' }}>MC-{data.user.id.slice(0, 8).toUpperCase()}</div>
                        </div>
                        <div>
                            <div className="dossier-label">Overall Index</div>
                            <div style={{ fontSize: '13pt', fontWeight: 700, marginTop: '4px', color: '#1294DD' }}>{overallScore}/100</div>
                        </div>
                    </div>

                    {/* Bottom branding */}
                    <div style={{ position: 'absolute', bottom: '22mm', left: 0, right: 0, textAlign: 'center', fontSize: '7pt', letterSpacing: '0.2em', textTransform: 'uppercase', color: '#bbb' }}>
                        www.maestrocareer.com
                    </div>
                </section>

                {/* ═══════════════════════════════════════════════
                    PAGE 2 — EXECUTIVE SUMMARY
                ═══════════════════════════════════════════════ */}
                <section className="dossier-page">
                    <div style={{ borderBottom: '2px solid #030712', paddingBottom: '0.75rem', marginBottom: '2rem' }}>
                        <h2 style={{ fontSize: '20pt', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '-0.02em' }}>Executive Summary</h2>
                    </div>

                    <div className="dossier-body" style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: '1.5rem' }}>
                        <p>
                            This report presents the findings of a structured psychometric and aptitude assessment
                            conducted on the above-named subject. The evaluation covered cognitive reasoning,
                            analytical ability, behavioural disposition, and professional inclination to form a
                            comprehensive profile of the individual&apos;s natural strengths and development needs.
                        </p>

                        {/* Two-column: Strengths / Improvement */}
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
                            The following pages present detailed aptitude metrics, behavioural mapping,
                            career alignment data, and a personalised strategic roadmap.
                        </p>
                    </div>
                    <Footer page={2} />
                </section>

                {/* ═══════════════════════════════════════════════
                    PAGE 3 — APTITUDE RADAR (Full-width chart)
                ═══════════════════════════════════════════════ */}
                <section className="dossier-page">
                    <div style={{ borderBottom: '2px solid #030712', paddingBottom: '0.75rem', marginBottom: '1.5rem' }}>
                        <h2 style={{ fontSize: '20pt', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '-0.02em' }}>Cognitive Profile</h2>
                        <p style={{ fontSize: '8pt', textTransform: 'uppercase', letterSpacing: '0.1em', color: '#999', marginTop: '0.25rem' }}>Multi-dimensional Aptitude Mapping</p>
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
                    <div style={{ borderBottom: '2px solid #030712', paddingBottom: '0.75rem', marginBottom: '1.5rem' }}>
                        <h2 style={{ fontSize: '20pt', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '-0.02em' }}>Aptitude Breakdown</h2>
                        <p style={{ fontSize: '8pt', textTransform: 'uppercase', letterSpacing: '0.1em', color: '#999', marginTop: '0.25rem' }}>Individual Score Analysis</p>
                    </div>

                    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: '1.25rem' }}>
                        {Object.entries(data.aptitudeScores).map(([key, value]) => (
                            <div key={key} style={{ paddingBottom: '1rem', borderBottom: '1px solid #eee' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '0.5rem' }}>
                                    <span style={{ fontSize: '10pt', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                                        {key.replace(/_/g, ' ')}
                                    </span>
                                    <span style={{ fontSize: '18pt', fontWeight: 900, color: '#1294DD' }}>{value}%</span>
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
                    <div style={{ borderBottom: '2px solid #030712', paddingBottom: '0.75rem', marginBottom: '1.5rem' }}>
                        <h2 style={{ fontSize: '20pt', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '-0.02em' }}>Behavioural Profile</h2>
                        <p style={{ fontSize: '8pt', textTransform: 'uppercase', letterSpacing: '0.1em', color: '#999', marginTop: '0.25rem' }}>Psychometric Trait Distribution</p>
                    </div>

                    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: '1.5rem' }}>
                        <p className="dossier-body">
                            While aptitude measures raw cognitive ability, the behavioural profile captures how that ability
                            is expressed in real-world contexts — under pressure, in teams, and in unfamiliar situations.
                        </p>

                        {/* Polarity-style scales */}
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
                    PAGE 6 — PSYCHOMETRIC DNA
                ═══════════════════════════════════════════════ */}
                <section className="dossier-page">
                    <div style={{ borderBottom: '2px solid #030712', paddingBottom: '0.75rem', marginBottom: '1.5rem' }}>
                        <h2 style={{ fontSize: '20pt', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '-0.02em' }}>Psychometric DNA</h2>
                        <p style={{ fontSize: '8pt', textTransform: 'uppercase', letterSpacing: '0.1em', color: '#999', marginTop: '0.25rem' }}>Core Behavioural Drivers</p>
                    </div>

                    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                        {/* Horizontal DNA bar visualisation */}
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.25rem' }}>
                            {Object.entries(data.careerDNA || {}).map(([key, val]) => (
                                <div key={key} style={{ padding: '1.25rem', background: '#fafafa', borderLeft: `4px solid ${Number(val) > 70 ? '#1294DD' : '#ddd'}` }}>
                                    <div style={{ fontSize: '8pt', textTransform: 'uppercase', letterSpacing: '0.08em', fontWeight: 700, color: '#888', marginBottom: '0.25rem' }}>
                                        {key} Orientation
                                    </div>
                                    <div style={{ fontSize: '22pt', fontWeight: 900, color: Number(val) > 70 ? '#1294DD' : '#333' }}>{val}%</div>
                                    <p className="dossier-body-sm" style={{ marginTop: '0.5rem', fontSize: '8pt' }}>
                                        {Number(val) > 70
                                            ? `The subject shows a strong natural inclination toward ${key}-oriented work and decision-making.`
                                            : `This dimension is present but not dominant. It acts as a supporting trait rather than a leading driver.`}
                                    </p>
                                </div>
                            ))}
                        </div>
                    </div>
                    <Footer page={6} />
                </section>

                {/* ═══════════════════════════════════════════════
                    PAGE 7 — CORE COMPETENCY OVERLAP
                ═══════════════════════════════════════════════ */}
                <section className="dossier-page">
                    <div style={{ borderBottom: '2px solid #030712', paddingBottom: '0.75rem', marginBottom: '1.5rem' }}>
                        <h2 style={{ fontSize: '20pt', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '-0.02em' }}>Core Competency Overlap</h2>
                        <p style={{ fontSize: '8pt', textTransform: 'uppercase', letterSpacing: '0.1em', color: '#999', marginTop: '0.25rem' }}>Where Aptitude Meets Behaviour</p>
                    </div>

                    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: '2rem' }}>
                        <p className="dossier-body">
                            The most reliable indicator of career success is found not in any single trait, but at the
                            intersection of multiple well-developed abilities. The following analysis identifies where
                            analytical thinking and behavioural tendencies converge, creating the subject&apos;s unique
                            competitive advantage.
                        </p>

                        {/* Clean SVG Venn — two overlapping circles */}
                        <div style={{ display: 'flex', justifyContent: 'center' }}>
                            <svg viewBox="0 0 400 220" width="400" height="220" style={{ maxWidth: '100%' }}>
                                <circle cx="155" cy="110" r="85" fill="rgba(18,148,221,0.12)" stroke="#1294DD" strokeWidth="1.5" />
                                <circle cx="245" cy="110" r="85" fill="rgba(251,191,36,0.12)" stroke="#fbbf24" strokeWidth="1.5" />
                                <text x="120" y="105" textAnchor="middle" fontSize="9" fontWeight="700" fill="#1294DD" style={{ textTransform: 'uppercase', letterSpacing: '0.05em' }}>Analytical</text>
                                <text x="120" y="120" textAnchor="middle" fontSize="8" fill="#888">Thinking</text>
                                <text x="280" y="105" textAnchor="middle" fontSize="9" fontWeight="700" fill="#d97706" style={{ textTransform: 'uppercase', letterSpacing: '0.05em' }}>Behavioural</text>
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

                {/* ═══════════════════════════════════════════════
                    PAGE 8 — SUBJECT ARCHETYPE
                ═══════════════════════════════════════════════ */}
                <section className="dossier-page" style={{ justifyContent: 'center', alignItems: 'center', textAlign: 'center' }}>
                    <div style={{ maxWidth: '460px' }}>
                        <div style={{ fontSize: '8pt', textTransform: 'uppercase', letterSpacing: '0.2em', color: '#999', marginBottom: '1.5rem' }}>
                            Primary Classification
                        </div>
                        <h2 style={{ fontSize: '36pt', fontWeight: 900, textTransform: 'uppercase', color: '#030712', lineHeight: 1.1, marginBottom: '1.5rem', letterSpacing: '-0.03em' }}>
                            {data.archetype.title}
                        </h2>
                        <div style={{ width: '60px', height: '3px', background: '#1294DD', margin: '0 auto 2rem auto' }} />
                        <p className="dossier-body" style={{ fontStyle: 'italic', marginBottom: '2rem' }}>
                            &ldquo;{data.archetype.description}&rdquo;
                        </p>
                        <p className="dossier-body-sm" style={{ color: '#555' }}>
                            Individuals of this archetype exhibit a consistent pattern of structured thinking
                            coupled with adaptive behaviour. They tend to thrive in environments that reward
                            both analytical depth and practical execution.
                        </p>
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', justifyContent: 'center', marginTop: '2rem' }}>
                            {data.archetype.traits.map((t, i) => (
                                <span key={i} style={{
                                    padding: '0.4rem 1rem', fontSize: '7.5pt', fontWeight: 700,
                                    textTransform: 'uppercase', letterSpacing: '0.08em',
                                    border: '1px solid #ddd', borderRadius: '2px', color: '#555'
                                }}>
                                    {t}
                                </span>
                            ))}
                        </div>
                    </div>
                    <Footer page={8} />
                </section>

                {/* ═══════════════════════════════════════════════
                    PAGE 9 — BENCHMARK COMPARISON
                ═══════════════════════════════════════════════ */}
                <section className="dossier-page">
                    <div style={{ borderBottom: '2px solid #030712', paddingBottom: '0.75rem', marginBottom: '1.5rem' }}>
                        <h2 style={{ fontSize: '20pt', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '-0.02em' }}>Benchmark Comparison</h2>
                        <p style={{ fontSize: '8pt', textTransform: 'uppercase', letterSpacing: '0.1em', color: '#999', marginTop: '0.25rem' }}>Subject Performance vs. Ideal Benchmarks</p>
                    </div>

                    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                        <ComparisonGraph data={data.charts.comparisonData} isPrinting={isPrinting} />

                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem', marginTop: '2.5rem' }}>
                            {data.charts.comparisonData.map((cd, i) => {
                                const delta = cd.userScore - cd.idealScore;
                                return (
                                    <div key={i} style={{ textAlign: 'center', padding: '1rem', background: '#fafafa' }}>
                                        <div style={{ fontSize: '7pt', textTransform: 'uppercase', letterSpacing: '0.1em', color: '#999', marginBottom: '0.35rem' }}>{cd.label}</div>
                                        <div style={{ fontSize: '20pt', fontWeight: 900, color: delta >= 0 ? '#16a34a' : '#ea580c' }}>
                                            {delta >= 0 ? '+' : ''}{delta.toFixed(1)}
                                        </div>
                                        <div style={{ fontSize: '7pt', color: '#aaa', marginTop: '2px' }}>vs. benchmark</div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                    <Footer page={9} />
                </section>

                {/* ═══════════════════════════════════════════════
                    PAGE 10 — CAREER ALIGNMENT
                ═══════════════════════════════════════════════ */}
                <section className="dossier-page">
                    <div style={{ borderBottom: '2px solid #030712', paddingBottom: '0.75rem', marginBottom: '1.5rem' }}>
                        <h2 style={{ fontSize: '20pt', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '-0.02em' }}>Career Alignment</h2>
                        <p style={{ fontSize: '8pt', textTransform: 'uppercase', letterSpacing: '0.1em', color: '#999', marginTop: '0.25rem' }}>Top Recommended Career Paths</p>
                    </div>

                    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: '0.75rem' }}>
                        <p className="dossier-body" style={{ marginBottom: '1rem' }}>
                            Based on the composite analysis of aptitude scores, psychometric traits, and behavioural DNA,
                            the following career paths represent the strongest alignment with the subject&apos;s profile:
                        </p>
                        {data.careerMatches.map((match, i) => (
                            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '1.25rem', padding: '1rem 0', borderBottom: '1px solid #eee' }}>
                                <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: '#1294DD', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '12pt', fontWeight: 900, flexShrink: 0 }}>
                                    {i + 1}
                                </div>
                                <div style={{ flex: 1 }}>
                                    <div style={{ fontSize: '11pt', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.02em' }}>{match.career}</div>
                                    <p className="dossier-body-sm" style={{ marginTop: '0.25rem', fontSize: '8pt' }}>{match.description}</p>
                                </div>
                                <div style={{ fontSize: '16pt', fontWeight: 900, color: '#1294DD', flexShrink: 0 }}>{match.score}%</div>
                            </div>
                        ))}
                    </div>
                    <Footer page={10} />
                </section>

                {/* ═══════════════════════════════════════════════
                    PAGE 11 — IDEAL LEARNING ENVIRONMENT
                ═══════════════════════════════════════════════ */}
                <section className="dossier-page">
                    <div style={{ borderBottom: '2px solid #030712', paddingBottom: '0.75rem', marginBottom: '1.5rem' }}>
                        <h2 style={{ fontSize: '20pt', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '-0.02em' }}>Ideal Learning Environment</h2>
                        <p style={{ fontSize: '8pt', textTransform: 'uppercase', letterSpacing: '0.1em', color: '#999', marginTop: '0.25rem' }}>How the Subject Learns Best</p>
                    </div>

                    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: '2rem' }}>
                        <p className="dossier-body">
                            Understanding what to pursue is only part of the equation. How the individual absorbs
                            and processes new information is equally critical to long-term success. The following
                            recommendations are based on the subject&apos;s cognitive and behavioural profile.
                        </p>

                        <div style={{ padding: '1.5rem', background: '#f8f8f8', borderLeft: '4px solid #1294DD' }}>
                            <h3 style={{ fontSize: '10pt', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.75rem', fontFamily: 'var(--font-inter), sans-serif' }}>
                                Recommended Approaches
                            </h3>
                            <ul className="dossier-body-sm" style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                                <li style={{ paddingLeft: '0.75rem', borderLeft: '2px solid #1294DD' }}>Project-based, hands-on problem solving</li>
                                <li style={{ paddingLeft: '0.75rem', borderLeft: '2px solid #1294DD' }}>Deep-focus individual study sessions</li>
                                <li style={{ paddingLeft: '0.75rem', borderLeft: '2px solid #1294DD' }}>Visual and diagrammatic learning materials</li>
                                <li style={{ paddingLeft: '0.75rem', borderLeft: '2px solid #1294DD' }}>Structured mentorship with clear milestones</li>
                            </ul>
                        </div>

                        <div style={{ padding: '1.5rem', background: '#fef8f8', borderLeft: '4px solid #e74c3c' }}>
                            <h3 style={{ fontSize: '10pt', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.75rem', fontFamily: 'var(--font-inter), sans-serif' }}>
                                Approaches to Avoid
                            </h3>
                            <ul className="dossier-body-sm" style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                                <li style={{ paddingLeft: '0.75rem', borderLeft: '2px solid #e74c3c' }}>Rote memorisation without context</li>
                                <li style={{ paddingLeft: '0.75rem', borderLeft: '2px solid #e74c3c' }}>Passive lecture-only formats</li>
                                <li style={{ paddingLeft: '0.75rem', borderLeft: '2px solid #e74c3c' }}>Unstructured, open-ended group discussions</li>
                            </ul>
                        </div>
                    </div>
                    <Footer page={11} />
                </section>

                {/* ═══════════════════════════════════════════════
                    PAGE 12 — STRATEGIC ROADMAP & CONCLUSION
                ═══════════════════════════════════════════════ */}
                <section className="dossier-page">
                    <div style={{ borderBottom: '2px solid #030712', paddingBottom: '0.75rem', marginBottom: '1.5rem' }}>
                        <h2 style={{ fontSize: '20pt', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '-0.02em' }}>Strategic Roadmap</h2>
                        <p style={{ fontSize: '8pt', textTransform: 'uppercase', letterSpacing: '0.1em', color: '#999', marginTop: '0.25rem' }}>Recommended Action Plan</p>
                    </div>

                    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: '1.5rem' }}>
                        {/* Subway-style stepped path */}
                        {[
                            { phase: '01', title: 'Exploration', desc: 'Build foundational skills. Experiment broadly across interests to confirm natural inclinations identified in this report.' },
                            { phase: '02', title: 'Specialisation', desc: 'Narrow focus to the top 2 career paths. Pursue targeted certifications, internships, or project work in those domains.' },
                            { phase: '03', title: 'Mastery', desc: 'Commit to a primary professional track. Develop leadership and communication abilities alongside core technical expertise.' },
                        ].map((step, i) => (
                            <div key={i} style={{ display: 'flex', gap: '1.25rem', alignItems: 'flex-start' }}>
                                {/* Vertical subway node */}
                                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flexShrink: 0 }}>
                                    <div style={{ width: '28px', height: '28px', borderRadius: '50%', background: '#1294DD', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '10pt', fontWeight: 900 }}>
                                        {step.phase}
                                    </div>
                                    {i < 2 && <div style={{ width: '2px', height: '40px', background: '#ddd', marginTop: '4px' }} />}
                                </div>
                                <div style={{ paddingTop: '0.2rem' }}>
                                    <div style={{ fontSize: '11pt', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.03em' }}>{step.title}</div>
                                    <p className="dossier-body-sm" style={{ marginTop: '0.35rem' }}>{step.desc}</p>
                                </div>
                            </div>
                        ))}

                        {/* Final conclusion box */}
                        <div style={{ marginTop: '1.5rem', padding: '1.5rem', background: '#030712', color: 'white' }}>
                            <h3 style={{ fontSize: '10pt', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '0.75rem', borderBottom: '1px solid rgba(255,255,255,0.15)', paddingBottom: '0.5rem' }}>
                                Conclusion
                            </h3>
                            <p style={{ fontFamily: 'var(--font-playfair), Georgia, serif', fontSize: '10pt', lineHeight: 1.7, color: 'rgba(255,255,255,0.85)' }}>
                                {data.user.name} demonstrates strong potential, particularly in{' '}
                                {topApt[0] ? String(topApt[0]).replace(/_/g, ' ').toLowerCase() : 'analytical reasoning'}{' '}
                                ({topApt[1]}%). Classified as a <strong>{data.archetype.title}</strong>, the subject
                                is well-suited for roles requiring both structured analysis and adaptive execution.
                                The recommended path forward is to deepen expertise in the top-aligned career domains
                                while actively developing supporting soft skills.
                            </p>
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
