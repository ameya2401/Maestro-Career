import {
    AssessmentBank,
    AssessmentDimension,
    AssessmentQuestion,
    CareerProfile,
    DimensionScores,
    DimensionTotals,
    APTITUDE_DIMENSIONS,
    PSYCHOMETRIC_DIMENSIONS,
} from "@/lib/assessment/types";

export type ResponseMap = Record<string, string | null | undefined>;

export type ScoredAssessment = {
    rawTotals: DimensionTotals;
    normalizedTotals: DimensionScores;
    aptitudeScores: Pick<DimensionScores, (typeof APTITUDE_DIMENSIONS)[number]>;
    psychometricScores: Pick<DimensionScores, (typeof PSYCHOMETRIC_DIMENSIONS)[number]>;
    aptitudeIndex: number;
    psychometricIndex: number;
    overallIndex: number;
    careerMatches: Array<{ id: string; title: string; score: number; bucket: string }>;
    areasRequiringImprovement: Array<{ dimension: AssessmentDimension; score: number }>;
    summary: {
        bankVersion: string;
        scoreVersion: string;
        questionCount: number;
        generatedAt: string;
    };
};

export function computeContributionSnapshot(question: AssessmentQuestion, optionId: string | null | undefined) {
    if (!optionId) return {} as Record<string, number>;
    const option = question.options.find((opt) => opt.id === optionId);
    if (!option) return {} as Record<string, number>;

    const snapshot: Record<string, number> = {};
    const weights = question.dimensionWeights ?? {};

    for (const [dimension, base] of Object.entries(option.contributions ?? {})) {
        const w = typeof (weights as Record<string, unknown>)[dimension] === "number" ? (weights as Record<string, number>)[dimension] : 1;
        const value = Math.max(0, Number(base) * w);
        if (value > 0) snapshot[dimension] = value;
    }

    return snapshot;
}

export function scoreAssessment(params: {
    bank: AssessmentBank;
    responses: ResponseMap;
    scoreVersion?: string;
    careers: CareerProfile[];
}): ScoredAssessment {
    const scoreVersion = params.scoreVersion ?? "v1";
    const { bank, responses } = params;

    const rawTotals = createTotals();

    for (const question of bank.questions) {
        const optionId = responses[question.id];
        const snapshot = computeContributionSnapshot(question, optionId);
        for (const [dimension, value] of Object.entries(snapshot)) {
            rawTotals[dimension as AssessmentDimension] += Number(value) || 0;
        }
    }

    const maxTotals = computeMaxTotals(bank);
    const normalizedTotals = normalizeTotals(rawTotals, maxTotals);

    const aptitudeScores = pickDimensions(normalizedTotals, APTITUDE_DIMENSIONS);
    const psychometricScores = pickDimensions(normalizedTotals, PSYCHOMETRIC_DIMENSIONS);

    const aptitudeIndex = mean(Object.values(aptitudeScores));
    const psychometricIndex = mean(Object.values(psychometricScores));
    const overallIndex = round2(aptitudeIndex * 0.5 + psychometricIndex * 0.5);

    const careerMatches = scoreCareers({
        normalizedTotals,
        careers: params.careers,
        aptitudeIndex,
        psychometricIndex,
    });

    const areasRequiringImprovement = Object.entries(normalizedTotals)
        .filter(([, v]) => v < 45)
        .map(([dimension, score]) => ({ dimension: dimension as AssessmentDimension, score }))
        .sort((a, b) => a.score - b.score);

    return {
        rawTotals,
        normalizedTotals,
        aptitudeScores,
        psychometricScores,
        aptitudeIndex,
        psychometricIndex,
        overallIndex,
        careerMatches,
        areasRequiringImprovement,
        summary: {
            bankVersion: bank.version,
            scoreVersion,
            questionCount: bank.questions.length,
            generatedAt: new Date().toISOString(),
        },
    };
}

function createTotals(): DimensionTotals {
    const totals = {} as DimensionTotals;
    for (const d of [...APTITUDE_DIMENSIONS, ...PSYCHOMETRIC_DIMENSIONS]) {
        totals[d] = 0;
    }
    return totals;
}

function computeMaxTotals(bank: AssessmentBank): DimensionTotals {
    const totals = createTotals();

    for (const question of bank.questions) {
        const weights = question.dimensionWeights ?? {};
        for (const d of Object.keys(totals) as AssessmentDimension[]) {
            let maxForQuestion = 0;
            for (const option of question.options) {
                const base = option.contributions?.[d] ?? 0;
                const w = (weights as Partial<Record<AssessmentDimension, number>>)[d] ?? 1;
                const score = Math.max(0, Number(base) * w);
                if (score > maxForQuestion) maxForQuestion = score;
            }
            totals[d] += maxForQuestion;
        }
    }

    return totals;
}

