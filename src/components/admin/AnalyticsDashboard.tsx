"use client";

import React, { useState } from "react";
import {
    LineChart,
    Line,
    BarChart,
    Bar,
    PieChart,
    Pie,
    Cell,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer,
} from "recharts";
import { Users, MousePointerClick, TrendingUp, Activity, Calendar, ShieldAlert } from "lucide-react";

// Mock Data
const lineChartData = [
    { name: "Mon", visitors: 4000, pageViews: 2400 },
    { name: "Tue", visitors: 3000, pageViews: 1398 },
    { name: "Wed", visitors: 2000, pageViews: 9800 },
    { name: "Thu", visitors: 2780, pageViews: 3908 },
    { name: "Fri", visitors: 1890, pageViews: 4800 },
    { name: "Sat", visitors: 2390, pageViews: 3800 },
    { name: "Sun", visitors: 3490, pageViews: 4300 },
];

const barChartData = [
    { name: "Week 1", users: 400 },
    { name: "Week 2", users: 300 },
    { name: "Week 3", users: 500 },
    { name: "Week 4", users: 280 },
];

const pieChartData = [
    { name: "Students", value: 400 },
    { name: "Parents", value: 300 },
    { name: "Professionals", value: 300 },
];

const COLORS = ["#3b82f6", "#8b5cf6", "#06b6d4", "#10b981"];

