import baseApi from '@/redux/api/api';
import { ApiResponse } from '@/redux/api/api-response.interface';
import type { FetchArgs } from '@reduxjs/toolkit/query';
import type {
  LandInvestigationItem,
  RetrieveLandInvestigationsArgs,
  CreateLandInvestigationInput,
  AssignInvestigatorInput,
  AttachEvidenceInput,
  SubmitFindingsInput,
  FinalizeLandInvestigationInput,
  LandInvestigationsResponseData,
} from './investigations.type';

const investigationsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    retrieveLandInvestigations: builder.query<
      LandInvestigationsResponseData,
      RetrieveLandInvestigationsArgs | void
    >({
      query: (args) => {
        const page = args?.page || 1;
        const limit = args?.limit || 20;
        const params: FetchArgs['params'] = { page, limit };

        if (args?.search) {
          params.search = args.search;
        }
        if (args?.kind && args.kind !== 'All Kinds' && args.kind !== 'ALL') {
          params.kind = args.kind;
        }
        if (
          args?.priorityLevel &&
          args.priorityLevel !== 'All Priorities' &&
          args.priorityLevel !== 'ALL'
        ) {
          params.priorityLevel = args.priorityLevel;
        }
        if (args?.status && args.status !== 'All Statuses' && args.status !== 'ALL') {
          params.status = args.status;
        }

        return {
          url: `/land-investigations`,
          method: 'GET',
          params,
        };
      },
      providesTags: ['Investigations'],
    }),

    retrieveLandInvestigationDetails: builder.query<
      ApiResponse<LandInvestigationItem>,
      number | string
    >({
      query: (id) => ({
        url: `/land-investigations/${id}`,
        method: 'GET',
      }),
      providesTags: ['Investigations'],
    }),

    createLandInvestigation: builder.mutation<
      ApiResponse<LandInvestigationItem>,
      CreateLandInvestigationInput
    >({
      query: (data) => ({
        url: `/land-investigations`,
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['Investigations'],
    }),

    assignInvestigator: builder.mutation<
      ApiResponse<LandInvestigationItem>,
      { investigationId: number | string; data: AssignInvestigatorInput }
    >({
      query: ({ investigationId, data }) => ({
        url: `/land-investigations/${investigationId}/investigator`,
        method: 'PATCH',
        body: data,
      }),
      invalidatesTags: ['Investigations'],
    }),

    attachEvidence: builder.mutation<
      ApiResponse<any>,
      { investigationId: number | string; data: AttachEvidenceInput }
    >({
      query: ({ investigationId, data }) => ({
        url: `/land-investigations/${investigationId}/evidences`,
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['Investigations'],
    }),

    submitFindings: builder.mutation<
      ApiResponse<LandInvestigationItem>,
      { investigationId: number | string; data: SubmitFindingsInput }
    >({
      query: ({ investigationId, data }) => ({
        url: `/land-investigations/${investigationId}/findings`,
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['Investigations'],
    }),

    submitFinalDecision: builder.mutation<
      ApiResponse<LandInvestigationItem>,
      { investigationId: number | string; data: FinalizeLandInvestigationInput }
    >({
      query: ({ investigationId, data }) => ({
        url: `/land-investigations/${investigationId}/final-decision`,
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['Investigations'],
    }),
  }),
});

export const {
  useRetrieveLandInvestigationsQuery,
  useRetrieveLandInvestigationDetailsQuery,
  useCreateLandInvestigationMutation,
  useAssignInvestigatorMutation,
  useAttachEvidenceMutation,
  useSubmitFindingsMutation,
  useSubmitFinalDecisionMutation,
} = investigationsApi;
