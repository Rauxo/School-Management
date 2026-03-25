import API from '../axios';

const materialService = {
    getMaterials: async (params) => {
        const response = await API.get('/student/materials', { params }); // Student view
        return response.data;
    },
    getAdminMaterials: async () => {
        const response = await API.get('/admin/materials');
        return response.data;
    },
    uploadMaterial: async (formData) => {
        const response = await API.post('/admin/materials', formData, {
            headers: { 'Content-Type': 'multipart/form-data' }
        });
        return response.data;
    }
};

export default materialService;
