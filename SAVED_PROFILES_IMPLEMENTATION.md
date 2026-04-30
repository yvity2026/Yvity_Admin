# Saved Advisor Profiles Feature - Complete Implementation Guide

## Overview

This feature allows authenticated users to save advisor profiles for quick access later. The implementation includes a complete backend API, custom React hooks, and an updated UI component that handles all save/unsave operations with pagination support.

## Architecture

### Database Schema
```sql
CREATE TABLE public.saved_profiles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  advisor_profile_id uuid NOT NULL REFERENCES public.advisor_profiles(id) ON DELETE CASCADE,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (user_id, advisor_profile_id)
);
```

### Project Structure
```
src/
├── app/api/advisor/saved-profiles/
│   ├── route.js                          # POST/GET endpoints
│   ├── [advisorProfileId]/
│   │   └── route.js                      # DELETE endpoint
│   └── check/[advisorProfileId]/
│       └── route.js                      # GET check status endpoint
├── lib/advisor/saved-profiles/
│   ├── savedProfilesService.js           # Business logic
│   └── API_DOCUMENTATION.js              # API reference
├── hooks/
│   └── useSavedProfiles.js               # Custom React hooks
└── components/ui/
    └── FloatingSaveButton.jsx            # Updated UI component
```

## API Endpoints

### 1. Save Profile
**POST** `/api/advisor/saved-profiles`
- Saves an advisor profile for the authenticated user
- Returns 201 (new save) or 200 (already saved)
- Request: `{ advisorProfileId: string }`

### 2. Get Saved Profiles
**GET** `/api/advisor/saved-profiles?page=1&limit=10`
- Fetches paginated list of saved profiles
- Includes full advisor profile and user details
- Pagination info included in response

### 3. Remove Saved Profile
**DELETE** `/api/advisor/saved-profiles/{advisorProfileId}`
- Removes a saved profile for the user
- Returns the removed profile data

### 4. Check Save Status
**GET** `/api/advisor/saved-profiles/check/{advisorProfileId}`
- Checks if a profile is already saved
- Returns boolean status and save ID if applicable

## Custom Hooks

### useSavedProfiles()
Manages individual profile save operations.

```javascript
const {
  isSaved,                          // Current save status
  isLoading,                        // Operation in progress
  error,                            // Error message if any
  saveProfile,                      // Save a profile
  removeProfile,                    // Remove a saved profile
  checkSaveStatus,                  // Check if saved
  toggleSaveProfile,                // Toggle save/unsave
  setIsSaved                        // Manual state control
} = useSavedProfiles();
```

**Usage:**
```javascript
const { isSaved, isLoading, toggleSaveProfile } = useSavedProfiles();

const handleClick = async () => {
  const result = await toggleSaveProfile(advisorId);
  if (result.success) {
    console.log('Success!');
  }
};
```

### useFetchSavedProfiles()
Fetches and manages paginated saved profiles.

```javascript
const {
  profiles,                         // Array of saved profiles
  pagination,                       // Pagination metadata
  isLoading,                        // Fetch in progress
  error,                            // Error message
  fetchProfiles,                    // Fetch specific page
  goToPage,                         // Go to page
  nextPage,                         // Go to next page
  previousPage,                     // Go to previous page
  refetch                           // Refetch current page
} = useFetchSavedProfiles();
```

**Pagination Object:**
```javascript
{
  currentPage: number,
  pageSize: number,
  totalCount: number,
  totalPages: number,
  hasNextPage: boolean,
  hasPreviousPage: boolean
}
```

## FloatingSaveButton Component

The existing FloatingSaveButton component has been updated to use the new API.

**Props:**
- `profileId` (required): UUID of advisor profile
- `profileName` (optional): Name for display
- `profileImage` (optional): Avatar URL
- `initialSaved` (optional): Initial save state
- `onSaveComplete` (optional): Callback when saved
- `onRemoveComplete` (optional): Callback when removed
- `className` (optional): Additional CSS classes
- `initialPosition` (optional): Starting drag position

**Usage:**
```javascript
<FloatingSaveButton
  profileId={profile.id}
  profileName={profile.name}
  profileImage={profile.avatar}
  initialSaved={profile.isAlreadySaved}
  onSaveComplete={(data) => console.log('Saved!', data)}
  onRemoveComplete={(data) => console.log('Removed!', data)}
/>
```

