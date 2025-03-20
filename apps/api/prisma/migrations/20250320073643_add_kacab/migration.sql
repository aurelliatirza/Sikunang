-- AlterTable
ALTER TABLE "Karyawan" ADD COLUMN     "nik_kacab" INTEGER;

-- AddForeignKey
ALTER TABLE "Karyawan" ADD CONSTRAINT "Karyawan_nik_kacab_fkey" FOREIGN KEY ("nik_kacab") REFERENCES "Karyawan"("nik") ON DELETE SET NULL ON UPDATE CASCADE;
