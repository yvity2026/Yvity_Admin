// // API Documentation and Integration Guide
// // For Saved Advisor Profiles Feature

// // =============================================================================
// // API ENDPOINTS
// // =============================================================================

// /**
//  * 1. SAVE AN ADVISOR PROFILE
//  * ──────────────────────────────────────────────────────────────────────────
//  * 
//  * POST /api/advisor/saved-profiles
//  * 
//  * Description: Save an advisor profile for the authenticated user
//  * 
//  * Authentication: Required (user must be logged in)
//  * 
//  * Request Body:
//  * {
//  *   "advisorProfileId": "uuid"  // Required: The advisor profile ID to save
//  * }
//  * 
//  * Response (Success - 201 or 200):
//  * {
//  *   "success": true,
//  *   "statusCode": 201,
//  *   "data": {
//  *     "id": "uuid",
//  *     "user_id": "uuid",
//  *     "advisor_profile_id": "uuid",
//  *     "created_at": "ISO 8601 timestamp"
//  *   },
//  *   "message": "Profile saved successfully",
//  *   "isNew": true  // false if profile was already saved
//  * }
//  * 
//  * Response (Error - 400):
//  * {
//  *   "success": false,
//  *   "statusCode": 400,
//  *   "error": "Advisor Profile ID is required"
//  * }
//  * 
//  * Response (Error - 401):
//  * {
//  *   "success": false,
//  *   "statusCode": 401,
//  *   "error": "Unauthorized. Please login."
//  * }
//  * 
//  * Usage Example:
//  * ──────────────
//  * const response = await fetch('/api/advisor/saved-profiles', {
//  *   method: 'POST',
//  *   headers: { 'Content-Type': 'application/json' },
//  *   body: JSON.stringify({ advisorProfileId: 'some-uuid' })
//  * });
//  * 
//  * const data = await response.json();
//  */

// /**
//  * 2. GET SAVED PROFILES WITH PAGINATION
//  * ──────────────────────────────────────────────────────────────────────────
//  * 
//  * GET /api/advisor/saved-profiles?page=1&limit=10
//  * 
//  * Description: Fetch all saved advisor profiles for the authenticated user
//  * 
//  * Authentication: Required
//  * 
//  * Query Parameters:
//  * - page (optional): Page number, default 1, must be >= 1
//  * - limit (optional): Items per page, default 10, max 50
//  * 
//  * Response (Success - 200):
//  * {
//  *   "success": true,
//  *   "statusCode": 200,
//  *   "data": [
//  *     {
//  *       "savedProfileId": "uuid",
//  *       "savedAt": "ISO 8601 timestamp",
//  *       "advisorProfile": {
//  *         "id": "uuid",
//  *         "userId": "uuid",
//  *         "shortBio": "string",
//  *         "isVerified": boolean,
//  *         "subscriptionPlan": "free|silver|gold",
//  *         "profileSlug": "string",
//  *         "publicSettings": {
//  *           "services": boolean,
//  *           "achievements": boolean,
//  *           "gallery": boolean,
//  *           "testimonials": boolean,
//  *           "professional": boolean
//  *         },
//  *         "user": {
//  *           "id": "uuid",
//  *           "name": "string",
//  *           "email": "string",
//  *           "phone": "string",
//  *           "city": "string",
//  *           "profession": "string",
//  *           "avatar": "URL",
//  *           "bio": "string",
//  *           "memberSince": "ISO 8601 timestamp"
//  *         }
//  *       }
//  *     }
//  *   ],
//  *   "pagination": {
//  *     "currentPage": 1,
//  *     "pageSize": 10,
//  *     "totalCount": 25,
//  *     "totalPages": 3,
//  *     "hasNextPage": true,
//  *     "hasPreviousPage": false
//  *   },
//  *   "message": "Saved profiles fetched successfully"
//  * }
//  * 
//  * Response (Error - 401):
//  * {
//  *   "success": false,
//  *   "statusCode": 401,
//  *   "error": "Unauthorized. Please login."
//  * }
//  * 
//  * Usage Example:
//  * ──────────────
//  * // Get first page
//  * const response = await fetch('/api/advisor/saved-profiles?page=1&limit=10');
//  * const { data, pagination } = await response.json();
//  * 
//  * // Get next page
//  * const nextResponse = await fetch(`/api/advisor/saved-profiles?page=2&limit=10`);
//  */

