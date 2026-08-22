import baseApi from '@/redux/api/api';
import {
    ICreateSurveyPayload,
    ISurveyDetailsResponse,
    ISurveyListResponse,
    ISurveyMutationResponse,
    ISurveyQueryParams,
    IUpdateSurveyPayload,
    IUpdateSurveySurveyorPayload,
    IVerifyGisDataPayload,
} from './survey.type';

const surveyApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        retrieveSurvey: builder.query<ISurveyListResponse, ISurveyQueryParams | void>({
            query: (params) => ({
                url: `/land-parcel-surveys`,
                method: 'GET',
                params: params || undefined,
            }),
            providesTags: ['Survey', 'Servey'],
        }),
        retrieveSurveyDetails: builder.query<ISurveyDetailsResponse, number | string>({
            query: (id) => ({
                url: `/land-parcel-surveys/${id}`,
                method: 'GET',
            }),
            providesTags: ['Survey', 'Servey'],
        }),
        createSurvey: builder.mutation<ISurveyMutationResponse, ICreateSurveyPayload>({
            query: (data) => ({
                url: `/land-parcel-surveys`,
                method: 'POST',
                body: data,
            }),
            invalidatesTags: ['Survey', 'Servey'],
        }),
        surveyUploadFile: builder.mutation<ISurveyMutationResponse, { surveyId: number | string; data: FormData }>({
            query: ({ surveyId, data }) => ({
                url: `/land-parcel-surveys/${surveyId}/upload-file`,
                method: 'POST',
                body: data,
            }),
            invalidatesTags: ['Survey', 'Servey'],
        }),
        updateSurveySurveyor: builder.mutation<ISurveyMutationResponse, { id: number | string; data: IUpdateSurveySurveyorPayload }>({
            query: ({ id, data }) => ({
                url: `/land-parcel-surveys/${id}/surveyor`,
                method: 'POST',
                body: data,
            }),
            invalidatesTags: ['Survey', 'Servey'],
        }),
        verifyGisDataForsurvery: builder.mutation<ISurveyMutationResponse, { id: number | string; data: IVerifyGisDataPayload }>({
            query: ({ id, data }) => ({
                url: `/land-parcel-surveys/${id}/verify`,
                method: 'PATCH',
                body: data,
            }),
            invalidatesTags: ['Survey', 'Servey'],
        }),
        updateSurvey: builder.mutation<ISurveyMutationResponse, { id: number | string; data: IUpdateSurveyPayload }>({
            query: ({ id, data }) => ({
                url: `/land-parcel-surveys/${id}`,
                method: 'PATCH',
                body: data,
            }),
            invalidatesTags: ['Survey', 'Servey'],
        }),
        deleteSurvey: builder.mutation<ISurveyMutationResponse, number | string>({
            query: (id) => ({
                url: `/land-parcel-surveys/${id}`,
                method: 'DELETE',
            }),
            invalidatesTags: ['Survey', 'Servey'],
        }),
    }),
});

export const {
    useRetrieveSurveyQuery,
    useRetrieveSurveyDetailsQuery,
    useCreateSurveyMutation,
    useSurveyUploadFileMutation,
    useUpdateSurveySurveyorMutation,
    useVerifyGisDataForsurveryMutation,
    useUpdateSurveyMutation,
    useDeleteSurveyMutation,
} = surveyApi;

export default surveyApi;
