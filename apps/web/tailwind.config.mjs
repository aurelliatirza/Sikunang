/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        white: "#ffffff",
        black: "#000000",
        blue: {
          100: "#E4F1FC", //untuk card di login dan signup
          200: "#3861A1", //untuk button di login dan signup saat belum di hover
          300: "#0A3981",  //untuk button di login dan signup saat di hover
          400: "#2C72CB",  //untuk di page lainnya bagian atas (header), dan badge di tabel
          500: "#0F3A7C",  //untuk header tabel dan grafik di dashboard
          600: "#608BC1",  //untuk navigasi sidebar
        },
        yellow: {
          100: "#FFE100", //buat badge di tabel
          200: "#F5A463", //buat tombol kirim dan alur pengajuan saat belum di hover
          300: "#E38E49", //buat tombol kirim saat di hover
          400: "#FF7518", //buat tombol alur pengajuan saat sudah di klik
          500: "#FFB939", //buat tombol edit
        },
        green: {
          100: "#1BBB78", //buat tombol tambah laporan saat belum di klik dan di badge
          200: "#138053", //buat tombol tambah laporan saat di klik
        }
      }
    },
  },
  plugins: [],
};