// /**
//  * 3. REMOVE A SAVED PROFILE
//  * ──────────────────────────────────────────────────────────────────────────
//  * 
//  * DELETE /api/advisor/saved-profiles/{advisorProfileId}
//  * 
//  * Description: Remove a saved advisor profile for the authenticated user
//  * 
//  * Authentication: Required
//  * 
//  * URL Parameters:
//  * - advisorProfileId: The advisor profile ID to remove
//  * 
//  * Response (Success - 200):
//  * {
//  *   "success": true,
//  *   "statusCode": 200,
//  *   "data": {
//  *     "id": "uuid",
//  *     "user_id": "uuid",
//  *     "advisor_profile_id": "uuid",
//  *     "created_at": "ISO 8601 timestamp"
//  *   },
//  *   "message": "Profile removed successfully"
//  * }
//  * 
//  * Response (Error - 401):
//  * {
//  *   "success": false,
//  *   "statusCode": 401,
//  *   "error": "Unauthorized. Please login."
//  * }
//  * 
//  * Usage Example:
//  * ──────────────
//  * const response = await fetch('/api/advisor/saved-profiles/{advisorProfileId}', {
//  *   method: 'DELETE',
//  *   headers: { 'Content-Type': 'application/json' }
//  * });
//  * 
//  * const data = await response.json();
//  */

// /**
//  * 4. CHECK IF PROFILE IS SAVED
//  * ──────────────────────────────────────────────────────────────────────────
//  * 
//  * GET /api/advisor/saved-profiles/check/{advisorProfileId}
//  * 
//  * Description: Check if an advisor profile is already saved by the user
//  * 
//  * Authentication: Required
//  * 
//  * URL Parameters:
//  * - advisorProfileId: The advisor profile ID to check
//  * 
//  * Response (Success - 200):
//  * {
//  *   "success": true,
//  *   "statusCode": 200,
//  *   "data": {
//  *     "isSaved": boolean,
//  *     "savedProfileId": "uuid or null",
//  *     "advisorProfileId": "uuid"
//  *   },
//  *   "message": "Profile is saved" or "Profile is not saved"
//  * }
//  * 
//  * Response (Error - 401):
//  * {
//  *   "success": false,
//  *   "statusCode": 401,
//  *   "error": "Unauthorized. Please login."
//  * }
//  * 
//  * Usage Example:
//  * ──────────────
//  * const response = await fetch('/api/advisor/saved-profiles/check/{advisorProfileId}');
//  * const { data } = await response.json();
//  * console.log(data.isSaved); // true or false
//  */

// // =============================================================================
// // CUSTOM HOOKS
// // =============================================================================

