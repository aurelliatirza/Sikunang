-- CreateTable
CREATE TABLE "Karyawan" (
    "nik" TEXT NOT NULL,
    "namaKaryawan" TEXT NOT NULL,
    "jabatan" TEXT NOT NULL,
    "nik_SPV" TEXT,
    "nik_kabag" TEXT,
    "nik_direkturBisnis" TEXT,
    "id_kantor" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3),

    CONSTRAINT "Karyawan_pkey" PRIMARY KEY ("nik")
);

-- CreateTable
CREATE TABLE "Kantor" (
    "id_kantor" SERIAL NOT NULL,
    "jenis_kantor" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Kantor_pkey" PRIMARY KEY ("id_kantor")
);

-- CreateTable
CREATE TABLE "User" (
    "id" SERIAL NOT NULL,
    "nik" TEXT NOT NULL,
    "username" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
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
