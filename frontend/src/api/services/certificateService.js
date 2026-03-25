import API from '../axios';

const certificateService = {
    getCertificates: async () => {
        const response = await API.get('/student/certificates'); // Student view
        return response.data;
    },
    issueCertificate: async (data) => {
        const response = await API.post('/admin/certificates', data);
        return response.data;
    },
    downloadCertificate: async (id) => {
        const response = await API.get(`/api/certificates/${id}/download`, {
            responseType: 'blob'
        });
        return response;
    }
};

export default certificateService;
