import { Suspense } from "react";
import GivePlatformTestimonialForm from "@/components/testimonials/GivePlatformTestimonialForm";

export const dynamic = "force-dynamic";

export default function PublicTestimonialPage() {
  return (
    <Suspense fallback={<div className="p-10 text-center text-[#0A4A4A]">Loading…</div>}>
      <GivePlatformTestimonialForm />
    </Suspense>
  );
}
