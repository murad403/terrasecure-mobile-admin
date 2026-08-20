import baseApi from '@/redux/api/api';
import { ApiResponse } from '@/redux/api/api-response.interface';
import type { FetchArgs } from '@reduxjs/toolkit/query';
import type {
  RetrievePurchaseInterestsResponse,
  RetrievePurchaseInterestsArgs,
  PurchaseInterestItem,
  ReplyPurchaseInterestInput,
  CreateLandParcelTransferInput,
  TransferActionInput,
} from './purchase-interests.type';

const purchaseInterestsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getPurchaseInterests: builder.query<
      RetrievePurchaseInterestsResponse,
      RetrievePurchaseInterestsArgs | void
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
          url: `/land-purchase-interests`,
          method: 'GET',
          params,
        };
      },
      providesTags: ['PurchaseInterests'],
    }),

    getPurchaseInterestDetails: builder.query<
      ApiResponse<PurchaseInterestItem>,
      number | string
    >({
      query: (id) => ({
        url: `/land-purchase-interests/${id}`,
        method: 'GET',
      }),
      providesTags: (result, error, id) => [{ type: 'PurchaseInterests', id }],
    }),

    replyPurchaseInterest: builder.mutation<
      ApiResponse<PurchaseInterestItem>,
      { id: number | string; data: ReplyPurchaseInterestInput }
    >({
      query: ({ id, data }) => ({
        url: `/land-purchase-interests/${id}/reply`,
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['PurchaseInterests'],
    }),

    landParcelTransfers: builder.mutation<
      ApiResponse<any>,
      CreateLandParcelTransferInput
    >({
      query: (data) => ({
        url: `/land-parcel-transfers`,
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['PurchaseInterests'],
    }),

    verifyTransfers: builder.mutation<
      ApiResponse<any>,
      { id: number | string; data: TransferActionInput }
    >({
      query: ({ id, data }) => ({
        url: `/land-parcel-transfers/${id}/verify`,
        method: 'PATCH',
        body: data,
      }),
      invalidatesTags: ['PurchaseInterests'],
    }),

    completeTransfers: builder.mutation<
      ApiResponse<any>,
      { id: number | string; data: TransferActionInput }
    >({
      query: ({ id, data }) => ({
        url: `/land-parcel-transfers/${id}/complete`,
        method: 'PATCH',
        body: data,
      }),
      invalidatesTags: ['PurchaseInterests'],
    }),
  }),
});

export const {
  useGetPurchaseInterestsQuery,
  useGetPurchaseInterestDetailsQuery,
  useReplyPurchaseInterestMutation,
  useLandParcelTransfersMutation,
  useVerifyTransfersMutation,
  useCompleteTransfersMutation,
} = purchaseInterestsApi;
