export const landingCopy = {
  header: {
    brand: "Undangan Digital",
    login: "Masuk",
    register: "Daftar",
  },
  hero: {
    eyebrow: "Platform undangan pernikahan",
    titleBefore: "Undangan digital yang",
    titleAfter: "&",
    titleAccentIndah: "indah",
    titleAccentMakna: "penuh makna",
    subtitle:
      "Buat undangan pernikahan dengan palet warna romantis, kelola tamu, dan terima RSVP — semua dalam satu dashboard yang mudah.",
    ctaPrimary: "Mulai gratis",
    ctaSecondary: "Sudah punya akun",
  },
  gallery: {
    eyebrow: "Momen spesial",
    title: "Setiap detail berarti",
  },
  features: {
    eyebrow: "Kenapa kami",
    title: "Semua yang kamu butuhkan",
    items: [
      {
        key: "theme",
        title: "Tema sesuai gaya kamu",
        desc: "Pilih palet warna dan motif undangan — dari klasik hingga modern. Setiap pasangan punya cerita unik.",
        accent: "pink" as const,
        imageKey: "theme" as const,
      },
      {
        key: "events",
        title: "Multi-acara",
        desc: "Akad, resepsi, siraman, pengajian — semua rangkaian acara dalam satu undangan yang rapi.",
        accent: "green" as const,
      },
      {
        key: "rsvp",
        title: "RSVP & ucapan",
        desc: "Tamu konfirmasi kehadiran dan kirim doa langsung. Kamu pantau semuanya dari dashboard.",
        accent: "pink" as const,
        imageKey: "rsvp" as const,
      },
      {
        key: "share",
        title: "Bagikan mudah",
        desc: "Link personal dan WhatsApp untuk setiap tamu — tanpa ribet salin-tempel berulang.",
        accent: "green" as const,
      },
    ],
  },
  theme: {
    badge: "Tema undangan terpisah",
    title: "Undanganmu, warnamu",
    body: "Dashboard memakai palet pink-sage platform kami. Setiap undangan punya tema warna sendiri — pilih dari koleksi gratis atau tema premium sesuai gaya pernikahanmu.",
    bullets: [
      "Tema gratis untuk memulai dengan cepat",
      "Tema premium dengan palet & motif eksklusif",
      "Warna kustom per undangan — terpisah dari tampilan dashboard",
    ],
  },
  steps: {
    eyebrow: "Cara kerja",
    title: "Tiga langkah sederhana",
    items: [
      {
        key: "create",
        num: "01",
        title: "Daftar & buat undangan",
        desc: "Isi detail mempelai, pilih tema, dan atur jadwal acara.",
      },
      {
        key: "customize",
        num: "02",
        title: "Kustomisasi",
        desc: "Unggah foto, musik, dan sesuaikan warna sesuai paket tema kamu.",
      },
      {
        key: "share",
        num: "03",
        title: "Bagikan ke tamu",
        desc: "Kirim link personal — tamu buka, RSVP, dan kirim ucapan.",
      },
    ],
  },
  cta: {
    title: "Siap buat undangan pertamamu?",
    body: "Bergabung dengan pasangan yang sudah mempercayakan momen spesial mereka pada kami.",
    button: "Buat undangan gratis",
  },
  footer: {
    brand: "Undangan Digital",
    copyright: "Platform undangan pernikahan Indonesia",
    photoCreditPrefix: "Foto oleh",
    photoCreditSuffix: "di Unsplash",
  },
  envelopeDemo: {
    groomName: "Rizky",
    brideName: "Aisha",
    recipientName: "Kamu",
    headerText: "Undangan Pernikahan",
    hintText: "Arahkan kursor ke amplop untuk lihat pratinjau",
  },
} as const;
