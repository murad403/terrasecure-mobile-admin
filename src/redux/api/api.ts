
import { getCurrentUser } from "@/lib/auth";
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";


const baseQuery = fetchBaseQuery({
    baseUrl: process.env.NEXT_PUBLIC_BASE_URL,
    prepareHeaders: async (headers) => {
        const { access } = await getCurrentUser();
        if (access) {
            headers.set('Authorization', `Bearer ${access}`);
        }
        return headers;
    }
})



const baseApi = createApi({
    reducerPath: "baseApi",
    baseQuery: baseQuery,
    tagTypes: [""],
    endpoints: () => ({})
})

export default baseApi;