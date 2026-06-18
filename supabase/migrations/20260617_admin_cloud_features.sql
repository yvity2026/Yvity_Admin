-- Admin cloud features: coupons, feature controls, pricing, ambassadors
-- Deployed so Admin sections work on Vercel without local .data files

CREATE TABLE IF NOT EXISTS "public"."platform_configs" (
  "key" TEXT PRIMARY KEY,
  "config" JSONB NOT NULL DEFAULT '{}',
  "updated_at" TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS "public"."coupons" (
  "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  "code" TEXT UNIQUE NOT NULL,
  "label" TEXT DEFAULT '',
  "discount_type" TEXT NOT NULL DEFAULT 'percent' CHECK (discount_type IN ('percent', 'fixed')),
  "discount_value" NUMERIC NOT NULL DEFAULT 0,
  "applies_to" TEXT[] DEFAULT '{}',
  "assigned_email" TEXT,
  "assigned_user_id" UUID REFERENCES "public"."users"("id") ON DELETE SET NULL,
  "max_redemptions" INTEGER NOT NULL DEFAULT 1,
  "redemption_count" INTEGER NOT NULL DEFAULT 0,
  "status" TEXT NOT NULL DEFAULT 'active',
  "expires_at" TIMESTAMPTZ,
  "created_at" TIMESTAMPTZ DEFAULT NOW(),
  "created_by_admin_id" UUID REFERENCES "public"."admin_users"("id") ON DELETE SET NULL,
  "reserved_at" TIMESTAMPTZ,
  "reserved_by_user_id" UUID REFERENCES "public"."users"("id") ON DELETE SET NULL,
  "reserved_order_id" TEXT,
  "redeemed_at" TIMESTAMPTZ,
  "redeemed_by_user_id" UUID REFERENCES "public"."users"("id") ON DELETE SET NULL,
  "redeemed_by_email" TEXT,
  "redeemed_payment_id" TEXT
);

CREATE TABLE IF NOT EXISTS "public"."ambassadors" (
  "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  "user_id" UUID NOT NULL UNIQUE REFERENCES "public"."users"("id") ON DELETE CASCADE,
  "referral_code" TEXT UNIQUE,
  "status" TEXT NOT NULL DEFAULT 'active',
  "promoted_at" TIMESTAMPTZ DEFAULT NOW(),
  "promoted_by_admin_id" UUID REFERENCES "public"."admin_users"("id") ON DELETE SET NULL,
  "note" TEXT
);

CREATE TABLE IF NOT EXISTS "public"."referrals" (
  "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  "referrer_user_id" UUID REFERENCES "public"."users"("id") ON DELETE SET NULL,
  "referred_user_id" UUID REFERENCES "public"."users"("id") ON DELETE SET NULL,
  "referral_code" TEXT,
  "status" TEXT DEFAULT 'pending',
  "plan_id" TEXT,
  "checkout_kind" TEXT,
  "attributed_at" TIMESTAMPTZ,
  "qualified_at" TIMESTAMPTZ,
  "rejected_at" TIMESTAMPTZ,
  "rejection_reason" TEXT,
  "created_at" TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS "public"."ambassador_rewards" (
  "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  "user_id" UUID REFERENCES "public"."users"("id") ON DELETE SET NULL,
  "referral_id" UUID REFERENCES "public"."referrals"("id") ON DELETE SET NULL,
  "reward_type" TEXT DEFAULT 'discount_coupon',
  "coupon_id" UUID REFERENCES "public"."coupons"("id") ON DELETE SET NULL,
  "coupon_code" TEXT,
  "status" TEXT DEFAULT 'earned',
  "approved_at" TIMESTAMPTZ,
  "approved_by_admin_id" UUID REFERENCES "public"."admin_users"("id") ON DELETE SET NULL,
  "created_at" TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS "public"."ambassador_campaigns" (
  "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  "name" TEXT NOT NULL,
  "message_body" TEXT NOT NULL,
  "audience" TEXT DEFAULT 'all_ambassadors',
  "status" TEXT DEFAULT 'draft',
  "recipient_count" INTEGER DEFAULT 0,
  "sent_count" INTEGER DEFAULT 0,
  "failed_count" INTEGER DEFAULT 0,
  "sent_at" TIMESTAMPTZ,
  "created_by_admin_id" UUID REFERENCES "public"."admin_users"("id") ON DELETE SET NULL,
  "created_at" TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS "public"."reward_campaigns" (
  "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  "name" TEXT NOT NULL,
  "description" TEXT DEFAULT '',
  "type" TEXT NOT NULL,
  "status" TEXT DEFAULT 'draft',
  "config" JSONB DEFAULT '{}',
  "created_by_admin_id" UUID REFERENCES "public"."admin_users"("id") ON DELETE SET NULL,
  "created_at" TIMESTAMPTZ DEFAULT NOW(),
  "updated_at" TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE "public"."advisor_profiles"
  ADD COLUMN IF NOT EXISTS "billing_admin_note" TEXT,
  ADD COLUMN IF NOT EXISTS "billing_extended_at" TIMESTAMPTZ;
