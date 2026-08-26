"use client";

import {
    Radar,
    RadarChart,
    PolarGrid,
    PolarAngleAxis,
    PolarRadiusAxis,
    ResponsiveContainer,
} from "recharts";
import { motion } from "framer-motion";

interface ReportRadarChartProps {
    data: { subject: string; value: number; fullMark: number }[];
    isPrinting?: boolean;
}

export default function ReportRadarChart({ data, isPrinting = false }: ReportRadarChartProps) {
    if (!data || data.length === 0) {
        return (
            <div className="w-full h-[400px] flex items-center justify-center border border-dashed border-gray-300 rounded-xl bg-gray-50 text-gray-400">
                Data unavailable for this metric
            </div>
        );
    }

    const chart = (
        <RadarChart
            width={isPrinting ? 520 : undefined}
            height={isPrinting ? 360 : undefined}
            cx="50%"
            cy="50%"
            outerRadius="75%"
            data={data}
        >
            <PolarGrid stroke={isPrinting ? "#e5e7eb" : "#374151"} />
            <PolarAngleAxis
                dataKey="subject"
                tick={{ fill: isPrinting ? "#374151" : "#9CA3AF", fontSize: 10, fontWeight: 600 }}
            />
            <PolarRadiusAxis
                angle={30}
                domain={[0, 100]}
                tick={false}
                axisLine={false}
            />
            <Radar
                isAnimationActive={!isPrinting}
                name="Score"
                dataKey="value"
                stroke="#1294DD"
                fill="#1294DD"
                fillOpacity={0.5}
            />
        </RadarChart>
    );

    if (isPrinting) {
        return (
            <div style={{ width: '520px', height: '360px', margin: '0 auto', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                {chart}
            </div>
        );
    }

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            whileInView={{ opacity: 1, scale: 1 }}
            className="w-full h-full min-h-[360px] flex items-center justify-center"
        >
            <ResponsiveContainer width="100%" height="100%" minWidth={300} minHeight={300}>
                {chart}
            </ResponsiveContainer>
        </motion.div>
    );
}

