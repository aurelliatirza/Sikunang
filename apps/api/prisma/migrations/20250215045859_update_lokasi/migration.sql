/*
  Warnings:

  - The primary key for the `Kecamatan` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `id_kecamatan` on the `Kecamatan` table. All the data in the column will be lost.
  - You are about to drop the column `id_kota` on the `Kecamatan` table. All the data in the column will be lost.
  - You are about to drop the column `namaKecamatan` on the `Kecamatan` table. All the data in the column will be lost.
  - You are about to drop the `Kelurahan` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Kota` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `id` to the `Kecamatan` table without a default value. This is not possible if the table is not empty.
  - Added the required column `kabupatenKotaId` to the `Kecamatan` table without a default value. This is not possible if the table is not empty.
  - Added the required column `nama` to the `Kecamatan` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Kecamatan" DROP CONSTRAINT "Kecamatan_id_kota_fkey";

-- DropForeignKey
ALTER TABLE "Kelurahan" DROP CONSTRAINT "Kelurahan_id_kecamatan_fkey";

-- AlterTable
ALTER TABLE "Kecamatan" DROP CONSTRAINT "Kecamatan_pkey",
DROP COLUMN "id_kecamatan",
DROP COLUMN "id_kota",
DROP COLUMN "namaKecamatan",
ADD COLUMN     "id" CHAR(6) NOT NULL,
ADD COLUMN     "kabupatenKotaId" CHAR(4) NOT NULL,
ADD COLUMN     "nama" VARCHAR(255) NOT NULL,
ADD CONSTRAINT "Kecamatan_pkey" PRIMARY KEY ("id");

-- DropTable
DROP TABLE "Kelurahan";

-- DropTable
DROP TABLE "Kota";

-- CreateTable
CREATE TABLE "Provinsi" (
    "id" CHAR(2) NOT NULL,
    "nama" VARCHAR(255) NOT NULL,

    CONSTRAINT "Provinsi_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "KabupatenKota" (
    "id" CHAR(4) NOT NULL,
    "provinsiId" CHAR(2) NOT NULL,
    "nama" VARCHAR(255) NOT NULL,

    CONSTRAINT "KabupatenKota_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DesaKelurahan" (
    "id" CHAR(10) NOT NULL,
    "kecamatanId" CHAR(6) NOT NULL,
    "nama" VARCHAR(255) NOT NULL,

    CONSTRAINT "DesaKelurahan_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "KabupatenKota" ADD CONSTRAINT "KabupatenKota_provinsiId_fkey" FOREIGN KEY ("provinsiId") REFERENCES "Provinsi"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Kecamatan" ADD CONSTRAINT "Kecamatan_kabupatenKotaId_fkey" FOREIGN KEY ("kabupatenKotaId") REFERENCES "KabupatenKota"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DesaKelurahan" ADD CONSTRAINT "DesaKelurahan_kecamatanId_fkey" FOREIGN KEY ("kecamatanId") REFERENCES "Kecamatan"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
