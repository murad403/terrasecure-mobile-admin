import baseApi from '@/redux/api/api';
import { ApiResponse } from '@/redux/api/api-response.interface';
import {
  ProfileData,
  UpdateProfileInput,
  MediaItem,
  IUserActivitiesResponse,
} from './profile.type';

const profileApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    retrieveProfile: builder.query<ApiResponse<ProfileData>, void>({
      query: () => ({
        url: `/users/me`,
        method: 'GET',
      }),
      providesTags: ['Profile'],
    }),

    updateProfile: builder.mutation<ApiResponse<null>, UpdateProfileInput>({
      query: (data) => ({
        url: `/profile`,
        method: 'PATCH',
        body: data,
      }),
      invalidatesTags: ['Profile'],
    }),

    uploadImage: builder.mutation<ApiResponse<MediaItem[]>, FormData>({
      query: (data) => ({
        url: `/media/upload/images`,
        method: 'POST',
        body: data,
      }),
    }),

    uploadFile: builder.mutation<ApiResponse<MediaItem>, FormData>({
      query: (data) => ({
        url: `/media/upload/file`,
        method: 'POST',
        body: data,
      }),
    }),


    // dashboard***************************
    recentActivities: builder.query<IUserActivitiesResponse, { page?: number; limit?: number } | void>({
      query: (params) => ({
        url: `/user-activities`,
        method: 'GET',
        params: params || undefined,
      }),
    }),
  }),
});

export const {
  useRetrieveProfileQuery,
  useUpdateProfileMutation,
  useUploadImageMutation,
  useUploadFileMutation,
  useRecentActivitiesQuery,
} = profileApi;
