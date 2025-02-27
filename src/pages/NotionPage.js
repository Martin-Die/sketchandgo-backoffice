import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getSteps, getThemesForStep, getNotionsForTheme } from '../services/api';
import PromptDisplay from '../components/promptDisplay';

const NotionPage = ({ token }) => {
    const { notionUuid } = useParams();
    const [notion, setNotion] = useState(null);
    const [loading, setLoading] = useState(true);
    const [promptData, setPromptData] = useState('');

    // Charger les détails de la notion
    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                let foundNotion = null;

                // Récupérer la notion
                const steps = await getSteps(token);
                outerLoop: for (const step of steps) {
                    const themes = await getThemesForStep(step.uuid, token);
                    for (const theme of themes) {
                        const notions = await getNotionsForTheme(theme.uuid, token);
                        foundNotion = notions.find(n => n.uuid === notionUuid);
                        if (foundNotion) {
                            break outerLoop;
                        }
                    }
                }

                if (foundNotion) {
                    setNotion(foundNotion);
                    const promptText = `Question: ${foundNotion.question}\nRéponse: ${foundNotion.answer}`;
                    setPromptData(promptText);
                }

                setLoading(false);
            } catch (error) {
                console.error('Failed to fetch notion:', error);
                setLoading(false);
            }
        };

        fetchData();
    }, [notionUuid, token]);

    if (loading) {
        return <div>Chargement...</div>;
    }

    if (!notion) {
        return <div>Notion non trouvée</div>;
    }

    return (
        <div>
            <h1>Gestion de la notion</h1>
            <h2>{notion ? notion.name : 'Chargement...'}</h2>
            <p>UUID de la notion : {notionUuid}</p>

            <h3>Détails de la notion</h3>
            <div style={{ whiteSpace: 'pre-wrap' }}>
                {Object.entries(notion).map(([key, value]) => (
                    <div key={key} style={{ margin: '10px 0' }}>
                        <strong>{key}: </strong>
                        {typeof value === 'object' ? JSON.stringify(value, null, 2) : value}
                    </div>
                ))}
            </div>

            <PromptDisplay level={4} data={promptData} />
        </div>
    );
};

export default NotionPage;