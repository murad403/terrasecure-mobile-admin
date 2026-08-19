export type Pagination = {
  total: number;
  limit: number;
  page: number;
  totalPages: number;
};

export type ApiResponse<T = any> = Partial<{
  success: boolean;
  statusCode: number;
  message: string;
  data: T;
  pagination: Pagination;
  meta: Record<string, any>;
}>;
