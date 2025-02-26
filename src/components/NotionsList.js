import React, { useEffect, useState } from 'react';
import { getNotionsForTheme } from '../services/api';

const NotionsList = ({ themeUuid, token }) => {
    const [notions, setNotions] = useState([]);

    useEffect(() => {
        const fetchNotions = async () => {
            try {
                const notionsData = await getNotionsForTheme(themeUuid, token);
                setNotions(notionsData);
            } catch (error) {
                console.error('Failed to fetch notions:', error);
            }
        };

        fetchNotions();
    }, [themeUuid, token]);

    return (
        <div>
            <h4>Notions</h4>
            <ul>
                {notions.map((notion) => (
                    <li key={notion.uuid}>{notion.name}</li>
                ))}
            </ul>
        </div>
    );
};

export default NotionsList;