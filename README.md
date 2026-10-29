# 🛒 Toko Online Microservice (WarungPakDep.id)

Sistem toko online berbasis microservice. User memilih produk, memasukkannya ke keranjang, lalu melakukan checkout.

![Docker](https://img.shields.io/badge/Docker-Compose-2496ED?logo=docker&logoColor=white)
![Node.js](https://img.shields.io/badge/Node.js-Product-339933?logo=nodedotjs&logoColor=white)
![Laravel](https://img.shields.io/badge/Laravel-Cart%20%26%20Order-FF2D20?logo=laravel&logoColor=white)
![Flask](https://img.shields.io/badge/Flask-Review-000000?logo=flask&logoColor=white)
![React](https://img.shields.io/badge/React-Frontend-61DAFB?logo=react&logoColor=black)

## 📑 Daftar Isi

1. [Arsitektur](#1-arsitektur)
2. [Endpoint](#2-endpoint)
3. [Cara Menjalankan](#3-cara-menjalankan)
4. [Keputusan Desain](#4-keputusan-desain)
5. [Keterbatasan](#5-keterbatasan)
6. [Desain UI](#6-desain-ui)

---

## 1. Arsitektur

### Backend

| No | Service | Teknologi | Port | Database |
|:--:|---------|-----------|:----:|----------|
| 1 | `product-service` | Node.js | 3000 | MySQL 8.0 |
| 2 | `cart-service` | Laravel | 3001 | PostgreSQL |
| 3 | `review-service` | Flask | 3002 | MongoDB |
| 4 | `order-service` | Laravel | 3003 | MySQL 8.0 |

### Frontend

| Aplikasi | Teknologi |
|----------|-----------|
| `ecommerce-ui` | React.js |

---

## 2. Endpoint

### 📦 Product Service (`:3000`)

| Method | URL | Fungsi |
|--------|-----|--------|
| `GET` | `http://localhost:3000/products` | Ambil semua produk |
| `GET` | `http://localhost:3000/products/{id}` | Ambil produk berdasarkan id |
| `POST` | `http://localhost:3000/products` | Tambah produk |
| `PUT` | `http://localhost:3000/products/{id}` | Ubah produk |
| `DELETE` | `http://localhost:3000/products/{id}` | Hapus produk |

### ⭐ Review Service (`:3002`)

| Method | URL | Fungsi |
|--------|-----|--------|
| `GET` | `http://localhost:3002/reviews` | Ambil semua review |
| `GET` | `http://localhost:3002/reviews/{id}` | Ambil review berdasarkan id |
| `GET` | `http://localhost:3002/products/{id}/reviews` | Ambil review berdasarkan id produk |
| `POST` | `http://localhost:3002/reviews` | Tambah review |
| `PUT` | `http://localhost:3002/reviews/{id}` | Ubah review |
| `DELETE` | `http://localhost:3002/reviews/{id}` | Hapus review |

### 🛍️ Cart Service (`:3001`)

| Method | URL | Fungsi |
|--------|-----|--------|
| `GET` | `http://localhost:3001/carts/{id}` | Ambil keranjang |
| `POST` | `http://localhost:3001/carts` | Tambah keranjang |
| `PUT` | `http://localhost:3001/carts/items/{id}` | Ubah item keranjang |
| `DELETE` | `http://localhost:3001/carts/items/{id}` | Hapus item keranjang |

### 🧾 Order Service (`:3003`)

| Method | URL | Fungsi | Status sukses | Status gagal |
|--------|-----|--------|:-------------:|:------------:|
| `GET` | `http://localhost:3003/health` | Cek kesehatan service | 200 | - |
| `GET` | `http://localhost:3003/orders/{id}` | Ambil order | 200 | 422, 409, 503, 500 |
| `POST` | `http://localhost:3003/orders` | Tambah order (checkout) | 201 | 404 |
| `GET` | `http://localhost:3003/orders/user/{user_id}` | Ambil daftar order berdasarkan user id | 200 | 422 |
| `PATCH` | `http://localhost:3003/orders/{id}/pay` | Ubah status order menjadi `PAID` | 200 | 404, 409 |

#### Kondisi Gagal

| Kode | Penyebab |
|:----:|----------|
| `422` | Body tidak valid (`user_id` kosong atau bukan angka), atau status bukan `PENDING` / `PAID`. |
| `409` | Keranjang kosong, produk tidak ada di product-service, stok kurang, atau order bukan `PENDING` saat dibayar. |
| `404` | Order tidak ditemukan, atau id di path bukan angka. |
| `503` | `cart-service` atau `product-service` tidak dapat dihubungi atau bermasalah. |
| `500` | Error tak terduga. Detail teknis (debug) hanya muncul saat `APP_DEBUG=true`. |

---

## 3. Cara Menjalankan

**Prasyarat:** Docker dan Docker Compose sudah terpasang dan berjalan.

```bash
git clone https://github.com/ZEY00-ai/MicroService
cd MicroService
docker compose up --build
```

1. Tunggu sampai semua container dan database selesai dijalankan.
2. Uji endpoint memakai Insomnia atau Postman dengan URL order-service di atas.
3. Cek kesehatan service lewat `GET http://localhost:3003/health`.

---

## 4. Keputusan Desain

### Nama dan harga produk disalin ke order-service

- **Alasan:** harga produk bisa berubah kapan saja, sedangkan produk yang sudah di-checkout tidak boleh berubah harganya.
- **Keputusan:** nama dan harga produk disalin ke `order-service` saat checkout.
- **Konsekuensi:** data produk tersimpan ganda dan tidak mengikuti perubahan di `product-service`.

### Exception per kasus

Service melempar exception, lalu controller menerjemahkannya menjadi kode `404`, `409`, `503`, atau `500`.

> **Analogi:** SpongeBob (service) dan Squidward (controller). Ketika pesanan sudah habis atau tidak ada, SpongeBob memberi tahu Squidward. Lalu Squidward menyampaikan ke pelanggan bahwa menunya habis (`409`) atau tidak ada (`404`).

---

## 5. Keterbatasan

1. **Stok hanya diperiksa, tidak dikurangi.** Dua orang atau lebih yang memesan bersamaan bisa sama-sama lolos. Misalnya sisa stok 15, Daffa memesan 7 dan orang lain memesan 10. Keduanya lolos karena stok hanya dicek, bukan dikurangi.
2. **Daftar pesanan belum memakai pagination.** Untuk user dengan banyak pesanan, loading bisa menjadi lambat.
3. **Harga memakai tipe `int`,** sehingga tidak mendukung mata uang pecahan. Contoh: di dolar AS, `19.99` tersimpan menjadi `20`.

---

## 6. Desain UI

> 🚧 Desain menyusul, menggunakan React.