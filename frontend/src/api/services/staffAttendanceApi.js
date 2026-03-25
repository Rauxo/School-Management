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
    markMyAttendance: builder.mutation({
      query: (data) => ({
        url: '/staff/my-attendance',
        method: 'POST',
        data
      }),
      invalidatesTags: ['Attendance', 'Dashboard'],
    }),
    getMyAttendance: builder.query({
      query: () => '/staff/my-attendance',
      providesTags: ['Attendance'],
    }),
  }),
});

export const { useGetBatchStudentsQuery, useMarkAttendanceMutation, useMarkMyAttendanceMutation, useGetMyAttendanceQuery } = staffAttendanceApi;
