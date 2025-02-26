import React, { useEffect, useState } from 'react';
import { getSteps } from '../services/api';
import ThemesList from './ThemesList';

const StepsList = ({ token }) => {
    const [steps, setSteps] = useState([]);

    useEffect(() => {
        const fetchSteps = async () => {
            try {
                const stepsData = await getSteps(token);
                setSteps(stepsData);
            } catch (error) {
                console.error('Failed to fetch steps:', error);
            }
        };

        fetchSteps();
    }, [token]);

    return (
        <div>
            <h2>Steps</h2>
            <ul>
                {steps.map((step) => (
                    <li key={step.uuid}>
                        {step.name}
                        <ThemesList stepUuid={step.uuid} token={token} />
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default StepsList;