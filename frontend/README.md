# Restaurant POS Frontend (React + Vite + MUI)

## 📌 Deskripsi

Frontend ini adalah implementasi **Developer Test** untuk sistem **Point
of Sale (POS) Restoran**, dibangun dengan **React + Vite + MUI**.\
Aplikasi ini berfungsi sebagai client untuk backend API Laravel yang
sudah dibuat sebelumnya.

------------------------------------------------------------------------

## 🛠️ Tech Stack

-   **React 18 + Vite** (Frontend Framework)
-   **Material UI (MUI)** (UI Components)
-   **Axios** (HTTP Client)
-   **React Router** (Routing)
-   **React Query (opsional)** (Data Fetching)
-   **React Hook Form (opsional)** (Form Handling)

------------------------------------------------------------------------

## 🚀 Setup Project

### 1. Clone Repository

``` bash
git clone https://github.com/username/restaurant-pos-frontend.git
cd restaurant-pos-frontend
```

### 2. Install Dependencies

``` bash
npm install
```

### 3. Jalankan Project

``` bash
npm run dev
```

Akses aplikasi di `http://localhost:5173`

------------------------------------------------------------------------

## 📂 Struktur Folder

    /src
      /api
        axios.js          # konfigurasi axios
      /components
        Navbar.jsx
        ProtectedRoute.jsx
      /context
        AuthContext.jsx   # Auth global (user & token)
        SnackbarContext.jsx # Global Snackbar
      /pages
        Login.jsx         # Halaman login
        Dashboard.jsx     # List Meja
        Foods.jsx         # CRUD Makanan
        Orders.jsx        # List Order
        OrderDetail.jsx   # Detail Order
      App.jsx
      main.jsx

------------------------------------------------------------------------

## 📌 Fitur

### 🔑 Auth

-   Login dengan email & password → token disimpan di localStorage
-   Logout → hapus token
-   Protected routes → hanya bisa diakses jika login

### 🪑 Dashboard (Pelayan)

-   List meja dari API `/api/tables`
-   Klik meja kosong → buka order baru
-   Klik meja occupied → redirect ke detail order aktif

### 🍽️ Foods (CRUD)

-   List makanan dari API `/api/foods`
-   Tambah, edit, dan hapus makanan
-   Hanya **Pelayan** yang bisa mengakses

### 📦 Orders

-   List semua order (`/api/orders`)
-   Detail order (`/api/orders/{id}`)
-   Pelayan → bisa tambah item makanan
-   Kasir → bisa tutup order & cetak struk

### 🧾 Receipt

-   Cetak struk order (`/api/orders/{id}/receipt`) → buka PDF di tab
    baru

### 👥 Role Based UI

-   **Pelayan**: Dashboard, CRUD Foods, tambah item
-   **Kasir**: List Orders, tutup order, cetak struk

------------------------------------------------------------------------

## 👥 Default Users

Gunakan akun dari backend Laravel:

  Role      Email              Password
  --------- ------------------ ----------
  Pelayan   pelayan@test.com   password
  Kasir     kasir@test.com     password

------------------------------------------------------------------------

## 📄 Lisensi

Frontend ini dibuat untuk keperluan **Developer Test** dan bukan untuk
produksi.