import baseApi from "@/redux/api/api";


const conflictsApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        getAllConflicts: builder.query({
            query: () => ({
                url: `/land-conflicts`,
                method: "GET"
            }),
            providesTags: ["Conflicts"]
        })
    })
});


export const {
    useGetAllConflictsQuery
} = conflictsApi;

