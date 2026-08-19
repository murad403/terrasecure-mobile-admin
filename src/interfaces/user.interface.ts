import { Media } from './media.interface';

export type User = {
  id: number;
  slug: string | null;
  email: string | null;
  phone: string | null;
  name: string | null;
  gender: string | null;
  dob: Date | null;
  emergencyPhone: string | null;
  publicPhone: string | null;
  publicEmail: string | null;
  profilePictureId: string | null;
  status: string;
  nationalIdNumber: string | null;
  passportNumber: string | null;
  isEmailVerified: boolean;
  isPhoneVerified: boolean;
  isFaceVerified: boolean;
  isNationalIdVerified: boolean;
  isPassportVerified: boolean;
  isOnline: boolean;
  lastOnlineAt: Date;
  rating: string | null;
  ratingCount: number;
  bio: string | null;
  createdAt: Date | null;
  updatedAt: Date | null;
  roles: string[] | null;
  profilePicture: Media | null;
};

export type UserMinimal = Pick<
  User,
  'id' | 'name' | 'phone' | 'profilePicture'
>;
