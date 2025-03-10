import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getSteps, getThemesForStep, getNotionsForTheme } from '../services/api';
import PromptDisplay from '../components/promptDisplay';
import { formatLevel4Prompt } from '../components/promptFormatter';

const NotionPage = ({ token }) => {
    const { notionUuid } = useParams();
    const [notion, setNotion] = useState(null);
    const [parentTheme, setParentTheme] = useState(null);
    const [parentStep, setParentStep] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isSelectionMode, setIsSelectionMode] = useState(false);
    const [isSelected, setIsSelected] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                let foundNotion = null;
                let foundTheme = null;
                let foundStep = null;

                const steps = await getSteps(token);
                for (const step of steps) {
                    const themes = await getThemesForStep(step.uuid, token);
                    for (const theme of themes) {
                        const notions = await getNotionsForTheme(theme.uuid, token);
                        foundNotion = notions.find(n => n.uuid === notionUuid);
                        if (foundNotion) {
                            foundTheme = theme;
                            foundStep = step;
                            break;
                        }
                    }
                    if (foundNotion) break;
                }

                if (foundNotion) {
                    setNotion(foundNotion);
                    setParentTheme(foundTheme);
                    setParentStep(foundStep);
                }

                setLoading(false);
            } catch (error) {
                console.error('Failed to fetch data:', error);
                setLoading(false);
            }
        };

        fetchData();
    }, [notionUuid, token]);

    const handleToggle = () => {
        setIsSelected(!isSelected);
    };

    const getSelectedData = () => {
        if (!notion || !isSelected) return null;
        return formatLevel4Prompt(notion);
    };

    if (loading) return <div>Chargement...</div>;
    if (!notion) return <div>Notion non trouvée</div>;

    return (
        <div className="page-container">
            <div className="nav-panel">
                <div className="section-header">
                    {!isSelectionMode && (
                        <>
                            {parentStep && (
                                <Link
                                    to={`/step/${parentStep.uuid}`}
                                    className="nav-link"
                                >
                                    Étape : {parentStep.name}
                                </Link>
                            )}
                            {parentTheme && (
                                <Link
                                    to={`/theme/${parentTheme.uuid}`}
                                    className="back-link"
                                >
                                    ← Retour au thème : {parentTheme.name}
                                </Link>
                            )}
                        </>
                    )}
                    <h2>{notion.name}</h2>
                </div>

                <div className="info-card">
                    <h3>Détails de la notion</h3>
                    <p>
                        <strong>Description :</strong><br />
                        {notion.description || "Aucune description disponible"}
                    </p>
                </div>
            </div>

            <div className="content-panel">
                <div className="section-header">
                    <h2>Gestion du prompt</h2>
                    <div>
                        <span className={`selection-status ${isSelected ? 'active' : ''}`}>
                            {isSelected ? 'Notion sélectionnée' : 'Notion non sélectionnée'}
                        </span>
                        <button
                            onClick={() => setIsSelectionMode(!isSelectionMode)}
                            className={`action-button ${isSelectionMode ? 'danger' : 'primary'}`}
                        >
                            {isSelectionMode ? 'Terminer la sélection' : 'Modifier la sélection'}
                        </button>
                    </div>
                </div>

                {isSelectionMode && (
                    <div
                        className={`info-card ${isSelected ? 'selected' : ''}`}
                        onClick={handleToggle}
                    >
                        <div className="selection-container">
                            <input
                                type="checkbox"
                                checked={isSelected}
                                onChange={(e) => e.stopPropagation()}
                                className="selection-checkbox"
                            />
                            <span>Sélectionner cette notion</span>
                        </div>
                    </div>
                )}

                <PromptDisplay
                    level={4}
                    data={getSelectedData()}
                    uuid={notionUuid}
                    token={token}
                />
            </div>
        </div>
    );
};

export default NotionPage;