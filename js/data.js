/**
 * ==========================================
 * Konfigurasi Aplikasi
 * ==========================================
 */

const Config = {
  appName: "RAMAH DUKCAPIL",
  appNameAlias: "Ragam Informasi & Administrasi Mudah dengan Suara",

  autoPlay: true,
  autoHome: 60,
  carouselInterval: 5000,
  imageInterval: 20000,
  audioVolume: 1,
  audioRate: 1,
  theme: "dark",
};

/**
 * ==========================================
 * Home Carousel
 * ==========================================
 */

const HomeCarousel = [
  {
    image: "images/informasi-1.jpeg",
    title: "IKD (Identitas Kependudukan Digital)",
    subtitle: "Segera miliki aplikasi identitas kependudukan digital",
  },
];

/**
 * ==========================================
 * DAFTAR AUDIO (PRELOAD) - OBJECT
 * ==========================================
 *
 * key: nama unik untuk referensi
 * value: path file audio
 *
 * Cara pakai di requirement:
 *   sound: "intro_umum"  → merujuk ke AudioFiles["intro_umum"]
 *   sound: "ktp_01"      → merujuk ke AudioFiles["ktp_01"]
 *   dst.
 * ==========================================
 */

const AudioFiles = {
  "intro-1": "sounds/commons/anda-memilih.mp3",
  "intro-2": "sounds/commons/berikut-daftar-persyaratannya.mp3",

  "label-kia": "sounds/items/kia/label-kia.mp3",
  "desc-kia": "sounds/items/kia/desc-kia.mp3",

  "label-ktp": "sounds/items/ktp/label-ktp.mp3",

  "label-akta-kelahiran":
    "sounds/items/akta-kelahiran/label-akta-kelahiran.mp3",

  "label-akta-kematian": "sounds/items/akta-kematian/label-akta-kematian.mp3",

  "label-kartu-keluarga":
    "sounds/items/kartu-keluarga/label-kartu-keluarga.mp3",
  "label-kartu-keluarga-karena":
    "sounds/items/kartu-keluarga/label-kartu-keluarga-karena.mp3",

  "label-surat-pindah": "sounds/items/surat-pindah/label-surat-pindah.mp3",
  "label-surat-pindah-dk":
    "sounds/items/surat-pindah/label-surat-pindah-dk.mp3",
  "label-surat-pindah-lk":
    "sounds/items/surat-pindah/label-surat-pindah-lk.mp3",

  "label-alasan-rusak": "sounds/labels/label-alasan-rusak.mp3",
  "label-alasan-perubahan": "sounds/labels/label-alasan-perubahan.mp3",
  "label-alasan-baru": "sounds/labels/label-alasan-baru.mp3",
  "label-alasan-hilang": "sounds/labels/label-alasan-hilang.mp3",

  "p1-ktp-baru-1": "sounds/items/ktp/p1-ktp-baru-1.mp3",
  "p1-ktp-baru-2": "sounds/items/ktp/p1-ktp-baru-2.mp3",
  "p1-ktp-baru-3": "sounds/items/ktp/p1-ktp-baru-3.mp3",

  "p1-kia-baru-1": "sounds/items/kia/p1-kia-baru-1.mp3",
  "p1-kia-baru-2": "sounds/items/kia/p1-kia-baru-2.mp3",

  "p1-akta-kelahiran-baru-1":
    "sounds/items/akta-kelahiran/p1-akta-kelahiran-baru-1.mp3",
  "p1-akta-kelahiran-baru-2":
    "sounds/items/akta-kelahiran/p1-akta-kelahiran-baru-2.mp3",
  "p1-akta-kelahiran-baru-3":
    "sounds/items/akta-kelahiran/p1-akta-kelahiran-baru-3.mp3",

  "p1-akta-kematian-baru-1":
    "sounds/items/akta-kematian/p1-akta-kematian-baru-1.mp3",
  "p1-akta-kematian-baru-2":
    "sounds/items/akta-kematian/p1-akta-kematian-baru-2.mp3",
  "p1-akta-kematian-baru-3":
    "sounds/items/akta-kematian/p1-akta-kematian-baru-3.mp3",

  "p1-surat-pindah-dk-1": "sounds/items/surat-pindah/p1-surat-pindah-dk-1.mp3",
  "p1-surat-pindah-dk-2": "sounds/items/surat-pindah/p1-surat-pindah-dk-2.mp3",
  "p1-surat-pindah-dk-3": "sounds/items/surat-pindah/p1-surat-pindah-dk-3.mp3",

  "p1-kartu-keluarga-perubahan-1":
    "sounds/items/kartu-keluarga/p1-kartu-keluarga-perubahan-1.mp3",
  "p1-kartu-keluarga-perubahan-2":
    "sounds/items/kartu-keluarga/p1-kartu-keluarga-perubahan-2.mp3",
  "p1-kartu-keluarga-hilang-1":
    "sounds/items/kartu-keluarga/p1-kartu-keluarga-hilang-1.mp3",
  "p1-kartu-keluarga-rusak-1":
    "sounds/items/kartu-keluarga/p1-kartu-keluarga-rusak-1.mp3",
};

