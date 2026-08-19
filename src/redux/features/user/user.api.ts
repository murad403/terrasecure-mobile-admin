import baseApi from '@/redux/api/api';
import type { User } from '@/interfaces/user.interface';
import type { FetchArgs } from '@reduxjs/toolkit/query';
import { ApiResponse } from '@/redux/api/api-response.interface';
import { UserRole, UserStatus, Gender } from '@/enum';
import type {
  PermissionItem,
  RoleWithPermissions,
  RbacUserItem,
  SetUserRolesInput,
  PermissionKeysInput,
  RbacUserListArgs,
  RbacUserListResponseData,
} from './user.type';


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

        if (search) params.search = search;
        if (role && role !== 'All') params.role = role;
        if (status && status !== 'All') params.status = status;
        if (gender && gender !== 'All') params.gender = gender;

        return {
          url: `/users`,
          method: 'GET',
          params,
        };
      },
      providesTags: ['User'],
    }),

    // Roles and Permissions Endpoints
    retrievePermissions: builder.query<ApiResponse<PermissionItem[]>, void>({
      query: () => ({
        url: `/rbac/permissions`,
        method: 'GET',
      }),
      providesTags: ['Permission'],
    }),

    getRolesWithPermissions: builder.query<ApiResponse<RoleWithPermissions[]>, void>({
      query: () => ({
        url: `/rbac/roles`,
        method: 'GET',
      }),
      providesTags: ['Permission'],
    }),

    getUserList: builder.query<
      RbacUserListResponseData,
      RbacUserListArgs | void
    >({
      query: (args) => {
        const page = args?.page || 1;
        const limit = args?.limit || 10;
        const params: FetchArgs['params'] = { page, limit };

        if (args?.search) {
          params.search = args.search;
        }

        return {
          url: `/rbac/users`,
          method: 'GET',
          params,
        };
      },
      providesTags: ['Permission', 'User'],
    }),


    setUserRoles: builder.mutation<ApiResponse<null>, { userId: number; data: SetUserRolesInput }>({
      query: ({ userId, data }) => ({
        url: `/rbac/users/${userId}/roles`,
        method: 'PATCH',
        body: data,
      }),
      invalidatesTags: ['Permission', 'User'],
    }),

    grantPermissions: builder.mutation<ApiResponse<RoleWithPermissions[]>, { role: string; data: PermissionKeysInput }>({
      query: ({ role, data }) => ({
        url: `/rbac/roles/${role}/permissions`,
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['Permission'],
    }),

    revokePermissions: builder.mutation<ApiResponse<RoleWithPermissions[]>, { role: string; data: PermissionKeysInput }>({
      query: ({ role, data }) => ({
        url: `/rbac/roles/${role}/permissions/delete`,
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['Permission'],
    }),
  }),
});

export const {
  useRetrieveUsersQuery,
  useRetrievePermissionsQuery,
  useGetRolesWithPermissionsQuery,
  useGetUserListQuery,
  useSetUserRolesMutation,
  useGrantPermissionsMutation,
  useRevokePermissionsMutation,
} = userApi;