## Features

### ✅ Features Included

1. **Save/Unsave Profiles**
   - Single-click save/unsave functionality
   - Duplicate prevention at database level

2. **Pagination**
   - Configurable page size (1-50 items)
   - Next/Previous navigation
   - Go to specific page
   - Total count and page info

3. **Status Checking**
   - Check if profile is saved
   - Batch check for multiple profiles
   - Real-time status updates

4. **Data Enrichment**
   - Includes full advisor profile details
   - User information included
   - Public visibility settings
   - Subscription plan info

5. **Error Handling**
   - Comprehensive error messages
   - Proper HTTP status codes
   - Validation at every step

6. **Performance**
   - Indexed database queries
   - Optimized eager loading
   - Flatten response structure for frontend

7. **Security**
   - User authentication required
   - User-scoped queries (can only access own saves)
   - SQL injection prevention via Supabase
   - Proper authorization checks

## Response Data Structure

### Saved Profile Item
```javascript
{
  savedProfileId: "uuid",
  savedAt: "2026-04-30T10:00:00Z",
  advisorProfile: {
    id: "uuid",
    userId: "uuid",
    shortBio: "string",
    isVerified: boolean,
    subscriptionPlan: "free|silver|gold",
    profileSlug: "string",
    publicSettings: {
      services: boolean,
      achievements: boolean,
      gallery: boolean,
      testimonials: boolean,
      professional: boolean
    },
    user: {
      id: "uuid",
      name: "string",
      email: "string",
      phone: "string",
      city: "string",
      profession: "string",
      avatar: "URL",
      bio: "string",
      memberSince: "ISO 8601"
    }
  }
}
```

## Integration Examples

### Example 1: Saved Profiles Dashboard Page
```javascript
'use client';

import { useEffect } from 'react';
import { useFetchSavedProfiles } from '@/hooks/useSavedProfiles';

export default function SavedProfilesPage() {
  const {
    profiles,
    pagination,
    isLoading,
    error,
    fetchProfiles,
    nextPage,
    previousPage,
    goToPage
  } = useFetchSavedProfiles();

  useEffect(() => {
    fetchProfiles(1, 10);
  }, []);

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;
  if (profiles.length === 0) return <div>No saved profiles</div>;

  return (
    <div>
      <h1>Saved Profiles ({pagination.totalCount})</h1>
      
      <div className="grid grid-cols-3 gap-4">
        {profiles.map(item => (
          <div key={item.savedProfileId}>
            <img src={item.advisorProfile.user.avatar} />
            <h2>{item.advisorProfile.user.name}</h2>
            <p>{item.advisorProfile.user.profession}</p>
          </div>
        ))}
      </div>

      <div>
        <button onClick={() => previousPage()} 
          disabled={!pagination.hasPreviousPage}>
          Previous
        </button>
        <span>Page {pagination.currentPage} of {pagination.totalPages}</span>
        <button onClick={() => nextPage()} 
          disabled={!pagination.hasNextPage}>
          Next
        </button>
      </div>
    </div>
  );
}
```

### Example 2: Profile Card with Save Button
```javascript
import { useSavedProfiles } from '@/hooks/useSavedProfiles';
import { useEffect, useState } from 'react';

function ProfileCard({ profile }) {
  const { isSaved, isLoading, checkSaveStatus, toggleSaveProfile } = 
    useSavedProfiles();

  useEffect(() => {
    checkSaveStatus(profile.id);
  }, [profile.id]);

  return (
    <div className="border rounded-lg p-4">
      <img src={profile.avatar} alt={profile.name} />
      <h2>{profile.name}</h2>
      
      <button 
        onClick={() => toggleSaveProfile(profile.id)}
        disabled={isLoading}
      >
        {isLoading ? 'Loading...' : isSaved ? 'Unsave' : 'Save'}
      </button>
    </div>
  );
}
```

## Error Handling

All endpoints return consistent error responses:

```javascript
{
  success: false,
  statusCode: number,
  error: "Error message"
}
```

**Common Status Codes:**
- 200: Success (GET, DELETE)
- 201: Created (POST new save)
- 400: Bad request (missing parameters)
- 401: Unauthorized (not logged in)
- 500: Server error

