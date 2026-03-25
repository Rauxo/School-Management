import { apiSlice } from '@/api/apiSlice';

export const batchesApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getBatches: builder.query({
      query: () => '/admin/batches',
      providesTags: ['Batch'],
    }),
    createBatch: builder.mutation({
      query: (data) => ({
        url: '/admin/batches',
        method: 'POST',
        data: data,
      }),
      invalidatesTags: ['Batch'],
    }),
  }),
});

export const { useGetBatchesQuery, useCreateBatchMutation } = batchesApi;
