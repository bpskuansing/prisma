document.addEventListener('DOMContentLoaded', () => {
    const riskTableBody = document.getElementById('risk-table-body');
    const addRiskForm = document.getElementById('add-risk-form');
    
    // Navigation Buttons
    const showRiskListBtn = document.getElementById('show-risk-list-btn');
    const showAddRiskBtn = document.getElementById('show-add-risk-btn');
    const showGuidelinesBtn = document.getElementById('show-guidelines-btn');

    // Page Containers
    const riskListContainer = document.getElementById('risk-list-container');
    const addRiskContainer = document.getElementById('add-risk-container');
    const guidelinesContainer = document.getElementById('guidelines-container');

    // Matriks Analisis Risiko berdasarkan referensi (P, D) -> Skor
    const riskMatrix = {
        1: [1,  3,  5,  8, 20],
        2: [2,  7, 11, 13, 21],
        3: [4, 10, 14, 17, 22],
        4: [6, 12, 16, 19, 24],
        5: [9, 15, 18, 23, 25],
    };

    const getRiskScore = (prob, impact) => {
        if (prob >= 1 && prob <= 5 && impact >= 1 && impact <= 5) {
            return riskMatrix[prob][impact - 1];
        }
        return 0; // default value
    };
    
    // Data awal dari file Rangkuman Identifikasi Risiko 2025
    const initialRisks = [
        { id: 1, pemilikRisiko: "Subbag Umum", pernyataanRisiko: "Revisi DIPA terhadap kelebihan penggunaan dana Sarana dan Prasarana tidak dilakukan secara optimal", penyebabDampak: "Penyebab: Keterlambatan melakukan revisi DIPA. Dampak: Penyerapan anggaran tidak maksimal", kategoriRisiko: "Risiko Kepatuhan", sumberRisiko: "Internal", probabilitas: 2, dampak: 3, pengendalian: "Perlunya pengawasan dari KPA, PPK, Kasubag Umum", responRisiko: "Mengurangi Risiko", prioritas: "" },
        { id: 2, pemilikRisiko: "Subbag Umum", pernyataanRisiko: "Usulan pengadaan sarana dan prasarana Satker melalui pengisian RKBMN dan iPLAN tidak lengkap", penyebabDampak: "Penyebab: Penyusunan RAB dan Penawaran dari rekanan yang proses mendapatkannya sulit. Dampak: Pengadaan barang dan jasa terhambat", kategoriRisiko: "Risiko Operasional", sumberRisiko: "Internal", probabilitas: 1, dampak: 4, pengendalian: "Perlunya pengawasan dari KPA, PPK, Kasubag Umum", responRisiko: "Mengurangi Risiko", prioritas: "" },
        { id: 3, pemilikRisiko: "Subbag Umum", pernyataanRisiko: "Penyusunan laporan keuangan terlambat", penyebabDampak: "Penyebab: Proses input data persediaan dan SIMAK belum selesai dilakukan. Dampak: Laporan keuangan tidak selesai tepat waktu", kategoriRisiko: "Risiko Operasional", sumberRisiko: "Internal", probabilitas: 1, dampak: 4, pengendalian: "Perlunya pengawasan dari KPA, PPK, Kasubag Umum", responRisiko: "Mengurangi Risiko", prioritas: "" },
        { id: 4, pemilikRisiko: "Subbag Umum", pernyataanRisiko: "Pelanggaran terhadap aturan disiplin PNS PP Nomor 94 Tahun 2021", penyebabDampak: "Penyebab: PNS bersangkutan kurang memaknai PP Nomor 94 Tahun 2021. Dampak: PNS bersangkutan dikenakan sanksi sesuai PP Nomor 94 Tahun 2021", kategoriRisiko: "Risiko Kepatuhan", sumberRisiko: "Internal", probabilitas: 1, dampak: 3, pengendalian: "Perlunya pengawasan dari KPA, PPK, Kasubag Umum", responRisiko: "Mengurangi Risiko", prioritas: "" },
        { id: 5, pemilikRisiko: "Subbag Umum", pernyataanRisiko: "Pengelolaan arsip kurang optimal", penyebabDampak: "Penyebab: Kurangnya pemahaman pegawai tentang pengelolaan arsip. Dampak: Pengelolaan arsip tidak sesuai standar", kategoriRisiko: "Risiko Operasional", sumberRisiko: "Internal", probabilitas: 2, dampak: 2, pengendalian: "Pelatihan pegawai tentang pengelolaan arsip", responRisiko: "Mengurangi Risiko", prioritas: "" },
        { id: 6, pemilikRisiko: "Tim VHTS", pernyataanRisiko: "Rekapitulasi identifikasi daftar sampel dan assignment sampel tidak sesuai target", penyebabDampak: "Penyebab: Tim VHTS Kabupaten kesulitan dalam mengidentifikasi dan mengalokasi. Dampak: Pembagian tugas lapangan kurang efektif, pendataan tertunda", kategoriRisiko: "Risiko Operasional", sumberRisiko: "Internal", probabilitas: 2, dampak: 2, pengendalian: "Dilaksanakan lebih awal", responRisiko: "Menerima Risiko", prioritas: "" },
        { id: 7, pemilikRisiko: "Tim VHTS", pernyataanRisiko: "Terjadinya kekurangan instrumen atau instrumen yang dikirim tidak sesuai", penyebabDampak: "Penyebab: Kelalaian Tim VHTS Kabupaten. Dampak: Proses pendataan tertunda", kategoriRisiko: "Risiko Operasional", sumberRisiko: "Internal", probabilitas: 2, dampak: 2, pengendalian: "Pengecekan ulang sebelum instrumen dikirim", responRisiko: "Menerima Risiko", prioritas: "" },
        { id: 8, pemilikRisiko: "Tim VHTS", pernyataanRisiko: "Pelaksanaan pelatihan petugas kurang optimal", penyebabDampak: "Penyebab: Pelatihan dilakukan secara online. Dampak: Petugas tidak memahami materi pelatihan secara maksimal", kategoriRisiko: "Risiko Operasional", sumberRisiko: "Internal", probabilitas: 2, dampak: 2, pengendalian: "Membebaskan petugas dari berbagai tugas di saat pengajaran", responRisiko: "Menerima Risiko", prioritas: "" },
        { id: 9, pemilikRisiko: "Tim VHTS", pernyataanRisiko: "Progress pendataan tidak sesuai target", penyebabDampak: "Penyebab: Responden sulit ditemui. Dampak: Pendataan terlambat selesai", kategoriRisiko: "Risiko Operasional", sumberRisiko: "Eksternal", probabilitas: 2, dampak: 3, pengendalian: "Reminder pelaksanaan pendataan", responRisiko: "Menerima Risiko", prioritas: "" },
        { id: 10, pemilikRisiko: "Tim VHTS", pernyataanRisiko: "Evaluasi kualitas data kurang optimal", penyebabDampak: "Penyebab: Kekurangan waktu. Dampak: Data tidak berkualitas", kategoriRisiko: "Risiko Operasional", sumberRisiko: "Internal dan Eksternal", probabilitas: 2, dampak: 3, pengendalian: "Membuat anomali tambahan untuk memeriksa kewajaran data", responRisiko: "Mengurangi Risiko", prioritas: "" },
        { id: 11, pemilikRisiko: "Tim VHTS", pernyataanRisiko: "Pelaksanaan rilis data kurang optimal", penyebabDampak: "Penyebab: Pusat terlambat dalam menshare data. Dampak: Ditemukan kesalahan, typo, dan sebagainya", kategoriRisiko: "Risiko Operasional", sumberRisiko: "Internal", probabilitas: 5, dampak: 1, pengendalian: "Membagi tugas dalam penyusunan BRS dan Bahan Tayang Rilis", responRisiko: "Menerima Risiko", prioritas: "" },
        { id: 12, pemilikRisiko: "Tim VHTS", pernyataanRisiko: "Penyusunan publikasi kurang optimal", penyebabDampak: "Penyebab: Beban pekerjaan yang banyak. Dampak: Publikasi kurang berkualitas", kategoriRisiko: "Risiko Operasional", sumberRisiko: "Internal", probabilitas: 2, dampak: 2, pengendalian: "Mengatur jadwal penyusunan publikasi pada waktu yang kurang sibuk", responRisiko: "Menerima Risiko", prioritas: "" },
        { id: 13, pemilikRisiko: "Tim PSS", pernyataanRisiko: "Kurangnya pemahaman materi ketua tim pembina", penyebabDampak: "Penyebab: Pelatihan dilakukan secara online. Dampak: Ketua tim Pembina tidak memahami materi pelatihan secara maksimal", kategoriRisiko: "Risiko Operasional", sumberRisiko: "Internal", probabilitas: 2, dampak: 2, pengendalian: "Membebaskan petugas dari berbagai tugas di saat pengajaran", responRisiko: "Mengurangi Risiko", prioritas: "" },
        { id: 14, pemilikRisiko: "Tim PSS", pernyataanRisiko: "Kurangnya pemahaman materi anggota tim pembina", penyebabDampak: "Penyebab: Keterbatasan waktu internalisasi. Dampak: Anggota tim Pembina tidak memahami materi pelatihan secara maksimal", kategoriRisiko: "Risiko Operasional", sumberRisiko: "Internal", probabilitas: 2, dampak: 2, pengendalian: "Melaksanakan internalisasi di waktu yang lebih leluasa", responRisiko: "Mengurangi Risiko", prioritas: "" },
        { id: 15, pemilikRisiko: "Tim PSS", pernyataanRisiko: "Hasil identifikasi narahubung dan kegiatan statistik kurang optimal", penyebabDampak: "Penyebab: Kurangnya koordinasi antara walidata dengan produsen data. Dampak: Hasil identifikasi kurang akurat dan tidak lengkap", kategoriRisiko: "Risiko Operasional", sumberRisiko: "Eksternal", probabilitas: 2, dampak: 4, pengendalian: "Membina walidata dalam pelaksanaan identifikasi kegiatan statistik", responRisiko: "Mengurangi Risiko", prioritas: "" },
        { id: 16, pemilikRisiko: "Tim PSS", pernyataanRisiko: "Rencana kerja tidak tersusun", penyebabDampak: "Penyebab: Keterbatasan waktu. Dampak: Rencana kerja tidak tersusun secara maksimal", kategoriRisiko: "Risiko Operasional", sumberRisiko: "Internal", probabilitas: 2, dampak: 4, pengendalian: "Menentukan fokus tema pembinaan", responRisiko: "Mengurangi Risiko", prioritas: "" },
        { id: 17, pemilikRisiko: "Tim PSS", pernyataanRisiko: "Rencana kerja tidak terealisasi", penyebabDampak: "Penyebab: Peserta pembinaan tidak bisa hadir. Dampak: Rencana kerja tidak terealisasi secara maksimal", kategoriRisiko: "Risiko Operasional", sumberRisiko: "Internal dan Eksternal", probabilitas: 2, dampak: 4, pengendalian: "Menyusun matriks kegiatan pembinaan", responRisiko: "Mengurangi Risiko", prioritas: "" },
        { id: 18, pemilikRisiko: "Tim PSS", pernyataanRisiko: "Capaian TPSS dibawah target", penyebabDampak: "Penyebab: Kurangnya kontrol dari kepala satker dan ketua tim. Dampak: Capaian TPSS dibawah target", kategoriRisiko: "Risiko Operasional", sumberRisiko: "Internal", probabilitas: 2, dampak: 4, pengendalian: "Melaporkan monev rutin kegiatan pembinaan kepada kepala satker", responRisiko: "Mengurangi Risiko", prioritas: "" },
        { id: 19, pemilikRisiko: "Tim PSS", pernyataanRisiko: "Penyusunan laporan kurang optimal", penyebabDampak: "Penyebab: Banyaknya beban pekerjaan. Dampak: Publikasi kurang berkualitas", kategoriRisiko: "Risiko Operasional", sumberRisiko: "Internal", probabilitas: 2, dampak: 2, pengendalian: "Mengatur beban kerja sesuai dengan prioritas", responRisiko: "Mengurangi Risiko", prioritas: "" },
        { id: 20, pemilikRisiko: "Tim Perkebunan", pernyataanRisiko: "Rekapitulasi identifikasi daftar sampel dan assignment sampel tidak sesuai target", penyebabDampak: "Penyebab: Tim Kabupaten kesulitan dalam mengidentifikasi dan mengalokasi. Dampak: Pembagian tugas lapangan kurang efektif, pendataan tertunda", kategoriRisiko: "Risiko Operasional", sumberRisiko: "Internal", probabilitas: 2, dampak: 2, pengendalian: "Dilaksanakan lebih awal", responRisiko: "Menerima Risiko", prioritas: "" },
        { id: 21, pemilikRisiko: "Tim Perkebunan", pernyataanRisiko: "Terjadinya kekurangan instrumen atau instrumen yang dikirim tidak sesuai", penyebabDampak: "Penyebab: Kelalaian Tim Kabupaten. Dampak: Proses pendataan tertunda", kategoriRisiko: "Risiko Operasional", sumberRisiko: "Internal", probabilitas: 2, dampak: 2, pengendalian: "Pengecekan ulang sebelum instrumen dikirim", responRisiko: "Menerima Risiko", prioritas: "" },
        { id: 22, pemilikRisiko: "Tim Perkebunan", pernyataanRisiko: "Pelaksanaan pelatihan petugas kurang optimal", penyebabDampak: "Penyebab: Pelatihan dilakukan secara online. Dampak: Petugas tidak memahami materi pelatihan secara maksimal", kategoriRisiko: "Risiko Operasional", sumberRisiko: "Internal", probabilitas: 2, dampak: 2, pengendalian: "Membebaskan petugas dari berbagai tugas di saat pengajaran", responRisiko: "Menerima Risiko", prioritas: "" },
        { id: 23, pemilikRisiko: "Tim Perkebunan", pernyataanRisiko: "Progress pendataan tidak sesuai target", penyebabDampak: "Penyebab: Responden sulit ditemui. Dampak: Pendataan terlambat selesai", kategoriRisiko: "Risiko Operasional", sumberRisiko: "Eksternal", probabilitas: 2, dampak: 2, pengendalian: "Reminder pelaksanaan pendataan", responRisiko: "Menerima Risiko", prioritas: "" },
        { id: 24, pemilikRisiko: "Tim Perkebunan", pernyataanRisiko: "Evaluasi kualitas data kurang optimal", penyebabDampak: "Penyebab: Kekurangan waktu. Dampak: Data tidak berkualitas", kategoriRisiko: "Risiko Operasional", sumberRisiko: "Internal", probabilitas: 2, dampak: 2, pengendalian: "Membuat anomali tambahan untuk memeriksa kewajaran data", responRisiko: "Menerima Risiko", prioritas: "" },
        { id: 25, pemilikRisiko: "Tim IPDS", pernyataanRisiko: "Pelayanan PST tidak sesuai standar", penyebabDampak: "Penyebab: SDM PST terbatas. Dampak: Konsumen tidak puas", kategoriRisiko: "Risiko Reputasi", sumberRisiko: "Internal", probabilitas: 2, dampak: 3, pengendalian: "Menyusun jadwal piket PST yang optimal", responRisiko: "Mengurangi Risiko", prioritas: "" },
        { id: 26, pemilikRisiko: "Tim IPDS", pernyataanRisiko: "Data yang diminta tidak tersedia di BPS", penyebabDampak: "Penyebab: Data yang diminta merupakan data dari instansi lain. Dampak: Konsumen tidak puas", kategoriRisiko: "Risiko Reputasi", sumberRisiko: "Eksternal", probabilitas: 2, dampak: 3, pengendalian: "Memberikan informasi mengenai data yang tersedia di BPS", responRisiko: "Mengurangi Risiko", prioritas: "" },
        { id: 27, pemilikRisiko: "Tim IPDS", pernyataanRisiko: "Pelayanan perpustakaan tidak sesuai standar", penyebabDampak: "Penyebab: SDM dan sarana prasarana terbatas. Dampak: Pengunjung tidak puas", kategoriRisiko: "Risiko Reputasi", sumberRisiko: "Internal", probabilitas: 2, dampak: 2, pengendalian: "Pengajuan sarana prasarana yang lebih baik", responRisiko: "Mengurangi Risiko", prioritas: "" },
        { id: 28, pemilikRisiko: "Tim IPDS", pernyataanRisiko: "Metadata tidak terisi lengkap", penyebabDampak: "Penyebab: Deskripsi isian pada aplikasi kurang jelas. Dampak: Kualitas metadata kurang baik", kategoriRisiko: "Risiko Operasional", sumberRisiko: "Internal", probabilitas: 3, dampak: 2, pengendalian: "Koordinasi dengan BPS Provinsi", responRisiko: "Mengurangi Risiko", prioritas: "" },
        { id: 29, pemilikRisiko: "Tim IPDS", pernyataanRisiko: "Pengelolaan website kurang optimal", penyebabDampak: "Penyebab: Keterbatasan SDM. Dampak: Website kurang update", kategoriRisiko: "Risiko Operasional", sumberRisiko: "Internal", probabilitas: 3, dampak: 3, pengendalian: "Pengoptimalan peran admin website", responRisiko: "Mengurangi Risiko", prioritas: "" },
        { id: 30, pemilikRisiko: "Tim Nerwilis", pernyataanRisiko: "Publikasi DDA tidak terbit tepat waktu", penyebabDampak: "Penyebab: Keterlambatan data dari OPD. Dampak: Publikasi terlambat rilis", kategoriRisiko: "Risiko Operasional", sumberRisiko: "Eksternal", probabilitas: 4, dampak: 4, pengendalian: "Koordinasi dan follow up secara berkala ke OPD", responRisiko: "Mengurangi Risiko", prioritas: "" },
        { id: 31, pemilikRisiko: "Tim Nerwilis", pernyataanRisiko: "Salah dalam melakukan estimasi PDRB", penyebabDampak: "Penyebab: Kesalahan dalam perhitungan. Dampak: Data PDRB tidak akurat", kategoriRisiko: "Risiko Operasional", sumberRisiko: "Internal", probabilitas: 2, dampak: 5, pengendalian: "Pemeriksaan dan evaluasi berjenjang", responRisiko: "Mengurangi Risiko", prioritas: "" },
        { id: 32, pemilikRisiko: "Tim Nerwilis", pernyataanRisiko: "Tidak tersedianya data series PDRB tahun dasar terbaru", penyebabDampak: "Penyebab: Keterlambatan rilis dari pusat. Dampak: Analisis PDRB terhambat", kategoriRisiko: "Risiko Operasional", sumberRisiko: "Internal", probabilitas: 3, dampak: 4, pengendalian: "Follow up ke BPS Provinsi dan Pusat", responRisiko: "Mengurangi Risiko", prioritas: "" },
        { id: 33, pemilikRisiko: "Tim Nerwilis", pernyataanRisiko: "Berita Resmi Statistik (BRS) tidak terbit tepat waktu", penyebabDampak: "Penyebab: Keterlambatan data dari BPS Pusat. Dampak: BRS terlambat rilis", kategoriRisiko: "Risiko Operasional", sumberRisiko: "Internal", probabilitas: 3, dampak: 3, pengendalian: "Follow up ke BPS Provinsi dan Pusat", responRisiko: "Mengurangi Risiko", prioritas: "" },
        { id: 34, pemilikRisiko: "Tim Sosial", pernyataanRisiko: "Rekapitulasi identifikasi daftar sampel dan assignment sampel tidak sesuai target", penyebabDampak: "Penyebab: Tim Kabupaten kesulitan dalam mengidentifikasi dan mengalokasi. Dampak: Pembagian tugas lapangan kurang efektif, pendataan tertunda", kategoriRisiko: "Risiko Operasional", sumberRisiko: "Internal", probabilitas: 2, dampak: 2, pengendalian: "Dilaksanakan lebih awal", responRisiko: "Mengurangi Risiko", prioritas: "" },
        { id: 35, pemilikRisiko: "Tim Sosial", pernyataanRisiko: "Terjadinya kekurangan instrumen atau instrumen yang dikirim tidak sesuai", penyebabDampak: "Penyebab: Kelalaian Tim Kabupaten. Dampak: Proses pendataan tertunda", kategoriRisiko: "Risiko Operasional", sumberRisiko: "Internal", probabilitas: 2, dampak: 2, pengendalian: "Pengecekan ulang sebelum instrumen dikirim", responRisiko: "Mengurangi Risiko", prioritas: "" },
        { id: 36, pemilikRisiko: "Tim Sosial", pernyataanRisiko: "Pelaksanaan pelatihan petugas kurang optimal", penyebabDampak: "Penyebab: Pelatihan dilakukan secara online. Dampak: Petugas tidak memahami materi pelatihan secara maksimal", kategoriRisiko: "Risiko Operasional", sumberRisiko: "Internal", probabilitas: 2, dampak: 3, pengendalian: "Membebaskan petugas dari berbagai tugas di saat pengajaran", responRisiko: "Mengurangi Risiko", prioritas: "" },
        { id: 37, pemilikRisiko: "Tim Sosial", pernyataanRisiko: "Progress pendataan tidak sesuai target", penyebabDampak: "Penyebab: Responden sulit ditemui. Dampak: Pendataan terlambat selesai", kategoriRisiko: "Risiko Operasional", sumberRisiko: "Eksternal", probabilitas: 3, dampak: 3, pengendalian: "Reminder pelaksanaan pendataan", responRisiko: "Mengurangi Risiko", prioritas: "" },
        { id: 38, pemilikRisiko: "Tim Sosial", pernyataanRisiko: "Evaluasi kualitas data kurang optimal", penyebabDampak: "Penyebab: Kekurangan waktu. Dampak: Data tidak berkualitas", kategoriRisiko: "Risiko Operasional", sumberRisiko: "Internal dan Eksternal", probabilitas: 3, dampak: 3, pengendalian: "Membuat anomali tambahan untuk memeriksa kewajaran data", responRisiko: "Mengurangi Risiko", prioritas: "" },
        { id: 39, pemilikRisiko: "Tim Sosial", pernyataanRisiko: "Penyusunan publikasi kurang optimal", penyebabDampak: "Penyebab: Banyaknya beban pekerjaan. Dampak: Publikasi kurang berkualitas", kategoriRisiko: "Risiko Operasional", sumberRisiko: "Internal", probabilitas: 2, dampak: 2, pengendalian: "Mengatur jadwal penyusunan publikasi pada waktu yang kurang sibuk", responRisiko: "Mengurangi Risiko", prioritas: "" },
        { id: 40, pemilikRisiko: "Tim Teknis", pernyataanRisiko: "Progress pendataan tidak sesuai target", penyebabDampak: "Penyebab: Responden sulit ditemui. Dampak: Anggaran kurang mencukupi", kategoriRisiko: "Risiko Operasional", sumberRisiko: "Internal dan Eksternal", probabilitas: 3, dampak: 4, pengendalian: "Melakukan pemeriksaan menggunakan anggaran survei lainnya", responRisiko: "Mengurangi Risiko", prioritas: "" },
        { id: 41, pemilikRisiko: "Tim Teknis", pernyataanRisiko: "Pendataan pada wilayah sampel sulit tidak terlaksana", penyebabDampak: "Penyebab: Anggaran kurang mencukupi. Dampak: Kurangnya kualitas data", kategoriRisiko: "Risiko Keuangan", sumberRisiko: "Internal", probabilitas: 2, dampak: 2, pengendalian: "Mengutamakan pemeriksaan pada daerah sulit", responRisiko: "Mengurangi Risiko", prioritas: "" },
        { id: 42, pemilikRisiko: "Tim Teknis", pernyataanRisiko: "Evaluasi kualitas data kurang optimal", penyebabDampak: "Penyebab: Kekurangan waktu. Dampak: Data tidak berkualitas", kategoriRisiko: "Risiko Operasional", sumberRisiko: "Internal dan Eksternal", probabilitas: 3, dampak: 2, pengendalian: "Membuat anomali tambahan untuk memeriksa kewajaran data", responRisiko: "Mengurangi Risiko", prioritas: "" },
        { id: 43, pemilikRisiko: "Tim Teknis", pernyataanRisiko: "Penyusunan laporan/publikasi kurang optimal", penyebabDampak: "Penyebab: Banyaknya beban pekerjaan. Dampak: Laporan/Publikasi kurang berkualitas", kategoriRisiko: "Risiko Operasional", sumberRisiko: "Internal", probabilitas: 2, dampak: 2, pengendalian: "Mengatur jadwal penyusunan laporan/publikasi pada waktu yang kurang sibuk", responRisiko: "Mengurangi Risiko", prioritas: "" },
        { id: 44, pemilikRisiko: "Pojok Statistik", pernyataanRisiko: "Evaluasi Pojok Statistik kurang maksimal", penyebabDampak: "Penyebab: Sarana prasarana kurang sesuai standar. Dampak: Nilai hasil evaluasi kurang maksimal", kategoriRisiko: "Risiko Operasional", sumberRisiko: "Internal", probabilitas: 4, dampak: 2, pengendalian: "Melaksanakan agenda kegiatan Pojok Statistik 2025", responRisiko: "Mengurangi Risiko", prioritas: "" },
        { id: 45, pemilikRisiko: "Kehumasan", pernyataanRisiko: "Proses produksi membuat konten memakan waktu lama", penyebabDampak: "Penyebab: Keterbatasan SDM untuk proses produksi. Dampak: Konten terlambat diunggah", kategoriRisiko: "Risiko Operasional", sumberRisiko: "Internal", probabilitas: 3, dampak: 3, pengendalian: "Penggunaan akun oleh orang yang memang diberi tanggungjawab sesuai jadwal sebagai editor", responRisiko: "Mengurangi Risiko", prioritas: "" }
    ];

    const loadRisks = () => {
        const risks = localStorage.getItem('prismaRisks');
        return risks ? JSON.parse(risks) : initialRisks;
    };

    let risks = loadRisks();

    const saveRisks = () => {
        localStorage.setItem('prismaRisks', JSON.stringify(risks));
    };

    const renderTable = () => {
        riskTableBody.innerHTML = '';
        if (risks.length === 0) {
            riskTableBody.innerHTML = '<tr><td colspan="13" style="text-align:center;">Belum ada data risiko.</td></tr>';
            return;
        }

        risks.forEach((risk, index) => {
            const score = getRiskScore(risk.probabilitas, risk.dampak);
            const row = `
                <tr>
                    <td>${index + 1}</td>
                    <td>${risk.pemilikRisiko}</td>
                    <td>${risk.pernyataanRisiko}</td>
                    <td>${risk.penyebabDampak}</td>
                    <td>${risk.kategoriRisiko}</td>
                    <td>${risk.sumberRisiko}</td>
                    <td>${risk.probabilitas}</td>
                    <td>${risk.dampak}</td>
                    <td>${score}</td>
                    <td>${risk.pengendalian}</td>
                    <td>${risk.responRisiko}</td>
                    <td>${risk.prioritas}</td>
                    <td><button class="delete-btn" data-id="${risk.id}">Hapus</button></td>
                </tr>
            `;
            riskTableBody.innerHTML += row;
        });
    };

    addRiskForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const newRisk = {
            id: Date.now(),
            pemilikRisiko: document.getElementById('pemilik-risiko').value,
            pernyataanRisiko: document.getElementById('pernyataan-risiko').value,
            penyebabDampak: document.getElementById('penyebab-dampak').value,
            kategoriRisiko: document.getElementById('kategori-risiko').value,
            sumberRisiko: document.getElementById('sumber-risiko').value,
            probabilitas: parseInt(document.getElementById('probabilitas').value),
            dampak: parseInt(document.getElementById('dampak').value),
            pengendalian: document.getElementById('pengendalian').value,
            responRisiko: document.getElementById('respon-risiko').value,
            prioritas: parseInt(document.getElementById('prioritas').value)
        };
        risks.push(newRisk);
        saveRisks();
        renderTable();
        addRiskForm.reset();
        alert('Risiko baru berhasil ditambahkan!');
        switchView('list');
    });

    riskTableBody.addEventListener('click', (e) => {
        if (e.target.classList.contains('delete-btn')) {
            const riskId = parseInt(e.target.getAttribute('data-id'));
            if (confirm('Apakah Anda yakin ingin menghapus risiko ini?')) {
                risks = risks.filter(risk => risk.id !== riskId);
                saveRisks();
                renderTable();
            }
        }
    });

    // Fungsi untuk berganti tampilan
    const switchView = (view) => {
        // Sembunyikan semua container
        riskListContainer.classList.add('hidden');
        addRiskContainer.classList.add('hidden');
        guidelinesContainer.classList.add('hidden');
        // Nonaktifkan semua tombol
        showRiskListBtn.classList.remove('active');
        showAddRiskBtn.classList.remove('active');
        showGuidelinesBtn.classList.remove('active');

        // Tampilkan container dan aktifkan tombol yang sesuai
        if (view === 'add') {
            addRiskContainer.classList.remove('hidden');
            showAddRiskBtn.classList.add('active');
        } else if (view === 'guidelines') {
            guidelinesContainer.classList.remove('hidden');
            showGuidelinesBtn.classList.add('active');
        } else { // 'list'
            riskListContainer.classList.remove('hidden');
            showRiskListBtn.classList.add('active');
        }
    };
    
    showRiskListBtn.addEventListener('click', () => switchView('list'));
    showAddRiskBtn.addEventListener('click', () => switchView('add'));
    showGuidelinesBtn.addEventListener('click', () => switchView('guidelines'));

    // Initial render
    renderTable();
    if (!localStorage.getItem('prismaRisks')) {
        saveRisks();
    }
});