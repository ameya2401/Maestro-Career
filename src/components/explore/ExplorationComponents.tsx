"use client";

import React, { useState } from "react";
import Image from "next/image";
import {
    Play, X, Compass, Target, LineChart,
    BrainCircuit, Users, BookOpen, Brain, Briefcase,
    ChevronRight, ChevronLeft, ArrowRight, Zap, Orbit,
    Activity, Star, ShieldCheck, Microscope
} from "lucide-react";

// --- SECTION WRAPPER ---
interface SectionProps {
    children: React.ReactNode;
    title?: string;
    subtitle?: string;
    className?: string;
    id?: string;
    light?: boolean;
}
export const SectionWrapper = ({ children, title, subtitle, className = "", id = "", light = false }: SectionProps) => (
    <section id={id} className={`py-32 px-6 md:px-12 max-w-7xl mx-auto overflow-hidden ${className}`}>
        {(title || subtitle) && (
            <div className="text-left mb-20 max-w-4xl">
                <div className="h-1 w-20 bg-primary mb-8" />
                {title && <h2 className={`text-4xl md:text-6xl font-black uppercase tracking-tighter mb-6 ${light ? 'text-[#030712]' : 'text-white'}`}>{title}</h2>}
                {subtitle && <p className={`text-xl md:text-2xl font-medium leading-relaxed opacity-60 ${light ? 'text-[#030712]' : 'text-white'}`}>{subtitle}</p>}
            </div>
        )}
        {children}
    </section>
);

