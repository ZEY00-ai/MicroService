<?php

namespace App\Services;

use App\Clients\CartClient;
use App\Clients\ProductClient;
use App\Exceptions\EmptyCartException;
use App\Exceptions\InsufficientStockException;
use App\Exceptions\InvalidOrderStatusException;
use App\Exceptions\OrderNotFoundException;
use App\Exceptions\ProductNotFoundException;
use App\Exceptions\ServiceUnavailableException;
use App\Models\orders;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

class OrderService
{
    public function __construct(
        private CartClient $cart,
        private ProductClient $product,
    ) {}

    public function checkout(int $userId): orders
    {
        //baca keranjang
        $cartItems = $this->cart->getItem($userId);

        if (empty($cartItems)) {
            Log::warning('Checkout ditolak: keranjang kosong', ['user_id' => $userId]);
            throw new EmptyCartException('keranjang kosong');
        }

        //ambil data dan cek aturan 
        $lines = [];
        $total = 0;

        foreach ($cartItems as $item) {
            $product = $this->product->find($item['product_id']);

            if ($product === null) {
                Log::warning('Checkout ditolak: produk tidak ada', [
                    'user_id' => $userId,
                    'product_id' => $item['product_id'],
                ]);
                throw new ProductNotFoundException(
                    "Produk dengan id {$item['product_id']} tidak ditemukan"
                );
            }

            if ($product['stock'] < $item['quantity']) {
                Log::warning('Checkout ditolak: stok kurang', [
                    'user_id' => $userId,
                    'product_id' => $product['id'],
                    'diminta' => $item['quantity'],
                    'tersedia' => $product['stock'],
                ]);
                throw new InsufficientStockException(
                    "Stok {$product['name']} tidak mencukupi: diminta {$item['quantity']}, tersedia {$product['stock']}"
                );
            }

            $price = (int) round((float) $product['price']);
            $subtotal = $price * $item['quantity'];
            $total += $subtotal;

            $lines[] = [
                'product_id'    => $product['id'],
                'quantity'      => $item['quantity'],
                'product_name'  => $product['name'],
                'unit_price'    => $price,
                'subtotal'      => $subtotal,
            ];
        }

        $order = DB::transaction(function () use ($userId, $total, $lines) {
            $order = orders::create([
                'user_id'       => $userId,
                'status'        => 'PENDING',
                'total_amount'  => $total,
            ]);
            $order->items()->createMany($lines);

            return $order;
        });

        try {
            $this->cart->clear($userId);
        } catch (ServiceUnavailableException $e) {
            Log::error('pesanan berhasil di kosongkan tapi, keranjang gagal dikosongkan', [
                'order_id' => $order->id,
                'user_id' => $userId,
                'error' => $e->getMessage()
            ]);
        }

        return $order->load('items');
    }

    public function find(int $id): orders
    {
        $order = orders::with('items')->find($id);

        if (!$order) {
            throw new OrderNotFoundException("Pesanan dengan id {$id} tidak ditemukan");
        }

        return $order;
    }

    public function listByUser(int $userId, ?string $status = null): Collection
    {
        return orders::with('items')
            ->where('user_id', $userId)
            ->when($status, fn($q) => $q->where('status', $status))
            ->latest('id')
            ->get();
    }

    public function pay(int $id): orders
    {
        $order = $this->find($id);

        if ($order->status !== 'PENDING') {
            throw new InvalidOrderStatusException(
                "Pesanan berstatus {$order->status}, hanya pesanan PENDING yang dapat dibayar"
            );
        }

        $order->update(['status' => 'PAID']);

        return $order->fresh('items');
    }
}
