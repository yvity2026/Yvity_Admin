// import { NextResponse } from "next/server";
// import { createAdminClient } from "@/lib/supabase/server";

// // CREATE testimonial
// export async function POST(req) {
//   try {
//     const supabase = createAdminClient();
//     const body = await req.json();
//     const {
//       advisor_id,
//       name,
//       userId,
//       mobile_number,
//       content,
//       media_url,
//       otp_code,
//       otp_expires_at,
//       testimonial_type = "text",
//       testimonial_rating,
//       is_mobile_verified,
//       status
//     } = body;

//     console.log(body);

//     // 🔐 Validation
//     if (!advisor_id || !name || !mobile_number) {
//       return NextResponse.json(
//         { error: "Missing required fields: advisor_id, name, mobile_number" },
//         { status: 400 },
//       );
//     }

//     if (!/^[6-9]\d{9}$/.test(mobile_number)) {
//       return NextResponse.json(
//         { error: "Invalid mobile number format" },
//         { status: 400 },
//       );
//     }

//     if (!content && !media_url) {
//       return NextResponse.json(
//         { error: "Either content or media_url is required" },
//         { status: 400 },
//       );
//     }

//     const allowedTypes = ["text", "audio", "video"];
//     if (!allowedTypes.includes(testimonial_type)) {
//       return NextResponse.json(
//         { error: "Invalid testimonial type" },
//         { status: 400 },
//       );
//     }

//     if (testimonial_type === "text" && !content) {
//       return NextResponse.json(
//         { error: "Text testimonial content is required" },
//         { status: 400 },
//       );
//     }

//     if (testimonial_type !== "text" && !media_url) {
//       return NextResponse.json(
//         { error: "Media URL is required for audio and video testimonials" },
//         { status: 400 },
//       );
//     }

//     const { data: advisorData, error: advisorError } = await supabase
//       .from("advisor_profiles")
//       .select("subscription_plan,account_status")
//       .eq("advisor_id", advisor_id)
//       .maybeSingle();

//     if (advisorError || !advisorData) {
//       return NextResponse.json({ error: "Advisor not found" }, { status: 404 });
//     }

//     const plan = String(advisorData.subscription_plan || "free").toLowerCase();
//     const accountStatus = String(
//       advisorData.account_status || "active",
//     ).toLowerCase();
//     const effectivePlan =
//       accountStatus === "active" && (plan === "silver" || plan === "gold")
//         ? plan
//         : "free";

//     if (effectivePlan === "free") {
//       if (testimonial_type !== "text") {
//         return NextResponse.json(
//           {
//             error:
//               "Free plan advisors can only receive text testimonials. Audio and video testimonials are not allowed.",
//           },
//           { status: 403 },
//         );
//       }

//       const { count: textCount, error: countError } = await supabase
//         .from("advisor_testimonials")
//         .select("id", { count: "exact", head: true })
//         .eq("advisor_id", advisor_id)
//         .eq("testimonial_type", "text");

//       if (countError) {
//         console.error("Error counting testimonials:", countError);
//         return NextResponse.json(
//           { error: "Unable to validate testimonial quota" },
//           { status: 500 },
//         );
//       }

//       if (textCount >= 5) {
//         return NextResponse.json(
//           {
//             error:
//               "Free plan advisors can only receive up to 5 text testimonials. Please upgrade the advisor plan to accept more testimonials.",
//           },
//           { status: 403 },
//         );
//       }
//     }

//     if (effectivePlan === "silver" && testimonial_type === "video") {
//       return NextResponse.json(
//         {
//           error:
//             "Silver plan advisors can receive text and audio testimonials only. Video testimonials are not allowed.",
//         },
//         { status: 403 },
//       );
//     }

//     // 🔐 Check if user is logged in
//     let currentUser = null;
//     let user_id = null;
//     // let is_mobile_verified = false;

//     try {
//       currentUser = await ValidateUser();
//       if (currentUser) {
//         user_id = currentUser.id;
//       }
//     } catch (err) {
//       return NextResponse.json(
//         {
//           error: "user must be logged in ",
//         },
//         { status: 403 },
//       );
//     }

//     // Insert testimonial
//     const { data, error } = await supabase
//       .from("advisor_testimonials")
//       .insert({
//         advisor_id,
//         user_id: user_id || userId || null,
//         name,
//         mobile_number,
//         testimonial_type,
//         otp_code,
//         otp_expires_at,
//         content: testimonial_type === "text" ? content : null,
//         media_url: testimonial_type !== "text" ? media_url : null,
//         testimonial_rating: Number(testimonial_rating),
//         status,
//         is_mobile_verified
//       })
//       .select()
//       .single();

//     if (error) {
//       console.error("Supabase insert error:", error);
//       throw error;
//     }

