import { ApiResponse } from '@/redux/api/api-response.interface';
import { LandParcelSurveySource, LandParcelSurveyStatus } from '@/enum';
import { Media } from '@/interfaces/media.interface';

export interface ISurveyPoint {
  alt?: number | null;
  lat: number;
  lng: number;
  accuracy?: number | null;
  capturedAt?: string | null;
}

export interface ISurveySurveyor {
  id: number;
  name: string;
  phone?: string | null;
  profilePicture?: Media;
}

export interface ISurveyValidatedBy {
  id: number;
  name: string;
  phone?: string | null;
  profilePicture?: Media;
}

export interface ISurveyRegistration {
  id: number;
  slug?: string | null;
  locationId?: string | null;
  areaSqm?: number | null;
  status?: string | null;
  parcelId?: number | null;
  reviewedById?: number | null;
  reviewedAt?: string | null;
  rejectionReason?: string | null;
  siteVisitId?: number | null;
  createdAt?: string | null;
  updatedAt?: string | null;
  submittedAt?: string | null;
  step?: number | null;
  notes?: string | null;
  rejectionNotes?: string | null;
}

export interface ISurveyParcel {
  id: number;
  titleNumber?: string | null;
  areaSqm?: number | null;
  status?: string | null;
}

export interface ISurveyItem {
  id: number;
  parcelId?: number | null;
  registrationId?: number | null;
  surveyorId?: number | null;
  source?: LandParcelSurveySource | string | null;
  points?: ISurveyPoint[] | null;
  computedAreaSqm?: number | null;
  reliabilityScore?: number | null;
  status: LandParcelSurveyStatus | string;
  validationNotes?: string | null;
  validatedById?: number | null;
  validatedAt?: string | null;
  capturedAt?: string | null;
  syncedAt?: string | null;
  createdAt: string;
  updatedAt: string;
  deletedAt?: string | null;
  parcel?: ISurveyParcel | null;
  surveyor?: ISurveySurveyor | null;
  validatedBy?: ISurveyValidatedBy | null;
  registration?: ISurveyRegistration | null;
}

export interface ISurveyQueryParams {
  page?: number;
  limit?: number;
  search?: string;
  status?: string;
  source?: string;
}

export interface ICreateSurveyPayload {
  parcelId?: number | string;
  registrationId?: number | string;
}

export interface IUpdateSurveySurveyorPayload {
  surveyorId: number | string;
}

export interface IVerifyGisDataPayload {
  reliabilityScore: number;
  status?: LandParcelSurveyStatus | string;
  validationNotes?: string;
}

export interface IUpdateSurveyPayload {
  source?: LandParcelSurveySource | string;
  computedAreaSqm?: number;
  reliabilityScore?: number;
  status?: LandParcelSurveyStatus | string;
}

export type ISurveyListResponse = ApiResponse<ISurveyItem[]>;
export type ISurveyDetailsResponse = ApiResponse<ISurveyItem>;
export type ISurveyMutationResponse = ApiResponse<ISurveyItem>;
