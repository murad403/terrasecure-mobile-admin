export type ParcelStatus =
  | 'DRAFT'
  | 'UNDER_VERIFICATION'
  | 'PUBLISHED'
  | 'RESERVED'
  | 'CLOSED';

export type LandParcelStatus =
  | 'DRAFT'
  | 'VERIFICATION'
  | 'VALIDATED'
  | 'PUBLISHED'
  | 'RESERVED'
  | 'SOLD'
  | 'DISPUTED'
  | 'BLOCKED';

export interface ParcelLocation {
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

export interface ParcelOwner {
  ownershipType?: string | null;
  sharePercentage?: string | number | null;
  status?: string | null;
  ownerName?: string | null;
  ownerPhone?: string | null;
  createdAt?: string;
  owner?: any;
}

export interface ParcelRegistration {
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

export interface ParcelListItem {
  id: number;
  slug?: string | null;
  parcelCode?: string | null;
  locationId?: string | null;
  areaSqm?: number | null;
  pricePerSqm?: number | null;
  status?: ParcelStatus | LandParcelStatus | string | null;
  reliabilityScore?: number | null;
  notes?: string | null;
  createdAt?: string;
  updatedAt?: string;
  deletedAt?: string | null;
  location?: ParcelLocation | null;
  owners?: ParcelOwner[];
  registration?: ParcelRegistration | null;
}

export interface Pagination {
  limit: number;
  page: number;
  total: number;
  totalPages: number;
}

export interface RetrieveParcelsResponse {
  success: boolean;
  statusCode: number;
  message: string;
  pagination: Pagination;
  data: ParcelListItem[];
}

export interface ParcelDetailsResponse {
  success: boolean;
  statusCode: number;
  message: string;
  data: ParcelListItem;
}

export interface RetrieveParcelsArgs {
  page?: number;
  limit?: number;
  search?: string;
  status?: ParcelStatus | string;
}

export interface UpdateParcelPayload {
  areaSqm?: number;
  pricePerSqm?: number;
  status?: LandParcelStatus | string;
  notes?: string;
}