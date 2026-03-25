import { apiSlice } from '@/api/apiSlice';

export const materialsApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    // ✅ Admin materials
    getAdminMaterials: builder.query({
      query: () => '/admin/materials',
      providesTags: ['Material'],
    }),

    // ✅ Upload material
    uploadMaterial: builder.mutation({
      query: (data) => ({
        url: '/admin/materials',
        method: 'POST',
        data,
      }),
      invalidatesTags: ['Material'],
    }),
  }),
});

export const {
  useGetAdminMaterialsQuery,
  useUploadMaterialMutation,
} = materialsApi;