function normalizeTotals(raw: DimensionTotals, max: DimensionTotals): DimensionScores {
    const scores = {} as DimensionScores;
    for (const d of Object.keys(raw) as AssessmentDimension[]) {
        const denom = max[d] || 0;
        const value = denom <= 0 ? 0 : (raw[d] / denom) * 100;
        scores[d] = round2(Math.max(0, Math.min(100, value)));
    }
    return scores;
}

function pickDimensions<T extends readonly string[]>(
    obj: Record<string, number>,
    dims: T,
): Record<T[number], number> {
    const picked = {} as Record<T[number], number>;
    for (const d of dims) {
        const key = d as T[number];
        picked[key] = obj[key] ?? 0;
    }
    return picked;
}

function mean(values: number[]) {
    if (values.length === 0) return 0;
    const total = values.reduce((sum, v) => sum + v, 0);
    return round2(total / values.length);
}

function round2(value: number) {
    return Math.round(value * 100) / 100;
}

export function getCareerCatalogV1(): CareerProfile[] {
    const careers: CareerProfile[] = [
        {
            id: "doctor",
            title: "Doctor",
            summary: "Strong fit for people-focused problem solving with calm decision-making under pressure.",
            growthPotential: "High",
            recommendedSkills: ["Biology", "Clinical reasoning", "Communication", "Time management"],
            targetScores: {
                empathy: 80,
                attention_to_detail: 75,
                pressure_handling: 75,
                emotional_stability: 70,
                analytical_thinking: 70,
                decision_making: 70,
            },
            weights: {
                empathy: 0.2,
                attention_to_detail: 0.18,
                pressure_handling: 0.18,
                emotional_stability: 0.14,
                analytical_thinking: 0.15,
                decision_making: 0.15,
            },
        },
        {
            id: "psychologist",
            title: "Psychologist",
            summary: "Strong fit for empathetic communication and social understanding.",
            growthPotential: "High",
            recommendedSkills: ["Active listening", "Counseling basics", "Research literacy"],
            targetScores: {
                empathy: 85,
                communication: 80,
                social_intelligence: 75,
                emotional_stability: 70,
                curiosity: 70,
            },
            weights: {
                empathy: 0.28,
                communication: 0.22,
                social_intelligence: 0.18,
                emotional_stability: 0.16,
                curiosity: 0.16,
            },
        },
        {
            id: "software_engineer",
            title: "Software Engineer",
            summary: "Strong fit for systematic problem solving and analytical thinking.",
            growthPotential: "Very High",
            recommendedSkills: ["Programming", "Data structures", "Debugging", "Systems thinking"],
            targetScores: {
                problem_solving: 80,
                logical_reasoning: 75,
                analytical_thinking: 75,
                attention_to_detail: 70,
                discipline: 65,
            },
            weights: {
                problem_solving: 0.25,
                logical_reasoning: 0.2,
                analytical_thinking: 0.2,
                attention_to_detail: 0.18,
                discipline: 0.17,
            },
        },
        {
            id: "data_scientist",
            title: "Data Scientist",
            summary: "Strong fit for numerical reasoning and analytical thinking.",
            growthPotential: "Very High",
            recommendedSkills: ["Statistics", "Python", "Data storytelling"],
            targetScores: {
                numerical_ability: 80,
                analytical_thinking: 80,
                pattern_recognition: 75,
                attention_to_detail: 70,
                curiosity: 65,
            },
            weights: {
                numerical_ability: 0.25,
                analytical_thinking: 0.25,
                pattern_recognition: 0.2,
                attention_to_detail: 0.18,
                curiosity: 0.12,
            },
        },
        {
            id: "lawyer",
            title: "Lawyer",
            summary: "Strong fit for verbal reasoning, communication, and structured decision-making.",
            growthPotential: "High",
            recommendedSkills: ["Critical reading", "Argumentation", "Negotiation"],
            targetScores: {
                verbal_ability: 80,
                communication: 75,
                analytical_thinking: 70,
                decision_making: 70,
                discipline: 65,
            },
            weights: {
                verbal_ability: 0.28,
                communication: 0.22,
                analytical_thinking: 0.2,
                decision_making: 0.16,
                discipline: 0.14,
            },
        },
        {
            id: "public_policy_analyst",
            title: "Public Policy Analyst",
            summary: "Strong fit for analysis + communication with a people-aware perspective.",
            growthPotential: "High",
            recommendedSkills: ["Research", "Writing", "Stakeholder management"],
            targetScores: {
                analytical_thinking: 78,
                verbal_ability: 70,
                communication: 72,
                empathy: 65,
                decision_making: 68,
            },
            weights: {
                analytical_thinking: 0.3,
                verbal_ability: 0.18,
                communication: 0.2,
                empathy: 0.16,
                decision_making: 0.16,
            },
        },
        {
            id: "chartered_accountant",
            title: "Chartered Accountant",
            summary: "Strong fit for detail-oriented numerical accuracy and discipline.",
            growthPotential: "High",
            recommendedSkills: ["Accounting", "Audit basics", "Excel"],
            targetScores: {
                numerical_ability: 80,
                attention_to_detail: 78,
                discipline: 75,
                analytical_thinking: 70,
            },
            weights: {
                numerical_ability: 0.3,
                attention_to_detail: 0.28,
                discipline: 0.24,
                analytical_thinking: 0.18,
            },
        },
        {
            id: "entrepreneur",
            title: "Entrepreneur",
            summary: "Strong fit for risk-aware decision-making, curiosity, and leadership.",
            growthPotential: "Very High",
            recommendedSkills: ["Problem discovery", "Sales basics", "Execution"],
            targetScores: {
                risk_taking: 75,
                leadership: 70,
                curiosity: 75,
                decision_making: 72,
                adaptability: 70,
            },
            weights: {
                risk_taking: 0.22,
                leadership: 0.18,
                curiosity: 0.22,
                decision_making: 0.2,
                adaptability: 0.18,
            },
        },
        {
            id: "graphic_designer",
            title: "Graphic Designer",
            summary: "Strong fit for creativity, curiosity, and attention to detail.",
            growthPotential: "High",
            recommendedSkills: ["Design principles", "Typography", "Tooling"],
            targetScores: {
                creativity: 85,
                attention_to_detail: 72,
                communication: 65,
                curiosity: 70,
            },
            weights: {
                creativity: 0.35,
                attention_to_detail: 0.25,
                communication: 0.2,
                curiosity: 0.2,
            },
        },
        {
            id: "teacher",
            title: "Teacher",
            summary: "Strong fit for communication, empathy, and disciplined consistency.",
            growthPotential: "High",
            recommendedSkills: ["Explaining", "Patience", "Planning"],
            targetScores: {
                communication: 80,
                empathy: 78,
                discipline: 70,
                social_intelligence: 70,
            },
            weights: {
                communication: 0.3,
                empathy: 0.28,
                discipline: 0.22,
                social_intelligence: 0.2,
            },
        },
        {
            id: "journalist",
            title: "Journalist",
            summary: "Strong fit for curiosity, verbal ability, and communication.",
            growthPotential: "High",
            recommendedSkills: ["Writing", "Interviewing", "Research"],
            targetScores: {
                curiosity: 80,
                verbal_ability: 78,
                communication: 72,
                attention_to_detail: 65,
            },
            weights: {
                curiosity: 0.3,
                verbal_ability: 0.28,
                communication: 0.22,
                attention_to_detail: 0.2,
            },
        },
        {
            id: "architect",
            title: "Architect",
            summary: "Strong fit for pattern recognition, analytical thinking, and creativity.",
            growthPotential: "High",
            recommendedSkills: ["Spatial reasoning", "Design", "Project planning"],
            targetScores: {
                pattern_recognition: 75,
                analytical_thinking: 75,
                creativity: 70,
                attention_to_detail: 70,
                discipline: 65,
            },
            weights: {
                pattern_recognition: 0.22,
                analytical_thinking: 0.24,
                creativity: 0.2,
                attention_to_detail: 0.2,
                discipline: 0.14,
            },
        },
    ];

    // Sanity: weights should sum to ~1.0; if not, normalize.
    return careers.map((career) => {
        const sum = Object.values(career.weights).reduce((acc, v) => acc + (v ?? 0), 0);
        if (!sum || Math.abs(sum - 1) < 1e-6) return career;
        const normalizedWeights: CareerProfile["weights"] = {};
        for (const [k, v] of Object.entries(career.weights)) {
            normalizedWeights[k as keyof CareerProfile["weights"]] = (v ?? 0) / sum;
        }
        return { ...career, weights: normalizedWeights };
    });
}

