import React from 'react';

const SYSTEM_PROMPTS = {
    LEVEL_1: `Tu es un assistant pédagogique qui aide à la révision de toutes les étapes.
Utilise les questions et réponses suivantes pour aider l'utilisateur à réviser :`,

    LEVEL_2: `Tu es un assistant pédagogique qui aide à la révision d'une étape spécifique.
Utilise les questions et réponses suivantes pour aider l'utilisateur à réviser cette étape :`,

    LEVEL_3: `Tu es un assistant pédagogique qui aide à la révision d'un thème spécifique.
Utilise les questions et réponses suivantes pour aider l'utilisateur à réviser ce thème :`,

    LEVEL_4: `Tu es un assistant pédagogique qui aide à la révision d'une notion spécifique.
Utilise la question et la réponse suivantes pour aider l'utilisateur à réviser cette notion :`
};

const PromptDisplay = ({ level, data }) => {
    return (
        <div className="prompt-section">
            <h3>Prompt de niveau {level}</h3>
            <div className="prompt-content">
                <pre style={{ whiteSpace: 'pre-wrap' }}>
                    {SYSTEM_PROMPTS[`LEVEL_${level}`]}
                    {'\n\n'}
                    {data}
                </pre>
            </div>
        </div>
    );
};

export default PromptDisplay;