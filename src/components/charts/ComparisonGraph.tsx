"use client";

import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer,
} from "recharts";
import { motion } from "framer-motion";

interface ComparisonGraphProps {
    data: { label: string; userScore: number; idealScore: number }[];
    isPrinting?: boolean;
}

export default function ComparisonGraph({ data, isPrinting = false }: ComparisonGraphProps) {
    const chart = (
        <BarChart
            data={data}
            width={isPrinting ? 800 : undefined}
            height={isPrinting ? 400 : undefined}
            margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
        >
            <CartesianGrid strokeDasharray="3 3" stroke={isPrinting ? "#d1d5db" : "#374151"} vertical={false} />
            <XAxis dataKey="label" tick={{ fill: isPrinting ? "#1f2937" : "#9CA3AF", fontSize: 11, fontWeight: isPrinting ? 'bold' : 'normal' }} />
            <YAxis domain={[0, 100]} tick={{ fill: isPrinting ? "#1f2937" : "#9CA3AF", fontSize: 11, fontWeight: isPrinting ? 'bold' : 'normal' }} />
            <Tooltip
                contentStyle={{ backgroundColor: "#111827", borderColor: "#374151", color: "#F9FAFB" }}
            />
            <Legend />
            <Bar isAnimationActive={!isPrinting} name="Your Score" dataKey="userScore" fill="#1294DD" radius={[4, 4, 0, 0]} />
            <Bar isAnimationActive={!isPrinting} name="Ideal Professional" dataKey="idealScore" fill={isPrinting ? "#9ca3af" : "#374151"} radius={[4, 4, 0, 0]} />
        </BarChart>
    );

    if (isPrinting) return <div className="flex justify-center">{chart}</div>;

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="w-full h-[400px]"
        >
            <ResponsiveContainer width="100%" height="100%">
                {chart}
            </ResponsiveContainer>
        </motion.div>
    );
}