function scoreCareers(params: {
    normalizedTotals: DimensionScores;
    careers: CareerProfile[];
    aptitudeIndex: number;
    psychometricIndex: number;
}) {
    const { normalizedTotals, careers } = params;

    const scored = careers.map((career) => {
        let score = 0;
        for (const [dimension, w] of Object.entries(career.weights)) {
            const weight = Number(w) || 0;
            if (weight <= 0) continue;
            const target = Number((career.targetScores as Record<string, number>)[dimension]) || 0;
            const user = normalizedTotals[dimension as AssessmentDimension] ?? 0;
            score += weight * (100 - Math.abs(user - target));
        }
        return { id: career.id, title: career.title, score: round2(score) };
    });

    scored.sort((a, b) => {
        if (b.score !== a.score) return b.score - a.score;
        // Tie-break (spec): higher psychometricIndex, then aptitudeIndex, then alphabetical title.
        // Indexes are per-user (constant across careers), so this effectively falls back to title.
        return a.title.localeCompare(b.title);
    });

    const bucketed = scored.map((item, idx) => ({
        ...item,
        bucket: bucketCareer(item.score, idx),
    }));

    return bucketed;
}

function bucketCareer(score: number, rankIndex: number): string {
    if (rankIndex < 3 && score >= 85) return "Best Career Choices";
    if (score >= 70) return "Strong Career Matches";
    if (score >= 55) return "Alternative Career Paths";
    return "Less Suitable Careers";
}
