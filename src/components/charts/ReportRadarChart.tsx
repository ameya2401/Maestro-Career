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
    const chart = (
        <RadarChart
            width={isPrinting ? 600 : undefined}
            height={isPrinting ? 400 : undefined}
            cx="50%"
            cy="50%"
            outerRadius="80%"
            data={data}
        >
            <PolarGrid stroke="#374151" />
            <PolarAngleAxis dataKey="subject" tick={{ fill: "#9CA3AF", fontSize: 12 }} />
            <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} axisLine={false} />
            <Radar
                isAnimationActive={!isPrinting}
                name="Score"
                dataKey="value"
                stroke="#1294DD"
                fill="#1294DD"
                fillOpacity={0.6}
            />
        </RadarChart>
    );

    if (isPrinting) return <div className="flex justify-center">{chart}</div>;

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            className="w-full h-[400px] flex items-center justify-center"
        >
            <ResponsiveContainer width="100%" height="100%">
                {chart}
            </ResponsiveContainer>
        </motion.div>
    );
}

