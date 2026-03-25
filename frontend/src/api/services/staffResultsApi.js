import { apiSlice } from '@/api/apiSlice';

export const staffResultsApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    enterMarks: builder.mutation({
      query: (data) => ({
        url: '/staff/results',
        method: 'POST',
        data: data,
      }),
      invalidatesTags: ['Exam', 'Dashboard'],
    }),
  }),
});

export const { useEnterMarksMutation } = staffResultsApi;
