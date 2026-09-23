import baseApi from "@/redux/api/api";
import { ApiResponse } from "@/redux/api/api-response.interface";
import {
  ConflictParcel,
  GetAllConflictsArgs,
  CreateInvestigationForConflictPayload,
} from "./conflicts.type";

const conflictsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getAllConflicts: builder.query<ApiResponse<ConflictParcel[]>, GetAllConflictsArgs | void>({
      query: (params) => {
        const queryParams: Record<string, any> = {};
        if (params?.page) queryParams.page = params.page;
        if (params?.limit) queryParams.limit = params.limit;
        if (params?.kind && params.kind !== "All") queryParams.kind = params.kind;
        if (params?.status && params.status !== "All") queryParams.status = params.status;

        return {
          url: `/land-conflicts`,
          method: "GET",
          params: queryParams,
        };
      },
      providesTags: ["Conflicts"],
    }),
    createInvestigationForConflict: builder.mutation<
      ApiResponse<any>,
      { parcelId: number | string; data: CreateInvestigationForConflictPayload }
    >({
      query: ({ parcelId, data }) => ({
        url: `/land-conflicts/${parcelId}/investigation`,
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Conflicts", "Investigations"],
    }),
  }),
});

export const {
  useGetAllConflictsQuery,
  useCreateInvestigationForConflictMutation,
} = conflictsApi;
