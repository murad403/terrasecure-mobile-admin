import baseApi from "@/redux/api/api";


const registrationApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        retrieveRegistrations: builder.query({
            query: () => ({
                url: `/land-parcel-registrations`,
                method: "GET",
            }),
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
            query: ({id, documentId, data}) => ({
                url: `/land-parcel-registrations/${id}/documents/${documentId}/verify`,
                method: "PATCH",
                body: data,
            }),
            invalidatesTags: ["Registration"]
        }),
        assignSurveyor: builder.mutation({
            query: ({id, data}) => ({
                url: `/land-parcel-registrations/${id}/site-visit/surveyor`,
                method: "POST",
                body: data,
            }),
            invalidatesTags: ["Registration"]
        }),
        scheduleSiteVisit: builder.mutation({
            query: ({id, data}) => ({
                url: `/land-parcel-registrations/${id}/site-visit/schedule`,
                method: "PATCH",
                body: data,
            }),
            invalidatesTags: ["Registration"]
        }),
        uploadGisData: builder.mutation({
            query: ({id, data}) => ({
                url: `/land-parcel-registrations/${id}/gis-data`,
                method: "POST",
                body: data,
            }),
            invalidatesTags: ["Registration"]
        }),
        verifyGisData: builder.mutation({
            query: ({id, surveyId, data}) => ({
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
    useScheduleSiteVisitMutation,
    useUploadGisDataMutation,
    useVerifyGisDataMutation,
    usePublishRegistrationMutation,
} = registrationApi;
