export type LandParcelOwnershipType = "PRIMARY" | "CO_OWNER" | "HEIR" | "LEGAL_REPRESENTATIVE";

export type LandParcelOwnershipStatus = "DRAFT" | "UNDER_VERIFICATION" | "PUBLISHED" | "RESERVED" | "CLOSED";

export type LandParcelDocumentType = "TITLE_DEED" | "SURVEY_PLAN" | "NATIONAL_ID" | "TAX_RECEIPT" | "COURT_ORDER" | "CONSENT_LETTER" | "SALE_AGREEMENT" | "OTHER";

export type LandParcelDocumentStatus = "PENDING" | "VERIFIED" | "REJECTED";

export type LandParcelSurveyStatus = "REJECTED" | "DRAFT" | "SYNCED" | "VALIDATING" | "VALIDATED";

export interface RegistrationLocation {
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

export interface Registrant {
  id?: string;
  registrationId?: number;
  ownerName: string;
  ownerPhone: string;
  ownerId?: number | null;
  sharePercentage?: number | string;
  ownershipType?: LandParcelOwnershipType;
  status?: LandParcelOwnershipStatus;
  createdAt?: string;
  updatedAt?: string;
  owner?: any;
}

export interface RegistrationMedia {
  id: string;
  url: string;
  bytes?: string | number;
  height?: number;
  width?: number;
  mimeType?: string;
  metadata?: {
    originalName?: string;
  };
  type?: string;
}

export interface RegistrationDocument {
  id: string;
  docType?: LandParcelDocumentType;
  status: LandParcelDocumentStatus;
  accessLevel?: string;
  version?: number;
  previousVersionId?: string | null;
  verifiedById?: number | null;
  verifiedAt?: string | null;
  mediaId: string;
  createdAt?: string;
  updatedAt?: string;
  parcelId?: number | null;
  registrationId?: number;
  landParcelTransferId?: number | null;
  userId?: number | null;
  media?: RegistrationMedia;
}

export interface SiteVisitSurveyor {
  id: number;
  name: string;
  phone?: string | null;
  profilePicture?: string | null;
}

export interface SiteVisit {
  id: number;
  slug?: string;
  parcelId?: number | null;
  surveyorId?: number | null;
  phone?: string | null;
  kind?: string | null;
  scheduledAt?: string | null;
  completedAt?: string | null;
  cancelledAt?: string | null;
  createdAt?: string;
  updatedAt?: string;
  surveyor?: SiteVisitSurveyor | null;
}

export interface GisPoint {
  alt?: number;
  lat: number;
  lng: number;
  accuracy?: number;
  capturedAt?: string;
}

export interface RegistrationSurvey {
  id: number;
  parcelId?: number | null;
  registrationId: number;
  surveyorId?: number | null;
  source?: string;
  points: GisPoint[];
  computedAreaSqm?: number;
  reliabilityScore?: number;
  status: LandParcelSurveyStatus;
  validationNotes?: string | null;
  validatedById?: number | null;
  validatedAt?: string | null;
  capturedAt?: string | null;
  syncedAt?: string | null;
  createdAt?: string;
  updatedAt?: string;
  deletedAt?: string | null;
  surveyor?: SiteVisitSurveyor | null;
}

export interface RegistrationParcel {
  id: number;
  slug?: string;
  parcelCode?: string;
  locationId?: string;
  areaSqm?: number;
  pricePerSqm?: number | null;
  status?: string;
  reliabilityScore?: number;
  notes?: string;
  createdAt?: string;
  updatedAt?: string;
  deletedAt?: string | null;
}

export interface RegistrationItem {
  id: number;
  slug: string;
  locationId?: string | null;
  areaSqm?: number;
  status: string;
  parcelId?: number | null;
  reviewedById?: number | null;
  reviewedAt?: string | null;
  rejectionReason?: string | null;
  siteVisitId?: number | null;
  createdAt: string;
  updatedAt?: string;
  submittedAt?: string;
  step: number;
  notes?: string | null;
  rejectionNotes?: string | null;
  location?: RegistrationLocation | null;
  registrants?: Registrant[];
  documents?: RegistrationDocument[];
  siteVisit?: SiteVisit | null;
  surveys?: RegistrationSurvey[];
  parcel?: RegistrationParcel | null;
}

export interface Pagination {
  limit: number;
  page: number;
  total: number;
  totalPages: number;
}

export interface RegistrationsResponse {
  success: boolean;
  statusCode: number;
  message: string;
  pagination: Pagination;
  data: RegistrationItem[];
}

export interface RegistrationDetailsResponse {
  success: boolean;
  statusCode: number;
  message: string;
  data: RegistrationItem;
}

export interface RegistrationsQueryParams {
  page?: number;
  limit?: number;
  search?: string;
  status?: LandParcelOwnershipStatus | string;
  ownershipType?: LandParcelOwnershipType | string;
}

export interface CreateRegistrantPayload {
  ownerName: string;
  ownerPhone: string;
  sharePercentage?: number;
  ownershipType?: LandParcelOwnershipType;
  status?: LandParcelOwnershipStatus;
}

export interface AttachDocumentPayload {
  mediaId: string;
  docType?: LandParcelDocumentType;
}

export interface CreateRegistrationPayload {
  location?: RegistrationLocation;
  areaSqm?: number;
  notes?: string;
  submittedAt?: string;
  registrants?: CreateRegistrantPayload[];
  documents?: AttachDocumentPayload[];
}
