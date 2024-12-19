<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Workout extends Model
{
    protected $fillable = [
        'user_id',
        'name',
        'description',
        'muscules',
        'status'
    ];

    protected $casts = [
        'status' => 'boolean',
        'muscules' => 'array'
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}