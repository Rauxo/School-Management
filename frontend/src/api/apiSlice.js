import { createApi } from '@reduxjs/toolkit/query/react';
import axiosBaseQuery from './baseQuery';

export const apiSlice = createApi({
  reducerPath: 'api',
  baseQuery: axiosBaseQuery(),
  tagTypes: ['Student', 'Staff', 'Batch', 'Fee', 'Attendance', 'Exam', 'Notice', 'Material', 'Certificate'],
  endpoints: (builder) => ({}),
});
