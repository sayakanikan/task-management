# 🗂️ Task Management System

Sebuah aplikasi **Task Management System** berbasis web yang memungkinkan pengguna untuk mengelola tugas harian, menetapkan prioritas, dan memantau progres pekerjaan.  
Proyek ini dibangun menggunakan **Laravel** sebagai backend dan **Next.js** sebagai frontend, dengan integrasi API RESTful.

---

## 📁 Struktur Folder Proyek

```
task-management/
├── backend/               # Service backend (Laravel)
│   ├── src/
│   ├── .env.example
│   ├── README.md
│   └── ...
├── frontend/              # Service frontend (Next.js)
│   ├── src/
│   ├── README.md
│   └── ...
├── postman_collection.json # Kumpulan endpoint API untuk Postman
├── db.sql                 # Dump database
├── README.md              # Dokumentasi utama proyek
└── screenshots/           # Screenshot tampilan aplikasi
    ├── login.png
    ├── dashboard.png
    └── task_crud.png
```

---

## 🚀 Teknologi yang Digunakan

### Backend
- **Laravel 12**
- **MySQL**
- **JWT Token** (autentikasi API)
- **Eloquent ORM**

### Frontend
- **Next.js 15**
- **React 19**
- **Axios** (HTTP Client)
- **Tailwind CSS** (UI styling)

### Lainnya
- **Postman** (dokumentasi API)
- **Git** (version control)

---

## ⚙️ Cara Menjalankan Proyek

### 1️⃣ Menjalankan Backend (Laravel)
Masuk ke folder `backend/`:

```bash
cd backend
```

#### Instal dependensi
```bash
composer install
```

#### Salin file `.env.example` menjadi `.env`
```bash
cp .env.example .env
```

#### Konfigurasi environment
Edit file `.env` dan sesuaikan dengan konfigurasi database lokal:
```
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=task_management
DB_USERNAME=root
DB_PASSWORD=
```

#### Generate app key & Secret key JWT
```bash
php artisan key:generate
php artisan jwt:secret
```

#### Migrasi database (bisa di lewati jika sudah menggunakan dump db yang tersedia)
```bash
php artisan migrate --seed
```

#### Jalankan server
```bash
php artisan serve
```

Server akan berjalan di `http://127.0.0.1:8000`

---

### 2️⃣ Menjalankan Frontend (Next.js)
Masuk ke folder `frontend/`:

```bash
cd frontend
```

#### Instal dependensi
```bash
npm install
```

#### Jalankan aplikasi
```bash
npm run dev
```

Aplikasi frontend akan berjalan di `http://localhost:3000`

---

## 🔐 Informasi Login Dummy

| Role | Email | Password |
|------|--------|-----------|
| User  | user@gmail.com  | password |

---

## 🧱 Struktur Database

Tabel utama dalam sistem ini:

| Tabel | Deskripsi |
|-------|------------|
| `users` | Menyimpan data pengguna (admin & user) |
| `tasks` | Menyimpan daftar tugas yang dibuat oleh user |
| `task_categories` | Menyimpan kategori tugas |
| `personal_access_tokens` | Token autentikasi untuk API (Sanctum) |

### ERD Singkat
```
users (1)───<(tasks)
```

---

## 🖼️ Screenshot Tampilan Utama

| Halaman | Preview |
|----------|----------|
| Login | ![Login](./screenshots/login.png) |
| Dashboard | ![Dashboard](./screenshots/dashboard.png) |
| CRUD Task | ![Task CRUD](./screenshots/task_crud.png) |

---

## 📫 Dokumentasi API
Endpoint API dapat diimpor melalui file berikut:

```
postman_collection.json
```

---

## 👤 Author
**Nama:** Irfansyah  
**Email:** irfansyahavatar1@gmail.com  
**GitHub:** https://github.com/sayakanikan

