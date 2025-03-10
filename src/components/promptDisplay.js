import React, { useState, useEffect } from 'react';
import { updatePrompt, createPrompt, getPrompt } from '../services/api';

const PromptDisplay = ({ level, data, uuid, token }) => {

    const [promptValue, setPromptValue] = useState('');
    const [promptExists, setPromptExists] = useState(false);

    // Fonction pour déterminer le type de prompt selon le niveau
    const getPromptType = (level) => {
        switch (level) {
            case 2:
                return "step";
            case 3:
                return "theme";
            case 4:
                return "notion";
            default:
                return null; // Le niveau 1 n'a pas besoin de création de prompt
        }
    };

    // Vérifier si un prompt existe déjà
    useEffect(() => {
        const checkPrompt = async () => {
            try {
                const existingPrompt = await getPrompt(uuid);
                if (existingPrompt) {
                    setPromptValue(existingPrompt.prompt);
                    setPromptExists(true);
                }
            } catch (error) {
                console.log('Aucun prompt existant');
                setPromptExists(false);
            }
        };
        checkPrompt();
    }, [uuid]);

    const handleChange = (e) => {
        setPromptValue(e.target.value);
    };

    const handleSave = async () => {
        if (!promptValue.trim()) {
            alert('Le champ ne peut pas être vide');
            return;
        }

        try {
            if (!promptExists) {
                const promptType = getPromptType(level);
                if (!promptType) {
                    alert('Ce niveau ne permet pas la création de prompt');
                    return;
                }
                // Créer un nouveau prompt avec le bon type
                await createPrompt(promptType, uuid, { prompt: promptValue }, token);
                setPromptExists(true);
                alert('Prompt créé avec succès !');
            } else {
                // Mettre à jour le prompt existant
                await updatePrompt(uuid, { prompt: promptValue }, token);
                alert('Modifications enregistrées avec succès !');
            }
        } catch (error) {
            alert(promptExists ?
                'Erreur lors de l\'enregistrement des modifications.' :
                'Erreur lors de la création du prompt.'
            );
            console.error('Erreur:', error);
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
                        placeholder="Entrez votre texte ici..."
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
                    <button
                        onClick={handleSave}
                        style={{
                            marginTop: '10px',
                            opacity: promptValue.trim() ? 1 : 0.6
                        }}>
                        {!promptExists ? 'Créer le prompt' : 'Enregistrer les modifications'}
                    </button>
                    {'\n\n'}
                    {data}
                </pre>
            </div>
        </div>
    );
};

export default PromptDisplay;