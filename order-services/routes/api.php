<?php

use App\Http\Controllers\OrdersController;
use Illuminate\Support\Facades\Route;

Route::get('/health', [OrdersController::class, 'health']);

Route::post('/orders', [OrdersController::class, 'store']);
Route::get('/orders/user/{userId}', [OrdersController::class, 'indexByUser'])->whereNumber('userId');
Route::get('/orders/{id}', [OrdersController::class, 'show'])->whereNumber('id');
Route::patch('/orders/{id}/pay', [OrdersController::class, 'pay'])->whereNumber('id');

// id bukan angka atau endpoint tidak ada -> 404 JSON
Route::fallback(fn () => response()->json(['message' => 'Endpoint tidak ditemukan'], 404));