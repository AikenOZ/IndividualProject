<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\UserMetrics;

class MetricsController extends Controller
{
    public function store(Request $request)
    {
        try {
            $user_id = 1; // Временно, потом заменим на auth()->id()
            
            foreach ($request->all() as $category => $metrics) {
                foreach ($metrics as $metric_name => $metric_value) {
                    UserMetrics::create([
                        'user_id' => $user_id,
                        'category' => $category,
                        'metric_name' => $metric_name,
                        'metric_value' => $metric_value
                    ]);
                }
            }

            return response()->json([
                'status' => 'success',
                'message' => 'Метрики успешно сохранены'
            ], 201);

        } catch (\Exception $e) {
            return response()->json([
                'status' => 'error',
                'message' => 'Ошибка при сохранении метрик',
                'error' => $e->getMessage()
            ], 500);
        }
    }
}