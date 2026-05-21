"use client";

import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    Cell,
} from "recharts";
import { motion } from "framer-motion";

interface ReportBarChartProps {
    data: { name: string; score: number }[];
    isPrinting?: boolean;
}

export default function ReportBarChart({ data, isPrinting = false }: ReportBarChartProps) {
    const chart = (
        <BarChart
            data={data}
            layout="vertical"
            width={isPrinting ? 600 : undefined}
            height={isPrinting ? 350 : undefined}
            margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
        >
            <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} stroke={isPrinting ? "#d1d5db" : "#374151"} />
            <XAxis type="number" domain={[0, 100]} hide />
            <YAxis
                dataKey="name"
                type="category"
                tick={{ fill: isPrinting ? "#1f2937" : "#9CA3AF", fontSize: 12, fontWeight: isPrinting ? 'bold' : 'normal' }}
                width={100}
            />
            <Tooltip
                contentStyle={{ backgroundColor: "#111827", borderColor: "#374151", color: "#F9FAFB" }}
                itemStyle={{ color: "#1294DD" }}
            />
            <Bar isAnimationActive={!isPrinting} dataKey="score" radius={[0, 4, 4, 0]} barSize={24}>
                {data.map((entry, index) => (
                    <Cell
                        key={`cell-${index}`}
                        fill={entry.score > 80 ? "#1294DD" : entry.score > 60 ? "#3B82F6" : "#60A5FA"}
                    />
                ))}
            </Bar>
        </BarChart>
    );

    if (isPrinting) return <div className="flex justify-center">{chart}</div>;

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="w-full h-[350px]"
        >
            <ResponsiveContainer width="100%" height="100%">
                {chart}
            </ResponsiveContainer>
        </motion.div>
    );
}

