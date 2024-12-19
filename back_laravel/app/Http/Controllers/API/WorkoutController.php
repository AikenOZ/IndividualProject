<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\WorkoutData;

class WorkoutController extends Controller
{
    public function store(Request $request)
    {
        try {
            $workout = WorkoutData::create([
                'workout_id' => uniqid('workout_'),
                'user_metrics_id' => $request->metrics_id,
                'user_muscles_id' => $request->muscles_id
            ]);

            return response()->json([
                'status' => 'success',
                'message' => 'Тренировка успешно сохранена',
                'data' => [
                    'workout_id' => $workout->workout_id
                ]
            ], 201);

        } catch (\Exception $e) {
            return response()->json([
                'status' => 'error',
                'message' => 'Ошибка при сохранении тренировки',
                'error' => $e->getMessage()
            ], 500);
        }
    }
}