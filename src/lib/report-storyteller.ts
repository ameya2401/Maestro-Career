export const getTraitInterpretation = (trait: string, score: number): string => {
    if (score >= 90) {
        return `You exhibit exceptional mastery in ${trait}. This is a rare and powerful strength that places you in the top percentile of your peer group.`;
    }
    if (score >= 75) {
        return `Your ${trait} is well-developed and serves as a reliable foundation for professional excellence.`;
    }
    if (score >= 60) {
        return `You have a healthy level of ${trait}, which allows you to function effectively in most environments.`;
    }
    return `There is significant room to grow your ${trait}. With focused practice and the right environment, you can elevate this trait to become a core strength.`;
};

export const getCareerSynergy = (primary: string, secondary: string): string => {
    return `The combination of your primary affinity for ${primary} and secondary strength in ${secondary} creates a unique 'Hybrid Advantage'. This allows you to speak the language of technical experts while understanding the nuances of strategic execution.`;
};

export const getSoftGuidance = (area: string): string => {
    const guidance: Record<string, string> = {
        "Communication": "Leadership skills can improve further through collaborative activities and structured decision-making experiences.",
        "Leadership": "Taking on smaller project ownership roles will help you build confidence in guiding teams.",
        "Discipline": "Implementing structured daily routines can help manifest your creative potential into tangible outcomes.",
        "Numerical Ability": "Strengthening fundamental analytical models through gamified learning could accelerate your processing speed."
    };
    return guidance[area] || `${area} skills can be further enhanced through consistent practice and real-world application.`;
};
