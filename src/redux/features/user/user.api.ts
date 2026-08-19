import baseApi from '@/redux/api/api';
import type { User } from '@/interfaces/user.interface';
import type { FetchArgs } from '@reduxjs/toolkit/query';
import { ApiResponse } from '@/redux/api/api-response.interface';
import { UserRole, UserStatus, Gender } from '@/enum';

export interface RetrieveUsersArgs {
  page?: number;
  limit?: number;
  search?: string;
  role?: UserRole | string;
  status?: UserStatus | string;
  gender?: Gender | string;
}

const userApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    retrieveUsers: builder.query<ApiResponse<User[]>, RetrieveUsersArgs>({
      query: ({ page = 1, limit = 20, search, role, status, gender }) => {
        const params: FetchArgs['params'] = { page, limit };

        if (search) {
          params.search = search;
        }

        if (role && role !== 'All') {
          params.role = role;
        }

        if (status && status !== 'All') {
          params.status = status;
        }

        if (gender && gender !== 'All') {
          params.gender = gender;
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

