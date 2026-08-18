export const UserRole = {
  SUPER_ADMIN: 'SUPER_ADMIN',
  ADMIN: 'ADMIN',
  SUPERVISOR: 'SUPERVISOR',
  FIELD_AGENT: 'FIELD_AGENT',
  SURVEYOR: 'SURVEYOR',
  USER: 'USER', //? Client
} as const;

export type UserRole = keyof typeof UserRole;

//////////////////////////////////////////////////////

export const Permission = {
  // ── RBAC admin ──
  'rbac:manage': 'rbac:manage',

  // ── Auth & account (self-service) ──
  'auth:logout': 'auth:logout',
  'user:read': 'user:read',
  'user:update': 'user:update',
  'user:manage': 'user:manage',
  'profile:update': 'profile:update',
  'profile:block': 'profile:block',

  // ── Addresses (self-service) ──
  'address:read': 'address:read',
  'address:create': 'address:create',
  'address:delete': 'address:delete',

  // ── Contacts (self-service) ──
  // 'contact:create': 'contact:create',
  // 'contact:read': 'contact:read',
  // 'contact:update': 'contact:update',
  // 'contact:delete': 'contact:delete',
  // 'contact:block': 'contact:block',

  // ── Conversations (self-service) ──
  'conversation:create': 'conversation:create',
  'conversation:read': 'conversation:read',
  'conversation:update': 'conversation:update',

  // ── Notifications (self-service) ──
  'notification:read': 'notification:read',
  'notification:update': 'notification:update',

  // ── Ratings (self-service) ──
  // 'rating:create': 'rating:create',
  // 'rating:read': 'rating:read',

  // ── Legal / content pages ──
  'legal:update': 'legal:update',

  // ── Land parcels ──
  'land_parcel:create': 'land_parcel:create',
  'land_parcel:read': 'land_parcel:read',
  'land_parcel:update': 'land_parcel:update',
  'land_parcel:delete': 'land_parcel:delete',

  // ── Land parcel documents ──
  'land_parcel_document:read': 'land_parcel_document:read',
  'land_parcel_document:manage': 'land_parcel_document:manage',

  // ── Land parcel ownership ──
  'land_parcel_ownership:create': 'land_parcel_ownership:create',
  'land_parcel_ownership:read': 'land_parcel_ownership:read',
  'land_parcel_ownership:update': 'land_parcel_ownership:update',
  'land_parcel_ownership:delete': 'land_parcel_ownership:delete',

  // ── Land parcel registration ──
  'land_parcel_registration:create': 'land_parcel_registration:create',
  'land_parcel_registration:read': 'land_parcel_registration:read',
  'land_parcel_registration:update': 'land_parcel_registration:update',
  'land_parcel_registration:delete': 'land_parcel_registration:delete',
  'land_parcel_registration:manage': 'land_parcel_registration:manage',

  // ── Land parcel transfer ──
  'land_parcel_transfer:create': 'land_parcel_transfer:create',
  'land_parcel_transfer:read': 'land_parcel_transfer:read',
  'land_parcel_transfer:update': 'land_parcel_transfer:update',
  'land_parcel_transfer:delete': 'land_parcel_transfer:delete',
  'land_parcel_transfer:verify': 'land_parcel_transfer:verify',
  'land_parcel_transfer:complete': 'land_parcel_transfer:complete',
  'land_parcel_transfer:dispute': 'land_parcel_transfer:dispute',
  'land_parcel_transfer:reverse': 'land_parcel_transfer:reverse',

  // ── Land purchase interest ──
  'land_purchase_interest:create': 'land_purchase_interest:create',
  'land_purchase_interest:read': 'land_purchase_interest:read',
  'land_purchase_interest:read_own': 'land_purchase_interest:read_own',
  'land_purchase_interest:update': 'land_purchase_interest:update',

  // ── Land consultation ──
  'land_consultation:create': 'land_consultation:create',
  'land_consultation:read': 'land_consultation:read',
  'land_consultation:update': 'land_consultation:update',
  'land_consultation:delete': 'land_consultation:delete',
  'land_consultation:manage': 'land_consultation:manage',

  // ── Land investigation ──
  'land_investigation:create': 'land_investigation:create',
  'land_investigation:read': 'land_investigation:read',
  'land_investigation:update': 'land_investigation:update',
  'land_investigation:delete': 'land_investigation:delete',
  'land_investigation:manage': 'land_investigation:manage',

  // ── Land site visit ──
  'land_site_visit:create': 'land_site_visit:create',
  'land_site_visit:read': 'land_site_visit:read',
  'land_site_visit:update': 'land_site_visit:update',
  'land_site_visit:delete': 'land_site_visit:delete',
  'land_site_visit:manage': 'land_site_visit:manage',

  // ── Land request feed ──
  'land_request:read': 'land_request:read',

  // ── User activity ──
  'user_activity:read': 'user_activity:read',
} as const;