## Best Practices

1. **Always check authentication** before attempting save operations
2. **Use pagination limits** between 1-50 items for optimal performance
3. **Cache save status** in component state to reduce API calls
4. **Handle errors gracefully** and show user-friendly messages
5. **Use loading states** while operations are in progress
6. **Debounce rapid clicks** to prevent duplicate requests
7. **Refetch data** after successful save/remove operations

## Performance Considerations

- Database has unique constraint on (user_id, advisor_profile_id)
- Queries are indexed for fast lookups
- Response structure is flattened for minimal data transfer
- Pagination limits prevent large dataset transfers
- Eager loading of related data reduces N+1 queries

## Security Considerations

- All endpoints require authentication via `ValidateUser()`
- User can only access their own saved profiles
- SQL injection prevention via Supabase parameterized queries
- CSRF protection via Next.js built-in mechanism
- Proper HTTP method semantics (GET for reads, POST for creates, DELETE for removes)

## Testing Endpoints

### Using cURL

```bash
# Save a profile
curl -X POST http://localhost:3000/api/advisor/saved-profiles \
  -H "Content-Type: application/json" \
  -d '{"advisorProfileId":"your-uuid-here"}' \
  -b "session=your-session-token"

# Get saved profiles
curl http://localhost:3000/api/advisor/saved-profiles?page=1&limit=10 \
  -b "session=your-session-token"

# Check if saved
curl http://localhost:3000/api/advisor/saved-profiles/check/your-uuid-here \
  -b "session=your-session-token"

# Remove a profile
curl -X DELETE http://localhost:3000/api/advisor/saved-profiles/your-uuid-here \
  -H "Content-Type: application/json" \
  -b "session=your-session-token"
```

### Using JavaScript

```javascript
// Save profile
const saveResult = await fetch('/api/advisor/saved-profiles', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ advisorProfileId: 'your-uuid' })
});

// Get saved profiles
const getResult = await fetch('/api/advisor/saved-profiles?page=1&limit=10');

// Check save status
const checkResult = await fetch('/api/advisor/saved-profiles/check/your-uuid');

// Remove profile
const deleteResult = await fetch('/api/advisor/saved-profiles/your-uuid', {
  method: 'DELETE'
});
```

## Troubleshooting

### Issue: "Unauthorized" errors
**Solution:** Ensure user is logged in. Check session cookie is being sent with requests.

### Issue: Empty saved profiles list
**Solution:** Check if profiles are actually saved. Use check endpoint to verify status.

### Issue: Pagination not working
**Solution:** Ensure `page` and `limit` parameters are valid numbers (page >= 1, limit 1-50).

### Issue: Profile not saving despite button click
**Solution:** Check browser console for errors. Verify `advisorProfileId` is a valid UUID.

## Future Enhancements

- [ ] Add sorting options (by saved date, name, etc.)
- [ ] Add filtering options (by city, profession, etc.)
- [ ] Export saved profiles to CSV/PDF
- [ ] Share saved profiles with others
- [ ] Create collections/folders for organizing saved profiles
- [ ] Bulk operations (save/remove multiple profiles)
- [ ] Save history/timeline view

## Support

For issues or questions:
1. Check the API_DOCUMENTATION.js file for detailed examples
2. Review error messages and status codes
3. Check browser console for additional error details
4. Verify database table exists and has correct schema
5. Ensure environment variables are properly configured

## Files Modified/Created

### New Files:
- `src/app/api/advisor/saved-profiles/route.js` - Main API endpoint
- `src/app/api/advisor/saved-profiles/[advisorProfileId]/route.js` - DELETE endpoint
- `src/app/api/advisor/saved-profiles/check/[advisorProfileId]/route.js` - Check endpoint
- `src/lib/advisor/saved-profiles/savedProfilesService.js` - Business logic
- `src/lib/advisor/saved-profiles/API_DOCUMENTATION.js` - API reference
- `src/hooks/useSavedProfiles.js` - Custom React hooks

### Modified Files:
- `src/components/ui/FloatingSaveButton.jsx` - Updated to use new API

All implementations follow production-level code standards with comprehensive error handling, proper typing, and clean architecture.
