<?php

namespace App\Http\Controllers;

use App\Exceptions\BusinessException;
use App\Exceptions\OrderNotFoundException;
use App\Exceptions\ServiceUnavailableException;
use App\Http\Requests\CreateOrderRequest;
use App\Http\Requests\ListOrdersRequest;
use App\Models\orders;
use App\Http\Requests\StoreordersRequest;
use App\Http\Requests\UpdateordersRequest;
use App\Services\OrderService;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Log;
use Psy\Util\Json;
use Throwable;

class OrdersController extends Controller
{
    public function __construct(private OrderService $orderService) {}

    public function health(): JsonResponse
    {
        return response()->json([
            'status'    => 'aman',
            'service'   => 'order-service'
        ]);
    }

    public function store(CreateOrderRequest $request): JsonResponse
    {
        $userId = $request->validated()['user_id'];

        try {
            $order = $this->orderService->checkout($userId);

            return response()->json(['message' => 'Pesanan berhasil dibuat', 'data' => $order], 201);
        } catch (Throwable $e) {
            return $this->handleError($e, [
                'action' => 'checkout',
                'user_id' => $userId
            ]);
        }
    }

    public function show(int $id): JsonResponse
    {
        try {
            $order = $this->orderService->find($id);
            return response()->json([
                'message'   => 'Berhasil mengambil data',
                'data' => $order,
            ]);
        } catch (Throwable $e) {
            return $this->handleError($e, [
                'action' => 'show',
                'order_id' => $id
            ]);
        }
    }

    public function findByUserId(ListOrdersRequest $request, int $userId): JsonResponse
    {
        try {
            $order = $this->orderService->listByUser($userId, $request->validated()['status'] ?? null);

            return response()->json([
                'message'   => 'Berhasil mengambil data pesanan',
                'data' => $order,
            ]);
        } catch (Throwable $e) {
            return $this->handleError($e, [
                'action' => 'list',
                'user_id' => $userId
            ]);
        }
    }

    public function pay(int $id): JsonResponse
    {
        try {
            $order = $this->orderService->pay($id);

            return response()->json([
                'message'   => 'pesanan berhasil di bayar',
                'data' => $order,
            ]);
        } catch (Throwable $e) {
            return $this->handleError($e, [
                'action' => 'pay',
                'order_id' => $id
            ]);
        }
    }

    private function handleError(Throwable $e, array $context): JsonResponse
    {
        if ($e instanceof OrderNotFoundException) {
            return response()->json([
                'message' => $e->getMessage(),
            ], 404);
        }

        if ($e instanceof BusinessException) {
            return response()->json([
                'message' => $e->getMessage(),
            ], 409);
        }

        if ($e instanceof ServiceUnavailableException) {
            Log::error(
                'Service lain bermasalah', 
                $context + ['error' => $e->getMessage()]
            );
            return response()->json(
                ['message' => $e->getMessage()] + 
                $this->debug($e), 503
            );
        }

        Log::error('Error tidak terduga', $context + [
            'error' => $e->getMessage(),
            'file'  => $e->getFile(),
            'line'  => $e->getLine(),
        ]);

        return response()->json([
            'message' => 'terjadi kesalahan pada server'
        ] + $this->debug($e),500);
    }

    private function debug(Throwable $e) : array
    {
        return config('app.debug') ? ['debug' => $e->getMessage()] : [];
    }
}