// /**
//  * useS avedProfiles() Hook
//  * ──────────────────────────────────────────────────────────────────────────
//  * 
//  * Custom React hook for managing individual profile save operations
//  * 
//  * Returns:
//  * {
//  *   isSaved: boolean,                    // Whether profile is currently saved
//  *   isLoading: boolean,                  // Whether operation is in progress
//  *   error: string | null,                // Error message if any
//  *   saveProfile: (advisorProfileId) => Promise,  // Save a profile
//  *   removeProfile: (advisorProfileId) => Promise, // Remove a saved profile
//  *   checkSaveStatus: (advisorProfileId) => Promise, // Check if saved
//  *   toggleSaveProfile: (advisorProfileId) => Promise, // Toggle save/unsave
//  *   setIsSaved: (boolean) => void        // Manual control of save state
//  * }
//  * 
//  * Usage Example:
//  * ──────────────
//  * 
//  * import { useSavedProfiles } from '@/hooks/useSavedProfiles';
//  * 
//  * function MyComponent({ advisorProfileId }) {
//  *   const { isSaved, isLoading, toggleSaveProfile, checkSaveStatus } = useSavedProfiles();
//  *   
//  *   useEffect(() => {
//  *     checkSaveStatus(advisorProfileId);
//  *   }, [advisorProfileId]);
//  *   
//  *   const handleClick = async () => {
//  *     const result = await toggleSaveProfile(advisorProfileId);
//  *     if (result.success) {
//  *       console.log('Profile toggled successfully');
//  *     }
//  *   };
//  *   
//  *   return (
//  *     <button onClick={handleClick} disabled={isLoading}>
//  *       {isSaved ? 'Unsave' : 'Save'} Profile
//  *     </button>
//  *   );
//  * }
//  */

// /**
//  * useFetchSavedProfiles() Hook
//  * ──────────────────────────────────────────────────────────────────────────
//  * 
//  * Custom React hook for fetching and paginating saved profiles
//  * 
//  * Returns:
//  * {
//  *   profiles: Array,               // Array of saved profiles
//  *   pagination: Object,            // Pagination metadata
//  *   isLoading: boolean,            // Whether fetch is in progress
//  *   error: string | null,          // Error message if any
//  *   fetchProfiles: (page, limit) => Promise,  // Fetch profiles
//  *   goToPage: (page, limit) => Promise,       // Go to specific page
//  *   nextPage: () => Promise,       // Go to next page
//  *   previousPage: () => Promise,   // Go to previous page
//  *   refetch: (page, limit) => Promise  // Refetch current page
//  * }
//  * 
//  * Usage Example:
//  * ──────────────
//  * 
//  * import { useFetchSavedProfiles } from '@/hooks/useSavedProfiles';
//  * 
//  * function SavedProfilesList() {
//  *   const {
//  *     profiles,
//  *     pagination,
//  *     isLoading,
//  *     nextPage,
//  *     previousPage,
//  *     goToPage
//  *   } = useFetchSavedProfiles();
//  *   
//  *   useEffect(() => {
//  *     // Fetch initial page
//  *     fetchProfiles(1, 10);
//  *   }, []);
//  *   
//  *   if (isLoading) return <div>Loading...</div>;
//  *   
//  *   return (
//  *     <>
//  *       {profiles.map(item => (
//  *         <ProfileCard key={item.savedProfileId} profile={item.advisorProfile} />
//  *       ))}
//  *       
//  *       <div>
//  *         <button onClick={() => previousPage()} disabled={!pagination.hasPreviousPage}>
//  *           Previous
//  *         </button>
//  *         <span>Page {pagination.currentPage} of {pagination.totalPages}</span>
//  *         <button onClick={() => nextPage()} disabled={!pagination.hasNextPage}>
//  *           Next
//  *         </button>
//  *       </div>
//  *     </>
//  *   );
//  * }
//  */

// // =============================================================================
// // IMPLEMENTATION EXAMPLES
// // =============================================================================

// /**
//  * Example 1: Using FloatingSaveButton Component
//  * ──────────────────────────────────────────────────────────────────────────
//  * 
//  * import FloatingSaveButton from '@/components/ui/FloatingSaveButton';
//  * 
//  * export default function ProfilePage() {
//  *   const profile = useProfile();
//  *   
//  *   const handleSaveComplete = (data) => {
//  *     console.log('Profile saved:', data);
//  *     // Update UI or show success message
//  *   };
//  *   
//  *   const handleRemoveComplete = (data) => {
//  *     console.log('Profile removed:', data);
//  *     // Update UI or show success message
//  *   };
//  *   
//  *   return (
//  *     <>
//  *       <FloatingSaveButton
//  *         profileId={profile.id}
//  *         profileName={profile.name}
//  *         profileImage={profile.avatar}
//  *         initialSaved={profile.isAlreadySaved}
//  *         onSaveComplete={handleSaveComplete}
//  *         onRemoveComplete={handleRemoveComplete}
// //  *       />
// //  *       {/* Rest of page content */}
// //  *     </>
// //  *   );
// //  * }
// //  */

