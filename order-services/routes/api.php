<?php

use App\Http\Controllers\OrderController;
use Illuminate\Support\Facades\Route;

Route::get('/health', [OrderController::class, 'health']);

Route::post('/orders', [OrderController::class, 'store']);
Route::get('/orders/user/{userId}', [OrderController::class, 'findByUserId'])->whereNumber('userId');
Route::get('/orders/{id}', [OrderController::class, 'show'])->whereNumber('id');
Route::patch('/orders/{id}/pay', [OrderController::class, 'pay'])->whereNumber('id');

// id bukan angka atau endpoint tidak ada -> 404 JSON
Route::fallback(fn () => response()->json(['message' => 'Endpoint tidak ditemukan'], 404));