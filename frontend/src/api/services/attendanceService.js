import API from '../axios';

const attendanceService = {
    markStudentAttendance: async (data) => {
        const response = await API.post('/staff/attendance', data);
        return response.data;
    },
    getMyAttendance: async () => {
        const response = await API.get('/staff/my-attendance');
        return response.data;
    },
    getBatchStudents: async (batchId) => {
        const response = await API.get(`/staff/students/${batchId}`);
        return response.data;
    }
};

export default attendanceService;
