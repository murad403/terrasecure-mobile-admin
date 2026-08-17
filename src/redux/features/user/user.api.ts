import baseApi from "@/redux/api/api";


const userApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        retrieveUsers: builder.query({
            query: () => ({
                url: `/users`,
                method: "GET",
            }),
            providesTags: ["User"]
        }),
    })
});


export const {
    useRetrieveUsersQuery,
} = userApi;
