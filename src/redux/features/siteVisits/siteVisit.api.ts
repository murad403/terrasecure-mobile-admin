import baseApi from '@/redux/api/api';
import type { FetchArgs } from '@reduxjs/toolkit/query';
import { LandSiteVisitKind, LandSiteVisitStatus } from '@/enum';
import { ApiResponse } from '@/redux/api/api-response.interface';
import { SiteVisit } from '../registrations/registration.type';

export interface RetrieveSiteVisitsArgs {
  page?: number;
  limit?: number;
  search?: string;
  kind?: LandSiteVisitKind;
  status?: LandSiteVisitStatus;
  parcelSlug?: string;
  surveyorId?: number;
}

export interface CreateSiteVisitInput {
  kind: LandSiteVisitKind;
  parcelSlug: string;
  scheduledAt: string;
  phone?: string;
}

export type UpdateSiteVisitInput = Partial<CreateSiteVisitInput>;

const buildListParams = (args: RetrieveSiteVisitsArgs = {}): FetchArgs['params'] => {
  const { page = 1, limit = 20, search, kind, status, parcelSlug, surveyorId } = args;

  const params: FetchArgs['params'] = { page, limit };

  if (search) {
    params.search = search;
  }

  if (kind) {
    params.kind = kind;
  }

  if (status) {
    params.status = status;
  }

  if (parcelSlug) {
    params.parcelSlug = parcelSlug;
  }

  if (surveyorId) {
    params.surveyorId = surveyorId;
  }

  return params;
};

const siteVisitListTags = (result?: ApiResponse<SiteVisit[]>) =>
  result?.data
    ? [
      ...result.data.map(({ id }) => ({
        type: 'SiteVisits' as const,
        id,
      })),
      { type: 'SiteVisits' as const, id: 'LIST' },
    ]
    : [{ type: 'SiteVisits' as const, id: 'LIST' }];

const siteVisitApi = baseApi.injectEndpoints({
  overrideExisting: true,
  endpoints: (builder) => ({
    retrieveSiteVisits: builder.query<
      ApiResponse<SiteVisit[]>,
      RetrieveSiteVisitsArgs
    >({
      query: (args) => ({
        url: '/land-site-visits',
        method: 'GET',
        params: buildListParams(args),
      }),
      providesTags: siteVisitListTags,
    }),

    retrieveMySiteVisits: builder.query<
      ApiResponse<SiteVisit[]>,
      RetrieveSiteVisitsArgs
    >({
      query: (args) => ({
        url: '/land-site-visits/my',
        method: 'GET',
        params: buildListParams(args),
      }),
      providesTags: siteVisitListTags,
    }),

    retrieveSiteVisitDetails: builder.query<ApiResponse<SiteVisit>, number>({
      query: (id) => ({
        url: `/land-site-visits/${id}`,
        method: 'GET',
      }),
      providesTags: (_result, _error, id) => [{ type: 'SiteVisits', id }],
    }),

    scheduleSiteVisit: builder.mutation<
      ApiResponse<SiteVisit>,
      CreateSiteVisitInput
    >({
      query: (body) => ({
        url: '/land-site-visits',
        method: 'POST',
        body,
      }),
      invalidatesTags: [{ type: 'SiteVisits', id: 'LIST' }],
    }),

    updateSiteVisit: builder.mutation<
      ApiResponse<SiteVisit>,
      { id: number; data: UpdateSiteVisitInput }
    >({
      query: ({ id, data }) => ({
        url: `/land-site-visits/${id}`,
        method: 'PATCH',
        body: data,
      }),
      invalidatesTags: (_result, _error, { id }) => [
        { type: 'SiteVisits', id },
        { type: 'SiteVisits', id: 'LIST' },
      ],
    }),

    deleteSiteVisit: builder.mutation<ApiResponse<void>, number>({
      query: (id) => ({
        url: `/land-site-visits/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: [{ type: 'SiteVisits', id: 'LIST' }],
    }),

    completeSiteVisit: builder.mutation<ApiResponse<SiteVisit>, number>({
      query: (id) => ({
        url: `/land-site-visits/${id}/complete`,
        method: 'PATCH',
      }),
      invalidatesTags: (_result, _error, id) => [
        { type: 'SiteVisits', id },
        { type: 'SiteVisits', id: 'LIST' },
      ],
    }),

    cancelSiteVisit: builder.mutation<ApiResponse<SiteVisit>, number>({
      query: (id) => ({
        url: `/land-site-visits/${id}/cancel`,
        method: 'PATCH',
      }),
      invalidatesTags: (_result, _error, id) => [
        { type: 'SiteVisits', id },
        { type: 'SiteVisits', id: 'LIST' },
      ],
    }),
  }),
});

export const {
  useRetrieveSiteVisitsQuery,
  useRetrieveMySiteVisitsQuery,
  useRetrieveSiteVisitDetailsQuery,
  useScheduleSiteVisitMutation,
  useUpdateSiteVisitMutation,
  useDeleteSiteVisitMutation,
  useCompleteSiteVisitMutation,
  useCancelSiteVisitMutation,
} = siteVisitApi;
