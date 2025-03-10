import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getSteps, getThemesForStep, getNotionsForTheme } from '../services/api';
import PromptDisplay from './promptDisplay';
import { formatLevel1Prompt } from './promptFormatter';

const StepsList = ({ token }) => {
    const [steps, setSteps] = useState([]);
    const [allData, setAllData] = useState('');
    const [loading, setLoading] = useState(true);

    // Combiner les deux useEffect en un seul
    useEffect(() => {
        const fetchAllData = async () => {
            try {
                setLoading(true);

                // Récupérer toutes les étapes
                const stepsData = await getSteps(token);
                setSteps(stepsData);

                // Créer les Maps pour les thèmes et notions
                const themesMap = new Map();
                const notionsMap = new Map();

                // Récupérer les thèmes et notions pour chaque étape
                for (const step of stepsData) {
                    const themes = await getThemesForStep(step.uuid, token);
                    themesMap.set(step.uuid, themes);

                    // Récupérer les notions pour chaque thème
                    for (const theme of themes) {
                        const notions = await getNotionsForTheme(theme.uuid, token);
                        notionsMap.set(theme.uuid, notions);
                    }
                }

                // Formater le prompt
                const promptText = formatLevel1Prompt(stepsData, themesMap, notionsMap);
                setAllData(promptText);
                setLoading(false);
            } catch (error) {
                console.error('Failed to fetch data:', error);
                setLoading(false);
            }
        };

        fetchAllData();
    }, [token]);

    if (loading) {
        return <div>Chargement de toutes les données...</div>;
    }

    return (
        <div>
            <h2>Steps</h2>
            <ul>
                {steps.map((step) => (
                    <li key={step.uuid}>
                        <Link to={`/step/${step.uuid}`}>{step.name}</Link>
                    </li>
                ))}
            </ul>
            <h1>Révision globale</h1>
            <PromptDisplay
                level={1}
                data={allData}
                uuid={steps[0]?.uuid}
                token={token}
            />
        </div>
    );
};

export default StepsList;