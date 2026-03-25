import { apiSlice } from '@/api/apiSlice';

export const feesApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getFees: builder.query({
      query: (params) => ({
        url: '/admin/fees',
        params,
      }),
      providesTags: ['Fee'],
    }),
    createFee: builder.mutation({
      query: (data) => ({
        url: '/admin/fees',
        method: 'POST',
        data: data,
      }),
      invalidatesTags: ['Fee', 'Dashboard'],
    }),
  }),
});

export const { useGetFeesQuery, useCreateFeeMutation } = feesApi;
