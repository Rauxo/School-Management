import { apiSlice } from '@/api/apiSlice';

export const examsApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getExams: builder.query({
      query: () => '/admin/exams',
      providesTags: ['Exam'],
    }),
    createExam: builder.mutation({
      query: (data) => ({
        url: '/admin/exams',
        method: 'POST',
        data: data,
      }),
      invalidatesTags: ['Exam'],
    }),
  }),
});

export const { useGetExamsQuery, useCreateExamMutation } = examsApi;
