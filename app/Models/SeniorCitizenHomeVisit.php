<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class SeniorCitizenHomeVisit extends Model
{
    protected $fillable = [
        'registration_id',
        'scheduled_date',
        'time_slot',
        'status',
        'notes',
        'created_by',
        'updated_by',
    ];

    protected $casts = [
        'scheduled_date' => 'date:Y-m-d',
    ];

    public const TIME_SLOTS = ['8-10 AM','10-12 PM','1-2 PM','1-4 PM'];
    public const STATUSES = ['Scheduled','Re-Scheduled','Completed'];

    public function registration()
    {
        return $this->belongsTo(SeniorCitizenRegistration::class, 'registration_id');
    }

    public function creator()
    {
        return $this->belongsTo(User::class, 'created_by');
    }

    public function updater()
    {
        return $this->belongsTo(User::class, 'updated_by');
    }

    public function scopeForDate($query, $date)
    {
        return $query->whereDate('scheduled_date', $date);
    }
}
