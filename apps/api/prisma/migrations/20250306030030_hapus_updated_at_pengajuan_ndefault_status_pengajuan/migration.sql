/*
  Warnings:

  - You are about to drop the column `updatedAtPengajuan` on the `Kredit` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Kredit" DROP COLUMN "updatedAtPengajuan",
ALTER COLUMN "status_pengajuan" SET DEFAULT 'sedang_diajukan';
