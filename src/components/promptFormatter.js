// Formateur pour le niveau 1 (toutes les étapes)
export const formatLevel1Prompt = (steps, themesMap, notionsMap) => {
    return steps.map(step => {
        const stepText = `Étape: ${step.name}\n`;
        const stepQA = step.question ? `Question: ${step.question}\nRéponse: ${step.answer}\n\n` : '';

        const themesText = (themesMap.get(step.uuid) || []).map(theme => {
            const themeBase = `\tThème: ${theme.name}\n`;
            const themeQA = theme.question ? `\tQuestion: ${theme.question}\n\tRéponse: ${theme.answer}\n\n` : '';

            const notionsText = (notionsMap.get(theme.uuid) || []).map(notion =>
                `\t\tNotion: ${notion.name}\n\t\tQuestion: ${notion.question}\n\t\tRéponse: ${notion.answer}`
            ).join('\n\n');

            return themeBase + themeQA + notionsText;
        }).join('\n\n');

        return stepText + stepQA + themesText;
    }).join('\n\n\n\n');
};

// Formateur pour le niveau 2 (une étape spécifique)
export const formatLevel2Prompt = (step, themes, notionsMap) => {
    const stepText = `Étape: ${step.name}\n`;
    const stepQA = step.question ? `Question: ${step.question}\nRéponse: ${step.answer}\n` : '';

    const themesText = themes.map(theme => {
        const themeBase = `Thème: ${theme.name}\n`;
        const themeQA = theme.question ? `Question: ${theme.question}\nRéponse: ${theme.answer}\n` : '';

        const notionsText = (notionsMap.get(theme.uuid) || []).map(notion =>
            `Question: ${notion.question}\nRéponse: ${notion.answer}`
        ).join('\n');

        return themeBase + themeQA + notionsText;
    }).join('\n');

    return stepText + stepQA + themesText;
};

// Formateur pour le niveau 3 (un thème spécifique)
export const formatLevel3Prompt = (theme, notions) => {
    const themeText = `Thème: ${theme.name}\n`;
    const themeQA = theme.question ? `Question: ${theme.question}\nRéponse: ${theme.answer}\n` : '';

    const notionsText = notions.map(notion =>
        `Question: ${notion.question}\nRéponse: ${notion.answer}`
    ).join('\n');

    return themeText + themeQA + notionsText;
};

// Formateur pour le niveau 4 (une notion spécifique)
export const formatLevel4Prompt = (notion) => {
    return `Notion: ${notion.name}\nQuestion: ${notion.question}\nRéponse: ${notion.answer}`;
};