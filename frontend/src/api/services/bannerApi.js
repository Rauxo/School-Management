import { apiSlice } from '@/api/apiSlice';

export const bannerApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getBanners: builder.query({
      query: () => '/banners',
      providesTags: ['Banner'],
    }),
    addBanner: builder.mutation({
      query: (data) => ({
        url: '/banners',
        method: 'POST',
        data,
      }),
      invalidatesTags: ['Banner'],
    }),
    updateBanner: builder.mutation({
      query: ({ id, data }) => ({
        url: `/banners/${id}`,
        method: 'PUT',
        data,
      }),
      invalidatesTags: ['Banner'],
    }),
    deleteBanner: builder.mutation({
      query: (id) => ({
        url: `/banners/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Banner'],
    }),
  }),
});

export const {
  useGetBannersQuery,
  useAddBannerMutation,
  useUpdateBannerMutation,
  useDeleteBannerMutation,
} = bannerApi;
