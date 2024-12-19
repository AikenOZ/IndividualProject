<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\Workout;
use App\Models\UserMuscles;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\DB;

class WorkoutController extends Controller
{
    public function __construct()
    {
        $this->middleware('auth:api');
    }

    public function store(Request $request)
    {
        try {
            $user_id = Auth::id();
            Log::info('User attempting to save workout:', ['user_id' => $user_id]);

            if (!$user_id) {
                return response()->json([
                    'status' => 'error',
                    'message' => 'Пользователь не авторизован'
                ], 401);
            }

            // Валидация
            $request->validate([
                'name' => 'required|string|max:255',
                'description' => 'nullable|string'
            ]);

            DB::beginTransaction();

            try {
                // Получаем мышцы пользователя
                $userMuscles = UserMuscles::where('user_id', $user_id)
                    ->pluck('muscle_name')
                    ->toArray();

                // Создаем тренировку
                $workout = Workout::create([
                    'user_id' => $user_id,
                    'name' => $request->name,
                    'description' => $request->description,
                    'muscules' => $userMuscles,
                    'status' => true
                ]);

                DB::commit();

                return response()->json([
                    'status' => 'success',
                    'message' => 'Тренировка успешно создана',
                    'data' => $workout
                ], 201);

            } catch (\Exception $e) {
                DB::rollBack();
                throw $e;
            }

        } catch (\Exception $e) {
            Log::error('Error saving workout:', [
                'message' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);

            return response()->json([
                'status' => 'error',
                'message' => 'Ошибка при сохранении тренировки',
                'error' => $e->getMessage()
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

            $workouts = Workout::where('user_id', $user_id)
                ->where('status', true)
                ->get();

            return response()->json([
                'status' => 'success',
                'data' => $workouts
            ]);

        } catch (\Exception $e) {
            Log::error('Error fetching workouts:', [
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);

            return response()->json([
                'status' => 'error',
                'message' => 'Ошибка при получении тренировок'
            ], 500);
        }
    }
}