// /**
//  * Example 2: Building a Saved Profiles Page
//  * ──────────────────────────────────────────────────────────────────────────
//  * 
//  * 'use client';
//  * 
//  * import { useEffect, useState } from 'react';
//  * import { useFetchSavedProfiles } from '@/hooks/useSavedProfiles';
//  * 
//  * export default function SavedProfilesPage() {
//  *   const {
//  *     profiles,
//  *     pagination,
//  *     isLoading,
//  *     error,
//  *     fetchProfiles,
//  *     nextPage,
//  *     previousPage,
//  *     goToPage
//  *   } = useFetchSavedProfiles();
//  *   
//  *   useEffect(() => {
//  *     fetchProfiles(1, 10);
//  *   }, []);
//  *   
//  *   if (isLoading) {
//  *     return <div className="p-4">Loading saved profiles...</div>;
//  *   }
//  *   
//  *   if (error) {
//  *     return <div className="p-4 text-red-500">Error: {error}</div>;
//  *   }
//  *   
//  *   if (profiles.length === 0) {
//  *     return <div className="p-4">No saved profiles yet</div>;
//  *   }
//  *   
//  *   return (
//  *     <div className="p-6">
//  *       <h1 className="text-2xl font-bold mb-6">Saved Profiles</h1>
//  *       
//  *       {/* Profiles Grid */}
//  *       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
//  *         {profiles.map(item => (
//  *           <div key={item.savedProfileId} className="border rounded-lg p-4">
//  *             <img
//  *               src={item.advisorProfile.user.avatar}
//  *               alt={item.advisorProfile.user.name}
//  *               className="w-full h-40 object-cover rounded mb-2"
//  *             />
//  *             <h2 className="text-lg font-semibold">
//  *               {item.advisorProfile.user.name}
//  *             </h2>
//  *             <p className="text-sm text-gray-600">
//  *               {item.advisorProfile.user.profession}
//  *             </p>
//  *             <p className="text-xs text-gray-400 mt-2">
//  *               Saved {new Date(item.savedAt).toLocaleDateString()}
//  *             </p>
//  *           </div>
//  *         ))}
//  *       </div>
//  *       
//  *       {/* Pagination Controls */}
//  *       <div className="flex justify-center items-center gap-4">
//  *         <button
//  *           onClick={() => previousPage()}
//  *           disabled={!pagination.hasPreviousPage}
//  *           className="px-4 py-2 bg-gray-200 rounded disabled:opacity-50"
//  *         >
//  *           Previous
//  *         </button>
//  *         
//  *         <div className="flex gap-2">
//  *           {Array.from({ length: pagination.totalPages }, (_, i) => i + 1).map(page => (
//  *             <button
//  *               key={page}
//  *               onClick={() => goToPage(page)}
//  *               className={`px-3 py-1 rounded ${
//  *                 page === pagination.currentPage
//  *                   ? 'bg-blue-500 text-white'
//  *                   : 'bg-gray-200'
//  *               }`}
//  *             >
//  *               {page}
//  *             </button>
//  *           ))}
//  *         </div>
//  *         
//  *         <button
//  *           onClick={() => nextPage()}
//  *           disabled={!pagination.hasNextPage}
//  *           className="px-4 py-2 bg-gray-200 rounded disabled:opacity-50"
//  *         >
//  *           Next
//  *         </button>
//  *       </div>
//  *       
//  *       {/* Page Info */}
//  *       <div className="text-center mt-4 text-sm text-gray-600">
//  *         Showing page {pagination.currentPage} of {pagination.totalPages}
//  *         ({pagination.totalCount} total profiles)
//  *       </div>
//  *     </div>
//  *   );
//  * }
//  */

