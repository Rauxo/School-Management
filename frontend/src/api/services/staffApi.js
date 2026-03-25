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
  }),
});

export const { useGetStaffQuery, useAddStaffMutation } = staffApi;
