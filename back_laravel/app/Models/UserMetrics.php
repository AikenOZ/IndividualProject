<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class UserMetrics extends Model
{
    protected $table = 'user_metrics';
    
    protected $fillable = [
        'user_id',
        'category',
        'metric_name',
        'metric_value'
    ];

    const UPDATED_AT = null;

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}