export default function AnalyticsDashboard() {
    const [dateRange, setDateRange] = useState("Last 7 Days");

    return (
        <div className="min-h-screen bg-slate-50 text-slate-900 p-6 md:p-8 font-sans">
            <div className="max-w-7xl mx-auto space-y-8">

                {/* Header Section */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                        <h1 className="text-2xl font-bold text-slate-900">Analytics Dashboard</h1>
                        <p className="text-sm text-slate-500 mt-1 flex items-center gap-2">
                            <span className="relative flex h-2 w-2">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                            </span>
                            Demo Data • Powered by Google Analytics (GA4) Integration ready
                        </p>
                    </div>

                    <div className="flex items-center gap-3">
                        <div className="relative">
                            <select
                                value={dateRange}
                                onChange={(e) => setDateRange(e.target.value)}
                                className="appearance-none bg-white border border-slate-200 text-sm font-medium text-slate-700 py-2 pl-4 pr-10 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 hover:bg-slate-50 transition-colors cursor-pointer"
                            >
                                <option>Last 7 Days</option>
                                <option>Last 30 Days</option>
                                <option>This Year</option>
                            </select>
                            <Calendar className="w-4 h-4 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                        </div>
                    </div>
                </div>

                {/* Top Summary Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <SummaryCard
                        title="Total Visitors"
                        value="124,563"
                        trend="+12.5%"
                        isPositive={true}
                        icon={<Users className="w-5 h-5 text-blue-600" />}
                        colorClass="bg-blue-50 border-blue-100"
                    />
                    <SummaryCard
                        title="Total Users"
                        value="45,231"
                        trend="+8.2%"
                        isPositive={true}
                        icon={<Activity className="w-5 h-5 text-purple-600" />}
                        colorClass="bg-purple-50 border-purple-100"
                    />
                    <SummaryCard
                        title="Active Users"
                        value="8,942"
                        trend="-2.4%"
                        isPositive={false}
                        icon={<MousePointerClick className="w-5 h-5 text-cyan-600" />}
                        colorClass="bg-cyan-50 border-cyan-100"
                    />
                    <SummaryCard
                        title="Conversion Rate"
                        value="4.6%"
                        trend="+1.2%"
                        isPositive={true}
                        icon={<TrendingUp className="w-5 h-5 text-emerald-600" />}
                        colorClass="bg-emerald-50 border-emerald-100"
                    />
                </div>

                {/* Charts Section */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                    {/* Main Line Chart */}
                    <div className="lg:col-span-2 bg-white border border-slate-200 rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow">
                        <h2 className="text-base font-semibold text-slate-800 mb-6">Website Traffic (vs Page Views)</h2>
                        <div className="h-[300px] w-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <LineChart data={lineChartData} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                                    <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 12 }} dy={10} />
                                    <YAxis axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 12 }} dx={-10} />
                                    <Tooltip
                                        contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)' }}
                                        cursor={{ stroke: '#cbd5e1', strokeWidth: 1, strokeDasharray: '3 3' }}
                                    />
                                    <Legend iconType="circle" wrapperStyle={{ paddingTop: '20px', fontSize: '14px' }} />
                                    <Line type="monotone" dataKey="visitors" stroke="#3b82f6" strokeWidth={3} dot={false} activeDot={{ r: 6, strokeWidth: 0 }} name="Unique Visitors" />
                                    <Line type="monotone" dataKey="pageViews" stroke="#a8a29e" strokeWidth={2} dot={false} strokeDasharray="5 5" name="Page Views" />
                                </LineChart>
                            </ResponsiveContainer>
                        </div>
                    </div>

                    {/* Pie Chart */}
                    <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow">
                        <h2 className="text-base font-semibold text-slate-800 mb-6">User Categories</h2>
                        <div className="h-[300px] w-full flex items-center justify-center">
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie
                                        data={pieChartData}
                                        cx="50%"
                                        cy="50%"
                                        innerRadius={80}
                                        outerRadius={100}
                                        paddingAngle={5}
                                        dataKey="value"
                                        stroke="none"
                                    >
                                        {pieChartData.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                        ))}
                                    </Pie>
                                    <Tooltip
                                        contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                                    />
                                    <Legend iconType="circle" wrapperStyle={{ fontSize: '12px' }} />
                                </PieChart>
                            </ResponsiveContainer>
                        </div>
                    </div>

                    {/* Bar Chart */}
                    <div className="lg:col-span-3 bg-white border border-slate-200 rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow">
                        <h2 className="text-base font-semibold text-slate-800 mb-6">User Registrations</h2>
                        <div className="h-[300px] w-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={barChartData} margin={{ top: 5, right: 0, left: -20, bottom: 5 }} barSize={40}>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                                    <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 12 }} dy={10} />
                                    <YAxis axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 12 }} />
                                    <Tooltip
                                        cursor={{ fill: '#f1f5f9' }}
                                        contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                                    />
                                    <Bar dataKey="users" fill="#8b5cf6" radius={[6, 6, 0, 0]} name="New Users" />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </div>

                </div>

                {/* Info Note */}
                <div className="mt-8 flex items-start gap-3 bg-blue-50 border border-blue-100 rounded-xl p-4 text-blue-800">
                    <ShieldAlert className="w-5 h-5 flex-shrink-0 mt-0.5" />
                    <div className="text-sm">
                        <p className="font-semibold">Demo Dashboard Notice</p>
                        <p className="mt-1 opacity-90">This is a mock dashboard representing structure for Google Analytics (GA4) integration. In production, actual GA4 APIs or custom tracking scripts will populate these visualization components. The architecture supports direct data-source substitution via API endpoints.</p>
                    </div>
                </div>

            </div>
        </div>
    );
}

// Summary Card Sub-component
function SummaryCard({
    title,
    value,
    trend,
    isPositive,
    icon,
    colorClass
}: {
    title: string;
    value: string;
    trend: string;
    isPositive: boolean;
    icon: React.ReactNode;
    colorClass: string;
}) {
    return (
        <div className="group bg-white border border-slate-200 rounded-2xl p-6 shadow-sm hover:shadow-md hover:border-slate-300 transition-all cursor-pointer">
            <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-medium text-slate-500 group-hover:text-slate-700 transition-colors">{title}</h3>
                <div className={`p-2 rounded-xl ${colorClass} group-hover:scale-110 transition-transform`}>
                    {icon}
                </div>
            </div>
            <p className="text-3xl font-bold text-slate-900 tracking-tight">{value}</p>
            <div className="mt-2 flex items-center gap-2">
                <span className={`text-xs font-semibold px-2 py-1 rounded-md ${isPositive ? 'bg-emerald-100 text-emerald-700' : 'bg-rose-100 text-rose-700'}`}>
                    {trend}
                </span>
                <span className="text-xs text-slate-400 font-medium">vs last period</span>
            </div >
        </div >
    );
}
