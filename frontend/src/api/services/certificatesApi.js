import { apiSlice } from '@/api/apiSlice';

export const certificatesApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getCertificates: builder.query({
      query: () => '/certificates',
      providesTags: ['Certificate'],
    }),
  }),
});

export const { useGetCertificatesQuery } = certificatesApi;
