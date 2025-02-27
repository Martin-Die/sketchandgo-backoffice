import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getNotionsForTheme, getThemesForStep, getSteps } from '../services/api';
import PromptDisplay from '../components/promptDisplay';

const ThemePage = ({ token }) => {
    const { themeUuid } = useParams();
    const [notions, setNotions] = useState([]);
    const [theme, setTheme] = useState(null);
    const [loading, setLoading] = useState(true);
    const [promptData, setPromptData] = useState('');

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                let promptText = '';
                let foundTheme = null;

                // Récupérer le thème
                const steps = await getSteps(token);
                for (const step of steps) {
                    const themes = await getThemesForStep(step.uuid, token);
                    foundTheme = themes.find(t => t.uuid === themeUuid);
                    if (foundTheme) {
                        break;
                    }
                }

                if (foundTheme) {
                    setTheme(foundTheme);
                    promptText += `Thème: ${foundTheme.name}\n\n`;

                    // Récupérer les notions du thème
                    const notionsData = await getNotionsForTheme(themeUuid, token);
                    setNotions(notionsData);

                    for (const notion of notionsData) {
                        promptText += `Question: ${notion.question}\n`;
                        promptText += `Réponse: ${notion.answer}\n`;
                        promptText += '\n-------------------\n';
                    }
                }

                setPromptData(promptText);
                setLoading(false);
            } catch (error) {
                console.error('Failed to fetch data:', error);
                setLoading(false);
            }
        };

        fetchData();
    }, [themeUuid, token]);

    if (loading) {
        return <div>Chargement...</div>;
    }

    if (!theme) {
        return <div>Thème non trouvé</div>;
    }

    return (
        <div>
            <h1>Gestion du thème</h1>
            <h2>{theme.name}</h2>

            {/* Détails du thème */}
            <h3>Détails du thème</h3>
            <div style={{ whiteSpace: 'pre-wrap' }}>
                {Object.entries(theme).map(([key, value]) => (
                    <div key={key} style={{ margin: '10px 0' }}>
                        <strong>{key}: </strong>
                        {typeof value === 'object' ? JSON.stringify(value, null, 2) : value}
                    </div>
                ))}
            </div>

            {/* Liste des notions */}
            <h3>Notions associées</h3>
            <ul>
                {notions.map((notion) => (
                    <li key={notion.uuid}>
                        <Link to={`/notion/${notion.uuid}`}>{notion.name}</Link>
                    </li>
                ))}
            </ul>

            <PromptDisplay level={3} data={promptData} />
        </div>
    );
};

export default ThemePage;