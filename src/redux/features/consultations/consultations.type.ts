import { ApiResponse } from '@/redux/api/api-response.interface';

export interface RequesterLocation {
  id: string;
  remarks: string | null;
  latitude: number | null;
  longitude: number | null;
  addressLine1: string | null;
  addressLine2: string | null;
  country: string | null;
  state: string | null;
  city: string | null;
  zipCode: string | null;
  note: string | null;
  createdAt: string;
  updatedAt: string;
  userId: number | null;
}

export interface LandConsultationUser {
  id: number;
  name: string;
  phone: string | null;
  profilePicture: {
    id: string;
    url: string;
    bytes?: string;
    height?: number;
    width?: number;
    mimeType?: string;
    metadata?: Record<string, any>;
    type?: string;
  } | null;
}

export interface LandConsultationParcelOwner {
  ownershipType: string;
  sharePercentage: string;
  status: string;
  ownerName: string;
  ownerPhone: string;
  createdAt: string;
  owner: any | null;
}

export interface LandConsultationParcel {
  id: number;
  slug: string;
  parcelCode?: string;
  locationId?: string;
  areaSqm?: number;
  pricePerSqm?: string;
  status?: string;
  reliabilityScore?: number;
  notes?: string;
  createdAt?: string;
  updatedAt?: string;
  deletedAt?: string | null;
  location?: RequesterLocation | null;
  owners?: LandConsultationParcelOwner[];
  registration?: any;
}

export interface LandConsultationItem {
  id: number;
  slug: string;
  userId: number;
  parcelId: number;
  requesterLocationId: string;
  requestMsg: string;
  responseMsg: string | null;
  status: 'PENDING' | 'ACCEPTED' | 'REJECTED' | string;
  createdAt: string;
  respondedAt: string | null;
  deletedAt: string | null;
  user: LandConsultationUser;
  requesterLocation?: RequesterLocation | null;
  parcel: LandConsultationParcel;
}

export interface RetrieveLandConsultationsArgs {
  page?: number;
  limit?: number;
  search?: string;
  status?: string;
}

export interface ReplyLandConsultationInput {
  responseMsg: string;
  status: 'ACCEPTED' | 'REJECTED';
}

export interface LandConsultationsPagination {
  limit: number;
  page: number;
  total: number;
  totalPages: number;
}

export interface LandConsultationsResponseData {
  success: boolean;
  statusCode: number;
  message: string;
  pagination?: LandConsultationsPagination;
  data: LandConsultationItem[];
}