// /**
//  * Example 3: Integration with Profile Card Component
//  * ──────────────────────────────────────────────────────────────────────────
//  * 
//  * import { useSavedProfiles } from '@/hooks/useSavedProfiles';
//  * import { useState, useEffect } from 'react';
//  * 
//  * function ProfileCard({ profile }) {
//  *   const { isSaved, isLoading, checkSaveStatus, toggleSaveProfile } = useSavedProfiles();
//  *   const [showSaveIndicator, setShowSaveIndicator] = useState(false);
//  *   
//  *   useEffect(() => {
//  *     // Check if this profile is already saved
//  *     checkSaveStatus(profile.id);
//  *   }, [profile.id]);
//  *   
//  *   const handleSaveClick = async () => {
//  *     const result = await toggleSaveProfile(profile.id);
//  *     if (result.success) {
//  *       setShowSaveIndicator(true);
//  *       setTimeout(() => setShowSaveIndicator(false), 2000);
//  *     }
//  *   };
//  *   
//  *   return (
//  *     <div className="border rounded-lg overflow-hidden hover:shadow-lg transition">
//  *       <img src={profile.user.avatar} alt={profile.user.name} className="w-full h-48 object-cover" />
//  *       
//  *       <div className="p-4">
//  *         <div className="flex justify-between items-start">
//  *           <div>
//  *             <h3 className="font-semibold">{profile.user.name}</h3>
//  *             <p className="text-sm text-gray-600">{profile.user.profession}</p>
//  *           </div>
//  *           
//  *           <button
//  *             onClick={handleSaveClick}
//  *             disabled={isLoading}
//  *             className={`text-xl transition ${
//  *               isSaved ? 'text-red-500' : 'text-gray-300'
//  *             }`}
//  *           >
//  *             {isLoading ? '...' : isSaved ? '❤️' : '🤍'}
//  *           </button>
//  *         </div>
//  *         
//  *         {showSaveIndicator && (
//  *           <p className="text-xs text-green-600 mt-2">
//  *             {isSaved ? 'Added to saved' : 'Removed from saved'}
//  *           </p>
//  *         )}
//  *       </div>
//  *     </div>
//  *   );
//  * }
//  */

// // =============================================================================
// // ERROR HANDLING GUIDE
// // =============================================================================

// /**
//  * Common Errors and Solutions:
//  * 
//  * 401 Unauthorized:
//  * - User is not logged in
//  * - Session has expired
//  * - Solution: Redirect to login page or refresh session
//  * 
//  * 400 Bad Request:
//  * - Missing required parameters
//  * - Invalid UUID format
//  * - Solution: Validate inputs before making request
//  * 
//  * 500 Internal Server Error:
//  * - Server error while processing request
//  * - Database error
//  * - Solution: Retry operation or contact support
//  * 
//  * Network Error:
//  * - No internet connection
//  * - Server is down
//  * - Solution: Show offline message and retry
//  */

// /**
//  * Example Error Handling:
//  * 
//  * async function saveProfileWithErrorHandling(advisorProfileId) {
//  *   try {
//  *     const response = await fetch('/api/advisor/saved-profiles', {
//  *       method: 'POST',
//  *       headers: { 'Content-Type': 'application/json' },
//  *       body: JSON.stringify({ advisorProfileId })
//  *     });
//  *     
//  *     const data = await response.json();
//  *     
//  *     if (!response.ok) {
//  *       if (response.status === 401) {
//  *         // Handle unauthorized - redirect to login
//  *         window.location.href = '/auth/login';
//  *         return;
//  *       }
//  *       
//  *       throw new Error(data.error || 'Failed to save profile');
//  *     }
//  *     
//  *     return data;
//  *   } catch (error) {
//  *     if (error instanceof TypeError) {
//  *       console.error('Network error:', error);
//  *     } else {
//  *       console.error('Request error:', error.message);
//  *     }
//  *     
//  *     throw error;
//  *   }
//  * }
//  */
