# BCG Credit Scoring System - Quick Start Guide

## TL;DR - Jalankan dalam 5 Menit

### Prasyarat yang Sudah Tersedia
✅ Node.js installed  
✅ MySQL running (via Laragon)  
✅ Project files ready

### Quick Start Steps

#### 1️⃣ Database Setup (1 menit)
```bash
# Buka MySQL dan jalankan:
mysql -u root -p < database_schema.sql
```

Atau via phpMyAdmin:
- Buat database baru: `bcg_scoring`
- Import file: `database_schema.sql`

#### 2️⃣ Install Dependencies (1 menit)
```bash
cd /Users/vinson/Downloads/bcg
npm install
```

#### 3️⃣ Setup Environment (30 detik)
```bash
cp .env.example .env
# Edit .env jika perlu, atau gunakan default values
```

#### 4️⃣ Run Backend (30 detik)
```bash
npm run dev
# Server berjalan di http://localhost:3000
```

#### 5️⃣ Login & Test (1 menit)

1. Buka browser: `http://localhost:3000`
2. Login dengan:
   - Username: `admin`
   - Password: `admin123`
3. Click "Ready to Assessment"
4. Buat assessment baru atau lihat dashboard

---

## File Struktur

```
bcg/
├── backend/           ← Node.js server
├── frontend/          ← HTML, CSS, JS
├── database_schema.sql ← Inisialisasi database
├── package.json       ← Dependencies
├── .env.example       ← Environment template
├── SETUP_GUIDE.md     ← Setup lengkap
└── README.md          ← Project info
```

---

## Default Credentials

**Login ke Aplikasi:**
- Username: `admin`
- Password: `admin123`

---

## Common Commands

```bash
# Development dengan auto-reload
npm run dev

# Production run
npm start

# Database setup
mysql -u root -p bcg_scoring < database_schema.sql

# Check if running
curl http://localhost:3000/api/health
```

---

## Troubleshooting

| Problem | Solution |
|---------|----------|
| MySQL not running | Buka Laragon, start MySQL service |
| npm install error | Delete `node_modules` & `package-lock.json`, run `npm install` again |
| Port 3000 in use | Ubah PORT di `.env` atau kill process di port 3000 |
| Database connection error | Cek konfigurasi di `.env`, pastikan MySQL running |
| Login not working | Pastikan database_schema.sql sudah di-import |

---

## Features Checklist

### Authentication
- ✅ Login dengan username & password
- ✅ JWT token-based session
- ✅ Logout functionality

### Assessment Form
- ✅ 3-step form wizard
- ✅ Business information input
- ✅ 5C scoring (22 indikators)
- ✅ Form validation

### Scoring Engine
- ✅ Character (30%)
- ✅ Capacity (25%)
- ✅ Capital (15%)
- ✅ Collateral (20%)
- ✅ Condition (10%)
- ✅ Total score calculation

### Decision System
- ✅ Hijau Tua (4.10-5.00): Approve
- ✅ Hijau Muda (3.50-4.09): Approve with conditions
- ✅ Kuning (3.00-3.49): Approve with collateral
- ✅ Merah (1.00-2.99): Auto-reject

### Dashboard
- ✅ Statistics & metrics
- ✅ Charts & graphs
- ✅ Risk zone analysis
- ✅ Recent assessments
- ✅ Filter & search

### UI/UX
- ✅ Dark/Light mode
- ✅ Responsive design
- ✅ Modern interface
- ✅ Loading indicators

### Export
- ✅ Excel export (ready to implement)
- ✅ PDF export (ready to implement)

---

## Folder Navigation

```bash
# Go to project
cd /Users/vinson/Downloads/bcg

# Backend folder
cd backend

# Frontend folder  
cd frontend

# View database file
cat database_schema.sql

# View main README
cat README.md
```

---

## API Quick Reference

```javascript
// Login
POST /api/auth/login
Body: { username, password }

// Create Assessment
POST /api/assessments
Body: { business_name, borrower_name, ... }

// Get Assessments
GET /api/assessments

// Submit Scores
POST /api/assessments/:id/scores
Body: { characterScores, capacityScores, ... }

// Dashboard
GET /api/dashboard/summary
```

---

## Next Steps

1. ✅ Setup database
2. ✅ Install & run backend
3. ✅ Test login
4. ✅ Create test assessment
5. ✅ View dashboard
6. ⏭️ Customize styling
7. ⏭️ Add more users
8. ⏭️ Deploy to server

---

## Tips & Tricks

### Dark Mode
Click 🌙 button di top-right untuk toggle dark mode

### Test Assessment Quickly
1. Fill business info dengan data dummy
2. Semua score set ke "5" untuk test
3. Submit & lihat hasilnya

### Check Database
```bash
mysql -u root -p
USE bcg_scoring;
SELECT * FROM assessments;
SELECT * FROM character_scores;
```

### See Live Logs
```bash
npm run dev
# Logs akan terlihat di terminal
```

---

**Happy Assessment! 🎉**

Butuh bantuan? Lihat `SETUP_GUIDE.md` untuk dokumentasi lengkap.
