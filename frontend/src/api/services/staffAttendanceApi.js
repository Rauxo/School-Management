import { apiSlice } from '@/api/apiSlice';

export const staffAttendanceApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getBatchStudents: builder.query({
      query: (batchId) => `/staff/students/${batchId}`,
    }),
    markAttendance: builder.mutation({
      query: (data) => ({
        url: '/staff/attendance',
        method: 'POST',
        data: data,
      }),
      invalidatesTags: ['Attendance', 'Dashboard'],
    }),
  }),
});

export const { useGetBatchStudentsQuery, useMarkAttendanceMutation } = staffAttendanceApi;
