import {
    AssessmentBank,
    AssessmentQuestion,
    APTITUDE_DIMENSIONS,
    PSYCHOMETRIC_DIMENSIONS,
} from "@/lib/assessment/types";

const VERSION = "prototype-1-v1";

function q(partial: Omit<AssessmentQuestion, "version">): AssessmentQuestion {
    return { ...partial, version: VERSION };
}

// Notes:
// - Section A = Aptitude (25 questions)
// - Section B = Psychometric (25 questions)
// - Every option carries explicit contributions (non-negative)
// - Aptitude questions include correctOptionId, but wrong options still contribute diagnostically

export const PROTOTYPE_1_V1: AssessmentBank = {
    version: VERSION,
    questions: [
        // -------------------------
        // Section A: Aptitude (25)
        // -------------------------
        q({
            id: "A01",
            section: "A",
            category: "logical_reasoning",
            prompt: "If all Bloops are Razzies and all Razzies are Lazzies, which statement must be true?",
            correctOptionId: "A",
            dimensionWeights: { logical_reasoning: 1 },
            options: [
                {
                    id: "A",
                    label: "A",
                    text: "All Bloops are Lazzies.",
                    contributions: { logical_reasoning: 4, analytical_thinking: 2 },
                },
                {
                    id: "B",
                    label: "B",
                    text: "All Lazzies are Bloops.",
                    contributions: { logical_reasoning: 1, analytical_thinking: 1 },
                },
                {
                    id: "C",
                    label: "C",
                    text: "Some Bloops are not Lazzies.",
                    contributions: { logical_reasoning: 1 },
                },
                {
                    id: "D",
                    label: "D",
                    text: "Some Lazzies are not Razzies.",
                    contributions: { logical_reasoning: 1 },
                },
            ],
        }),
        q({
            id: "A02",
            section: "A",
            category: "numerical_ability",
            prompt: "A shop offers 20% off on a ₹1,250 item. What is the discounted price?",
            correctOptionId: "B",
            dimensionWeights: { numerical_ability: 1 },
            options: [
                { id: "A", label: "A", text: "₹900", contributions: { numerical_ability: 1 } },
                { id: "B", label: "B", text: "₹1,000", contributions: { numerical_ability: 4, decision_making: 1 } },
                { id: "C", label: "C", text: "₹1,050", contributions: { numerical_ability: 2 } },
                { id: "D", label: "D", text: "₹1,125", contributions: { numerical_ability: 1 } },
            ],
        }),
        q({
            id: "A03",
            section: "A",
            category: "pattern_recognition",
            prompt: "Find the next number in the series: 2, 6, 12, 20, 30, ?",
            correctOptionId: "C",
            dimensionWeights: { pattern_recognition: 1 },
            options: [
                { id: "A", label: "A", text: "38", contributions: { pattern_recognition: 1 } },
                { id: "B", label: "B", text: "40", contributions: { pattern_recognition: 2 } },
                { id: "C", label: "C", text: "42", contributions: { pattern_recognition: 4, analytical_thinking: 2 } },
                { id: "D", label: "D", text: "44", contributions: { pattern_recognition: 1 } },
            ],
        }),
        q({
            id: "A04",
            section: "A",
            category: "verbal_ability",
            prompt: "Choose the word that is closest in meaning to 'RESILIENT'.",
            correctOptionId: "D",
            dimensionWeights: { verbal_ability: 1 },
            options: [
                { id: "A", label: "A", text: "Fragile", contributions: { verbal_ability: 1 } },
                { id: "B", label: "B", text: "Careless", contributions: { verbal_ability: 1 } },
                { id: "C", label: "C", text: "Rigid", contributions: { verbal_ability: 2 } },
                { id: "D", label: "D", text: "Able to recover quickly", contributions: { verbal_ability: 4, analytical_thinking: 1 } },
            ],
        }),
        q({
            id: "A05",
            section: "A",
            category: "analytical_thinking",
            prompt: "A data report shows: Sales ↑, Profit ↓. Which is the most plausible explanation?",
            correctOptionId: "B",
            dimensionWeights: { analytical_thinking: 1, decision_making: 0.5 },
            options: [
                {
                    id: "A",
                    label: "A",
                    text: "Customers were more satisfied.",
                    contributions: { analytical_thinking: 1 },
                },
                {
                    id: "B",
                    label: "B",
                    text: "Costs increased or discounts reduced margins.",
                    contributions: { analytical_thinking: 4, decision_making: 2 },
                },
                {
                    id: "C",
                    label: "C",
                    text: "The company hired fewer people.",
                    contributions: { analytical_thinking: 2 },
                },
                {
                    id: "D",
                    label: "D",
                    text: "Advertising was stopped completely.",
                    contributions: { analytical_thinking: 1 },
                },
            ],
        }),
        q({
            id: "A06",
            section: "A",
            category: "numerical_ability",
            prompt: "If 8 workers complete a task in 15 days, how many days will 12 workers take (same rate)?",
            correctOptionId: "A",
            dimensionWeights: { numerical_ability: 1, problem_solving: 0.5 },
            options: [
                { id: "A", label: "A", text: "10 days", contributions: { numerical_ability: 4, problem_solving: 2 } },
                { id: "B", label: "B", text: "12 days", contributions: { numerical_ability: 2 } },
                { id: "C", label: "C", text: "15 days", contributions: { numerical_ability: 1 } },
                { id: "D", label: "D", text: "18 days", contributions: { numerical_ability: 1 } },
            ],
        }),
        q({
            id: "A07",
            section: "A",
            category: "logical_reasoning",
            prompt: "Which option completes the analogy: Book is to Reading as Fork is to ____?",
            correctOptionId: "C",
            dimensionWeights: { verbal_ability: 0.5, logical_reasoning: 0.5 },
            options: [
                { id: "A", label: "A", text: "Drawing", contributions: { logical_reasoning: 1, verbal_ability: 1 } },
                { id: "B", label: "B", text: "Writing", contributions: { logical_reasoning: 2, verbal_ability: 1 } },
                { id: "C", label: "C", text: "Eating", contributions: { logical_reasoning: 4, verbal_ability: 2 } },
                { id: "D", label: "D", text: "Sleeping", contributions: { logical_reasoning: 1 } },
            ],
        }),
        q({
            id: "A08",
            section: "A",
            category: "pattern_recognition",
            prompt: "Which shape should come next? ▲ ▼ ▲ ▼ ▲ ?",
            correctOptionId: "B",
            dimensionWeights: { pattern_recognition: 1 },
            options: [
                { id: "A", label: "A", text: "▲", contributions: { pattern_recognition: 2 } },
                { id: "B", label: "B", text: "▼", contributions: { pattern_recognition: 4, analytical_thinking: 1 } },
                { id: "C", label: "C", text: "■", contributions: { pattern_recognition: 1 } },
                { id: "D", label: "D", text: "●", contributions: { pattern_recognition: 1 } },
            ],
        }),
        q({
            id: "A09",
            section: "A",
            category: "problem_solving",
            prompt: "You have a 5L and a 3L jug. How can you measure exactly 4L?",
            correctOptionId: "D",
            dimensionWeights: { problem_solving: 1, analytical_thinking: 0.5 },
            options: [
                { id: "A", label: "A", text: "Fill 3L jug twice and pour into 5L jug.", contributions: { problem_solving: 1 } },
                { id: "B", label: "B", text: "Fill 5L jug and empty it once.", contributions: { problem_solving: 1 } },
                { id: "C", label: "C", text: "Fill 3L jug and pour into 5L jug, repeat.", contributions: { problem_solving: 2 } },
                {
                    id: "D",
                    label: "D",
                    text: "Fill 5L, pour into 3L (2L left), empty 3L, pour 2L, fill 5L, top 3L to leave 4L.",
                    contributions: { problem_solving: 4, analytical_thinking: 2 },
                },
            ],
        }),
        q({
            id: "A10",
            section: "A",
            category: "decision_making",
            prompt: "You must choose one of two routes. Route 1 is usually fast but sometimes blocked; Route 2 is consistently moderate. What is the best approach?",
            correctOptionId: "B",
            dimensionWeights: { decision_making: 1 },
            options: [
                { id: "A", label: "A", text: "Always take Route 1.", contributions: { decision_making: 1 } },
                { id: "B", label: "B", text: "Check current conditions; choose based on risk/time trade-off.", contributions: { decision_making: 4, analytical_thinking: 2 } },
                { id: "C", label: "C", text: "Always take Route 2.", contributions: { decision_making: 2 } },
                { id: "D", label: "D", text: "Flip a coin.", contributions: { decision_making: 1 } },
            ],
        }),
        // 15 more aptitude questions, authored in consistent tone
        q({
            id: "A11",
            section: "A",
            category: "numerical_ability",
            prompt: "A number is increased by 25% and then decreased by 20%. The net change is:",
            correctOptionId: "C",
            dimensionWeights: { numerical_ability: 1, analytical_thinking: 0.5 },
            options: [
                { id: "A", label: "A", text: "No change", contributions: { numerical_ability: 1 } },
                { id: "B", label: "B", text: "Increase of 5%", contributions: { numerical_ability: 2 } },
                { id: "C", label: "C", text: "No net change (because 1.25 × 0.8 = 1.0)", contributions: { numerical_ability: 4, analytical_thinking: 2 } },
                { id: "D", label: "D", text: "Decrease of 5%", contributions: { numerical_ability: 2 } },
            ],
        }),
        q({
            id: "A12",
            section: "A",
            category: "verbal_ability",
            prompt: "Choose the correct sentence:",
            correctOptionId: "A",
            dimensionWeights: { verbal_ability: 1 },
            options: [
                { id: "A", label: "A", text: "Neither of the answers is correct.", contributions: { verbal_ability: 4 } },
                { id: "B", label: "B", text: "Neither of the answers are correct.", contributions: { verbal_ability: 2 } },
                { id: "C", label: "C", text: "Neither answers is correct.", contributions: { verbal_ability: 1 } },
                { id: "D", label: "D", text: "Neither answer are correct.", contributions: { verbal_ability: 1 } },
            ],
        }),
        q({
            id: "A13",
            section: "A",
            category: "analytical_thinking",
            prompt: "A study finds correlation between screen time and lower sleep. What is the best conclusion?",
            correctOptionId: "B",
            dimensionWeights: { analytical_thinking: 1, decision_making: 0.5 },
            options: [
                { id: "A", label: "A", text: "Screen time definitely causes poor sleep.", contributions: { analytical_thinking: 1 } },
                { id: "B", label: "B", text: "There is an association; causation requires more evidence.", contributions: { analytical_thinking: 4, decision_making: 2 } },
                { id: "C", label: "C", text: "Sleep has no relation to screen time.", contributions: { analytical_thinking: 1 } },
                { id: "D", label: "D", text: "The study must be wrong.", contributions: { analytical_thinking: 1 } },
            ],
        }),
        q({
            id: "A14",
            section: "A",
            category: "logical_reasoning",
            prompt: "If 'Some cats are black' is true, which statement must also be true?",
            correctOptionId: "A",
            dimensionWeights: { logical_reasoning: 1 },
            options: [
                { id: "A", label: "A", text: "At least one cat is black.", contributions: { logical_reasoning: 4, analytical_thinking: 1 } },
                { id: "B", label: "B", text: "All cats are black.", contributions: { logical_reasoning: 1 } },
                { id: "C", label: "C", text: "No cats are black.", contributions: { logical_reasoning: 1 } },
                { id: "D", label: "D", text: "All black animals are cats.", contributions: { logical_reasoning: 1 } },
            ],
        }),
        q({
            id: "A15",
            section: "A",
            category: "pattern_recognition",
            prompt: "Find the odd one out: 16, 25, 36, 49, 64",
            correctOptionId: "B",
            dimensionWeights: { pattern_recognition: 1, analytical_thinking: 0.5 },
            options: [
                { id: "A", label: "A", text: "16", contributions: { pattern_recognition: 2 } },
                { id: "B", label: "B", text: "25", contributions: { pattern_recognition: 4, analytical_thinking: 2 } },
                { id: "C", label: "C", text: "36", contributions: { pattern_recognition: 2 } },
                { id: "D", label: "D", text: "49", contributions: { pattern_recognition: 2 } },
            ],
        }),
        q({
            id: "A16",
            section: "A",
            category: "problem_solving",
            prompt: "You need to schedule 3 tasks taking 2h, 1h, and 3h respectively, with a 4h deadline. What should you do?",
            correctOptionId: "B",
            dimensionWeights: { problem_solving: 1, decision_making: 0.5 },
            options: [
                { id: "A", label: "A", text: "Start with the 3h task only.", contributions: { problem_solving: 1 } },
                { id: "B", label: "B", text: "Do the 1h + 3h tasks; postpone the 2h task.", contributions: { problem_solving: 4, decision_making: 2 } },
                { id: "C", label: "C", text: "Do the 2h + 1h tasks; postpone the 3h task.", contributions: { problem_solving: 2, decision_making: 1 } },
                { id: "D", label: "D", text: "Try to do all tasks simultaneously.", contributions: { problem_solving: 1 } },
            ],
        }),
        q({
            id: "A17",
            section: "A",
            category: "numerical_ability",
            prompt: "If x + 3 = 2x - 5, what is x?",
            correctOptionId: "D",
            dimensionWeights: { numerical_ability: 1, logical_reasoning: 0.5 },
            options: [
                { id: "A", label: "A", text: "2", contributions: { numerical_ability: 1 } },
                { id: "B", label: "B", text: "4", contributions: { numerical_ability: 2 } },
                { id: "C", label: "C", text: "6", contributions: { numerical_ability: 2 } },
                { id: "D", label: "D", text: "8", contributions: { numerical_ability: 4, logical_reasoning: 2 } },
            ],
        }),
        q({
            id: "A18",
            section: "A",
            category: "verbal_ability",
            prompt: "Choose the best meaning of the phrase 'break the ice'.",
            correctOptionId: "A",
            dimensionWeights: { verbal_ability: 1 },
            options: [
                { id: "A", label: "A", text: "To start a friendly conversation", contributions: { verbal_ability: 4 } },
                { id: "B", label: "B", text: "To end a relationship", contributions: { verbal_ability: 1 } },
                { id: "C", label: "C", text: "To become angry", contributions: { verbal_ability: 1 } },
                { id: "D", label: "D", text: "To ignore someone", contributions: { verbal_ability: 1 } },
            ],
        }),
        q({
            id: "A19",
            section: "A",
            category: "analytical_thinking",
            prompt: "A project is late. Which action is most effective first?",
            correctOptionId: "C",
            dimensionWeights: { analytical_thinking: 1, decision_making: 0.5 },
            options: [
                { id: "A", label: "A", text: "Work longer hours without planning", contributions: { analytical_thinking: 1 } },
                { id: "B", label: "B", text: "Blame the team", contributions: { analytical_thinking: 1 } },
                { id: "C", label: "C", text: "Identify bottlenecks, re-plan scope and owners", contributions: { analytical_thinking: 4, decision_making: 2, problem_solving: 2 } },
                { id: "D", label: "D", text: "Wait for updates", contributions: { analytical_thinking: 1 } },
            ],
        }),
        q({
            id: "A20",
            section: "A",
            category: "pattern_recognition",
            prompt: "Complete: AB, DE, GH, JK, ?",
            correctOptionId: "B",
            dimensionWeights: { pattern_recognition: 1, verbal_ability: 0.5 },
            options: [
                { id: "A", label: "A", text: "LM", contributions: { pattern_recognition: 2 } },
                { id: "B", label: "B", text: "MN", contributions: { pattern_recognition: 4, verbal_ability: 2 } },
                { id: "C", label: "C", text: "NO", contributions: { pattern_recognition: 2 } },
                { id: "D", label: "D", text: "OP", contributions: { pattern_recognition: 1 } },
            ],
        }),
        q({
            id: "A21",
            section: "A",
            category: "decision_making",
            prompt: "You discover conflicting requirements from two stakeholders. What do you do?",
            correctOptionId: "A",
            dimensionWeights: { decision_making: 1 },
            options: [
                { id: "A", label: "A", text: "Clarify priorities jointly and document an agreed decision", contributions: { decision_making: 4 } },
                { id: "B", label: "B", text: "Pick one stakeholder and ignore the other", contributions: { decision_making: 1 } },
                { id: "C", label: "C", text: "Do nothing until they agree", contributions: { decision_making: 2 } },
                { id: "D", label: "D", text: "Build both versions", contributions: { decision_making: 1 } },
            ],
        }),
        q({
            id: "A22",
            section: "A",
            category: "problem_solving",
            prompt: "A bug appears only in production. What is the best first step?",
            correctOptionId: "C",
            dimensionWeights: { problem_solving: 1 },
            options: [
                { id: "A", label: "A", text: "Randomly change code until it stops", contributions: { problem_solving: 1 } },
                { id: "B", label: "B", text: "Restart the server repeatedly", contributions: { problem_solving: 1 } },
                { id: "C", label: "C", text: "Reproduce with logs/inputs and compare environments", contributions: { problem_solving: 4, analytical_thinking: 2 } },
                { id: "D", label: "D", text: "Ignore it", contributions: { problem_solving: 1 } },
            ],
        }),
        q({
            id: "A23",
            section: "A",
            category: "logical_reasoning",
            prompt: "If today is Wednesday, what day will it be 100 days from today?",
            correctOptionId: "B",
            dimensionWeights: { logical_reasoning: 1, numerical_ability: 0.5 },
            options: [
                { id: "A", label: "A", text: "Friday", contributions: { logical_reasoning: 2 } },
                { id: "B", label: "B", text: "Friday (because 100 mod 7 = 2)", contributions: { logical_reasoning: 4, numerical_ability: 2 } },
                { id: "C", label: "C", text: "Saturday", contributions: { logical_reasoning: 1 } },
                { id: "D", label: "D", text: "Monday", contributions: { logical_reasoning: 1 } },
            ],
        }),
        q({
            id: "A24",
            section: "A",
            category: "verbal_ability",
            prompt: "Choose the best title for a paragraph about reducing plastic waste through reuse and recycling.",
            correctOptionId: "A",
            dimensionWeights: { verbal_ability: 1, decision_making: 0.5 },
            options: [
                { id: "A", label: "A", text: "Practical Steps to Reduce Plastic Waste", contributions: { verbal_ability: 4, decision_making: 1 } },
                { id: "B", label: "B", text: "The History of Plastics", contributions: { verbal_ability: 2 } },
                { id: "C", label: "C", text: "Famous Rivers in the World", contributions: { verbal_ability: 1 } },
                { id: "D", label: "D", text: "Why All Waste is the Same", contributions: { verbal_ability: 1 } },
            ],
        }),
        q({
            id: "A25",
            section: "A",
            category: "analytical_thinking",
            prompt: "A team has 3 hypotheses. Which is the most rigorous way to decide which is true?",
            correctOptionId: "D",
            dimensionWeights: { analytical_thinking: 1, problem_solving: 0.5 },
            options: [
                { id: "A", label: "A", text: "Choose the most popular hypothesis", contributions: { analytical_thinking: 1 } },
                { id: "B", label: "B", text: "Choose the easiest to implement", contributions: { analytical_thinking: 2 } },
                { id: "C", label: "C", text: "Pick the one suggested by the manager", contributions: { analytical_thinking: 1 } },
                { id: "D", label: "D", text: "Design tests and evaluate evidence for each", contributions: { analytical_thinking: 4, problem_solving: 2 } },
            ],
        }),

        // ----------------------------
        // Section B: Psychometric (25)
        // ----------------------------
        q({
            id: "B01",
            section: "B",
            category: "leadership",
            prompt: "When working in a group, you usually:",
            dimensionWeights: { leadership: 1, communication: 0.5 },
            options: [
                { id: "A", label: "A", text: "Take charge and assign roles", contributions: { leadership: 4, communication: 2, discipline: 1 }, isPreferred: true },
                { id: "B", label: "B", text: "Support the leader and execute tasks well", contributions: { leadership: 2, discipline: 2 } },
                { id: "C", label: "C", text: "Prefer to work alone to avoid confusion", contributions: { leadership: 1, adaptability: 1 } },
                { id: "D", label: "D", text: "Wait for others to decide", contributions: { leadership: 1, communication: 1 } },
            ],
        }),
        q({
            id: "B02",
            section: "B",
            category: "emotional_stability",
            prompt: "When plans suddenly change, you typically feel:",
            dimensionWeights: { emotional_stability: 1, adaptability: 0.5 },
            options: [
                { id: "A", label: "A", text: "Highly stressed and stuck", contributions: { emotional_stability: 1, adaptability: 1 } },
                { id: "B", label: "B", text: "A bit uneasy but you adjust", contributions: { emotional_stability: 3, adaptability: 2 } },
                { id: "C", label: "C", text: "Calm and ready to re-plan", contributions: { emotional_stability: 4, adaptability: 3 }, isPreferred: true },
                { id: "D", label: "D", text: "Excited because uncertainty is fun", contributions: { emotional_stability: 2, risk_taking: 2 } },
            ],
        }),
        q({
            id: "B03",
            section: "B",
            category: "curiosity",
            prompt: "If you encounter an unfamiliar topic, you are most likely to:",
            dimensionWeights: { curiosity: 1, discipline: 0.5 },
            options: [
                { id: "A", label: "A", text: "Explore it deeply on your own", contributions: { curiosity: 4, discipline: 2 }, isPreferred: true },
                { id: "B", label: "B", text: "Skim basic information", contributions: { curiosity: 2, discipline: 1 } },
                { id: "C", label: "C", text: "Avoid it unless required", contributions: { curiosity: 1 } },
                { id: "D", label: "D", text: "Ask someone else to summarize it", contributions: { curiosity: 2, social_intelligence: 1 } },
            ],
        }),
        q({
            id: "B04",
            section: "B",
            category: "communication",
            prompt: "In difficult conversations, you tend to:",
            dimensionWeights: { communication: 1, empathy: 0.5 },
            options: [
                { id: "A", label: "A", text: "Speak directly, even if it feels blunt", contributions: { communication: 3, empathy: 1 } },
                { id: "B", label: "B", text: "Listen first and respond thoughtfully", contributions: { communication: 4, empathy: 3 }, isPreferred: true },
                { id: "C", label: "C", text: "Avoid the conversation", contributions: { communication: 1, emotional_stability: 1 } },
                { id: "D", label: "D", text: "Use humor to change the topic", contributions: { communication: 2, social_intelligence: 1 } },
            ],
        }),
        q({
            id: "B05",
            section: "B",
            category: "attention_to_detail",
            prompt: "When reviewing your work, you usually:",
            dimensionWeights: { attention_to_detail: 1, discipline: 0.5 },
            options: [
                { id: "A", label: "A", text: "Submit quickly; fixes can come later", contributions: { attention_to_detail: 1, risk_taking: 1 } },
                { id: "B", label: "B", text: "Check the main points only", contributions: { attention_to_detail: 2, discipline: 1 } },
                { id: "C", label: "C", text: "Review carefully and validate assumptions", contributions: { attention_to_detail: 4, discipline: 2 }, isPreferred: true },
                { id: "D", label: "D", text: "Ask someone else to proofread", contributions: { attention_to_detail: 3, communication: 1 } },
            ],
        }),

        // 20 more psychometric questions (authored, 4 options each)
        ...createPsychometricFillers(),
    ],
};