export type Permission = keyof typeof Permission;

//////////////////////////////////////////////////////

export const UserStatus = {
  ACTIVE: 'ACTIVE',
  INACTIVE: 'INACTIVE',
  LOCKED: 'LOCKED',
  SUSPENDED: 'SUSPENDED',
  DELETED: 'DELETED',
} as const;

export type UserStatus = keyof typeof UserStatus;

//////////////////////////////////////////////////////

export const Gender = {
  MALE: 'MALE',
  FEMALE: 'FEMALE',
  NOT_SPECIFIED: 'NOT_SPECIFIED',
} as const;

export type Gender = keyof typeof Gender;

//////////////////////////////////////////////////////

export const LandParcelStatus = {
  DRAFT: 'DRAFT',
  VERIFICATION: 'VERIFICATION',
  VALIDATED: 'VALIDATED',
  PUBLISHED: 'PUBLISHED',
  RESERVED: 'RESERVED',
  SOLD: 'SOLD',
  DISPUTED: 'DISPUTED',
  BLOCKED: 'BLOCKED',
} as const;

export type LandParcelStatus = keyof typeof LandParcelStatus;

//////////////////////////////////////////////////

export const LandParcelOwnershipStatus = {
  DRAFT: 'DRAFT',
  UNDER_VERIFICATION: 'UNDER_VERIFICATION',
  PUBLISHED: 'PUBLISHED',
  RESERVED: 'RESERVED',
  /// ownership row closed by a completed land transfer (history is kept for the audit trail)
  CLOSED: 'CLOSED',
} as const;

export type LandParcelOwnershipStatus = keyof typeof LandParcelOwnershipStatus;

////////////////////////////////////////////////////////

export const LandParcelDocumentStatus = {
  PENDING: 'PENDING',
  VERIFIED: 'VERIFIED',
  REJECTED: 'REJECTED',
} as const;

export type LandParcelDocumentStatus = keyof typeof LandParcelDocumentStatus;

////////////////////////////////////////////////////////

export const LandParcelOwnershipType = {
  PRIMARY: 'PRIMARY',
  CO_OWNER: 'CO_OWNER',
  HEIR: 'HEIR',
  LEGAL_REPRESENTATIVE: 'LEGAL_REPRESENTATIVE',
} as const;

export type LandParcelOwnershipType = keyof typeof LandParcelOwnershipType;

///////////////////////////////////////////////////////

export const LandConsultationStatus = {
  PENDING: 'PENDING',
  ACCEPTED: 'ACCEPTED',
  REJECTED: 'REJECTED',
} as const;

export type LandConsultationStatus = keyof typeof LandConsultationStatus;

///////////////////////////////////////////////////////

export const LandInvestigationKind = {
  BOUNDARY_OVERLAP: 'BOUNDARY_OVERLAP',
  DUPLICATE_REGISTRATION: 'DUPLICATE_REGISTRATION',
  FRAUDULENT_DOCUMENT: 'FRAUDULENT_DOCUMENT',
  OWNERSHIP_DISPUTE: 'OWNERSHIP_DISPUTE',
  INVALID_GPS_DATA: 'INVALID_GPS_DATA',
  OTHER: 'OTHER',
} as const;

export type LandInvestigationKind = keyof typeof LandInvestigationKind;

////////////////////////////////////////////////////////////

export const LandInvestigationPriorityLevel = {
  HIGH: 'HIGH',
  MEDIUM: 'MEDIUM',
  LOW: 'LOW',
} as const;

export type LandInvestigationPriorityLevel =
  keyof typeof LandInvestigationPriorityLevel;

/////////////////////////////////////////////////////////////

export const LandSiteVisitKind = {
  INITIAL_SURVEY: 'INITIAL_SURVEY',
  VERIFICATION_VISIT: 'VERIFICATION_VISIT',
  DISPUTE_INVESTIGATION: 'DISPUTE_INVESTIGATION',
  FOLLOW_UP: 'FOLLOW_UP',
} as const;

export type LandSiteVisitKind = keyof typeof LandSiteVisitKind;

/////////////////////////////////////////////////////////////

export const LandSiteVisitStatus = {
  SCHEDULED: 'SCHEDULED',
  COMPLETED: 'COMPLETED',
  CANCELLED: 'CANCELLED',
} as const;

