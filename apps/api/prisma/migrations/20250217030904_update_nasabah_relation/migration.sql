/*
  Warnings:

  - You are about to drop the column `nik` on the `Kunjungan` table. All the data in the column will be lost.
  - Added the required column `nik` to the `Nasabah` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Kunjungan" DROP CONSTRAINT "Kunjungan_nik_fkey";

-- AlterTable
ALTER TABLE "Kunjungan" DROP COLUMN "nik";

-- AlterTable
ALTER TABLE "Nasabah" ADD COLUMN     "nik" INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE "Nasabah" ADD CONSTRAINT "Nasabah_nik_fkey" FOREIGN KEY ("nik") REFERENCES "Karyawan"("nik") ON DELETE RESTRICT ON UPDATE CASCADE;
