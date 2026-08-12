import baseApi from "@/redux/api/api";
import type { ApiResponse, SignInRequest, SignInResponseData, ForgotPasswordRequest, VerifyOtpRequest, ResetPasswordRequest } from "@/types/auth.types";

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
        })
    })
});

export const {
    useSignInMutation,
    useForgotPasswordMutation,
    useVerifyOtpMutation,
    useResetPasswordMutation
} = authApi;
