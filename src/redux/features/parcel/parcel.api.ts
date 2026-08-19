import baseApi from "@/redux/api/api";
import type { FetchArgs } from '@reduxjs/toolkit/query';
import {
    ParcelListItem,
    RetrieveParcelsArgs,
    RetrieveParcelsResponse,
    ParcelDetailsResponse,
    UpdateParcelPayload,
} from "./parcel.type";

const parcelApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        retrieveParcels: builder.query<RetrieveParcelsResponse, RetrieveParcelsArgs>({
            query: ({ page = 1, limit = 20, search, status }) => {
                const params: FetchArgs['params'] = { page, limit };

                if (search) {
                    params.search = search;
                }

                if (status && status !== 'All') {
                    params.status = status;
                }

                return {
                    url: "/land-parcels",
                    method: "GET",
                    params,
                };
            },
            providesTags: ["Parcel"]
        }),
        retrieveParcelDetails: builder.query<ParcelDetailsResponse, number | string>({
            query: (id) => ({
                url: `/land-parcels/${id}`,
                method: "GET",
            }),
            providesTags: ["Parcel"]
        }),
        createParcel: builder.mutation({
            query: (data) => ({
                url: `/land-parcels`,
                method: "POST",
                body: data
            }),
            invalidatesTags: ["Parcel"]
        }),
        updateParcel: builder.mutation<ParcelDetailsResponse, { id: number | string; data: UpdateParcelPayload }>({
            query: ({ id, data }) => ({
                url: `/land-parcels/${id}`,
                method: "PATCH",
                body: data
            }),
            invalidatesTags: ["Parcel"]
        }),
        deleteParcel: builder.mutation({
            query: (id) => ({
                url: `/land-parcels/${id}`,
                method: "DELETE",
            }),
            invalidatesTags: ["Parcel"]
        }),
    })
});

export const {
    useRetrieveParcelsQuery,
    useRetrieveParcelDetailsQuery,
    useCreateParcelMutation,
    useUpdateParcelMutation,
    useDeleteParcelMutation
} = parcelApi;
