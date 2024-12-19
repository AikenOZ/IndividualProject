<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\API\AuthController;
use App\Http\Controllers\API\MetricsController;
use App\Http\Controllers\API\MusclesController;
use App\Http\Controllers\API\WorkoutController;

// Маршруты аутентификации
Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);

// Защищенные маршруты
Route::middleware('auth:api')->group(function () { // Изменили sanctum на api
    // Маршруты аутентификации
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::get('/me', [AuthController::class, 'me']);
    Route::post('/refresh', [AuthController::class, 'refresh']);
    
    // Маршруты для работы с данными
    Route::post('/muscles', [MusclesController::class, 'store']);
    Route::post('/metrics', [MetricsController::class, 'store']);

    Route::post('/workouts', [WorkoutController::class, 'store']);
    Route::get('/workouts', [WorkoutController::class, 'index']);

    Route::get('/muscles', [MusclesController::class, 'index']);
    Route::get('/metrics', [MetricsController::class, 'index']);
});