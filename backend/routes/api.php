<?php

use App\Http\Controllers\AuthController;
use App\Http\Controllers\FoodController;
use App\Http\Controllers\OrderController;
use App\Http\Controllers\TableController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

// Auth
Route::post('/login', [AuthController::class, 'login']);

Route::middleware('auth:sanctum')->group(function () {
    // authenticated routes
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::get('/me', [AuthController::class, 'me']);

    // Food routes
    Route::apiResource('foods', FoodController::class)->only([
        'index',
        'store',
        'update',
        'destroy'
    ]);

    // table
    Route::get('/tables', [TableController::class, 'index']);

    // order
    Route::post('/orders/open', [OrderController::class, 'open']);
    Route::get('/orders', [OrderController::class, 'index']);
    Route::get('/orders/{id}', [OrderController::class, 'show']);
    Route::post('/orders/{id}/add-item', [OrderController::class, 'addItem']);
    Route::post('/orders/{id}/close', [OrderController::class, 'close']);
});
