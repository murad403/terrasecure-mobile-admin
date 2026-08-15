import baseApi from "@/redux/api/api";


const parcelApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        retrieveParcels: builder.query({
            query: () => ({
                url: "/land-parcels",
                method: "GET",
            }),
            providesTags: ["Parcel"]
        }),
        retrieveParcelDetails: builder.query({
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
        updateParcel: builder.mutation({
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
