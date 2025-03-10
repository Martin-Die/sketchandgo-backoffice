import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getThemesForStep, getSteps, getNotionsForTheme } from '../services/api';
import PromptDisplay from '../components/promptDisplay';
import { formatLevel2Prompt } from '../components/promptFormatter';

const StepPage = ({ token }) => {
    const { stepUuid } = useParams();
    const [step, setStep] = useState(null);
    const [themes, setThemes] = useState([]);
    const [notionsMap, setNotionsMap] = useState(new Map());
    const [loading, setLoading] = useState(true);
    const [selectedThemes, setSelectedThemes] = useState(new Set());
    const [selectedNotions, setSelectedNotions] = useState(new Set());
    const [isSelectionMode, setIsSelectionMode] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                const stepsData = await getSteps(token);
                const currentStep = stepsData.find(s => s.uuid === stepUuid);
                setStep(currentStep);

                if (currentStep) {
                    const themesData = await getThemesForStep(stepUuid, token);
                    setThemes(themesData);

                    const notionsMapTemp = new Map();
                    for (const theme of themesData) {
                        const notions = await getNotionsForTheme(theme.uuid, token);
                        notionsMapTemp.set(theme.uuid, notions);
                    }
                    setNotionsMap(notionsMapTemp);
                }
                setLoading(false);
            } catch (error) {
                console.error('Failed to fetch data:', error);
                setLoading(false);
            }
        };

        fetchData();
    }, [stepUuid, token]);

    const handleThemeToggle = (themeUuid) => {
        const newSelected = new Set(selectedThemes);
        if (newSelected.has(themeUuid)) {
            newSelected.delete(themeUuid);
            // Désélectionner aussi toutes les notions de ce thème
            const themeNotions = notionsMap.get(themeUuid) || [];
            const newSelectedNotions = new Set(selectedNotions);
            themeNotions.forEach(notion => {
                newSelectedNotions.delete(notion.uuid);
            });
            setSelectedNotions(newSelectedNotions);
        } else {
            newSelected.add(themeUuid);
        }
        setSelectedThemes(newSelected);
    };

    const handleNotionToggle = (notionUuid, themeUuid) => {
        const newSelected = new Set(selectedNotions);
        if (newSelected.has(notionUuid)) {
            newSelected.delete(notionUuid);
            // Si c'était la dernière notion sélectionnée du thème, désélectionner le thème aussi
            const themeNotions = notionsMap.get(themeUuid) || [];
            const hasSelectedNotions = themeNotions.some(notion =>
                notion.uuid !== notionUuid && newSelected.has(notion.uuid)
            );
            if (!hasSelectedNotions) {
                setSelectedThemes(prev => {
                    const newThemes = new Set(prev);
                    newThemes.delete(themeUuid);
                    return newThemes;
                });
            }
        } else {
            newSelected.add(notionUuid);
            // Sélectionner automatiquement le thème parent
            setSelectedThemes(prev => new Set([...prev, themeUuid]));
        }
        setSelectedNotions(newSelected);
    };

    const getSelectedData = () => {
        if (!step) return null;
        if (selectedThemes.size === 0 && selectedNotions.size === 0) return null;

        const selectedThemesData = themes.filter(theme =>
            selectedThemes.has(theme.uuid)
        );

        const selectedNotionsMap = new Map();
        selectedThemesData.forEach(theme => {
            const themeNotions = notionsMap.get(theme.uuid) || [];
            const filteredNotions = themeNotions.filter(notion =>
                selectedNotions.has(notion.uuid)
            );
            if (filteredNotions.length > 0) {
                selectedNotionsMap.set(theme.uuid, filteredNotions);
            }
        });

        return formatLevel2Prompt(step, selectedThemesData, selectedNotionsMap);
    };

    if (loading) return <div>Chargement...</div>;
    if (!step) return <div>Étape non trouvée</div>;

    return (
        <div style={{ display: 'flex', gap: '20px' }}>
            {/* Panneau de gauche : Navigation */}
            <div style={{
                width: '300px',
                borderRight: '1px solid #ddd',
                padding: '20px'
            }}>
                <h2>{step.name}</h2>
                <h3>Thèmes associés</h3>
                <ul style={{ listStyle: 'none', padding: 0 }}>
                    {themes.map((theme) => (
                        <li key={theme.uuid} style={{ marginBottom: '15px' }}>
                            <div
                                onClick={() => isSelectionMode ? handleThemeToggle(theme.uuid) : null}
                                style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'space-between',
                                    backgroundColor: selectedThemes.has(theme.uuid) ? '#e9ecef' : 'transparent',
                                    padding: '8px',
                                    borderRadius: '4px',
                                    cursor: isSelectionMode ? 'pointer' : 'default',
                                    transition: 'background-color 0.2s'
                                }}
                            >
                                {isSelectionMode ? (
                                    <div style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        width: '100%',
                                        color: '#007bff'
                                    }}>
                                        <input
                                            type="checkbox"
                                            checked={selectedThemes.has(theme.uuid)}
                                            onChange={(e) => e.stopPropagation()}
                                            style={{
                                                marginRight: '10px',
                                                cursor: 'pointer'
                                            }}
                                        />
                                        <span>{theme.name}</span>
                                    </div>
                                ) : (
                                    <Link
                                        to={`/theme/${theme.uuid}`}
                                        style={{
                                            textDecoration: 'none',
                                            color: '#007bff',
                                            display: 'block',
                                            width: '100%',
                                            padding: '4px'
                                        }}
                                    >
                                        {theme.name}
                                    </Link>
                                )}
                            </div>

                            <ul style={{
                                listStyle: 'none',
                                paddingLeft: '20px',
                                marginTop: '5px'
                            }}>
                                {notionsMap.get(theme.uuid)?.map(notion => (
                                    <li key={notion.uuid}>
                                        <div
                                            onClick={() => isSelectionMode && selectedThemes.has(theme.uuid) ?
                                                handleNotionToggle(notion.uuid, theme.uuid) : null
                                            }
                                            style={{
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'space-between',
                                                backgroundColor: selectedNotions.has(notion.uuid) ? '#e9ecef' : 'transparent',
                                                padding: '6px',
                                                borderRadius: '4px',
                                                marginBottom: '5px',
                                                cursor: isSelectionMode && selectedThemes.has(theme.uuid) ? 'pointer' : 'default',
                                                transition: 'background-color 0.2s',
                                                opacity: !selectedThemes.has(theme.uuid) && isSelectionMode ? 0.5 : 1
                                            }}
                                        >
                                            {isSelectionMode ? (
                                                <div style={{
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    width: '100%',
                                                    color: '#28a745'
                                                }}>
                                                    <input
                                                        type="checkbox"
                                                        checked={selectedNotions.has(notion.uuid)}
                                                        onChange={(e) => e.stopPropagation()}
                                                        disabled={!selectedThemes.has(theme.uuid)}
                                                        style={{
                                                            marginRight: '10px',
                                                            cursor: selectedThemes.has(theme.uuid) ? 'pointer' : 'not-allowed'
                                                        }}
                                                    />
                                                    <span>{notion.name}</span>
                                                </div>
                                            ) : (
                                                <Link
                                                    to={`/notion/${notion.uuid}`}
                                                    style={{
                                                        textDecoration: 'none',
                                                        color: '#28a745',
                                                        display: 'block',
                                                        width: '100%',
                                                        padding: '4px'
                                                    }}
                                                >
                                                    {notion.name}
                                                </Link>
                                            )}
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        </li>
                    ))}
                </ul>
            </div>

            {/* Panneau de droite : Prompt et contrôles */}
            <div style={{ flex: 1, padding: '20px' }}>
                <div style={{
                    marginBottom: '20px',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center'
                }}>
                    <h2>Gestion du prompt</h2>
                    <div>
                        <span style={{
                            marginRight: '10px',
                            color: isSelectionMode ? '#28a745' : '#6c757d'
                        }}>
                            {selectedThemes.size} thème(s) et {selectedNotions.size} notion(s) sélectionné(s)
                        </span>
                        <button
                            onClick={() => setIsSelectionMode(!isSelectionMode)}
                            style={{
                                padding: '8px 16px',
                                backgroundColor: isSelectionMode ? '#dc3545' : '#28a745',
                                color: 'white',
                                border: 'none',
                                borderRadius: '4px',
                                cursor: 'pointer'
                            }}
                        >
                            {isSelectionMode ? 'Terminer la sélection' : 'Modifier la sélection'}
                        </button>
                    </div>
                </div>

                {selectedThemes.size > 0 && (
                    <div style={{
                        marginBottom: '20px',
                        padding: '15px',
                        backgroundColor: '#f8f9fa',
                        borderRadius: '4px'
                    }}>
                        <h4 style={{ margin: '0 0 10px 0' }}>Éléments sélectionnés</h4>
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
                            {Array.from(selectedThemes).map(themeUuid => {
                                const theme = themes.find(t => t.uuid === themeUuid);
                                return theme ? (
                                    <div key={theme.uuid} style={{
                                        backgroundColor: '#e9ecef',
                                        padding: '5px 10px',
                                        borderRadius: '15px',
                                        fontSize: '0.9em'
                                    }}>
                                        {theme.name}
                                    </div>
                                ) : null;
                            })}
                        </div>
                    </div>
                )}

                <PromptDisplay
                    level={2}
                    data={getSelectedData()}
                    uuid={stepUuid}
                    token={token}
                />
            </div>
        </div>
    );
};

export default StepPage;