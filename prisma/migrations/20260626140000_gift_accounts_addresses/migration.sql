-- Gift bank accounts and shipping addresses
ALTER TABLE "Invitation" ADD COLUMN IF NOT EXISTS "giftGroomAccountName" TEXT;
ALTER TABLE "Invitation" ADD COLUMN IF NOT EXISTS "giftGroomBank" TEXT;
ALTER TABLE "Invitation" ADD COLUMN IF NOT EXISTS "giftGroomAccountNumber" TEXT;
ALTER TABLE "Invitation" ADD COLUMN IF NOT EXISTS "giftBrideAccountName" TEXT;
ALTER TABLE "Invitation" ADD COLUMN IF NOT EXISTS "giftBrideBank" TEXT;
ALTER TABLE "Invitation" ADD COLUMN IF NOT EXISTS "giftBrideAccountNumber" TEXT;
ALTER TABLE "Invitation" ADD COLUMN IF NOT EXISTS "giftGroomAddressTitle" TEXT;
ALTER TABLE "Invitation" ADD COLUMN IF NOT EXISTS "giftGroomAddressFull" TEXT;
ALTER TABLE "Invitation" ADD COLUMN IF NOT EXISTS "giftBrideAddressTitle" TEXT;
ALTER TABLE "Invitation" ADD COLUMN IF NOT EXISTS "giftBrideAddressFull" TEXT;
