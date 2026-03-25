import API from '../axios';

const authService = {
    login: async (credentials) => {
        const response = await API.post('/auth/login', credentials);
        return response.data;
    },
    changePassword: async (passwords) => {
        const response = await API.put('/auth/password', passwords);
        return response.data;
    }
};

export default authService;
