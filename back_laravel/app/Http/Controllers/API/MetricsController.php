<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\UserMetrics;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\DB;

class MetricsController extends Controller
{
   public function __construct()
   {
       $this->middleware('auth:api');
   }

   public function store(Request $request)
   {
       try {
           $user_id = Auth::id();
           Log::info('User attempting to save metrics:', ['user_id' => $user_id]);
           
           if (!$user_id) {
               return response()->json([
                   'status' => 'error',
                   'message' => 'Пользователь не авторизован'
               ], 401);
           }

           Log::info('Received metrics data:', $request->all());

           // Начинаем транзакцию
           DB::beginTransaction();

           try {
               // Удаляем старые метрики
               UserMetrics::where('user_id', $user_id)->delete();
               Log::info('Deleted old metrics for user:', ['user_id' => $user_id]);

               $savedMetrics = [];

               foreach ($request->all() as $category => $metrics) {
                   Log::info('Processing category:', [
                       'category' => $category,
                       'metrics' => $metrics
                   ]);

                   foreach ($metrics as $metric_name => $metric_value) {
                       // Пропускаем пустые значения
                       if (empty($metric_value)) continue;

                       $savedMetric = UserMetrics::create([
                           'user_id' => $user_id,
                           'category' => $category,
                           'metric_name' => $metric_name,
                           'metric_value' => $metric_value
                       ]);

                       $savedMetrics[] = $savedMetric;
                   }
               }

               DB::commit();
               Log::info('Successfully saved metrics', ['count' => count($savedMetrics)]);

               return response()->json([
                   'status' => 'success',
                   'message' => 'Метрики успешно сохранены',
                   'data' => [
                       'saved_count' => count($savedMetrics),
                       'metrics' => $savedMetrics
                   ]
               ], 201);

           } catch (\Exception $e) {
               DB::rollBack();
               Log::error('Transaction failed:', [
                   'error' => $e->getMessage(),
                   'trace' => $e->getTraceAsString()
               ]);
               throw $e;
           }

       } catch (\Exception $e) {
           Log::error('Error in store method:', [
               'message' => $e->getMessage(),
               'file' => $e->getFile(),
               'line' => $e->getLine(),
               'trace' => $e->getTraceAsString()
           ]);

           return response()->json([
               'status' => 'error',
               'message' => 'Ошибка при сохранении метрик',
               'debug_message' => config('app.debug') ? $e->getMessage() : null
           ], 500);
       }
   }

   public function index()
   {
       try {
           $user_id = Auth::id();
           
           if (!$user_id) {
               return response()->json([
                   'status' => 'error',
                   'message' => 'Пользователь не авторизован'
               ], 401);
           }

           $metrics = UserMetrics::where('user_id', $user_id)
               ->get()
               ->groupBy('category');

           Log::info('Successfully retrieved metrics for user', [
               'user_id' => $user_id,
               'categories_count' => $metrics->count()
           ]);

           return response()->json([
               'status' => 'success',
               'data' => $metrics
           ]);

       } catch (\Exception $e) {
           Log::error('Error fetching metrics:', [
               'user_id' => Auth::id() ?? null,
               'error' => $e->getMessage(),
               'trace' => $e->getTraceAsString()
           ]);

           return response()->json([
               'status' => 'error',
               'message' => 'Ошибка при получении метрик'
           ], 500);
       }
   }
}