/**
 * ==========================================
 * Menu Layanan
 * ==========================================
 *
 * sound: 0 → menggunakan AudioFiles[0]
 * sound: 1 → menggunakan AudioFiles[1]
 * dst.
 * ==========================================
 */

const Menus = [
  {
    id: "kia",
    title: "Kartu Identitas Anak",
    subtitle: "Persyaratan pembuatan baru",
    // description: "",
    icon: "https://cdn-icons-png.flaticon.com/512/1006/1006771.png",
    color: "#2563EB",
    autoPlay: true,
    intro: ["intro-1", "label-kia", "desc-kia", "intro-2"],
    requirements: [
      { text: "Akta kelahiran", sound: "p1-kia-baru-1" },
      { text: "Foto anak (jika diatas 5 tahun)", sound: "p1-kia-baru-2" },
    ],
    images: [
      { src: "images/kia/kia.png", caption: "Kartu identitas anak" },
      { src: "images/informasi-1.jpeg", caption: "-" },
    ],
  },
  {
    id: "ktp",
    title: "Kartu Tanda Penduduk",
    subtitle: "Persyaratan pembuatan baru",
    // description: "",
    icon: "https://cdn-icons-png.flaticon.com/512/1006/1006771.png",
    color: "#2563EB",
    autoPlay: true,
    intro: ["intro-1", "label-ktp", "label-alasan-baru", "intro-2"],
    requirements: [
      {
        text: "Untuk pemula baru 17 tahun, belum pernah memiliki KTP-el sebelumnya",
        sound: "p1-ktp-baru-1",
      },
      { text: "Telah berusia 17 tahun atau lebih", sound: "p1-ktp-baru-2" },
      { text: "Kartu keluarga asli", sound: "p1-ktp-baru-3" },
    ],
    images: [{ src: "images/informasi-1.jpeg", caption: "-" }],
  },
  {
    id: "kartu-keluarga-perubahan",
    title: "Kartu Keluarga WNI (Perubahan)",
    subtitle: "Persyaratan untuk perubahan",
    // description: "",
    icon: "https://cdn-icons-png.flaticon.com/512/1006/1006771.png",
    color: "#2563EB",
    autoPlay: true,
    intro: [
      "intro-1",
      "label-kartu-keluarga-karena",
      "label-alasan-perubahan",
      "intro-2",
    ],
    requirements: [
      {
        text: "Kartu keluarga lama (asli)",
        sound: "p1-kartu-keluarga-perubahan-1",
      },
      {
        text: "Fotokopi bukti perubahan data (contoh: Paspor, surat pindah, ijazah, surat keterangan kerja)",
        sound: "p1-kartu-keluarga-perubahan-2",
      },
    ],
    images: [{ src: "images/informasi-1.jpeg", caption: "-" }],
  },
  {
    id: "kartu-keluarga-hilang",
    title: "Kartu Keluarga WNI (Hilang)",
    subtitle: "Persyaratan karena hilang",
    // description: "",
    icon: "https://cdn-icons-png.flaticon.com/512/1006/1006771.png",
    color: "#2563EB",
    autoPlay: true,
    intro: [
      "intro-1",
      "label-kartu-keluarga-karena",
      "label-alasan-hilang",
      "intro-2",
    ],
    requirements: [
      {
        text: "Surat kehilangan dari kepolisian (yang masih berlaku dan mencantumkan NIK & No. KK pemohon)",
        sound: "p1-kartu-keluarga-hilang-1",
      },
    ],
    images: [{ src: "images/informasi-1.jpeg", caption: "-" }],
  },
  {
    id: "kartu-keluarga-rusak",
    title: "Kartu Keluarga WNI (Rusak)",
    subtitle: "Persyaratan karena rusak",
    // description: "",
    icon: "https://cdn-icons-png.flaticon.com/512/1006/1006771.png",
    color: "#2563EB",
    autoPlay: true,
    intro: [
      "intro-1",
      "label-kartu-keluarga-karena",
      "label-alasan-rusak",
      "intro-2",
    ],
    requirements: [
      {
        text: "Kartu keluarga asli yang telah rusak",
        sound: "p1-kartu-keluarga-rusak-1",
      },
    ],
    images: [{ src: "images/informasi-1.jpeg", caption: "-" }],
  },
  {
    id: "akta-kelahiran",
    title: "Akta Kelahiran WNI",
    subtitle: "Persyaratan pembuatan baru",
    // description: "",
    icon: "https://cdn-icons-png.flaticon.com/512/1006/1006771.png",
    color: "#2563EB",
    autoPlay: true,
    intro: ["intro-1", "label-akta-kelahiran", "label-alasan-baru", "intro-2"],
    requirements: [
      {
        text: "Fotokopi surat keterangan kelahiran dari fasilitas kesehatan/kelurahan/nahkoda kapal/kapten pesawat",
        sound: "p1-akta-kelahiran-baru-1",
      },
      {
        text: "Fotokopi buku nikah atau akta perkawinan",
        sound: "p1-akta-kelahiran-baru-2",
      },
      { text: "Kartu keluarga asli", sound: "p1-akta-kelahiran-baru-3" },
    ],
    images: [{ src: "images/informasi-1.jpeg", caption: "-" }],
  },
  {
    id: "akta-kematian",
    title: "Akta Kematian WNI",
    subtitle: "Persyaratan pembuatan baru",
    // description: "",
    icon: "https://cdn-icons-png.flaticon.com/512/1006/1006771.png",
    color: "#2563EB",
    autoPlay: true,
    intro: ["intro-1", "label-akta-kematian", "label-alasan-baru", "intro-2"],
    requirements: [
      {
        text: "Fotokopi surat keterangan kematian dari fasilitas kesehatan/kelurahan/polisi/maskapai/KBRI",
        sound: "p1-akta-kematian-baru-1",
      },
      {
        text: "KTP elektronik asli",
        sound: "p1-akta-kematian-baru-2",
      },
      { text: "Kartu keluarga asli", sound: "p1-akta-kematian-baru-3" },
    ],
    images: [{ src: "images/informasi-1.jpeg", caption: "-" }],
  },
  {
    id: "surat-pindah",
    title: "Surat Keterangan Pindah Warga Negara Indonesia",
    subtitle: "Persyaratan pindah dalam kota",
    // description: "",
    icon: "https://cdn-icons-png.flaticon.com/512/1006/1006771.png",
    color: "#2563EB",
    autoPlay: true,
    intro: ["intro-1", "label-surat-pindah-dk", "intro-2"],
    requirements: [
      {
        text: "Mengisi formulir perpindahan F 1.03",
        sound: "p1-surat-pindah-dk-1",
      },
      {
        text: "Kartu keluarga lama (asli)",
        sound: "p1-surat-pindah-dk-2",
      },
      { text: "KTP elektronik asli", sound: "p1-surat-pindah-dk-3" },
    ],
    images: [{ src: "images/informasi-1.jpeg", caption: "-" }],
  },
];
