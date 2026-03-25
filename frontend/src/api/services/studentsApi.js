import { apiSlice } from '@/api/apiSlice';

export const studentsApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getStudents: builder.query({
      query: (params) => ({
        url: '/admin/students',
        params,
      }),
      providesTags: ['Student'],
    }),
    addStudent: builder.mutation({
      query: (data) => ({
        url: '/admin/students',
        method: 'POST',
        data,
      }),
      invalidatesTags: ['Student', 'Dashboard'],
    }),
    deleteStudent: builder.mutation({
      query: (id) => ({
        url: `/admin/students/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Student', 'Dashboard'],
    }),
  }),
});

export const { 
    useGetStudentsQuery, 
    useAddStudentMutation, 
    useDeleteStudentMutation 
} = studentsApi;
