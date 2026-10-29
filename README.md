# Toko Online Microservice (WarungPakDep.id)

Sistem toko online berbasis micro service, user memilih product memasukan ke keranjang lalu melakukan checkout,

## 1. Arsitektur
|---------------------------------------------------------------------|
|                             *BACKEND*                               |
|-------|-------------------|---------------|----------|--------------|
|  NO   |      service      |   Teknologi   |   port   |   Database   |
|-------|-------------------|---------------|----------|--------------|
|   1   |  Product-Service  |    Node.js    |   3000   |   mysql:8.0  |
|   2   |   cart-services   |    Laravel    |   3001   |   PostgreSQL |
|   3   |  review-services  |     Flask     |   3002   |    MongoDB   |
|   4   |   order-service   |    laravel    |   3003   |   mysql:8.0  |
|-------|-------------------|---------------|----------|--------------|

|-------------------------------------------------------------|
|                        *FRONTEND*                           |
|-------------------|---------------|----------|--------------|
|   ecommerce-ui    |   react.js    |          |              |
|-------------------|---------------|----------|--------------|


## 2. Endpoint

|----------------------------------------------------------------------------------------------|
|                                  product-service                                             |
|---------------|------------------------------------------------|-----------------------------|
|    Method     |                      URL                       |           fungsi            |
|---------------|------------------------------------------------|-----------------------------|
|GET            |        http://localhost:3000/products          |     Ambil Semua Product     |
|GET            |      http://localhost:3000/products/{id}       | Ambil Product Bedasatkan Id |
|POST           |        http://localhost:3000/products          |        Tambah Product       |
|PUT            |      http://localhost:3000/products/{id}       |         Ubah Product        |
|DELETE         |      http://localhost:3000/products/{id}       |         Hapus Product       |
|---------------|------------------------------------------------|-----------------------------|


|------------------------------------------------------------------------------------------------------|
|                                  product-service                                                     |
|---------------|------------------------------------------------|-------------------------------------|
|    Method     |                      URL                       |                fungsi               |
|---------------|------------------------------------------------|-------------------------------------|
|GET            |        http://localhost:3002/reviews           |          Ambil Semua reviews        |
|GET            |      http://localhost:3002/reviews/{id}        |     Ambil reviews Bedasatkan Id     |
|GET            |  http://localhost:3002/products/{id}/reviews   | Ambil reviews Bedasatkan Id Product |
|POST           |        http://localhost:3002/reviews           |            Tambah review            |
|PUT            |      http://localhost:3002/reviews/{id}        |             Ubah reviews            |
|DELETE         |      http://localhost:3002/reviews/{id}        |            Hapus reviews            |
|---------------|------------------------------------------------|-------------------------------------|


|----------------------------------------------------------------------------------------------|
|                                  product-service                                             |
|---------------|------------------------------------------------|-----------------------------|
|    Method     |                      URL                       |           fungsi            |
|---------------|------------------------------------------------|-----------------------------|
|GET            |       http://localhost:3001/carts/{id}         |        Ambil keranjang      |
|POST           |         http://localhost:3001/carts            |       Tambah keranjang      |
|PUT            |     http://localhost:3001/carts/items/{id}     |      ubah item keranjang    |
|DELETE         |     http://localhost:3001/carts/items/{id}     |        Hapus keranjang      |
|---------------|------------------------------------------------|-----------------------------|


|--------------------------------------------------------------------------------------------------------------------------------------------------|
|                                                           order-service                                                                          |
|---------------|------------------------------------------------|--------------------------------------------|-----------------|------------------|
|    Method     |                      URL                       |                  fungsi                    |  status sukses  |  status gagal    | 
|---------------|------------------------------------------------|--------------------------------------------|-----------------|------------------| 
|GET            |        http://localhost:3003/health            |               cek kesehatan                |       200       |        -         | 
|GET            |      http://localhost:3003/orders/{id}         |               Ambil orders                 |       200       | 422,209, 503,500 |
|POST           |        http://localhost:3003/orders            |              Tambah  orders                |       201       |       404        |
|GET            |  http://localhost:3001/orders/user/{user id}   |   ambil item keranjang bedasarkan userid   |       200       |       422        |
|PATCH          |     http://localhost:3001/orders/{id}/pay      |           ubah status  jadi Pay            |       200       |     404, 409     |
|---------------|------------------------------------------------|--------------------------------------------|-----------------|------------------|
|                                                            KONDISI GAGAL                                                                         |
|--------------------------------------------------------------------------------------------------------------------------------------------------|
| 422: body tidak valid (user_id kosong atau bukan angka), atau status bukan PENDING atau PAID.                                                    |
| 409: keranjang kosong, produk tidak ada di product-service, stok kurang, atau pesanan bukan PENDING saat dibayar                                 |
| 404: pesanan tidak ditemukan, atau id di path bukan angka.                                                                                       |
| 503: cart-service atau product-service tidak dapat dihubungi atau bermasalah.                                                                    |
| 500: error tak terduga. Detail teknis (debug) hanya muncul saat APP_DEBUG=true.                                                                  |
|--------------------------------------------------------------------------------------------------------------------------------------------------|


## Design UI

|---------------------------------------------------------------------|
|              menyusul designnya menggunakan react                   |
|---------------------------------------------------------------------|


## 3. Cara mennjalankan

prasyarat: docker dan compose sudah terpasang dan berjalan.

1. git clone https://github.com/ZEY00-ai/MicroService
2. cd MicroService
3. docker compose up --build
4. tunggu container dan db selesai
5. jika sudah selesai silahkan cek di insomnia tau di postman menggunakn url order service di atas

## 4. Keputusan Design

|------------------------------------|---------------------------------------------------------------------------------------------------------------|
|            keputusan               |                             Alasan dan permasalahan dan keputusan                                             |
|------------------------------------|---------------------------------------------------------------------------------------------------------------|
|                                    | nama dan harga product di salin ke order_service saat melakukann checkout, karena harga bisa berubah kapan-   |
|      nama dan harga product        |   saja. nah sedangkan product yng sudah di checkout tidak boleh harga nya berubah. akibatnya data product     |
|                                    |                    tersimpan double dan tidak mengikuti perubahan product service                             |
|------------------------------------|---------------------------------------------------------------------------------------------------------------|
|                                    |   service melempar exception dan controller menerjemahkannya menjadi 404,409,503,500. contoh serderhannanya   |
|       exception ker kasus          |    spongebob(service), squidword(controller). nah di sini psenannya sudah kosong atau tidak ada, spongebob    |
|                                    |   memberitau squidword pesanan habis tau tidak ada. nah di sini squidword membertau pelnggan kalau menunya    |
|                                    |                                   habis(409) atau tidak ada (404)                                             |
|------------------------------------|---------------------------------------------------------------------------------------------------------------|


## 5. Keterbatasan

keterbatasan yang mungkin saya alami adalah
1. stock hanya di periksa bukan di kurangi mungkin bisa 2 atau lebih orng yang memesan product secara ebrsamaan bisa lolos 
   misal sisa product 15. daffa mesan 7 product dan oranng lain munkin mesan 10. nah di sini bisa kemungkinan lolos karena hanya di check bukan di kurangi
2. daftar pesanan belum pakai pagenation, bagi user yang banyak pesanan akan membuat lama atau loadingnya lamma
3. harga memakai int tidak mendukung untuk maata uang pecahan. contoh di $as ada 19.99 tersimpann menjadi 20