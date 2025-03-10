import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getNotionsForTheme, getThemesForStep, getSteps } from '../services/api';
import PromptDisplay from '../components/promptDisplay';
import { formatLevel3Prompt } from '../components/promptFormatter';

const ThemePage = ({ token }) => {
    const { themeUuid } = useParams();
    const [theme, setTheme] = useState(null);
    const [notions, setNotions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedNotions, setSelectedNotions] = useState(new Set());
    const [isSelectionMode, setIsSelectionMode] = useState(false);
    const [parentStep, setParentStep] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                let foundTheme = null;
                let foundStep = null;

                const steps = await getSteps(token);
                for (const step of steps) {
                    const themes = await getThemesForStep(step.uuid, token);
                    foundTheme = themes.find(t => t.uuid === themeUuid);
                    if (foundTheme) {
                        foundStep = step;
                        break;
                    }
                }

                if (foundTheme) {
                    setTheme(foundTheme);
                    setParentStep(foundStep);
                    const notionsData = await getNotionsForTheme(themeUuid, token);
                    setNotions(notionsData);
                }

                setLoading(false);
            } catch (error) {
                console.error('Failed to fetch data:', error);
                setLoading(false);
            }
        };

        fetchData();
    }, [themeUuid, token]);

    const handleNotionToggle = (notionUuid) => {
        const newSelected = new Set(selectedNotions);
        if (newSelected.has(notionUuid)) {
            newSelected.delete(notionUuid);
        } else {
            newSelected.add(notionUuid);
        }
        setSelectedNotions(newSelected);
    };

    const getSelectedData = () => {
        if (!theme || selectedNotions.size === 0) return null;

        const selectedNotionsData = notions.filter(notion =>
            selectedNotions.has(notion.uuid)
        );

        return formatLevel3Prompt(theme, selectedNotionsData);
    };

    if (loading) return <div className="loading-state">Chargement...</div>;
    if (!theme) return <div className="error-state">Thème non trouvé</div>;

    return (
        <div className="page-container">
            <div className="nav-panel">
                <div className="section-header">
                    {!isSelectionMode && parentStep && (
                        <Link
                            to={`/step/${parentStep.uuid}`}
                            className="back-link"
                        >
                            ← Retour à l'étape : {parentStep.name}
                        </Link>
                    )}
                    <h2>{theme.name}</h2>
                </div>

                <h3>Notions associées</h3>
                <ul className="items-list">
                    {notions.map((notion) => (
                        <li key={notion.uuid} className="list-item">
                            <div
                                onClick={() => isSelectionMode ? handleNotionToggle(notion.uuid) : null}
                                className={`item-container ${selectedNotions.has(notion.uuid) ? 'selected' : ''}`}
                            >
                                {isSelectionMode ? (
                                    <div className="selection-container">
                                        <input
                                            type="checkbox"
                                            checked={selectedNotions.has(notion.uuid)}
                                            onChange={(e) => e.stopPropagation()}
                                            className="selection-checkbox"
                                        />
                                        <span>{notion.name}</span>
                                    </div>
                                ) : (
                                    <Link
                                        to={`/notion/${notion.uuid}`}
                                        className="nav-link"
                                    >
                                        {notion.name}
                                    </Link>
                                )}
                            </div>
                        </li>
                    ))}
                </ul>
            </div>

            <div className="content-panel">
                <div className="section-header">
                    <h2>Gestion du prompt</h2>
                    <div>
                        <span className={`selection-status ${isSelectionMode ? 'active' : ''}`}>
                            {selectedNotions.size} notion(s) sélectionnée(s)
                        </span>
                        <button
                            onClick={() => setIsSelectionMode(!isSelectionMode)}
                            className={`action-button ${isSelectionMode ? 'danger' : 'primary'}`}
                        >
                            {isSelectionMode ? 'Terminer la sélection' : 'Modifier la sélection'}
                        </button>
                    </div>
                </div>

                {selectedNotions.size > 0 && (
                    <div className="info-card">
                        <h4>Notions sélectionnées</h4>
                        <div className="selected-items">
                            {Array.from(selectedNotions).map(notionUuid => {
                                const notion = notions.find(n => n.uuid === notionUuid);
                                return notion ? (
                                    <div key={notion.uuid} className="selected-item-tag">
                                        {notion.name}
                                    </div>
                                ) : null;
                            })}
                        </div>
                    </div>
                )}

                <PromptDisplay
                    level={3}
                    data={getSelectedData()}
                    uuid={themeUuid}
                    token={token}
                />
            </div>
        </div>
    );
};

export default ThemePage;