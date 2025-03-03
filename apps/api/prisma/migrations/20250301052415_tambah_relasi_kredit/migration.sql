-- CreateTable
CREATE TABLE "Kredit" (
    "id_kredit" SERIAL NOT NULL,
    "id_nasabah" INTEGER NOT NULL,
    "id_karyawan" INTEGER NOT NULL,
    "nominal_pengajuan" INTEGER NOT NULL,
    "tenor_pengajuan" INTEGER NOT NULL,
    "status_pengajuan" TEXT NOT NULL,
    "updatedAtPengajuan" TIMESTAMPTZ(6) NOT NULL,
    "status_Slik" TEXT NOT NULL,
    "updatedAtSlik" TIMESTAMPTZ(6) NOT NULL,
    "status_analisisSlik" TEXT NOT NULL,
    "updatedAtAnalisisSlik" TIMESTAMPTZ(6) NOT NULL,
    "status_visitNasabah" TEXT NOT NULL,
    "updatedAtVisitNasabah" TIMESTAMPTZ(6) NOT NULL,
    "status_proposalKredit" TEXT NOT NULL,
    "updatedAtProposalKredit" TIMESTAMPTZ(6) NOT NULL,
    "status_persetujuansatu" TEXT NOT NULL,
    "updatedAtPersetujuansatu" TIMESTAMPTZ(6) NOT NULL,
    "status_persetujuandua" TEXT NOT NULL,
    "updatedAtPersetujuandua" TIMESTAMPTZ(6) NOT NULL,
    "status_persetujuantiga" TEXT NOT NULL,
    "updatedAtPersetujuantiga" TIMESTAMPTZ(6) NOT NULL,
    "nominal_disetujui" INTEGER NOT NULL,
    "tenor_disetujui" INTEGER NOT NULL,
    "createdAt" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Kredit_pkey" PRIMARY KEY ("id_kredit")
);

-- AddForeignKey
ALTER TABLE "Kredit" ADD CONSTRAINT "Kredit_id_nasabah_fkey" FOREIGN KEY ("id_nasabah") REFERENCES "Nasabah"("id_nasabah") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Kredit" ADD CONSTRAINT "Kredit_id_karyawan_fkey" FOREIGN KEY ("id_karyawan") REFERENCES "Karyawan"("nik") ON DELETE RESTRICT ON UPDATE CASCADE;