// --- HERO SECTION ---
export const ExploreHero = () => {
    return (
        <div className="relative overflow-hidden bg-[#030712] pt-48 pb-32">
            <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-primary/10 to-transparent pointer-events-none" />
            <div className="absolute -top-24 -left-24 w-96 h-96 bg-primary/20 rounded-full blur-[120px] pointer-events-none" />

            <div className="max-w-7xl mx-auto px-6 relative z-10">
                <div className="flex items-center gap-3 mb-8">
                    <div className="w-10 h-[1px] bg-primary" />
                    <span className="text-[10px] uppercase font-bold tracking-[0.4em] text-primary">Intelligence Unit</span>
                </div>

                <h1 className="text-6xl md:text-9xl font-black text-white tracking-[ -0.05em] uppercase leading-[0.85] mb-12">
                    Future <br />
                    Explorer <br />
                    <span className="text-primary italic">Engine.</span>
                </h1>

                <p className="text-xl md:text-2xl text-white/60 max-w-2xl font-medium mb-16 leading-relaxed">
                    A multi-phase discovery hub designed to bridge innate potential with real-world career trajectories through advanced psychometric modeling.
                </p>

                <div className="flex flex-wrap gap-6">
                    <button
                        onClick={() => document.getElementById('discovery-matrix')?.scrollIntoView({ behavior: 'smooth' })}
                        className="bg-primary text-white px-12 py-5 rounded-full font-black text-xs uppercase tracking-widest hover:bg-white hover:text-[#030712] transition-all hover:scale-[1.05] shadow-2xl flex items-center gap-3 group"
                    >
                        Initiate Discovery <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </button>

                    <div className="flex -space-x-4">
                        {[1, 2, 3, 4].map(i => (
                            <div key={i} className="w-12 h-12 rounded-full border-2 border-[#030712] bg-slate-800 overflow-hidden">
                                <Image src={`https://i.pravatar.cc/100?img=${i + 10}`} alt="User" width={48} height={48} />
                            </div>
                        ))}
                        <div className="w-12 h-12 rounded-full border-2 border-[#030712] bg-primary flex items-center justify-center text-[10px] font-bold text-white">
                            +2k
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

// --- PERSONALITY ARCHETYPES ---
const archetypes = [
    { id: 'SA', label: 'Strategic Architect', traits: ['Systemic', 'Logical', 'Visionary'], strengths: ['Complexity Mapping', 'Strategic Foresight'], careers: ['AI Solutions Lead', 'Systems Consultant', 'Executive Director'], color: '#3b82f6', icon: <Orbit /> },
    { id: 'DL', label: 'Dynamic Leader', traits: ['Influential', 'Decisive', 'Charismatic'], strengths: ['Team Synthesis', 'Crisis Management'], careers: ['Venture Catalyst', 'Growth Strategy Head', 'CEO'], color: '#a855f7', icon: <Zap /> },
    { id: 'MSE', label: 'Systems Engineer', traits: ['Precise', 'Iterative', 'Structural'], strengths: ['Optimization', 'Logic Verification'], careers: ['Quant Researcher', 'Security Architect', 'Lead Dev'], color: '#10b981', icon: <ShieldCheck /> },
];

export const PersonalityTree = () => {
    const [selected, setSelected] = useState(archetypes[0]);

    return (
        <SectionWrapper
            id="discovery-matrix"
            title="Archetype Matrix"
            subtitle="The Maestro engine classifies subjects into three cornerstone psychological archetypes based on high-order cognitive data."
            className="bg-[#030712]"
        >
            <div className="flex flex-col lg:flex-row gap-20 items-stretch">
                {/* Visual Select (Left) */}
                <div className="w-full lg:w-1/3 flex flex-col gap-4">
                    {archetypes.map((a) => {
                        const isActive = selected.id === a.id;
                        return (
                            <button
                                key={a.id}
                                onClick={() => setSelected(a)}
                                className={`group p-8 rounded-[2rem] text-left transition-all duration-500 border-2
                                    ${isActive ? 'bg-white border-white shadow-2xl scale-[1.02]' : 'bg-white/5 border-white/10 hover:border-white/20'}
                                `}
                            >
                                <div className="flex justify-between items-center mb-2">
                                    <span className={`text-[10px] font-black uppercase tracking-[0.3em] ${isActive ? 'text-primary' : 'text-white/30'}`}>Profile 0{archetypes.indexOf(a) + 1}</span>
                                    {isActive && <div className="w-2 h-2 rounded-full bg-primary" />}
                                </div>
                                <h3 className={`text-xl font-black uppercase tracking-tighter ${isActive ? 'text-[#030712]' : 'text-white/70'}`}>{a.label}</h3>
                            </button>
                        );
                    })}
                </div>

                {/* Display Panel (Right) */}
                <div className="w-full lg:w-2/3">
                    <div className="bg-[#030712] rounded-[3rem] p-12 text-white h-full relative overflow-hidden flex flex-col justify-between">
                        <div className="absolute top-0 right-0 p-12 opacity-10">
                            {React.cloneElement(selected.icon as React.ReactElement, { className: 'w-64 h-64 text-white' })}
                        </div>

                        <div>
                            <div className="flex items-center gap-6 mb-12">
                                <div className="w-20 h-20 rounded-3xl bg-primary flex items-center justify-center text-white">
                                    {React.cloneElement(selected.icon as React.ReactElement, { className: 'w-10 h-10' })}
                                </div>
                                <div>
                                    <h3 className="text-4xl font-black uppercase tracking-tighter">{selected.label}</h3>
                                    <p className="text-primary text-xs font-bold uppercase tracking-widest">Maestro Classification V2</p>
                                </div>
                            </div>

                            <div className="grid md:grid-cols-2 gap-12">
                                <div className="space-y-8">
                                    <div>
                                        <h4 className="text-[10px] font-bold text-white/40 uppercase tracking-[0.2em] mb-4">Functional Traits</h4>
                                        <div className="flex flex-wrap gap-2">
                                            {selected.traits.map(t => (
                                                <span key={t} className="px-5 py-2 rounded-full bg-white/5 border border-white/10 text-sm font-bold">{t}</span>
                                            ))}
                                        </div>
                                    </div>
                                    <div>
                                        <h4 className="text-[10px] font-bold text-white/40 uppercase tracking-[0.2em] mb-4">Core Strengths</h4>
                                        <ul className="space-y-2">
                                            {selected.strengths.map(s => (
                                                <li key={s} className="flex items-center gap-3 text-white font-medium">
                                                    <div className="w-1.5 h-1.5 rounded-full bg-primary" /> {s}
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                </div>
                                <div className="bg-white/5 border border-white/10 rounded-[2rem] p-8">
                                    <h4 className="text-[10px] font-bold text-primary uppercase tracking-[0.2em] mb-6">Career Trajectories</h4>
                                    <ul className="space-y-4">
                                        {selected.careers.map((c, i) => (
                                            <li key={i} className="flex items-center gap-4">
                                                <span className="text-white/20 font-black text-2xl italic">0{i + 1}</span>
                                                <span className="font-bold">{c}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </SectionWrapper>
    );
};

// --- COGNITIVE DIAL ---
export const NatureSlider = () => {
    const [val, setVal] = useState(50);

    const getData = () => {
        if (val < 33) return { label: 'External Catalyst', desc: 'Optimized for high-concurrency social environments and interactive team leadership.' };
        if (val > 66) return { label: 'Internal Architect', desc: 'Optimized for deep focus, independent structural analysis, and autonomous decision making.' };
        return { label: 'Hybrid Adaptive', desc: 'A fluid operator capable of oscillating between intense focus and collaborative execution.' };
    };

    const current = getData();

    return (
        <SectionWrapper
            title="Cognitive Oscillation"
            subtitle="The dial represents your social energy battery, fluctuating between Internal Focus and External Influence."
            className="bg-[#030712]"
        >
            <div className="max-w-5xl mx-auto rounded-[3rem] bg-white p-16 shadow-2xl relative">
                <div className="absolute top-8 left-8">
                    <Activity className="text-slate-100 w-32 h-32" />
                </div>

                <div className="relative z-10 flex flex-col items-center text-center">
                    <div className="mb-20 w-full space-y-6">
                        <div className="flex justify-between text-[11px] font-black uppercase tracking-[0.2em] text-slate-400">
                            <span>Internal</span>
                            <span>Hybrid</span>
                            <span>External</span>
                        </div>
                        <input
                            type="range"
                            min="0" max="100"
                            value={val}
                            onChange={(e) => setVal(Number(e.target.value))}
                            className="w-full h-1 bg-slate-200 accent-primary appearance-none rounded-full cursor-pointer"
                        />
                    </div>

                    <div className="space-y-4 max-w-2xl">
                        <div className="text-[10px] font-bold uppercase tracking-[0.4em] text-primary">Dial Reading</div>
                        <h3 className="text-4xl md:text-5xl font-black uppercase tracking-tighter text-[#030712]">{current.label}</h3>
                        <p className="text-xl text-slate-500 font-medium leading-relaxed">{current.desc}</p>
                    </div>
                </div>

                <div className="mt-16 pt-8 border-t border-slate-100 flex justify-center gap-12">
                    <div className="flex flex-col items-center gap-1">
                        <div className="text-2xl font-black text-[#030712]">{val}%</div>
                        <div className="text-[9px] uppercase font-bold text-slate-400">Reading</div>
                    </div>
                    <div className="flex flex-col items-center gap-1">
                        <div className="text-2xl font-black text-[#030712]">{100 - val}%</div>
                        <div className="text-[9px] uppercase font-bold text-slate-400">Latency</div>
                    </div>
                </div>
            </div>
        </SectionWrapper>
    );
};

// --- FACTS GRID ---
export const FactsSlider = () => {
    const facts = [
        { title: "87%", label: "Accuracy Increase", desc: "Long-term professional satisfaction spikes when nature and role align perfectly." },
        { title: "12-Factor", label: "Analysis Engine", desc: "Our Gen3 algorithm uses multi-phasic weighting to eliminate response bias." },
        { title: "Global 1%", label: "Benchmarking", desc: "See how your cognitive ceiling compares to thousands of high-performers worldwide." },
    ];

    return (
        <SectionWrapper className="bg-white py-0 overflow-visible" light={true}>
            <div className="grid md:grid-cols-3 gap-8">
                {facts.map((f, i) => (
                    <div key={i} className="bg-slate-50 p-12 rounded-[2.5rem] border-2 border-slate-100 hover:border-primary/20 transition-all group">
                        <h4 className="text-5xl font-black tracking-tighter text-[#030712] mb-2 group-hover:text-primary transition-colors">{f.title}</h4>
                        <div className="text-xs font-black uppercase tracking-widest text-[#030712]/40 mb-6">{f.label}</div>
                        <p className="text-slate-500 font-medium leading-relaxed">{f.desc}</p>
                    </div>
                ))}
            </div>
        </SectionWrapper>
    );
};

// --- CAREER EXPLORATION CARDS ---
export const CareerCards = () => {
    const categories = [
        { title: 'Neural Systems', desc: 'AI, Complex Computing, Deep Data Logic.', lead: 'Systems Architect' },
        { title: 'Market Strategy', desc: 'Growth, VC, Strategic Consulting, High-Level Scale.', lead: 'Venture Catalyst' },
        { title: 'Creative Humanism', desc: 'UX, Design, Psychology, Modern Marketing.', lead: 'Design Lead' },
    ];

    return (
        <SectionWrapper
            title="Macro Paths"
            subtitle="The three high-potential industry clusters mapped to the Maestro engine."
            light={true}
            className="bg-white"
        >
            <div className="grid md:grid-cols-3 gap-8">
                {categories.map((c, i) => (
                    <div key={i} className="group relative bg-[#030712] rounded-[3rem] p-12 text-white h-[450px] flex flex-col justify-between overflow-hidden shadow-2xl">
                        <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:scale-110 transition-transform">
                            <Microscope className="w-40 h-40" />
                        </div>
                        <div>
                            <div className="text-[10px] font-bold text-primary uppercase tracking-[0.4em] mb-8">Path 0{i + 1}</div>
                            <h3 className="text-3xl font-black uppercase tracking-tighter mb-4">{c.title}</h3>
                            <p className="text-white/40 font-medium leading-relaxed">{c.desc}</p>
                        </div>
                        <div className="relative z-10">
                            <div className="text-[9px] font-bold text-white/20 uppercase tracking-[0.2em] mb-2">Prime Target</div>
                            <div className="text-xl font-bold uppercase">{c.lead}</div>
                            <button className="mt-6 flex items-center gap-2 text-primary font-black text-[10px] uppercase tracking-widest hover:text-white transition-colors">
                                Explore Trajectory <ArrowRight className="w-3 h-3" />
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </SectionWrapper>
    );
};

// --- INFO PANEL ---
export const InfoSection = () => {
    return (
        <SectionWrapper className="bg-primary text-white rounded-[4rem] my-32 mx-4 md:mx-12 overflow-hidden relative border-4 border-white/10 shadow-[0_40px_80px_rgba(0,0,0,0.3)]">
            <div className="absolute inset-0 bg-[#030712]/10 mix-blend-overlay" />
            <div className="relative z-10 grid md:grid-cols-2 gap-20 items-center">
                <div className="p-4 md:p-12">
                    <h2 className="text-5xl md:text-7xl font-black uppercase tracking-tighter leading-[0.85] mb-12">
                        Precision <br />
                        Over <br />
                        <span className="italic opacity-50">Guesswork.</span>
                    </h2>
                    <p className="text-xl md:text-2xl font-bold mb-12 leading-tight">
                        Our internal assessment engine removes peer-pressure bias, mapping your natural cognitive ceiling to real-world career trajectories.
                    </p>
                    <div className="flex gap-4">
                        <div className="bg-white/10 p-6 rounded-3xl border border-white/20 backdrop-blur-xl">
                            <ShieldCheck className="w-8 h-8 text-white mb-4" />
                            <div className="font-black uppercase text-[10px] tracking-widest mb-2">Validated</div>
                            <p className="text-sm opacity-60">Maestro-Gen3 Core</p>
                        </div>
                        <div className="bg-white/10 p-6 rounded-3xl border border-white/20 backdrop-blur-xl">
                            <Brain className="w-8 h-8 text-white mb-4" />
                            <div className="font-black uppercase text-[10px] tracking-widest mb-2">Psychometric</div>
                            <p className="text-sm opacity-60">12-Factor Modeling</p>
                        </div>
                    </div>
                </div>
                <div className="relative h-[600px] bg-white rounded-[3rem] overflow-hidden shadow-2xl">
                    <Image
                        src="https://images.unsplash.com/photo-1552664730-d307ca884978?w=800&q=80"
                        alt="Intelligence"
                        fill
                        className="object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#030712]/80 to-transparent flex flex-col justify-end p-12">
                        <h3 className="text-2xl font-black uppercase text-white mb-2">Scientific Assurance</h3>
                        <p className="text-white/60 font-medium">Built for the future workforce.</p>
                    </div>
                </div>
            </div>
        </SectionWrapper>
    );
};

export const VideoModalPlayer = () => null; // Cleanup unused in premium dossier style
