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