export type LandSiteVisitStatus = keyof typeof LandSiteVisitStatus;

/////////////////////////////////////////////////////////////

export const LandParcelTransferType = {
  SALE: 'SALE',
  INHERITANCE: 'INHERITANCE',
  GIFT: 'GIFT',
  COURT_ORDER: 'COURT_ORDER',
  GOVERNMENT_ACQUISITION: 'GOVERNMENT_ACQUISITION',
  PARTITION: 'PARTITION',
  FORECLOSURE: 'FORECLOSURE',
} as const;

export type LandParcelTransferType = keyof typeof LandParcelTransferType;

/////////////////////////////////////////////////////////////

export const LandParcelTransferStatus = {
  PENDING: 'PENDING',
  VERIFIED: 'VERIFIED',
  DISPUTED: 'DISPUTED',
  COMPLETED: 'COMPLETED',
  REVERSED: 'REVERSED',
} as const;

export type LandParcelTransferStatus = keyof typeof LandParcelTransferStatus;

/////////////////////////////////////////////////////////////

export const LandParcelTransferPartyRole = {
  FROM: 'FROM',
  TO: 'TO',
} as const;

export type LandParcelTransferPartyRole =
  keyof typeof LandParcelTransferPartyRole;

//////////////////////////////////////////////////////////////

export const UserActivityKind = {
  LAND_CONSULTATION: 'LAND_CONSULTATION',
  LAND_INVESTIGATION: 'LAND_INVESTIGATION',
  LAND_PARCEL_TRANSFER: 'LAND_PARCEL_TRANSFER',
  LAND_PARCEL: 'LAND_PARCEL',
  LAND_PARCEL_REGISTRATION: 'LAND_PARCEL_REGISTRATION',
  LAND_SITE_VISIT: 'LAND_SITE_VISIT',
  LAND_PARCEL_OWNERSHIP: 'LAND_PARCEL_OWNERSHIP',
  LAND_PARCEL_DOCUMENT: 'LAND_PARCEL_DOCUMENT',
  LAND_PURCHASE_INTEREST: 'LAND_PURCHASE_INTEREST',
} as const;

export type UserActivityKind = keyof typeof UserActivityKind;

//////////////////////////////////////////////////////////////////

export const UserActivityAction = {
  CREATE: 'CREATE',
  UPDATE: 'UPDATE',
  DELETE: 'DELETE',
} as const;

export type UserActivityAction = keyof typeof UserActivityAction;

/////////////////////////////////////////////////////////////////////

export const LandRequestKind = {
  CONSULTATION: 'CONSULTATION',
  INVESTIGATION: 'INVESTIGATION',
  SITE_VISIT: 'SITE_VISIT',
  PARCEL_REGISTRATION: 'PARCEL_REGISTRATION',
  PURCHASE_INTEREST: 'PURCHASE_INTEREST',
} as const;

export type LandRequestKind = keyof typeof LandRequestKind;

/////////////////////////////////////////////////////////////////////

export const LandPurchaseInterestStatus = {
  PENDING: 'PENDING',
  ACKNOWLEDGED: 'ACKNOWLEDGED',
  DECLINED: 'DECLINED',
  MORE_INFO_REQUESTED: 'MORE_INFO_REQUESTED',
  EXPIRED: 'EXPIRED',
  CONVERTED_TO_TRANSFER: 'CONVERTED_TO_TRANSFER',
} as const;

export type LandPurchaseInterestStatus =
  keyof typeof LandPurchaseInterestStatus;

/////////////////////////////////////////////////////////////////////

export const LandParcelConflictKind = {
  OVERLAP: 'OVERLAP',
  DUPLICATE: 'DUPLICATE',
  BOUNDARY_DISPUTE: 'BOUNDARY_DISPUTE',
  INVALID_GEOMETRY: 'INVALID_GEOMETRY',
} as const;

export type LandParcelConflictKind = keyof typeof LandParcelConflictKind;

/////////////////////////////////////////////////////////////////////

export const LandParcelConflictStatus = {
  OPEN: 'OPEN',
  UNDER_REVIEW: 'UNDER_REVIEW',
  RESOLVED: 'RESOLVED',
  DISMISSED: 'DISMISSED',
} as const;

export type LandParcelConflictStatus = keyof typeof LandParcelConflictStatus;

/////////////////////////////////////////////////////////////////////

export const LandParcelConflictDetectedBy = {
  SYSTEM: 'SYSTEM',
  MANUAL: 'MANUAL',
} as const;

export type LandParcelConflictDetectedBy =
  keyof typeof LandParcelConflictDetectedBy;

/////////////////////////////////////////////////////////////////////

