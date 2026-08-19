import { ApiResponse } from '@/redux/api/api-response.interface';

export interface MediaItem {
  id: string;
  userId: number;
  url: string;
  type: string;
  mimeType: string;
  previewUrl: string | null;
  bytes: string;
  width: number | null;
  height: number | null;
  provider: string;
  providerPublicId: string;
  metadata: Record<string, any>;
  createdAt: string;
  updatedAt: string;
  ttl: string;
}

export interface ProfileData {
  id: number;
  slug: string;
  name: string;
  email: string;
  isEmailVerified: boolean;
  publicPhone: string | null;
  profilePicture: MediaItem | null;
  createdAt: string;
  updatedAt: string;
  roles: string[];
}

export interface UpdateProfileInput {
  name?: string;
  publicPhone?: string;
  phone?: string;
  profilePictureId?: string;
}


export type ProfileResponse = ApiResponse<ProfileData>;
export type UpdateProfileResponse = ApiResponse<null>;
export type UploadImagesResponse = ApiResponse<MediaItem[]>;
export type UploadFileResponse = ApiResponse<MediaItem>;