function createPsychometricFillers(): AssessmentQuestion[] {
    const questions: AssessmentQuestion[] = [];
    const make = (n: number, prompt: string, weights: Record<string, number>, options: Array<[string, string, Record<string, number>, boolean?]>) =>
        q({
            id: `B${String(n).padStart(2, "0")}`,
            section: "B",
            category: Object.keys(weights)[0] ?? "psychometric",
            prompt,
            dimensionWeights: weights,
            options: options.map(([id, text, contributions, isPreferred]) => ({
                id,
                label: id,
                text,
                contributions,
                ...(isPreferred ? { isPreferred: true } : {}),
            })),
        });

    const base = 6;

    questions.push(
        make(base + 0, "When faced with a tight deadline, you typically:", { pressure_handling: 1, discipline: 0.5 }, [
            ["A", "Feel overwhelmed and freeze", { pressure_handling: 1, discipline: 1 }],
            ["B", "Prioritize tasks and proceed steadily", { pressure_handling: 4, discipline: 3 }, true],
            ["C", "Work intensely but skip planning", { pressure_handling: 3, discipline: 1 }],
            ["D", "Delay until the last moment", { pressure_handling: 1 }],
        ]),
        make(base + 1, "You are more motivated by:", { risk_taking: 0.5, discipline: 0.5, curiosity: 0.5 }, [
            ["A", "Stable routines", { discipline: 3, emotional_stability: 2 }],
            ["B", "New challenges", { curiosity: 4, risk_taking: 2 }, true],
            ["C", "Recognition from others", { leadership: 2, social_intelligence: 2 }],
            ["D", "Avoiding mistakes", { attention_to_detail: 3, discipline: 2 }],
        ]),
        make(base + 2, "When learning something new, you prefer:", { creativity: 0.5, curiosity: 1 }, [
            ["A", "Clear step-by-step instructions", { discipline: 3, attention_to_detail: 2 }],
            ["B", "Experimenting and discovering patterns", { curiosity: 4, creativity: 3 }, true],
            ["C", "Watching others do it", { social_intelligence: 2, communication: 1 }],
            ["D", "Only learning what is required", { curiosity: 1, discipline: 1 }],
        ]),
        make(base + 3, "In disagreements, you usually:", { empathy: 0.5, communication: 1, social_intelligence: 0.5 }, [
            ["A", "Try to understand both sides and find common ground", { empathy: 4, communication: 3, social_intelligence: 3 }, true],
            ["B", "Argue strongly for your view", { communication: 3, leadership: 2 }],
            ["C", "Avoid conflict", { empathy: 2, emotional_stability: 2 }],
            ["D", "Let others decide", { communication: 1 }],
        ]),
        make(base + 4, "You feel most energized when:", { social_intelligence: 0.5, creativity: 0.5, leadership: 0.5 }, [
            ["A", "Solving problems alone", { discipline: 2, curiosity: 2 }],
            ["B", "Collaborating with a team", { social_intelligence: 4, communication: 3 }, true],
            ["C", "Presenting ideas publicly", { leadership: 3, communication: 3 }],
            ["D", "Brainstorming new concepts", { creativity: 4, curiosity: 2 }],
        ]),
    );

    // Fill remaining up to B25 with consistent structure
    const templates: Array<{ prompt: string; weights: Record<string, number>; options: Array<[string, string, Record<string, number>, boolean?]> }> = [
        {
            prompt: "When you make a mistake, you usually:",
            weights: { discipline: 0.5, emotional_stability: 0.5, attention_to_detail: 0.5 },
            options: [
                ["A", "Hide it and hope it goes unnoticed", { emotional_stability: 1 }],
                ["B", "Acknowledge it and fix it quickly", { discipline: 3, attention_to_detail: 3, emotional_stability: 3 }, true],
                ["C", "Blame circumstances", { emotional_stability: 2, communication: 1 }],
                ["D", "Get discouraged for a long time", { emotional_stability: 1 }],
            ],
        },
        {
            prompt: "Your approach to rules is:",
            weights: { discipline: 1, risk_taking: 0.5 },
            options: [
                ["A", "Follow them strictly", { discipline: 4, attention_to_detail: 2 }, true],
                ["B", "Follow most, but bend when needed", { discipline: 3, adaptability: 2 }],
                ["C", "Prefer flexibility over rules", { adaptability: 3, creativity: 2 }],
                ["D", "Rules should be ignored", { risk_taking: 2, discipline: 1 }],
            ],
        },
        {
            prompt: "When taking a big decision, you:",
            weights: { emotional_stability: 0.5, pressure_handling: 0.5, risk_taking: 0.5 },
            options: [
                ["A", "Decide quickly based on intuition", { risk_taking: 3, pressure_handling: 2 }],
                ["B", "Gather info, weigh outcomes, then decide", { emotional_stability: 3, pressure_handling: 3, discipline: 2 }, true],
                ["C", "Delay as long as possible", { emotional_stability: 1 }],
                ["D", "Let others decide", { social_intelligence: 1, communication: 1 }],
            ],
        },
        {
            prompt: "In a new environment, you typically:",
            weights: { adaptability: 1, social_intelligence: 0.5 },
            options: [
                ["A", "Observe quietly first", { attention_to_detail: 2, emotional_stability: 2 }],
                ["B", "Introduce yourself and connect", { social_intelligence: 4, communication: 3 }, true],
                ["C", "Feel uncomfortable for long", { adaptability: 1 }],
                ["D", "Take control immediately", { leadership: 3, risk_taking: 2 }],
            ],
        },
        {
            prompt: "Your creativity shows up most when:",
            weights: { creativity: 1, curiosity: 0.5 },
            options: [
                ["A", "Following proven methods", { discipline: 2 }],
                ["B", "Combining ideas in new ways", { creativity: 4, curiosity: 3 }, true],
                ["C", "Avoiding uncertainty", { emotional_stability: 2 }],
                ["D", "Copying what worked for others", { attention_to_detail: 2 }],
            ],
        },
        {
            prompt: "When someone is upset, you usually:",
            weights: { empathy: 1, communication: 0.5 },
            options: [
                ["A", "Give advice immediately", { communication: 3, empathy: 2 }],
                ["B", "Listen and validate feelings", { empathy: 4, communication: 3 }, true],
                ["C", "Avoid getting involved", { emotional_stability: 2 }],
                ["D", "Change the subject", { social_intelligence: 2, empathy: 1 }],
            ],
        },
        {
            prompt: "Your typical planning style is:",
            weights: { discipline: 1, attention_to_detail: 0.5 },
            options: [
                ["A", "Detailed plan with checkpoints", { discipline: 4, attention_to_detail: 3 }, true],
                ["B", "Rough plan, adjust later", { discipline: 3, adaptability: 2 }],
                ["C", "Minimal planning", { risk_taking: 2, discipline: 1 }],
                ["D", "No planning", { discipline: 1 }],
            ],
        },
        {
            prompt: "In presentations, you usually:",
            weights: { communication: 1, emotional_stability: 0.5 },
            options: [
                ["A", "Feel very anxious", { emotional_stability: 1, communication: 1 }],
                ["B", "Prepare and deliver confidently", { communication: 4, emotional_stability: 3, leadership: 2 }, true],
                ["C", "Read directly from slides", { communication: 2, discipline: 2 }],
                ["D", "Avoid presenting", { communication: 1 }],
            ],
        },
        {
            prompt: "When working with feedback, you:",
            weights: { adaptability: 0.5, discipline: 0.5, emotional_stability: 0.5 },
            options: [
                ["A", "Take it personally", { emotional_stability: 1 }],
                ["B", "Use it to improve", { adaptability: 3, discipline: 3, emotional_stability: 3 }, true],
                ["C", "Ignore most of it", { risk_taking: 2, discipline: 1 }],
                ["D", "Argue against it", { communication: 2, leadership: 1 }],
            ],
        },
        {
            prompt: "When choosing between safe vs uncertain options, you:",
            weights: { risk_taking: 1, emotional_stability: 0.5 },
            options: [
                ["A", "Always choose safe", { risk_taking: 1, discipline: 2 }],
                ["B", "Choose based on calculated risks", { risk_taking: 3, emotional_stability: 2, discipline: 1 }, true],
                ["C", "Always choose uncertain", { risk_taking: 4, curiosity: 2 }],
                ["D", "Avoid deciding", { emotional_stability: 1, adaptability: 1 }],
            ],
        },
        {
            prompt: "Your social style is best described as:",
            weights: { social_intelligence: 1, communication: 0.5 },
            options: [
                ["A", "Reserved", { social_intelligence: 2, emotional_stability: 2 }],
                ["B", "Warm and engaging", { social_intelligence: 4, communication: 3, empathy: 2 }, true],
                ["C", "Competitive", { leadership: 3, risk_taking: 2 }],
                ["D", "Detached", { empathy: 1 }],
            ],
        },
        {
            prompt: "When you are under pressure, you tend to:",
            weights: { pressure_handling: 1, emotional_stability: 0.5 },
            options: [
                ["A", "Lose focus", { pressure_handling: 1 }],
                ["B", "Stay composed and systematic", { pressure_handling: 4, emotional_stability: 3, attention_to_detail: 2 }, true],
                ["C", "Rush and make errors", { pressure_handling: 2, risk_taking: 2 }],
                ["D", "Withdraw", { emotional_stability: 1 }],
            ],
        },
        {
            prompt: "You prefer tasks that are:",
            weights: { curiosity: 0.5, attention_to_detail: 0.5, creativity: 0.5 },
            options: [
                ["A", "Highly structured", { discipline: 3, attention_to_detail: 2 }],
                ["B", "A mix of structure and novelty", { curiosity: 3, creativity: 2, adaptability: 2 }, true],
                ["C", "Completely open-ended", { creativity: 4, risk_taking: 2 }],
                ["D", "Repetitive", { discipline: 2 }],
            ],
        },
        {
            prompt: "When a teammate struggles, you:",
            weights: { empathy: 0.5, leadership: 0.5, communication: 0.5 },
            options: [
                ["A", "Offer help and coaching", { empathy: 3, leadership: 3, communication: 3 }, true],
                ["B", "Tell them to work harder", { leadership: 2, empathy: 1 }],
                ["C", "Avoid involvement", { empathy: 1 }],
                ["D", "Do the work yourself without explaining", { discipline: 2, leadership: 2 }],
            ],
        },
        {
            prompt: "Your biggest strength is usually:",
            weights: { leadership: 0.5, attention_to_detail: 0.5, creativity: 0.5 },
            options: [
                ["A", "Organizing and executing", { discipline: 4, attention_to_detail: 3 }, true],
                ["B", "Innovating ideas", { creativity: 4, curiosity: 2 }],
                ["C", "Leading people", { leadership: 4, communication: 3 }],
                ["D", "Taking risks", { risk_taking: 4 }],
            ],
        },
        {
            prompt: "In meetings, you usually:",
            weights: { communication: 0.5, social_intelligence: 0.5, attention_to_detail: 0.5 },
            options: [
                ["A", "Speak frequently", { communication: 3, leadership: 2 }],
                ["B", "Speak when you have a clear point", { communication: 4, attention_to_detail: 2 }, true],
                ["C", "Stay silent", { social_intelligence: 1 }],
                ["D", "Multitask", { attention_to_detail: 1 }],
            ],
        },
        {
            prompt: "How do you handle repetitive tasks?",
            weights: { discipline: 0.5, emotional_stability: 0.5 },
            options: [
                ["A", "You lose interest quickly", { discipline: 1 }],
                ["B", "You can do them with consistency", { discipline: 3, emotional_stability: 3 }, true],
                ["C", "You avoid them", { discipline: 1 }],
                ["D", "You delegate them", { leadership: 2, discipline: 2 }],
            ],
        },
        {
            prompt: "When you disagree with a rule, you:",
            weights: { communication: 0.5, leadership: 0.5, discipline: 0.5 },
            options: [
                ["A", "Follow it silently", { discipline: 3, emotional_stability: 2 }],
                ["B", "Discuss respectfully and propose improvements", { communication: 3, leadership: 3, discipline: 2 }, true],
                ["C", "Break it openly", { risk_taking: 3, leadership: 2 }],
                ["D", "Complain to others", { social_intelligence: 1, communication: 1 }],
            ],
        },
        {
            prompt: "When exploring a new idea, you:",
            weights: { creativity: 0.5, curiosity: 0.5 },
            options: [
                ["A", "Look for practical constraints first", { attention_to_detail: 2, discipline: 1 }],
                ["B", "Imagine possibilities and iterate", { creativity: 4, curiosity: 3 }, true],
                ["C", "Wait for direction", { discipline: 1 }],
                ["D", "Reject it if uncertain", { emotional_stability: 2 }],
            ],
        },
    ];

    let i = base + 5;
    for (const template of templates) {
        if (i > 25) break;
        questions.push(
            make(i, template.prompt, template.weights, template.options),
        );
        i += 1;
    }

    // Ensure we end at B25. If templates were insufficient, append simple fillers.
    while (questions.length < 20) {
        const n = base + 5 + questions.length;
        questions.push(
            make(
                n,
                "In a challenging situation, you usually:",
                { adaptability: 0.5, pressure_handling: 0.5, emotional_stability: 0.5 },
                [
                    ["A", "Avoid it", { emotional_stability: 1 }],
                    ["B", "Face it and learn", { adaptability: 3, pressure_handling: 3, emotional_stability: 3 }, true],
                    ["C", "Ask others to handle it", { social_intelligence: 2 }],
                    ["D", "React impulsively", { risk_taking: 2, pressure_handling: 2 }],
                ],
            ),
        );
    }

    // Hard cap: B06..B25 = 20 items.
    return questions.slice(0, 20);
}

export function getPrototype1V1QuestionCountBySection() {
    const counts = { A: 0, B: 0 } as Record<"A" | "B", number>;
    for (const question of PROTOTYPE_1_V1.questions) {
        counts[question.section] += 1;
    }
    return counts;
}

export const PROTOTYPE_1_V1_DIMENSIONS = {
    aptitude: [...APTITUDE_DIMENSIONS],
    psychometric: [...PSYCHOMETRIC_DIMENSIONS],
};
