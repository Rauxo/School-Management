import { apiSlice } from '@/api/apiSlice';

export const materialsApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getMaterials: builder.query({
      query: () => '/student/materials',
      providesTags: ['Material'],
    }),
  }),
});

export const { useGetMaterialsQuery } = materialsApi;