export const LandParcelSurveySource = {
  MOBILE_GPS: 'MOBILE_GPS',
  QFIELD: 'QFIELD',
  TOTAL_STATION: 'TOTAL_STATION',
  MANUAL_ENTRY: 'MANUAL_ENTRY',
} as const;

export type LandParcelSurveySource = keyof typeof LandParcelSurveySource;

/////////////////////////////////////////////////////////////////////

export const LandParcelSurveyStatus = {
  DRAFT: 'DRAFT',
  SYNCED: 'SYNCED',
  VALIDATING: 'VALIDATING',
  VALIDATED: 'VALIDATED',
  REJECTED: 'REJECTED',
} as const;

export type LandParcelSurveyStatus = keyof typeof LandParcelSurveyStatus;

/////////////////////////////////////////////////////////////////////

export const LandRequestStatus = {
  PENDING: 'PENDING',
  IN_REVIEW: 'IN_REVIEW',
  APPROVED: 'APPROVED',
  REJECTED: 'REJECTED',
  COMPLETED: 'COMPLETED',
  CANCELLED: 'CANCELLED',
} as const;

export type LandRequestStatus = keyof typeof LandRequestStatus;

/////////////////////////////////////////////////////////////////////

export const LandParcelDocumentAccessLevel = {
  PUBLIC: 'PUBLIC',
  OWNER_ONLY: 'OWNER_ONLY',
  ADMIN_ONLY: 'ADMIN_ONLY',
} as const;

export type LandParcelDocumentAccessLevel =
  keyof typeof LandParcelDocumentAccessLevel;

/////////////////////////////////////////////////////////////////////

export const LandParcelDocumentType = {
  TITLE_DEED: 'TITLE_DEED',
  SURVEY_PLAN: 'SURVEY_PLAN',
  NATIONAL_ID: 'NATIONAL_ID',
  TAX_RECEIPT: 'TAX_RECEIPT',
  COURT_ORDER: 'COURT_ORDER',
  CONSENT_LETTER: 'CONSENT_LETTER',
  SALE_AGREEMENT: 'SALE_AGREEMENT',
  OTHER: 'OTHER',
} as const;

export type LandParcelDocumentType = keyof typeof LandParcelDocumentType;

/////////////////////////////////////////////////////////////////////

export const LandParcelRegistrationStep = {
  Submitted: 1,
  VerifiedDocuments: 2,
  AssignedSurveyor: 3,
  SiteVisitScheduled: 4,
  ReceivedGISData: 5,
  VerifiedGISData: 6,
  Completed: 7,
} as const satisfies Record<string, number>;

/////////////////////////////////////////////////////////////////////

export const LandParcelRegistrationStatus = {
  DRAFT: 'DRAFT',
  SUBMITTED: 'SUBMITTED',
  VERIFICATION: 'VERIFICATION',
  VALIDATED: 'VALIDATED',
  REJECTED: 'REJECTED',
  CONVERTED: 'CONVERTED',
} as const;

export type LandParcelRegistrationStatus =
  keyof typeof LandParcelRegistrationStatus;

/////////////////////////////////////////////////////////////////////

export const LandInvestigationStatus = {
  PENDING: 'PENDING',
  ASSIGNED: 'ASSIGNED',
  IN_PROGRESS: 'IN_PROGRESS',
  UNDER_REVIEW: 'UNDER_REVIEW',
  COMPLETED: 'COMPLETED',
  REJECTED: 'REJECTED',
  CLOSED: 'CLOSED',
} as const;

export type LandInvestigationStatus = keyof typeof LandInvestigationStatus;

/////////////////////////////////////////////////////////////////////

export const LandInvestigationDecision = {
  /// Close the investigation — no problem found, parcel untouched
  CLOSE: 'CLOSE',
  /// Issue found — mark the parcel as DISPUTED
  SET_PARCEL_DISPUTED: 'SET_PARCEL_DISPUTED',
  /// Serious issue — block the parcel from trading
  SET_PARCEL_BLOCKED: 'SET_PARCEL_BLOCKED',
  /// Geometric issue — record a LandParcelConflict and mark the parcel DISPUTED
  CREATE_CONFLICT: 'CREATE_CONFLICT',
  /// Bad survey data — open a new draft survey for the parcel, investigation stays open
  FORCE_NEW_SURVEY: 'FORCE_NEW_SURVEY',
  /// Refer the case to legal process (outside the system) and block the parcel
  LEGAL_PROCESS: 'LEGAL_PROCESS',
} as const;

export type LandInvestigationDecision = keyof typeof LandInvestigationDecision;
