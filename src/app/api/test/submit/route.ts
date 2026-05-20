<<<<<<< HEAD
import { createRouteHandlerClient } from "@/lib/supabase/route";
import { NextRequest, NextResponse } from "next/server";
import { ASSESSMENT_BANK_V1 } from "@/data/assessment-bank";

export async function POST(req: NextRequest) {
    try {
        const { supabase } = createRouteHandlerClient(req);
        const { data: { user } } = await supabase.auth.getUser();

        if (!user) return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });

        const { attemptId, responses } = await req.json();

        // 1. Verify Attempt
        const { data: attempt, error: attemptError } = await supabase
            .from('assessment_attempts')
            .select('*')
            .eq('id', attemptId)
            .eq('user_id', user.id)
            .single();

        if (attemptError || !attempt) {
            return NextResponse.json({ success: false, message: "Invalid attempt" }, { status: 400 });
        }

        if (attempt.status === 'completed') {
            return NextResponse.json({ success: false, message: "Already submitted" }, { status: 400 });
        }

        // 2. Scoring Logic (12-Factor weighted)
        const dimensions: Record<string, number> = {
            logical_reasoning: 0,
            verbal_aptitude: 0,
            quantitative_skill: 0,
            spatial_awareness: 0,
            problem_solving: 0,
            leadership: 0,
            extraversion: 0,
            agreeableness: 0,
            conscientiousness: 0,
            emotional_stability: 0,
            openness: 0,
            adaptability: 0
        };

        const dimCounts: Record<string, number> = {};

        // Calculate raw totals
        ASSESSMENT_BANK_V1.forEach((q) => {
            const answerId = responses[q.id];
            if (answerId !== undefined) {
                const option = q.options.find(o => o.id === answerId);
                if (option) {
                    Object.entries(option.weights).forEach(([dim, weight]) => {
                        dimensions[dim] = (dimensions[dim] || 0) + weight;
                        dimCounts[dim] = (dimCounts[dim] || 0) + 1;
                    });
                }
            }
        });

        // Normalize to 0-100
        const finalScores: Record<string, number> = {};
        Object.keys(dimensions).forEach(dim => {
            // Max weight per question is 10 (typical), max q's per dim is ~10-15
            // Realistically we want to divide by (max possible weight for this dim)
            // Simplified normalization for prototype:
            finalScores[dim] = Math.min(100, Math.round((dimensions[dim] / (dimCounts[dim] || 5)) * 10));
        });

        // 3. Archetype Mapping (Simplified Logic)
        let archetype = {
            title: "The Strategic Architect",
            description: "A visionary who builds systems.",
            traits: ["Analytical", "Strategic", "Disciplined"]
        };

        if (finalScores.extraversion > 70 && finalScores.leadership > 70) {
            archetype = {
                title: "The Dynamic Leader",
                description: "Inspires teams and drives high-level change through charisma and logic.",
                traits: ["Charismatic", "Decisive", "Influential"]
            };
        } else if (finalScores.logical_reasoning > 80 && finalScores.problem_solving > 80) {
            archetype = {
                title: "The Master Systems-Engineer",
                description: "Solves complex structural problems with precision and deep focus.",
                traits: ["Logical", "Precise", "Focused"]
            };
        }

        // Calculate percentiles (Global Benchmarking)
        const { data: allResults } = await supabase
            .from('assessment_results')
            .select('aptitude_scores, psychometric_scores');

        const benchmarks: Record<string, number> = {};
        if (allResults && allResults.length > 0) {
            const allApt = allResults.map(r => r.aptitude_scores);
            const allPsy = allResults.map(r => r.psychometric_scores);

            // Simplified percentile: count how many were lower than current
            const calcPercentile = (current: number, allValues: number[]) => {
                const lower = allValues.filter(v => v < current).length;
                return Math.round((lower / allValues.length) * 100);
            };

            benchmarks.logical_pct = calcPercentile(finalScores.logical_reasoning, allApt.map(a => a.logical));
            benchmarks.leadership_pct = calcPercentile(finalScores.leadership, allPsy.map(p => p.leadership));
            benchmarks.overall_pct = Math.round((benchmarks.logical_pct + benchmarks.leadership_pct) / 2);
        }

        // 4. Update Database
        const { error: updateError } = await supabase
            .from('assessment_attempts')
            .update({
                status: 'completed',
                completed_at: new Date().toISOString(),
                raw_responses: responses
            })
            .eq('id', attemptId);

        if (updateError) throw updateError;

        // Save Results
        const { data: result, error: resultError } = await supabase
            .from('assessment_results')
            .insert({
                user_id: user.id,
                attempt_id: attemptId,
                aptitude_scores: {
                    logical: finalScores.logical_reasoning,
                    verbal: finalScores.verbal_aptitude,
                    quantitative: finalScores.quantitative_skill,
                    spatial: finalScores.spatial_awareness,
                    problem_solving: finalScores.problem_solving,
                    percentile: benchmarks.overall_pct || 0
                },
                psychometric_scores: {
                    leadership: finalScores.leadership,
                    extraversion: finalScores.extraversion,
                    agreeableness: finalScores.agreeableness,
                    conscientiousness: finalScores.conscientiousness,
                    openness: finalScores.openness,
                    stability: finalScores.emotional_stability,
                    adaptability: finalScores.adaptability
                },
                career_dna: {
                    analytical: Math.round((finalScores.logical_reasoning + finalScores.problem_solving) / 2),
                    creative: finalScores.openness,
                    leadership: finalScores.leadership,
                    research: finalScores.logical_reasoning,
                    innovation: finalScores.adaptability
                },
                archetype: archetype,
                career_matches: [
                    { career: "AI Systems Architect", score: 95, description: "Engineering intelligent workflows.", compatibilityLevel: "PRIME" },
                    { career: "Quantitative Analyst", score: 88, description: "Data-driven risk modeling.", compatibilityLevel: "HIGH" },
                    { career: "Strategic Consultant", score: 82, description: "Business logic and scaling.", compatibilityLevel: "STRONG" }
                ],
                metadata: {
                    v: 1,
                    engine: 'Maestro-Gen3',
                    benchmarks: benchmarks
                }
            })
            .select()
            .single();

        if (resultError) throw resultError;

        return NextResponse.json({
            success: true,
            resultId: result.id,
            message: "Assessment scored successfully."
        });

    } catch (err) {
        console.error("Submission error:", err);
        return NextResponse.json({ success: false, message: "Internal server error" }, { status: 500 });
=======
import { NextRequest, NextResponse } from "next/server";
import { createRouteHandlerClient } from "@/lib/supabase/route";
import { finalizeAttempt, getActiveGrant, INTERNAL_BANK_VERSION_V1 } from "@/lib/assessment/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
    const { supabase, applyToResponse } = createRouteHandlerClient(req);

    const {
        data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
        return applyToResponse(NextResponse.json({ success: false, message: "Authentication required." }, { status: 401 }));
    }

    try {
        const body = await req.json();
        const attemptId = String(body?.attemptId ?? "");
        if (!attemptId) {
            return applyToResponse(NextResponse.json({ success: false, message: "Missing attemptId." }, { status: 400 }));
        }

        const grant = await getActiveGrant(supabase, user.id, INTERNAL_BANK_VERSION_V1);
        if (!grant || grant.status !== "active") {
            return applyToResponse(NextResponse.json({ success: false, message: "Access not granted." }, { status: 403 }));
        }

        const finalized = await finalizeAttempt({ supabase, userId: user.id, attemptId });

        return applyToResponse(
            NextResponse.json({
                success: true,
                attemptId: finalized.attempt.id,
                resultId: finalized.result.id,
                status: finalized.attempt.status,
            }),
        );
    } catch (error) {
        const message = error instanceof Error ? error.message : "Unable to submit.";
        return applyToResponse(NextResponse.json({ success: false, message }, { status: 400 }));
>>>>>>> 859efa387dd4ad028b63e0a6f0699b8c2717116d
    }
}
