<?php

namespace App\Clients;

use App\Exceptions\ServiceUnavailableException;
use GuzzleHttp\Exception\ConnectException;
use Illuminate\Http\Client\PendingRequest;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class CartClient
{
    //ambil item keranjang
    public function getItem(int $userId): array
    {
        $response = $this->send('get', "/carts/{$userId}", $userId);

        return $response->json('data.items') ?? [];
    }

    //kosongkan keranjang
    public function clear(int $userId): void
    {
        $this->send('delete',"/carts/{$userId}", $userId);
    }

    private function send(string $method, string $path, int $userId)
    {
        try {
            $response = $this->http()->{$method}($path);
        }catch (ConnectException $e){
            Log::error('Cart service tidak dapat di hubungi',[
                'user_id' => $userId,
                'method' => $method,
                'path'=> $path,
                'error' => $e->getMessage(),
            ]);

            throw new ServiceUnavailableException(
                'cart service tidak dapat di hubungi, coba lagi nanti',0,$e
            );
        }

        if ($response->failed()) {
            Log::error('cart service mengembalikan error',[
                'user_id' => $userId,
                'method'=> strtoupper($method),
                'status' => $response->status(),
                'body' => $response->body(),
            ]);

            throw new ServiceUnavailableException(
                'cart services bermasalah, coba lagi nanti'
            );
        }
        return $response;
    }

    private function http(): PendingRequest
    {
        return Http::baseUrl(config('services.cart.url'))
            ->timeout(config('services.cart.timeout'))
            ->acceptJson();
    }
}