//     return NextResponse.json(
//       {
//         success: true,
//         message: "Testimonial submitted successfully",
//         data,
//       },
//       { status: 201 },
//     );
//   } catch (err) {
//     console.error("Testimonial submission error:", err);
//     return NextResponse.json(
//       { error: err.message || "Internal server error" },
//       { status: 500 },
//     );
//   }
// }



// import { NextResponse } from "next/server";
// import { createAdminClient } from "@/lib/supabase/server";
// import { ValidateUser } from "@/lib/auth/ValidateUser";

// // SEND OTP OR SUBMIT TESTIMONIAL
// export async function POST(req) {
//   try {
//     const supabase = createAdminClient();
//     const body = await req.json();
//     const {
//       advisor_id,
//       name,
//       userId,
//       mobile_number,
//       content,
//       media_url,
//       testimonial_type = "text",
//       testimonial_rating,
//     } = body;

//     console.log("testmonial body : ", body)
//     // Basic validation
//     if (!advisor_id || !name || !mobile_number) {
//       return NextResponse.json(
//         { error: "Missing required fields: advisor_id, name, mobile_number" },
//         { status: 400 }
//       );
//     }

//     if (!/^[6-9]\d{9}$/.test(mobile_number)) {
//       return NextResponse.json(
//         { error: "Invalid mobile number format" },
//         { status: 400 }
//       );
//     }

//     if (!content && !media_url) {
//       return NextResponse.json(
//         { error: "Either content or media_url is required" },
//         { status: 400 }
//       );
//     }

//     // Validate testimonial type
//     const allowedTypes = ["text", "audio", "video"];
//     if (!allowedTypes.includes(testimonial_type)) {
//       return NextResponse.json(
//         { error: "Invalid testimonial type" },
//         { status: 400 }
//       );
//     }

//     if (testimonial_type === "text" && !content) {
//       return NextResponse.json(
//         { error: "Text testimonial content is required" },
//         { status: 400 }
//       );
//     }

//     if (testimonial_type !== "text" && !media_url) {
//       return NextResponse.json(
//         { error: "Media URL is required for audio and video testimonials" },
//         { status: 400 }
//       );
//     }

//     // Check if user is logged in
//     let currentUser = null;
//     let user_id = null;
//     try {
//       currentUser = await ValidateUser();
//       if (currentUser) {
//         user_id = currentUser.id;
//       }
//     } catch (err) {
//       // Not logged in, we'll use OTP
//     }

//     // If user is logged in, submit testimonial directly
//     if (user_id) {
//       const { data, error } = await supabase
//         .from("advisor_testimonials")
//         .insert({
//           advisor_id,
//           user_id,
//           name,
//           mobile_number,
//           testimonial_type,
//           content: testimonial_type === "text" ? content : null,
//           media_url: testimonial_type !== "text" ? media_url : null,
//           testimonial_rating: Number(testimonial_rating),
//           status: "pending",
//           is_verified: true,
//         })
//         .select()
//         .single();

//       if (error) {
//         console.error("Supabase insert error:", error);
//         throw error;
//       }

//       return NextResponse.json(
//         { success: true, message: "Testimonial submitted successfully", data },
//         { status: 201 }
//       );
//     }

//     // If user is not logged in, generate OTP
//     const otp_code = Math.floor(100000 + Math.random() * 900000).toString(); // 6-digit
//     const otp_expires_at = new Date(Date.now() + 10 * 60 * 1000); // 10 min expiry

//     // Upsert testimonial with OTP
//     const { data, error } = await supabase
//       .from("advisor_testimonials")
//       .upsert(
//         {
//           advisor_id,
//           user_id: userId || null,
//           name,
//           mobile_number,
//           testimonial_type,
//           content: testimonial_type === "text" ? content : null,
//           media_url: testimonial_type !== "text" ? media_url : null,
//           testimonial_rating: Number(testimonial_rating),
//           status: "unverified",
//           is_verified: false,
//           otp_code,
//           otp_expires_at,
//         },
//         { onConflict: ["mobile_number", "advisor_id"], ignoreDuplicates: false }
//       )
//       .select()
//       .single();

//     if (error) {
//       console.error("Supabase upsert error:", error);
//       throw error;
//     }

//     // TODO: Send OTP via SMS (Twilio or other)
//     console.log(`Send OTP ${otp_code} to ${mobile_number}`);

//     return NextResponse.json(
//       {
//         success: true,
//         message: "OTP sent to your mobile. Please verify to submit testimonial.",
//         data,
//       },
//       { status: 200 }
//     );
//   } catch (err) {
//     console.error("Testimonial submission error:", err);
//     return NextResponse.json(
//       { error: err.message || "Internal server error" },
//       { status: 500 }
//     );
//   }
// }
