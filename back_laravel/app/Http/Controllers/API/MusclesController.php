<?php
namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\UserMuscles;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Auth;

class MusclesController extends Controller
{
    public function __construct()
    {
        $this->middleware('auth:api');
    }

    public function store(Request $request)
    {
        try {
            // Получаем ID авторизованного пользователя
            $user_id = Auth::id();
            
            if (!$user_id) {
                return response()->json([
                    'status' => 'error',
                    'message' => 'Пользователь не авторизован'
                ], 401);
            }

            // Валидация входящих данных
            $request->validate([
                '*' => 'required|array',
                '*.*.id' => 'required|string',
                '*.*.name' => 'required|string'
            ]);

            // Логируем входящие данные
            Log::info('Incoming muscles data for user ' . $user_id . ':', $request->all());
            
            // Удаляем предыдущие записи для этого пользователя
            UserMuscles::where('user_id', $user_id)->delete();
            
            $savedMuscles = [];
            
            foreach ($request->all() as $category => $muscles) {
                // Логируем каждую категорию
                Log::info('Processing category: ' . $category, ['muscles' => $muscles]);
                
                // Проверяем, что $muscles это массив
                if (!is_array($muscles)) {
                    Log::error('Invalid muscles data format for category: ' . $category);
                    continue;
                }

                foreach ($muscles as $muscle) {
                    try {
                        // Создаем запись
                        $savedMuscle = UserMuscles::create([
                            'user_id' => $user_id,
                            'category' => $category,
                            'muscle_id' => $muscle['id'],
                            'muscle_name' => $muscle['name']
                        ]);
                        
                        $savedMuscles[] = $savedMuscle;
                        
                    } catch (\Exception $e) {
                        Log::error('Error saving individual muscle:', [
                            'muscle' => $muscle,
                            'error' => $e->getMessage()
                        ]);
                    }
                }
            }

            // Проверяем, были ли сохранены какие-либо мышцы
            if (empty($savedMuscles)) {
                return response()->json([
                    'status' => 'error',
                    'message' => 'Не удалось сохранить данные о мышцах'
                ], 400);
            }

            return response()->json([
                'status' => 'success',
                'message' => 'Мышцы успешно сохранены',
                'data' => [
                    'saved_count' => count($savedMuscles),
                    'user_id' => $user_id
                ]
            ], 201);

        } catch (\Illuminate\Validation\ValidationException $e) {
            return response()->json([
                'status' => 'error',
                'message' => 'Ошибка валидации данных',
                'errors' => $e->errors()
            ], 422);

        } catch (\Exception $e) {
            // Детальное логирование ошибки
            Log::error('Error saving muscles: ' . $e->getMessage(), [
                'file' => $e->getFile(),
                'line' => $e->getLine(),
                'trace' => $e->getTraceAsString(),
                'user_id' => $user_id ?? null
            ]);

            return response()->json([
                'status' => 'error',
                'message' => 'Ошибка при сохранении мышц',
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

            $muscles = UserMuscles::where('user_id', $user_id)
                ->get()
                ->groupBy('category');

            return response()->json([
                'status' => 'success',
                'data' => $muscles
            ]);

        } catch (\Exception $e) {
            Log::error('Error fetching muscles: ' . $e->getMessage(), [
                'user_id' => Auth::id() ?? null,
                'trace' => $e->getTraceAsString()
            ]);

            return response()->json([
                'status' => 'error',
                'message' => 'Ошибка при получении данных о мышцах'
            ], 500);
        }
    }
}