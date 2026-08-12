-- AlterTable
ALTER TABLE "Booking" ADD COLUMN "otp" TEXT;

UPDATE "Booking" SET "otp" = '000000' WHERE "otp" IS NULL;

ALTER TABLE "Booking" ALTER COLUMN "otp" SET NOT NULL;