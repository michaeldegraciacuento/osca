<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use App\Models\User;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class SeniorCitizenRegistration extends Model
{
    use HasFactory;

    protected $fillable = [
        'registration_id',
        'status',
        'notes',
        'user_id', 
        // Personal Information
        'last_name',
        'first_name', 
        'middle_name',
        'suffix',
        'date_of_birth',
        'place_of_birth',
        'gender',
        'civil_status',
        
        // Contact Information
        'contact_number',
        'email',
        
        // Address Information
        'house_number',
        'street',
        'barangay',
        'city',
        'province',
        'zip_code',
        
        // Emergency Contact
        'emergency_contact_name',
        'emergency_contact_relationship',
        'emergency_contact_number',
        'emergency_contact_address',
        
        // Health Information
        'has_medical_conditions',
        'medical_conditions',
        'current_medications',
        'allergies',
        
        // Documents
        'valid_id_front',
        'valid_id_back',
        'birth_certificate',
        'proof_of_residency',
        
        // Agreements
        'data_privacy_consent',
        'terms_conditions',
        'reviewed_at',
        'reviewed_by',
    ];

    protected $casts = [
        'date_of_birth' => 'date',
        'has_medical_conditions' => 'boolean',
        'data_privacy_consent' => 'boolean',
        'terms_conditions' => 'boolean',
        'reviewed_at' => 'datetime',
    ];

    protected $appends = ['full_name'];

    /**
     * Boot the model and generate registration ID.
     */
    protected static function boot()
    {
        parent::boot();

        static::creating(function ($model) {
            if (empty($model->registration_id)) {
                $model->registration_id = self::generateRegistrationId();
            }
        });
    }

    /**
     * Generate unique registration ID.
     */
    public static function generateRegistrationId(): string
    {
        do {
            $prefix = 'OSCA';
            $year = date('Y');
            $month = date('m');
            $randomNumber = str_pad(random_int(1, 9999), 4, '0', STR_PAD_LEFT);
            $registrationId = "{$prefix}-{$year}{$month}-{$randomNumber}";
        } while (self::where('registration_id', $registrationId)->exists());

        return $registrationId;
    }

    /**
     * Get the associated user account.
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    /**
     * Get the reviewer user.
     */
    public function reviewer(): BelongsTo
    {
        return $this->belongsTo(User::class, 'reviewed_by');
    }

    /**
     * Get status badge color.
     */
    public function getStatusBadgeAttribute(): string
    {
        return match ($this->status) {
            'pending' => 'bg-yellow-100 text-yellow-800',
            'under_review' => 'bg-blue-100 text-blue-800',
            'approved' => 'bg-green-100 text-green-800',
            'rejected' => 'bg-red-100 text-red-800',
            default => 'bg-gray-100 text-gray-800',
        };
    }

    /**
     * Get status label.
     */
    public function getStatusLabelAttribute(): string
    {
        return match ($this->status) {
            'pending' => 'Pending Review',
            'under_review' => 'Under Review',
            'approved' => 'Approved',
            'rejected' => 'Rejected',
            default => 'Unknown',
        };
    }

    /**
     * Get the full name of the registrant.
     */
    public function getFullNameAttribute(): string
    {
        $parts = array_filter([
            $this->first_name,
            $this->middle_name,
            $this->last_name,
            $this->suffix
        ]);
        
        return implode(' ', $parts);
    }

    /**
     * Get the complete address.
     */
    public function getFullAddressAttribute(): string
    {
        $parts = array_filter([
            $this->house_number,
            $this->street,
            $this->barangay,
            $this->city,
            $this->province,
            $this->zip_code
        ]);
        
        return implode(', ', $parts);
    }

    /**
     * Calculate age from date of birth.
     */
    public function getAgeAttribute(): int
    {
        return $this->date_of_birth ? $this->date_of_birth->age : 0;
    }

    /**
     * Get the home visits for the senior citizen.
     */
    public function homeVisits()
    {
        return $this->hasMany(SeniorCitizenHomeVisit::class, 'registration_id');
    }

    /**
     * Get the mortuary application for the senior citizen.
     */
    public function mortuaryApplication()
    {
        return $this->hasOne(SeniorCitizenMortuaryApplication::class, 'senior_citizen_registration_id');
    }
}
