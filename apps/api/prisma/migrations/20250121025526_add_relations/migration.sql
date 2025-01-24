/*
  Warnings:

  - Changed the type of `jabatan` on the `Karyawan` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- CreateEnum
CREATE TYPE "Jabatan" AS ENUM ('marketing', 'spv', 'kabag', 'direkturBisnis');

-- AlterTable
ALTER TABLE "Karyawan" DROP COLUMN "jabatan",
ADD COLUMN     "jabatan" "Jabatan" NOT NULL;

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_nik_fkey" FOREIGN KEY ("nik") REFERENCES "Karyawan"("nik") ON DELETE RESTRICT ON UPDATE CASCADE;
