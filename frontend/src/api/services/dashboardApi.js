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
    getStaffDashboardStats: builder.query({
      query: () => '/staff/dashboard',
      providesTags: ['StaffDashboard'],
    }),
    getMyBatches: builder.query({
      query: () => '/staff/my-batches',
      providesTags: ['StaffBatches'],
    }),
    getTodayAttendance: builder.query({
      query: (batchId) => `/staff/attendance-today/${batchId}`,
      providesTags: ['Attendance'],
    }),
    getStaffAttendanceAdmin: builder.query({
      query: () => '/admin/staff-attendance',
      providesTags: ['Attendance'],
    }),
  }),
});

export const {
  useGetAdminStatsQuery,
  useGetIncomeReportQuery,
  useGetStaffDashboardStatsQuery,
  useGetMyBatchesQuery,
  useGetTodayAttendanceQuery,
  useGetStaffAttendanceAdminQuery,
} = dashboardApi;
