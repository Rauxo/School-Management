import API from './axios';

const axiosBaseQuery = ({ baseUrl } = { baseUrl: '' }) =>
  async (args) => {
    const { url, method, data, params, headers } = typeof args === 'string' ? { url: args } : args;
    try {
      const result = await API({ url: baseUrl + url, method, data, params, headers });
      return { data: result.data };
    } catch (axiosError) {
      let err = axiosError;
      return {
        error: {
          status: err.response?.status,
          data: err.response?.data || err.message,
        },
      };
    }
  };

export default axiosBaseQuery;
