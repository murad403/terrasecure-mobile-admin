import baseApi from "@/redux/api/api";
import type { ApiResponse, SignInRequest, SignInResponseData, ForgotPasswordRequest, VerifyOtpRequest, ResetPasswordRequest, ChangePasswordRequest } from "@/types/auth.types";

import type { LegalContentResponse, UpdateLegalContentRequest } from "./auth.type";

const authApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        signIn: builder.mutation<ApiResponse<SignInResponseData>, SignInRequest>({
            query: (data) => ({
                url: "/auth/login",
                method: "POST",
                body: data
            }),
            invalidatesTags: ["Auth"]
        }),
        forgotPassword: builder.mutation<ApiResponse<null>, ForgotPasswordRequest>({
            query: (data) => ({
                url: "/auth/forgot-password",
                method: "POST",
                body: data
            })
        }),
        verifyOtp: builder.mutation<ApiResponse<null>, VerifyOtpRequest>({
            query: (data) => ({
                url: "/users/account-verify",
                method: "POST",
                body: data
            })
        }),
        resetPassword: builder.mutation<ApiResponse<null>, ResetPasswordRequest>({
            query: (data) => ({
                url: "/auth/reset-password",
                method: "POST",
                body: data
            })
        }),
        changePassword: builder.mutation<ApiResponse<null>, ChangePasswordRequest>({
            query: (data) => ({
                url: "/users/change-password",
                method: "POST",
                body: data
            })
        }),

        // Legal APIs
        getAboutUs: builder.query<LegalContentResponse, void>({
            query: () => ({
                url: "/legal/about-us",
                method: "GET"
            }),
            providesTags: ["Legal"]
        }),
        updateAboutUs: builder.mutation<LegalContentResponse, UpdateLegalContentRequest>({
            query: (data) => ({
                url: "/legal/about-us",
                method: "PUT",
                body: data
            }),
            invalidatesTags: ["Legal"]
        }),

        getPrivacyPolicy: builder.query<LegalContentResponse, void>({
            query: () => ({
                url: "/legal/privacy-policy",
                method: "GET"
            }),
            providesTags: ["Legal"]
        }),
        updatePrivacyPolicy: builder.mutation<LegalContentResponse, UpdateLegalContentRequest>({
            query: (data) => ({
                url: "/legal/privacy-policy",
                method: "PUT",
                body: data
            }),
            invalidatesTags: ["Legal"]
        }),

        getTermsConditions: builder.query<LegalContentResponse, void>({
            query: () => ({
                url: "/legal/term-and-condition",
                method: "GET"
            }),
            providesTags: ["Legal"]
        }),
        updateTermsConditions: builder.mutation<LegalContentResponse, UpdateLegalContentRequest>({
            query: (data) => ({
                url: "/legal/term-and-condition",
                method: "PUT",
                body: data
            }),
            invalidatesTags: ["Legal"]
        }),
    })
});

export const {
    useSignInMutation,
    useForgotPasswordMutation,
    useVerifyOtpMutation,
    useResetPasswordMutation,
    useChangePasswordMutation,
    useGetAboutUsQuery,
    useUpdateAboutUsMutation,
    useGetPrivacyPolicyQuery,
    useUpdatePrivacyPolicyMutation,
    useGetTermsConditionsQuery,
    useUpdateTermsConditionsMutation,
} = authApi;


