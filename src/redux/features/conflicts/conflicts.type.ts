export interface GetAllConflictsArgs {
  page?: number;
  limit?: number;
  kind?: string;
  status?: string;
}

export interface ConflictingParcel {
  id: number;
  slug: string;
  parcelCode: string;
  locationId: string;
  areaSqm: number;
  pricePerSqm: string;
  status: string;
  reliabilityScore: number;
  notes: string;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
  boundary?: any;
}

export interface ParcelConflictItem {
  id: number;
  parcelRole: string;
  conflictingParcel: ConflictingParcel;
}

export interface ConflictLocation {
  id: string;
  remarks: string;
  latitude: number;
  longitude: number;
  addressLine1: string;
  addressLine2: string;
  country: string;
  state: string;
  city: string;
  zipCode: string;
  note: string;
  createdAt: string;
  updatedAt: string;
  userId: string | null;
}

export interface ConflictOwner {
  ownershipType: string;
  sharePercentage: string;
  status: string;
  ownerName: string;
  ownerPhone: string;
  createdAt: string;
  owner: any;
}

export interface ConflictRegistration {
  id: number;
  slug: string;
  locationId: string;
  areaSqm: number;
  status: string;
  parcelId: number;
  reviewedById: number;
  reviewedAt: string;
  rejectionReason: string | null;
  siteVisitId: number;
  createdAt: string;
  updatedAt: string;
  submittedAt: string;
  step: number;
  notes: string;
  rejectionNotes: string | null;
}

export interface ConflictParcel {
  id: number;
  slug: string;
  parcelCode: string;
  locationId: string;
  areaSqm: number;
  pricePerSqm: string;
  status: string;
  reliabilityScore: number;
  notes: string;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
  location: ConflictLocation | null;
  owners: ConflictOwner[];
  registration: ConflictRegistration | null;
  boundary: any;
  conflicts: ParcelConflictItem[];
  conflictCount: number;
}

export type LandInvestigationPriorityLevel = "HIGH" | "MEDIUM" | "LOW";

export type LandParcelConflictKind = "OVERLAP" | "DUPLICATE" | "BOUNDARY_DISPUTE" | "INVALID_GEOMETRY";

export interface CreateInvestigationForConflictPayload {
  title?: string;
  description?: string;
  priorityLevel?: LandInvestigationPriorityLevel;
  investigatorId?: number;
  conflictKind?: LandParcelConflictKind;
  conflictingParcelId?: number;
  overlapAreaSqm?: number;
}
