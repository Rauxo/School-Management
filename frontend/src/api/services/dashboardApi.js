import { apiSlice } from '@/api/apiSlice';

export const dashboardApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getAdminStats: builder.query({
      query: () => '/admin/dashboard',
      providesTags: ['Dashboard'],
    }),
    getIncomeReport: builder.query({
      query: () => '/admin/reports/income',
    }),
  }),
});

export const { useGetAdminStatsQuery, useGetIncomeReportQuery } = dashboardApi;
