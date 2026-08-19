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
