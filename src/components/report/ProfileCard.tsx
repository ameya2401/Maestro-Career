"use client";

import { UserProfile } from "@/types/report";
import { User, Calendar, MapPin, BookOpen, Target } from "lucide-react";
import { motion } from "framer-motion";

interface ProfileCardProps {
    user: UserProfile;
}

export default function ProfileCard({ user }: ProfileCardProps) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="bg-gray-900/50 backdrop-blur-xl border border-gray-800 rounded-3xl p-8 shadow-2xl relative overflow-hidden"
        >
            <div className="absolute top-0 right-0 w-64 h-64 bg-blue-600/10 rounded-full blur-3xl -mr-32 -mt-32" />

            <div className="relative z-10 flex flex-col md:flex-row gap-8 items-start md:items-center">
                <div className="w-24 h-24 bg-gradient-to-br from-blue-500 to-blue-700 rounded-2xl flex items-center justify-center text-white shadow-xl shadow-blue-500/20">
                    <User size={48} />
                </div>

                <div className="flex-1">
                    <h2 className="text-3xl font-bold text-white mb-2">{user.name}</h2>
                    <div className="flex flex-wrap gap-4 text-sm text-gray-400">
                        <div className="flex items-center gap-1.5">
                            <BookOpen size={14} className="text-blue-500" />
                            <span>Class {user.class}</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                            <Target size={14} className="text-blue-500" />
                            <span>{user.stream}</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                            <Calendar size={14} className="text-blue-500" />
                            <span>Age {user.age}</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                            <Calendar size={14} className="text-blue-500" />
                            <span>Generated: {user.reportDate}</span>
                        </div>
                    </div>
                </div>
            </div>

            <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6 relative z-10">
                <div className="p-4 bg-gray-800/40 rounded-xl border border-gray-700/50">
                    <h4 className="text-xs font-bold text-gray-500 tracking-wider mb-3 flex items-center gap-2">
                        <span className="w-1.5 h-1.5 bg-blue-500 rounded-full" />
                        Core Interests
                    </h4>
                    <div className="flex flex-wrap gap-2">
                        {user.interests.map((interest, i) => (
                            <span key={i} className="px-3 py-1 bg-blue-500/10 text-blue-400 text-xs font-medium rounded-full border border-blue-500/20">
                                {interest}
                            </span>
                        ))}
                    </div>
                </div>

                <div className="p-4 bg-gray-800/40 rounded-xl border border-gray-700/50">
                    <h4 className="text-xs font-bold text-gray-500 tracking-wider mb-3 flex items-center gap-2">
                        <span className="w-1.5 h-1.5 bg-green-500 rounded-full" />
                        Stated Career Goals
                    </h4>
                    <div className="flex flex-wrap gap-2">
                        {user.careerInterests.map((career, i) => (
                            <span key={i} className="px-3 py-1 bg-green-500/10 text-green-400 text-xs font-medium rounded-full border border-green-500/20">
                                {career}
                            </span>
                        ))}
                    </div>
                </div>
            </div>
        </motion.div>
    );
}
