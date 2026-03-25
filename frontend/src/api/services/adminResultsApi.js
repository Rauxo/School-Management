import { apiSlice } from '@/api/apiSlice';

export const adminResultsApi = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        getAdminResults: builder.query({
            query: () => '/admin/results',
            providesTags: ['Result'],
        }),
    }),
});

export const { useGetAdminResultsQuery } = adminResultsApi;
