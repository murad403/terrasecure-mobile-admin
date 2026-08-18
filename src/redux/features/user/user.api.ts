import baseApi from '@/redux/api/api';
import type { User } from '@/interfaces/user.interface';
import type { FetchArgs } from '@reduxjs/toolkit/query';
import { ApiResponse } from '@/redux/api/api-response.interface';

export interface RetrieveUsersArgs {
  page?: number;
  limit?: number;
  search?: string;
}

const userApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    retrieveUsers: builder.query<ApiResponse<User[]>, RetrieveUsersArgs>({
      query: ({ page = 1, limit = 20, search }) => {
        const params: FetchArgs['params'] = { page, limit };

        if (search) {
          params.search = search;
        }

        return {
          url: `/users`,
          method: 'GET',
          params,
        };
      },
      providesTags: ['User'],
    }),
  }),
});

export const { useRetrieveUsersQuery } = userApi;
