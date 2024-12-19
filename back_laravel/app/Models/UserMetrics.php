<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class UserMetrics extends Model
{
    protected $fillable = [
        'user_id',
        'category',
        'metric_name',
        'metric_value'
    ];

    public $timestamps = false;

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}