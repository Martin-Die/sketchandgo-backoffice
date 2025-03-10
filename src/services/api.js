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
        const response = await axios.get(`${API_BASE_URL}api/user/prompt/get?uuid=${uuid}`);
        return response.data;
    } catch (error) {
        console.error('Failed to fetch prompt:', error);
        throw error;
    }
};

export const createPrompt = async (type, uuid, prompt, token) => {
    try {
        const response = await axios.post(`${API_BASE_URL}api/user/prompt/create?type=${type}&uuid=${uuid}`,
            { prompt },
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });
        return response.data;
    } catch (error) {

        console.log(`type: ${type}`)
        console.log(`token: ${token}`)
        console.log(`uuid: ${uuid}`)
        let errorMessage = 'Erreur lors de la création du prompt :\n';

        // Informations sur la requête
        if (error.config) {
            errorMessage += `- URL de la requête : ${error.config.url}\n`;
            errorMessage += `- Méthode : ${error.config.method}\n`;
            errorMessage += `- Headers : ${JSON.stringify(error.config.headers, null, 2)}\n`;
            errorMessage += `- Données envoyées : ${JSON.stringify(error.config.data, null, 2)}\n`;
        }

        // Informations sur la réponse
        if (error.response) {
            errorMessage += `- Statut de la réponse : ${error.response.status}\n`;
            errorMessage += `- Données de la réponse : ${JSON.stringify(error.response.data, null, 2)}\n`;
        } else if (error.request) {
            errorMessage += `- Aucune réponse reçue du serveur. Requête : ${JSON.stringify(error.request, null, 2)}\n`;
        } else {
            errorMessage += `- Erreur inconnue : ${error.message}\n`;
        }

        // Afficher l'erreur dans la console
        console.error(errorMessage);

        // Relancer l'erreur pour que le composant puisse la gérer
        throw new Error(errorMessage);
    }
};

export const updatePrompt = async (uuid, prompt, token) => {
    try {
        const response = await axios.put(
            `${API_BASE_URL}api/user/prompt/update?uuid=${uuid}`,
            prompt,
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            }
        );
        return response.data;
    } catch (error) {
        console.error('Failed to update prompt:', {
            url: error.config?.url,
            data: error.config?.data,
            response: error.response?.data,
            status: error.response?.status
        });
        throw error;
    }
};

export const deletePrompt = async (uuid) => {
    try {
        const response = await axios.delete(`${API_BASE_URL}api/user/prompt/delete?uuid=${uuid}`);
        return response.data;
    } catch (error) {
        console.error('Failed to delete prompt:', error);
        throw error;
    }
};