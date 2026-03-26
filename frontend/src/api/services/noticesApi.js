import { apiSlice } from '@/api/apiSlice';

export const noticesApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getNotices: builder.query({
      query: () => '/notices',
      providesTags: ['Notice'],
    }),
    getPublicNotices: builder.query({
      query: () => '/notices/public',
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

export const { useGetNoticesQuery, useGetPublicNoticesQuery, useCreateNoticeMutation, useMarkNoticeAsReadMutation } = noticesApi;
