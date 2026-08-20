import baseApi from '@/redux/api/api';
import { ApiResponse } from '@/redux/api/api-response.interface';
import type { FetchArgs } from '@reduxjs/toolkit/query';
import type {
  LandConsultationItem,
  RetrieveLandConsultationsArgs,
  ReplyLandConsultationInput,
  LandConsultationsResponseData,
} from './consultations.type';

const consultationsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    retrieveLandConsultations: builder.query<
      LandConsultationsResponseData,
      RetrieveLandConsultationsArgs | void
    >({
      query: (args) => {
        const page = args?.page || 1;
        const limit = args?.limit || 20;
        const params: FetchArgs['params'] = { page, limit };

        if (args?.search) {
          params.search = args.search;
        }

        if (args?.status && args.status !== 'All Statuses' && args.status !== 'ALL') {
          params.status = args.status;
        }

        return {
          url: `/land-consultations`,
          method: 'GET',
          params,
        };
      },
      providesTags: ['Consultations'],
    }),

    retrieveLandConsultationDetails: builder.query<ApiResponse<LandConsultationItem>, number | string>({
      query: (id) => ({
        url: `/land-consultations/${id}`,
        method: 'GET',
      }),
      providesTags: ['Consultations'],
    }),

    addLandConsultationReply: builder.mutation<
      ApiResponse<LandConsultationItem>,
      { id: number | string; data: ReplyLandConsultationInput }
    >({
      query: ({ id, data }) => ({
        url: `/land-consultations/${id}/reply`,
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['Consultations'],
    }),

    deleteLandConsultation: builder.mutation<ApiResponse<LandConsultationItem>, number | string>({
      query: (id) => ({
        url: `/land-consultations/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Consultations'],
    }),
  }),
});

export const {
  useRetrieveLandConsultationsQuery,
  useRetrieveLandConsultationDetailsQuery,
  useAddLandConsultationReplyMutation,
  useDeleteLandConsultationMutation,
} = consultationsApi;
