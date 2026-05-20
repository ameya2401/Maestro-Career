import { createSupabaseServer } from "@/lib/supabase/server";
import { ReportData } from "@/types/report";

export async function getReportData(resultId?: string): Promise<ReportData | null> {
    const supabase = createSupabaseServer();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) return null;

    let query = supabase
        .from('assessment_results')
        .select(`
            *,
            profiles:user_id (
                id,
                email,
                raw_user_meta_data
            )
        `);

    if (resultId && resultId !== 'latest') {
        query = query.eq('id', resultId);
    } else {
        query = query.eq('user_id', user.id).order('created_at', { ascending: false }).limit(1);
    }

    const { data: result, error } = await query.maybeSingle();

    if (error || !result) return null;

    // Map DB result to ReportData interface
    const profileData = result.profiles as any;

    return {
        user: {
            id: user.id,
            name: profileData?.raw_user_meta_data?.full_name || user.email?.split('@')[0] || "Subject",
            email: user.email || "",
            age: profileData?.raw_user_meta_data?.age || 20,
            class: profileData?.raw_user_meta_data?.class || "N/A",
            stream: profileData?.raw_user_meta_data?.stream || "N/A",
            interests: [],
            careerInterests: [],
            reportDate: new Date(result.created_at).toLocaleDateString()
        },
        aptitudeScores: result.aptitude_scores,
        psychometricScores: result.psychometric_scores,
        careerDNA: result.career_dna,
        archetype: result.archetype,
        careerMatches: result.career_matches,
        strengths: ["Analytical Thinking", "Strategic Planning", "Complex Problem Solving"],
        improvementAreas: ["Public Speaking", "Iterative Design"],
        charts: {
            radarChart: Object.entries(result.aptitude_scores).map(([key, val]) => ({
                subject: key.replace('_', ' '),
                value: val as number,
                fullMark: 100
            })),
            barChart: Object.entries(result.psychometric_scores).map(([key, val]) => ({
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
                { label: 'Logic', userScore: result.aptitude_scores.logical || 0, idealScore: 85 },
                { label: 'Leadership', userScore: result.psychometric_scores.leadership || 0, idealScore: 80 },
                { label: 'Innovation', userScore: result.career_dna.innovation || 0, idealScore: 90 }
            ]
        },
        recommendations: {
            bestCareers: result.career_matches.slice(0, 2).map((m: any) => m.career),
            alternativeCareers: ["Systems Research", "Data Strategy"],
            growthAdvice: ["Focus on high-level cognitive synthesis."]
        }
    };
}
