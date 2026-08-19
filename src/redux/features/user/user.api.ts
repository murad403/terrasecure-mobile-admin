import baseApi from '@/redux/api/api';
import type { User } from '@/interfaces/user.interface';
import type { FetchArgs } from '@reduxjs/toolkit/query';
import { ApiResponse } from '@/redux/api/api-response.interface';
import { UserRole } from '@/enum';

export interface RetrieveUsersArgs {
  page?: number;
  limit?: number;
  search?: string;
  role?: UserRole;
}

const userApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    retrieveUsers: builder.query<ApiResponse<User[]>, RetrieveUsersArgs>({
      query: ({ page = 1, limit = 20, search, role }) => {
        const params: FetchArgs['params'] = { page, limit };

        if (search) {
          params.search = search;
        }

        if (role) {
          params.role = role;
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
