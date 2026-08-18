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
}

export interface ScheduleSiteVisitInput {
  parcelId?: string;
  registrationId?: number;
  surveyorId: number;
  scheduledAt: string;
  kind: LandSiteVisitKind;
  notes?: string;
}

const siteVisitApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    retrieveSiteVisits: builder.query<
      ApiResponse<SiteVisit[]>,
      RetrieveSiteVisitsArgs
    >({
      query: ({ page = 1, limit = 20, search, kind, status }) => {
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

        return {
          url: '/land-site-visits',
          method: 'GET',
          params,
        };
      },
      providesTags: (result) =>
        result?.data
          ? [
              ...result.data.map(({ id }) => ({
                type: 'SiteVisits' as const,
                id,
              })),
              { type: 'SiteVisits', id: 'LIST' },
            ]
          : [{ type: 'SiteVisits', id: 'LIST' }],
    }),

    retrieveSiteVisitDetails: builder.query<ApiResponse<SiteVisit>, number>({
      query: (id) => ({
        url: `/land-investigations/${id}`,
        method: 'GET',
      }),
      providesTags: (_result, _error, id) => [{ type: 'SiteVisits', id }],
    }),

    scheduleSiteVisit: builder.mutation<
      ApiResponse<SiteVisit>,
      ScheduleSiteVisitInput
    >({
      query: (body) => ({
        url: '/land-site-visits',
        method: 'POST',
        body,
      }),
      invalidatesTags: [{ type: 'SiteVisits', id: 'LIST' }],
    }),
  }),
});

export const {
  useRetrieveSiteVisitsQuery,
  useRetrieveSiteVisitDetailsQuery,
  useScheduleSiteVisitMutation,
} = siteVisitApi;
