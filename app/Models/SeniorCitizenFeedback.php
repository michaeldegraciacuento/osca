<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class SeniorCitizenFeedback extends Model
{
    use HasFactory;

    protected $table = 'senior_citizen_feedback';

    protected $fillable = [
        'user_id',
        'rating',
        'category',
        'message',
    ];

    protected $casts = [
        'rating' => 'integer',
    ];

    /**
     * Get the user that submitted the feedback.
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }
}
