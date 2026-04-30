# Testimonials & Recommendations Integration Guide

## Overview

This document covers the complete integration of testimonials and recommendations functionality for the YVITY Dashboard.

**Key Points:**
- ✅ Testimonials support text, audio, and video
- ✅ S3 uploads only for audio/video (NOT for text)
- ✅ Recommendations don't use S3
- ✅ Secure backend validation on all endpoints
- ✅ OTP verification for user testimonials

## Architecture

### Database Tables

#### 1. `advisor_testimonials` (Testimonials)
```
id (uuid) - Primary key
advisor_id (uuid) - Advisor who owns the testimonial
user_id (uuid, nullable) - User who gave testimonial (if from registered user)
name (text) - Testimonial giver's name
mobile_number (text) - Testimonial giver's mobile
is_mobile_verified (boolean) - OTP verification status
testimonial_type (enum) - 'text', 'audio', or 'video'
content (text) - Testimonial text/transcript
media_url (text, nullable) - S3 URL for audio/video (NULL for text)
otp_code (text, nullable) - OTP for verification
otp_expires_at (timestamp) - OTP expiration time
is_verified (boolean) - Mobile verification status
status (text) - 'pending', 'approved', 'rejected'
testimonial_rating (numeric) - Rating 1-5
created_at (timestamp)
updated_at (timestamp)
```

#### 2. `advisor_recommendations` (Recommendations)
```
id (uuid) - Primary key
advisor_id (uuid) - Advisor who receives recommendations
user_id (uuid, nullable) - User who gave recommendation
recommendations (text[]) - Array of recommendation texts
mobile_number (text, nullable) - User's mobile (for public submissions)
is_mobile_verified (boolean) - Verification status
status (text) - 'active', 'inactive'
created_at (timestamp)
updated_at (timestamp)
```

## API Endpoints

### TESTIMONIALS - Advisor Endpoints

#### 1. GET /api/advisor/testimonials
Fetch all testimonials for authenticated advisor

**Query Parameters:**
- `type` (string, optional): Filter by type ('text', 'audio', 'video', or 'All')

**Response:**
```json
{
  "data": [
    {
      "id": "uuid",
      "advisor_id": "uuid",
      "user_id": "uuid or null",
      "name": "John Doe",
      "mobile_number": "9876543210",
      "testimonial_type": "text",
      "content": "Great advisor!",
      "media_url": null,
      "testimonial_rating": 5,
      "status": "approved",
      "is_verified": true,
      "user": {
        "id": "uuid",
        "name": "John Doe",
        "selfie_url": "url"
      }
    }
  ]
}
```

**Error Responses:**
- `401`: Unauthorized
- `500`: Server error

#### 2. POST /api/advisor/testimonials
Create a testimonial for the advisor

**Body:**
```json
{
  "testimonialType": "text",
  "content": "Great advisor!",
  "mediaUrl": null,
  "rating": 5
}
```

**Response:**
```json
{
  "data": {
    "id": "uuid",
    "advisor_id": "uuid",
    "testimonial_type": "text",
    "content": "Great advisor!",
    "status": "approved",
    "created_at": "2026-04-30T..."
  }
}
```

**Error Responses:**
- `400`: Missing/invalid fields
- `401`: Unauthorized
- `500`: Server error

### TESTIMONIALS - Public Endpoints

#### 3. GET /api/public/advisor/[advisorId]/testimonials
Fetch approved testimonials for a public advisor profile

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "advisor_id": "uuid",
      "name": "John Doe",
      "testimonial_type": "text",
      "content": "Great advisor!",
      "media_url": null,
      "testimonial_rating": 5,
      "status": "approved"
    }
  ]
}
```

#### 4. POST /api/public/advisor/[advisorId]/testimonials
Submit a testimonial as a user (no auth required)

**Body:**
```json
{
  "name": "John Doe",
  "mobileNumber": "9876543210",
  "testimonialType": "text",
  "content": "Excellent service!",
  "mediaUrl": null,
  "testimonialRating": 5
}
```

**For Audio/Video:**
```json
{
  "name": "John Doe",
  "mobileNumber": "9876543210",
  "testimonialType": "audio",
  "content": "[Transcription of audio]",
  "mediaUrl": "https://s3.../path/to/audio.mp3",
  "testimonialRating": 5
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "message": "Testimonial submitted. Please verify your mobile number.",
    "otp": "123456" // (development only)
  }
}
```

#### 5. POST /api/public/advisor/[advisorId]/testimonials/[testimonialId]/verify
Verify OTP and approve testimonial

**Body:**
```json
{
  "otpCode": "123456"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Testimonial verified and approved",
  "data": { ... }
}
```

### MEDIA UPLOAD - S3

#### 6. POST /api/upload/media
Upload audio/video file to S3 (required before submitting audio/video testimonials)

**Form Data:**
- `file` (File): Audio or video file
- `mediaType` (string): 'audio' or 'video'

**Supported Formats:**
- Audio: MP3, WAV, MP4, WebM (max 10MB)
- Video: MP4, WebM, MOV, AVI (max 50MB)

**Response:**
```json
{
  "success": true,
  "url": "https://s3.../path/to/file",
  "key": "testimonials/audios/1234567890-filename.mp3",
  "message": "File uploaded successfully"
}
```

**Error Responses:**
- `400`: Missing file, invalid mediaType, unsupported format
- `500`: Upload failed

### RECOMMENDATIONS - Advisor Endpoints

#### 7. GET /api/advisor/recommendations
Fetch all recommendations for authenticated advisor

**Response:**
```json
{
  "data": [
    {
      "id": "uuid",
      "advisor_id": "uuid",
      "recommendations": [
        "Very professional",
        "Excellent communication"
      ],
      "status": "active",
      "created_at": "2026-04-30T..."
    }
  ]
}
```

#### 8. POST /api/advisor/recommendations
Create recommendation for advisor

**Body:**
```json
{
  "recommendations": [
    "Professional and knowledgeable",
    "Great communication skills"
  ]
}
```

**Response:**
```json
{
  "data": {
    "id": "uuid",
    "advisor_id": "uuid",
    "recommendations": ["..."],
    "status": "active",
    "created_at": "2026-04-30T..."
  }
}
```

### RECOMMENDATIONS - Public Endpoints

#### 9. GET /api/public/advisor/[advisorId]/recommendations
Fetch public recommendations for an advisor

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "advisor_id": "uuid",
      "recommendations": ["Professional", "Excellent"],
      "status": "active"
    }
  ]
}
```

