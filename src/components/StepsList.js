import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getSteps, getThemesForStep, getNotionsForTheme } from '../services/api';
import PromptDisplay from './promptDisplay';

const StepsList = ({ token }) => {
    const [steps, setSteps] = useState([]);
    const [allData, setAllData] = useState('');
    const [loading, setLoading] = useState(true);

    // Combiner les deux useEffect en un seul
    useEffect(() => {
        const fetchAllData = async () => {
            try {
                setLoading(true);
                let promptText = '';

                // Récupérer toutes les étapes
                const stepsData = await getSteps(token);
                setSteps(stepsData); // Mettre à jour les steps ici

                for (const step of stepsData) { // Utiliser stepsData au lieu de steps
                    promptText += `\nÉtape: ${step.name}\n`;

                    // Récupérer les thèmes de l'étape
                    const themes = await getThemesForStep(step.uuid, token);

                    for (const theme of themes) {
                        promptText += `\n  Thème: ${theme.name}\n`;

                        // Récupérer les notions du thème
                        const notions = await getNotionsForTheme(theme.uuid, token);

                        for (const notion of notions) {
                            promptText += `\n    Question: ${notion.question}\n`;
                            promptText += `    Réponse: ${notion.answer}\n`;
                        }
                    }
                    promptText += '\n-------------------\n';
                }

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
            <PromptDisplay level={1} data={allData} />
        </div>
    );
};

export default StepsList;