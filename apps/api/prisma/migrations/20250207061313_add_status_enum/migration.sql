-- CreateEnum
CREATE TYPE "Status" AS ENUM ('AKTIF', 'NON_AKTIF');

-- AlterTable
ALTER TABLE "Karyawan" ADD COLUMN     "status" "Status" NOT NULL DEFAULT 'AKTIF';

-- AlterTable
ALTER TABLE "User" ALTER COLUMN "createdAt" SET DEFAULT CURRENT_TIMESTAMP AT TIME ZONE 'Asia/Jakarta';
