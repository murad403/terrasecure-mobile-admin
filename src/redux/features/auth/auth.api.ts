import baseApi from "@/redux/api/api";

const authApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        signIn: builder.mutation({
            query: (data) => {
                return {
                    url: "/auth/login",
                    method: "POST",
                    body: data
                }
            }
        }),
        signUp: builder.mutation({
            query: (data) => {
                return {
                    url: "/auth/signup",
                    method: "POST",
                    body: data
                }
            }
        }),
        forgotPassword: builder.mutation({
            query: (data) => {
                return {
                    url: "/auth/forget-password",
                    method: "POST",
                    body: data
                } 
            }
        }),
        verifyOtp: builder.mutation({
            query: (data) => {
                return {
                    url: "/auth/otp-verify",
                    method: "POST",
                    body: data
                }
            }
        }),
        resetPassword: builder.mutation({
            query: (data) => {
                return {
                    url: '/auth/reset-password',
                    method: "POST",
                    body: data
                }
            }
        }),
        changePassword: builder.mutation({
            query: (data) => {
                return {
                    url: '/auth/change-password',
                    method: "POST",
                    body: data
                }
            }
        })
    })
})


export const {
    useSignInMutation,
    useSignUpMutation,
    useForgotPasswordMutation,
    useVerifyOtpMutation,
    useResetPasswordMutation,
    useChangePasswordMutation
} = authApi;