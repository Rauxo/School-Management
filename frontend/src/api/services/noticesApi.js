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
    markNoticeAsRead: builder.mutation({
      query: (id) => ({
        url: `/notices/${id}/read`,
        method: 'PUT',
      }),
      // Optimistically update the cache tag so the dot disappears immediately
      invalidatesTags: ['Notice'],
    }),
  }),
});

export const { useGetNoticesQuery, useCreateNoticeMutation, useMarkNoticeAsReadMutation } = noticesApi;
