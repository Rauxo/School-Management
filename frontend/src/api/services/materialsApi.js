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
    // ✅ Staff materials
    getStaffMaterials: builder.query({
      query: () => '/staff/materials',
      providesTags: ['Material'],
    }),

    // ✅ Staff Upload material
    uploadStaffMaterial: builder.mutation({
      query: (data) => ({
        url: '/staff/materials',
        method: 'POST',
        data,
      }),
      invalidatesTags: ['Material'],
    }),
    // ✅ Delete material
    deleteMaterial: builder.mutation({
      query: (id) => ({
        url: `/admin/materials/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Material'],
    }),
  }),
});

export const {
  useGetAdminMaterialsQuery,
  useUploadMaterialMutation,
  useGetStaffMaterialsQuery,
  useUploadStaffMaterialMutation,
  useDeleteMaterialMutation,
} = materialsApi;