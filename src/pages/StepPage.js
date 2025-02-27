import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getThemesForStep, getSteps, getNotionsForTheme } from '../services/api';
import PromptDisplay from '../components/promptDisplay';
import { formatLevel2Prompt } from '../components/promptFormatter';

const StepPage = ({ token }) => {
    const { stepUuid } = useParams();
    const [themes, setThemes] = useState([]);
    const [step, setStep] = useState(null);
    const [loading, setLoading] = useState(true);
    const [promptData, setPromptData] = useState('');

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);

                // Récupérer l'étape
                const stepsData = await getSteps(token);
                const currentStep = stepsData.find(s => s.uuid === stepUuid);
                setStep(currentStep);

                if (currentStep) {
                    // Récupérer les thèmes
                    const themesData = await getThemesForStep(stepUuid, token);
                    setThemes(themesData);

                    // Créer une Map pour stocker les notions par thème
                    const notionsMap = new Map();

                    // Récupérer les notions pour chaque thème
                    for (const theme of themesData) {
                        const notions = await getNotionsForTheme(theme.uuid, token);
                        notionsMap.set(theme.uuid, notions);
                    }

                    // Formater le prompt
                    const promptText = formatLevel2Prompt(currentStep, themesData, notionsMap);
                    setPromptData(promptText);
                }
                setLoading(false);
            } catch (error) {
                console.error('Failed to fetch data:', error);
                setLoading(false);
            }
        };

        fetchData();
    }, [stepUuid, token]);


    if (loading) {
        return <div>Chargement...</div>;
    }

    if (!step) {
        return <div>Étape non trouvée</div>;
    }

    return (
        <div>
            <h1>Gestion de l'étape</h1>
            <h2>{step.name}</h2>

            {/* Détails de l'étape */}
            <h3>Détails de l'étape</h3>
            <div style={{ whiteSpace: 'pre-wrap' }}>
                {Object.entries(step).map(([key, value]) => (
                    <div key={key} style={{ margin: '10px 0' }}>
                        <strong>{key}: </strong>
                        {typeof value === 'object' ? JSON.stringify(value, null, 2) : value}
                    </div>
                ))}
            </div>

            {/* Liste des thèmes */}
            <h3>Thèmes associés</h3>
            {themes.length > 0 ? (
                <ul>
                    {themes.map((theme) => (
                        <li key={theme.uuid}>
                            <Link to={`/theme/${theme.uuid}`}>{theme.name}</Link>
                        </li>
                    ))}
                </ul>
            ) : (
                <p>Aucun thème disponible pour cette étape.</p>
            )}
            <PromptDisplay level={2} data={promptData} />
        </div>
    );
};

export default StepPage;