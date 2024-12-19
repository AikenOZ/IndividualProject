<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class WorkoutData extends Model
{
    protected $fillable = [
        'workout_id',
        'user_metrics_id',
        'user_muscles_id'
    ];

    public $timestamps = false;

    public function metrics()
    {
        return $this->belongsTo(UserMetrics::class, 'user_metrics_id');
    }

    public function muscles()
    {
        return $this->belongsTo(UserMuscles::class, 'user_muscles_id');
    }
}