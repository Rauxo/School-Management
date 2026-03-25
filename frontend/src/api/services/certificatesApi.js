import { apiSlice } from '@/api/apiSlice';

export const certificatesApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getAdminCertificates: builder.query({
      query: () => '/admin/certificates',
      providesTags: ['Certificate'],
    }),
    issueCertificate: builder.mutation({
      query: (data) => ({
        url: '/admin/certificates',
        method: 'POST',
        data: data,
      }),
      invalidatesTags: ['Certificate'],
    }),
    getStudentCertificates: builder.query({
      query: () => '/student/certificates',
      providesTags: ['Certificate'],
    }),
  }),
});

export const { 
    useGetAdminCertificatesQuery, 
    useIssueCertificateMutation, 
    useGetStudentCertificatesQuery 
} = certificatesApi;
