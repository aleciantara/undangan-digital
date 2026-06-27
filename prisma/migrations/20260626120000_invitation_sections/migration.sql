-- Invite verse, videos, gift on Invitation
ALTER TABLE "Invitation" ADD COLUMN IF NOT EXISTS "inviteVerseTitle" TEXT DEFAULT 'Walimatul Urs';
ALTER TABLE "Invitation" ADD COLUMN IF NOT EXISTS "inviteVersePreset" TEXT DEFAULT 'islam';
ALTER TABLE "Invitation" ADD COLUMN IF NOT EXISTS "inviteVerseText" TEXT;
ALTER TABLE "Invitation" ADD COLUMN IF NOT EXISTS "prewedVideoUrl" TEXT;
ALTER TABLE "Invitation" ADD COLUMN IF NOT EXISTS "prewedVideoTitle" TEXT DEFAULT 'Pre-Wedding Film';
ALTER TABLE "Invitation" ADD COLUMN IF NOT EXISTS "liveStreamUrl" TEXT;
ALTER TABLE "Invitation" ADD COLUMN IF NOT EXISTS "liveStreamTitle" TEXT DEFAULT 'Siaran Langsung';
ALTER TABLE "Invitation" ADD COLUMN IF NOT EXISTS "giftEnabled" BOOLEAN NOT NULL DEFAULT false;
ALTER TABLE "Invitation" ADD COLUMN IF NOT EXISTS "giftTitle" TEXT DEFAULT 'Kirim Kado';
ALTER TABLE "Invitation" ADD COLUMN IF NOT EXISTS "giftMessage" TEXT;

-- Dress code fields on WeddingEvent
ALTER TABLE "WeddingEvent" ADD COLUMN IF NOT EXISTS "dresscodeColor" TEXT;
ALTER TABLE "WeddingEvent" ADD COLUMN IF NOT EXISTS "dresscodeAttire" TEXT;
