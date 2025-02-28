import React, { useState } from 'react';
import { updatePrompt } from '../services/api';

const SYSTEM_PROMPTS = {
    OBJECTIF_LEVEL_1: `Objectif :`,

    OBJECTIF_LEVEL_2: `Objectif :`,

    OBJECTIF_LEVEL_3: `Objectif :`,

    OBJECTIF_LEVEL_4: `Objectif :`
};

const PromptDisplay = ({ level, data, uuid }) => {

    const [promptValue, setPromptValue] = useState(SYSTEM_PROMPTS[`OBJECTIF_LEVEL_${level}`]);

    const handleChange = (e) => {
        setPromptValue(e.target.value);
    };

    const handleSave = async () => {
        try {
            await updatePrompt(uuid, { prompt: promptValue }); // Appel à l'API pour enregistrer le prompt
            alert('Modifications enregistrées avec succès !');
        } catch (error) {
            alert('Erreur lors de l\'enregistrement des modifications.');
        }
    };

    return (
        <div className="prompt-section">
            <h3>Prompt de niveau {level}</h3>
            <div className="prompt-content">
                <pre style={{ whiteSpace: 'pre-wrap' }}>
                    <textarea
                        value={promptValue}
                        onChange={handleChange}
                        rows={4}
                        style={{
                            width: '80%',
                            padding: '10px',
                            borderRadius: '4px',
                            border: '1px solid #ddd',
                            minWidth: '50%',
                            minHeight: '100px'
                        }}
                    />
                    {'\n'}
                    <button onClick={handleSave} style={{ marginTop: '10px' }}>
                        Enregistrer
                    </button>
                    {'\n\n'}
                    {data}
                </pre>
            </div>
        </div>
    );
};

export default PromptDisplay;