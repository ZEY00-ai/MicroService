# Toko Online Microservice (WarungPakDep.id)

Sistem toko online berbasis micro service yang servicenya terpisah pisah untuk mempermudah perkembangan

## 1. Arsitektur
|---------------------------------------------------------------------|
|                             *BACKEND*                               |
|---------------------------------------------------------------------|

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

|----------------------------------------------------------------------------------------------|
|                                   order-service                                              |
|---------------|------------------------------------------------|-----------------------------|
|    Method     |                      URL                       |           fungsi            |
|---------------|------------------------------------------------|-----------------------------|
|GET            |      http://localhost:3003/orders/{id}         |         Ambil orders        |
|POST           |        http://localhost:3003/orders            |        Tambah  orders       |
|GET            |  http://localhost:3001/orders/user/{user id}   |      ubah item keranjang    |
|PATCH          |     http://localhost:3001/orders/{id}/pay      |     ubah status  jadi Pay   |
|---------------|------------------------------------------------|-----------------------------|


## Design 

|---------------------------------------------------|
|              menyusul designnya                   |
|---------------------------------------------------|