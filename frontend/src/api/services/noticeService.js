import API from '../axios';

const noticeService = {
    getNotices: async () => {
        const response = await API.get('/student/notices');
        return response.data;
    },
    getAdminNotices: async () => {
        const response = await API.get('/admin/notices');
        return response.data;
    },
    createNotice: async (data) => {
        const response = await API.post('/admin/notices', data);
        return response.data;
    }
};

export default noticeService;
