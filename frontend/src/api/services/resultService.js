import API from '../axios';

const resultService = {
    getResults: async (params) => {
        const response = await API.get('/student/results', { params });
        return response.data;
    },
    enterMarks: async (data) => {
        const response = await API.post('/staff/results', data);
        return response.data;
    }
};

export default resultService;
