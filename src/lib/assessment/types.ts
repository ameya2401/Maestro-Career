export const APTITUDE_DIMENSIONS = [
    "logical_reasoning",
    "numerical_ability",
    "analytical_thinking",
    "pattern_recognition",
    "verbal_ability",
    "problem_solving",
    "decision_making",
] as const;

export const PSYCHOMETRIC_DIMENSIONS = [
    "leadership",
    "creativity",
    "emotional_stability",
    "communication",
    "social_intelligence",
    "empathy",
    "adaptability",
    "discipline",
    "risk_taking",
    "curiosity",
    "attention_to_detail",
    "pressure_handling",
] as const;

export type AptitudeDimension = (typeof APTITUDE_DIMENSIONS)[number];
export type PsychometricDimension = (typeof PSYCHOMETRIC_DIMENSIONS)[number];
export type AssessmentDimension = AptitudeDimension | PsychometricDimension;

export type AssessmentSection = "A" | "B";

export interface AssessmentOption {
    id: string;
    label: string;
    text: string;
    contributions: Partial<Record<AssessmentDimension, number>>;
    isPreferred?: boolean;
}

export interface AssessmentQuestion {
    id: string;
    section: AssessmentSection;
    category: string;
    prompt: string;
    options: AssessmentOption[];
    correctOptionId?: string;
    dimensionWeights: Partial<Record<AssessmentDimension, number>>;
    version: string;
}

export interface CareerProfile {
    id: string;
    title: string;
    targetScores: Partial<Record<AssessmentDimension, number>>;
    weights: Partial<Record<AssessmentDimension, number>>;
    summary: string;
    recommendedSkills: string[];
    growthPotential: string;
}

export type DimensionTotals = Record<AssessmentDimension, number>;
export type DimensionScores = Record<AssessmentDimension, number>;

export type AssessmentBank = {
    version: string;
    questions: AssessmentQuestion[];
};
