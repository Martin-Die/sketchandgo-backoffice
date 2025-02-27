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

export const getStep = async (stepUuid, token) => {
    try {
        const response = await axios.get(`${API_BASE_URL}api/user/step/get_one?uuid=${stepUuid}`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
        return response.data;
    } catch (error) {
        console.error('Failed to fetch step:', error);
        throw error;
    }
};

export const getThemesForStep = async (stepUuid, token) => {
    try {
        const response = await axios.get(`${API_BASE_URL}api/user/theme/get_step_themes?stepUuid=${stepUuid}`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        return response.data; // Assurez-vous que l'API renvoie un tableau de thèmes
    } catch (error) {
        console.error('Failed to fetch themes:', error);
        throw error;
    }
};

export const getNotionsForTheme = async (themeUuid, token) => {
    try {
        const response = await axios.get(`${API_BASE_URL}api/user/notion/get_theme_notions?themeUuid=${themeUuid}`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        return response.data;
    } catch (error) {
        console.error('Failed to fetch notions:', error);
        throw error;
    }
};

export const getPrompt = async (uuid) => {
    try {
        const response = await axios.get(`/api/user/prompt/get?uuid=${uuid}`);
        return response.data;
    } catch (error) {
        console.error('Failed to fetch prompt:', error);
        throw error;
    }
};

export const createPrompt = async (type, uuid, prompt) => {
    try {
        const response = await axios.post(`/api/user/prompt/create?type=${type}&uuid=${uuid}`, prompt);
        return response.data;
    } catch (error) {
        console.error('Failed to create prompt:', error);
        throw error;
    }
};

export const updatePrompt = async (uuid, prompt) => {
    try {
        const response = await axios.put(`/api/user/prompt/update?uuid=${uuid}`, prompt);
        return response.data;
    } catch (error) {
        console.error('Failed to update prompt:', error);
        throw error;
    }
};

export const deletePrompt = async (uuid) => {
    try {
        const response = await axios.delete(`/api/user/prompt/delete?uuid=${uuid}`);
        return response.data;
    } catch (error) {
        console.error('Failed to delete prompt:', error);
        throw error;
    }
};