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

export interface IUserActivityUser {
  id: number;
  name: string;
  phone?: string | null;
  profilePicture?: MediaItem | null;
}

export interface IUserActivityItem {
  id: string;
  userId: number;
  kind: string;
  action: string;
  timestamp: string;
  snapshot?: Record<string, any> | null;
  user?: IUserActivityUser | null;
  landConsultationId?: number | null;
  landInvestigationId?: number | null;
  landParcelTransferId?: number | null;
  landParcelId?: number | null;
  landParcelRegistrationId?: number | null;
  landSiteVisitId?: number | null;
  landParcelOwnershipId?: number | null;
  landParcelDocumentId?: number | null;
  landParcelConflictId?: number | null;
  landParcelSurveyId?: number | null;
  landPurchaseInterestId?: number | null;
  landConsultation?: any;
  landInvestigation?: any;
  landParcelTransfer?: any;
  landParcel?: any;
  landParcelRegistration?: any;
  landSiteVisit?: any;
  landParcelOwnership?: any;
  landParcelDocument?: any;
}

export interface IUserActivitiesResponse {
  success: boolean;
  statusCode: number;
  message: string;
  data: IUserActivityItem[];
  pagination?: {
    limit: number;
    page: number;
    total: number;
    totalPages: number;
  };
}

export type ProfileResponse = ApiResponse<ProfileData>;
export type UpdateProfileResponse = ApiResponse<null>;
export type UploadImagesResponse = ApiResponse<MediaItem[]>;
export type UploadFileResponse = ApiResponse<MediaItem>;
