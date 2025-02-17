/*
  Warnings:

  - Added the required column `desaKelurahanId` to the `Nasabah` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Nasabah" ADD COLUMN     "desaKelurahanId" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "Nasabah" ADD CONSTRAINT "Nasabah_desaKelurahanId_fkey" FOREIGN KEY ("desaKelurahanId") REFERENCES "DesaKelurahan"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
