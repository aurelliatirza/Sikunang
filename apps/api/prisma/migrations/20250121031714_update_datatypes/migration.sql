/*
  Warnings:

  - The primary key for the `Karyawan` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The `nik_SPV` column on the `Karyawan` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `nik_kabag` column on the `Karyawan` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `nik_direkturBisnis` column on the `Karyawan` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - Changed the type of `nik` on the `Karyawan` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `nik` on the `User` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

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
DROP COLUMN "nik",
ADD COLUMN     "nik" BIGINT NOT NULL,
DROP COLUMN "nik_SPV",
ADD COLUMN     "nik_SPV" BIGINT,
DROP COLUMN "nik_kabag",
ADD COLUMN     "nik_kabag" BIGINT,
DROP COLUMN "nik_direkturBisnis",
ADD COLUMN     "nik_direkturBisnis" BIGINT,
ADD CONSTRAINT "Karyawan_pkey" PRIMARY KEY ("nik");

-- AlterTable
ALTER TABLE "User" DROP COLUMN "nik",
ADD COLUMN     "nik" BIGINT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "User_nik_key" ON "User"("nik");

-- AddForeignKey
ALTER TABLE "Karyawan" ADD CONSTRAINT "Karyawan_nik_SPV_fkey" FOREIGN KEY ("nik_SPV") REFERENCES "Karyawan"("nik") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Karyawan" ADD CONSTRAINT "Karyawan_nik_kabag_fkey" FOREIGN KEY ("nik_kabag") REFERENCES "Karyawan"("nik") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Karyawan" ADD CONSTRAINT "Karyawan_nik_direkturBisnis_fkey" FOREIGN KEY ("nik_direkturBisnis") REFERENCES "Karyawan"("nik") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_nik_fkey" FOREIGN KEY ("nik") REFERENCES "Karyawan"("nik") ON DELETE RESTRICT ON UPDATE CASCADE;
