export type PurchaseInterestStatus =
  | 'PENDING'
  | 'ACKNOWLEDGED'
  | 'DECLINED'
  | 'MORE_INFO_REQUESTED';

export type LandParcelTransferType =
  | 'SALE'
  | 'INHERITANCE'
  | 'GIFT'
  | 'COURT_ORDER'
  | 'GOVERNMENT_ACQUISITION'
  | 'PARTITION'
  | 'FORECLOSURE';

export type LandParcelTransferPartyRole = 'FROM' | 'TO';

export interface PurchaseInterestMedia {
  id: string;
  url: string;
  bytes?: string;
  height?: number;
  width?: number;
  mimeType?: string;
  metadata?: Record<string, any>;
  type?: string;
}

export interface PurchaseInterestUser {
  id: number;
  name: string;
  phone?: string | null;
  email?: string | null;
  profilePicture?: PurchaseInterestMedia | null;
}

export interface PurchaseInterestParcelLocation {
  id?: string;
  remarks?: string | null;
  latitude?: number | null;
  longitude?: number | null;
  addressLine1?: string | null;
  addressLine2?: string | null;
  country?: string | null;
  state?: string | null;
  city?: string | null;
  zipCode?: string | null;
  note?: string | null;
  createdAt?: string;
  updatedAt?: string;
  userId?: string | null;
}

export interface PurchaseInterestParcelOwner {
  ownershipType?: string | null;
  sharePercentage?: string | number | null;
  status?: string | null;
  ownerName?: string | null;
  ownerPhone?: string | null;
  createdAt?: string;
  owner?: any;
}

export interface PurchaseInterestParcelRegistration {
  id: number;
  slug?: string;
  locationId?: string | null;
  areaSqm?: number | null;
  status?: string | null;
  parcelId?: number | null;
  reviewedById?: number | null;
  reviewedAt?: string | null;
  rejectionReason?: string | null;
  siteVisitId?: number | null;
  createdAt?: string;
  updatedAt?: string;
  submittedAt?: string;
  step?: number;
  notes?: string | null;
  rejectionNotes?: string | null;
}

export interface PurchaseInterestParcel {
  id: number;
  slug: string;
  parcelCode?: string | null;
  locationId?: string | null;
  areaSqm?: number | null;
  pricePerSqm?: string | number | null;
  status?: string | null;
  reliabilityScore?: number | null;
  notes?: string | null;
  createdAt?: string;
  updatedAt?: string;
  deletedAt?: string | null;
  location?: PurchaseInterestParcelLocation | null;
  owners?: PurchaseInterestParcelOwner[];
  registration?: PurchaseInterestParcelRegistration | null;
}

export interface PurchaseInterestItem {
  id: number;
  slug: string;
  userId: number;
  parcelId: number;
  offerAmount: string | number;
  currency: string;
  message?: string | null;
  responseMsg?: string | null;
  status: PurchaseInterestStatus | string;
  respondedById?: number | null;
  resultingTransferId?: number | null;
  createdAt: string;
  respondedAt?: string | null;
  updatedAt: string;
  deletedAt?: string | null;
  parcel?: PurchaseInterestParcel;
  user?: PurchaseInterestUser;
  respondedBy?: PurchaseInterestUser | null;
}

export interface RetrievePurchaseInterestsArgs {
  page?: number;
  limit?: number;
  search?: string;
  status?: string;
}

export interface PurchaseInterestsPagination {
  limit: number;
  page: number;
  total: number;
  totalPages: number;
}

export interface RetrievePurchaseInterestsResponse {
  success: boolean;
  statusCode: number;
  message: string;
  pagination: PurchaseInterestsPagination;
  data: PurchaseInterestItem[];
}

export interface ReplyPurchaseInterestInput {
  status: 'ACKNOWLEDGED' | 'DECLINED' | 'MORE_INFO_REQUESTED' | string;
  message?: string;
}

export interface LandParcelTransferPartyInput {
  ownerId?: number;
  name?: string;
  phone?: string;
  role: LandParcelTransferPartyRole | string;
  sharePercentage?: number;
}

export interface CreateLandParcelTransferInput {
  parcelSlug: string;
  transferType: LandParcelTransferType | string;
  considerationAmount?: number;
  currency?: string;
  effectiveDate?: string;
  registrationId?: number;
  notes?: string;
  parties?: LandParcelTransferPartyInput[];
  purchaseInterestId?: number;
  documents?: any[];
}

export interface TransferActionInput {
  notes?: string;
}
