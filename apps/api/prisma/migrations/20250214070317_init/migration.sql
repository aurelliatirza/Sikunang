-- CreateTable
CREATE TABLE "Karyawan" (
    "nik" INTEGER NOT NULL,
    "namaKaryawan" TEXT NOT NULL,
    "jabatan" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'AKTIF',
    "nik_SPV" INTEGER,
    "nik_kabag" INTEGER,
    "nik_direkturBisnis" INTEGER,
    "id_kantor" INTEGER NOT NULL,
    "createdAt" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMPTZ,

    CONSTRAINT "Karyawan_pkey" PRIMARY KEY ("nik")
);

-- CreateTable
CREATE TABLE "Kantor" (
    "id_kantor" SERIAL NOT NULL,
    "jenis_kantor" TEXT NOT NULL,
    "createdAt" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Kantor_pkey" PRIMARY KEY ("id_kantor")
);

-- CreateTable
CREATE TABLE "User" (
    "id" SERIAL NOT NULL,
    "nik" INTEGER NOT NULL,
    "username" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "createdAt" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Nasabah" (
    "id_nasabah" SERIAL NOT NULL,
    "namaNasabah" TEXT NOT NULL,
    "alamat" TEXT NOT NULL,
    "no_telp" TEXT NOT NULL,
    "namaUsaha" TEXT NOT NULL,

    CONSTRAINT "Nasabah_pkey" PRIMARY KEY ("id_nasabah")
);

-- CreateTable
CREATE TABLE "Kota" (
    "id_kota" SERIAL NOT NULL,
    "namaKota" TEXT NOT NULL,
    "createdAt" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Kota_pkey" PRIMARY KEY ("id_kota")
);

-- CreateTable
CREATE TABLE "Kecamatan" (
    "id_kecamatan" SERIAL NOT NULL,
    "namaKecamatan" TEXT NOT NULL,
    "id_kota" INTEGER NOT NULL,

    CONSTRAINT "Kecamatan_pkey" PRIMARY KEY ("id_kecamatan")
);

-- CreateTable
CREATE TABLE "Kelurahan" (
    "id_kelurahan" SERIAL NOT NULL,
    "namaKelurahan" TEXT NOT NULL,
    "id_kecamatan" INTEGER NOT NULL,

    CONSTRAINT "Kelurahan_pkey" PRIMARY KEY ("id_kelurahan")
);

-- CreateTable
CREATE TABLE "Kunjungan" (
    "id_kunjungan" SERIAL NOT NULL,
    "id_nasabah" INTEGER NOT NULL,
    "nik" INTEGER NOT NULL,
    "hasilKunjungan" TEXT NOT NULL,
    "foto_kunjungan" TEXT NOT NULL,
    "createdAt" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMPTZ NOT NULL,

    CONSTRAINT "Kunjungan_pkey" PRIMARY KEY ("id_kunjungan")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_nik_key" ON "User"("nik");

-- CreateIndex
CREATE UNIQUE INDEX "User_username_key" ON "User"("username");

-- AddForeignKey
ALTER TABLE "Karyawan" ADD CONSTRAINT "Karyawan_id_kantor_fkey" FOREIGN KEY ("id_kantor") REFERENCES "Kantor"("id_kantor") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Karyawan" ADD CONSTRAINT "Karyawan_nik_SPV_fkey" FOREIGN KEY ("nik_SPV") REFERENCES "Karyawan"("nik") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Karyawan" ADD CONSTRAINT "Karyawan_nik_kabag_fkey" FOREIGN KEY ("nik_kabag") REFERENCES "Karyawan"("nik") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Karyawan" ADD CONSTRAINT "Karyawan_nik_direkturBisnis_fkey" FOREIGN KEY ("nik_direkturBisnis") REFERENCES "Karyawan"("nik") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_nik_fkey" FOREIGN KEY ("nik") REFERENCES "Karyawan"("nik") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Kecamatan" ADD CONSTRAINT "Kecamatan_id_kota_fkey" FOREIGN KEY ("id_kota") REFERENCES "Kota"("id_kota") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Kelurahan" ADD CONSTRAINT "Kelurahan_id_kecamatan_fkey" FOREIGN KEY ("id_kecamatan") REFERENCES "Kecamatan"("id_kecamatan") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Kunjungan" ADD CONSTRAINT "Kunjungan_id_nasabah_fkey" FOREIGN KEY ("id_nasabah") REFERENCES "Nasabah"("id_nasabah") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Kunjungan" ADD CONSTRAINT "Kunjungan_nik_fkey" FOREIGN KEY ("nik") REFERENCES "Karyawan"("nik") ON DELETE RESTRICT ON UPDATE CASCADE;
