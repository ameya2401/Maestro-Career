"use client";

import React from 'react';

interface VennCircle {
    label: string;
    description: string;
    color: string;
}

interface CognitiveVennProps {
    circles: [VennCircle, VennCircle];
    intersection: string;
    isPrinting?: boolean;
}

export const CognitiveVenn: React.FC<CognitiveVennProps> = ({ circles, intersection, isPrinting }) => {
    // SVG Dimensions
    const width = 400;
    const height = 240;
    const r = 85;
    const centerOffset = 60; // Distance from center for each circle

    return (
        <div className="relative w-full flex flex-col items-center justify-center py-8">
            <svg viewBox={`0 0 ${width} ${height}`} className="w-full max-w-md drop-shadow-2xl">
                <defs>
                    <filter id="glow">
                        <feGaussianBlur stdDeviation="3" result="coloredBlur" />
                        <feMerge>
                            <feMergeNode in="coloredBlur" />
                            <feMergeNode in="SourceGraphic" />
                        </feMerge>
                    </filter>
                    <clipPath id="intersectionClip">
                        <circle cx={width / 2 + centerOffset} cy={height / 2} r={r} />
                    </clipPath>
                </defs>

                {/* Circle 1 */}
                <circle
                    cx={width / 2 - centerOffset}
                    cy={height / 2}
                    r={r}
                    fill={circles[0].color}
                    fillOpacity={isPrinting ? 0.3 : 0.15}
                    stroke={circles[0].color}
                    strokeWidth="2"
                />

                {/* Circle 2 */}
                <circle
                    cx={width / 2 + centerOffset}
                    cy={height / 2}
                    r={r}
                    fill={circles[1].color}
                    fillOpacity={isPrinting ? 0.3 : 0.15}
                    stroke={circles[1].color}
                    strokeWidth="2"
                />

                {/* Intersection Highlight */}
                <circle
                    cx={width / 2 - centerOffset}
                    cy={height / 2}
                    r={r}
                    fill={isPrinting ? "#000" : "#fff"}
                    fillOpacity={0.1}
                    clipPath="url(#intersectionClip)"
                />

                {/* Labels in SVG */}
                <text
                    x={width / 2 - centerOffset}
                    y={height / 2 - 10}
                    textAnchor="middle"
                    fill={isPrinting ? "#000" : "#fff"}
                    className="text-sm font-semibold tracking-wider"
                >
                    {circles[0].label.split(' ')[0]}
                </text>
                <text
                    x={width / 2 - centerOffset}
                    y={height / 2 + 5}
                    textAnchor="middle"
                    fill={isPrinting ? "#000" : "#fff"}
                    className="text-sm font-semibold tracking-wider"
                >
                    {circles[0].label.split(' ')[1] || ''}
                </text>

                <text
                    x={width / 2 + centerOffset}
                    y={height / 2 - 10}
                    textAnchor="middle"
                    fill={isPrinting ? "#000" : "#fff"}
                    className="text-sm font-semibold tracking-wider"
                >
                    {circles[1].label.split(' ')[0]}
                </text>
                <text
                    x={width / 2 + centerOffset}
                    y={height / 2 + 5}
                    textAnchor="middle"
                    fill={isPrinting ? "#000" : "#fff"}
                    className="text-sm font-semibold tracking-wider"
                >
                    {circles[1].label.split(' ')[1] || ''}
                </text>
            </svg>

            {/* Floating Intersection Label */}
            <div className="mt-[-40px] z-20 bg-white border-2 border-primary px-6 py-2 rounded-full shadow-xl">
                <span className="block text-[8px] uppercase font-bold text-primary text-center tracking-widest">Master Archetype</span>
                <p className={`text-sm font-bold tracking-tight text-center ${isPrinting ? 'text-black' : 'text-[#030712]'}`}>{intersection}</p>
            </div>
        </div>
    );
};

export const CareerDNA: React.FC<{ data: any, isPrinting?: boolean }> = ({ data, isPrinting }) => {
    const bars = [
        { label: 'Analytical DNA', value: data.analytical, color: '#3b82f6' },
        { label: 'Creative Affinity', value: data.creative, color: '#a855f7' },
        { label: 'Leadership Potential', value: data.leadership, color: '#fbbf24' },
        { label: 'Research Orientation', value: data.research, color: '#10b981' },
        { label: 'Innovation Quotient', value: data.innovation, color: '#06b6d4' },
    ];

    return (
        <div className="space-y-4 w-full">
            {bars.map((bar) => (
                <div key={bar.label} className="space-y-1">
                    <div className="flex justify-between items-end">
                        <span className="text-xs font-bold tracking-wider opacity-70">{bar.label}</span>
                        <span className="text-xs font-mono font-bold">{bar.value}%</span>
                    </div>
                    <div className="h-1.5 w-full bg-foreground/10 rounded-full overflow-hidden">
                        <div
                            className="h-full rounded-full transition-all duration-1000"
                            style={{
                                width: `${bar.value}%`,
                                backgroundColor: bar.color,
                                boxShadow: isPrinting ? 'none' : `0 0 10px ${bar.color}40`
                            }}
                        />
                    </div>
                </div>
            ))}
        </div>
    );
};
