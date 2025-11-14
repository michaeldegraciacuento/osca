<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class SeniorCitizenMortuaryApplication extends Model
{
    use HasFactory;

    protected $fillable = [
        'senior_citizen_registration_id',
        
        // OSCA ID (Original)
        'osca_id_original',
        
        // Barangay Documents
        'brgy_residency_certificate',
        'brgy_indigency',
        
        // Death Certificate
        'death_certificate',
        
        // Affidavit
        'affidavit_of_next_of_kin',
        
        // OSCA Certificate
        'osca_certificate',
        
        // Claimants Documents
        'marriage_contract',
        'birth_certificate_of_children',
        'valid_id_of_children',
        'valid_id_of_claimants',
        'waiver_authority_to_claim',
        
        // Status and Tracking
        'status',
        'notes',
        'reviewed_at',
        'reviewed_by',
    ];

    protected $casts = [
        'reviewed_at' => 'datetime',
    ];

    /**
     * Get the senior citizen registration that owns the mortuary application.
     */
    public function registration(): BelongsTo
    {
        return $this->belongsTo(SeniorCitizenRegistration::class, 'senior_citizen_registration_id');
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
            'released' => 'bg-purple-100 text-purple-800',
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
            'released' => 'Released',
            default => 'Unknown',
        };
    }
}
