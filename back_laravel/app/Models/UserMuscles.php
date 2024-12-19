<?php
namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class UserMuscles extends Model
{
    protected $table = 'user_muscles';
    
    protected $fillable = [
        'user_id',
        'category',
        'muscle_id',
        'muscle_name'
    ];

    public $timestamps = false;

    /**
     * Get the user that owns the muscle record.
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    /**
     * Scope a query to only include muscles for a specific user.
     */
    public function scopeForUser($query, $userId)
    {
        return $query->where('user_id', $userId);
    }

    /**
     * Scope a query to only include muscles for a specific category.
     */
    public function scopeInCategory($query, $category)
    {
        return $query->where('category', $category);
    }

    /**
     * Get formatted data for response
     */
    public function toArray()
    {
        return [
            'id' => $this->muscle_id,
            'name' => $this->muscle_name,
            'category' => $this->category,
        ];
    }

    /**
     * Delete all muscles for a specific user
     */
    public static function deleteForUser($userId)
    {
        return static::where('user_id', $userId)->delete();
    }

    /**
     * Create multiple muscle records for a user
     */
    public static function createMany($userId, $category, array $muscles)
    {
        $records = [];
        
        foreach ($muscles as $muscle) {
            $records[] = static::create([
                'user_id' => $userId,
                'category' => $category,
                'muscle_id' => $muscle['id'],
                'muscle_name' => $muscle['name']
            ]);
        }

        return $records;
    }

    /**
     * Get grouped muscles by category for a user
     */
    public static function getGroupedByCategory($userId)
    {
        return static::where('user_id', $userId)
            ->get()
            ->groupBy('category')
            ->map(function ($muscles) {
                return $muscles->map(function ($muscle) {
                    return [
                        'id' => $muscle->muscle_id,
                        'name' => $muscle->muscle_name
                    ];
                });
            });
    }

    /**
     * Custom create method with validation
     */
    public static function createWithValidation($attributes)
    {
        if (empty($attributes['user_id'])) {
            throw new \InvalidArgumentException('User ID is required');
        }

        if (empty($attributes['category'])) {
            throw new \InvalidArgumentException('Category is required');
        }

        if (empty($attributes['muscle_id'])) {
            throw new \InvalidArgumentException('Muscle ID is required');
        }

        if (empty($attributes['muscle_name'])) {
            throw new \InvalidArgumentException('Muscle name is required');
        }

        return static::create($attributes);
    }
}