import { apiSlice } from '@/api/apiSlice';

export const staffApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getStaff: builder.query({
      query: () => '/admin/staff',
      providesTags: ['Staff'],
    }),
    addStaff: builder.mutation({
      query: (data) => ({
        url: '/admin/staff',
        method: 'POST',
        data,
      }),
      invalidatesTags: ['Staff', 'Dashboard'],
    }),
    deleteStaff: builder.mutation({
      query: (id) => ({
        url: `/admin/staff/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Staff', 'Dashboard'],
    }),
    updateStaff: builder.mutation({
      query: ({ id, ...data }) => ({
        url: `/admin/staff/${id}`,
        method: 'PUT',
        data,
      }),
      invalidatesTags: ['Staff', 'Dashboard'],
    }),
  }),
});

export const { useGetStaffQuery, useAddStaffMutation, useDeleteStaffMutation, useUpdateStaffMutation } = staffApi;
