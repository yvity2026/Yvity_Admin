/**
 * Type Definitions for Saved Profiles Feature
 * Useful for TypeScript projects and IDE autocomplete
 */

// =============================================================================
// API REQUEST TYPES
// =============================================================================

export type SaveProfileRequest = {
  advisorProfileId: string;
};

export type GetSavedProfilesQuery = {
  page?: number;
  limit?: number;
};

export type CheckSaveStatusParams = {
  advisorProfileId: string;
};

// =============================================================================
// API RESPONSE TYPES
// =============================================================================

export type BaseApiResponse<T = any> = {
  success: boolean;
  statusCode: number;
  data?: T;
  error?: string;
  message?: string;
};

export type SaveProfileResponse = BaseApiResponse<SavedProfileRecord>;

export type GetSavedProfilesResponse = BaseApiResponse<SavedProfile[]> & {
  pagination?: PaginationInfo;
};

export type CheckSaveStatusResponse = BaseApiResponse<{
  isSaved: boolean;
  savedProfileId: string | null;
  advisorProfileId: string;
}>;

// =============================================================================
// DATABASE TYPES
// =============================================================================

export type SavedProfileRecord = {
  id: string;
  user_id: string;
  advisor_profile_id: string;
  created_at: string;
};

// =============================================================================
// DOMAIN TYPES
// =============================================================================

export type UserDetails = {
  id: string;
  name: string;
  email: string;
  phone?: string;
  city?: string;
  profession?: string;
  avatar?: string;
  bio?: string;
  memberSince: string;
};

export type AdvisorPublicSettings = {
  services: boolean;
  achievements: boolean;
  gallery: boolean;
  testimonials: boolean;
  professional: boolean;
};

export type AdvisorProfileDetails = {
  id: string;
  userId: string;
  shortBio?: string;
  isVerified: boolean;
  subscriptionPlan: 'free' | 'silver' | 'gold';
  profileSlug?: string;
  publicSettings: AdvisorPublicSettings;
  user: UserDetails;
};

export type SavedProfile = {
  savedProfileId: string;
  savedAt: string;
  advisorProfile: AdvisorProfileDetails;
};

export type PaginationInfo = {
  currentPage: number;
  pageSize: number;
  totalCount: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
};

// =============================================================================
// HOOK RETURN TYPES
// =============================================================================

export type UseSavedProfilesReturn = {
  isSaved: boolean;
  isLoading: boolean;
  error: string | null;
  saveProfile: (advisorProfileId: string) => Promise<{
    success: boolean;
    data?: SavedProfileRecord;
    error?: string;
    message?: string;
  }>;
  removeProfile: (advisorProfileId: string) => Promise<{
    success: boolean;
    data?: SavedProfileRecord;
    error?: string;
    message?: string;
  }>;
  checkSaveStatus: (advisorProfileId: string) => Promise<{
    isSaved: boolean;
    error: string | null;
  }>;
  toggleSaveProfile: (advisorProfileId: string) => Promise<{
    success: boolean;
    data?: SavedProfileRecord;
    error?: string;
    message?: string;
  }>;
  setIsSaved: (saved: boolean) => void;
};

export type UseFetchSavedProfilesReturn = {
  profiles: SavedProfile[];
  pagination: PaginationInfo | null;
  isLoading: boolean;
  error: string | null;
  fetchProfiles: (page?: number, limit?: number) => Promise<{
    success: boolean;
    data?: SavedProfile[];
    pagination?: PaginationInfo;
    error?: string;
  }>;
  goToPage: (page: number, limit?: number) => Promise<{
    success: boolean;
    data?: SavedProfile[];
    pagination?: PaginationInfo;
    error?: string;
  }>;
  nextPage: () => Promise<{
    success: boolean;
    data?: SavedProfile[];
    pagination?: PaginationInfo;
    error?: string;
  } | undefined>;
  previousPage: () => Promise<{
    success: boolean;
    data?: SavedProfile[];
    pagination?: PaginationInfo;
    error?: string;
  } | undefined>;
  refetch: (page?: number, limit?: number) => Promise<{
    success: boolean;
    data?: SavedProfile[];
    pagination?: PaginationInfo;
    error?: string;
  }>;
};

// =============================================================================
// COMPONENT TYPES
// =============================================================================

export type FloatingSaveButtonProps = {
  profileId: string;
  profileName?: string;
  profileImage?: string;
  initialSaved?: boolean;
  onSaveComplete?: (data: { profileId: string; profileName?: string; profileImage?: string }) => void;
  onRemoveComplete?: (data: { profileId: string }) => void;
  className?: string;
  initialPosition?: { x: number; y: number };
};

// =============================================================================
// ERROR TYPES
// =============================================================================

export type ApiError = {
  statusCode: number;
  message: string;
  error?: any;
};

export class SavedProfilesError extends Error {
  statusCode: number;

  constructor(message: string, statusCode: number = 500) {
    super(message);
    this.statusCode = statusCode;
    this.name = 'SavedProfilesError';
  }
}

// =============================================================================
// SERVICE FUNCTION TYPES
// =============================================================================

export type SaveAdvisorProfileFn = (
  supabase: any,
  userId: string,
  advisorProfileId: string
) => Promise<{
  data: SavedProfileRecord | null;
  error: string | null;
  message?: string;
  isNew?: boolean;
}>;

export type RemoveSavedProfileFn = (
  supabase: any,
  userId: string,
  advisorProfileId: string
) => Promise<{
  data: SavedProfileRecord | null;
  error: string | null;
  message?: string;
}>;

export type GetSavedProfilesFn = (
  supabase: any,
  userId: string,
  page?: number,
  limit?: number
) => Promise<{
  data: SavedProfile[] | null;
  pagination: PaginationInfo | null;
  error: string | null;
}>;

export type CheckIfProfileSavedFn = (
  supabase: any,
  userId: string,
  advisorProfileId: string
) => Promise<{
  isSaved: boolean;
  savedProfileId: string | null;
  error: string | null;
}>;

export type CheckMultipleProfilesSavedFn = (
  supabase: any,
  userId: string,
  advisorProfileIds: string[]
) => Promise<{
  savedProfiles: Record<string, string>;
  error: string | null;
}>;

// =============================================================================
// UTILITY TYPES
// =============================================================================

export type AsyncResult<T> = 
  | { success: true; data: T; error?: never }
  | { success: false; data?: never; error: string };

export type PaginationParams = {
  page: number;
  limit: number;
};

export type SortOptions = 'newest' | 'oldest' | 'name' | 'city';

export type FilterOptions = {
  city?: string;
  profession?: string;
  subscriptionPlan?: 'free' | 'silver' | 'gold';
  verified?: boolean;
};
