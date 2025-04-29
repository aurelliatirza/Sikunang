import React, { useEffect, useState } from "react";
import { Button, TextField, Card, CardContent, Typography } from "@mui/material";

interface Karyawan {
  nik: number;
  namaKaryawan: string;
  jabatan: string;
  status: string;
  supervisor?: { namaKaryawan: string };
  kepalaBagian?: { namaKaryawan: string };
  kepalaCabang?: { namaKaryawan: string };
  direkturBisnis?: { namaKaryawan: string };
  kantor?: { jenis_kantor: string };
  user?: { username: string };
}

interface UserProfile {
  id: number;
  namaKaryawan: string;
  nik: number;
  jabatan: string;
}

const jabatanOptions = [
  { label: "HRD", value: "hrd" },
  { label: "Admin Slik", value: "adminSlik" },
  { label: "Marketing", value: "marketing" },
  { label: "SPV", value: "spv" },
  { label: "Kepala Bagian", value: "kabag" },
  { label: "Kepala Cabang", value: "kacab"},
  { label: "Direktur Bisnis", value: "direkturBisnis" },
];

const ProfileCard: React.FC = () => {
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [karyawanData, setKaryawanData] = useState<Karyawan | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const getJabatanLabel = (jabatan: string) => {
    const option = jabatanOptions.find((option) => option.value === jabatan);
    return option ? option.label : jabatan;
  };

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/profile`, {
          method: "GET",
          credentials: "include",
        });
        if (!response.ok) throw new Error("Gagal mengambil data user");
        const data: UserProfile = await response.json();
        setUserProfile(data);
      } catch (error) {
        console.error("Error fetching user profile:", error);
      }
    };
    fetchUserProfile();
  }, []);

  useEffect(() => {
    if (userProfile) {
      const fetchKaryawan = async () => {
        try {
          const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/karyawan/profile`, {
            method: "GET",
            credentials: "include",
          });
          if (!response.ok) throw new Error("Gagal mengambil data karyawan");
          const data: Karyawan[] = await response.json();
          const foundKaryawan = data.find((karyawan) => karyawan.nik === userProfile.nik);
          if (foundKaryawan) setKaryawanData(foundKaryawan);
        } catch (error) {
          console.error("Error fetching karyawan:", error);
        } finally {
          setIsLoading(false);
        }
      };
      fetchKaryawan();
    }
  }, [userProfile]);

  if (isLoading) {
    return <Typography className="text-center">Loading...</Typography>;
  }

  return (
    <div className="container mx-auto p-6">
      <Card className="shadow-lg p-6">
        <CardContent>
          <Typography variant="h4" gutterBottom textAlign={"center"}>
            Profil Karyawan
          </Typography>
          <form>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
              <TextField label="Company" defaultValue="BPR Klepu Mitra Kencana" InputProps={{ readOnly: true }} InputLabelProps={{ shrink: true }} fullWidth variant="outlined" size="medium" sx={{ fontSize: 18 }}/>
              <TextField label="Username" defaultValue={karyawanData?.user?.username || ""} InputProps={{ readOnly: true }} InputLabelProps={{ shrink: true }} fullWidth variant="outlined" size="medium" sx={{ fontSize: 18 }}/>
              <TextField label="Status Karyawan" defaultValue={karyawanData?.status || "-"} InputProps={{ readOnly: true }} InputLabelProps={{ shrink: true }} fullWidth variant="outlined" size="medium" sx={{ fontSize: 18 }}/>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
              <TextField label="Nama Karyawan" defaultValue={karyawanData?.namaKaryawan || "-"} InputProps={{ readOnly: true }} InputLabelProps={{ shrink: true }} fullWidth variant="outlined" size="medium" sx={{ fontSize: 18 }}/>
              <TextField label="Jabatan" defaultValue={karyawanData ? getJabatanLabel(karyawanData.jabatan) : "-"} InputProps={{ readOnly: true }} InputLabelProps={{ shrink: true }} fullWidth variant="outlined" size="medium" sx={{ fontSize: 18 }}/>
            </div>
            <div className="mt-6">
              <TextField label="Jenis Kantor" defaultValue={karyawanData?.kantor?.jenis_kantor || "-"} InputProps={{ readOnly: true }} InputLabelProps={{ shrink: true }} fullWidth variant="outlined" size="medium" sx={{ fontSize: 18 }}/>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
              <TextField label="Supervisor" defaultValue={karyawanData?.supervisor?.namaKaryawan || "-"} InputProps={{ readOnly: true }} InputLabelProps={{ shrink: true }} fullWidth variant="outlined" size="medium" sx={{ fontSize: 18 }}/>
              <TextField label="Kepala Bagian" defaultValue={karyawanData?.kepalaBagian?.namaKaryawan || "-"} InputProps={{ readOnly: true }} InputLabelProps={{ shrink: true }} fullWidth variant="outlined" size="medium" sx={{ fontSize: 18 }}/>
              <TextField label="Kepala Cabang" defaultValue={karyawanData?.kepalaCabang?.namaKaryawan || "-"} InputProps={{ readOnly: true }} InputLabelProps={{ shrink: true }} fullWidth variant="outlined" size="medium" sx={{ fontSize: 18 }}/>
              <TextField label="Direktur Bisnis" defaultValue={karyawanData?.direkturBisnis?.namaKaryawan || "-"} InputProps={{ readOnly: true }} InputLabelProps={{ shrink: true }} fullWidth variant="outlined" size="medium" sx={{ fontSize: 18 }}/>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default ProfileCard;
