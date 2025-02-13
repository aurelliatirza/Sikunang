/*
  Warnings:

  - The `status` column on the `Karyawan` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "Karyawan" DROP COLUMN "status",
ADD COLUMN     "status" TEXT NOT NULL DEFAULT 'AKTIF';

-- AlterTable
ALTER TABLE "User" ALTER COLUMN "createdAt" SET DEFAULT CURRENT_TIMESTAMP AT TIME ZONE 'Asia/Jakarta';

-- DropEnum
DROP TYPE "Status";
