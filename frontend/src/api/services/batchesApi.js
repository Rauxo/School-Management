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
    getPublicBatches: builder.query({
      query: () => '/admin/batches/public',
      providesTags: ['Batch'],
    }),
  }),
});

export const { useGetBatchesQuery, useCreateBatchMutation, useGetPublicBatchesQuery } = batchesApi;
