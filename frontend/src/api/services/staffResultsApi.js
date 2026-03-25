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
    getStaffExams: builder.query({
      query: () => '/staff/exams',
      providesTags: ['Exam'],
    }),
    createStaffExam: builder.mutation({
      query: (data) => ({
        url: '/staff/exams',
        method: 'POST',
        data: data,
      }),
      invalidatesTags: ['Exam'],
    }),
  }),
});

export const { useEnterMarksMutation, useGetStaffExamsQuery, useCreateStaffExamMutation } = staffResultsApi;
