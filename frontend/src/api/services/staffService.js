import API from '../axios';

const staffService = {
    getAllStaff: async () => {
        const response = await API.get('/admin/staff');
        return response.data;
    },
    addStaff: async (data) => {
        const response = await API.post('/admin/staff', data);
        return response.data;
    },
    updateStaff: async (id, data) => {
        const response = await API.put(`/admin/staff/${id}`, data);
        return response.data;
    },
    deleteStaff: async (id) => {
        const response = await API.delete(`/admin/staff/${id}`);
        return response.data;
    }
};

export default staffService;
