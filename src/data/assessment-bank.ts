export type AptitudeDimension =
    | 'logical_reasoning'
    | 'numerical_ability'
    | 'analytical_thinking'
    | 'pattern_recognition'
    | 'verbal_ability'
    | 'problem_solving'
    | 'decision_making';

export type PsychometricDimension =
    | 'leadership'
    | 'creativity'
    | 'emotional_stability'
    | 'communication'
    | 'social_intelligence'
    | 'empathy'
    | 'adaptability'
    | 'discipline'
    | 'risk_taking'
    | 'curiosity'
    | 'attention_to_detail'
    | 'pressure_handling';

export interface AssessmentOption {
    id: string;
    text: string;
    weights: Partial<Record<AptitudeDimension | PsychometricDimension, number>>;
}

export interface AssessmentQuestion {
    id: number;
    section: 'A' | 'B';
    type: 'aptitude' | 'psychometric';
    category: string;
    prompt: string;
    options: AssessmentOption[];
    correctOptionId?: string;
    version: string;
}

export const ASSESSMENT_BANK_V1: AssessmentQuestion[] = [
    // SECTION A: APTITUDE (25 QUESTIONS)
    // Categories: logical_reasoning, numerical_ability, analytical_thinking, pattern_recognition, verbal_ability, problem_solving, decision_making
    {
        id: 1, section: 'A', type: 'aptitude', category: 'Logical Reasoning', version: 'prototype-1-v1',
        prompt: "All architects are designers. Some designers are engineers. Which statement must be true?",
        options: [
            { id: 'a', text: "All architects are engineers", weights: { logical_reasoning: 0 } },
            { id: 'b', text: "Some engineers are architects", weights: { logical_reasoning: 2 } },
            { id: 'c', text: "No architect is a designer", weights: { logical_reasoning: 0 } },
            { id: 'd', text: "None of the above necessarily follow", weights: { logical_reasoning: 10, analytical_thinking: 5 } }
        ], correctOptionId: 'd'
    },
    {
        id: 2, section: 'A', type: 'aptitude', category: 'Numerical Ability', version: 'prototype-1-v1',
        prompt: "A project budget increases by 15% in year one and decreases by 10% in year two. What is the net change from the original budget?",
        options: [
            { id: 'a', text: "+5% increase", weights: { numerical_ability: 2 } },
            { id: 'b', text: "+3.5% increase", weights: { numerical_ability: 10, decision_making: 5 } },
            { id: 'c', text: "+4.5% increase", weights: { numerical_ability: 0 } },
            { id: 'd', text: "-2% decrease", weights: { numerical_ability: 0 } }
        ], correctOptionId: 'b'
    },
    {
        id: 3, section: 'A', type: 'aptitude', category: 'Pattern Recognition', version: 'prototype-1-v1',
        prompt: "In a certain sequence: 2, 5, 11, 23... what is the next number?",
        options: [
            { id: 'a', text: "45", weights: { pattern_recognition: 2 } },
            { id: 'b', text: "47", weights: { pattern_recognition: 10, logical_reasoning: 4 } },
            { id: 'c', text: "46", weights: { pattern_recognition: 1 } },
            { id: 'd', text: "49", weights: { pattern_recognition: 0 } }
        ], correctOptionId: 'b'
    },
    {
        id: 4, section: 'A', type: 'aptitude', category: 'Verbal Ability', version: 'prototype-1-v1',
        prompt: "Choose the synonym for 'Ephemeral':",
        options: [
            { id: 'a', text: "Enduring", weights: { verbal_ability: 0 } },
            { id: 'b', text: "Short-lived", weights: { verbal_ability: 10, communication: 3 } },
            { id: 'c', text: "Transparent", weights: { verbal_ability: 0 } },
            { id: 'd', text: "Resilient", weights: { verbal_ability: 2 } }
        ], correctOptionId: 'b'
    },
    {
        id: 5, section: 'A', type: 'aptitude', category: 'Analytical Thinking', version: 'prototype-1-v1',
        prompt: "If P > Q, R < S, and Q = R, what is the relationship between P and S?",
        options: [
            { id: 'a', text: "P > S", weights: { analytical_thinking: 2 } },
            { id: 'b', text: "P < S", weights: { analytical_thinking: 2 } },
            { id: 'c', text: "No definitive relationship can be established", weights: { analytical_thinking: 10, logical_reasoning: 5 } },
            { id: 'd', text: "P = S", weights: { analytical_thinking: 0 } }
        ], correctOptionId: 'c'
    },
    {
        id: 6, section: 'A', type: 'aptitude', category: 'Problem Solving', version: 'prototype-1-v1',
        prompt: "A machine can process 40 units per hour. If the efficiency drops by 25% due to maintenance, how many units will it process in an 8-hour shift?",
        options: [
            { id: 'a', text: "240 units", weights: { problem_solving: 10, numerical_ability: 4 } },
            { id: 'b', text: "200 units", weights: { problem_solving: 2 } },
            { id: 'c', text: "260 units", weights: { problem_solving: 0 } },
            { id: 'd', text: "300 units", weights: { problem_solving: 0 } }
        ], correctOptionId: 'a'
    },
    {
        id: 7, section: 'A', type: 'aptitude', category: 'Decision Making', version: 'prototype-1-v1',
        prompt: "You have limited resources and two critical tasks. Task A has a high impact but high risk. Task B has medium impact and low risk. Which do you prioritize?",
        options: [
            { id: 'a', text: "Task A", weights: { decision_making: 8, risk_taking: 10 } },
            { id: 'b', text: "Task B", weights: { decision_making: 10, discipline: 6 } },
            { id: 'c', text: "Split resources evenly (50/50)", weights: { decision_making: 4, adaptability: 5 } },
            { id: 'd', text: "Delay both to seek more resources", weights: { decision_making: 0, analytical_thinking: 4 } }
        ], correctOptionId: 'b' // Typically the safer/more logical choice in standard aptitude
    },
    {
        id: 8, section: 'A', type: 'aptitude', category: 'Logical Reasoning', version: 'prototype-1-v1',
        prompt: "If it rains, the ground gets wet. The ground is dry. Therefore:",
        options: [
            { id: 'a', text: "It did not rain", weights: { logical_reasoning: 10, analytical_thinking: 4 } },
            { id: 'b', text: "It is about to rain", weights: { logical_reasoning: 0 } },
            { id: 'c', text: "It rained somewhere else", weights: { logical_reasoning: 2 } },
            { id: 'd', text: "The rain skipped the ground", weights: { logical_reasoning: 0 } }
        ], correctOptionId: 'a'
    },
    {
        id: 9, section: 'A', type: 'aptitude', category: 'Numerical Ability', version: 'prototype-1-v1',
        prompt: "A tank is filled by Pipe A in 5 hours and emptied by Pipe B in 10 hours. If both are open, how long to fill the tank?",
        options: [
            { id: 'a', text: "7.5 hours", weights: { numerical_ability: 2 } },
            { id: 'b', text: "10 hours", weights: { numerical_ability: 10, analytical_thinking: 4 } },
            { id: 'c', text: "15 hours", weights: { numerical_ability: 0 } },
            { id: 'd', text: "5 hours", weights: { numerical_ability: 0 } }
        ], correctOptionId: 'b'
    },
    {
        id: 10, section: 'A', type: 'aptitude', category: 'Pattern Recognition', version: 'prototype-1-v1',
        prompt: "Triangle, Square, Pentagon, ... what follows?",
        options: [
            { id: 'a', text: "Circle", weights: { pattern_recognition: 0 } },
            { id: 'b', text: "Hexagon", weights: { pattern_recognition: 10, logical_reasoning: 3 } },
            { id: 'c', text: "Rectangle", weights: { pattern_recognition: 2 } },
            { id: 'd', text: "Octagon", weights: { pattern_recognition: 4 } }
        ], correctOptionId: 'b'
    },
    {
        id: 11, section: 'A', type: 'aptitude', category: 'Verbal Ability', version: 'prototype-1-v1',
        prompt: "Choose the word most opposite in meaning to 'Garrulous':",
        options: [
            { id: 'a', text: "Talkative", weights: { verbal_ability: 0 } },
            { id: 'b', text: "Taciturn", weights: { verbal_ability: 10, communication: 2 } },
            { id: 'c', text: "Friendly", weights: { verbal_ability: 2 } },
            { id: 'd', text: "Hostile", weights: { verbal_ability: 0 } }
        ], correctOptionId: 'b'
    },
    {
        id: 12, section: 'A', type: 'aptitude', category: 'Analytical Thinking', version: 'prototype-1-v1',
        prompt: "Five books are stacked. Math is above Science. History is below Science. English is above History but below Science. What is at the bottom?",
        options: [
            { id: 'a', text: "Science", weights: { analytical_thinking: 0 } },
            { id: 'b', text: "History", weights: { analytical_thinking: 10, logical_reasoning: 6 } },
            { id: 'c', text: "English", weights: { analytical_thinking: 2 } },
            { id: 'd', text: "Math", weights: { analytical_thinking: 0 } }
        ], correctOptionId: 'b'
    },
    {
        id: 13, section: 'A', type: 'aptitude', category: 'Problem Solving', version: 'prototype-1-v1',
        prompt: "If 12 laborers can build a wall in 9 days, how many extra laborers are needed to finish in 6 days?",
        options: [
            { id: 'a', text: "18 laborers", weights: { problem_solving: 2 } },
            { id: 'b', text: "6 laborers", weights: { problem_solving: 10, numerical_ability: 6 } },
            { id: 'c', text: "8 laborers", weights: { problem_solving: 4 } },
            { id: 'd', text: "4 laborers", weights: { problem_solving: 0 } }
        ], correctOptionId: 'b'
    },
    {
        id: 14, section: 'A', type: 'aptitude', category: 'Decision Making', version: 'prototype-1-v1',
        prompt: "A customer is unhappy with a service but has no legal grounds for a refund. To protect the company's reputation, you should:",
        options: [
            { id: 'a', text: "Refuse the refund immediately based on terms.", weights: { discipline: 10, decision_making: 5 } },
            { id: 'b', text: "Offer a partial credit or discount on future services.", weights: { decision_making: 10, social_intelligence: 8, communication: 6 } },
            { id: 'c', text: "Give a full refund even if the customer is wrong.", weights: { empathy: 10, decision_making: 4 } },
            { id: 'd', text: "Ignore the complaint until it escalates.", weights: { decision_making: 0, pressure_handling: 0 } }
        ], correctOptionId: 'b'
    },
    {
        id: 15, section: 'A', type: 'aptitude', category: 'Logical Reasoning', version: 'prototype-1-v1',
        prompt: "If P implies Q, and not Q is true, what can we say about P?",
        options: [
            { id: 'a', text: "P is true", weights: { logical_reasoning: 0 } },
            { id: 'b', text: "P is false", weights: { logical_reasoning: 10, analytical_thinking: 5 } },
            { id: 'c', text: "P is uncertain", weights: { logical_reasoning: 2 } },
            { id: 'd', text: "Q is also true", weights: { logical_reasoning: 0 } }
        ], correctOptionId: 'b'
    },
    {
        id: 16, section: 'A', type: 'aptitude', category: 'Numerical Ability', version: 'prototype-1-v1',
        prompt: "What is 35% of 80 plus 12% of 150?",
        options: [
            { id: 'a', text: "46", weights: { numerical_ability: 10, analytical_thinking: 3 } },
            { id: 'b', text: "44", weights: { numerical_ability: 2 } },
            { id: 'c', text: "48", weights: { numerical_ability: 0 } },
            { id: 'd', text: "50", weights: { numerical_ability: 0 } }
        ], correctOptionId: 'a'
    },
    {
        id: 17, section: 'A', type: 'aptitude', category: 'Pattern Recognition', version: 'prototype-1-v1',
        prompt: "A, C, F, J, ... what is next?",
        options: [
            { id: 'a', text: "N", weights: { pattern_recognition: 4 } },
            { id: 'b', text: "O", weights: { pattern_recognition: 10, logical_reasoning: 5 } },
            { id: 'c', text: "M", weights: { pattern_recognition: 0 } },
            { id: 'd', text: "P", weights: { pattern_recognition: 2 } }
        ], correctOptionId: 'b'
    },
    {
        id: 18, section: 'A', type: 'aptitude', category: 'Verbal Ability', version: 'prototype-1-v1',
        prompt: "Choose the correctly spelled word:",
        options: [
            { id: 'a', text: "Acquiesce", weights: { verbal_ability: 10, attention_to_detail: 5 } },
            { id: 'b', text: "Acquese", weights: { verbal_ability: 0 } },
            { id: 'c', text: "Aqueice", weights: { verbal_ability: 0 } },
            { id: 'd', text: "Acquiess", weights: { verbal_ability: 0 } }
        ], correctOptionId: 'a'
    },
    {
        id: 19, section: 'A', type: 'aptitude', category: 'Analytical Thinking', version: 'prototype-1-v1',
        prompt: "A cube has 6 sides. If you paint 3 sides red and 3 sides blue, how many edges will separate a red side from a blue side?",
        options: [
            { id: 'a', text: "Depends on placement", weights: { analytical_thinking: 10, logical_reasoning: 8 } },
            { id: 'b', text: "Always 3", weights: { analytical_thinking: 0 } },
            { id: 'c', text: "Always 6", weights: { analytical_thinking: 2 } },
            { id: 'd', text: "Always 4", weights: { analytical_thinking: 0 } }
        ], correctOptionId: 'a'
    },
    {
        id: 20, section: 'A', type: 'aptitude', category: 'Problem Solving', version: 'prototype-1-v1',
        prompt: "A car covers 240km in 4 hours. How much distance will it cover in 7 hours at the same speed?",
        options: [
            { id: 'a', text: "420km", weights: { problem_solving: 10, numerical_ability: 6 } },
            { id: 'b', text: "400km", weights: { problem_solving: 2 } },
            { id: 'c', text: "440km", weights: { problem_solving: 1 } },
            { id: 'd', text: "460km", weights: { problem_solving: 0 } }
        ], correctOptionId: 'a'
    },
    {
        id: 21, section: 'A', type: 'aptitude', category: 'Decision Making', version: 'prototype-1-v1',
        prompt: "Your team lead gives an instruction that contradicts company safety policy. You:",
        options: [
            { id: 'a', text: "Follow the instruction to maintain chain of command.", weights: { discipline: 10, social_intelligence: 4 } },
            { id: 'b', text: "Politely point out the safety policy and suggest an alternative.", weights: { decision_making: 10, communication: 8, pressure_handling: 6 } },
            { id: 'c', text: "Ignore the instruction and do it your own way.", weights: { creativity: 6, risk_taking: 8 } },
            { id: 'd', text: "Report the lead to upper management immediately.", weights: { analytical_thinking: 5, discipline: 6 } }
        ], correctOptionId: 'b'
    },
    {
        id: 22, section: 'A', type: 'aptitude', category: 'Logical Reasoning', version: 'prototype-1-v1',
        prompt: "If X is north of Y, and Y is east of Z, what is the direction of X relative to Z?",
        options: [
            { id: 'a', text: "Northeast", weights: { logical_reasoning: 10, analytical_thinking: 6 } },
            { id: 'b', text: "Northwest", weights: { logical_reasoning: 0 } },
            { id: 'c', text: "Southeast", weights: { logical_reasoning: 0 } },
            { id: 'd', text: "Southwest", weights: { logical_reasoning: 0 } }
        ], correctOptionId: 'a'
    },
    {
        id: 23, section: 'A', type: 'aptitude', category: 'Numerical Ability', version: 'prototype-1-v1',
        prompt: "The average of 5 numbers is 20. If one number is replaced by 30, the new average is 22. What was the original number?",
        options: [
            { id: 'a', text: "20", weights: { numerical_ability: 10, analytical_thinking: 5 } },
            { id: 'b', text: "10", weights: { numerical_ability: 2 } },
            { id: 'c', text: "15", weights: { numerical_ability: 0 } },
            { id: 'd', text: "25", weights: { numerical_ability: 0 } }
        ], correctOptionId: 'a'
    },
    {
        id: 24, section: 'A', type: 'aptitude', category: 'Verbal Ability', version: 'prototype-1-v1',
        prompt: "The bridge was ______ by the flood, leaving the village isolated.",
        options: [
            { id: 'a', text: "Decimated", weights: { verbal_ability: 8 } },
            { id: 'b', text: "Severed", weights: { verbal_ability: 10, communication: 4 } },
            { id: 'c', text: "Fragmented", weights: { verbal_ability: 2 } },
            { id: 'd', text: "Isolated", weights: { verbal_ability: 0 } }
        ], correctOptionId: 'b'
    },
    {
        id: 25, section: 'A', type: 'aptitude', category: 'Analytical Thinking', version: 'prototype-1-v1',
        prompt: "A clock shows 3:15. What is the angle between the hands?",
        options: [
            { id: 'a', text: "0 degrees", weights: { analytical_thinking: 2 } },
            { id: 'b', text: "7.5 degrees", weights: { analytical_thinking: 10, numerical_ability: 8 } },
            { id: 'c', text: "5 degrees", weights: { analytical_thinking: 0 } },
            { id: 'd', text: "10 degrees", weights: { analytical_thinking: 0 } }
        ], correctOptionId: 'b'
    },

    // SECTION B: PSYCHOMETRIC (25 QUESTIONS)
    // Categories: leadership, creativity, emotional_stability, communication, social_intelligence, empathy, adaptability, discipline, risk_taking, curiosity, attention_to_detail, pressure_handling
    {
        id: 26, section: 'B', type: 'psychometric', category: 'Leadership', version: 'prototype-1-v1',
        prompt: "A team member is consistently underperforming. Your first step is to:",
        options: [
            { id: 'a', text: "Set up a private meeting to understand their challenges.", weights: { leadership: 10, empathy: 8, communication: 6 } },
            { id: 'b', text: "Monitor their work closely and point out every error.", weights: { attention_to_detail: 10, discipline: 7 } },
            { id: 'c', text: "Wait for it to resolve itself to avoid conflict.", weights: { emotional_stability: 4 } },
            { id: 'd', text: "Request management to replace them immediately.", weights: { decision_making: 8, risk_taking: 4 } }
        ]
    },
    {
        id: 27, section: 'B', type: 'psychometric', category: 'Creativity', version: 'prototype-1-v1',
        prompt: "When solved a problem in a way no one else has tried before, you feel:",
        options: [
            { id: 'a', text: "Excited and energized by the innovation.", weights: { creativity: 10, risk_taking: 6, curiosity: 8 } },
            { id: 'b', text: "Relieved that the problem is gone.", weights: { emotional_stability: 6, discipline: 4 } },
            { id: 'c', text: "Anxious that it might not be the 'standard' way.", weights: { attention_to_detail: 8, discipline: 10 } },
            { id: 'd', text: "Indifferent, as long as it works.", weights: { problem_solving: 6 } }
        ]
    },
    {
        id: 28, section: 'B', type: 'psychometric', category: 'Emotional Stability', version: 'prototype-1-v1',
        prompt: "You receive harsh criticism for a project you worked hard on. You:",
        options: [
            { id: 'a', text: "Take a moment to process, then look for constructive feedback.", weights: { emotional_stability: 10, adaptability: 8, leadership: 4 } },
            { id: 'b', text: "Feel deeply discouraged and avoid the criticizer.", weights: { empathy: 6 } },
            { id: 'c', text: "Immediately defend your work and explain your choices.", weights: { communication: 10, risk_taking: 6 } },
            { id: 'd', text: "Start the project over from scratch without question.", weights: { discipline: 10, attention_to_detail: 6 } }
        ]
    },
    {
        id: 29, section: 'B', type: 'psychometric', category: 'Communication', version: 'prototype-1-v1',
        prompt: "When explaining a complex idea, you primarily focus on:",
        options: [
            { id: 'a', text: "Using precise technical terminology.", weights: { attention_to_detail: 10, analytical_thinking: 6 } },
            { id: 'b', text: "Using metaphors and analogies to ensure understanding.", weights: { communication: 10, empathy: 7, creativity: 5 } },
            { id: 'c', text: "Keeping the explanation as short as possible.", weights: { decision_making: 8, pressure_handling: 4 } },
            { id: 'd', text: "Preparing a detailed document for them to read later.", weights: { discipline: 10, attention_to_detail: 8 } }
        ]
    },
    {
        id: 30, section: 'B', type: 'psychometric', category: 'Social Intelligence', version: 'prototype-1-v1',
        prompt: "In a networking event, you naturally:",
        options: [
            { id: 'a', text: "Wait for others to approach you.", weights: { analytical_thinking: 6, emotional_stability: 4 } },
            { id: 'b', text: "Proactively introduce yourself to new groups.", weights: { social_intelligence: 10, communication: 8, risk_taking: 5 } },
            { id: 'c', text: "Stick to people you already know.", weights: { emotional_stability: 8, discipline: 6 } },
            { id: 'd', text: "Focus on the refreshments and observe from afar.", weights: { attention_to_detail: 6, curiosity: 4 } }
        ]
    },
    {
        id: 31, section: 'B', type: 'psychometric', category: 'Empathy', version: 'prototype-1-v1',
        prompt: "A colleague seems upset but hasn't said anything. You:",
        options: [
            { id: 'a', text: "Ignore it unless it affects their performance.", weights: { discipline: 10, analytical_thinking: 6 } },
            { id: 'b', text: "Ask them if they'd like to grab a coffee and talk.", weights: { empathy: 10, social_intelligence: 8, communication: 6 } },
            { id: 'c', text: "Tell them to cheer up and focus on work.", weights: { pressure_handling: 8, leadership: 4 } },
            { id: 'd', text: "Anonymously send them an encouraging note.", weights: { creativity: 6, empathy: 8 } }
        ]
    },
    {
        id: 32, section: 'B', type: 'psychometric', category: 'Adaptability', version: 'prototype-1-v1',
        prompt: "Your project scope changes completely at the last minute. You:",
        options: [
            { id: 'a', text: "Quickly pivot and start planning the new direction.", weights: { adaptability: 10, pressure_handling: 8, leadership: 6 } },
            { id: 'b', text: "Express frustration but eventually comply.", weights: { communication: 6 } },
            { id: 'c', text: "Request more time or resources before starting.", weights: { analytical_thinking: 10, decision_making: 7 } },
            { id: 'd', text: "Strictly adhere to the original plan as much as possible.", weights: { discipline: 10, attention_to_detail: 6 } }
        ]
    },
    {
        id: 33, section: 'B', type: 'psychometric', category: 'Discipline', version: 'prototype-1-v1',
        prompt: "Your typical approach to a long-term project is:",
        options: [
            { id: 'a', text: "A burst of energy at the beginning and the end.", weights: { creativity: 10, risk_taking: 6 } },
            { id: 'b', text: "A consistent, scheduled daily output.", weights: { discipline: 10, attention_to_detail: 8, emotional_stability: 6 } },
            { id: 'c', text: "Waiting until the last minute to find inspiration.", weights: { pressure_handling: 10, risk_taking: 8 } },
            { id: 'd', text: "Constantly researching without ever starting the build.", weights: { curiosity: 10, analytical_thinking: 8 } }
        ]
    },
    {
        id: 34, section: 'B', type: 'psychometric', category: 'Risk Taking', version: 'prototype-1-v1',
        prompt: "You are invited to join an early-stage startup with no salary but high equity. You:",
        options: [
            { id: 'a', text: "Accept immediately for the potential upside.", weights: { risk_taking: 10, curiosity: 7, creativity: 5 } },
            { id: 'b', text: "Decline to keep your stable corporate job.", weights: { emotional_stability: 10, discipline: 8 } },
            { id: 'c', text: "Negotiate for a small base salary and less equity.", weights: { decision_making: 10, communication: 6 } },
            { id: 'd', text: "Ask for a list of their investors first.", weights: { analytical_thinking: 10, attention_to_detail: 8 } }
        ]
    },
    {
        id: 35, section: 'B', type: 'psychometric', category: 'Curiosity', version: 'prototype-1-v1',
        prompt: "When you see a complex machine you don't understand, you:",
        options: [
            { id: 'a', text: "Want to take it apart to see how it works.", weights: { curiosity: 10, analytical_thinking: 8, creativity: 5 } },
            { id: 'b', text: "Read the manual thoroughly.", weights: { attention_to_detail: 10, discipline: 8 } },
            { id: 'c', text: "Ignore it unless you need to use it.", weights: { decision_making: 6 } },
            { id: 'd', text: "Ask someone else to explain it simply.", weights: { communication: 6, social_intelligence: 5 } }
        ]
    },
    {
        id: 36, section: 'B', type: 'psychometric', category: 'Attention to Detail', version: 'prototype-1-v1',
        prompt: "When reviewing a document, you primarily look for:",
        options: [
            { id: 'a', text: "The overall logic and flow of ideas.", weights: { logical_reasoning: 10, analytical_thinking: 8 } },
            { id: 'b', text: "Grammar, spelling, and formatting errors.", weights: { attention_to_detail: 10, discipline: 8, emotional_stability: 4 } },
            { id: 'c', text: "How the design and visuals can be improved.", weights: { creativity: 10, communication: 6 } },
            { id: 'd', text: "How the information can be used for my next project.", weights: { curiosity: 10, risk_taking: 5 } }
        ]
    },
    {
        id: 37, section: 'B', type: 'psychometric', category: 'Pressure Handling', version: 'prototype-1-v1',
        prompt: "A system failure occurs while you are presenting to a client. You:",
        options: [
            { id: 'a', text: "Apologize and switch to a verbal explanation/whiteboard.", weights: { pressure_handling: 10, adaptability: 10, communication: 8 } },
            { id: 'b', text: "Try to fix the system while keeping the client engaged.", weights: { problem_solving: 10, social_intelligence: 6 } },
            { id: 'c', text: "Freeze and wait for technical support.", weights: { emotional_stability: 2 } },
            { id: 'd', text: "Suggest rescheduling the meeting immediately.", weights: { decision_making: 8, discipline: 6 } }
        ]
    },
    {
        id: 38, section: 'B', type: 'psychometric', category: 'Leadership', version: 'prototype-1-v1',
        prompt: "Your team is divided on a decision. You:",
        options: [
            { id: 'a', text: "Make the final call yourself to save time.", weights: { leadership: 10, decision_making: 8, pressure_handling: 6 } },
            { id: 'b', text: "Facilitate a debate to reach a consensus.", weights: { social_intelligence: 10, communication: 10, leadership: 8 } },
            { id: 'c', text: "Ask a neutral third party to decide.", weights: { analytical_thinking: 8 } },
            { id: 'd', text: "Go with the majority regardless of your opinion.", weights: { empathy: 8, social_intelligence: 6 } }
        ]
    },
    {
        id: 39, section: 'B', type: 'psychometric', category: 'Creativity', version: 'prototype-1-v1',
        prompt: "In your free time, you prefer to:",
        options: [
            { id: 'a', text: "Build something new (code, craft, music).", weights: { creativity: 10, discipline: 6, curiosity: 8 } },
            { id: 'b', text: "Solve puzzles or play strategy games.", weights: { analytical_thinking: 10, logical_reasoning: 8 } },
            { id: 'c', text: "Socialize with a large group of people.", weights: { social_intelligence: 10, communication: 8 } },
            { id: 'd', text: "Rest and recharge alone with a book.", weights: { emotional_stability: 10, curiosity: 6 } }
        ]
    },
    {
        id: 40, section: 'B', type: 'psychometric', category: 'Emotional Stability', version: 'prototype-1-v1',
        prompt: "When things don't go as planned, you usually feel:",
        options: [
            { id: 'a', text: "A bit annoyed but you quickly find a new plan.", weights: { emotional_stability: 10, adaptability: 10, problem_solving: 6 } },
            { id: 'b', text: "Overwhelmed and you need to step away.", weights: { empathy: 4 } },
            { id: 'c', text: "Excited by the new challenge.", weights: { risk_taking: 10, curiosity: 8 } },
            { id: 'd', text: "Relentless in trying to force the original plan.", weights: { discipline: 10, attention_to_detail: 6 } }
        ]
    },
    {
        id: 41, section: 'B', type: 'psychometric', category: 'Communication', version: 'prototype-1-v1',
        prompt: "Choosing the right words is:",
        options: [
            { id: 'a', text: "Vital for preventing misunderstandings.", weights: { communication: 10, attention_to_detail: 8, empathy: 6 } },
            { id: 'b', text: "Less important than the intent behind them.", weights: { social_intelligence: 10, communication: 4 } },
            { id: 'c', text: "Natural and doesn't require much thought.", weights: { social_intelligence: 6, risk_taking: 4 } },
            { id: 'd', text: "Difficult and stressful for you.", weights: { analytical_thinking: 6 } }
        ]
    },
    {
        id: 42, section: 'B', type: 'psychometric', category: 'Social Intelligence', version: 'prototype-1-v1',
        prompt: "You notice someone being left out of a conversation. You:",
        options: [
            { id: 'a', text: "Ask them a direct question to pull them in.", weights: { social_intelligence: 10, leadership: 8, empathy: 10 } },
            { id: 'b', text: "Feel bad for them but don't intervene.", weights: { empathy: 6 } },
            { id: 'c', text: "Conclude they probably have nothing to add.", weights: { analytical_thinking: 4 } },
            { id: 'd', text: "Observe their body language to see if they're comfortable.", weights: { curiosity: 8, attention_to_detail: 6 } }
        ]
    },
    {
        id: 43, section: 'B', type: 'psychometric', category: 'Adaptability', version: 'prototype-1-v1',
        prompt: "When traveling to a foreign country, you prefer:",
        options: [
            { id: 'a', text: "A strict itinerary with pre-booked everything.", weights: { discipline: 10, attention_to_detail: 10 } },
            { id: 'b', text: "No plan at all, just seeing where the day takes you.", weights: { adaptability: 10, risk_taking: 10, curiosity: 8 } },
            { id: 'c', text: "A loose plan with some room for exploration.", weights: { adaptability: 7, decision_making: 6 } },
            { id: 'd', text: "Staying in a resort where everything is similar to home.", weights: { emotional_stability: 8, discipline: 6 } }
        ]
    },
    {
        id: 44, section: 'B', type: 'psychometric', category: 'Discipline', version: 'prototype-1-v1',
        prompt: "Managing distractions while working is:",
        options: [
            { id: 'a', text: "Easy; you can zone into a 'flow' state deeply.", weights: { discipline: 10, attention_to_detail: 8, emotional_stability: 6 } },
            { id: 'b', text: "Hard; you frequently check your phone or emails.", weights: { social_intelligence: 6, curiosity: 8 } },
            { id: 'c', text: "Possible if you have a completely quiet room.", weights: { analytical_thinking: 8, discipline: 5 } },
            { id: 'd', text: "Something you don't even worry about.", weights: { risk_taking: 6 } }
        ]
    },
    {
        id: 45, section: 'B', type: 'psychometric', category: 'Risk Taking', version: 'prototype-1-v1',
        prompt: "Your attitude towards failure is:",
        options: [
            { id: 'a', text: "An essential learning opportunity.", weights: { curiosity: 10, adaptability: 10, emotional_stability: 8 } },
            { id: 'b', text: "Something to be avoided at all costs.", weights: { discipline: 10, attention_to_detail: 10 } },
            { id: 'c', text: "A temporary setback that hurts but passes.", weights: { emotional_stability: 6, pressure_handling: 4 } },
            { id: 'd', text: "A reason to change your entire career path.", weights: { risk_taking: 10, creativity: 6 } }
        ]
    },
    {
        id: 46, section: 'B', type: 'psychometric', category: 'Curiosity', version: 'prototype-1-v1',
        prompt: "A documentary about a topic you know nothing about is:",
        options: [
            { id: 'a', text: "Fascinating; you'll likely Google more later.", weights: { curiosity: 10, analytical_thinking: 6 } },
            { id: 'b', text: "Boring; you prefer topics you're already expert in.", weights: { discipline: 8, attention_to_detail: 6 } },
            { id: 'c', text: "Good background noise while you do something else.", weights: { adaptability: 4 } },
            { id: 'd', text: "Wait for a friend to summarize it for you.", weights: { social_intelligence: 8, communication: 6 } }
        ]
    },
    {
        id: 47, section: 'B', type: 'psychometric', category: 'Attention to Detail', version: 'prototype-1-v1',
        prompt: "Filing your taxes or managing your finances is:",
        options: [
            { id: 'a', text: "Meticulously tracked and organized.", weights: { attention_to_detail: 10, discipline: 10, analytical_thinking: 6 } },
            { id: 'b', text: "A stressful mess you put off until the deadline.", weights: { pressure_handling: 10, risk_taking: 6 } },
            { id: 'c', text: "Handed off to a professional immediately.", weights: { decision_making: 10, social_intelligence: 6 } },
            { id: 'd', text: "Something you do approximately and hope for the best.", weights: { risk_taking: 8, creativity: 4 } }
        ]
    },
    {
        id: 48, section: 'B', type: 'psychometric', category: 'Pressure Handling', version: 'prototype-1-v1',
        prompt: "During a major conflict between two close friends, you:",
        options: [
            { id: 'a', text: "Act as a calm mediator to find a middle ground.", weights: { pressure_handling: 10, social_intelligence: 10, empathy: 10, communication: 8 } },
            { id: 'b', text: "Pick the side that is logically correct.", weights: { logical_reasoning: 10, analytical_thinking: 10 } },
            { id: 'c', text: "Stay out of it and wait for it to blow over.", weights: { emotional_stability: 8 } },
            { id: 'd', text: "Get stressed and try to distract them with humor.", weights: { creativity: 8, social_intelligence: 6 } }
        ]
    },
    {
        id: 49, section: 'B', type: 'psychometric', category: 'Decision Making', version: 'prototype-1-v1',
        prompt: "When buying an expensive item, your decision time is usually:",
        options: [
            { id: 'a', text: "Instant; you trust your gut feeling.", weights: { risk_taking: 10, emotional_stability: 6 } },
            { id: 'b', text: "Weeks; you read every review and compare prices.", weights: { analytical_thinking: 10, attention_to_detail: 10, discipline: 8 } },
            { id: 'c', text: "A few days; you sleep on it once.", weights: { decision_making: 10, emotional_stability: 8 } },
            { id: 'd', text: "Variable; you wait for a sale regardless of time.", weights: { analytical_thinking: 6, discipline: 6 } }
        ]
    },
    {
        id: 50, section: 'B', type: 'psychometric', category: 'Leadership', version: 'prototype-1-v1',
        prompt: "Final Question: What is your primary motivation in your career?",
        options: [
            { id: 'a', text: "To lead people and influence the future.", weights: { leadership: 10, risk_taking: 8, communication: 6 } },
            { id: 'b', text: "To solve the world's most complex problems.", weights: { problem_solving: 10, curiosity: 10, analytical_thinking: 10 } },
            { id: 'c', text: "To achieve complete financial and personal stability.", weights: { emotional_stability: 10, discipline: 10 } },
            { id: 'd', text: "To express my unique creativity and perspective.", weights: { creativity: 10, communication: 8, empathy: 6 } }
        ]
    }
];
