import { apiSlice } from '@/api/apiSlice';

export const noticesApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getNotices: builder.query({
      query: () => '/notices',
      providesTags: ['Notice'],
    }),
    createNotice: builder.mutation({
      query: (data) => ({
        url: '/admin/notices',
        method: 'POST',
        data: data,
      }),
      invalidatesTags: ['Notice'],
    }),
  }),
});

export const { useGetNoticesQuery, useCreateNoticeMutation } = noticesApi;
