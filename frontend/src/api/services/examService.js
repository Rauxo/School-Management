import API from '../axios';

const examService = {
    getExams: async (params) => {
        const response = await API.get('/admin/exams', { params });
        return response.data;
    },
    createExam: async (data) => {
        const response = await API.post('/admin/exams', data);
        return response.data;
    }
};

export default examService;
