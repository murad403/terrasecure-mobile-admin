import baseApi from "@/redux/api/api";


const registrationApi = baseApi.injectEndpoints({
    overrideExisting: true,
    endpoints: (builder) => ({
        retrieveRegistrations: builder.query({
            query: (params?: { page?: number; limit?: number; search?: string; status?: string; ownershipType?: string }) => {
                const queryParams = new URLSearchParams();
                if (params?.page) queryParams.append("page", params.page.toString());
                if (params?.limit) queryParams.append("limit", params.limit.toString());
                if (params?.search) queryParams.append("search", params.search);
                if (params?.status && params.status !== "All") queryParams.append("status", params.status);
                if (params?.ownershipType && params.ownershipType !== "All") queryParams.append("ownershipType", params.ownershipType);
                const queryString = queryParams.toString();
                return {
                    url: `/land-parcel-registrations${queryString ? `?${queryString}` : ""}`,
                    method: "GET",
                };
            },
            providesTags: ["Registration"]
        }),
        retrieveRegistrationDetails: builder.query({
            query: (id) => ({
                url: `/land-parcel-registrations/${id}`,
                method: "GET",
            }),
            providesTags: ["Registration"]
        }),


        createRegistration: builder.mutation({
            query: (data) => ({
                url: `/land-parcel-registrations`,
                method: "POST",
                body: data,
            }),
            invalidatesTags: ["Registration"]
        }),
        verifyDocument: builder.mutation({
            query: ({ id, documentId, data }) => ({
                url: `/land-parcel-registrations/${id}/documents/${documentId}/verify`,
                method: "PATCH",
                body: data,
            }),
            invalidatesTags: ["Registration"]
        }),
        assignSurveyor: builder.mutation({
            query: ({ id, data }) => ({
                url: `/land-parcel-registrations/${id}/site-visit/surveyor`,
                method: "POST",
                body: data,
            }),
            invalidatesTags: ["Registration"]
        }),
        scheduleRegistrationSiteVisit: builder.mutation({
            query: ({ id, data }) => ({
                url: `/land-parcel-registrations/${id}/site-visit/schedule`,
                method: "PATCH",
                body: data,
            }),
            invalidatesTags: ["Registration"]
        }),
        uploadGisData: builder.mutation({
            query: ({ id, data }) => ({
                url: `/land-parcel-registrations/${id}/gis-data`,
                method: "POST",
                body: data,
            }),
            invalidatesTags: ["Registration"]
        }),
        verifyGisData: builder.mutation({
            query: ({ id, surveyId, data }) => ({
                url: `/land-parcel-registrations/${id}/gis-data/${surveyId}/verify`,
                method: "PATCH",
                body: data,
            }),
            invalidatesTags: ["Registration"]
        }),
        publishRegistration: builder.mutation({
            query: (id) => ({
                url: `/land-parcel-registrations/${id}/publish`,
                method: "PATCH",
            }),
            invalidatesTags: ["Registration"]
        }),
    })
});


export const {
    useRetrieveRegistrationsQuery,
    useRetrieveRegistrationDetailsQuery,
    useCreateRegistrationMutation,
    useVerifyDocumentMutation,
    useAssignSurveyorMutation,
    useScheduleRegistrationSiteVisitMutation,
    useUploadGisDataMutation,
    useVerifyGisDataMutation,
    usePublishRegistrationMutation,
} = registrationApi;
