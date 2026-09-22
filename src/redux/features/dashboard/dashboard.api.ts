import baseApi from "@/redux/api/api";
import { ApiResponse } from "@/redux/api/api-response.interface";
import { DashboardOverviewData } from "./dashboard.type";

const dashboardApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getAdminOverview: builder.query<ApiResponse<DashboardOverviewData>, { timeRange?: string } | void>({
      query: (params) => ({
        url: "/dashboards/admin/overview",
        method: "GET",
        params: params || { timeRange: "7d" },
      }),
      providesTags: ["Parcel", "Registration", "User", "Consultations", "Investigations", "PurchaseInterests", "Survey"],
    }),
  }),
});

export const { useGetAdminOverviewQuery } = dashboardApi;
export default dashboardApi;
