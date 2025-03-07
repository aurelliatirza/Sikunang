/*
  Warnings:

  - You are about to drop the column `id_karyawan` on the `Kredit` table. All the data in the column will be lost.
  - Added the required column `id_karyawan_pengajuan` to the `Kredit` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Kredit" DROP CONSTRAINT "Kredit_id_karyawan_fkey";

-- AlterTable
ALTER TABLE "Kredit" DROP COLUMN "id_karyawan",
ADD COLUMN     "id_karyawan_analisisSlik" INTEGER,
ADD COLUMN     "id_karyawan_pengajuan" INTEGER NOT NULL,
ADD COLUMN     "id_karyawan_persetujuandua" INTEGER,
ADD COLUMN     "id_karyawan_persetujuansatu" INTEGER,
ADD COLUMN     "id_karyawan_persetujuantiga" INTEGER,
ADD COLUMN     "id_karyawan_proposalKredit" INTEGER,
ADD COLUMN     "id_karyawan_slik" INTEGER,
ADD COLUMN     "id_karyawan_visitNasabah" INTEGER,
ALTER COLUMN "nominal_disetujui" DROP NOT NULL,
ALTER COLUMN "tenor_disetujui" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "Kredit" ADD CONSTRAINT "Kredit_id_karyawan_pengajuan_fkey" FOREIGN KEY ("id_karyawan_pengajuan") REFERENCES "Karyawan"("nik") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Kredit" ADD CONSTRAINT "Kredit_id_karyawan_slik_fkey" FOREIGN KEY ("id_karyawan_slik") REFERENCES "Karyawan"("nik") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Kredit" ADD CONSTRAINT "Kredit_id_karyawan_analisisSlik_fkey" FOREIGN KEY ("id_karyawan_analisisSlik") REFERENCES "Karyawan"("nik") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Kredit" ADD CONSTRAINT "Kredit_id_karyawan_visitNasabah_fkey" FOREIGN KEY ("id_karyawan_visitNasabah") REFERENCES "Karyawan"("nik") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Kredit" ADD CONSTRAINT "Kredit_id_karyawan_proposalKredit_fkey" FOREIGN KEY ("id_karyawan_proposalKredit") REFERENCES "Karyawan"("nik") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Kredit" ADD CONSTRAINT "Kredit_id_karyawan_persetujuansatu_fkey" FOREIGN KEY ("id_karyawan_persetujuansatu") REFERENCES "Karyawan"("nik") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Kredit" ADD CONSTRAINT "Kredit_id_karyawan_persetujuandua_fkey" FOREIGN KEY ("id_karyawan_persetujuandua") REFERENCES "Karyawan"("nik") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Kredit" ADD CONSTRAINT "Kredit_id_karyawan_persetujuantiga_fkey" FOREIGN KEY ("id_karyawan_persetujuantiga") REFERENCES "Karyawan"("nik") ON DELETE SET NULL ON UPDATE CASCADE;
