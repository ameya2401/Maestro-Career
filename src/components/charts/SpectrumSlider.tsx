"use client";

import { motion } from "framer-motion";

interface SpectrumSliderProps {
    label: string;
    leftLabel: string;
    rightLabel: string;
    value: number; // 0 to 100
}

export default function SpectrumSlider({ label, leftLabel, rightLabel, value }: SpectrumSliderProps) {
    return (
        <div className="mb-6">
            <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium text-gray-300">{label}</span>
                <span className="text-xs text-blue-400 font-bold">{value}%</span>
            </div>
            <div className="relative h-2 bg-gray-800 rounded-full overflow-hidden">
                <motion.div
                    initial={{ width: 0 }}
                    whileInView={{ width: `${value}%` }}
                    transition={{ duration: 1, ease: "easeOut" }}
                    className="absolute top-0 left-0 h-full bg-gradient-to-r from-blue-600 to-blue-400"
                />
            </div>
            <div className="flex justify-between mt-1">
                <span className="text-xs text-gray-500 uppercase tracking-wider">{leftLabel}</span>
                <span className="text-xs text-gray-500 uppercase tracking-wider">{rightLabel}</span>
            </div>
        </div>
    );
}
