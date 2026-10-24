<?php

namespace App\services;

use App\Clients\CartClient;
use App\Clients\ProductClient;
use App\Exceptions\EmptyCartException;
use App\Exceptions\InsufficientStockException;
use App\Exceptions\ProductNotFoundException;
use Illuminate\Support\Facades\Log;

class OrderService
{
    public function __construct(
        private CartClient $cart,
        private ProductClient $product,
    ){}

    public function checkout(int $userId) : Order
    {
        //baca keranjang
        $cartItems = $this->cart->getItem($userId);

        if (empty($cartItems)) {
            Log::warning('Checkout ditolak: keranjang kosong', ['user_id'=> $userId]);
            throw new EmptyCartException('keranjang kosong');
        }

        //ambil data dan cek aturan 
        $lines = [];
        $total = 0;

        foreach ($cartItems as $item) {
            $product = $this->product->find($item['product_id']);

            if ($product === null) {
                Log::warning('Checkout ditolak: produk tidak ada', [
                    'user_id' => $userId, 'product_id' => $item['product_id'],
                ]);
                throw new ProductNotFoundException(
                    "Produk dengan id {$item['product_id']} tidak ditemukan"
                );
            }

            if ($product['stock'] < $item['quantity']) {
                Log::warning('Checkout ditolak: stok kurang', [
                    'user_id' => $userId, 'product_id' => $product['id'],
                    'diminta' => $item['quantity'], 'tersedia' => $product['stock'],
                ]);
                throw new InsufficientStockException(
                    "Stok {$product['name']} tidak mencukupi: diminta {$item['quantity']}, tersedia {$product['stock']}"
                );
            }
            
        }
    }
}
