-- AlterTable
ALTER TABLE "Karyawan" ADD COLUMN     "nik_direkturUtama" INTEGER;

-- AddForeignKey
ALTER TABLE "Karyawan" ADD CONSTRAINT "Karyawan_nik_direkturUtama_fkey" FOREIGN KEY ("nik_direkturUtama") REFERENCES "Karyawan"("nik") ON DELETE SET NULL ON UPDATE CASCADE;
