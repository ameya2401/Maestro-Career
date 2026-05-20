"use client";

import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from "recharts";
import { motion } from "framer-motion";

interface ReportPieChartProps {
    data: { name: string; value: number }[];
    isPrinting?: boolean;
}

const COLORS = ["#1294DD", "#3B82F6", "#60A5FA", "#93C5FD", "#BFDBFE"];

export default function ReportPieChart({ data, isPrinting = false }: ReportPieChartProps) {
    const chart = (
        <PieChart width={isPrinting ? 500 : undefined} height={isPrinting ? 350 : undefined}>
            <Pie
                isAnimationActive={!isPrinting}
                data={data}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={100}
                paddingAngle={5}
                dataKey="value"
            >
                {data.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
            </Pie>
            {!isPrinting && (
                <Tooltip
                    contentStyle={{ backgroundColor: "#111827", borderColor: "#374151", color: "#F9FAFB" }}
                />
            )}
            <Legend iconType="circle" />
        </PieChart>
    );

    if (isPrinting) return <div className="flex justify-center">{chart}</div>;

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            className="w-full h-[350px]"
        >
            <ResponsiveContainer width="100%" height="100%">
                {chart}
            </ResponsiveContainer>
        </motion.div>
    );
}

