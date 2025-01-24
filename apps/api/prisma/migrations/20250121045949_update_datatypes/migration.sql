/*
  Warnings:

  - The primary key for the `Karyawan` table will be changed. If it partially fails, the table could be left without primary key constraint.

*/
-- DropForeignKey
ALTER TABLE "Karyawan" DROP CONSTRAINT "Karyawan_nik_SPV_fkey";

-- DropForeignKey
ALTER TABLE "Karyawan" DROP CONSTRAINT "Karyawan_nik_direkturBisnis_fkey";

-- DropForeignKey
ALTER TABLE "Karyawan" DROP CONSTRAINT "Karyawan_nik_kabag_fkey";

-- DropForeignKey
ALTER TABLE "User" DROP CONSTRAINT "User_nik_fkey";

-- AlterTable
ALTER TABLE "Karyawan" DROP CONSTRAINT "Karyawan_pkey",
ALTER COLUMN "nik" SET DATA TYPE BIGINT,
ALTER COLUMN "nik_SPV" SET DATA TYPE BIGINT,
ALTER COLUMN "nik_kabag" SET DATA TYPE BIGINT,
ALTER COLUMN "nik_direkturBisnis" SET DATA TYPE BIGINT,
ADD CONSTRAINT "Karyawan_pkey" PRIMARY KEY ("nik");

-- AlterTable
ALTER TABLE "User" ALTER COLUMN "nik" SET DATA TYPE BIGINT;

-- AddForeignKey
ALTER TABLE "Karyawan" ADD CONSTRAINT "Karyawan_nik_SPV_fkey" FOREIGN KEY ("nik_SPV") REFERENCES "Karyawan"("nik") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Karyawan" ADD CONSTRAINT "Karyawan_nik_kabag_fkey" FOREIGN KEY ("nik_kabag") REFERENCES "Karyawan"("nik") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Karyawan" ADD CONSTRAINT "Karyawan_nik_direkturBisnis_fkey" FOREIGN KEY ("nik_direkturBisnis") REFERENCES "Karyawan"("nik") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_nik_fkey" FOREIGN KEY ("nik") REFERENCES "Karyawan"("nik") ON DELETE RESTRICT ON UPDATE CASCADE;
