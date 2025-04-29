interface UploadComponentProps {
  onUpload: (filePath: string) => void;
}

const UploadComponent: React.FC<UploadComponentProps> = ({ onUpload }) => {
  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/kunjungan/upload`, {
        method: "POST",
        body: formData,
      });

      if (!res.ok) {
        throw new Error("Upload gagal.");
      }

      const data = await res.json();
      onUpload(data.filePath); // Pastikan backend mengembalikan `filePath`
    } catch (error) {
      console.error("Upload error:", error);
    }
  };

  return (
    <div>
      <input type="file" accept="image/*" onChange={handleFileUpload} />
    </div>
  );
};

export default UploadComponent;
