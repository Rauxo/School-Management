import API from '../axios';

const feeService = {
    getFees: async (params) => {
        const response = await API.get('/admin/fees', { params });
        return response.data;
    },
    createFee: async (data) => {
        const response = await API.post('/admin/fees', data);
        return response.data;
    },
    getPendingDues: async () => {
        const response = await API.get('/admin/reports/dues');
        return response.data;
    }
};

export default feeService;