#### 10. POST /api/public/advisor/[advisorId]/recommendations
Submit recommendation as user (no auth required, no S3)

**Body:**
```json
{
  "recommendations": [
    "Very helpful advisor",
    "Great insights"
  ],
  "mobileNumber": "9876543210",
  "email": "user@example.com",
  "name": "John Doe"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "message": "Thank you for your recommendation!"
  }
}
```

## Frontend Implementation

### Using Hooks

#### Testimonial Hook
```jsx
import { useTestimonial } from "@/hooks/useTestimonial";

function TestimonialForm({ advisorId }) {
  const {
    loading,
    uploading,
    error,
    uploadMedia,
    submitTestimonial,
    submitPublicTestimonial,
  } = useTestimonial();

  const handleSubmit = async (formData) => {
    try {
      // For text testimonials
      if (formData.type === "text") {
        const result = await submitPublicTestimonial(advisorId, {
          name: formData.name,
          mobileNumber: formData.phone,
          testimonialType: "text",
          content: formData.content,
          testimonialRating: formData.rating,
        });
        console.log("Submitted:", result);
      }

      // For audio/video testimonials
      if (["audio", "video"].includes(formData.type)) {
        // Step 1: Upload media to S3
        const mediaUrl = await uploadMedia(
          formData.file,
          formData.type
        );

        // Step 2: Submit testimonial with media URL
        const result = await submitPublicTestimonial(advisorId, {
          name: formData.name,
          mobileNumber: formData.phone,
          testimonialType: formData.type,
          content: formData.transcript || "",
          mediaUrl, // URL from S3
          testimonialRating: formData.rating,
        });
        console.log("Submitted:", result);
      }
    } catch (err) {
      console.error("Error:", err.message);
    }
  };

  return (
    <form>
      {/* Form fields */}
      <button
        onClick={handleSubmit}
        disabled={loading || uploading}
      >
        {uploading ? "Uploading..." : loading ? "Submitting..." : "Submit"}
      </button>
      {error && <p className="error">{error}</p>}
    </form>
  );
}
```

#### Recommendation Hook
```jsx
import { useRecommendation } from "@/hooks/useRecommendation";

function RecommendationForm({ advisorId }) {
  const {
    loading,
    error,
    submitPublicRecommendation,
  } = useRecommendation();

  const handleSubmit = async (recommendations) => {
    try {
      const result = await submitPublicRecommendation(advisorId, {
        recommendations,
        mobileNumber: "9876543210",
      });
      console.log("Submitted:", result);
    } catch (err) {
      console.error("Error:", err.message);
    }
  };

  return (
    <form>
      {/* Form fields */}
      <button onClick={handleSubmit} disabled={loading}>
        {loading ? "Submitting..." : "Submit"}
      </button>
      {error && <p className="error">{error}</p>}
    </form>
  );
}
```

## Important Notes

### Text Testimonials
- ✅ Store directly in database
- ❌ NO S3 upload required
- Direct insertion into `advisor_testimonials` table

### Audio/Video Testimonials
1. **Upload to S3 first** via `/api/upload/media`
2. **Get the S3 URL** from response
3. **Submit testimonial** with the S3 URL in `mediaUrl` field

### Recommendations
- ✅ Simple text arrays
- ❌ NO media, NO S3 upload
- Direct insertion into `advisor_recommendations` table

### Security & Validation
- User mobile numbers are cleaned (digits only)
- Email validation on public endpoints
- OTP validation for testimonial verification
- File type and size validation for S3 uploads
- SQL injection prevention via Supabase

## Development Checklist

- [ ] All 10 API endpoints tested
- [ ] S3 credentials configured in `.env`
- [ ] AWS bucket permissions verified
- [ ] Database tables exist with correct schema
- [ ] Frontend hooks imported correctly
- [ ] Error handling implemented in UI
- [ ] Loading states shown to users
- [ ] Mobile number validation working
- [ ] OTP verification flow tested
- [ ] File upload size limits enforced

## Troubleshooting

### S3 Upload Fails
1. Check AWS credentials in `.env`
2. Verify bucket name and region
3. Check file size limits (10MB audio, 50MB video)
4. Verify file MIME type

### OTP Not Working
1. Verify OTP generation (6 digits)
2. Check OTP expiration (15 minutes)
3. Implement SMS sending (currently logs to console)

### Testimonials Not Showing
1. Check `status` field is 'approved'
2. Verify `is_verified` is true
3. Check advisor_id matches

---

**Last Updated:** April 30, 2026  
**Version:** 1.0.0
