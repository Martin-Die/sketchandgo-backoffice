import React, { useEffect, useState } from 'react';
import { getThemesForStep } from '../services/api';
import NotionsList from './NotionsList';

const ThemesList = ({ stepUuid, token }) => {
    const [themes, setThemes] = useState([]);

    useEffect(() => {
        const fetchThemes = async () => {
            try {
                const themesData = await getThemesForStep(stepUuid, token);
                setThemes(themesData);
            } catch (error) {
                console.error('Failed to fetch themes:', error);
            }
        };

        fetchThemes();
    }, [stepUuid, token]);

    return (
        <div>
            <h3>Themes</h3>
            <ul>
                {themes.map((theme) => (
                    <li key={theme.uuid}>
                        {theme.name}
                        <NotionsList themeUuid={theme.uuid} token={token} />
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default ThemesList;