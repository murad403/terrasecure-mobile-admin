import baseApi from '@/redux/api/api';
import { ISurveyDetailsResponse, ISurveyListResponse, ISurveyQueryParams } from './servey.type';

const serveyApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        retrieveServey: builder.query<ISurveyListResponse, ISurveyQueryParams | void>({
            query: (params) => ({
                url: `/land-parcel-surveys`,
                method: 'GET',
                params: params || undefined,
            }),
            providesTags: ['Servey'],
        }),
        retrieveServeyDetails: builder.query<ISurveyDetailsResponse, number | string>({
            query: (id) => ({
                url: `/land-parcel-surveys/${id}`,
                method: 'GET',
            }),
            providesTags: ['Servey'],
        }),
    }),
});

export const {
    useRetrieveServeyQuery,
    useRetrieveServeyDetailsQuery,
} = serveyApi;

