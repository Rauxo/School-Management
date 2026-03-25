import API from '../axios';

const paymentService = {
    createOrder: async (feeId) => {
        const response = await API.post('/payments/create-order', { feeId });
        return response.data;
    },
    verifyPayment: async (paymentData) => {
        const response = await API.post('/payments/verify', paymentData);
        return response.data;
    }
};

export default paymentService;
