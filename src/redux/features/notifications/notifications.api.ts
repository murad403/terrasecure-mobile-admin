import baseApi from "@/redux/api/api";
import type { 
  GetNotificationsArgs, 
  GetNotificationsResponse
} from "./notifications.type";
import type { ApiResponse } from "@/redux/api/api-response.interface";

const notificationsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getNotifications: builder.query<GetNotificationsResponse, GetNotificationsArgs | void>({
      query: (args) => {
        const page = args?.page || 1;
        const limit = args?.limit || 20;
        return {
          url: "/notifications",
          method: "GET",
          params: { page, limit },
        };
      },
      providesTags: ["Notifications"],
    }),

    markNotificationAsRead: builder.mutation<ApiResponse<null>, string>({
      query: (notificationId) => ({
        url: `/notifications/${notificationId}/read`,
        method: "POST",
      }),
      invalidatesTags: ["Notifications"],
    }),

    deleteNotification: builder.mutation<ApiResponse<null>, string>({
      query: (notificationId) => ({
        url: `/notifications/${notificationId}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Notifications"],
    }),

    deleteAllNotifications: builder.mutation<ApiResponse<null>, void>({
      query: () => ({
        url: "/notifications",
        method: "DELETE",
      }),
      invalidatesTags: ["Notifications"],
    }),
  }),
});

export const {
  useGetNotificationsQuery,
  useMarkNotificationAsReadMutation,
  useDeleteNotificationMutation,
  useDeleteAllNotificationsMutation,
} = notificationsApi;
