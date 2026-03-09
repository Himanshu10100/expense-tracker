import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { getDeviceId } from '../utils/deviceId';

const API_BASE_URL = 'http://localhost:5000/api/v1';

export const apiSlice = createApi({
    reducerPath: 'api',
    baseQuery: fetchBaseQuery({
        baseUrl: API_BASE_URL,
        prepareHeaders: (headers) => {
            const deviceId = getDeviceId();
            if (deviceId) {
                headers.set('X-Device-ID', deviceId);
            }
            return headers;
        },
    }),
    tagTypes: ['Category', 'Expense', 'Summary'],
    endpoints: (builder) => ({
        getCategories: builder.query<any[], void>({
            query: () => '/categories',
            providesTags: ['Category'],
        }),
        createCategory: builder.mutation<any, { name: string; color?: string }>({
            query: (body) => ({
                url: '/categories',
                method: 'POST',
                body,
            }),
            invalidatesTags: ['Category'],
        }),
        getExpenses: builder.query<any[], { startDate?: string; endDate?: string; categoryId?: string } | void>({
            query: (params) => {
                let queryString = '';
                if (params) {
                    const searchParams = new URLSearchParams();
                    if (params.startDate) searchParams.append('startDate', params.startDate);
                    if (params.endDate) searchParams.append('endDate', params.endDate);
                    if (params.categoryId) searchParams.append('categoryId', params.categoryId);
                    if (searchParams.toString()) queryString = `?${searchParams.toString()}`;
                }
                return `/expenses${queryString}`;
            },
            providesTags: ['Expense'],
        }),
        createExpense: builder.mutation<any, { amount: number; date: string; categoryId: string; description?: string }>({
            query: (body) => ({
                url: '/expenses',
                method: 'POST',
                body,
            }),
            invalidatesTags: ['Expense', 'Summary'],
        }),
        getSummary: builder.query<any, void>({
            query: () => '/expenses/summary',
            providesTags: ['Summary'],
        }),
    }),
});

export const {
    useGetCategoriesQuery,
    useCreateCategoryMutation,
    useGetExpensesQuery,
    useCreateExpenseMutation,
    useGetSummaryQuery,
} = apiSlice;
