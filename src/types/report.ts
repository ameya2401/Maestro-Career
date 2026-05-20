export interface UserProfile {
    id: string;
    name: string;
    email: string;
    age: number;
    class: string;
    stream: string;
    interests: string[];
    careerInterests: string[];
    reportDate: string;
}

export interface CareerMatch {
    career: string;
    score: number;
    compatibilityLevel: string;
    description: string;
}

export interface ChartDataPoint {
    subject: string;
    value: number;
    fullMark: number;
}

export interface ReportData {
    user: UserProfile;

    aptitudeScores: Record<string, number> & {
        percentile?: number;
    };

    psychometricScores: Record<string, number>;

    careerMatches: CareerMatch[];

    strengths: string[];

    improvementAreas: string[];

    charts: {
        radarChart: ChartDataPoint[];
        barChart: { name: string; score: number }[];
        pieChart: { name: string; value: number }[];
        vennData: any;
        comparisonData: { label: string; userScore: number; idealScore: number }[];
    };

    recommendations: {
        bestCareers: string[];
        alternativeCareers: string[];
        growthAdvice: string[];
    };

    archetype: {
        title: string;
        description: string;
        traits: string[];
    };

    careerDNA?: {
        analytical: number;
        creative: number;
        leadership: number;
        research: number;
        innovation: number;
    };
}
