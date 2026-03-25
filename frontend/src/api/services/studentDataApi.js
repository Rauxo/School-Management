import { apiSlice } from '@/api/apiSlice';

export const studentDataApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getStudentProfile: builder.query({
      query: () => '/student/profile',
      providesTags: ['Student'],
    }),
    getStudentAttendance: builder.query({
      query: () => '/student/attendance',
      providesTags: ['Attendance'],
    }),
    getStudentFees: builder.query({
      query: () => '/student/fees',
      providesTags: ['Fee'],
    }),
  }),
});

export const { 
    useGetStudentProfileQuery, 
    useGetStudentAttendanceQuery, 
    useGetStudentFeesQuery 
} = studentDataApi;
