# BCG Credit Scoring System - Setup & Running Guide

Panduan lengkap untuk setup dan menjalankan aplikasi BCG Credit Scoring System.

## Prasyarat

- **Node.js** (v14 atau lebih baru)
- **MySQL Server** (v5.7 atau lebih baru)
- **npm** atau **yarn**
- **Visual Studio Code** (optional, tapi recommended)
- **Laragon** (untuk local development environment)

## Step 1: Database Setup

### Menggunakan Laragon

1. Buka Laragon dan pastikan MySQL service running
2. Klik "MySQL" → "Open MySQL Console"
3. Atau gunakan MySQL Workbench dari Laragon

### Membuat Database

```sql
-- Buka MySQL terminal/console
mysql -u root -p

-- Kemudian jalankan:
CREATE DATABASE bcg_scoring;
USE bcg_scoring;
source /path/to/bcg/database_schema.sql;
```

Atau gunakan phpMyAdmin (default di Laragon):
- Buka http://localhost/phpmyadmin
- Buat database baru dengan nama `bcg_scoring`
- Import file `database_schema.sql`

**Default User untuk Login:**
- Username: `admin`
- Password: `admin123`

## Step 2: Backend Setup

### 1. Navigate ke Project Directory

```bash
cd /Users/vinson/Downloads/bcg
```

### 2. Install Dependencies

```bash
npm install
```

Ini akan menginstall semua packages yang diperlukan:
- Express (framework HTTP)
- MySQL2 (database connector)
- JWT (authentication)
- ExcelJS (export Excel)
- Dan lainnya

### 3. Setup Environment Variables

```bash
# Copy example file
cp .env.example .env

# Edit .env dengan editor pilihan Anda
# Sesuaikan konfigurasi database:
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=
DB_NAME=bcg_scoring
DB_PORT=3306
JWT_SECRET=your_jwt_secret_key_here
PORT=3000
NODE_ENV=development
```

### 4. Jalankan Backend

**Development Mode (dengan auto-restart):**
```bash
npm run dev
```

**Production Mode:**
```bash
npm start
```

Server akan berjalan di: `http://localhost:3000`

## Step 3: Frontend Setup

Frontend sudah ter-setup dalam project dan tidak memerlukan build khusus. File-file static HTML, CSS, dan JavaScript sudah siap untuk diakses.

## Step 4: Akses Aplikasi

1. Buka browser
2. Navigasi ke: `http://localhost:3000`
3. Login dengan credentials:
   - Username: `admin`
   - Password: `admin123`

## Fitur-Fitur Utama

### 1. Login Page
- Username & password authentication
- JWT token-based session
- Dark/Light mode toggle
- Responsive design

### 2. Assessment Form (3 Steps)
**Step 1: Business Information**
- Nama Perusahaan
- Tipe Bisnis
- Nama Produk
- Tanggal Assessment
- Informasi Pemohon

**Step 2: 5C Assessment Scoring**
- **Character (30%)**: 4 sub-indikator
  - Kemauan Berusaha
  - Integritas/Kejujuran
  - Risiko Personal
  - Hubungan Sosial & Regulasi

- **Capacity (25%)**: 6 sub-indikator
  - Kemampuan Mengelola
  - Pengalaman Usaha
  - Kapasitas Produksi
  - Biaya dan Produktivitas
  - Sarana Pendukung
  - Penjualan & Laba

- **Capital (15%)**: 4 sub-indikator
  - Posisi Modal
  - Posisi Hutang
  - Setoran Modal Pribadi
  - Piutang & Stok Barang

- **Collateral (20%)**: 4 sub-indikator
  - Jenis & Nilai Agunan
  - Marketability
  - Pengikatan Agunan
  - Rasio LTV

- **Condition (10%)**: 4 sub-indikator
  - Pasar & Market Share
  - Ketersediaan Bahan Baku
  - Sarana Distribusi
  - Regulasi & Legalitas

**Step 3: Review & Submit**
- Review semua jawaban
- Submit untuk scoring

### 3. Scoring & Decision Logic
Sistem otomatis menghitung:
1. Rata-rata untuk setiap kategori 5C
2. Total score dengan bobot
3. Mapping ke 4 zona risiko

**Zona Risiko:**
- **HIJAU TUA (4.10-5.00)**: Accept Risk → Disetujui
- **HIJAU MUDA (3.50-4.09)**: Mitigate Risk → Disetujui dengan Syarat
- **KUNING (3.00-3.49)**: Transfer Risk → Disetujui dengan Agunan Tambahan
- **MERAH (1.00-2.99)**: Avoid Risk → Otomatis Ditolak

### 4. Dashboard
- **Overview**: Statistik dan grafik
- **Assessments**: List semua penilaian
- **Risk Zones**: Analisis zona risiko
- **Settings**: Pengaturan tema dan akun

