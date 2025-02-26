import axios from 'axios';

const API_BASE_URL = 'https://api.sketchandgo.fr/';

export const login = async (username, password) => {
    try {
        const response = await axios.post(`${API_BASE_URL}api/login_check`, {
            username,
            password
        });
        return response.data.token;
    } catch (error) {
        console.error('Login failed:', error);
        throw error;
    }
};

export const getSteps = async (token) => {
    try {
        const response = await axios.get(`${API_BASE_URL}api/user/step/get_all`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
        return response.data;
    } catch (error) {
        console.error('Failed to fetch steps:', error);
        throw error;
    }
};

export const getThemesForStep = async (stepUuid, token) => {
    try {
        const response = await axios.get(`${API_BASE_URL}api/user/theme/get_step_themes?stepUuid=${stepUuid}`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
        return response.data;
    } catch (error) {
        console.error('Failed to fetch themes:', error);
        throw error;
    }
};

export const getNotionsForTheme = async (themeUuid, token) => {
    try {
        const response = await axios.get(`${API_BASE_URL}api/user/notion/get_theme_notions?themeUuid=${themeUuid}`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
        return response.data;
    } catch (error) {
        console.error('Failed to fetch notions:', error);
        throw error;
    }
};