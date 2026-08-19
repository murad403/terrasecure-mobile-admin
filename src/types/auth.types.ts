export interface ApiResponse<T = null> {
  success: boolean;
  statusCode: number;
  message: string;
  data: T;
}

export interface AuthUser {
  id: number;
  slug: string;
  name: string | null;
  email: string;
  phone: string | null;
  gender: string | null;
  dob: string | null;
  emergencyPhone: string | null;
  publicPhone: string | null;
  publicEmail: string | null;
  profilePictureId: string | null;
  status: string;
  isEmailVerified: boolean;
  isPhoneVerified: boolean;
  isFaceVerified: boolean;
  isOnline: boolean;
  lastOnlineAt: string;
  rating: string;
  ratingCount: number;
  bio: string | null;
  createdAt: string;
  updatedAt: string;
  roles: string[];
  profilePicture: string | null;
  location: string | null;
}

export interface AuthTokens {
  accessToken: string;
  accessTokenExpiresIn: string;
  refreshToken: string;
  refreshTokenExpiresIn: string;
}

export interface SignInResponseData {
  user: AuthUser;
  tokens: AuthTokens;
}

export interface SignInRequest {
  email: string;
  password: string;
}

export interface ForgotPasswordRequest {
  email: string;
}

export interface VerifyOtpRequest {
  email: string;
  otp: string;
}

export interface ResetPasswordRequest {
  email: string;
  otp: string;
  newPassword: string;
}

export interface ChangePasswordRequest {
  currentPassword: string;
  newPassword: string;
}

