import { ReportData } from "@/types/report";

export const mockReportData: Record<string, ReportData> = {
    "engineering-student": {
        user: {
            id: "u1-engineering-mock",
            name: "Aryan Sharma",
            email: "aryan@example.com",
            age: 17,
            class: "12th",
            stream: "PCM (Physics, Chemistry, Maths)",
            interests: ["Robotics", "Space Science", "Chess"],
            careerInterests: ["Aerospace Engineering", "Data Science"],
            reportDate: new Date().toLocaleDateString(),
        },
        aptitudeScores: {
            logical_reasoning: 85,
            analytical_thinking: 92,
            numerical_ability: 88,
            verbal_ability: 65,
            decision_making: 78,
            problem_solving: 95,
            percentile: 94,
        },
        psychometricScores: {
            leadership: 75,
            creativity: 70,
            empathy: 60,
            communication: 65,
            discipline: 90,
            adaptability: 80,
            emotional_stability: 85,
            curiosity: 95,
            pressure_handling: 82,
        },
        archetype: {
            title: "The Master Systems-Engineer",
            description: "Solves complex structural problems with precision and deep focus. Thrives in environments demanding systematic rigor.",
            traits: ["Logical", "Precise", "Focused"]
        },
        careerDNA: {
            analytical: 90,
            creative: 68,
            leadership: 75,
            research: 85,
            innovation: 80,
        },
        careerMatches: [
            {
                career: "Aerospace Engineer",
                score: 95,
                compatibilityLevel: "PRIME",
                description: "Your high analytical and numerical scores make you a perfect fit for aerospace engineering.",
            },
            {
                career: "Data Scientist",
                score: 90,
                compatibilityLevel: "HIGH",
                description: "Your ability to process complex data and logical thinking is ideal for data science.",
            },
            {
                career: "Software Architect",
                score: 88,
                compatibilityLevel: "STRONG",
                description: "Systems thinking and structural planning are your fortes.",
            }
        ],
        strengths: [
            "Highly Analytical Mindset",
            "Exceptional Problem Solving",
            "Disciplined Learning Approach",
            "Curiosity-driven Exploration"
        ],
        improvementAreas: [
            "Verbal Communication nuance",
            "Emotional Intelligence in team settings",
            "Public Speaking confidence"
        ],
        charts: {
            radarChart: [
                { subject: "Leadership", value: 75, fullMark: 100 },
                { subject: "Creativity", value: 70, fullMark: 100 },
                { subject: "Empathy", value: 60, fullMark: 100 },
                { subject: "Communication", value: 65, fullMark: 100 },
                { subject: "Discipline", value: 90, fullMark: 100 },
                { subject: "Adaptability", value: 80, fullMark: 100 },
            ],
            barChart: [
                { name: "Logical", score: 85 },
                { name: "Analytical", score: 92 },
                { name: "Numerical", score: 88 },
                { name: "Verbal", score: 65 },
                { name: "Decision", score: 78 },
            ],
            pieChart: [
                { name: "STEM", value: 45 },
                { name: "Finance", value: 25 },
                { name: "Arts", value: 10 },
                { name: "Management", value: 20 },
            ],
            vennData: {},
            comparisonData: [
                { label: "Analytical Thinking", userScore: 92, idealScore: 85 },
                { label: "Problem Solving", userScore: 95, idealScore: 80 },
                { label: "Communication", userScore: 65, idealScore: 85 },
            ]
        },
        recommendations: {
            bestCareers: ["Aerospace Engineering", "Robotics Research", "Computer Science"],
            alternativeCareers: ["Quantitative Finance", "Strategic Consulting"],
            growthAdvice: [
                "Participate in public speaking workshops to enhance communication.",
                "Take on leadership roles in team projects to build empathy.",
                "Explore technical writing to bridge the gap between analysis and expression."
            ]
        }
    },
    "creative-student": {
        user: {
            id: "u2-creative-mock",
            name: "Ishani Kapoor",
            email: "ishani@example.com",
            age: 16,
            class: "11th",
            stream: "Humanities",
            interests: ["Digital Art", "Creative Writing", "Photography"],
            careerInterests: ["UX/UI Design", "Film Direction"],
            reportDate: new Date().toLocaleDateString(),
        },
        aptitudeScores: {
            logical_reasoning: 60,
            analytical_thinking: 70,
            numerical_ability: 50,
            verbal_ability: 92,
            decision_making: 75,
            problem_solving: 80,
            percentile: 88,
        },
        psychometricScores: {
            leadership: 80,
            creativity: 98,
            empathy: 90,
            communication: 95,
            discipline: 65,
            adaptability: 92,
            emotional_stability: 78,
            curiosity: 96,
            pressure_handling: 70,
        },
        archetype: {
            title: "The Dynamic Leader",
            description: "Inspires teams and drives high-level change through charisma and logic. Natural storyteller and people connector.",
            traits: ["Charismatic", "Decisive", "Creative"]
        },
        careerDNA: {
            analytical: 65,
            creative: 98,
            leadership: 80,
            research: 60,
            innovation: 92,
        },
        careerMatches: [
            {
                career: "UX/UI Designer",
                score: 96,
                compatibilityLevel: "PRIME",
                description: "Your blend of creativity and empathy makes you a top-tier candidate for UX design.",
            },
            {
                career: "Content Strategist",
                score: 92,
                compatibilityLevel: "HIGH",
                description: "Strong verbal skills and creative flair are perfect for storytelling and strategy.",
            }
        ],
        strengths: [
            "Innate Creative Vision",
            "High Emotional Intelligence",
            "Masterful Communication",
            "Fluid Adaptability"
        ],
        improvementAreas: [
            "Quantitative Analysis",
            "Structured Task Management",
            "Technical Problem Solving"
        ],
        charts: {
            radarChart: [
                { subject: "Leadership", value: 80, fullMark: 100 },
                { subject: "Creativity", value: 98, fullMark: 100 },
                { subject: "Empathy", value: 90, fullMark: 100 },
                { subject: "Communication", value: 95, fullMark: 100 },
                { subject: "Discipline", value: 65, fullMark: 100 },
                { subject: "Adaptability", value: 92, fullMark: 100 },
            ],
            barChart: [
                { name: "Logical", score: 60 },
                { name: "Analytical", score: 70 },
                { name: "Numerical", score: 50 },
                { name: "Verbal", score: 92 },
                { name: "Decision", score: 75 },
            ],
            pieChart: [
                { name: "Arts & Design", value: 60 },
                { name: "Social Sciences", value: 25 },
                { name: "Business", value: 10 },
                { name: "STEM", value: 5 },
            ],
            vennData: {},
            comparisonData: [
                { label: "Creativity", userScore: 98, idealScore: 80 },
                { label: "Communication", userScore: 95, idealScore: 75 },
                { label: "Numerical Ability", userScore: 50, idealScore: 70 },
            ]
        },
        recommendations: {
            bestCareers: ["UX/UI Design", "Creative Direction", "Media Studies"],
            alternativeCareers: ["Public Relations", "Brand Management"],
            growthAdvice: [
                "Focus on learning basic data analytics to support your creative decisions.",
                "Use project management tools to improve discipline and task tracking.",
                "Collaborate with technical teams to understand the implementation side of design."
            ]
        }
    }
};
