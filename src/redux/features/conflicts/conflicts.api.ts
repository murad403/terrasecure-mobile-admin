import baseApi from "@/redux/api/api";


const conflictsApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        signIn: builder.mutation({
            query: (data) => ({
                url: "/auth/login",
                method: "POST",
                body: data
            }),
            invalidatesTags: ["Auth"]
        })
    })
});

export const {

} = conflictsApi;

