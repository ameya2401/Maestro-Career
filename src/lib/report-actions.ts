import { createSupabaseServer } from "@/lib/supabase/server";
import { ReportData } from "@/types/report";

export async function getReportData(resultId?: string): Promise<ReportData | null> {
    const supabase = createSupabaseServer();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) return null;

    let query = supabase
        .from('assessment_results')
        .select(`*`);

    if (resultId && resultId !== 'latest') {
        query = query.eq('id', resultId);
    } else {
        query = query.eq('user_id', user.id).order('created_at', { ascending: false }).limit(1);
    }

    const { data: result, error } = await query.maybeSingle();

    if (error || !result) {
        console.error("Error fetching report data:", error);
        return null;
    }

    const profileData = user.user_metadata;

    // Extract and format career matches
    const allMatches = result.career_matches || [];
    const formattedMatches = allMatches.map((m: any) => ({
        career: m.title || m.career || "Unknown Career",
        score: m.score || 0,
        compatibilityLevel: m.bucket || (m.score > 80 ? "Best" : m.score > 60 ? "Good" : "Poor"),
        description: m.reason || "A match based on your cognitive profile."
    }));

    // Filter into buckets for the 5-Circle Venn
    const bestMatches = formattedMatches.filter((m: any) => m.score >= 85);
    const goodMatches = formattedMatches.filter((m: any) => m.score >= 65 && m.score < 85);
    const poorMatches = formattedMatches.filter((m: any) => m.score < 65);

    return {
        user: {
            id: user.id,
            name: profileData?.full_name || user.email?.split('@')[0] || "Subject",
            email: user.email || "",
            age: profileData?.age || 20,
            class: profileData?.class || "N/A",
            stream: profileData?.stream || "N/A",
            interests: [],
            careerInterests: [],
            reportDate: new Date(result.created_at).toLocaleDateString()
        },
        aptitudeScores: result.aptitude_scores || {},
        psychometricScores: result.psychometric_scores || {},
        careerDNA: result.career_dna || { analytical: 80, creative: 60, leadership: 70, research: 85, innovation: 65 },
        archetype: result.archetype || { title: 'Analytical Strategist', description: 'A highly logical thinker.', traits: ['Logic', 'Strategy'] },
        careerMatches: formattedMatches.slice(0, 5),
        strengths: result.summary?.strengths || ["Analytical Thinking", "Strategic Planning"],
        improvementAreas: (result.summary?.areasRequiringImprovement || []).map((a: any) => a.dimension || a).slice(0, 3),
        charts: {
            radarChart: Object.entries(result.aptitude_scores || {}).map(([key, val]) => ({
                subject: key.replace('_', ' '),
                value: val as number,
                fullMark: 100
            })),
            barChart: Object.entries(result.psychometric_scores || {}).map(([key, val]) => ({
                name: key.replace('_', ' '),
                score: val as number
            })),
            pieChart: [
                { name: 'Cognitive', value: 40 },
                { name: 'Behavioral', value: 30 },
                { name: 'Technical', value: 30 }
            ],
            vennData: {},
            comparisonData: [
                { label: 'Aptitude', userScore: result.aptitude_index || 0, idealScore: 85 },
                { label: 'Psychometric', userScore: result.psychometric_index || 0, idealScore: 80 },
                { label: 'Overall', userScore: result.overall_index || 0, idealScore: 90 }
            ]
        },
        recommendations: {
            bestCareers: bestMatches.map((m: any) => m.career).slice(0, 2),
            alternativeCareers: goodMatches.map((m: any) => m.career).slice(0, 2),
            badCareers: poorMatches.map((m: any) => ({
                career: m.career,
                score: m.score,
                reason: m.description
            })).slice(0, 4),
            growthAdvice: result.summary?.growthAdvice || ["Focus on high-level cognitive synthesis."]
        }
    };
}
