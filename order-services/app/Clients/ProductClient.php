<?php

namespace App\Clients;

use App\Exceptions\ServiceUnavailableException;
use Illuminate\Http\Client\ConnectionException;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class ProductClient
{
    // ambil satu produk jika tidak ditemukan null (404)
    public function find(int $id): ?array
    {
        try {
            $response = Http::baseUrl(config('services.product.url'))
                ->timeout(config('services.product.timeout'))
                ->acceptJson()
                ->get("/products/{$id}");
        } catch (ConnectionException $e) {
            Log::error('Product service tidak dapat dihubungi', [
                'product_id' => $id,
                'error'      => $e->getMessage(),
            ]);

            throw new ServiceUnavailableException(
                'Product service tidak dapat dihubungi, coba lagi nanti', 0, $e
            );
        }

        if ($response->status() === 404) {
            return null;
        }

        if ($response->failed()) {
            Log::error('Product service mengembalikan error', [
                'product_id' => $id,
                'status'     => $response->status(),
                'body'       => $response->body(),
            ]);

            throw new ServiceUnavailableException(
                'Product service bermasalah, coba lagi nanti'
            );
        }

        return $response->json('data');
    }
}