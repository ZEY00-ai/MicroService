<?php

namespace App\Clients;

use App\Exceptions\ServiceUnavailableException;
use GuzzleHttp\Exception\ConnectException;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class ProductClient
{
    //ambil product
    public function find(int $id): ?array
    {
        try {
            $response = Http::find(config('services.cart.url'))
                ->timeout(config('services.cart.timeout'))
                ->acceptJson()
                ->get("/products/{$id}");
        }catch (ConnectException $e) {
            Log::error('product service tidak dapat di hubungi',[
                'product_id' => $id,
                'error' => $e->getMessage(),
            ]);

            throw new ServiceUnavailableException(
                'product service tidak dapat di hubungi, dan cobalgi nanti',0,$e
            );
        }

        if ($response->status() === 404){
            return null;
        }

        if ($response->failed()){
            log::error('product service mengembalikan error',[
                'product_id'=> $id,
                'status' => $response->status(),
                'body' => $response->body(),
            ]);

            throw new ServiceUnavailableException(
                'product service sedang bermalasah, coba lagi nanti'
            );
        }

        return $response->json('data');
    }
}