import API from '../axios';

const studentService = {
    getStudents: async (params) => {
        const response = await API.get('/admin/students', { params });
        return response.data;
    },
    getStudentProfile: async () => {
        const response = await API.get('/student/profile');
        return response.data;
    },
    addStudent: async (data) => {
        const response = await API.post('/admin/students', data);
        return response.data;
    },
    updateStudent: async (id, data) => {
        const response = await API.put(`/admin/students/${id}`, data);
        return response.data;
    },
    deleteStudent: async (id) => {
        const response = await API.delete(`/admin/students/${id}`);
        return response.data;
    }
};

export default studentService;
