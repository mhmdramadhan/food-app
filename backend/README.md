# Restaurant POS API (Laravel 12.x)

## 📌 Deskripsi

Proyek ini adalah implementasi **Developer Test** untuk simulasi sistem
**Point of Sale (POS) Restoran**.\
Dibangun dengan **Laravel 12.x** sebagai backend API, dengan fitur
utama:

-   🔑 Auth (Login, Logout, Profile dengan Laravel Sanctum)
-   🍽️ CRUD Makanan / Minuman
-   🪑 List Meja (status available / occupied)
-   📦 Orders (Open, List, Detail, Add Item, Close)
-   🧾 Generate Receipt PDF (Struk Pesanan)

------------------------------------------------------------------------

## 🛠️ Tech Stack

-   **Backend**: Laravel 12.x
-   **Auth**: Laravel Sanctum
-   **Database**: MySQL / MariaDB
-   **PDF**: barryvdh/laravel-dompdf

------------------------------------------------------------------------

## 🚀 Setup Project

### 1. Clone Repository

``` bash
git clone https://github.com/mhmdramadhan/food-app.git
cd food-app
```

### 2. Install Dependencies

``` bash
composer install
cp .env.example .env
php artisan key:generate
```

### 3. Konfigurasi Database

Edit file `.env`:

    DB_CONNECTION=mysql
    DB_HOST=127.0.0.1
    DB_PORT=3306
    DB_DATABASE=food_app
    DB_USERNAME=root
    DB_PASSWORD=

### 4. Jalankan Migration & Seeder

``` bash
php artisan migrate --seed
```

Seeder yang tersedia: - **UserSeeder** → akun Pelayan & Kasir default -
**TableSeeder** → daftar meja default

### 5. Jalankan Server

``` bash
php artisan serve
```

------------------------------------------------------------------------

## 📌 API Endpoint

### 🔑 Auth

-   `POST /api/login` → Login (email & password)
-   `POST /api/logout` → Logout
-   `GET /api/me` → Profil user login

### 🍽️ Foods

-   `GET /api/foods` → List makanan
-   `POST /api/foods` → Tambah makanan
-   `PUT /api/foods/{id}` → Update makanan
-   `DELETE /api/foods/{id}` → Hapus makanan

### 🪑 Tables

-   `GET /api/tables` → List meja + status

### 📦 Orders

-   `POST /api/orders/open` → Buka order baru
-   `GET /api/orders` → List semua order
-   `GET /api/orders/{id}` → Detail order (dengan item)
-   `POST /api/orders/{id}/add-item` → Tambah makanan ke order
-   `POST /api/orders/{id}/close` → Tutup order

### 🧾 Receipt

-   `GET /api/orders/{id}/receipt` → Generate PDF struk

------------------------------------------------------------------------

## 👥 Default Users

  Role      Email              Password
  --------- ------------------ ----------
  Pelayan   pelayan@test.com   password
  Kasir     kasir@test.com     password

------------------------------------------------------------------------

## 📄 Lisensi

Project ini dibuat untuk keperluan **Developer Test** dan bukan untuk
produksi.