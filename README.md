# BCG Credit Scoring System

Sistem otomatisasi penilaian kelayakan kredit berbasis metode 5C dengan teknologi Node.js, Express, MySQL, dan Vanilla JavaScript.

## Teknologi yang Digunakan

- **Backend**: Node.js + Express
- **Database**: MySQL
- **Frontend**: HTML, CSS, Vanilla JavaScript
- **Development Environment**: Visual Studio Code & Laragon

## Instalasi

### 1. Clone atau extract project
```bash
cd bcg
```

### 2. Install dependencies
```bash
npm install
```

### 3. Setup Database
```bash
mysql -u root -p
```

Buat database dan import schema:
```sql
CREATE DATABASE bcg_scoring;
USE bcg_scoring;
-- Import file database_schema.sql
source database_schema.sql;
```

### 4. Konfigurasi Environment
```bash
cp .env.example .env
```
Edit `.env` sesuai konfigurasi database Anda.

### 5. Jalankan Aplikasi

Development:
```bash
npm run dev
```

Production:
```bash
npm start
```

Akses aplikasi di: `http://localhost:3000`

## Struktur Project

```
bcg/
├── backend/
│   ├── config/          # Database configuration
│   ├── controllers/     # Business logic
│   ├── models/         # Database models
│   ├── routes/         # API routes
│   ├── middleware/     # Custom middleware
│   ├── utils/          # Utility functions
│   └── server.js       # Main server file
├── frontend/
│   ├── css/           # Stylesheets
│   ├── js/            # JavaScript files
│   ├── images/        # Images & logos
│   ├── index.html     # Login page
│   ├── dashboard.html # Main dashboard
│   └── form.html      # Assessment form
└── database_schema.sql # Database initialization
```

## Fitur Utama

1. **Authentication**: Login & Manajemen User
2. **Input Data Penilaian 5C**: Form untuk input 22 indikator
3. **Scoring Otomatis**: Kalkulasi skor dengan bobot 5C
4. **Risk Zone Mapping**: Pemetaan ke 4 zona risiko
5. **Dashboard**: Visualisasi data dan statistik
6. **Export Excel**: Download hasil assessment
7. **Dark/Light Mode**: Toggle tema aplikasi

## Metodologi Scoring

### 5C Variables & Weights
- **Character (30%)**: 4 indikator
- **Capacity (25%)**: 6 indikator
- **Capital (15%)**: 4 indikator
- **Collateral (20%)**: 4 indikator
- **Condition (10%)**: 4 indikator

### Risk Zones
- **HIJAU TUA (4.10-5.00)**: Accept Risk - Approved
- **HIJAU MUDA (3.50-4.09)**: Mitigate Risk - Approved with conditions
- **KUNING (3.00-3.49)**: Transfer Risk - Approved with collateral conditions
- **MERAH (1.00-2.99)**: Avoid Risk - Auto Reject

## API Endpoints

### Authentication
- `POST /api/auth/login` - Login user
- `POST /api/auth/logout` - Logout user

### Assessments
- `POST /api/assessments` - Create new assessment
- `GET /api/assessments` - Get all assessments
- `GET /api/assessments/:id` - Get assessment detail
- `PUT /api/assessments/:id` - Update assessment
- `DELETE /api/assessments/:id` - Delete assessment
- `POST /api/assessments/:id/calculate` - Calculate score
- `GET /api/assessments/:id/export` - Export to Excel

### Dashboard
- `GET /api/dashboard/summary` - Get dashboard data
- `GET /api/dashboard/statistics` - Get statistics

## Author
BCG (Bintang Cahaya Gempita)
