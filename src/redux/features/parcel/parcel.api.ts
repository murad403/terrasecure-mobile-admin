import baseApi from "@/redux/api/api";
import type { FetchArgs } from '@reduxjs/toolkit/query';
import { RetrieveParcelsArgs, RetrieveParcelsResponse, ParcelDetailsResponse, UpdateParcelPayload, UpdateLandParcelBoundaryPayload, ParcelListItem } from "./parcel.type";
export type { ParcelListItem };


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
            invalidatesTags: ["Parcel", "Conflicts"]
        }),
        updateParcelBoundary: builder.mutation<ParcelDetailsResponse, { id: number | string; data: UpdateLandParcelBoundaryPayload }>({
            query: ({ id, data }) => ({
                url: `/land-parcels/${id}/boundary`,
                method: "PATCH",
                body: data
            }),
            invalidatesTags: ["Parcel", "Conflicts"]
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
    useUpdateParcelBoundaryMutation,
    useDeleteParcelMutation
} = parcelApi;

