import API from '../axios';

const batchService = {
    getBatches: async () => {
        const response = await API.get('/admin/batches');
        return response.data;
    },
    addBatch: async (data) => {
        const response = await API.post('/admin/batches', data);
        return response.data;
    },
    updateBatch: async (id, data) => {
        const response = await API.put(`/admin/batches/${id}`, data);
        return response.data;
    }
};

export default batchService;
