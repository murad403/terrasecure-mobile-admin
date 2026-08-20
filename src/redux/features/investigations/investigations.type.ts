import { ApiResponse } from '@/redux/api/api-response.interface';

export type LandInvestigationKind =
  | 'BOUNDARY_OVERLAP'
  | 'DUPLICATE_REGISTRATION'
  | 'FRAUDULENT_DOCUMENT'
  | 'OWNERSHIP_DISPUTE'
  | 'INVALID_GPS_DATA'
  | 'OTHER';

export type LandInvestigationPriorityLevel = 'HIGH' | 'MEDIUM' | 'LOW';

export type LandInvestigationDecision =
  | 'CLOSE'
  | 'SET_PARCEL_DISPUTED'
  | 'SET_PARCEL_BLOCKED'
  | 'CREATE_CONFLICT'
  | 'FORCE_NEW_SURVEY'
  | 'LEGAL_PROCESS';

export type LandParcelConflictKind =
  | 'OVERLAP'
  | 'DUPLICATE'
  | 'BOUNDARY_DISPUTE'
  | 'INVALID_GEOMETRY';

export interface LandInvestigationMedia {
  id: string;
  url: string;
  bytes?: string;
  height?: number;
  width?: number;
  mimeType?: string;
  metadata?: Record<string, any>;
  type?: string;
}

export interface LandInvestigationEvidence {
  id: string;
  mediaId: string;
  landInvestigationId: number;
  description?: string | null;
  uploadedById?: number | null;
  createdAt: string;
  updatedAt: string;
  media: LandInvestigationMedia;
}

export interface LandInvestigationUser {
  id: number;
  name: string;
  email?: string;
  phone?: string | null;
  profilePicture?: LandInvestigationMedia | null;
}

export interface LandInvestigationParcel {
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
  location?: any;
  owners?: any[];
}

export interface LandInvestigationItem {
  id: number;
  slug: string;
  title?: string;
  description?: string;
  kind: LandInvestigationKind | string;
  priorityLevel?: LandInvestigationPriorityLevel | string;
  status: string;
  step?: number;
  parcelId?: number;
  requesterId?: number;
  investigatorId?: number | null;
  findings?: string | null;
  resolvedById?: number | null;
  resolutionNotes?: string | null;
  resolvedAt?: string | null;
  requesterLocationId?: string | null;
  createdAt: string;
  updatedAt: string;
  deletedAt?: string | null;
  parcel?: LandInvestigationParcel;
  investigator?: LandInvestigationUser | null;
  requesterLocation?: any;
  evidences?: LandInvestigationEvidence[];
  requester?: LandInvestigationUser;
}

export interface RetrieveLandInvestigationsArgs {
  page?: number;
  limit?: number;
  search?: string;
  kind?: string;
  priorityLevel?: string;
  status?: string;
}

export interface CreateLandInvestigationInput {
  title?: string;
  description?: string;
  kind: LandInvestigationKind | string;
  priorityLevel?: LandInvestigationPriorityLevel | string;
  parcelSlug: string;
  evidenceMediaIds?: string[];
}

export interface AssignInvestigatorInput {
  investigatorId: number;
}

export interface AttachEvidenceInput {
  mediaId: string;
  description?: string;
}

export interface SubmitFindingsInput {
  findings: string;
  status?: string;
  resolutionNotes?: string;
}

export interface FinalizeLandInvestigationInput {
  decision: LandInvestigationDecision | string;
  resolutionNotes: string;
  conflictKind?: LandParcelConflictKind | string;
  conflictingParcelSlug?: string;
  legalCaseReference?: string;
}

export interface LandInvestigationsPagination {
  limit: number;
  page: number;
  total: number;
  totalPages: number;
}

export interface LandInvestigationsResponseData {
  success: boolean;
  statusCode: number;
  message: string;
  pagination?: LandInvestigationsPagination;
  data: LandInvestigationItem[];
}
