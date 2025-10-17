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
│   └── dll...
├── frontend/              # Service frontend (Next.js)
│   ├── src/
│   ├── .env.example
│   ├── README.md
│   └── dll...
├── Task Management System.postman_collection.json #    Kumpulan endpoint API untuk Postman
├── task_management.sql    # Dump database
├── README.md              # Dokumentasi utama proyek
└── screenshots            # Screenshot tampilan 
    ├── login page.png
    ├── register page.png
    ├── task management page.png
    └── add-edit task modal.png
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

#### Salin file .env.example menjadi .env
```bash
cp .env.example .env
```

#### Konfigurasi environment
Edit file .env dan sesuaikan URL backend API sesuai server Laravel:
```bash
NEXT_PUBLIC_API_URL=http://127.0.0.1:8000/api
```

#### Jalankan aplikasi
```bash
npm run dev
```

Aplikasi frontend akan berjalan di `http://localhost:3000/login`

---

## 🔐 Informasi Login Dummy

| Name | Email | Password |
|------|--------|-----------|
| User  | user@gmail.com  | password |

---

## 🧱 Struktur Database

Tabel utama dalam sistem ini:

| Tabel | Deskripsi |
|-------|------------|
| `users` | Menyimpan data pengguna |
| `tasks` | Menyimpan daftar tugas yang dibuat oleh user |

---

## 🖼️ Screenshot Tampilan Utama

| Halaman | Preview |
|----------|----------|
| Login | ![Login](./screenshots/Login%20Page.png) |
| Register | ![Register Page](./screenshots/Register%20Page.png) |
| Task Management | ![Task Management Page](./screenshots/Task%20Management%20Page.png) |
| Add/Edit Task Modal | ![Add/Edit Task Modal](./screenshots/Add-Edit%20Task%20Modal.png) |

---

## 👤 Author
**Nama:** Irfansyah  
**Email:** irfansyahavatar1@gmail.com  
**GitHub:** https://github.com/sayakanikan

