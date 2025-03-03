-- AlterTable
ALTER TABLE "Kredit" ALTER COLUMN "status_pengajuan" SET DEFAULT 'belum_diajukan',
ALTER COLUMN "status_Slik" SET DEFAULT 'belum_ditinjau',
ALTER COLUMN "status_analisisSlik" SET DEFAULT 'belum_dianalisis',
ALTER COLUMN "status_visitNasabah" SET DEFAULT 'belum_dilakukan',
ALTER COLUMN "status_proposalKredit" SET DEFAULT 'belum_dibuat',
ALTER COLUMN "status_persetujuansatu" SET DEFAULT 'belum_disetujui',
ALTER COLUMN "status_persetujuandua" SET DEFAULT 'belum_disetujui',
ALTER COLUMN "status_persetujuantiga" SET DEFAULT 'belum_disetujui';
