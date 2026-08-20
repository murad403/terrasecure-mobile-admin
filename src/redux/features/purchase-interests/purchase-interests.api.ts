import baseApi from '@/redux/api/api';

const purchaseInterestsApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        getRolesWithPermissions: builder.query({
            query: () => ({
                url: `/rbac/roles`,
                method: 'GET',
            }),
            providesTags: ['Permission'],
        })
    }),
});



export const {

} = purchaseInterestsApi;