### 5. Export Excel
- Download laporan hasil assessment
- Format profesional
- Semua data terinclude

### 6. Dark/Light Mode
- Toggle theme di top-right
- Tersimpan di localStorage
- Responsive dan nyaman untuk mata

## API Endpoints

### Authentication
```
POST /api/auth/login
POST /api/auth/register
POST /api/auth/logout
```

### Assessments
```
POST /api/assessments                    - Create new assessment
GET /api/assessments                     - Get all assessments
GET /api/assessments/:id                 - Get assessment detail
POST /api/assessments/:id/scores         - Submit 5C scores
GET /api/assessments/:id/export          - Export to Excel
GET /api/assessments/admin/all           - Get all (admin only)
```

### Dashboard
```
GET /api/dashboard/summary               - Get dashboard data
```

## Troubleshooting

### Database Connection Error
```
Error: connect ECONNREFUSED 127.0.0.1:3306

Solution:
1. Pastikan MySQL service running
2. Cek konfigurasi di .env file
3. Verifikasi username & password
4. Cek port MySQL (default: 3306)
```

### Port Already in Use
```
Error: listen EADDRINUSE: address already in use :::3000

Solution:
1. Kill process yang menggunakan port 3000:
   lsof -ti:3000 | xargs kill -9
2. Atau change PORT di .env file
```

### JWT Token Expired
```
Solution: Login ulang untuk mendapatkan token baru
```

### CORS Error
```
Solution: Pastikan backend running di http://localhost:3000
```

## Development Tips

### Mengakses Database
```bash
# Menggunakan MySQL CLI
mysql -u root -p bcg_scoring

# Query examples:
SELECT * FROM assessments;
SELECT * FROM users;
SELECT COUNT(*) FROM assessments WHERE status='approved';
```

### Debugging Backend
```bash
# Set debug mode
DEBUG=* npm run dev

# Check logs dari Express
```

### Console Inspection
1. Buka DevTools (F12)
2. Tab Console untuk error messages
3. Tab Network untuk API calls
4. Tab Storage untuk localStorage data

## Project Structure

```
bcg/
├── backend/
│   ├── config/
│   │   └── database.js           # Database configuration
│   ├── controllers/              # Business logic
│   │   ├── authController.js
│   │   ├── assessmentController.js
│   │   └── dashboardController.js
│   ├── middleware/
│   │   └── auth.js              # JWT authentication
│   ├── models/
│   │   ├── Assessment.js
│   │   ├── Score.js
│   │   └── User.js
│   ├── routes/                  # API routes
│   │   ├── auth.js
│   │   ├── assessments.js
│   │   └── dashboard.js
│   ├── utils/
│   │   ├── scoring.js           # 5C scoring logic
│   │   ├── password.js          # Password hashing
│   │   └── excel.js             # Excel generation
│   └── server.js                # Main entry point
│
├── frontend/
│   ├── css/
│   │   └── style.css            # All styling
│   ├── js/
│   │   ├── app.js               # Global utilities
│   │   ├── auth.js              # Authentication logic
│   │   ├── form.js              # Form handling
│   │   └── dashboard.js         # Dashboard logic
│   ├── images/                  # Logo & assets
│   ├── index.html               # Login page
│   ├── form.html                # Assessment form
│   └── dashboard.html           # Dashboard page
│
├── database_schema.sql          # Database initialization
├── package.json                 # Dependencies
├── .env.example                 # Environment template
└── README.md                    # Documentation
```

## Performance Tips

1. **Database**: Gunakan indexes untuk query yang sering dijalankan
2. **Frontend**: Gunakan lazy loading untuk assessments
3. **Caching**: Implement caching strategy untuk dashboard data
4. **CDN**: Host static files di CDN untuk production

## Security Tips

1. **JWT Secret**: Ubah JWT_SECRET ke string yang kuat
2. **Database Password**: Gunakan password yang kuat
3. **HTTPS**: Gunakan HTTPS untuk production
4. **Rate Limiting**: Implement rate limiting untuk API
5. **Input Validation**: Validate semua input dari user

## Next Steps / Future Enhancements

1. Email notifications untuk hasil assessment
2. Report generation (PDF)
3. User management system
4. Role-based access control
5. Advanced filtering & search
6. Data import/export features
7. API documentation (Swagger)
8. Unit & integration tests
9. Docker containerization
10. AWS/Cloud deployment

## Support & Documentation

- Lihat README.md di root directory
- Check API endpoints di backend/routes/
- Review scoring logic di backend/utils/scoring.js
- Frontend components di frontend/html files

---

**Dibuat dengan ❤️ untuk BCG (Bintang Cahaya Gempita)**
**Sistem Penilaian Kelayakan Kredit Berbasis 5C**
