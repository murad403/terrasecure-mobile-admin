import { ApiResponse } from '@/redux/api/api-response.interface';

export interface PermissionItem {
  id: string;
  key: string;
  description: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface RoleWithPermissions {
  role: string;
  permissions: string[];
}

export interface RbacUserItem {
  id: number;
  slug: string;
  name: string;
  email: string;
  phone: string | null;
  status: string;
  isEmailVerified: boolean;
  createdAt: string;
  roles: string[];
}

export interface RbacUserListArgs {
  page?: number;
  limit?: number;
  search?: string;
}

export interface RbacPagination {
  total: number;
  limit: number;
  page: number;
  totalPages: number;
}

export interface RbacUserListResponseData {
  success: boolean;
  statusCode: number;
  message: string;
  pagination?: RbacPagination;
  data: RbacUserItem[];
}

export interface SetUserRolesInput {
  roles: string[];
}

export interface PermissionKeysInput {
  permissionKeys: string[];
}

export type PermissionsResponse = ApiResponse<PermissionItem[]>;
export type RolesWithPermissionsResponse = ApiResponse<RoleWithPermissions[]>;

export interface UserActivityUserProfilePicture {
  id?: string;
  url?: string;
  bytes?: string | number;
  height?: number;
  width?: number;
  mimeType?: string;
  metadata?: Record<string, any>;
  type?: string;
}

export interface UserActivityUser {
  id: number;
  name: string;
  phone?: string | null;
  profilePicture?: UserActivityUserProfilePicture | null;
}

export interface UserActivitySnapshot {
  id?: number | string;
  kind?: string | null;
  slug?: string | null;
  step?: number | null;
  title?: string | null;
  status?: string | null;
  findings?: string | null;
  parcelId?: number | null;
  createdAt?: string;
  deletedAt?: string | null;
  updatedAt?: string;
  resolvedAt?: string | null;
  description?: string | null;
  notes?: string | null;
  requesterId?: number | null;
  resolvedById?: number | null;
  priorityLevel?: string | null;
  investigatorId?: number | null;
  resolutionNotes?: string | null;
  requesterLocationId?: string | null;
  [key: string]: any;
}

export interface UserActivity {
  id: string;
  userId: number;
  kind: string;
  action: string;
  timestamp: string;
  snapshot?: UserActivitySnapshot | null;
  user: UserActivityUser;
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
  landConsultation?: any | null;
  landInvestigation?: any | null;
  landParcelTransfer?: any | null;
  landParcel?: any | null;
  landParcelRegistration?: any | null;
  landSiteVisit?: any | null;
  landParcelOwnership?: any | null;
  landParcelDocument?: any | null;
}

export interface GetUserActivitiesArgs {
  page?: number;
  limit?: number;
  search?: string;
  kind?: string;
  action?: string;
  userId?: number;
  startDate?: string;
  endDate?: string;
}

export interface GetUserActivitiesPagination {
  limit: number;
  page: number;
  total: number;
  totalPages: number;
}

export interface GetUserActivitiesResponse {
  success: boolean;
  statusCode: number;
  message: string;
  pagination: GetUserActivitiesPagination;
  data: UserActivity[];
}

export interface GetUserActivityDetailsResponse {
  success: boolean;
  statusCode: number;
  message: string;
  data: UserActivity;
}

