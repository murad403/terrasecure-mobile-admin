export interface LegalContentResponse {
  success: boolean;
  statusCode: number;
  message: string;
  data: string;
}

export interface UpdateLegalContentRequest {
  data: string;
}
